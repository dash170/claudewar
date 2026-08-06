'use strict';
/**
 * SRT <-> WebVTT conversion. No dependencies.
 *
 * Everything is parsed into one neutral cue shape — { start, end, text } with
 * times as integer milliseconds — so the two formats never know about each other.
 */

const TIMESTAMP = /^(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})$/;
const METADATA = /^(WEBVTT|NOTE|STYLE|REGION)\b/;

function parseTimestamp(raw) {
  const m = TIMESTAMP.exec(raw.trim());
  if (!m) throw new Error(`bad timestamp: ${JSON.stringify(raw.trim())}`);
  const [, h, min, sec, frac] = m;
  const ms = Number(frac.padEnd(3, '0'));
  return ((Number(h || 0) * 60 + Number(min)) * 60 + Number(sec)) * 1000 + ms;
}

function formatTimestamp(ms, fractionSeparator) {
  const pad = (n, width) => String(n).padStart(width, '0');
  return [
    pad(Math.floor(ms / 3600000), 2),
    pad(Math.floor(ms / 60000) % 60, 2),
    pad(Math.floor(ms / 1000) % 60, 2),
  ].join(':') + fractionSeparator + pad(ms % 1000, 3);
}

/**
 * Parse either format. Returns { cues, skipped } — skipped is never silent
 * (rail #6: log processed/total + skipped-with-reason).
 */
function parse(text) {
  const clean = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').trim();
  const cues = [];
  const skipped = [];
  if (!clean) return { cues, skipped };

  for (const block of clean.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)) {
    const lines = block.split('\n');
    const arrowIndex = lines.findIndex((l) => l.includes('-->'));

    if (arrowIndex === -1) {
      skipped.push({ block, reason: METADATA.test(block) ? 'metadata block' : 'no timing line' });
      continue;
    }

    const [rawStart, rawRest] = lines[arrowIndex].split('-->');
    // WebVTT allows cue settings after the end time ("... --> ... align:start"); drop them.
    const start = parseTimestamp(rawStart);
    const end = parseTimestamp(rawRest.trim().split(/\s+/)[0]);
    if (end < start) throw new Error(`cue ends before it starts: ${lines[arrowIndex].trim()}`);

    const body = lines.slice(arrowIndex + 1).join('\n').trim();
    if (!body) {
      skipped.push({ block, reason: 'empty cue text' });
      continue;
    }
    cues.push({ start, end, text: body });
  }
  return { cues, skipped };
}

function toSrt(cues) {
  return cues
    .map((c, i) => `${i + 1}\n${formatTimestamp(c.start, ',')} --> ${formatTimestamp(c.end, ',')}\n${c.text}`)
    .join('\n\n') + '\n';
}

function toVtt(cues) {
  return 'WEBVTT\n\n' + cues
    .map((c) => `${formatTimestamp(c.start, '.')} --> ${formatTimestamp(c.end, '.')}\n${c.text}`)
    .join('\n\n') + '\n';
}

function detectFormat(text) {
  return text.replace(/^﻿/, '').trimStart().startsWith('WEBVTT') ? 'vtt' : 'srt';
}

/** Convert text to the target format. Returns { output, cues, skipped }. */
function convert(text, target) {
  if (target !== 'srt' && target !== 'vtt') throw new Error(`unknown target format: ${target}`);
  const { cues, skipped } = parse(text);
  return { output: target === 'srt' ? toSrt(cues) : toVtt(cues), cues, skipped };
}

module.exports = { parse, convert, toSrt, toVtt, detectFormat, parseTimestamp, formatTimestamp };
