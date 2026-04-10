# OpenAgentsControl Harness

> A deterministic multi-agent orchestration system for AI-powered software development

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/Charitablebusinessronin/memoryAgentsControl.svg)](https://github.com/Charitablebusinessronin/memoryAgentsControl/releases)
[![Smoke Tests](https://img.shields.io/badge/Smoke%20Tests-22%2F22%20passing-brightgreen)](./.opencode/scripts/smoke-test.sh)

---

## 🎯 What Is This?

OpenAgentsControl is a **control plane for multi-agent orchestration**. It coordinates specialized AI agents to execute software development tasks with:

- **Deterministic routing** — Tasks are routed to agents based on performance history, not random selection
- **Two execution modes** — DAY_BUILD (interactive with approval gates) and NIGHT_BUILD (no-brakes deterministic execution)
- **Continuous learning** — Performance logs drive routing decisions and agent improvement
- **Clear boundaries** — Role constraints prevent unauthorized tool usage and scope creep

This is a **fork** of [darrenhinde/OpenAgentsControl](https://github.com/darrenhinde/OpenAgentsControl) with custom agent definitions and enhanced documentation.

---

## 🚀 Quick Start

### Prerequisites

- **Bash 3.2+** (macOS, Linux, or Windows via Git Bash/WSL)
- **Git** (for cloning and version control)
- **opencode CLI** (installed automatically by the installer)

### Installation

```bash
# Clone the repository
git clone https://github.com/Charitablebusinessronin/memoryAgentsControl.git
cd memoryAgentsControl

# Run the installer
curl -fsSL https://raw.githubusercontent.com/Charitablebusinessronin/memoryAgentsControl/main/install.sh | bash
```

Or install directly from GitHub:

```bash
curl -fsSL https://raw.githubusercontent.com/Charitablebusinessronin/memoryAgentsControl/main/install.sh | bash
```

### What Gets Installed

The installer creates the following structure in your project:

```
.opencode/
├── agent/
│   ├── core/
│   │   ├── openagent.md          # Architecture, contracts, ADRs
│   │   └── opencoder.md          # Code review, refactoring, performance
│   └── subagents/
│       ├── core/
│       │   └── contextscout.md    # Discovery, file path discovery
│       └── code/
│           └── coder-agent.md     # Implementation, repairs, features
├── commands/
│   ├── day-build.md              # Interactive mode with approval gates
│   └── night-build.md           # Deterministic execution mode
├── contracts/
│   └── harness-v1.md             # Harness contract and routing table
├── scripts/
│   └── smoke-test.sh             # Validation suite (22 tests)
└── tools/
    └── (custom tools)
```

---

## 📖 Documentation Structure

| Document | Purpose |
|----------|---------|
| [**BLUEPRINT.md**](./BLUEPRINT.md) | Core concepts, requirements, architecture, execution rules |
| [**SOLUTION-ARCHITECTURE.md**](./SOLUTION-ARCHITECTURE.md) | Topological view, agent interactions, interface catalogue |
| [**DESIGN-ROUTING.md**](./DESIGN-ROUTING.md) | Routing policy, fallback logic, performance-based routing |
| [**DESIGN-LOGGING.md**](./DESIGN-LOGGING.md) | Performance logging, event types, schema design |
| [**RISKS-AND-DECISIONS.md**](./RISKS-AND-DECISIONS.md) | Architectural decisions, risks, tradeoffs |
| [**DATA-DICTIONARY.md**](./DATA-DICTIONARY.md) | Field definitions, event types, data contracts |
| [**REQUIREMENTS-MATRIX.md**](./REQUIREMENTS-MATRIX.md) | Requirements traceability matrix |
| [**AI-GUIDELINES.md**](./docs/allura-agent-os/PROJECT.md) | AI documentation standards and compliance |

---

## 🤖 Agent Roles

The harness coordinates specialized AI agents, each with defined authority and handoff rules:

### Harness Role → Fork Agent Mapping

The original harness defined 7 specialized roles. This fork maps them to 4 actual agents:

| Harness Role | Fork Agent | Authority |
|--------------|-----------|-----------|
| BROOKS_ARCHITECT | **OpenAgent** | Architecture, contracts, ADRs, final sign-off |
| JOBS_INTENT_GATE | **OpenAgent** | Intent, scope, acceptance criteria, task validation |
| SCOUT_RECON | **ContextScout** | Discovery, file path discovery, mismatch reports |
| WOZ_BUILDER | **CoderAgent** | Implementation, repairs, features, code generation |
| PIKE_INTERFACE_REVIEW | **OpenCoder** | Interface gate, simplicity, API review |
| FOWLER_REFACTOR_GATE | **OpenCoder** | Refactor gate, maintainability, code quality |
| BELLARD_DIAGNOSTICS_PERF | **OpenCoder** | Performance diagnostics, optimization |

### Why Multiple Roles Map to One Agent

The fork consolidates specialized harness roles into fewer, more capable agents:

- **OpenAgent** handles both architecture (BROOKS) and intent validation (JOBS)
- **OpenCoder** handles interface review (PIKE), refactoring (FOWLER), and performance (BELLARD)
- **ContextScout** and **CoderAgent** retain their original specialized roles

This reduces coordination overhead while preserving role boundaries through agent configuration.

### Routing Policy

Tasks are routed to agents based on:

1. **Task type** — Discovery, Implementation, Architecture, etc.
2. **Performance history** — Success rates, average duration, failure patterns
3. **Role constraints** — Authority boundaries, allowed tools
4. **Fallback logic** — Backup agents if primary fails

See [DESIGN-ROUTING.md](./DESIGN-ROUTING.md) for the full routing policy.

---

## 🔄 Execution Modes

### DAY_BUILD Mode (Interactive)

- **Approval gates** — Agent actions require human approval
- **Interactive routing** — Operator can override routing decisions
- **Debugging support** — Detailed logging for troubleshooting
- **Use case:** Development, prototyping, learning

### NIGHT_BUILD Mode (Deterministic)

- **No-brakes execution** — Agents run without approval gates
- **Performance-based routing** — Deterministic agent selection
- **Continuous learning** — Performance logs drive improvements
- **Use case:** CI/CD pipelines, production deployments

See [commands/day-build.md](./.opencode/commands/day-build.md) and [commands/night-build.md](./.opencode/commands/night-build.md) for details.

---

## 🧪 Validation

Run the smoke test suite to validate your installation:

```bash
bash .opencode/scripts/smoke-test.sh
```

**Expected output:**

```
✓ Git remote configured
✓ Documentation artifacts present (8 files)
✓ Harness contract present
✓ Events schema migration present
✓ opencode CLI available
✓ Agent definitions present (4 agents)
✓ Command definitions present (2 commands)
✓ Routing policy: ContextScout route valid
✓ Routing policy: OpenAgent route valid
✓ Routing policy: CoderAgent route valid
✓ Routing policy: OpenCoder route valid
✓ All routing policies validated
✓ All 22 smoke tests passed
```

---

## 📊 Performance Logging

All agent actions are logged to the Performance Log (PostgreSQL):

| Event Type | Description |
|------------|-------------|
| `AGENT_INVOKED` | Agent started task |
| `TASK_COMPLETE` | Task completed successfully |
| `TASK_FAILED` | Task failed with error |
| `AGENT_HANDOFF` | Agent delegated to another agent |
| `ROUTING_DECISION` | Routing policy selected agent |

See [DESIGN-LOGGING.md](./DESIGN-LOGGING.md) for the full event schema.

---

## 🏗️ Architecture

The harness is a **control plane** that coordinates specialized agents:

```
┌─────────────────────────────────────────────────────────────┐
│                    External Actors                          │
│  Developer │ CI/CD Pipeline │ Analytics Dashboard         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                OpenAgentsControl Harness                    │
│                                                             │
│  ┌──────────────┐    ┌──────────────────────────────────┐ │
│  │  REST API    │───▶│  Routing Policy Engine           │ │
│  └──────────────┘    └──────────────────────────────────┘ │
│                            │                                │
│                            ▼                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Specialized Agents                       │  │
│  │  ContextScout │ OpenAgent │ CoderAgent │ OpenCoder  │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                │
│                            ▼                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Performance Log (Postgres)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

See [SOLUTION-ARCHITECTURE.md](./SOLUTION-ARCHITECTURE.md) for the full architecture.

---

## 🛠️ Development

### Project Structure

```
.opencode/
├── agent/              # Agent definitions
├── commands/           # Execution mode commands
├── contracts/          # Harness contracts
├── scripts/            # Utility scripts
└── tools/              # Custom tools

docs/
└── allura-agent-os/
    └── PROJECT.md      # AI documentation standards

*.md                   # Architecture documentation
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run smoke tests (`bash .opencode/scripts/smoke-test.sh`)
5. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New features
- `fix:` — Bug fixes
- `docs:` — Documentation changes
- `refactor:` — Code refactoring
- `test:` — Test additions/changes
- `chore:` — Maintenance tasks

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Original Project:** [darrenhinde/OpenAgentsControl](https://github.com/darrenhinde/OpenAgentsControl)
- **Inspiration:** Frederick P. Brooks Jr.'s *The Mythical Man-Month* and *No Silver Bullet*
- **Architecture Principles:** Conceptual integrity, separation of concerns, deterministic routing

---

## 📚 References

- [BLUEPRINT.md](./BLUEPRINT.md) — Core concepts and requirements
- [SOLUTION-ARCHITECTURE.md](./SOLUTION-ARCHITECTURE.md) — System topology and interfaces
- [DESIGN-ROUTING.md](./DESIGN-ROUTING.md) — Routing policy and fallback logic
- [DESIGN-LOGGING.md](./DESIGN-LOGGING.md) — Performance logging and event schema
- [RISKS-AND-DECISIONS.md](./RISKS-AND-DECISIONS.md) — Architectural decisions and risks
- [DATA-DICTIONARY.md](./DATA-DICTIONARY.md) — Field definitions and data contracts

---

**Compact Command Menu:** `CA` Create Arch · `VA` Validate · `WS` Status · `NX` Next Steps · `CH` Chat · `MH` Menu · `DA` Exit