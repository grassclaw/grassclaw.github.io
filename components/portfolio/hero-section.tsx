"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Linkedin, Github, Sparkles } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"
import { SpectraSphere } from "@/components/portfolio/spectra-sphere"

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

  return (
    <header className="relative overflow-hidden">
      {/* Atmospheric dot-sphere — sits off the right edge, behind everything.
          On mobile it drifts to center-top, very faint. A left-fading veil
          keeps the copy legible so the message always leads. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <SpectraSphere className="absolute right-[-22%] top-1/2 h-[150%] w-[80%] -translate-y-1/2 opacity-50 sm:right-[-12%] sm:w-[62%] sm:opacity-60 lg:right-[-6%] lg:w-[52%] lg:opacity-70" />
        {/* Veil: darken/fade the left two-thirds so words dominate */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        {/* Soft top/bottom feather into the page */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 pt-14 pb-10 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Editorial text column — leads, anchored left */}
          <div className="order-1 text-center lg:text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-spectra-cyan animate-rise">
              Principal Architect · AI/ML · Threat Intelligence
            </p>

            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl animate-rise">
                Aaron <span className="spectra-text">E</span>
              </h1>
              {/* Mobile-only: super-small avatar right beside the name */}
              <img
                src="/images/design-mode/aaron-headshot.png"
                alt="Aaron E"
                className="h-10 w-10 shrink-0 rounded-full border border-border/50 object-cover opacity-80 shadow-md shadow-black/30 lg:hidden"
              />
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
                className="mx-auto mt-2 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-xl border border-border/60 bg-secondary/40 p-1 lg:mx-0 lg:justify-start"
              >
                {roles.map((role) => {
                  const active = role.id === selectedRole
                  return (
                    <button
                      key={role.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleRoleChange(role.id)}
                      className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
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

          {/* Atmosphere column — the photo lives inside the spectral field on
              the right. Small + recessive: it belongs to the globe, not in
              front of the message. The sphere itself is rendered behind the
              whole hero (above); here the portrait sits offset within it. */}
          <div className="order-2 hidden lg:flex lg:min-h-[360px] lg:items-center lg:justify-end lg:self-stretch">
            <div className="group relative mr-2">
              {/* faint spectral bloom behind the portrait, echoing the sphere glow */}
              <div
                className="absolute -inset-6 rounded-full opacity-25 blur-2xl spectra-bg"
                aria-hidden="true"
              />
              <img
                src="/images/design-mode/aaron-headshot.png"
                alt="Aaron E"
                className="relative h-28 w-28 rounded-full border border-border/40 object-cover opacity-55 shadow-2xl shadow-black/40 transition-opacity duration-500 hover:opacity-90 lg:h-32 lg:w-32"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <div className="h-px w-full spectra-bg opacity-30" />
      </div>
    </header>
  )
}
