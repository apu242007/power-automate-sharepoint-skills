# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/) · Versioning: [SemVer](https://semver.org/) (see `CONTRIBUTING.md`).
Platform facts were verified against Microsoft Learn on the date of each entry; re-verify before relying on them.

## [Unreleased]

### Planned (known gaps)
- English translation of the index and the verified reference sections (§21–§26).
- Server-side PDF generation (Word template + conversion), maps and field GPS, offline queue, Approvals connector vs link-based approval, Teams / Adaptive Cards, trigger conditions and child flows.

## [1.3.0] - 2026-09-24

### Added
- §34 Starter kit: `assets/spa-starter/` (Vite + React + TypeScript SPA with signature pad, photo compression, versioned draft, service worker and a send client with idempotent retries; 108 tests) and four dependency-free helper scripts (`test-flow`, `spfetch`, `sp-upload-test-file`, `make-icons`).
- CI job that typechecks, tests and builds the starter on every change.
- Two more static evals (27 total).

### Not verified
- The starter has not been exercised in a real browser (canvas compression, touch signature, installed service worker), on a real GitHub Pages deploy, or against a real flow/SharePoint. See §34.7.

## [1.2.0] - 2026-09-24

### Added
- §29 Tenant governance: DLP (the three HTTP connectors), IP firewall, conditional access, corporate-network domains, what to ask IT.
- §30 Email from flows: connector limits, message and attachment size, shared mailbox, patterns.
- §31 Reporting: Power BI on SharePoint lists (refresh limits, 12 joins, UTC), dashboards.
- §32 `Sites.Selected` and Microsoft Graph with least privilege.
- §33 Personal data in field apps (Ley 25.326 overview, technical checklist; not legal advice).
- §14 test pyramid update.
- Repo: `marketplace.json`, CI (official validator, structure check, privacy scan, static evals, link check), `evals/`, CONTRIBUTING, SECURITY, issue and PR templates.

## [1.1.0] - 2026-09-24

### Added
- §26 Solution-aware flows by code (PAC CLI, Dataverse `workflow` table) and the official support warning for `api.flow.microsoft.com`.
- §27 SharePoint list design as a backend.
- §28 Flows triggered by a file uploaded to SharePoint.
- §25.4 Ecosystem survey; §17 four new catalog rows; §15 "if a fix does not work" guidance.

### Changed
- `SKILL.md` description shortened to satisfy the 1024-character limit; added `license` and `metadata.version`.

## [1.0.0] - 2026-09-24

### Added
- Split the single 144 KB `SKILL.md` into a light index plus `references/` (sections §1–§20 unchanged, verified by exact reconstruction).
- §21 Trigger authentication, licensing, limits and automatic suspension.
- §22 Resilience: try/catch, retries, concurrency, sensitive data.
- §23 SharePoint at scale: thresholds, pagination, throttling.
- §24 Solutions, connection references, environment variables and flow auditing.
- §25 Registry of evaluated third-party tools.
