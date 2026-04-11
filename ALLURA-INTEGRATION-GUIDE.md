# Allura Memory Integration Guide

> [!NOTE]
> **AI-Assisted Documentation**
> Portions of this document were drafted with the assistance of an AI language model (GitHub Copilot).
> Content has not yet been fully reviewed — this is a working design reference, not a final specification.
> AI-generated content may contain inaccuracies or omissions.
> When in doubt, defer to the source code, JSON schemas, and team consensus.

**Date:** April 11, 2026  
**Status:** 🟡 Integration Ready  
**Estimated Effort:** 4.5 days

---

## Overview

This guide explains how to wire the **Allura Memory System** into the **OpenAgentsControl Harness**. Allura provides production-ready memory storage (PostgreSQL + Neo4j), and the harness needs to connect to it via MCP (Model Context Protocol).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              OpenAgentsControl Harness                      │
│                                                             │
│  ┌──────────────┐    ┌──────────────────────────────────┐  │
│  │  opencode    │───▶│  Agent Hooks (session hooks)    │  │
│  │  CLI         │    └──────────────────────────────────┘  │
│  └──────────────┘                │                          │
│                                  ▼                          │
│                    ┌──────────────────────────────────┐    │
│                    │  MCP Client Configuration       │    │
│                    │  (calls memory tools)           │    │
│                    └──────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                                  │
                                  │ MCP Protocol
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Allura Memory MCP Server                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Canonical 5 Operations                               │  │
│  │  memory_add | memory_search | memory_get             │  │
│  │  memory_list | memory_delete                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                │
│                            ▼                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Dual Database Layer                                 │  │
│  │  PostgreSQL (episodic) + Neo4j (semantic)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Start Allura Databases

```bash
cd /home/ronin704/Projects/allura\ memory
docker compose up -d
```

### 2. Run Migrations

```bash
# PostgreSQL migrations
docker exec -i knowledge-postgres psql -U ronin4life -d memory < docker/postgres-init/11-canonical-proposals.sql

# Neo4j indexes
docker exec -i knowledge-neo4j cypher-shell -u neo4j -p "$NEO4J_PASSWORD" < scripts/neo4j-memory-indexes.cypher
```

### 3. Configure Environment

```bash
cd /home/ronin704/Projects/opencode\ config
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Start MCP Server

```bash
cd /home/ronin704/Projects/allura\ memory
bun run mcp:canonical
```

### 5. Test Integration

```bash
opencode
# > memory_search({ query: "agent performance" })
```

---

## Integration Components

### 1. MCP Client Configuration

**File:** `.opencode/mcp-client-config.json`

Configures the OpenAgentsControl harness to connect to Allura's MCP server.

```json
{
  "mcpServers": {
    "allura-memory": {
      "command": "bun",
      "args": ["run", "/home/ronin704/Projects/allura memory/src/mcp/memory-server-canonical.ts"],
      "env": {
        "POSTGRES_HOST": "localhost",
        "POSTGRES_PORT": "5432",
        "POSTGRES_USER": "ronin4life",
        "POSTGRES_PASSWORD": "${POSTGRES_PASSWORD}",
        "POSTGRES_DB": "memory",
        "NEO4J_URI": "bolt://localhost:7687",
        "NEO4J_USER": "neo4j",
        "NEO4J_PASSWORD": "${NEO4J_PASSWORD}",
        "PROMOTION_MODE": "soc2",
        "AUTO_APPROVAL_THRESHOLD": "0.85"
      }
    }
  }
}
```

---

### 2. Agent Hooks

#### Session Start Hook

**File:** `.opencode/hooks/session-start.ts`

Logs session initialization to Allura:

```typescript
await memory_add({
  group_id: 'allura-system',
  user_id: agentId,
  content: `Session started: ${task}`,
  metadata: {
    source: 'agent-hook',
    event_type: 'SESSION_START',
    agent_id: agentId
  }
});
```

#### Task Complete Hook

**File:** `.opencode/hooks/task-complete.ts`

Logs task completion to Allura:

```typescript
await memory_add({
  group_id: 'allura-system',
  user_id: agentId,
  content: `Task completed: ${task}`,
  metadata: {
    source: 'agent-hook',
    event_type: 'TASK_COMPLETE',
    agent_id: agentId,
    result: result,
    confidence: confidence
  }
});
```

---

### 3. Performance Router

**File:** `.opencode/routing/performance-router.ts`

Queries Allura for agent performance history:

```typescript
const results = await memory_search({
  group_id: 'allura-system',
  query: `agent performance ${taskType}`,
  limit: 10
});

// Analyze success rates
const agentScores = analyzePerformance(results);

// Select best agent
return selectBestAgent(agentScores);
```

---

### 4. Governance Layer

**File:** `.opencode/governance/curator.ts`

Manages promotion workflow:

```typescript
// Propose promotion
await memory_add({
  group_id: 'allura-system',
  user_id: agentId,
  content: insight,
  metadata: {
    source: 'agent',
    event_type: 'PROMOTION_PROPOSED',
    confidence: 0.75  // Below threshold, requires approval
  }
});
```

---

## Memory Tools Available

All agents in the harness have access to these 5 tools:

| Tool | Purpose | Example |
|------|---------|---------|
| `memory_add` | Store memory | `memory_add({ group_id, user_id, content, metadata })` |
| `memory_search` | Search memories | `memory_search({ group_id, query, limit })` |
| `memory_get` | Retrieve specific memory | `memory_get({ memoryId })` |
| `memory_list` | List memories | `memory_list({ group_id, user_id, limit })` |
| `memory_delete` | Delete memory | `memory_delete({ memoryId })` |

---

## Tenant Isolation

**CRITICAL:** All memory operations MUST include `group_id`:

```typescript
// ✅ CORRECT
await memory_add({
  group_id: 'allura-system',  // REQUIRED
  user_id: agentId,
  content: '...'
});

// ❌ WRONG - Missing group_id
await memory_add({
  user_id: agentId,
  content: '...'
});
```

---

## Governance Workflow

### SOC2 Mode (Default)

1. Agent creates memory with confidence score
2. If confidence ≥ 0.85: queued for curator approval
3. Curator reviews in dashboard
4. Curator approves/rejects
5. If approved: promoted to Neo4j (semantic memory)

### Auto Mode

1. Agent creates memory with confidence score
2. If confidence ≥ 0.85: immediately promoted to Neo4j
3. No curator approval required

---

## Testing

### Unit Tests

```bash
bun test .opencode/hooks/session-start.ts
bun test .opencode/hooks/task-complete.ts
bun test .opencode/routing/performance-router.ts
bun test .opencode/governance/curator.ts
```

### Integration Tests

```bash
# Start Allura
cd /home/ronin704/Projects/allura\ memory
docker compose up -d

# Test MCP connection
bun run mcp:canonical

# Test from OpenAgentsControl
cd /home/ronin704/Projects/opencode\ config
opencode
# > memory_add({ group_id: 'test', user_id: 'test', content: 'test' })
# > memory_search({ group_id: 'test', query: 'test' })
```

---

## Troubleshooting

### MCP Server Not Starting

```bash
# Check if Allura databases are running
docker ps | grep knowledge

# Check logs
docker logs knowledge-postgres
docker logs knowledge-neo4j
```

### Memory Operations Failing

```bash
# Check environment variables
cat .env

# Test database connection
docker exec -it knowledge-postgres psql -U ronin4life -d memory -c "SELECT COUNT(*) FROM events;"
docker exec -it knowledge-neo4j cypher-shell -u neo4j -p "$NEO4J_PASSWORD" "MATCH (n) RETURN COUNT(n);"
```

### Tenant Isolation Errors

Ensure all memory operations include `group_id`:

```typescript
// Check that group_id is set
if (!params.group_id) {
  throw new Error('group_id is required for all memory operations');
}
```

---

## Next Steps

1. **Immediate:** Test MCP connection (PRIORITY 1.1)
2. **This Week:** Complete agent hooks integration (PRIORITY 1.2-1.4)
3. **Before GO:** Test end-to-end integration (PRIORITY 1.6)

---

## References

- [Allura Memory System](../../allura%20memory/README.md) — Production-ready memory system
- [UNIVERSAL_MCP_RULE.md](../../allura%20memory/UNIVERSAL_MCP_RULE.md) — MCP_DOCKER usage rules
- [MEMORY-READINESS-ASSESSMENT.md](MEMORY-READINESS-ASSESSMENT.md) — Integration readiness audit
- [PRIORITY-ACTIONS.md](PRIORITY-ACTIONS.md) — Integration checklist