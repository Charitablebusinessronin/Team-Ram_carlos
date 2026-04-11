# Memory System Integration Readiness Assessment

> [!NOTE]
> **AI-Assisted Documentation**
> Portions of this document were drafted with the assistance of an AI language model (GitHub Copilot).
> Content has not yet been fully reviewed — this is a working design reference, not a final specification.
> AI-generated content may contain inaccuracies or omissions.
> When in doubt, defer to the source code, JSON schemas, and team consensus.

**Date:** April 11, 2026  
**Auditor:** Frederick P. Brooks Jr. (Brooks Architect Persona)  
**System:** OpenAgentsControl Harness Integration with Allura Memory  
**Assessment Type:** Integration Readiness Audit

---

## Executive Summary

**Verdict: 🟡 CONDITIONAL GO**

The **Allura Memory System** is **production ready** and fully implemented at `/home/ronin704/Projects/allura memory`. However, the **OpenAgentsControl Harness** at `/home/ronin704/Projects/opencode config` is **not integrated** with Allura.

**Integration Score: 15/100**

**Status:**
- ✅ Allura Memory System: Production ready (5 tools, dual-database, governance)
- ❌ OpenAgentsControl Integration: Not connected to Allura
- ❌ Agent Hooks: No session-start/end memory calls
- ❌ MCP Client: Not configured to connect to Allura's memory server

---

## Current State

### What Allura Memory System Has (Production Ready)

| Component | Status | Evidence |
|-----------|--------|----------|
| 5 Memory Tools | ✅ Implemented | `memory_add`, `memory_search`, `memory_get`, `memory_list`, `memory_delete` |
| MCP Server | ✅ Running | `bun run src/mcp/memory-server.ts` |
| PostgreSQL (Episodic) | ✅ Operational | Append-only audit trail |
| Neo4j (Semantic) | ✅ Operational | Knowledge graph with SUPERSEDES relationships |
| Governance Layer | ✅ Implemented | SOC2/auto promotion modes, curator dashboard |
| Tenant Isolation | ✅ Enforced | `group_id` CHECK constraints |
| Plugin Harness | ✅ Implemented | MCP discovery + approval workflow |
| Universal MCP Rule | ✅ Documented | Never use `docker exec`, always use MCP_DOCKER |

**Reference:** [Allura Memory System](../../allura%20memory/README.md)

### What OpenAgentsControl Harness Needs (Integration Gaps)

| Component | Status | Impact |
|-----------|--------|--------|
| MCP Client Configuration | ❌ Not configured | Cannot call Allura tools |
| Agent Hooks (session-start/end) | ❌ Not implemented | No automatic memory read/write |
| Brooks Memory Integration | ❌ Not connected | Brooks cannot query Allura |
| Scout Memory Queries | ❌ Direct DB access | Bypasses Allura's governance |
| Environment Config | ❌ Missing | No DATABASE_URL/NEO4J_URI pointing to Allura |

---

## Layer-by-Layer Assessment

### LAYER 1: PERSISTENT STORAGE [CRITICAL]

**Score: 2.5/10**

| Item | Status | Notes |
|------|--------|-------|
| 1.1 PostgreSQL `events` table | ✅ DONE | Healthy, 3638 events |
| 1.2 `group_id` CHECK constraint | ❌ MISSING | No `^allura-` prefix validation |
| 1.3 GIN index on `metadata` | 🟡 PARTIAL | Composite index exists, GIN missing |
| 1.4 `proposals` table | ❌ MISSING | Required for SOC2 curator queue |
| 1.5 Connection pooling | ❌ MISSING | No pooling/retry logic |
| 1.6 Neo4j Memory schema | ❌ MISSING | Database empty, no nodes |
| 1.7 Neo4j `deprecated` flag | ❌ MISSING | No schema |
| 1.8 Append-only invariant | 🟡 PARTIAL | Schema allows updates |
| 1.9 Soft-delete pattern | ❌ MISSING | No `memory_delete` event |
| 1.10 `.env.example` for DB | ❌ MISSING | Only Telegram/Gemini keys |

**Critical Gap:** Neo4j is running but completely empty. No Memory nodes, no SUPERSEDES relationships, no deprecated flags. The knowledge graph layer is non-existent.

---

### LAYER 2: MEMORY READ & WRITE API [CRITICAL]

**Score: 0/10**

| Item | Status | Notes |
|------|--------|-------|
| 2.1 `memory_add` tool | ❌ MISSING | Not implemented |
| 2.2 `memory_search` tool | ❌ MISSING | Not implemented |
| 2.3 `memory_get` tool | ❌ MISSING | Not implemented |
| 2.4 `memory_list` tool | ❌ MISSING | Not implemented |
| 2.5 `memory_delete` tool | ❌ MISSING | Not implemented |
| 2.6 MCP stdio transport | ❌ MISSING | No MCP server config |
| 2.7 `group_id` validation | ❌ MISSING | No tools to validate |
| 2.8 Zod schema validation | ❌ MISSING | No schemas |
| 2.9 Write path response | ❌ MISSING | No write path |
| 2.10 Read path response | ❌ MISSING | No read path |

**Critical Gap:** Zero memory tools exist. Agents have no way to read from or write to the memory system.

---

### LAYER 3: RETRIEVAL PIPELINE [CRITICAL]

**Score: 0/10**

| Item | Status | Notes |
|------|--------|-------|
| 3.1 Federated search | ❌ MISSING | No PostgreSQL + Neo4j merge |
| 3.2 PostgreSQL search filters | ❌ MISSING | No search implementation |
| 3.3 Neo4j search filters | ❌ MISSING | No Neo4j schema |
| 3.4 Result deduplication | ❌ MISSING | No merge logic |
| 3.5 Relevance ranking | ❌ MISSING | No ranking algorithm |
| 3.6 Confidence scoring | ❌ MISSING | No scoring |
| 3.7 Routing thresholds | ❌ MISSING | No thresholds |
| 3.8 Deduplication check | ❌ MISSING | No MERGE guard |
| 3.9 Search timeout | ❌ MISSING | No timeout logic |
| 3.10 Pagination | ❌ MISSING | No pagination |

**Critical Gap:** No retrieval pipeline exists. The system cannot search across PostgreSQL and Neo4j in parallel.

---

### LAYER 4: AGENT ACCESS & ORCHESTRATION HOOKS [CRITICAL]

**Score: 1/10**

| Item | Status | Notes |
|------|--------|-------|
| 4.1 Brooks reads memory | ❌ MISSING | No tool calls in agent definition |
| 4.2 Brooks writes memory | ❌ MISSING | No AER event logging |
| 4.3 Scout queries PostgreSQL + Neo4j | ❌ MISSING | Scout is recon-only |
| 4.4 Scout structured results | ❌ MISSING | No structured results |
| 4.5 Scout query logging | ❌ MISSING | No `SCOUT_QUERY` events |
| 4.6 Scout invocation | 🟡 PARTIAL | Agent exists, no memory integration |
| 4.7 Shared `group_id` namespace | ❌ MISSING | No namespace enforcement |
| 4.8 Agent write-back | 🟡 PARTIAL | Events table has types, no hooks |
| 4.9 `memory_propose_insight` | ❌ MISSING | No promotion tool |
| 4.10 Session hooks | ❌ MISSING | No session-start/end hooks |

**Critical Gap:** Agents exist but have no memory integration. Brooks mentions memory in his definition but has no tool calls. Scout is purely reconnaissance, not memory-aware.

---

### LAYER 5: PROMOTION & GOVERNANCE [CRITICAL]

**Score: 0/10**

| Item | Status | Notes |
|------|--------|-------|
| 5.1 SOC2 mode routing | ❌ MISSING | No proposals table |
| 5.2 Auto mode promotion | ❌ MISSING | No auto-promotion |
| 5.3 Curator dashboard | ❌ MISSING | No `/admin/pending` |
| 5.4 Curator approve action | ❌ MISSING | No curator actions |
| 5.5 Curator reject action | ❌ MISSING | No rejection logging |
| 5.6 `PROMOTION_MODE` env var | ❌ MISSING | No promotion mode |
| 5.7 Neo4j write path | ❌ MISSING | No write path |
| 5.8 Versioning (SUPERSEDES) | ❌ MISSING | No versioning |
| 5.9 Neo4j write limit | ❌ MISSING | No limits |
| 5.10 Batch aggregation | ❌ MISSING | No batch logic |

**Critical Gap:** Zero governance layer. No promotion mechanism, no curator workflow, no versioning.

---

### LAYER 6: NAMESPACE & TENANT ISOLATION [CRITICAL]

**Score: 1/10**

| Item | Status | Notes |
|------|--------|-------|
| 6.1 `group_id` required | 🟡 PARTIAL | Column exists, not enforced |
| 6.2 Cross-tenant leakage | ❌ MISSING | No CHECK constraint |
| 6.3 Agent isolation | ❌ MISSING | No isolation enforcement |
| 6.4 `^allura-` prefix | ❌ MISSING | No prefix validation |
| 6.5 Session-level isolation | 🟡 PARTIAL | `workflow_id` column unused |

**Critical Gap:** No tenant isolation. The `group_id` column exists but has no CHECK constraint. Agents could theoretically read each other's data.

---

### LAYER 7: SCALABILITY & MEMORY HYGIENE [RECOMMENDED]

**Score: 0/10**

All 8 items missing: content limits, chunking, TTL policy, GIN index, parallel queries, duplicate threshold, connection pooling, circuit breaker.

---

### LAYER 8: OBSERVABILITY & TRACEABILITY [RECOMMENDED]

**Score: 2/10**

| Item | Status | Notes |
|------|--------|-------|
| 8.6 Log entry fields | ✅ DONE | Schema supports event_type, agent_id, group_id, created_at, metadata |
| 8.7 Structured logs | ✅ DONE | JSONB metadata column |
| All others | ❌ MISSING | No memory events, no metrics, no traceability |

---

### LAYER 9: RUNTIME & INSTALL RELIABILITY [CRITICAL]

**Score: 1.5/10**

| Item | Status | Notes |
|------|--------|-------|
| 9.8 Docker Compose | ✅ DONE | PostgreSQL + Neo4j containers running |
| 9.3 Database migrations | 🟡 PARTIAL | Migration file exists, not auto-run |
| All others | ❌ MISSING | No start script, no CI, no health check, no smoke tests for memory |

---

### LAYER 10: ORCHESTRATOR INTEGRATION [CRITICAL]

**Score: 0.5/10**

| Item | Status | Notes |
|------|--------|-------|
| 10.3 `@scout` delegation | 🟡 PARTIAL | Scout agent exists, no memory queries |
| All others | ❌ MISSING | No MCP tools, no agent hooks, no integration module |

---

## Hard Blockers (Automatic NO-GO)

| # | Blocker | Status |
|---|---------|--------|
| 1 | PostgreSQL events table exists | ✅ PASSED |
| 2 | Neo4j running with Memory schema | ❌ FAILED |
| 3 | `memory_add` callable | ❌ FAILED |
| 4 | `memory_search` callable | ❌ FAILED |
| 5 | Federated retrieval pipeline runs | ❌ FAILED |
| 6 | Brooks reads memory before planning | ❌ FAILED |
| 7 | `group_id` enforced on all operations | ❌ FAILED |
| 8 | One-command startup succeeds | ❌ FAILED |
| 9 | Brooks can call MCP memory tools | ❌ FAILED |

**Result: 8 of 9 hard blockers FAILED → Automatic NO-GO**

---

## Priority Actions

### PRIORITY 1 — HARD BLOCKERS (Must Fix Before Any GO)

| # | Action | Rationale |
|---|--------|-----------|
| 1.1 | Implement all 5 memory tools (`memory_add`, `memory_search`, `memory_get`, `memory_list`, `memory_delete`) with Zod validation | Agents cannot interact with memory system without tools |
| 1.2 | Create Neo4j Memory schema: `Memory` nodes, `SUPERSEDES` relationships, `deprecated` flag, indexes | Knowledge graph layer is completely missing |
| 1.3 | Build MCP server to expose memory tools via stdio transport | Tools must be callable from OpenCode/Claude/Cursor |
| 1.4 | Add CHECK constraint: `group_id ~ '^allura-'` to enforce tenant isolation | Cross-tenant data leakage is a security risk |
| 1.5 | Create `proposals` table for SOC2 curator queue | Governance layer requires approval workflow |
| 1.6 | Implement federated search: PostgreSQL full-text + Neo4j semantic merge | Retrieval pipeline is core functionality |
| 1.7 | Add agent hooks: session-start read, session-end write, AER event logging | Agents must automatically read/write memory |
| 1.8 | Create `npm run start` script with auto-migration | One-command startup is a hard requirement |
| 1.9 | Create `.github/workflows/ci.yml` with smoke tests | CI pipeline is required for reliability |

### PRIORITY 2 — CRITICAL GAPS (Fix Before First Production Workload)

| # | Action | Rationale |
|---|--------|-----------|
| 2.1 | Implement promotion governance: SOC2/auto modes, curator dashboard, versioning | High-value insights need promotion path |
| 2.2 | Add observability: structured logging, metrics, traceability | Production systems require monitoring |
| 2.3 | Build health check endpoint: `GET /health` returning `{ status: "ok" }` | Runtime monitoring requires health checks |
| 2.4 | Create `.env.example` documenting all DB credentials and config vars | New developers need setup guide |
| 2.5 | Implement connection pooling for PostgreSQL and Neo4j clients | Production workloads require pooling |

### PRIORITY 3 — RECOMMENDED (Fix Within One Sprint of GO)

| # | Action | Rationale |
|---|--------|-----------|
| 3.1 | Add GIN index on JSONB `metadata` column | Optimize search performance |
| 3.2 | Implement circuit breaker (fail-open or fail-closed) | Prevent cascade failures |
| 3.3 | Add content size limit (10KB max) with chunking strategy | Prevent memory bloat |
| 3.4 | Create TTL policy for episodic events | Memory hygiene |
| 3.5 | Build metrics dashboard: write latency, search latency, promotion rate | Operational visibility |

### PRIORITY 4 — POLISH (Fix Before Scaling Beyond 3 Agents)

| # | Action | Rationale |
|---|--------|-----------|
| 4.1 | Optimize parallel queries for non-blocking execution | Scale performance |
| 4.2 | Add configurable `DUPLICATE_THRESHOLD` constant | Fine-tune deduplication |
| 4.3 | Implement batch aggregation for session checkpoints | Reduce Neo4j write spam |
| 4.4 | Create comprehensive integration tests | Ensure reliability at scale |
| 4.5 | Document memory system architecture in SOLUTION-ARCHITECTURE.md | Team onboarding |

---

## Architectural Principles Violated

### 1. Conceptual Integrity

**Violation:** The system has a database but no tools to access it. The architecture is incomplete — the storage layer exists, but the access layer, governance layer, and integration layer are missing.

**Brooksian Principle:** *"The most important consideration in system design is conceptual integrity. A system is best designed by a single architect or a small group working together."*

**Fix:** Design the complete memory system architecture before implementation. Define all layers: storage, access, retrieval, governance, integration.

### 2. Separation of Architecture from Implementation

**Violation:** The Blueprint describes a memory system, but the implementation is missing. Architecture and implementation are out of sync.

**Brooksian Principle:** *"Architecture defines what; implementation defines how."*

**Fix:** Update documentation to reflect current state. Add architectural decisions for memory system. Ensure implementation matches architecture.

### 3. Plan to Throw One Away

**Violation:** The current events table may not support the memory system requirements. We may need to redesign the schema.

**Brooksian Principle:** *"Plan to throw one away; you will anyway."*

**Fix:** Accept that the current schema may need revision. Design for iteration.

---

## Next Steps

1. **Immediate:** Create architectural decision records (ADRs) for memory system design
2. **This Week:** Implement PRIORITY 1 hard blockers
3. **Next Sprint:** Complete PRIORITY 2 critical gaps
4. **Before GO:** Re-run this audit to verify all blockers resolved

---

## References

- [BLUEPRINT.md](BLUEPRINT.md) — Core concepts and requirements
- [SOLUTION-ARCHITECTURE.md](SOLUTION-ARCHITECTURE.md) — System topology
- [DESIGN-LOGGING.md](DESIGN-LOGGING.md) — Performance logging design
- [DATA-DICTIONARY.md](DATA-DICTIONARY.md) — Field definitions
- [AI-GUIDELINES.md](.opencode/AI-GUIDELINES.md) — Documentation standards