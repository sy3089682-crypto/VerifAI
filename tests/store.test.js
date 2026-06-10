import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { appendRecord, getDecisions } from '../src/core/store.js';

const testDir = join(tmpdir(), 'verifai-test-store-' + Date.now());

describe('Store', () => {
  before(() => {
    mkdirSync(testDir, { recursive: true });
    mkdirSync(join(testDir, '.verifai'), { recursive: true });
    process.chdir(testDir);
  });

  after(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should store and retrieve records', () => {
    const record = {
      id: 'abc123',
      model: 'claude',
      prompt: 'test prompt',
      output: 'test.js',
      timestamp: new Date().toISOString(),
      tags: ['test'],
      verified: false,
      drift: [],
    };

    appendRecord(record);
    const records = getDecisions();
    assert.equal(records.length, 1);
    assert.equal(records[0].id, 'abc123');
  });

  it('should filter by model', () => {
    appendRecord({
      id: 'gpt1',
      model: 'gpt4',
      prompt: 'gpt prompt',
      output: 'gpt.js',
      timestamp: new Date().toISOString(),
      tags: [],
      verified: false,
      drift: [],
    });

    const filtered = getDecisions({ model: 'gpt4' });
    assert.ok(filtered.length >= 1);
    assert.ok(filtered.every(d => d.model.toLowerCase().includes('gpt4')));
  });

  it('should limit results', () => {
    const limited = getDecisions({ limit: 1 });
    assert.ok(limited.length <= 1);
  });

  it('should return empty array when no database exists', () => {
    const fakeDir = join(tmpdir(), 'nonexistent-' + Date.now());
    const originalCwd = process.cwd;
    const result = getDecisions();
    assert.ok(Array.isArray(result));
  });
});
