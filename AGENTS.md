# CLAUDEWAR — AGENTS.md (Codex entry point)

> **REPLACED 2026-07-16.** The previous body was a mechanical s/Claude/Codex/ clone of `CLAUDE.md` that fabricated nonexistent artifacts (`.Codex/agents/`, `.Codex/skills`, `~/.Codex/skills`, a "karpathy-Codex-md" skill) and instructed Codex to call Claude-Code-only surfaces (the `Workflow` tool, the `prompt-master` skill, `/compact`). It has been a live fork risk since 06-25.

**This machine is Claude-Code-native. Read `CLAUDE.md` — it is the single operating prompt for the prompt-author role, and its CANON header governs precedence.**

If you are a Codex (or any non-Claude-Code) agent working in this tree, the deltas that apply to you:

- The doctrine, pipeline order (INTAKE → STUDY → MATERIALIZE+EQUIP → TIGHTEN → HAND OFF → MACHINE RETRO), rails, vetting rubric, and doc canon in `CLAUDE.md` all apply verbatim.
- You have NO `Workflow` tool: replace STEP 0 (STUDY) with sequential deep-research passes over the same 8 aspects (human/market · references · tech · free-gen · risk · team · ship-gate · ladder), each adversarially self-checked, then synthesize `PROJECT_BRIEF.md` by hand.
- Skills/agents install paths are Claude Code's (`.claude/agents/`, `.claude/skills`, `~/.claude/skills`) — materialized projects target BUILDER Claudes, so always emit `.claude/` layouts even when you yourself run elsewhere. (A project may additionally ship `.codex/agents/*.toml` twins.)
- No `/compact`: checkpoint through `STATUS.md` (the resume anchor) instead.
