# VerifAI 🔍

> **Open-source AI output verification** — Record, audit, and enforce trust in AI-generated code.

[![CI](https://github.com/sy3089682-crypto/VerifAI/actions/workflows/ci.yml/badge.svg)](https://github.com/sy3089682-crypto/VerifAI/actions/workflows/ci.yml)
[![CodeQL](https://github.com/sy3089682-crypto/VerifAI/actions/workflows/codeql.yml/badge.svg)](https://github.com/sy3089682-crypto/VerifAI/actions/workflows/codeql.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/verifai)](https://www.npmjs.com/package/verifai)

---

## The Problem

41% of all committed code is now AI-generated. Only **33% of developers trust it**.

AI tools generate code faster than humans can review it. Bugs that look correct, pass tests, and cause production incidents at 3 AM. Black box decisions hidden inside confident-sounding output. Enterprises spending billions on AI they cannot trust.

**VerifAI is the trust layer for AI-generated code.**

## What It Does

```bash
# Initialize in your project
npx verifai init

# Record an AI decision
npx verifai track -m "claude" -p "create auth middleware" -o "src/auth.js"

# View the audit trail
npx verifai audit

# Enforce invariants on generated code
npx verifai enforce ./src --rules .verifai/invariants.json
```

## Why VerifAI

| Feature | What it solves |
|---------|---------------|
| **Decision Recording** | Every AI output is recorded with full context |
| **Drift Detection** | Automatically detects when AI output drifts from intent |
| **Invariant Enforcement** | Validate code against security, style, and correctness rules |
| **Audit Trail** | Complete, queryable history of every AI decision |
| **Zero Cost** | Free, open source, runs entirely locally |

## Quick Start

```bash
# No installation required
npx verifai init my-project
cd my-project

# Record your AI development session
npx verifai track -m "claude" -p "build user auth" -o "src/auth.js"

# Check what was generated
npx verifai audit

# Validate output against security rules
npx verifai enforce src/auth.js
```

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  AI Agent   │───▶│   VerifAI    │───▶│  Production │
│ (Claude,    │    │              │    │  Codebase   │
│  GPT, etc)  │    │  Record ✓    │    │             │
└─────────────┘    │  Audit   📋  │    └─────────────┘
                   │  Enforce ⚡  │
                   └──────────────┘
                            │
                   ┌────────▼────────┐
                   │  .verifai/      │
                   │  ├─ decisions   │
                   │  ├─ config.json │
                   │  └─ invariants  │
                   └─────────────────┘
```

## Built From a Phone

VerifAI was built entirely from an Android phone using Termux. No laptop. No desk. No funding.

If a developer with a phone can build the trust layer for AI-generated code, imagine what you can build too.

## License

MIT — free for personal and commercial use.

---

<p align="center">
  <sub>Built with ❤️ from a phone. <a href="https://github.com/sy3089682-crypto/VerifAI">Star on GitHub</a></sub>
</p>
