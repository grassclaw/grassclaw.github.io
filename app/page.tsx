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
import { PortfolioProvider, usePortfolio } from "@/contexts/portfolio-context"
import { getVariationKeywords } from "@/lib/portfolio-data"
import searchKeywordsData from "@/data/search-keywords.json"

function PortfolioContent() {
  const { currentVariation, portfolioData } = usePortfolio()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [isGraphExpanded, setIsGraphExpanded] = useState(false)
  const experienceRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLDivElement>(null)
  const researchRef = useRef<HTMLDivElement>(null)
  const extracurricularsRef = useRef<HTMLDivElement>(null)
  const publicServiceRef = useRef<HTMLDivElement>(null)
  const technicalRef = useRef<HTMLDivElement>(null)

  const [tabsWithMatches, setTabsWithMatches] = useState<Set<string>>(new Set())
  const [hasAnyMatches, setHasAnyMatches] = useState(false)

  const handleSearchEnter = () => {
    if (!searchQuery.trim()) return

    const query = searchQuery.toLowerCase()

    const sections = [
      {
        ref: experienceRef,
        keywords: searchKeywordsData.workExperience,
      },
      {
        ref: educationRef,
        keywords: searchKeywordsData.education,
      },
      {
        ref: researchRef,
        keywords: searchKeywordsData.academia,
      },
      {
        ref: extracurricularsRef,
        keywords: searchKeywordsData.extracurriculars,
      },
      {
        ref: publicServiceRef,
        keywords: searchKeywordsData.publicService,
      },
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

  const getTabDisplayName = (tabId: string) => {
    const tabNames: Record<string, string> = {
      experience: "Work Experience",
      education: "Education",
      research: "Research and Conferences", // Updated from "Academia" to "Research and Conferences"
      extracurriculars: "Extracurriculars",
      "public-service": "Public Service",
    }
    return tabNames[tabId] || tabId
  }

  const getOtherTabsWithMatches = (currentTab: string) => {
    return Array.from(tabsWithMatches)
      .filter((tab) => tab !== currentTab)
      .map(getTabDisplayName)
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-slate-900 via-slate-800 via-slate-600 via-slate-400 to-slate-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-32 left-16 w-48 h-48 opacity-20" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="nodeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="20" cy="30" r="3" fill="url(#nodeGrad1)" className="animate-pulse" filter="url(#glow)" />
          <circle
            cx="60"
            cy="20"
            r="2.5"
            fill="url(#nodeGrad1)"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
            filter="url(#glow)"
          />
          <circle
            cx="80"
            cy="60"
            r="4"
            fill="url(#nodeGrad1)"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
            filter="url(#glow)"
          />
          <circle
            cx="40"
            cy="70"
            r="2"
            fill="url(#nodeGrad1)"
            className="animate-pulse"
            style={{ animationDelay: "1.5s" }}
            filter="url(#glow)"
          />
          <line x1="20" y1="30" x2="60" y2="20" stroke="url(#nodeGrad1)" strokeWidth="1" opacity="0.6" />
          <line x1="60" y1="20" x2="80" y2="60" stroke="url(#nodeGrad1)" strokeWidth="1" opacity="0.6" />
          <line x1="80" y1="60" x2="40" y2="70" stroke="url(#nodeGrad1)" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="70" x2="20" y2="30" stroke="#334155" strokeWidth="0.8" opacity="0.4" />
        </svg>

        <svg className="absolute top-48 right-24 w-40 h-40 opacity-25" viewBox="0 0 100 100">
          <circle cx="30" cy="40" r="2.5" fill="#8b5cf6" className="animate-ping" />
          <circle cx="70" cy="30" r="3" fill="#3b82f6" className="animate-ping" style={{ animationDelay: "1.5s" }} />
          <circle cx="50" cy="70" r="2" fill="#8b5cf6" className="animate-ping" style={{ animationDelay: "0.8s" }} />
          <line x1="30" y1="40" x2="70" y2="30" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
          <line x1="70" y1="30" x2="50" y2="70" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        </svg>

        <svg className="absolute top-1/2 left-8 w-56 h-56 opacity-15" viewBox="0 0 100 100">
          <circle cx="25" cy="25" r="2" fill="#8b5cf6" className="animate-pulse" />
          <circle cx="75" cy="35" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "0.8s" }} />
          <circle cx="50" cy="70" r="3.5" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "1.2s" }} />
          <circle cx="20" cy="60" r="2.5" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "2s" }} />
          <circle cx="80" cy="75" r="2" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
          <line x1="25" y1="25" x2="75" y2="35" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.4" />
          <line x1="75" y1="35" x2="50" y2="70" stroke="#3b82f6" strokeWidth="0.8" opacity="0.4" />
          <line x1="50" y1="70" x2="20" y2="60" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.4" />
          <line x1="20" y1="60" x2="80" y2="75" stroke="#3b82f6" strokeWidth="0.8" opacity="0.4" />
          <line x1="80" y1="75" x2="75" y2="35" stroke="#8b5cf6" strokeWidth="0.6" opacity="0.3" />
        </svg>

        <svg className="absolute top-2/3 right-16 w-44 h-44 opacity-20" viewBox="0 0 100 100">
          <circle cx="40" cy="20" r="2.5" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "2s" }} />
          <circle cx="20" cy="60" r="2" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
          <circle cx="80" cy="80" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "1.8s" }} />
          <circle cx="70" cy="40" r="2.5" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "1s" }} />
          <line x1="40" y1="20" x2="20" y2="60" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
          <line x1="20" y1="60" x2="80" y2="80" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
          <line x1="80" y1="80" x2="70" y2="40" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
          <line x1="70" y1="40" x2="40" y2="20" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        </svg>

        <svg className="absolute bottom-32 left-1/4 w-52 h-52 opacity-18" viewBox="0 0 100 100">
          <circle cx="30" cy="30" r="2.5" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "0.7s" }} />
          <circle cx="70" cy="50" r="2" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "1.4s" }} />
          <circle cx="50" cy="80" r="3" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
          <circle cx="15" cy="65" r="2" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "1.8s" }} />
          <circle cx="85" cy="25" r="2.5" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "0.9s" }} />
          <line x1="30" y1="30" x2="70" y2="50" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.6" />
          <line x1="70" y1="50" x2="50" y2="80" stroke="#3b82f6" strokeWidth="0.8" opacity="0.6" />
          <line x1="50" y1="80" x2="15" y2="65" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.6" />
          <line x1="15" y1="65" x2="30" y2="30" stroke="#3b82f6" strokeWidth="0.8" opacity="0.6" />
          <line x1="85" y1="25" x2="70" y2="50" stroke="#8b5cf6" strokeWidth="0.6" opacity="0.4" />
        </svg>

        <svg className="absolute bottom-16 right-12 w-36 h-36 opacity-22" viewBox="0 0 100 100">
          <circle cx="25" cy="40" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "1.3s" }} />
          <circle cx="75" cy="30" r="2.5" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "0.6s" }} />
          <circle cx="60" cy="75" r="2" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "2.1s" }} />
          <line x1="25" y1="40" x2="75" y2="30" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
          <line x1="75" y1="30" x2="60" y2="75" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
          <line x1="60" y1="75" x2="25" y2="40" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.4" />
        </svg>
      </div>

      <HeroSection />

      <main className="container mx-auto px-4 pt-4 pb-8 space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="text-center space-y-2"></div>

          <div className="flex flex-col items-center relative">
            <div
              onClick={() => setIsGraphExpanded(!isGraphExpanded)}
              className="cursor-pointer hover:opacity-80 transition-all duration-300 flex flex-col items-center"
            >
              <h3 className="text-xl font-semibold relative">
                <span className="relative inline-block">
                  {"Graph Visualization".split("").map((letter, index) => (
                    <span
                      key={index}
                      className="inline-block animate-wave text-transparent bg-gradient-to-r from-slate-400 via-blue-500 to-slate-600 bg-clip-text animate-color-wave"
                      style={
                        {
                          animationDelay: `${index * 0.1}s`,
                          "--wave-delay": `${index * 0.15}s`,
                        } as React.CSSProperties
                      }
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </span>
                  ))}
                </span>
              </h3>

              <svg width="60" height="12" viewBox="0 0 60 12" className="drop-shadow-sm mt-1">
                <defs>
                  <linearGradient id="smallArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>
                <path
                  d={
                    isGraphExpanded
                      ? "M 10 8 L 30 2 L 50 8 L 45 8 L 30 4 L 15 8 Z"
                      : "M 10 4 L 30 10 L 50 4 L 45 4 L 30 8 L 15 4 Z"
                  }
                  fill="url(#smallArrowGrad)"
                  stroke="#e2e8f0"
                  strokeWidth="0.5"
                  className="transition-all duration-300"
                />
              </svg>
            </div>

            <div className="absolute left-0 right-0 top-0 h-px overflow-visible pointer-events-none">
              <svg className="w-full h-8" viewBox="0 0 400 32" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="rightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>

                <circle r="2.5" fill="#8b5cf6" opacity="0.8">
                  <animateMotion dur="4s" repeatCount="indefinite">
                    <mpath href="#leftPath" />
                  </animateMotion>
                </circle>
                <circle r="2" fill="#8b5cf6" opacity="0.6">
                  <animateMotion dur="4s" repeatCount="indefinite" begin="2s">
                    <mpath href="#leftPath" />
                  </animateMotion>
                </circle>

                <circle r="2.5" fill="#3b82f6" opacity="0.8">
                  <animateMotion dur="4s" repeatCount="indefinite">
                    <mpath href="#rightPath" />
                  </animateMotion>
                </circle>
                <circle r="2" fill="#3b82f6" opacity="0.6">
                  <animateMotion dur="4s" repeatCount="indefinite" begin="2s">
                    <mpath href="#rightPath" />
                  </animateMotion>
                </circle>

                <path id="leftPath" d="M 140 16 L 50 16" fill="none" opacity="0" />
                <path id="rightPath" d="M 260 16 L 350 16" fill="none" opacity="0" />

                <line x1="50" y1="16" x2="140" y2="16" stroke="url(#leftGrad)" strokeWidth="1" opacity="0.4" />
                <line x1="260" y1="16" x2="350" y2="16" stroke="url(#rightGrad)" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>

            {isGraphExpanded && (
              <GraphCard className="p-6 h-[400px]">
                <SkillsGraph onSkillSelect={setSelectedSkill} selectedSkill={selectedSkill} />
              </GraphCard>
            )}
          </div>

          <Tabs defaultValue="experience" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger
                value="experience"
                className={`text-white font-semibold data-[state=active]:text-foreground transition-all duration-300 ${
                  tabsWithMatches.has("experience")
                    ? "ring-2 ring-purple-400 shadow-lg shadow-purple-200 bg-purple-500/20"
                    : ""
                }`}
              >
                Work Experience
              </TabsTrigger>
              <TabsTrigger
                value="research"
                className={`text-white font-semibold data-[state=active]:text-foreground transition-all duration-300 ${
                  tabsWithMatches.has("research")
                    ? "ring-2 ring-purple-400 shadow-lg shadow-purple-200 bg-purple-500/20"
                    : ""
                }`}
              >
                Research and Conferences
              </TabsTrigger>
              <TabsTrigger
                value="public-service"
                className={`text-white font-semibold data-[state=active]:text-foreground transition-all duration-300 ${
                  tabsWithMatches.has("public-service")
                    ? "ring-2 ring-purple-400 shadow-lg shadow-purple-200 bg-purple-500/20"
                    : ""
                }`}
              >
                Public Service
              </TabsTrigger>
              <TabsTrigger
                value="extracurriculars"
                className={`text-white font-semibold data-[state=active]:text-foreground transition-all duration-300 ${
                  tabsWithMatches.has("extracurriculars")
                    ? "ring-2 ring-purple-400 shadow-lg shadow-purple-200 bg-purple-500/20"
                    : ""
                }`}
              >
                Extracurriculars
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className={`text-white font-semibold data-[state=active]:text-foreground transition-all duration-300 ${
                  tabsWithMatches.has("education")
                    ? "ring-2 ring-purple-400 shadow-lg shadow-purple-200 bg-purple-500/20"
                    : ""
                }`}
              >
                Education
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchEnter={handleSearchEnter} />
            </div>

            <TabsContent value="experience" className="mt-6" ref={experienceRef}>
              <WorkExperience
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("experience")}
              />
            </TabsContent>

            <TabsContent value="research" className="mt-6" ref={researchRef}>
              <Academia
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("research")}
              />
            </TabsContent>

            <TabsContent value="public-service" className="mt-6" ref={publicServiceRef}>
              <PublicService
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("public-service")}
              />
            </TabsContent>

            <TabsContent value="extracurriculars" className="mt-6" ref={extracurricularsRef}>
              <Extracurriculars
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("extracurriculars")}
              />
            </TabsContent>

            <TabsContent value="education" className="mt-6" ref={educationRef}>
              <Education
                searchQuery={searchQuery}
                selectedSkill={selectedSkill}
                hasAnyMatches={hasAnyMatches}
                otherTabsWithMatches={getOtherTabsWithMatches("education")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
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
