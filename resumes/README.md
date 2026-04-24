# Dynamic resumes

Resumes in this folder are **generated** from the data in `/data/` — do not hand-edit the `.md` output. Hand-written backups use the `.handwritten.md` suffix.

## Generate a resume

```bash
pnpm resume <role-id>
# or
node scripts/render-resume.mjs <role-id>
```

Reads `data/roles/<role-id>.json` → writes `resumes/<role-id>.md`.

## Add a new role

Role configs live in `data/roles/*.json` and are **gitignored** — they carry per-application context (recruiter names, posting dates) and stay local.

1. Create `data/roles/<new-role>.json` with the schema below
2. Set `anglePrimary`, `angles`, `tagEmphasize`, `omitIds`, `introOverride`, `whyCompany`, and any section toggles
3. Run `pnpm resume <new-role>`

Schema:

```json
{
  "id": "<role-id>",
  "company": "<Company>",
  "role": "<Role title>",
  "anglePrimary": "architecture | ml-ai | cybersecurity | research | leadership",
  "angles": ["architecture", "..."],
  "tagEmphasize": ["threat-intel", "..."],
  "omitIds": ["<work-experience-id-to-omit>"],
  "introOverride": "...",
  "whyCompany": "...",
  "headerSubtitle": "...",
  "maxBulletsPerJob": 6,
  "includeSections": {
    "technicalSkills": true,
    "experience": true,
    "research": true,
    "education": true,
    "publicService": false,
    "extracurriculars": false,
    "whyCompany": true
  }
}
```

## The 5 angles

Defined in `data/resume-variations.json`:

- `architecture` — Principal / Staff / Lead Architect roles
- `ml-ai` — ML engineer / AI researcher roles
- `cybersecurity` — SOC / threat-intel / detection engineering
- `research` — R&D labs, academic, DARPA-adjacent
- `leadership` — Tech lead, Staff+, Director

A role picks one `anglePrimary` (drives intro) plus any number in `angles` (drives filter). Jataware is `architecture ∩ ml-ai ∩ research ∩ cybersecurity ∩ leadership`.

## Data model

Each item (job, degree, research, etc.) has two tag axes:

- `angles: []` — which of the 5 angles this item supports (primary filter)
- `tags: []` — descriptive/domain tags (emphasis + keyword match)

Bullets also carry `weight` (1 = must-include, 2 = good, 3 = if-space). The renderer ranks bullets by weight; `tagEmphasize` on the role nudges matching bullets higher.

## Export to Word

Hand the generated `.md` to Claude in a fresh chat:

> Convert this markdown resume to a Word doc using a clean modern single-column template.

The structure is intentionally friendly to Word conversion — no tables, consistent heading hierarchy, plain bullets.
