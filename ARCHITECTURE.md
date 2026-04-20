# Architecture notes

Design considerations for the portfolio + dynamic-resume system. Read this before extending.

## The five angles

The portfolio projects Aaron's experience through five lenses:

| Angle | Target market | Who it's for |
|---|---|---|
| `architecture` | Principal / Staff / Lead Architect roles | Systems-design signal: platforms, integration contracts, evaluation frameworks |
| `ml-ai` | ML Engineer / AI Researcher roles | LLM / GNN / MLOps specialist — research-to-production |
| `cybersecurity` | SOC / Threat Intel / Detection Eng | Standards-native work: STIX, MITRE, CISA AIS |
| `research` | R&D labs, academic, DARPA-adjacent | Published + in-prep papers, UArizona lab |
| `leadership` | Tech Lead, Staff+, Director | Cross-team direction, civic roles, mentorship |

Why five, not three or seven:
- Three (the original `software` / `cybersecurity` / `webux`) was too generic and didn't map to modern job markets. `software` meant nothing. `webux` hadn't been Aaron's lead identity in years.
- Seven would force artificial distinctions (e.g., `data-engineering` vs `ml-ai`). Current five are the **natural cleavages in Aaron's career story**.
- Real roles sit at intersections. Jataware Engineering = `architecture ∩ ml-ai ∩ research ∩ cybersecurity ∩ leadership`. The role layer (`data/roles/`) is where you compose.

Extending: adding a sixth angle is a breaking change. Audit every item's `angles[]` array before adding — a new angle only earns its spot if ≥3 items belong to it AND no existing angle covers the same market.

## Dual-axis tagging

Every item has two independent tag axes:

- **`angles[]`** — which of the 5 angles this item supports. Drives the primary projection filter. Curated sparingly — most items belong to 1–3 angles.
- **`tags[]`** — descriptive / domain tags (e.g., `threat-intel`, `llm`, `federal`, `platform`). Drives emphasis ranking, keyword highlighting, and secondary filters. Additive, broad.

Why split them:
- Flat tag arrays rot. The pre-refactor state had every item tagged with 10–15 broad tags, making filters a no-op.
- Two axes keep selection (which items) and emphasis (which bullets first) as separate decisions.
- Violates no explicit rule if kept clean. Audit `angles[]` quarterly — any angle with >80% of items tagged is a signal the filter isn't selective.

Never add an angle to an item just because "it might apply." If it doesn't strongly support that projection, leave it off. Empty `angles: []` is fine (e.g., `barrick-2018` Environmental Engineer) — the item just won't surface in any angle-based resume, which is correct.

## Bullet weights

Each bullet carries a `weight`:

- `1` — must-include. Headline impact, top line for the role.
- `2` — good. Include when there's space.
- `3` — fallback. Include only on long formats or when it matches a role's emphasis.

The renderer sorts bullets by weight within each phase, then applies a `-0.5` nudge if the bullet's tags intersect with the role's `tagEmphasize[]`. This makes per-role emphasis declarative without rewriting bullets.

## `titleHistory[]` — jobs as sequences of phases

Jobs are not single-title entities. A long tenure with promotions is the rule, not the exception. The `work-experience.json` schema models jobs as:

```
Job {
  company, location, period, employmentType,
  angles[], tags[],
  titleHistory: [
    { title, period, description, angles[], bullets[] },  // most recent first
    { title, period, description, angles[], bullets[] },
    ...
  ],
  stack[]
}
```

Consequences:
- Promotion **is visible** in the UI (timeline component) and the markdown resume (stacked sub-titles). Don't lose that signal by flattening to a single current title.
- When adding a promotion: prepend a new entry to `titleHistory` (most-recent first), move any bullets that no longer apply into the older phase. Don't merge bullets across phases — each phase's bullets describe work done *during that phase*.
- Older phases typically get fewer bullets (1–3) and lower weights (2–3). Current phase carries the weight-1 bullets.

## Role config layer

`data/roles/<id>.json` is a **projection** of the shared data for one target role. Fields:

- `anglePrimary` — drives intro text + hero positioning
- `angles[]` — items must match at least one
- `tagEmphasize[]` — nudges matching bullets higher in ranking
- `omitIds[]` — hard-removes items (IDs, not patterns)
- `introOverride` — bypasses the angle-default intro
- `whyCompany` — optional closer paragraph
- `headerSubtitle` — tag line under the name
- `maxBulletsPerJob` — caps bullets per phase
- `includeSections` — toggles major sections

Pattern inspired by OSCAL: shared canonical data + per-consumer projection. New roles copy `jataware-engineering.json` and tune. The renderer is the projection engine.

## The legacy-shape adapter

`lib/portfolio-data.ts` has `asLegacyJob()`, which synthesizes `title`, `description`, `bullets`, `skills`, `type` fields from the new `titleHistory[]` structure so the React components that were built against the old flat shape keep working without being rewritten.

This is explicit tech debt. Retire it when:
- All consumers read from `titleHistory[]` directly (partially done — `work-experience.tsx` handles both paths)
- Or when you feel confident rewriting the remaining components

Until then: do not remove `asLegacyJob()`. It's load-bearing.

## UI: when the timeline fires

`JobTimeline` component renders only for jobs where `titleHistory.length > 1`. Single-phase jobs render the flat bullet list as before. This keeps simple jobs simple and reserves the vertical timeline + collapse UI for genuine progression stories.

Default expand state:
- Phase 0 (most recent) — expanded
- All other phases — collapsed
- Exception: if a search query matches a phase, that phase auto-expands
- Exception: if the user manually toggles a phase, their toggle wins

Don't fight the default by opening all phases — it defeats the "focus on current, reveal history on demand" intent.

## Hardcoded components that ignore the data

Some components hold their own hardcoded content and do not consume `portfolioData`:

- `components/portfolio/technical-proficiencies.tsx` — has its own skill list
- `components/portfolio/skills-graph.tsx` — has its own node graph
- `components/portfolio/government-service.tsx` — has its own census data

When data and these components drift, edit the component directly. Do NOT add a "data-source" abstraction just to sync them — they exist because their layout needs specific shape that would be awkward to express in JSON.

## What the markdown renderer is NOT

- Not a general-purpose CV builder. It's *Aaron's* portfolio with opinionated section ordering.
- Not a template engine. No loops/conditionals in strings — plain TS functions compose the output. If you need a new section, write a `renderX()` function and slot it into the `sections[]` array.
- Not responsible for PDF/DOCX. Hand the `.md` to Claude in a fresh chat with "convert to Word" and let Claude do the conversion — that's by design (separation of concerns: data → markdown is deterministic; markdown → Word is aesthetic judgment).

## Safety rails

- `.gitignore` excludes `resumes/*` except `README.md`. Generated resumes (including `.docx`/`.pdf` exports) stay local.
- `.handwritten.md` suffix marks manually-authored reference copies. If renderer output drifts from expectation, diff against the handwritten version to find regressions.
- `data/personal-info.json` is **public** when pushed. Contact info there (email, LinkedIn, GitHub) is the same as on the public LinkedIn. Clearance field says "Eligible" deliberately — real clearance status only belongs in secure submissions.

## Known unfinished

- Some components (`hero-section.tsx`, `academic-research.tsx`) still hardcode role-specific copy that duplicates `data/resume-variations.json` intro text. When copy changes, remember both places.
- `app/page.tsx` references `searchKeywordsData` from `data/search-keywords.json` — that file predates the refactor and hasn't been updated. Out of date, but non-breaking.
- `lib/keyword-parser.ts` — legacy, may be unused. Audit before deleting.
