import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { mkdirSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { initProject } from "../src/core/project.js";

const testDir = join(tmpdir(), "verifai-test-cli-" + Date.now());

describe("CLI Init", () => {
  before(() => {
    mkdirSync(testDir, { recursive: true });
  });

  after(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it("should initialize a project", async () => {
    const result = await initProject(testDir);
    assert.ok(result.success);
    assert.ok(existsSync(join(testDir, ".verifai", "config.json")));
    assert.ok(existsSync(join(testDir, ".verifai", "invariants.json")));
  });

  it("should work with relative paths", async () => {
    const subDir = join(testDir, "sub-project");
    mkdirSync(subDir, { recursive: true });
    const result = await initProject(subDir);
    assert.ok(result.success);
  });
});
