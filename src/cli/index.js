#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { trackHandler } from "./commands/track.js";
import { auditHandler } from "./commands/audit.js";
import { enforceHandler } from "./commands/enforce.js";
import { initHandler } from "./commands/init.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(
  readFileSync(join(__dirname, "../../package.json"), "utf-8"),
);

const program = new Command();

program
  .name("verifai")
  .description(
    "Open-source AI output verification. Record, audit, and enforce trust in AI-generated code.",
  )
  .version(pkg.version);

program
  .command("init")
  .description("Initialize VerifAI in your project")
  .argument("[path]", "project path", ".")
  .action(initHandler);

program
  .command("track")
  .description("Record an AI agent decision")
  .option("-m, --model <name>", "AI model used")
  .option("-p, --prompt <text>", "prompt or instruction given")
  .option("-o, --output <file>", "output file path")
  .option("-c, --context <context>", "additional context")
  .option("-t, --tags <tags>", "comma-separated tags")
  .action(trackHandler);

program
  .command("audit")
  .description("Show audit trail of AI decisions")
  .option("-s, --since <time>", "show records since (e.g. 1d, 2w, 1m)")
  .option("-m, --model <name>", "filter by model")
  .option("-t, --tag <tag>", "filter by tag")
  .option("-l, --limit <number>", "limit results", "50")
  .option("--json", "output as JSON")
  .action(auditHandler);

program
  .command("enforce")
  .description("Validate code against invariants")
  .argument("<file>", "file to validate")
  .option("-r, --rules <path>", "path to invariants file")
  .option("--json", "output as JSON")
  .action(enforceHandler);

program
  .command("status")
  .description("Show VerifAI status and statistics")
  .action(async () => {
    const { getStatus } = await import("../core/store.js");
    const status = getStatus();
    console.log(chalk.cyan("\n  VerifAI Status"));
    console.log(chalk.dim("  ───────────────"));
    console.log(`  Records: ${chalk.bold(status.recordCount)}`);
    console.log(`  Storage: ${chalk.bold(status.storageSize)}`);
    console.log(`  Since:   ${chalk.bold(status.oldestRecord)}`);
    console.log("");
  });

program.parse();
