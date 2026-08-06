# claudewar / projects

Each project the auto-machine builds lives here as its own folder.

## New project
1. Copy `_TEMPLATE/` → `projects/<project-name>/`.
2. Fill `PROJECT_OPERATING_PROMPT.md` placeholders (goal, type, ship gate, grounding signal, rails, phase ladder).
3. Initialize `STATUS.md` (= single source of truth + resume anchor).
4. Point a fresh Claude Code session at the folder, paste the operating prompt → it runs the standing loops (self-improve + non-stop-until-ship) to SHIP.

## Structure per project
```
<project-name>/
  PROJECT_OPERATING_PROMPT.md   # the build driver (loops baked in)
  STATUS.md                     # SoT + resume anchor
  ...build artifacts...
```

## Rule
The operating prompt + STATUS.md are the contract. The machine never stops between tasks; it only pauses for /compact (checkpoint to STATUS) or stops at SHIP. A blocker is never a stop — it deploys every means to resolve.

## Registering an EXISTING codebase (POINTERS — code stays in place, NEVER moved)
An existing project is registered here as a **pointer**, never as a copy. Create `<name>/PROJECT.md`:

```markdown
# <name>
PROJECT_PATH: /absolute/path/to/the/real/repo
TYPE: game | web | data | trading | automation | content | research
DRIVER: <the file that drives the build — its own MASTER_PROMPT.md, or STATUS.md>
MEMORY: <the file that holds the durable project memory>
```

| Field | Why it matters |
|---|---|
| `PROJECT_PATH` | The builder opens the **real** directory as its cwd — the pointer folder is registry only |
| `TYPE` | Routes the per-type team, playbook and grounding signal |
| `DRIVER` | If the project already drives itself, that file stays the operating prompt; the machine only adds the missing layers |
| `MEMORY` | Where the retro lands, so the project's own lessons keep accumulating |

Brownfield = additive overlay applied IN PLACE. Zero move, zero breakage, nothing overwritten.

Your own projects stay out of version control — `.gitignore` tracks only `_TEMPLATE/` and this README.
