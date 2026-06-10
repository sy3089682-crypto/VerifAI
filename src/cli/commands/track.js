import chalk from "chalk";
import { recordDecision } from "../core/tracker.js";

export async function trackHandler(options) {
  if (!options.model || !options.prompt || !options.output) {
    console.log(chalk.red("  ✗") + " Required: --model, --prompt, --output");
    console.log(
      chalk.dim(
        '  Example: verifai track -m "claude" -p "create auth" -o "src/auth.js"',
      ),
    );
    return;
  }

  const record = {
    model: options.model,
    prompt: options.prompt,
    output: options.output,
    context: options.context || "",
    tags: options.tags ? options.tags.split(",") : [],
    timestamp: new Date().toISOString(),
    hash: createHash(options.prompt + options.output + Date.now()),
  };

  try {
    await recordDecision(record);
    console.log(chalk.green("  ✓") + " Decision recorded");
    console.log(chalk.dim("  ID:   ") + record.hash.slice(0, 12) + "...");
    console.log(chalk.dim("  Model:") + " " + record.model);
    console.log(chalk.dim("  Time: ") + " " + record.timestamp);
  } catch (err) {
    console.log(chalk.red("  ✗") + " Failed to record: " + err.message);
  }
}

function createHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}
