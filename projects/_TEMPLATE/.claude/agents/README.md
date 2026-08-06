# per-project role subagents

The prompt-author Claude (the **ASSEMBLER**, see `../../../TEAM_AND_HUMAN_LAYER.md`) writes the per-project role subagents here **before** the builder Claude opens the project.

Each role = one Markdown file with YAML frontmatter:
```yaml
---
name: short-id
description: <when to auto-route to this role — the lead matches on this>
tools: <least-privilege list>
model: haiku | sonnet | opus
---
<system prompt body = the role mandate + lens + handoff contract>
```
The lead auto-routes to a role on its `description`. Normalize every imported role (VoltAgent / wshobson / CrewAI) through `../ROLE_SPEC.md` before dropping it here.
