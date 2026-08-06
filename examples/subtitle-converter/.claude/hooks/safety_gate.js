#!/usr/bin/env node
/**
 * PreToolUse SEMANTIC safety gate — the real "hard layer" the literal deny-set
 * in settings.json can't be (a prefix denylist is bypassed by casing, alternate
 * commands, quoting). This inspects the ACTUAL tool call and blocks the
 * one-way-door classes regardless of exact spelling: secret exfiltration,
 * irreversible destruction, prod deploy / on-chain, and kill-by-name.
 *
 * Contract: PreToolUse hook. Print a reason to stderr + exit 2 to BLOCK; exit 0
 * to allow. Fail-OPEN on any parse error (exit 0) so a bug can never brick a
 * build — the settings.json deny-set still catches the literal cases underneath.
 * Enforces CONSTITUTION rails #2 (destructive/deploy/on-chain), #3 (secrets),
 * #12 (project-scoped process kill).
 */
function decide(tool, input) {
  const cmd = String((input && (input.command || input.script || input.cmd)) || "");
  const path = String((input && (input.file_path || input.path || input.notebook_path)) || "");
  const hay = (cmd + " " + path);
  const L = hay.toLowerCase();

  // 1) SECRET EXFIL — reading/copying/uploading a secret file via ANY tool
  const secretFile = /(^|[\s"'\/\\=(@:,])(\.?env(\.[\w.-]+)?|[\w.-]*secret[\w.-]*|[\w.-]*\.pem|id_rsa[\w.-]*|[\w.-]*\.key|credentials(\.\w+)?)($|[\s"'\/\\)@:,;])/i;
  if (tool === "Read" && secretFile.test(path))
    return "reads a secret file (.env/secret/.pem/key/id_rsa). Rail #3: secrets never leave the device — get explicit owner go-ahead.";
  if (/\b(cat|type|head|tail|less|more|cp|copy|scp|rsync|curl|wget|invoke-webrequest|iwr|get-content|gc|set-clipboard|clip)\b/i.test(L) && secretFile.test(hay))
    return "reads/copies/uploads a secret file via a shell command. Rail #3: secrets never leave the device — owner go-ahead required.";

  // 2) IRREVERSIBLE DESTRUCTION
  const destructive = [
    /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i,        // rm -rf / -fr / -r -f (any order/flags)
    /\bfind\b.*-delete/i,
    /shutil\.rmtree/i,
    /\bgit\s+reset\s+--hard/i,
    /\bgit\s+push\s+.*(--force|-f)\b/i,
    /\bremove-item\b.*-recurse.*-force|\bremove-item\b.*-force.*-recurse/i,
    /\bdel\b.*\/s|\brmdir\b.*\/s/i,
    /\b(drop|truncate)\s+table\b/i,
    /\bdrop\s+database\b/i,
  ];
  if (destructive.some((r) => r.test(hay)))
    return "irreversible destructive op (rm -rf / force-push / reset --hard / DROP|TRUNCATE / recursive delete). Rail #2: not without explicit owner go-ahead.";

  // 3) PROD DEPLOY / ON-CHAIN (one-way door)
  const deploy = [
    /\bvercel\b.*--prod/i, /\bwrangler\s+deploy/i, /\bnetlify\s+deploy/i,
    /\bkubectl\s+(apply|delete)/i, /\bterraform\s+(apply|destroy)/i,
    /\bfirebase\s+deploy/i, /\bnpm\s+publish/i, /\bgh\s+release\s+create/i,
    /\bcast\s+send\b/i, /\bsolana\b.*\b(transfer|deploy)\b/i, /\bprod-deploy\b/i,
  ];
  if (deploy.some((r) => r.test(hay)))
    return "prod-deploy / publish / on-chain transaction (one-way door). Rail #2: requires explicit owner go-ahead.";

  // 4) KILL BY NAME (nukes other projects' processes — Rail #12)
  const killByName = [
    /\btaskkill\b.*\/im\b/i, /\bstop-process\b.*-name/i, /\bpkill\b/i, /\bkillall\b/i,
    /\bget-process\b.*\|\s*stop-process/i,
  ];
  if (killByName.some((r) => r.test(hay)))
    return "kill-by-image-name / kill-all. Rail #12: NEVER kill a process you have not confirmed is THIS project's — target a specific verified PID instead.";

  return null;
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => { raw += c; });
process.stdin.on("end", () => {
  try {
    const j = JSON.parse(raw || "{}");
    const tool = String(j.tool_name || j.tool || "");
    const input = j.tool_input || j.input || {};
    const reason = decide(tool, input);
    if (reason) {
      process.stderr.write("[safety_gate BLOCKED] " + reason + "\n");
      process.exit(2); // block
    }
  } catch { /* fail-open: deny-set still underneath */ }
  process.exit(0);
});
setTimeout(() => { try { process.exit(0); } catch { /* */ } }, 2000);
