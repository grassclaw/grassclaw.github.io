import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Users } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

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
      (item.skills && item.skills.some((skill: string) => skill.toLowerCase().includes(searchLower)))
    )
  }

  const hasMatches = portfolioData.academicResearch.some(matchesSearch)
  const showNoResultsMessage = searchQuery !== "" && !hasMatches

  return (
    <div className="space-y-6">
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

      {portfolioData.academicResearch.map((paper) => (
        <Card
          key={paper.id}
          className={`p-6 ${
            matchesSearch(paper) && searchQuery !== ""
              ? "border-4 border-purple-500 shadow-lg shadow-purple-200 ring-2 ring-purple-300"
              : ""
          } hover:shadow-md transition-all duration-300`}
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

                <p className="text-slate-700 mb-4 leading-relaxed">{highlightText(paper.description, searchQuery)}</p>

                <div className="flex flex-wrap gap-2">
                  {paper.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
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
      ))}
    </div>
  )
}
