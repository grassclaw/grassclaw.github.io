"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Linkedin, Github, Sparkles, X } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"
import { SpectraSphere, type Beacon } from "@/components/portfolio/spectra-sphere"

// Scattered "live" nodes on the sphere. These — and only these — glow and are
// clickable. Edit freely: `i` is a lattice index 0..759 (pick spread values),
// `href` opens a new tab, `modal` opens the in-page panel keyed in MODALS.
const SPHERE_BEACONS: Beacon[] = [
  { i: 58, label: "LinkedIn", href: "https://www.linkedin.com/in/cyberaaron/" },
  { i: 232, label: "GitHub", href: "https://github.com/grassclaw" },
  { i: 421, label: "The resume engine", modal: "engine" },
  { i: 655, label: "What I build", modal: "build" },
]

const MODALS: Record<string, { title: string; body: string }> = {
  engine: {
    title: "The résumé engine",
    body: "This page is the front end of a résumé engine. Every framing you see is generated from a single source of truth — the same engine that, given a pasted job description, re-emphasizes the record to match the role you're hiring for. Live tailoring is coming soon.",
  },
  build: {
    title: "What I build",
    body: "Principal-level architecture across NetSTAR's full security-solutions portfolio — platform patterns, integration contracts, and evaluation frameworks — and I prove the design by building it: LLM categorization at scale, MCP servers, and durable Temporal workflows.",
  },
}

const roles = [
  {
    id: "architecture",
    short: "Architect",
    title: "Principal Engineer & Architect",
    subtitle: "Platform Design · Integration Contracts",
    description:
      "Principal-level architect and engineering lead. I work at the architecture layer — platform patterns, integration contracts, evaluation frameworks — and prove the design by building it. Currently own architectural design across NetSTAR's full security-solutions portfolio.",
    badges: ["Architecture", "MCP", "Temporal", "OSCAL", "AWS", "Python"],
    variation: "architecture" as const,
  },
  {
    id: "ai-ml",
    short: "AI / ML",
    title: "Senior AI / ML Engineer",
    subtitle: "LLM Pipelines · Graph Neural Networks",
    description:
      "Senior ML / AI engineer with six years shipping research-grade systems into production. LLM categorization pipelines classifying 40M+ domains quarterly, GNN architectures, MCP servers, and AI model-security scanning on Temporal durable workflows.",
    badges: ["LLMs", "LangChain", "GNN", "AWS Bedrock", "Python", "Golang"],
    variation: "ml-ai" as const,
  },
  {
    id: "threat-intel",
    short: "Threat Intel",
    title: "Threat Intelligence Researcher",
    subtitle: "OSINT · Detection Engineering",
    description:
      "Cybersecurity researcher and threat-intelligence architect. Designed platforms unifying STIX/TAXII, MITRE ATT&CK, and federal CISA AIS feeds; initiated NetSTAR Shield end-user protection; peer-reviewed research on AI-driven threat detection.",
    badges: ["Threat Intelligence", "STIX/TAXII", "KQL", "MITRE ATT&CK", "CISA AIS", "Python"],
    variation: "cybersecurity" as const,
  },
]

export function HeroSection() {
  const { currentVariation, setCurrentVariation } = usePortfolio()
  // The active lens is the single source of truth. When no lens is applied
  // ("default" / Show everything) the narrative falls back to Architect but no
  // pill is marked active, so the switcher never claims a framing the record
  // below isn't actually showing.
  const activeRole = roles.find((role) => role.variation === currentVariation) || null
  const currentRole = activeRole || roles[0]
  const selectedRole = activeRole?.id ?? null

  const handleRoleChange = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    if (role) setCurrentVariation(role.variation)
  }

  // Beacon activation: external links open a tab, modal beacons open the panel.
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const handleBeacon = (b: Beacon) => {
    if (b.href) window.open(b.href, "_blank", "noopener")
    else if (b.modal) setActiveModal(b.modal)
  }

  useEffect(() => {
    if (!activeModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [activeModal])

  const modal = activeModal ? MODALS[activeModal] : null

  return (
    <header className="relative overflow-hidden">
      {/* Atmospheric dot-sphere — sits off the right edge, behind everything.
          On mobile it drifts to center-top, very faint. A left-fading veil
          keeps the copy legible so the message always leads. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <SpectraSphere
          beacons={SPHERE_BEACONS}
          onActivate={handleBeacon}
          className="absolute right-[-22%] top-1/2 h-[150%] w-[80%] -translate-y-1/2 opacity-50 sm:right-[-12%] sm:w-[62%] sm:opacity-60 lg:right-[-6%] lg:w-[52%] lg:opacity-70"
        />
        {/* Veil: darken/fade the left two-thirds so words dominate */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        {/* Soft top/bottom feather into the page */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Container is click-through so the live sphere behind it stays grabbable;
          the text column re-enables pointer events for its controls + text. */}
      <div className="container pointer-events-none relative mx-auto max-w-6xl px-4 pt-14 pb-10 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Editorial text column — leads, anchored left */}
          <div className="order-1 text-center pointer-events-auto lg:text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-spectra-cyan animate-rise">
              Principal Architect · AI/ML · Threat Intelligence
            </p>

            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl animate-rise">
                Aaron <span className="spectra-text">E</span>
              </h1>
              {/* Portrait sits right beside the name across all breakpoints */}
              <div className="relative shrink-0">
                <div
                  className="absolute -inset-2 rounded-full opacity-25 blur-xl spectra-bg"
                  aria-hidden="true"
                />
                <img
                  src="/images/design-mode/aaron-headshot.png"
                  alt="Aaron E"
                  className="relative h-16 w-16 rounded-full border border-border/50 object-cover shadow-lg shadow-black/30 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                />
              </div>
            </div>

            {/* Reframe control — the human half of the resume engine */}
            <div className="mt-6">
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Sparkles className="h-3.5 w-3.5 text-spectra-violet" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Viewing Aaron as
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Reframe profile for a role"
                className="mt-2 flex w-full max-w-2xl gap-1 rounded-xl border border-border/60 bg-secondary/40 p-1"
              >
                {roles.map((role) => {
                  const active = role.id === selectedRole
                  return (
                    <button
                      key={role.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleRoleChange(role.id)}
                      className={`relative flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${
                        active
                          ? "spectra-bg text-[#070d1d] shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {role.short}
                    </button>
                  )
                })}
              </div>

              <p className="mt-2 max-w-2xl text-center text-xs text-muted-foreground lg:text-left">
                The same career, reframed for the role you&apos;re hiring for — experience below re-emphasizes to match.
              </p>
            </div>

            {/* Re-narrated block — crossfades on each role switch (key re-triggers the animation) */}
            <div key={selectedRole} className="animate-renarrate">
              <div className="mt-6 min-h-[3.5rem]">
                <h2 className="font-display text-xl text-foreground sm:text-2xl">{currentRole.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">{currentRole.subtitle}</p>
              </div>

              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground lg:mx-0">
                {currentRole.description}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                {currentRole.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="outline"
                    className="border-border/70 bg-secondary/40 text-secondary-foreground"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2 border-border/70 bg-transparent hover:bg-secondary/50 hover:text-foreground"
                  onClick={() => window.open("https://www.linkedin.com/in/cyberaaron/", "_blank")}
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-border/70 bg-transparent hover:bg-secondary/50 hover:text-foreground"
                  onClick={() => window.open("https://github.com/grassclaw", "_blank")}
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-spectra-blue" />
                Working remotely · West Coast, USA
              </div>
            </div>

            {/* Honest forward-looking signal: this page is the front end of a resume engine. */}
            <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-spectra-violet/30 bg-spectra-violet/10 px-3 py-1.5 text-xs text-card-foreground/85">
                <Sparkles className="h-3.5 w-3.5 text-spectra-violet" aria-hidden="true" />
                Tailor this resume to a job description
                <span className="rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  Coming soon
                </span>
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-center text-xs text-muted-foreground/80 lg:text-left">
              Each view is generated from a single source of truth — the same engine that renders a
              role-tailored resume from a pasted job description.
            </p>
          </div>

          {/* Right column intentionally empty — the spectral sphere renders
              behind the whole hero; the portrait now sits beside the name. */}
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <div className="h-px w-full spectra-bg opacity-30" />
      </div>

      {/* Beacon modal — opened by clicking a `modal` node on the sphere. */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={modal.title}
          onClick={() => setActiveModal(null)}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-2xl shadow-black/50 animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-spectra-violet" aria-hidden="true" />
              <h3 className="font-display text-lg text-foreground">{modal.title}</h3>
            </div>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{modal.body}</p>
          </div>
        </div>
      )}
    </header>
  )
}
