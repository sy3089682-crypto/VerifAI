import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  statSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getDbPath() {
  return join(process.cwd(), ".verifai", "decisions.jsonl");
}

function ensureDir() {
  const dir = dirname(getDbPath());
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function appendRecord(record) {
  ensureDir();
  const line = JSON.stringify(record) + "\n";
  writeFileSync(getDbPath(), line, { flag: "a" });
}

export function getDecisions(filters = {}) {
  const dbPath = getDbPath();
  if (!existsSync(dbPath)) return [];

  const lines = readFileSync(dbPath, "utf-8").split("\n").filter(Boolean);

  let decisions = lines
    .map((l, i) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  if (filters.model) {
    decisions = decisions.filter((d) =>
      d.model.toLowerCase().includes(filters.model.toLowerCase()),
    );
  }

  if (filters.tag) {
    decisions = decisions.filter(
      (d) =>
        d.tags &&
        d.tags.some((t) => t.toLowerCase() === filters.tag.toLowerCase()),
    );
  }

  if (filters.since) {
    const cutoff = Date.now() - parseTime(filters.since);
    decisions = decisions.filter(
      (d) => new Date(d.timestamp).getTime() > cutoff,
    );
  }

  const limit = filters.limit || 50;
  decisions = decisions.slice(-limit);

  return decisions.reverse();
}

export function getStatus() {
  const dbPath = getDbPath();
  if (!existsSync(dbPath)) {
    return { recordCount: 0, storageSize: "0 B", oldestRecord: "N/A" };
  }

  const lines = readFileSync(dbPath, "utf-8").split("\n").filter(Boolean);
  const stats = statSync(dbPath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  const oldest =
    lines.length > 0 ? JSON.parse(lines[0]).timestamp || "N/A" : "N/A";

  return {
    recordCount: lines.length,
    storageSize: sizeKB + " KB",
    oldestRecord: oldest,
  };
}

function parseTime(str) {
  const match = str.match(/^(\d+)([dhwm])$/);
  if (!match) return 86400000;
  const val = parseInt(match[1]);
  switch (match[2]) {
    case "d":
      return val * 86400000;
    case "h":
      return val * 3600000;
    case "w":
      return val * 604800000;
    case "m":
      return val * 2592000000;
    default:
      return 86400000;
  }
}
