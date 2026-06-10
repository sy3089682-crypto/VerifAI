import { describe, it } from "node:test";
import assert from "node:assert";
import { validateFile, detectDrift } from "../src/core/enforcer.js";

describe("Enforcer", () => {
  const testRules = {
    version: "1.0",
    rules: [
      {
        name: "no-secrets",
        pattern: "(password|secret|api[_-]?key|token)\\s*[:=]\\s*[\"']",
        message: "Hardcoded secret detected",
        level: "error",
      },
      {
        name: "no-debugger",
        pattern: "debugger;",
        message: "Debugger statement found",
        level: "error",
      },
    ],
  };

  it("should pass clean code", () => {
    const code = 'const x = 42;\nfunction hello() { return "world"; }';
    const results = validateFile(code, testRules);
    assert.ok(results.every((r) => r.passed));
  });

  it("should detect hardcoded secrets", () => {
    const code = 'const password = "hunter2";\nconst api_key = "abc123";';
    const results = validateFile(code, testRules);
    const secretRule = results.find((r) => r.rule === "no-secrets");
    assert.ok(secretRule);
    assert.equal(secretRule.passed, false);
    assert.equal(secretRule.matches, 2);
  });

  it("should detect debugger statements", () => {
    const code = "function test() { debugger; return 1; }";
    const results = validateFile(code, testRules);
    const debuggerRule = results.find((r) => r.rule === "no-debugger");
    assert.ok(debuggerRule);
    assert.equal(debuggerRule.passed, false);
  });
});

describe("Drift Detection", () => {
  it("should detect missing async when prompt asks for it", () => {
    const drifts = detectDrift(
      "Create an async function that fetches data",
      'function getData() { return fetch("/api"); }',
    );
    assert.ok(drifts.some((d) => d.type === "missing-feature"));
  });

  it("should detect missing error handling", () => {
    const drifts = detectDrift(
      "Write a robust error-handling file parser",
      "function parseFile(path) { return readFileSync(path); }",
    );
    assert.ok(drifts.some((d) => d.type === "missing-error-handling"));
  });

  it("should detect missing tests", () => {
    const drifts = detectDrift(
      "Write tests for the calculator module",
      "export function add(a, b) { return a + b; }",
    );
    assert.ok(drifts.some((d) => d.type === "missing-tests"));
  });

  it("should detect security concerns", () => {
    const drifts = detectDrift(
      "Create a secure input sanitizer",
      "function sanitize(input) { document.innerHTML = input; }",
    );
    assert.ok(drifts.some((d) => d.type === "security-concern"));
  });

  it("should return empty for aligned prompt and output", () => {
    const drifts = detectDrift(
      "Create a function",
      'function hello() { return "hi"; }',
    );
    assert.equal(drifts.length, 0);
  });
});
