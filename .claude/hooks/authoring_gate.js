#!/usr/bin/env node
/**
 * claudewar UserPromptSubmit hook — the mechanical layer the root doctrine lacked.
 * When the owner's prompt reads as a project-authoring request, re-inject the
 * 6-step generator + its hard definition-of-done gates as context, so a fresh /
 * post-compaction Claude cannot silently skip STUDY / MATERIALIZE-complete /
 * SELF-AUDIT / RETRO. Fully defensive: any error → exit 0, emit nothing (a
 * broken hook must never block a prompt).
 */
try {
  let raw = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (c) => { raw += c; });
  process.stdin.on("end", () => {
    let prompt = "";
    try {
      const j = JSON.parse(raw || "{}");
      prompt = String(j.prompt || j.user_prompt || j.message || "");
    } catch { prompt = String(raw || ""); }
    const p = prompt.toLowerCase();
    // authoring-intent triggers (FR + EN, phrasing-tolerant)
    const authoring = /(fais|faire|prépare|prepare|crée|cree|génère|genere|monte|écris|ecris|author|set ?up|build|create|make|write).{0,40}(prompt|projet|project|operating prompt)/i.test(p)
      || /(prompt|operating prompt).{0,30}(pour|for)\s+\w/i.test(p)
      || /\b(prépare|prepare|scaffold|materialize|matérialise)\b.{0,30}\bprojet|project\b/i.test(p);
    if (authoring) {
      process.stdout.write(
        "[claudewar authoring-gate] This reads as a project-authoring request. Follow CLAUDE.md's generator IN ORDER and honor each step's DEFINITION-OF-DONE — do not skip under time pressure/compaction:\n" +
        "1 INTAKE (type/mode/stakes/clarity)  ·  2 STUDY → DoD: a PROJECT_BRIEF citing REAL named signals exists (else hand-fan agents; MATERIALIZE forbidden without it)\n" +
        "3 MATERIALIZE (+EQUIP) → DoD: full _TEMPLATE set present in projects/<name>/ AND zero {{placeholder}} survives (a brief-only folder = FAILED run)\n" +
        "4 TIGHTEN → invoke prompt-master via the Skill tool; assert allow{} populated + allowedDomains scoped (no placeholder); every role tier = Opus; write the MACHINE-COMPLETENESS self-audit into STATUS\n" +
        "5 HAND OFF verbatim, then STOP (author role done) unless the owner says keep going  ·  6 MACHINE RETRO: append a dated references/LESSONS.md row + commit — mandatory, never skip.\n"
      );
    }
    process.exit(0);
  });
  // if stdin never ends (no piped input), don't hang
  setTimeout(() => { try { process.exit(0); } catch { /* */ } }, 2000);
} catch {
  process.exit(0);
}
