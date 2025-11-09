"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Users, MapPin, ExternalLink, Building2, FileText } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"
import { useState } from "react"

interface AcademiaProps {
  searchQuery: string
  selectedSkill: string | null
  hasAnyMatches?: boolean
  otherTabsWithMatches?: string[]
}

export function Academia({
  searchQuery,
  selectedSkill,
  hasAnyMatches = false,
  otherTabsWithMatches = [],
}: AcademiaProps) {
  const { portfolioData } = usePortfolio()
  const [hoveredPaperId, setHoveredPaperId] = useState<string | null>(null)
  const [hoveredConferenceId, setHoveredConferenceId] = useState<string | null>(null)

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <span key={index} className="bg-purple-200 text-purple-900 px-1 rounded">
            {part}
          </span>
        )
      }
      return part
    })
  }

  const matchesSearch = (item: any) => {
    if (searchQuery === "") return true

    const searchLower = searchQuery.toLowerCase()
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.conference?.toLowerCase().includes(searchLower) ||
      item.researchGroup?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.name?.toLowerCase().includes(searchLower) ||
      item.companyName?.toLowerCase().includes(searchLower) ||
      item.location?.toLowerCase().includes(searchLower) ||
      item.sessions?.some((session: any) => session.title?.toLowerCase().includes(searchLower)) ||
      item.searchKeywords?.some((keyword: string) => keyword.toLowerCase().includes(searchLower)) ||
      (item.skills && item.skills.some((skill: string) => skill.toLowerCase().includes(searchLower)))
    )
  }

  const hasResearchMatches = portfolioData.academicResearch.some(matchesSearch)
  const hasConferenceMatches = portfolioData.conferences?.some(matchesSearch) || false
  const hasMatches = hasResearchMatches || hasConferenceMatches
  const showNoResultsMessage = searchQuery !== "" && !hasMatches

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Research and Conferences</h2>
        <p className="text-slate-600">Academic publications and professional conference presentations</p>
      </div>

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

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">Scholarly Research</h3>
          {portfolioData.academicResearch.map((paper) => {
            const isHighlighted = hoveredConferenceId === paper.conferenceId
            return (
              <Card
                key={paper.id}
                onMouseEnter={() => setHoveredPaperId(paper.conferenceId || null)}
                onMouseLeave={() => setHoveredPaperId(null)}
                className={`p-6 ${
                  matchesSearch(paper) && searchQuery !== ""
                    ? "border-4 border-purple-500 shadow-lg shadow-purple-200 ring-2 ring-purple-300"
                    : isHighlighted
                      ? "border-4 border-blue-500 shadow-lg shadow-blue-200 ring-2 ring-blue-300"
                      : ""
                } hover:shadow-md transition-all duration-300 cursor-pointer`}
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <BookOpen className="w-5 h-5 text-slate-600" />
                        <h3 className="text-xl font-bold text-slate-800">{highlightText(paper.title, searchQuery)}</h3>
                        <Badge variant={paper.status === "Published" ? "default" : "outline"} className="ml-auto">
                          {paper.status}
                        </Badge>
                      </div>

                      {paper.authors && paper.authors.length > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600">
                            <strong>Authors:</strong> {paper.authors.join(", ")}
                          </span>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600">
                            <strong>Conference:</strong> {highlightText(paper.conference, searchQuery)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600">
                            <strong>Research Group:</strong> {highlightText(paper.researchGroup, searchQuery)}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-700 mb-4 leading-relaxed">
                        {highlightText(paper.description, searchQuery)}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {paper.paperLink && (
                        <div className="space-y-2 mb-4">
                          <a
                            href={paper.paperLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <FileText className="w-3 h-3" />
                            View Paper
                          </a>
                          {paper.citation && <p className="text-xs text-slate-500 italic">{paper.citation}</p>}
                        </div>
                      )}

                      {paper.tags && paper.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {paper.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">{paper.year}</div>
                        <div className="text-xs text-slate-500">Year</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">Conferences</h3>
          {portfolioData.conferences?.map((conference: any) => {
            const isHighlighted = hoveredPaperId === conference.id
            return (
              <Card
                key={conference.id}
                onMouseEnter={() => setHoveredConferenceId(conference.id)}
                onMouseLeave={() => setHoveredConferenceId(null)}
                className={`p-6 ${
                  matchesSearch(conference) && searchQuery !== ""
                    ? "border-4 border-purple-500 shadow-lg shadow-purple-200 ring-2 ring-purple-300"
                    : isHighlighted
                      ? "border-4 border-blue-500 shadow-lg shadow-blue-200 ring-2 ring-blue-300"
                      : ""
                } hover:shadow-md transition-all duration-300 cursor-pointer`}
              >
                <CardContent className="p-0 space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-1">
                      {highlightText(conference.name, searchQuery)}
                    </h4>
                    {conference.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        {highlightText(conference.location, searchQuery)}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      {conference.date}
                    </div>
                  </div>

                  {conference.companyName && (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{highlightText(conference.companyName, searchQuery)}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {conference.tags.map((tag: string) => (
                      <Badge key={tag} variant="default" className="bg-blue-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold text-slate-700">Track:</span>{" "}
                    <span className="text-slate-600">{conference.track}</span>
                  </div>

                  {conference.speakers && conference.speakers.length > 0 && (
                    <div className="text-sm">
                      <span className="font-semibold text-slate-700">Speakers:</span>{" "}
                      <span className="text-slate-600">{conference.speakers.join(", ")}</span>
                    </div>
                  )}

                  {conference.sessions && conference.sessions.length > 0 && (
                    <div className="space-y-3">
                      {conference.sessions.map((session: any, index: number) => (
                        <div key={index} className="pl-4 border-l-2 border-purple-400">
                          <p className="text-sm font-semibold text-purple-700 mb-1">Session Type: {session.type}</p>
                          <p className="text-sm text-slate-700">{highlightText(session.title, searchQuery)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {conference.link && (
                      <a
                        href={conference.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {conference.linkLabel || "Conference Link"}
                      </a>
                    )}
                    {conference.links?.speaker && (
                      <a
                        href={conference.links.speaker}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Speaker Page
                      </a>
                    )}
                    {conference.links?.company && (
                      <a
                        href={conference.links.company}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Company Page
                      </a>
                    )}
                    {conference.links?.presentation && (
                      <a
                        href={conference.links.presentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Presentation
                      </a>
                    )}
                    {conference.links?.paper && (
                      <a
                        href={conference.links.paper}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Paper
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
