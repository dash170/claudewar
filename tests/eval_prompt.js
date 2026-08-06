#!/usr/bin/env node
/**
 * eval_prompt.js — the machine's self-eval gate (UBM roadmap: eval-gate).
 *
 * WHAT IT IS (be honest): a STRUCTURAL / COMPLETENESS eval. It scores a generated
 * operating-prompt + its materialized folder against the machine's OWN falsifiable
 * rubric (the TIGHTEN checklist + DoD gates) using grep-able checks — does the
 * prompt HAVE the load-bearing, falsifiable parts (EARS ship gate + named evidence,
 * runnable grounding signal, filled placeholders, rails+deny-set, Opus team,
 * phase ladder with EARS acceptance, self-improvement loop, materialization
 * complete, self-audit recorded)?
 *
 * WHAT IT IS NOT: outcome validation. It does NOT prove a generated prompt ships
 * faster/better than a hand-written one — that needs real A/B builds (owner-time,
 * out of scope). The cross-project distribution below is DESCRIPTIVE (how complete
 * are the prompts the machine has produced), small-n, not an inferential claim.
 *
 * Run (report over all materialized projects):   node tests/eval_prompt.js
 * Run (gate one project, exit 1 if < threshold):  node tests/eval_prompt.js projects/<name> --gate 80
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const read = (f) => { try { return fs.readFileSync(f, "utf8"); } catch { return ""; } };
const exists = (f) => { try { return fs.existsSync(f); } catch { return false; } };

// ---- the falsifiable checks (weight sums to 100) --------------------------
const CHECKS = [
  { key: "ship_gate_ears", w: 14, desc: "§1 ship gate in EARS form (WHEN … THE SYSTEM SHALL …)",
    // window is generous: a valid EARS trigger clause can be long (multi-condition).
    test: (c) => /\bWHEN\b[\s\S]{0,900}?\bTHE SYSTEM (SHALL|MAY)\b/i.test(c.op) },
  { key: "ship_gate_evidence", w: 10, desc: "ship gate names the artifact that PROVES it (evidence/artifact + a real file/report/ledger)",
    test: (c) => /(evidence|artifact|names the artifact|proves it)[\s\S]{0,340}?(\.(md|json|csv|parquet|txt|log|ps1|sh|jsonl)\b|\bledger\b|\breport\b|RESULTS)/i.test(c.op) },
  { key: "grounding_runnable", w: 12, desc: "grounding signal named + a runnable verify/smoke/test referenced",
    test: (c) => /grounding signal/i.test(c.op) && /(verify\.(ps1|sh)|smoke|RESULTS\.json|pytest|test)/i.test(c.op) },
  { key: "no_placeholders", w: 12, desc: "zero {{placeholder}} survive (a FILLED prompt, not the template)",
    test: (c) => !/\{\{[^}]+\}\}/.test(c.op) },
  { key: "rails_deny", w: 12, desc: "§3a rails + CONSTITUTION + deny-set referenced",
    test: (c) => /NON-NEGOTIABLE RAILS/i.test(c.op) && /CONSTITUTION/i.test(c.op) && /deny-set/i.test(c.op) },
  { key: "self_improve_loop", w: 8, desc: "<self_improvement_loop> block present",
    test: (c) => /<self_improvement_loop>/i.test(c.op) },
  { key: "team_opus", w: 10, desc: "TEAM block present + Opus-default (any Sonnet/Haiku must be a DECLARED exception)",
    test: (c) => {
      if (!/\bTEAM\b/i.test(c.op) || !/\bOpus\b/.test(c.op)) return false;
      const lesser = /\b(Sonnet|Haiku)\b/.test(c.op);
      return !lesser || /(declared|exception|mechanical|trivial)/i.test(c.op);
    } },
  { key: "ladder_ears", w: 8, desc: "phase ladder with ≥2 EARS acceptance clauses in PLAN.md",
    test: (c) => (c.plan.match(/\bWHEN\b[\s\S]{0,300}?\bSHALL\b/gi) || []).length >= 2 },
  { key: "materialize_complete", w: 8, desc: "full _TEMPLATE file set present (CLAUDE/OP/STATUS/PLAN/CONSTITUTION/settings/agents/verify)",
    test: (c) => c.materialized },
  { key: "self_audit", w: 6, desc: "MACHINE-COMPLETENESS SELF-AUDIT recorded in STATUS.md",
    test: (c) => /MACHINE-COMPLETENESS SELF-AUDIT|SELF-AUDIT/i.test(c.status) },
];

function loadProject(dir) {
  const op = read(path.join(dir, "PROJECT_OPERATING_PROMPT.md"));
  const status = read(path.join(dir, "STATUS.md"));
  const plan = read(path.join(dir, "PLAN.md"));
  const agentsDir = path.join(dir, ".claude", "agents");
  const hasAgent = exists(agentsDir) &&
    fs.readdirSync(agentsDir).some((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  const materialized = ["CLAUDE.md", "PROJECT_OPERATING_PROMPT.md", "STATUS.md", "PLAN.md", "CONSTITUTION.md"]
    .every((f) => exists(path.join(dir, f)))
    && exists(path.join(dir, ".claude", "settings.json"))
    && hasAgent
    && (exists(path.join(dir, "verify.ps1")) || exists(path.join(dir, "verify.sh")));
  return { op, status, plan, materialized };
}

function score(dir) {
  const c = loadProject(dir);
  if (!c.op) return null; // no operating prompt → not an authored project
  const results = CHECKS.map((chk) => ({ key: chk.key, w: chk.w, desc: chk.desc, pass: !!chk.test(c) }));
  const total = results.filter((r) => r.pass).reduce((s, r) => s + r.w, 0);
  return { total, results };
}

// ---- bootstrap CI (descriptive; Math.random ok in a plain node script) ----
function bootstrapCI(vals, iters = 5000) {
  if (vals.length < 2) return null;
  const means = [];
  for (let i = 0; i < iters; i++) {
    let s = 0;
    for (let k = 0; k < vals.length; k++) s += vals[Math.floor(Math.random() * vals.length)];
    means.push(s / vals.length);
  }
  means.sort((a, b) => a - b);
  return { lo: means[Math.floor(iters * 0.025)], hi: means[Math.floor(iters * 0.975)] };
}

// ---- CLI ------------------------------------------------------------------
const args = process.argv.slice(2);
const gateIdx = args.indexOf("--gate");
const threshold = gateIdx >= 0 ? Number(args[gateIdx + 1]) : null;
const targetArg = args.find((a) => !a.startsWith("--") && a !== String(threshold));

// Resolve a target against the CURRENT directory first (so it works from inside
// a project dir), falling back to repo-root-relative for `projects/<name>` calls.
function resolveTarget(arg) {
  const fromCwd = path.resolve(process.cwd(), arg);
  if (exists(path.join(fromCwd, "PROJECT_OPERATING_PROMPT.md"))) return fromCwd;
  return path.resolve(ROOT, arg);
}

let targets;
if (targetArg) {
  targets = [resolveTarget(targetArg)];
} else {
  const pdir = path.join(ROOT, "projects");
  targets = fs.readdirSync(pdir)
    .map((n) => path.join(pdir, n))
    .filter((d) => { try { return fs.statSync(d).isDirectory(); } catch { return false; } })
    .filter((d) => exists(path.join(d, "PROJECT_OPERATING_PROMPT.md")));
}

console.log("eval_prompt — STRUCTURAL completeness eval (NOT outcome validation; see file header)\n");
const rows = [];
for (const dir of targets) {
  const s = score(dir);
  const name = path.basename(dir);
  if (!s) { console.log(`  ${name}: no operating prompt — skipped`); continue; }
  rows.push({ name, total: s.total, results: s.results });
}

// per-project + per-check
for (const r of rows) {
  const failed = r.results.filter((x) => !x.pass).map((x) => x.key);
  console.log(`  ${String(r.total).padStart(3)}/100  ${r.name.padEnd(22)} ${failed.length ? "missing: " + failed.join(", ") : "✓ all checks"}`);
}

// distribution (descriptive, small-n)
const vals = rows.filter((r) => r.name !== "_TEMPLATE").map((r) => r.total);
if (vals.length >= 2) {
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const ci = bootstrapCI(vals);
  console.log(`\n  distribution over ${vals.length} generated prompts (excl. _TEMPLATE baseline):`);
  console.log(`    mean ${mean.toFixed(1)}/100  ·  min ${Math.min(...vals)}  ·  max ${Math.max(...vals)}` +
    (ci ? `  ·  95% bootstrap CI [${ci.lo.toFixed(1)}, ${ci.hi.toFixed(1)}]` : ""));
  console.log(`    ⚠ small-n (${vals.length}): CI is DESCRIPTIVE of the machine's own output completeness,`);
  console.log(`      NOT proof that generated > hand-written. Outcome A/B needs real builds.`);
}

// gate mode
if (threshold != null && targetArg) {
  const r = rows.find((x) => x.name === path.basename(resolveTarget(targetArg)));
  if (!r) { console.log(`\n  gate: target not found`); process.exit(1); }
  const ok = r.total >= threshold;
  console.log(`\n  GATE: ${r.name} scored ${r.total}, threshold ${threshold} → ${ok ? "PASS" : "FAIL"}`);
  process.exit(ok ? 0 : 1);
}
process.exit(0);
