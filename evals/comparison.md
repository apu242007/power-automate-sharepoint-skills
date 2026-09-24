# With vs. without the skill: an 8-symptom comparison (2026-09-24)

**What was measured.** Eight real symptoms were each answered twice by the same model: once **without** the skill (own knowledge only, no tools) and once **with** it (the agent had to invoke the skill and open the reference it routed to). Answers were limited to 180 words. Each answer was scored against a list of **verified facts** for that symptom (taken from the skill's own reference files and their Microsoft Learn sources).

**Compliance check.** The "without" runs used **0 tool calls**; the "with" runs used **2** (skill + one reference file).

## Results

| Symptom | Facts checked | Without | With | What the skill added |
|---|---:|---:|---:|---|
| New flow returns 401, run history empty | 5 | 5 | 5 | Nothing decisive; it added the exact wording of the default and a caveat about what was not verified |
| `Route did not match` on *Get file content* | 3 | 2 | 3 | `{Name}` has no extension; the alternative *using path* action |
| Green run, attachments missing | 6 | 4 | 6 | Do not use `Response` in the Catch; a handled failure still marks the `Foreach` as failed |
| `Get items` returns 100 rows / empty past 5,000 | 7 | 5 | 7 | The documented "empty if no match in the first 5,000" limitation; `_x0020_` in column names |
| Works on mobile data, fails on the office network | 5 | 2 | 5 | DLP and dedicated environment, regional domain variants, an explicit "not verified" on the IP firewall |
| IT will not grant tenant-wide permissions | 7 | 4 | 7 | Do not add `ReadWrite.All` (it defeats the restriction), what a 403 means, revocation with `DELETE` |
| A rarely used flow turned itself off | 5 | 1 | 5 | 14-day failure rule, the **Premium/Process exemption**, throttling rule, 30-day warning |
| "Disabled by your organization" on the HTTP trigger | 6 | 2 | 6 | The three HTTP connectors, the flow checker, same-group policy, network domains |
| **Total** | **44** | **25 (57%)** | **44 (100%)** | |

## How to read this honestly

- **The model already gets the headline cause** in all eight cases, and in some it was excellent without the skill (for example the `Sites.Selected` answer, or naming both network domains). A strong agent does not fail on these symptoms.
- **What the skill changes is the second-order detail**: exemptions, exact numbers, caveats, the "do not do this" warnings, and a section number for every claim. Without the skill some answers also contained **unverified or imprecise statements** (for example attributing the 100,000-row pagination threshold to a Premium license, or saying an `Apply to each` can end green when an iteration fails).
- **The score is biased in the skill's favor by construction**: the facts were drawn from the skill itself, so "with" is near 100% by design. Read it as *coverage of verified facts*, not as accuracy of the diagnosis.
- **n = 1 per condition**, one model, manual scoring. It is a demonstration, not a benchmark. Re-run it with your own symptoms.

## Reproduce

Ask an agent the same question in two sessions: one told not to use any tool, one told to invoke `spa-sharepoint-power-automate` first and open the reference it routes to. Score against the facts listed in the corresponding reference file.
