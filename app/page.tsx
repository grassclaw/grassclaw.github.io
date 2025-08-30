"use client"

import { useState, useRef } from "react"
import { HeroSection } from "@/components/portfolio/hero-section"
import { SearchBar } from "@/components/portfolio/search-bar"
import { SkillsGraph } from "@/components/portfolio/skills-graph"
import { WorkExperience } from "@/components/portfolio/work-experience"
import { AcademicResearch } from "@/components/portfolio/academic-research"
import { Extracurriculars } from "@/components/portfolio/extracurriculars"
import { TechnicalProficiencies } from "@/components/portfolio/technical-proficiencies"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
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
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchEnter={handleSearchEnter} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Graph Search</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGraphExpanded(!isGraphExpanded)}
              className="flex items-center gap-2"
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
            <Card className="p-6 h-[500px]">
              <div className="text-sm text-muted-foreground mb-4 text-center">
                Click and drag to pan • Scroll to zoom • Click nodes to highlight connections
              </div>
              <SkillsGraph onSkillSelect={setSelectedSkill} selectedSkill={selectedSkill} />
            </Card>
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
