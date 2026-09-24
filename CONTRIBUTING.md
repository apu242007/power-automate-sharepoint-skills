# Contributing / Cómo contribuir

Thanks for helping. This repo is a **verified knowledge base for agents**, so the bar is *evidence*, not volume.
Gracias por ayudar. Acá importa la **evidencia**, no la cantidad.

## What is welcome / Qué se acepta

1. **A new error, with its exact symptom.** The message as it appears (or the observable behavior), the cause, and a fix you tested. Add it as a row in the error catalog (`references/06-operacion-y-errores.md`, §17) and, if it belongs to a topic, in that topic's file.
2. **A correction of a fact that changed** (limits, defaults, licensing). Always with a link to Microsoft Learn and the date you checked it.
3. **A new section or reference** for an uncovered topic (see the gaps list in `CHANGELOG.md` / issues).
4. **Translations** of a section (Spanish ⇄ English). Keep the same `§` number and file layout.
5. **Evals**: a real question plus where the answer must live (see `evals/cases.json`).

## Ground rules / Reglas

- **Every platform fact needs a source and a date.** Use the *Fuentes* / *Sources* block at the end of the file. Say **NO VERIFICADO / NOT VERIFIED** when you could not confirm something. Numbers such as quotas and defaults change.
- **Label origin.** Official documentation vs. forum answer vs. your own observation. Do not present an observation as a documented limit.
- **No private data.** No tenants, company or project names, real emails, trigger URLs with `sig=`, client or tenant ids, screenshots with data. Use `<tenant>`, `usuario@empresa.com`, `x-app-key`. CI runs `node scripts/check-privacy.mjs`.
- **Do not add techniques to bypass a security control.** Describe what a control does, how to recognize it, and how to *ask for an exception*. Delegated, user-context techniques must state their scope and that they are visible in the sign-in logs.
- **Keep `SKILL.md` small.** It is an index (< 500 lines, description ≤ 1024 characters). Put detail in `skills/<name>/references/NN-topic.md`, one topic per file, one level deep, and add the row to the router and the index.
- **Section numbers are stable.** `§N` is referenced from other sections and from the evals. Never renumber; append.
- **Voice**: direct, imperative, with the exact symptom first. Spanish is the primary language; English is welcome.

## Before you open a pull request / Antes del PR

```bash
node scripts/check-skill.mjs      # frontmatter, index, links
node scripts/run-evals.mjs        # router + required facts
node scripts/check-privacy.mjs    # private data
npx skills-ref validate skills/spa-sharepoint-power-automate
```

Add a line to `CHANGELOG.md` under *Unreleased*.

## Versioning

Semantic versioning in `metadata.version` (frontmatter) and `.claude-plugin/marketplace.json`:
**patch** = fixes and new catalog rows · **minor** = new section or reference · **major** = restructuring that changes section numbers or routing.

## Reporting a problem in the content

Use the issue templates. A wrong fact is a bug: include the source that contradicts it.
