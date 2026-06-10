import { appendRecord } from "./store.js";

export async function recordDecision(record) {
  if (!record.model || !record.prompt || !record.output) {
    throw new Error("record must include model, prompt, and output");
  }

  const entry = {
    ...record,
    id: record.hash,
    verified: false,
    drift: null,
  };

  appendRecord(entry);

  if (record.output && typeof record.output === "string") {
    try {
      const { detectDrift } = await import("./enforcer.js");
      entry.drift = detectDrift(record.prompt, record.output);
      entry.verified = entry.drift.length === 0;
      appendRecord(entry);
    } catch {
      // drift detection is optional
    }
  }

  return entry;
}
