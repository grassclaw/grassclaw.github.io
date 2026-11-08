"use client"

import data from "@/data/director-page.json"
import { Target, Compass, Layers } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

type Area = { name: string; receipt: string }
type Emphasis = { name: string; line: string }
type LensOrder = Record<string, { label: string; areas: string[]; emphasis: string[] }>

function ordered<T extends { name: string }>(items: T[], names?: string[]): T[] {
  if (!names) return items
  return names.map((n) => items.find((i) => i.name === n)).filter((i): i is T => Boolean(i))
}

// The director-level read of the record: areas with a receipt each, then the three
// conversations the next role should be about. The active lens in the hero reorders
// both and lights the three areas that matter most for that role.
// Content and per-lens order live in data/director-page.json.
export function DirectorAreas() {
  const { currentVariation } = usePortfolio()
  const lens = (data.lensOrder as LensOrder)[currentVariation]
  const areas = ordered(data.areas as Area[], lens?.areas)
  const emphasis = ordered(data.emphasis as Emphasis[], lens?.emphasis)
  const lead = new Set(lens ? lens.areas.slice(0, 3) : [])

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-spectra-cyan">What I am hired for</span>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Areas, each with its receipt</h2>
        <p className="text-sm text-muted-foreground">No skill without a number, a shipped system, or a published page behind it.</p>
        {lens && (
          <p key={currentVariation} className="mt-2 inline-flex items-center gap-2 text-sm text-card-foreground/90 animate-renarrate">
            <Layers className="h-3.5 w-3.5 text-spectra-cyan" />
            Ordered for the <span className="font-semibold text-spectra-cyan">{lens.label}</span> lens; the first three lead.
          </p>
        )}
      </div>
      <div key={currentVariation} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-renarrate">
        {areas.map((a) => (
          <div
            key={a.name}
            className={`rounded-2xl border bg-card/40 p-5 backdrop-blur-sm transition-colors duration-300 ${
              lead.has(a.name) ? "border-spectra-cyan/50 shadow-lg shadow-spectra-blue/10" : "border-border/60"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-secondary/50 text-spectra-cyan">
                <Target className="h-3.5 w-3.5" />
              </span>
              <h3 className="font-display text-base font-semibold leading-tight">{a.name}</h3>
            </div>
            <p className="text-sm leading-relaxed text-card-foreground/85">{a.receipt}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-spectra-violet/30 bg-spectra-violet/[0.06] p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Compass className="h-4 w-4 text-spectra-violet" />
          <h3 className="font-display text-lg font-semibold">Where I want the next conversation to be</h3>
        </div>
        <ol key={currentVariation} className="grid gap-4 sm:grid-cols-3 animate-renarrate">
          {emphasis.map((e, i) => (
            <li key={e.name}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">0{i + 1}</div>
              <div className="mt-1 font-medium">{e.name}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
