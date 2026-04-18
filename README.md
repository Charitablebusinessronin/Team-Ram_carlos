# Team RAM OpenCode Harness

This repo is a coding setup for OpenCode.

It gives you:

- Team RAM agents
- commands for coding work
- skills for repeat jobs
- tool loading with approval
- optional memory with Allura Brain

This repo is **not** the Allura app. It is the harness that helps you work on any coding project.

---

## What This Is

This harness helps with common software work:

- planning
- building
- reviewing code
- debugging
- using outside tools
- saving useful notes from past work

The goal is to make coding work clear, repeatable, and easy to move to other repos.

---

## Core Ideas

- Keep things simple.
- Make small, safe changes.
- Use the right agent for the job.
- Check facts before acting.
- Load outside tools on purpose.
- Use memory as help, not as boss.
- Keep the harness easy to reuse.

---

## Team RAM Roles

| Agent | Main job |
| --- | --- |
| **Brooks** | Architecture and big-picture planning |
| **Jobs** | Scope, goals, and task shape |
| **Woz** | Building the code |
| **Scout** | Finding files and patterns |
| **Pike** | Keeping interfaces simple |
| **Fowler** | Safe refactors |
| **Bellard** | Deep debugging |
| **Carmack** | Speed and performance |
| **Knuth** | Data and schema work |
| **Hightower** | Infra and deployment |

You can edit these roles in `.opencode/agent/`.

---

## Model Setup

This harness uses the model set in the live agent files.

- each agent file can name its own model
- the model helps shape how that agent thinks and works
- Brooks may use a model tuned for planning
- Woz may use a model tuned for building
- Scout may use a model tuned for fast reading and lookup

The main rule is simple:

- the **agent role** comes first
- the **model** supports that role
- if the model changes, the role should still stay clear

See `.opencode/MODEL_REGISTRY.md` and the frontmatter in `.opencode/agent/*.md`.

---

## Subagent System

This harness works like a small team.

You do not use one giant agent for everything.
You use a lead plus specialists.

### How it works

1. A task starts with intent or planning.
2. The harness picks the right Team RAM role.
3. A specialist agent does that part of the job.
4. If needed, another specialist is called next.
5. The work is checked and kept small.

### Simple example

- **Jobs** helps define the goal
- **Scout** finds the right files
- **Brooks** sets the architecture if needed
- **Woz** writes the code
- **Pike** reviews interfaces
- **Fowler** checks refactor safety
- **Bellard** helps if the bug is deep

This makes the system easier to understand.
Each agent has one main job.

---

## Harness Layout

Most of the harness lives in `.opencode/`:

```text
.opencode/
├── agent/         # agent files
├── command/       # command workflows
├── skills/        # reusable skills
├── config/        # harness settings
├── context/       # project context
├── contracts/     # rules and contracts
├── governance/    # approval helpers
├── routing/       # routing logic
├── tool/          # tool integrations
├── templates/     # templates
├── README.md
└── HARNESS-GUIDE.md
```

---

## Main Commands

Commands are the main ways you tell the harness what kind of work you want.

Think of a command as a named workflow.
It tells the harness:

- what kind of job this is
- what steps should happen
- which agent or helper should be used
- whether memory, tools, or checks should be involved

### Session work

- `start-session` — start work and load context
- `end-session` — finish work and save a summary
- `harness-status` — check harness health
- `query` — search memory
- `update` — save a short progress note

### Planning work

- `task` — make or shape a task
- `orchestrate` — manage multi-step work
- `architect` — plan structure and contracts
- `define-goal` — make the goal clear
- `party` — ask many specialists to help

### Build and fix work

- `debug` — troubleshoot a problem
- `test` — run or plan checks
- `commit` — help with commits
- `analyze-patterns` — inspect patterns in the repo
- `validate-repo` — check repo setup
- `clean` / `optimize` — clean up or speed up code

### Skills and outside tools

- `skill-propose` / `skill-load` — inspect and run skills
- `mcp-discover` / `mcp-approve` / `mcp-load` — find, approve, and load MCP tools

More details live in `.opencode/command/`.

### How commands work

1. You run a command.
2. The harness reads that command file.
3. The command gives the harness a job pattern.
4. The right Team RAM agent or helper is used.
5. The work is done in a more repeatable way.

Commands help stop random one-off prompting.
They turn common work into a repeatable system.

### Live command set

Current command files include:

- `start-session`
- `end-session`
- `harness-status`
- `dashboard`
- `query`
- `update`
- `task`
- `define-goal`
- `orchestrate`
- `architect`
- `analyst`
- `scout`
- `party`
- `debug`
- `test`
- `commit`
- `clean`
- `optimize`
- `analyze-patterns`
- `validate-repo`
- `context`
- `add-context`
- `skill-propose`
- `skill-load`
- `mcp-discover`
- `mcp-approve`
- `mcp-load`
- `curator-team-promote`
- `scribe`
- `quickprompt`
- `quick-commands`
- `run-day`
- `run-night`
- `ralph`

---

## Skills

This harness includes skills for jobs like:

- code review
- debugging
- task setup
- docs lookup
- research
- memory use
- quick updates

Skills live in `.opencode/skills/`.

### How skills work

A skill is a reusable playbook.

It gives the harness:

- a clear use case
- steps to follow
- rules for using tools
- examples or reference notes

Skills are good for repeat jobs that need the same pattern each time.

### Simple difference between commands and skills

- **Commands** start a workflow
- **Skills** teach the workflow how to be done well

In simple terms:

- command = "start this kind of job"
- skill = "here is the best way to do that job"

### Example

- `/review` or `skill-load code-review`
- the command starts the review flow
- the skill gives the review method, checks, and rules

### Why both exist

Using both gives you:

- less guessing
- more repeatable work
- clearer role handoff
- safer use of tools
- better quality over time

### Live skill set

Current skill folders include:

- `code-review`
- `context7`
- `github`
- `mcp-builder`
- `mcp-docker`
- `mcp-docker-memory-system`
- `mcp-harness`
- `memory-client`
- `multi-search`
- `party-mode`
- `quick-update`
- `readme-memory`
- `skill-creator`
- `superpowers-memory`
- `systematic-debugging-memory`
- `task-creator`
- `task-management`
- `trailofbits-audit`
- `next-best-practices`
- `postgres-best-practices`
- `hitl-governance`
- `bun-security`
- `security-bluebook-builder`
- `varlock`
- `allura-menu`

---

## Allura Brain Memory

Allura Brain is optional.

You can use it to:

- load recent work when a session starts
- find old fixes and decisions
- remember patterns that worked before
- save short notes about progress and results

Important:

- memory helps, but it is not the source of truth
- the current code, tests, and user request matter most
- this harness should stay generic, even when memory is turned on

## How Allura Brain Fits In

Allura Brain works like shared memory for the harness.

It helps the subagent system by:

- giving session context at the start
- showing old decisions before new work starts
- saving useful notes after work is done
- helping different agents see the same past context

### Simple flow

1. A session starts.
2. The harness checks memory if it is enabled.
3. Agents read useful past context.
4. The task is planned and built.
5. Important results can be written back to memory.

That means Allura Brain does **not** replace the agents.
It helps the agents remember.

### Good uses for Allura Brain

- remember past bugs
- remember design choices
- remember blockers
- remember what was finished last session

### Bad use

- treating memory like a command that overrules the code or the user

Useful files:

- [ALLURA-INTEGRATION-GUIDE.md](./ALLURA-INTEGRATION-GUIDE.md)
- [.opencode/HARNESS-GUIDE.md](./.opencode/HARNESS-GUIDE.md)

---

## Use It in Any Repo

To use this harness in another project:

1. Copy the `.opencode/` folder.
2. Change the context files for the new repo.
3. Keep or edit the Team RAM agents.
4. Remove commands you do not need.
5. Keep Allura Brain only if you want memory.
6. Add project skills after the base harness is working.

One harness should have one clear way of working.

---

## Quick Check

After setup, make sure:

- the right agents are in `.opencode/agent/`
- the commands match real work you want to do
- the skills are still useful
- memory is clearly optional
- old project-specific wording is gone
- file links and paths are real

---

## Related Files

- [`.opencode/README.md`](./.opencode/README.md)
- [`.opencode/HARNESS-GUIDE.md`](./.opencode/HARNESS-GUIDE.md)
- [`ALLURA-INTEGRATION-GUIDE.md`](./ALLURA-INTEGRATION-GUIDE.md)
- [`PRIORITY-ACTIONS.md`](./PRIORITY-ACTIONS.md)

---

## Final Note

This repo should read as a **Team RAM OpenCode Harness** first.

Allura Brain is here to help the harness remember useful coding context. It should not define the whole harness.
