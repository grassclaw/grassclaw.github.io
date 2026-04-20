"use client"

import { Card, CardContent, CardHeader, CardTitle, TechnicalSkillsCard } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Building, Code, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { usePortfolio } from "@/contexts/portfolio-context"

interface WorkExperienceProps {
  searchQuery: string
  selectedSkill: string | null
  hasAnyMatches?: boolean
  otherTabsWithMatches?: string[]
}

interface Phase {
  title: string
  period: string
  phase?: string
  description?: string
  bullets?: Array<{ text: string; tags?: string[] }>
}

function JobTimeline({
  phases,
  searchQuery,
  highlightText,
}: {
  phases: Phase[]
  searchQuery: string
  highlightText: (text: string, query: string) => React.ReactNode
}) {
  const matchesSearch = (phase: Phase) => {
    if (!searchQuery.trim()) return false
    const q = searchQuery.toLowerCase()
    return (
      phase.title.toLowerCase().includes(q) ||
      (phase.description || "").toLowerCase().includes(q) ||
      (phase.bullets || []).some((b) => b.text.toLowerCase().includes(q))
    )
  }

  const [manuallyToggled, setManuallyToggled] = useState<Record<number, boolean>>({})

  const isExpanded = (index: number) => {
    if (index in manuallyToggled) return manuallyToggled[index]
    if (searchQuery.trim() && matchesSearch(phases[index])) return true
    return index === 0
  }

  const toggle = (index: number) => {
    setManuallyToggled((prev) => ({ ...prev, [index]: !isExpanded(index) }))
  }

  return (
    <div className="relative pl-8 pt-1">
      {/* vertical connector line */}
      <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-purple-400 via-slate-300 to-slate-300" />
      {phases.map((phase, i) => {
        const expanded = isExpanded(i)
        const isCurrent = i === 0
        return (
          <div key={i} className={`relative ${i < phases.length - 1 ? "mb-6" : ""}`}>
            {/* milestone dot */}
            <div
              className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${
                isCurrent
                  ? "bg-purple-500 border-purple-600 shadow-md shadow-purple-300"
                  : "bg-white border-slate-400"
              }`}
            >
              {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full text-left group"
              aria-expanded={expanded}
            >
              <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                <h4
                  className={`${
                    isCurrent ? "text-base font-semibold text-slate-900" : "text-sm font-semibold text-slate-700"
                  } group-hover:text-purple-700 transition-colors`}
                >
                  {highlightText(phase.title, searchQuery)}
                </h4>
                <span className="text-xs text-slate-500">{phase.period}</span>
                {isCurrent && (
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-wide border-purple-400 text-purple-700"
                  >
                    Current
                  </Badge>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ml-auto ${expanded ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            {expanded && (
              <div className="mt-2 space-y-2 pl-0">
                {phase.description && (
                  <p className="text-sm text-slate-700 text-pretty">{highlightText(phase.description, searchQuery)}</p>
                )}
                {phase.bullets && phase.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                    {phase.bullets.map((bullet, j) => (
                      <li key={j} className="text-pretty">
                        {highlightText(bullet.text, searchQuery)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const highlightText = (text: string, searchQuery: string) => {
  if (!searchQuery.trim()) return text

  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-purple-200 text-purple-900 px-1 rounded font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

export function WorkExperience({
  searchQuery,
  selectedSkill,
  hasAnyMatches = false,
  otherTabsWithMatches = [],
}: WorkExperienceProps) {
  const { portfolioData } = usePortfolio()
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(true)

  const isSkillHighlighted = (skillName: string) => {
    return searchQuery !== "" && skillName.toLowerCase().includes(searchQuery.toLowerCase())
  }

  const experiencesWithHighlight = portfolioData.workExperience.map((exp) => {
    const matchesSearch =
      searchQuery === "" ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.bullets.some((bullet) => bullet.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      exp.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSkill = selectedSkill === null || exp.skills.includes(selectedSkill)

    return {
      ...exp,
      isHighlighted: matchesSearch && matchesSkill,
    }
  })

  const hasMatches = experiencesWithHighlight.some((exp) => exp.isHighlighted)

  const showNoResultsMessage = searchQuery !== "" && !hasMatches

  return (
    <div className="space-y-6">
      <TechnicalSkillsCard>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code className="w-5 h-5" />
              Technical Skills & Proficiencies
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
              className="flex items-center gap-1"
            >
              {isSkillsExpanded ? (
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
        </CardHeader>
        {isSkillsExpanded && (
          <CardContent className="pt-0 pb-4 space-y-3">
            {Object.entries(portfolioData.technicalSkills).map(([category, skills]) => (
              <div key={category}>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold whitespace-nowrap bg-slate-800 text-white px-1.5 rounded-xl opacity-90">
                    {category}:
                  </h3>
                  {skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="outline"
                      className={`font-medium text-xs transition-all duration-300 ${
                        isSkillHighlighted(skill.name)
                          ? "bg-purple-600 text-white border-purple-600 ring-2 ring-purple-300 shadow-lg"
                          : "border-black"
                      }`}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </TechnicalSkillsCard>

      {showNoResultsMessage && (
        <Card className="p-8 text-center border-2 border-dashed border-muted">
          {otherTabsWithMatches.length > 0 ? (
            <p className="text-slate-700 text-lg">
              There are results for '{searchQuery}' on the following tabs: {otherTabsWithMatches.join(", ")}
            </p>
          ) : (
            <p className="text-slate-700 text-lg">
              0 results, this does not mean I haven't done it. Feel free to reach out and check!
            </p>
          )}
        </Card>
      )}

      {experiencesWithHighlight.map((exp) => (
        <Card
          key={exp.id}
          className={`hover:shadow-lg transition-all duration-300 ${
            exp.isHighlighted && (searchQuery !== "" || selectedSkill !== null)
              ? "border-4 border-purple-500 shadow-2xl shadow-purple-200 ring-2 ring-purple-300 ring-opacity-50"
              : ""
          }`}
        >
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-balance">
                  {(exp as any).titleHistory && (exp as any).titleHistory.length > 1
                    ? highlightText(exp.company, searchQuery)
                    : highlightText(exp.title, searchQuery)}
                </CardTitle>
                {(exp as any).titleHistory && (exp as any).titleHistory.length > 1 && (
                  <p className="text-sm text-slate-600 mt-1">
                    {(exp as any).titleHistory.length} roles across this tenure — most recent:{" "}
                    <span className="font-medium text-slate-800">{exp.title}</span>
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-slate-800">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span className="text-sm">{highlightText(exp.company, searchQuery)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.period}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline">{exp.type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(exp as any).titleHistory && (exp as any).titleHistory.length > 1 ? (
              <JobTimeline
                phases={(exp as any).titleHistory}
                searchQuery={searchQuery}
                highlightText={highlightText}
              />
            ) : (
              <>
                <p className="text-pretty">{highlightText(exp.description, searchQuery)}</p>
                <div>
                  <h4 className="font-semibold mb-2">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index} className="text-pretty">
                        {highlightText(bullet.text, searchQuery)}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <div className="flex flex-wrap gap-2">
              {exp.skills.map((skill) => (
                <Badge key={skill} variant={selectedSkill === skill ? "default" : "secondary"} className="text-xs">
                  {skill.replace("-", " ").toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
