import assert from 'node:assert/strict';
import test from 'node:test';
import { COMMAND_NAMES, parseCommand } from './commands.js';

const EXPECTED = [
  'help',
  'about',
  'experience',
  'skills',
  'projects',
  'fleetpilot',
  'transaction-risk',
  'open-source',
  'writing',
  'resume',
  'contact',
  'clear',
];

test('catalog lists the local commands in order', () => {
  assert.deepEqual(COMMAND_NAMES, EXPECTED);
});

test('known commands answer from the catalog', () => {
  for (const name of EXPECTED) {
    if (name === 'clear') continue;
    const result = parseCommand(`  ${name.toUpperCase()}  `);
    assert.equal(result.type, 'ok');
    assert.equal(result.command, name);
    assert.ok(result.lines.length > 0);
  }
});

test('clear empties rather than answering', () => {
  const result = parseCommand('/clear');
  assert.equal(result.type, 'clear');
  assert.deepEqual(result.lines, []);
});

test('empty input asks for help', () => {
  const result = parseCommand('   ');
  assert.equal(result.type, 'empty');
  assert.match(result.lines[0], /help/);
});

test('unknown input names the attempt and lists commands', () => {
  const result = parseCommand('deploy production');
  assert.equal(result.type, 'unknown');
  assert.match(result.lines[0], /deploy production/);
  assert.match(result.lines[1], /help/);
  assert.match(result.lines[1], /fleetpilot/);
});

test('aliases stay on the same answers', () => {
  assert.equal(parseCommand('cv').command, 'resume');
  assert.equal(parseCommand('résumé').command, 'resume');
  assert.equal(parseCommand('transaction risk').command, 'transaction-risk');
  assert.equal(parseCommand('open source').command, 'open-source');
});

test('answers keep the facts that are easy to overclaim', () => {
  const about = parseCommand('about').lines.join(' ');
  assert.match(about, /9\+ years/);
  const experience = parseCommand('experience').lines;
  assert.equal(experience[0], 'Yakili — Senior Backend Engineer.');
  assert.doesNotMatch(experience[0], /\d{4}/);
  const risk = parseCommand('transaction-risk').lines.join(' ');
  assert.match(risk, /synthetic/i);
  const goose = parseCommand('open-source').lines.join(' ');
  assert.match(goose, /not a maintainer role/);
  assert.match(goose, /UTF-16/);
  assert.match(goose, /open/i);
  const all = EXPECTED.map((name) => parseCommand(name).lines.join(' ')).join(' ');
  assert.doesNotMatch(all, /Anthropic|phone|\+234/i);
});
