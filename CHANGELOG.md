# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/) · Versioning: [SemVer](https://semver.org/) (see `CONTRIBUTING.md`).
Platform facts were verified against Microsoft Learn on the date of each entry; re-verify before relying on them.

## [Unreleased]

### Planned (known gaps)
- English translation of the remaining sections (§1–§20, §24, §25, §27, §28, §31, §33, §34).
- Server-side PDF generation (Word template + conversion), maps and field GPS, offline queue, Approvals connector vs link-based approval, Teams / Adaptive Cards, trigger conditions and child flows.
- Find which post-import step (open, turn on, run) actually starts a solution flow that uses a connection reference.
- Power Apps authoring (`pac canvas`, `pac power-apps` appeared in `pac` 2.12); today the skill covers Power Apps only as a caller of the flow.

## [1.4.2] - 2026-09-24

### Added
- §26.7 completed with an end-to-end test against SharePoint: a scheduled flow with REST calls created a list and a column, and an HTTP-trigger flow wrote a row (the outside POST returned 200 with the row `Id`).
- Trap: the "Create item" action validates dynamic columns against the real list on save (`WorkflowOperationParametersExtraParameter`), so a missing list keeps the flow in draft.
- The `@coalesce(...)` fix now tested (real boolean); what was not confirmed is stated.

### Changed
- README rewritten around the use case (an agent builds the page, the flow and the list from your computer), with a table of what was tested and what was not.

## [1.4.1] - 2026-09-24

### Added
- §26.7 (Spanish and English): a recipe tested with `pac` 2.12.2 in a developer environment for creating an HTTP flow from scratch: install and device-code sign-in, solution project, flow JSON, registration in `Customizations.xml` / `Solution.xml`, pack, import, activation, an outside POST, run history with `pac power-automate list-flow-runs`, and a change by code. Traps observed and marked NOT VERIFIED outside the test: GUID letter case in `pack` / `import`, the connection reference format, `@{...}` returning text. What was not tested is stated.

### Added (evaluation)
- `evals/comparison.md`: an 8-symptom with/without comparison (25/44 verified facts without the skill, 44/44 with it; n = 1, facts drawn from the skill, so biased by construction).

### Changed
- README: removed the claim that agents "usually answer with generic advice"; the comparison shows a strong agent gets the headline cause and the skill adds second-order detail, caveats and sources.

## [1.4.0] - 2026-09-24

### Added
- English translations of §21, §22, §23, §26, §29, §30 and §32 in `references/en/` (same file names and `§` numbers; the Spanish files stay the source of truth) and an English quick router in `SKILL.md`.
- `check-skill` verifies each translation keeps the same section numbers, headings and code fences as its Spanish original; two English evals.

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
