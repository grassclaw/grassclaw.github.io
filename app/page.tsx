"use client"

import type React from "react"

import { useState, useRef } from "react"
import { HeroSection } from "@/components/portfolio/hero-section"
import { SearchBar } from "@/components/portfolio/search-bar"
import { SkillsGraph } from "@/components/portfolio/skills-graph"
import { WorkExperience } from "@/components/portfolio/work-experience"
import { AcademicResearch } from "@/components/portfolio/academic-research"
import { Extracurriculars } from "@/components/portfolio/extracurriculars"
import { TechnicalProficiencies } from "@/components/portfolio/technical-proficiencies"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraphCard } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [isGraphExpanded, setIsGraphExpanded] = useState(false)
  const experienceRef = useRef<HTMLDivElement>(null)
  const researchRef = useRef<HTMLDivElement>(null)
  const extracurricularsRef = useRef<HTMLDivElement>(null)
  const technicalRef = useRef<HTMLDivElement>(null)

  const handleSearchEnter = () => {
    if (!searchQuery.trim()) return

    const query = searchQuery.toLowerCase()

    const sections = [
      {
        ref: experienceRef,
        keywords: [
          "experience",
          "work",
          "job",
          "career",
          "engineer",
          "developer",
          "ml",
          "ai",
          "threat",
          "intelligence",
        ],
      },
      { ref: researchRef, keywords: ["research", "academic", "university", "study", "paper", "publication"] },
      {
        ref: extracurricularsRef,
        keywords: ["extracurricular", "volunteer", "leadership", "community", "commissioner", "eagle", "scout"],
      },
      { ref: technicalRef, keywords: ["technical", "skills", "tools", "technology", "programming", "framework"] },
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
          <line x1="40" y1="70" x2="20" y2="30" stroke="url(#nodeGrad1)" strokeWidth="0.8" opacity="0.4" />
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
          <circle cx="40" cy="20" r="2.5" fill="#3b82f6" className="animate-ping" style={{ animationDelay: "2s" }} />
          <circle cx="20" cy="60" r="2" fill="#8b5cf6" className="animate-ping" style={{ animationDelay: "0.3s" }} />
          <circle cx="80" cy="80" r="3" fill="#3b82f6" className="animate-ping" style={{ animationDelay: "1.8s" }} />
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
          <circle cx="15" cy="65" r="2" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "1.8s" }} />
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

      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchEnter={handleSearchEnter} />

        <div className="space-y-4">
          <div className="flex items-center justify-between relative">
            <h3 className="text-xl font-semibold relative">
              <span className="relative inline-block">
                {"Graph Search".split("").map((letter, index) => (
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

            <div className="absolute left-28 top-1/2 right-20 h-px overflow-visible pointer-events-none">
              <svg className="w-full h-8 -mt-4" viewBox="0 0 100 32" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>

                <line
                  x1="0"
                  y1="16"
                  x2="100"
                  y2="16"
                  stroke="url(#connectionGrad)"
                  strokeWidth="2"
                  opacity="0.6"
                  className="animate-pulse"
                />

                <circle r="3" fill="#8b5cf6" opacity="0.8">
                  <animateMotion dur="5s" repeatCount="indefinite">
                    <mpath href="#connectionPath" />
                  </animateMotion>
                </circle>
                <circle r="2.5" fill="#3b82f6" opacity="0.7">
                  <animateMotion dur="5s" repeatCount="indefinite" begin="2.5s">
                    <mpath href="#connectionPath" />
                  </animateMotion>
                </circle>

                <path id="connectionPath" d="M 0 16 L 100 16" fill="none" opacity="0" />

                <circle
                  cx="35"
                  cy="16"
                  r="2"
                  fill="#8b5cf6"
                  className="animate-ping"
                  style={{ animationDelay: "0.5s" }}
                />
                <circle
                  cx="65"
                  cy="16"
                  r="1.5"
                  fill="#3b82f6"
                  className="animate-ping"
                  style={{ animationDelay: "1.2s" }}
                />

                <line x1="0" y1="16" x2="35" y2="16" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
                <line x1="35" y1="16" x2="65" y2="16" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
                <line x1="65" y1="16" x2="100" y2="16" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGraphExpanded(!isGraphExpanded)}
              className="flex items-center gap-2 relative z-10 bg-slate-800 border-2 border-slate-500 text-slate-400 font-bold hover:bg-slate-700 hover:border-slate-400 hover:text-slate-300 transition-all duration-300 shadow-lg hover:shadow-slate-500/25"
            >
              {isGraphExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Expand
                </>
              )}
            </Button>
          </div>

          {isGraphExpanded && (
            <GraphCard className="p-6 h-[500px]">
              <div className="text-sm mb-4 text-center text-black">
                Click and drag to pan • Scroll to zoom • Click nodes to highlight connections
              </div>
              <SkillsGraph onSkillSelect={setSelectedSkill} selectedSkill={selectedSkill} />
            </GraphCard>
          )}
        </div>

        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="experience" className="text-white font-semibold data-[state=active]:text-foreground">
              Work Experience
            </TabsTrigger>
            <TabsTrigger value="research" className="text-white font-semibold data-[state=active]:text-foreground">
              Academic Research
            </TabsTrigger>
            <TabsTrigger
              value="extracurriculars"
              className="text-white font-semibold data-[state=active]:text-foreground"
            >
              Extracurriculars
            </TabsTrigger>
            <TabsTrigger value="technical" className="text-white font-semibold data-[state=active]:text-foreground">
              Technical Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience" className="mt-6" ref={experienceRef}>
            <WorkExperience searchQuery={searchQuery} selectedSkill={selectedSkill} />
          </TabsContent>

          <TabsContent value="research" className="mt-6" ref={researchRef}>
            <AcademicResearch searchQuery={searchQuery} selectedSkill={selectedSkill} />
          </TabsContent>

          <TabsContent value="extracurriculars" className="mt-6" ref={extracurricularsRef}>
            <Extracurriculars searchQuery={searchQuery} selectedSkill={selectedSkill} />
          </TabsContent>

          <TabsContent value="technical" className="mt-6" ref={technicalRef}>
            <TechnicalProficiencies
              searchQuery={searchQuery}
              onSkillClick={setSelectedSkill}
              selectedSkill={selectedSkill}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
