# power-automate-sharepoint-skills

[![Validate](https://github.com/apu242007/power-automate-sharepoint-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/apu242007/power-automate-sharepoint-skills/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/agent%20skills-agentskills.io-informational)](https://agentskills.io/specification)

**An agent skill that knows why your Power Automate + SharePoint pipeline broke.**
It carries the traps that only show up at runtime, the limits and licensing that nobody warns you about, and the tenant policies your IT team applies, all with the exact symptom, the cause, and a fix, and with the platform facts checked against Microsoft Learn (with date and link).

> 🇪🇸 [Leer en español](README.es.md) · The skill content is written mostly in **Spanish** (with English where the platform terms are English).

## The problem it solves

You build a public, no-login web form (React/Vite or a static PWA on GitHub Pages) that POSTs to a **Power Automate HTTP-trigger flow** that writes to **SharePoint**. It works on your machine. Then:

- the new flow returns **401** to the browser and the run history is empty,
- the run is green but the **attachments are missing**,
- `Get items` returns **100 rows**, or nothing at all past **5,000**,
- the flow **stops on its own**, or fails with `DirectApiAuthorizationRequired`,
- it works on mobile data and fails on the **corporate network**,
- `Get file content` says `Route did not match` with a perfectly good path.

Agents usually answer these with generic advice ("check the connection"). This skill gives them the specific, verified answer.

## What you get

| | |
|---|---|
| **34 sections in 22 reference files**, routed from a light index | You only load what the task needs |
| **78 error-catalog rows** | Symptom → cause → fix, for runtime traps, not just documentation |
| **Platform limits and licensing, with sources and dates** | Trigger auth default, Premium, 120 s / 100 MB, thresholds, throttling, auto-suspension, DLP |
| **Two ways to work with flows as code** | Import package + admin API (unsupported, dev only) and the **supported** path: PAC CLI + Dataverse `workflow` table |
| **Design guidance** | Public-endpoint security, list design and indexes, resilience (try/catch, idempotent retries), personal data |
| **A tested starter kit** (`assets/spa-starter/`) | SPA with signature, photos, versioned draft, service worker and a send client with idempotent retries; 108 tests |
| **27 static evals + CI** | Official validator, structure, privacy scan and link check on every push |

## Try it: questions the skill is built for

| Ask your agent | It should route to |
|---|---|
| "My SPA gets 401 from the flow I just created" | §21.1: the default of *Who can trigger the flow* is **Any user in my tenant**, not *Anyone* |
| "The run is green but attachments are missing" | §22.1: an early `Response` plus a handled failure; end the Catch with `Terminate → Failed` |
| "`Get items` returns only 100 rows / empty on a big list" | §23: Top Count, Pagination, indexed columns, the 5,000 threshold |
| "It works on mobile data but not from the office network" | §29.4: domains IT must allow (`*.logic.azure.com`, `*.api.powerplatform.com`) |
| "How do I export, edit and re-import a solution flow from the CLI?" | §26: `pac solution export / unpack / pack / import`, deployment settings file |
| "IT will not give me tenant-wide permissions" | §32: `Sites.Selected` and a one-paragraph request IT can approve |
| "`Route did not match` on *Get file content*" | §28.2: pass the trigger's `{Identifier}`, not a hand-built path |

## Install

```bash
# any agent supported by the skills CLI (Claude Code, Codex, Copilot, Cursor, Gemini CLI, Cline, ...)
npx skills add https://github.com/apu242007/power-automate-sharepoint-skills --skill spa-sharepoint-power-automate
```

```text
# Claude Code plugin marketplace
/plugin marketplace add apu242007/power-automate-sharepoint-skills
/plugin install spa-sharepoint-power-automate@power-automate-sharepoint-skills
```

Or copy `skills/spa-sharepoint-power-automate/` into your agent's skills folder. Open a new session so the agent loads it, and **read any skill before installing it**: it runs with your agent's permissions.

## How the content is organised

`SKILL.md` is a light index (router from symptom to file, plus 16 non-negotiable rules). The detail lives in `references/`:

| § | Topic | File |
|---|---|---|
| 1 | Security model of a public endpoint | `01-seguridad.md` |
| 2–7 | SPA: Vite/Pages, React, forms, images/GPS/signature/PDF, persistence, service worker | `02-spa-cliente.md` |
| 8–9 | SPA ↔ flow contract; building the flow | `03-contrato-y-flow.md` |
| 10, 18 | SharePoint over REST; bulk Excel → SharePoint sync | `04-sharepoint.md` |
| 11–12 | GitHub Pages; credentials and device code | `05-deploy-y-credenciales.md` |
| 13–17 | Operations, diagnosis, build order, **error catalog** | `06-operacion-y-errores.md` |
| 19 | Field PWAs (Wake Lock, Web Push, state machine) | `07-pwa-operativa.md` |
| 20 | Flows as code: package, admin API, runtime traps | `08-flows-como-codigo.md` |
| 21 | Trigger auth, licensing, limits, auto-suspension | `09-licencias-limites-trigger.md` |
| 22 | Resilience: try/catch, retries, concurrency, sensitive data | `10-resiliencia-y-errores-flow.md` |
| 23 | SharePoint at scale: thresholds, pagination, throttling | `11-lecturas-sharepoint-a-escala.md` |
| 24 | Solutions, connection references, environment variables, auditing | `12-alm-soluciones-y-auditoria.md` |
| 25 | Third-party tools evaluated, ecosystem survey | `13-decisiones-de-herramientas.md` |
| 26 | Solution flows by code: PAC CLI and Dataverse | `14-soluciones-por-codigo-pac-dataverse.md` |
| 27 | SharePoint list design as a backend | `15-diseno-listas-sharepoint.md` |
| 28 | Flows triggered by a file upload | `16-flujos-disparados-por-archivos.md` |
| 29 | Tenant governance: DLP, IP firewall, conditional access, network | `17-gobernanza-del-tenant-dlp.md` |
| 30 | Email from flows | `18-correo-outlook.md` |
| 31 | Reporting and Power BI on lists | `19-reportes-power-bi-listas.md` |
| 32 | `Sites.Selected` and Graph with least privilege | `20-permisos-graph-sites-selected.md` |
| 33 | Personal data in field apps | `21-datos-personales.md` |
| 34 | Starter kit: tested SPA + scripts | `22-kit-de-arranque.md` |

## Why you can trust it

- **Sources and dates.** Platform facts end with a *Fuentes / Sources* block (Microsoft Learn). Anything not confirmed says **NO VERIFICADO / NOT VERIFIED**, and the origin (official docs, forum, own observation) is labeled.
- **Validated on every push**: the [agentskills.io reference validator](https://agentskills.io/specification), structure and link checks, a privacy scan (no tenants, emails, trigger URLs), and 27 static evals that keep the router and the key facts from regressing.
- **Honest about what changes.** Quotas and defaults change: for example, the default for *Who can trigger the flow* on new flows is **Any user in my tenant**, and Microsoft describes *Anyone* as the legacy mode. The changelog records what was checked and when.
- **Responsible-use notes** where a technique could be misread (§18.1, §20.2): delegated tokens only, visible in sign-in logs, not a replacement for an approved app registration.

## Scope and limits

- Field experience plus documentation research; **not official Microsoft documentation**, and not affiliated with Microsoft or any tool mentioned.
- Built around a real pipeline: public SPA/PWA → HTTP-trigger flow → SharePoint. Dataverse, Power Apps and SPFx are covered only where they touch that pipeline; Microsoft's own [`power-platform-skills`](https://github.com/microsoft/power-platform-skills) and [`pnp/sharepoint-skills`](https://github.com/pnp/sharepoint-skills) go deeper there and complement this one.
- Argentina-specific details exist (plate formats, holidays, Ley 25.326). §33 is a technical guide, **not legal advice**.

## Roadmap

See [CHANGELOG.md](CHANGELOG.md) → *Planned*: English translation of the verified sections, server-side PDF, maps/GPS, offline queue, Approvals vs link-based approval, Teams and Adaptive Cards.

## Contributing

Issues and pull requests are welcome, especially **new errors with the exact symptom** and **corrections of facts that changed** (with the source). Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). Never include tenants, company names, emails or trigger URLs.

## License

[MIT](LICENSE)
