---
name: mcp-harness
description: "Plugin orchestration harness for MCP servers and agent skills. Explicit approval flow, surgical team delegation, append-only audit trail. No auto-loading. Brooks approves before tools load."
version: 1.0.0
author: allura
type: skill
category: infrastructure
tags:
  - mcp
  - orchestration
  - approval
  - audit
  - delegation
  - harness
---

# MCP Plugin Harness

> **The foreman decides which tools belong on the job site. No tool loads without approval. No specialist picks up a tool they weren't assigned. Every decision is logged.**

---

## Principles

1. **Explicit Approval** — No auto-discovery. Brooks (brooks-architect) approves before any MCP server or skill loads.
2. **Surgical Team Delegation** — Skills are routed to the specialist best suited to execute them. Not every programmer uses every tool.
3. **Manual Curation** — The registry is a JSON file maintained by hand. No auto-fetch from external sources.
4. **Append-Only Audit** — Every MCP_APPROVED, MCP_LOADED, SKILL_PROPOSED, SKILL_LOADED event is logged to PostgreSQL via Allura. Immutable event trail.
5. **Graceful Degradation** — If a system is unavailable, the harness degrades to console warnings. No crashes. The tar pit is deep enough without adding our own holes.

---

## Architecture

```
User Request
    │
    ▼
┌─────────────────────────────┐
│   BROOKS (Approval Gate)    │
│                             │
│   /mcp-discover → list     │
│   /mcp-approve  → approve  │
│   /mcp-load     → activate │
│   /skill-propose → propose │
│   /skill-load   → delegate │
│                             │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│   ALLURA MEMORY (Audit)     │
│                             │
│   events table:             │
│   - MCP_APPROVED            │
│   - MCP_LOADED              │
│   - MCP_UNLOADED            │
│   - SKILL_PROPOSED          │
│   - SKILL_LOADED            │
│   - SKILL_EXECUTED          │
│                             │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│   SURGICAL TEAM (Execution) │
│                             │
│   Woz   → implementation    │
│   Pike  → interface review  │
│   Fowler → refactoring     │
│   Bellard → performance    │
│   Scout → recon            │
│   Jobs  → intent gate      │
│                             │
└─────────────────────────────┘
```

---

## Command Reference

### `/mcp-discover` — List Available Servers

```bash
/mcp-discover [filter]
```

Lists all MCP servers configured in `mcp-client-config.json`, showing:
- Server name
- Status: `approved`, `pending`, or `loaded`
- Available tools (if loaded)
- Connection health

**Filter options:**
- No argument — list all servers
- `database` — list database-related servers
- `approved` — list only approved servers
- `pending` — list only pending (not yet approved) servers

**Audit:** Logs `MCP_DISCOVER` event to Allura.

---

### `/mcp-approve <server-name>` — Approve an MCP Server

```bash
/mcp-approve allura-memory
```

Approves an MCP server for use. **Brooks must explicitly approve before any server is loaded.**

**Steps:**
1. Verify server exists in `mcp-client-config.json`
2. Log `MCP_APPROVED` event to Allura (agent: brooks-architect, confidence: 0.95)
3. Add server to approved registry in `mcp-approved-servers.json`
4. Display confirmation with server details

**Approval criteria (Brooks assesses):**
- Does this server solve an essential problem or an accidental one?
- Does its interface have minimal surface area?
- Does it preserve conceptual integrity with existing tools?
- Is there already an approved server that overlaps its capability?

**Audit:** Logs `MCP_APPROVED` event. Cannot be undone (append-only).

---

### `/mcp-load <server-name>` — Activate an MCP Server

```bash
/mcp-load allura-memory
```

Loads an approved MCP server, making its tools available.

**Steps:**
1. Check approval status — if not approved, halt with message directing to `/mcp-approve`
2. Log `MCP_LOADED` event to Allura
3. Display available tools for the loaded server
4. Server tools become available for delegation

**Audit:** Logs `MCP_LOADED` event. Tools are now in the active toolset.

---

### `/skill-propose <skill-name>` — Propose a Skill for Loading

```bash
/skill-propose context7
/skill-propose task-management
```

Shows skill details and proposes which specialist should execute it.

**Steps:**
1. Read skill's `SKILL.md` from `.opencode/skills/<skill>/`
2. Determine preferred executor based on skill category:

| Skill Category | Preferred Executor | Rationale |
|---|---|---|
| `infrastructure` | brooks-architect | Architecture decisions |
| `development` | woz-builder | Implementation |
| `context` | scout-recon | Information gathering |
| `review` | pike-interface-review | Interface assessment |
| `refactor` | fowler-refactor-gate | Maintainability |
| `performance` | bellard-diagnostics-perf | Measurement |
| `documentation` | fowler-refactor-gate | Design drift tracking |

3. Log `SKILL_PROPOSED` event to Allura
4. Display skill details, preferred executor, and approval prompt

**Audit:** Logs `SKILL_PROPOSED` event.

---

### `/skill-load <skill-name> [--executor <agent>]` — Load and Delegate a Skill

```bash
/skill-load context7 --executor scout-recon
/skill-load task-management --executor woz-builder
```

Loads a skill and assigns it to an executor agent.

**Steps:**
1. Verify skill exists in `.opencode/skills/<name>/SKILL.md`
2. If `--executor` specified, validate agent ID against registry
3. If no `--executor`, use preferred executor from skill metadata
4. Log `SKILL_LOADED` event to Allura with executor assignment
5. Display loaded skill details and assigned executor

**Audit:** Logs `SKILL_LOADED` event with executor assignment.

---

## Event Schema (Allura Memory)

All harness events are logged to the `events` table via Allura Memory hooks:

```sql
-- Existing events table (from migrations/001-events-schema.sql)
-- Additional event types:

-- MCP Events
'MCP_DISCOVER'        -- Server discovery listing
'MCP_APPROVED'         -- Server approved by Brooks
'MCP_LOADED'          -- Server tools activated
'MCP_UNLOADED'        -- Server tools deactivated
'MCP_HEALTH_CHECK'    -- Server health probe result

-- Skill Events
'SKILL_PROPOSED'      -- Skill proposed for loading
'SKILL_LOADED'        -- Skill loaded and executor assigned
'SKILL_EXECUTED'      -- Skill execution completed
'SKILL_FAILED'        -- Skill execution failed
```

**Metadata format:**
```json
{
  "source": "mcp-harness",
  "event_type": "MCP_APPROVED",
  "server_name": "allura-memory",
  "approved_by": "brooks-architect",
  "tools_available": ["memory_add", "memory_search", "memory_get"],
  "timestamp": "2026-04-11T..."
}
```

---

## Approved Servers Registry

File: `.opencode/mcp-approved-servers.json`

```json
{
  "schema_version": "1.0.0",
  "approved_by": "brooks-architect",
  "last_updated": "2026-04-11T...",
  "servers": {
    "allura-memory": {
      "status": "approved",
      "approved_at": "2026-04-11T...",
      "approved_by": "brooks-architect",
      "tools": ["memory_add", "memory_search", "memory_get", "memory_list", "memory_delete"],
      "category": "database",
      "essential": true,
      "rationale": "Core memory system for episodic and semantic storage. Required for all harness operations."
    }
  }
}
```

---

## Skill Registry

File: `.opencode/skills/mcp-harness/skill-registry.json`

```json
{
  "schema_version": "1.0.0",
  "skills": {
    "context7": {
      "status": "proposed",
      "category": "context",
      "preferred_executor": "scout-recon",
      "description": "Retrieve up-to-date documentation for software libraries via Context7 API",
      "tools_required": ["bash"],
      "approved_by": null,
      "loaded_at": null
    },
    "task-management": {
      "status": "proposed",
      "category": "development",
      "preferred_executor": "woz-builder",
      "description": "Track and manage feature subtasks with status, dependencies, and validation",
      "tools_required": ["bash"],
      "approved_by": null,
      "loaded_at": null
    },
    "mcp-harness": {
      "status": "approved",
      "category": "infrastructure",
      "preferred_executor": "brooks-architect",
      "description": "Plugin orchestration harness. Explicit approval, surgical delegation, append-only audit.",
      "tools_required": ["MCP_DOCKER_notion-search", "MCP_DOCKER_notion-create-pages", "bash"],
      "approved_by": "brooks-architect",
      "loaded_at": "2026-04-11T..."
    }
  }
}
```

---

## Integration with Existing Harness

### With DAY_BUILD Mode

The MCP harness integrates into the DAY_BUILD execution flow:

```
Step 2: Scout recon
  → /mcp-discover (list available servers)
  → /mcp-approve <needed-servers> (Brooks approves)

Step 5: Brooks ADRs
  → /skill-propose <needed-skills> (Brooks proposes)
  → /skill-load <skill> --executor <agent> (Brooks assigns)

Step 7: Woz implementation
  → Uses approved MCP servers and loaded skills
```

### With NIGHT_BUILD Mode

The MCP harness auto-proposes based on task type:

```
Step 2: Scout recon
  → /mcp-discover (auto-check available servers)
  → Pre-approved servers: allura-memory (always)
  → If skill needed: /skill-propose + /skill-load (no manual approval)

Step 4: Brooks route
  → Auto-approves pre-categorized servers
  → Only stops for NEW servers not in approved registry
```

### With Allura Memory Health Check

The `/mcp-discover` command includes health check integration:

```typescript
// From session-start.ts MemoryStackHealth
import { onSessionStart } from './hooks/session-start';

const health = await onSessionStart({ agentId: 'mcp-harness', task: 'discover' });
if (health.overall === 'degraded' || health.overall === 'unreachable') {
  // Harness operates in degraded mode
  // Console warnings already emitted by health check
}
```

---

## Use Cases

### Enterprise: Bank Lending

Loan officers process 100+ applications daily. AI needs to remember borrower history, regulatory flags, past decisions.

- Traces → episodic (automatic audit via Allura `events` table)
- High-confidence facts → curator approves → Neo4j semantic layer
- Next query: *"What do we know about this borrower type?"*
- Audit log satisfies regulatory review (append-only `MCP_APPROVED`, `SKILL_LOADED` events)

### Enterprise: HACCP Food Safety

Manufacturers need AI to remember hazard patterns, corrective actions, non-conformance history.

- Audit → episodic event in Allura
- Hazard patterns → curator approves → semantic promotion
- CSV export proves compliance

### Consumer: Developer Session Memory

Sessions end. Next session, AI has no memory.

- During session → episodic traces via `TASK_COMPLETE`, `SESSION_START` events
- User promotes key facts → `ADR_CREATED` with confidence ≥ 0.85
- Next session → `scoutPreTaskQuery` loads context automatically

---

## Never Do This

❌ Auto-load MCP servers without Brooks approval  
❌ Auto-fetch skills from external sources  
❌ Skip the audit log  
❌ Allow any agent to approve their own tools  
❌ Crash if a server is unavailable — degrade gracefully  

## Always Do This

✅ Brooks approves before tools load  
✅ Log every MCP_APPROVED, MCP_LOADED, SKILL_PROPOSED, SKILL_LOADED event  
✅ Route skills to the specialist best suited for the category  
✅ Health-check memory stack before operations  
✅ Degrade gracefully with console warnings when systems are unavailable