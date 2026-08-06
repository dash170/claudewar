#!/usr/bin/env node
'use strict';
const fs = require('fs');
const { convert, detectFormat } = require('./convert');

const USAGE = `subtitle-converter — SRT <-> WebVTT

  node src/cli.js <input> [--to srt|vtt] [-o <output>]

  --to   target format. Defaults to the opposite of the detected input format.
  -o     write to a file instead of stdout.
`;

function main(argv) {
  const args = argv.slice(2);
  if (!args.length || args.includes('-h') || args.includes('--help')) {
    process.stdout.write(USAGE);
    return 0;
  }

  const input = args.find((a) => !a.startsWith('-') && args[args.indexOf(a) - 1] !== '--to' && args[args.indexOf(a) - 1] !== '-o');
  if (!input) { process.stderr.write('error: no input file\n'); return 2; }

  const text = fs.readFileSync(input, 'utf8');
  const toIndex = args.indexOf('--to');
  const target = toIndex >= 0 ? args[toIndex + 1] : (detectFormat(text) === 'srt' ? 'vtt' : 'srt');

  const { output, cues, skipped } = convert(text, target);

  const outIndex = args.indexOf('-o');
  if (outIndex >= 0) fs.writeFileSync(args[outIndex + 1], output, 'utf8');
  else process.stdout.write(output);

  // No silent caps: every skipped block is reported with its reason.
  process.stderr.write(`[subtitle-converter] ${cues.length} cues converted to ${target}, ${skipped.length} skipped\n`);
  for (const s of skipped) process.stderr.write(`  skipped: ${s.reason}\n`);
  return 0;
}

if (require.main === module) {
  try {
    process.exit(main(process.argv));
  } catch (err) {
    process.stderr.write(`error: ${err.message}\n`);
    process.exit(1);
  }
}
module.exports = { main };
