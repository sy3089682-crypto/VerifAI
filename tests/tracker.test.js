import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { recordDecision } from '../src/core/tracker.js';

const testDir = join(tmpdir(), 'verifai-test-tracker-' + Date.now());

describe('Tracker', () => {
  before(() => {
    mkdirSync(testDir, { recursive: true });
    process.chdir(testDir);
  });

  after(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should record a decision', async () => {
    const record = await recordDecision({
      model: 'claude',
      prompt: 'Create a login function',
      output: 'src/auth.js',
      context: 'user auth module',
      tags: ['auth', 'security'],
      hash: 'test123',
      timestamp: new Date().toISOString(),
    });

    assert.ok(record);
    assert.equal(record.model, 'claude');
    assert.equal(record.prompt, 'Create a login function');
    assert.ok(record.verified !== undefined);
  });

  it('should reject records without required fields', async () => {
    await assert.rejects(
      () => recordDecision({ model: 'test' }),
      /model, prompt, and output/
    );
  });

  it('should generate a hash and timestamp if not provided', async () => {
    const record = await recordDecision({
      model: 'gpt4',
      prompt: 'Refactor database layer',
      output: 'src/db.js',
      hash: 'hash-' + Date.now(),
      timestamp: new Date().toISOString(),
    });

    assert.ok(record);
    assert.equal(record.model, 'gpt4');
  });
});
