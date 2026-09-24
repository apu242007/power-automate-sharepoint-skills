# Security policy

## Scope

This repository contains **documentation and helper scripts for AI agents**. It does not ship a service. Security-relevant reports include:

- A **private value** published by mistake (tenant, email, trigger URL with `sig=`, credential).
- Guidance that could lead a reader to **weaken a security control** or expose data.
- A helper script that behaves unsafely (unbounded retries, secrets in logs, unsafe defaults).
- A **prompt-injection-style instruction** hidden in a reference file.

## Reporting

Use **GitHub private vulnerability reporting** (Security → *Report a vulnerability*) when it is enabled, or open an issue **without the sensitive value** and ask for a private channel. Please include the file and line.

Expected handling: acknowledgement within a few days; removal of a leaked value first (and a note that it must be **rotated**, since git history and forks keep old content), then a correction release.

## What the skill itself promises

- **No credentials.** Keys shown in examples are placeholders. The `VITE_` variables and trigger URLs are described as **public by design**; nothing here should ever be a real secret.
- **Delegated-token techniques** (see the responsible-use notes in §18.1 and §20.2) are documented for **your own access and your organization's policy**. They are visible in sign-in logs and are not a replacement for an approved app registration (`Sites.Selected`, §32).
- **No telemetry, no network calls at install time.** Scripts under `scripts/` and any bundled `assets/` only run when you run them, and read secrets from environment variables.

## Supply-chain hygiene

CI runs the official skill validator, a privacy scan, static evals and a link check on every push. Reviewers should read any new script before merging.
