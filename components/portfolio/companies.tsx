"use client"

import data from "@/data/director-page.json"
import { ExternalLink } from "lucide-react"

type Row = { who: string; when: string; line: string; href?: string }

// One line per company, in three groups. The full record (every role, every bullet,
// lens-filtered) stays underneath behind "Show the full record".
export function Companies() {
  return (
    <div className="space-y-8">
      {data.groups.map((g) => (
        <div key={g.name}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-spectra-cyan">{g.name}</h3>
          <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm">
            {(g.rows as Row[]).map((r) => (
              <li key={r.who} className="grid gap-1 px-5 py-4 sm:grid-cols-[15rem_1fr] sm:gap-6">
                <div>
                  <div className="font-medium text-card-foreground">
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noopener" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                        {r.who}
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    ) : (
                      r.who
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{r.when}</div>
                </div>
                <p className="text-sm leading-relaxed text-card-foreground/85">{r.line}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
