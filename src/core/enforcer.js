export function validateFile(content, rules) {
  const results = [];

  for (const rule of rules.rules || []) {
    try {
      const regex = new RegExp(rule.pattern, "gi");
      const matches = content.match(regex);

      if (matches) {
        results.push({
          rule: rule.name,
          passed: false,
          message: `${rule.message} (found ${matches.length} match${matches.length > 1 ? "es" : ""})`,
          level: rule.level || "warning",
          matches: matches.length,
        });
      } else {
        results.push({
          rule: rule.name,
          passed: true,
          message: "",
          level: rule.level || "warning",
          matches: 0,
        });
      }
    } catch {
      results.push({
        rule: rule.name,
        passed: false,
        message: "Invalid rule pattern",
        level: "error",
        matches: 0,
      });
    }
  }

  return results;
}

export function detectDrift(prompt, output) {
  const drifts = [];

  const promptLower = prompt.toLowerCase();
  const outputLower = output.toLowerCase();

  if (
    promptLower.includes("async") &&
    !outputLower.includes("async") &&
    !outputLower.includes("await")
  ) {
    drifts.push({
      type: "missing-feature",
      message: "Prompt requested async behavior but output lacks async/await",
      severity: "medium",
    });
  }

  if (
    promptLower.includes("error") &&
    !outputLower.includes("error") &&
    !outputLower.includes("try")
  ) {
    drifts.push({
      type: "missing-error-handling",
      message: "Prompt mentions error handling but output lacks try/catch",
      severity: "high",
    });
  }

  if (
    promptLower.includes("test") &&
    !outputLower.includes("test") &&
    !outputLower.includes("describe") &&
    !outputLower.includes("it(")
  ) {
    drifts.push({
      type: "missing-tests",
      message: "Prompt requested tests but no test code found in output",
      severity: "medium",
    });
  }

  if (promptLower.includes("secure") || promptLower.includes("security")) {
    if (outputLower.includes("innerhtml") || outputLower.includes("eval(")) {
      drifts.push({
        type: "security-concern",
        message:
          "Security was requested but output contains unsafe patterns (innerHTML/eval)",
        severity: "high",
      });
    }
  }

  return drifts;
}
