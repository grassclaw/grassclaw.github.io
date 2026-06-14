"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { HeroSection } from "@/components/portfolio/hero-section"
import { SearchBar } from "@/components/portfolio/search-bar"
import { SkillsGraph } from "@/components/portfolio/skills-graph"
import { WorkExperience } from "@/components/portfolio/work-experience"
import { Education } from "@/components/portfolio/education"
import { Academia } from "@/components/portfolio/academic-research"
import { Extracurriculars } from "@/components/portfolio/extracurriculars"
import { PublicService } from "@/components/portfolio/public-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraphCard } from "@/components/ui/card"
import { ChevronDown, Network, Layers, X } from "lucide-react"
import { PortfolioProvider, usePortfolio } from "@/contexts/portfolio-context"
import { getVariationKeywords } from "@/lib/portfolio-data"
import searchKeywordsData from "@/data/search-keywords.json"

const TABS = [
  { id: "experience", label: "Work Experience" },
  { id: "research", label: "Research & Conferences" },
  { id: "public-service", label: "Public Service" },
  { id: "extracurriculars", label: "Extracurriculars" },
  { id: "education", label: "Education" },
]

function PortfolioContent() {
  const { currentVariation, setCurrentVariation, portfolioData, availableVariations } = usePortfolio()
  const activeLens =
    currentVariation !== "default"
      ? availableVariations.find((v) => v.id === currentVariation)
      : undefined
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [isGraphExpanded, setIsGraphExpanded] = useState(false)
  const experienceRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLDivElement>(null)
  const researchRef = useRef<HTMLDivElement>(null)
  const extracurricularsRef = useRef<HTMLDivElement>(null)
  const publicServiceRef = useRef<HTMLDivElement>(null)

  const [tabsWithMatches, setTabsWithMatches] = useState<Set<string>>(new Set())
  const [hasAnyMatches, setHasAnyMatches] = useState(false)

  const handleSearchEnter = () => {
    if (!searchQuery.trim()) return

    const query = searchQuery.toLowerCase()

    const sections = [
      { ref: experienceRef, keywords: searchKeywordsData.workExperience },
      { ref: educationRef, keywords: searchKeywordsData.education },
      { ref: researchRef, keywords: searchKeywordsData.academia },
      { ref: extracurricularsRef, keywords: searchKeywordsData.extracurriculars },
      { ref: publicServiceRef, keywords: searchKeywordsData.publicService },
    ]

    let bestMatch = sections[0]
    let maxMatches = 0

    sections.forEach((section) => {
      const matches = section.keywords.filter((keyword) => query.includes(keyword)).length
      if (matches > maxMatches) {
        maxMatches = matches
        bestMatch = section
      }
    })

    bestMatch.ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      setTabsWithMatches(new Set())
      setHasAnyMatches(false)
      return
    }

    const query = searchQuery.toLowerCase()
    const matchingTabs = new Set<string>()

    const variationKeywords = getVariationKeywords(currentVariation)

    const technicalSkillsMatch = portfolioData?.technicalSkills
      ? Object.values(portfolioData.technicalSkills)
          .flat()
          .some((skill) => skill.name.toLowerCase().includes(query))
      : false

    const isExactMatch = (keyword: string, searchQuery: string) => {
      return keyword.toLowerCase() === searchQuery || searchQuery.includes(keyword.toLowerCase())
    }

    const workKeywords = [
      ...searchKeywordsData.workExperience,
      ...variationKeywords.filter((k) => k.includes("work") || k.includes("job") || k.includes("engineer")),
    ]
    if (workKeywords.some((keyword) => isExactMatch(keyword, query)) || technicalSkillsMatch) {
      matchingTabs.add("experience")
    }

    const educationKeywords = [
      ...searchKeywordsData.education,
      ...variationKeywords.filter((k) => k.includes("education") || k.includes("university") || k.includes("degree")),
    ]
    if (educationKeywords.some((keyword) => isExactMatch(keyword, query))) {
      matchingTabs.add("education")
    }

    const researchTagsMatch = portfolioData?.academicResearch
      ? portfolioData.academicResearch.some((paper) =>
          paper.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
        )
      : false

    const conferenceTagsMatch = portfolioData?.conferences
      ? portfolioData.conferences.some((conference: any) =>
          conference.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
        )
      : false

    const academiaKeywords = [
      ...searchKeywordsData.academia,
      ...variationKeywords.filter((k) => k.includes("research") || k.includes("academic")),
    ]
    if (academiaKeywords.some((keyword) => isExactMatch(keyword, query)) || researchTagsMatch || conferenceTagsMatch) {
      matchingTabs.add("research")
    }

    const extracurricularKeywords = [
      ...searchKeywordsData.extracurriculars,
      ...variationKeywords.filter((k) => k.includes("creative") || k.includes("mentor") || k.includes("tutor")),
    ]
    if (extracurricularKeywords.some((keyword) => isExactMatch(keyword, query))) {
      matchingTabs.add("extracurriculars")
    }

    const publicServiceKeywords = [
      ...searchKeywordsData.publicService,
      ...variationKeywords.filter((k) => k.includes("service") || k.includes("government") || k.includes("public")),
    ]
    if (publicServiceKeywords.some((keyword) => isExactMatch(keyword, query))) {
      matchingTabs.add("public-service")
    }

    setTabsWithMatches(matchingTabs)
    setHasAnyMatches(matchingTabs.size > 0)
  }, [searchQuery, currentVariation, portfolioData])

  const getTabDisplayName = (tabId: string) => TABS.find((t) => t.id === tabId)?.label || tabId

  const getOtherTabsWithMatches = (currentTab: string) => {
    return Array.from(tabsWithMatches)
      .filter((tab) => tab !== currentTab)
      .map(getTabDisplayName)
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* One cohesive ambient treatment: a quiet spectral aurora + faint dot grid */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-1/3 left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 rounded-full opacity-[0.18] blur-3xl animate-drift"
          style={{
            background:
              "radial-gradient(closest-side, var(--spectra-blue), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] h-[60vh] w-[70vw] rounded-full opacity-[0.12] blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--spectra-violet), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--spectra-cyan) 1px, transparent 0)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <HeroSection />

      <main className="container relative z-10 mx-auto max-w-6xl px-4 pb-20">
        {/* Skills graph — presented as a real, named feature */}
        <section className="mt-4">
          <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setIsGraphExpanded(!isGraphExpanded)}
              aria-expanded={isGraphExpanded}
              className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-secondary/50 text-spectra-cyan">
                  <Network className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold leading-tight">Skills Graph</h2>
                  <p className="text-sm text-muted-foreground">
                    Explore how the toolkit connects — click a node to filter the record below.
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                  isGraphExpanded ? "rotate-180 text-spectra-cyan" : ""
                }`}
              />
            </button>

            {isGraphExpanded && (
              <div className="border-t border-border/60 p-4">
                <GraphCard className="h-[420px] p-4">
                  <SkillsGraph onSkillSelect={setSelectedSkill} selectedSkill={selectedSkill} />
                </GraphCard>
              </div>
            )}
          </div>
        </section>

        {/* The record */}
        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-spectra-cyan">The Record</span>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Experience &amp; Contributions</h2>
          </div>

          {activeLens && (
            <div
              key={currentVariation}
              className="mb-5 flex flex-col gap-3 rounded-xl border border-spectra-cyan/30 bg-spectra-cyan/[0.06] px-4 py-3 animate-renarrate sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-spectra-cyan/40 bg-secondary/50 text-spectra-cyan">
                  <Layers className="h-4 w-4" />
                </span>
                <p className="text-sm text-card-foreground/90">
                  Reframed for{" "}
                  <span className="font-semibold text-spectra-cyan">{activeLens.name}</span> — the record below is
                  re-emphasized to the work most relevant to this role.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentVariation("default")}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-spectra-cyan/50 hover:text-foreground sm:self-auto"
              >
                <X className="h-3.5 w-3.5" />
                Show everything
              </button>
            </div>
          )}

          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchEnter={handleSearchEnter} />

          <Tabs defaultValue="experience" className="mt-6 w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`h-9 transition-all duration-300 ${
                    tabsWithMatches.has(tab.id)
                      ? "ring-2 ring-spectra-cyan/70 ring-offset-1 ring-offset-background"
                      : ""
                  }`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="experience" className="mt-8" ref={experienceRef}>
              <WorkExperience
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("experience")}
              />
            </TabsContent>

            <TabsContent value="research" className="mt-8" ref={researchRef}>
              <Academia
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("research")}
              />
            </TabsContent>

            <TabsContent value="public-service" className="mt-8" ref={publicServiceRef}>
              <PublicService
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("public-service")}
              />
            </TabsContent>

            <TabsContent value="extracurriculars" className="mt-8" ref={extracurricularsRef}>
              <Extracurriculars
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("extracurriculars")}
              />
            </TabsContent>

            <TabsContent value="education" className="mt-8" ref={educationRef}>
              <Education
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("education")}
              />
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          Aaron E — Principal Architect · AI/ML · Threat Intelligence
        </div>
      </footer>
    </div>
  )
}

export default function Portfolio() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  )
}
