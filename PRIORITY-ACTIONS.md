# Priority Actions: Allura Memory Integration

> [!NOTE]
> **AI-Assisted Documentation**
> Portions of this document were drafted with the assistance of an AI language model (GitHub Copilot).
> Content has not yet been fully reviewed — this is a working design reference, not a final specification.
> AI-generated content may contain inaccuracies or omissions.
> When in doubt, defer to the source code, JSON schemas, and team consensus.

**Date:** April 11, 2026  
**Status:** 🟡 CONDITIONAL GO  
**Reference:** [MEMORY-READINESS-ASSESSMENT.md](MEMORY-READINESS-ASSESSMENT.md)

---

## PRIORITY 1 — INTEGRATION BLOCKERS (Must Fix Before Any GO)

| # | Action | Owner | Status | Estimated Effort |
|---|--------|-------|--------|------------------|
| 1.1 | Configure MCP client in OpenAgentsControl to connect to Allura's memory server | Brooks Architect | ✅ DONE | 0.5 days |
| 1.2 | Add agent hooks: session-start calls `memory_search`, session-end calls `memory_add` | Brooks Architect | ✅ DONE | 1 day |
| 1.3 | Update Brooks agent to call Allura tools before planning (via MCP_DOCKER) | Brooks Architect | ✅ DONE | 1 day |
| 1.4 | Update Scout to use `memory_search` instead of direct PostgreSQL queries | Brooks Architect | ✅ DONE | 0.5 days |
| 1.5 | Create `.env` pointing to Allura's DATABASE_URL and NEO4J_URI | Brooks Architect | ✅ DONE | 0.5 days |
| 1.6 | Test end-to-end: Brooks → Allura → PostgreSQL/Neo4j | Brooks Architect | ❌ Not Started | 1 day |

**Total Estimated Effort:** 4.5 days  
**Completed:** 3.5 days (5 of 6 tasks)  
**Remaining:** 1 day (1 task)

---

## Key Insight

**The Allura Memory System is already production-ready.** The OpenAgentsControl Harness just needs to connect to it. This is an **integration task**, not an implementation task.

**Reference:** [Allura Memory System](../../allura%20memory/README.md)

---

## Next Steps

1. **Immediate:** Configure MCP client to connect to Allura (PRIORITY 1.1)
2. **This Week:** Complete PRIORITY 1 integration blockers
3. **Before GO:** Test end-to-end integration

---

## References

- [MEMORY-READINESS-ASSESSMENT.md](MEMORY-READINESS-ASSESSMENT.md) — Integration readiness audit
- [Allura Memory System](../../allura%20memory/README.md) — Production-ready memory system
- [UNIVERSAL_MCP_RULE.md](../../allura%20memory/UNIVERSAL_MCP_RULE.md) — MCP_DOCKER usage rules
- [AI-GUIDELINES.md](.opencode/AI-GUIDELINES.md) — Documentation standards
