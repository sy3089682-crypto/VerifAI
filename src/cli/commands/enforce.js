import chalk from "chalk";
import { readFileSync, existsSync } from "fs";
import { validateFile } from "../core/enforcer.js";

export async function enforceHandler(file, options) {
  const rulesPath = options.rules || ".verifai/invariants.json";

  if (!existsSync(file)) {
    console.log(chalk.red("  ✗") + " File not found: " + file);
    return;
  }

  if (!existsSync(rulesPath)) {
    console.log(
      chalk.yellow("  !") + " No invariants file found at " + rulesPath,
    );
    console.log(chalk.dim("  Create one or specify: --rules <path>"));
    return;
  }

  let rules;
  try {
    rules = JSON.parse(readFileSync(rulesPath, "utf-8"));
  } catch {
    console.log(chalk.red("  ✗") + " Invalid invariants file");
    return;
  }

  const content = readFileSync(file, "utf-8");
  const results = validateFile(content, rules);

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  console.log(chalk.cyan(`\n  Enforcing invariants on ${file}\n`));

  let passed = 0;
  let failed = 0;

  for (const r of results) {
    if (r.passed) {
      console.log(chalk.green("  ✓") + " " + r.rule);
      passed++;
    } else {
      console.log(chalk.red("  ✗") + " " + r.rule);
      console.log(chalk.dim("    ") + r.message);
      failed++;
    }
  }

  console.log("");
  if (failed === 0) {
    console.log(chalk.green(`  All ${passed} invariants passed`));
  } else {
    console.log(
      chalk.yellow(`  ${passed} passed, ${chalk.red(failed + " failed")}`),
    );
  }
  console.log("");
}
