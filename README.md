# Aaron E Portfolio

The public, high-level read: what I am hired for, the companies I have worked with, and where I want the
next conversation to be. The full resume is not published here; ask for one.

## What is on the page

- A role lens in the hero (Architect, AI / ML, Threat Intel) that reorders the areas and emphasis below it
- "What I am hired for": six areas, each with its receipt, and three emphasis areas
- Companies, one line each, grouped by employers, my own practice and communities
- An interactive skills graph, and tabs for research and talks, public service, extracurriculars and education

Page copy and the per-lens order live in `data/director-page.json`.

## Deployment

GitHub Actions builds the static export and publishes it to GitHub Pages on every push to `master`.

## Development

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to view the portfolio locally.
