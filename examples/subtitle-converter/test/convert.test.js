'use strict';
/**
 * The grounding signal. No test framework — this must run on a bare Node 18+.
 * Prints "N/0" on success; exits 1 with the failing assertions otherwise.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { parse, convert, toSrt, toVtt, detectFormat, parseTimestamp, formatTimestamp } = require('../src/convert');

const FIXTURES = path.join(__dirname, '..', 'fixtures');
const fixture = (name) => fs.readFileSync(path.join(FIXTURES, name), 'utf8');

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

// --- timestamps ------------------------------------------------------------
test('parses SRT comma timestamps', () => {
  assert.strictEqual(parseTimestamp('00:00:01,500'), 1500);
});

test('parses WebVTT dot timestamps', () => {
  assert.strictEqual(parseTimestamp('00:00:01.500'), 1500);
});

test('parses the WebVTT two-field MM:SS form', () => {
  assert.strictEqual(parseTimestamp('01:30.250'), 90250);
});

test('pads a short fraction instead of misreading it', () => {
  assert.strictEqual(parseTimestamp('00:00:01,5'), 1500);
});

test('rejects a malformed timestamp instead of guessing', () => {
  assert.throws(() => parseTimestamp('1:2:3'), /bad timestamp/);
});

test('formats hours beyond one digit', () => {
  assert.strictEqual(formatTimestamp(3661001, ','), '01:01:01,001');
});

// --- parsing ---------------------------------------------------------------
test('reads a plain SRT file', () => {
  const { cues } = parse(fixture('sample.srt'));
  assert.strictEqual(cues.length, 3);
  assert.strictEqual(cues[0].text, 'The first line.');
});

test('strips a UTF-8 BOM', () => {
  const { cues } = parse('﻿1\n00:00:01,000 --> 00:00:02,000\nwith BOM');
  assert.strictEqual(cues.length, 1);
  assert.strictEqual(cues[0].text, 'with BOM');
});

test('handles CRLF line endings', () => {
  const { cues } = parse('1\r\n00:00:01,000 --> 00:00:02,000\r\nwindows\r\n');
  assert.strictEqual(cues[0].text, 'windows');
});

test('keeps multi-line cue text intact', () => {
  const { cues } = parse(fixture('sample.srt'));
  assert.strictEqual(cues[2].text, 'Two lines\nin one cue.');
});

test('drops WebVTT cue settings from the end timestamp', () => {
  const { cues } = parse('WEBVTT\n\n00:00:01.000 --> 00:00:02.000 align:start position:50%\npositioned');
  assert.strictEqual(cues[0].end, 2000);
});

test('skips NOTE and header blocks with a reason, never silently', () => {
  const { cues, skipped } = parse(fixture('sample.vtt'));
  assert.strictEqual(cues.length, 3);
  assert.ok(skipped.some((s) => s.reason === 'metadata block'));
});

test('rejects a cue that ends before it starts', () => {
  assert.throws(
    () => parse('1\n00:00:05,000 --> 00:00:02,000\nbackwards'),
    /ends before it starts/,
  );
});

// --- conversion ------------------------------------------------------------
test('detects the input format', () => {
  assert.strictEqual(detectFormat(fixture('sample.srt')), 'srt');
  assert.strictEqual(detectFormat(fixture('sample.vtt')), 'vtt');
});

test('SRT to WebVTT matches the reference fixture byte for byte', () => {
  assert.strictEqual(convert(fixture('sample.srt'), 'vtt').output, fixture('sample.vtt.expected'));
});

test('WebVTT to SRT matches the reference fixture byte for byte', () => {
  assert.strictEqual(convert(fixture('sample.vtt'), 'srt').output, fixture('sample.srt.expected'));
});

test('round-trips SRT to VTT and back without drift', () => {
  const original = fixture('sample.srt');
  const back = convert(convert(original, 'vtt').output, 'srt').output;
  assert.strictEqual(back, convert(original, 'srt').output);
});

test('renumbers SRT indices from one, whatever the source numbering', () => {
  const messy = '7\n00:00:01,000 --> 00:00:02,000\na\n\n99\n00:00:03,000 --> 00:00:04,000\nb\n';
  assert.ok(convert(messy, 'srt').output.startsWith('1\n'));
  assert.ok(convert(messy, 'srt').output.includes('\n2\n'));
});

test('preserves timing to the millisecond across a conversion', () => {
  const { cues } = parse(convert(fixture('sample.srt'), 'vtt').output);
  const source = parse(fixture('sample.srt')).cues;
  cues.forEach((c, i) => {
    assert.strictEqual(c.start, source[i].start);
    assert.strictEqual(c.end, source[i].end);
  });
});

test('returns an empty result for an empty file rather than crashing', () => {
  assert.deepStrictEqual(parse('   \n\n  ').cues, []);
});

test('refuses an unknown target format', () => {
  assert.throws(() => convert('', 'ass'), /unknown target format/);
});

// --- run -------------------------------------------------------------------
let failed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
  } catch (err) {
    failed++;
    console.error(`FAIL  ${name}\n      ${err.message.split('\n')[0]}`);
  }
}
console.log(`${tests.length - failed}/${tests.length} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
