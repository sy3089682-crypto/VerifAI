import chalk from "chalk";
import { getDecisions } from "../core/store.js";

export async function auditHandler(options) {
  const filters = {};
  if (options.since) filters.since = options.since;
  if (options.model) filters.model = options.model;
  if (options.tag) filters.tag = options.tag;
  filters.limit = parseInt(options.limit) || 50;

  const decisions = getDecisions(filters);

  if (decisions.length === 0) {
    console.log(chalk.yellow("\n  No records found"));
    console.log(
      chalk.dim(
        '  Start tracking: verifai track -m "model" -p "prompt" -o "output.js"\n',
      ),
    );
    return;
  }

  if (options.json) {
    console.log(JSON.stringify(decisions, null, 2));
    return;
  }

  console.log(chalk.cyan(`\n  Audit Trail (${decisions.length} records)\n`));

  for (const d of decisions) {
    const icon = d.verified ? chalk.green("✓") : chalk.yellow("○");
    console.log(
      `  ${icon} ${chalk.bold(d.hash.slice(0, 8))} ${chalk.dim(d.timestamp)}`,
    );
    console.log(`    Model:  ${d.model}`);
    console.log(`    Prompt: ${truncate(d.prompt, 60)}`);
    console.log(`    Output: ${d.output}`);
    if (d.tags.length) console.log(`    Tags:   ${d.tags.join(", ")}`);
    console.log("");
  }
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + "..." : str;
}
