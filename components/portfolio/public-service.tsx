import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Award, ExternalLink } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

interface PublicServiceProps {
  searchQuery: string
  selectedSkill: string | null
  hasAnyMatches: boolean
  otherTabsWithMatches?: string[]
}

export function PublicService({
  searchQuery,
  selectedSkill,
  hasAnyMatches,
  otherTabsWithMatches = [],
}: PublicServiceProps) {
  const { portfolioData } = usePortfolio()

  const activitiesWithHighlight = portfolioData.publicService.map((activity) => {
    const matchesSearch =
      searchQuery === "" ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.responsibilities.some((resp) => resp.toLowerCase().includes(searchQuery.toLowerCase())) ||
      activity.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSkill = selectedSkill === null || activity.skills.includes(selectedSkill)

    return {
      ...activity,
      isHighlighted: matchesSearch && matchesSkill,
    }
  })

  const hasMatches = activitiesWithHighlight.some((activity) => activity.isHighlighted)

  const showNoResultsMessage = searchQuery !== "" && !hasMatches

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

      {activitiesWithHighlight.map((activity) => {
        const IconComponent = activity.type === "Government Service" ? Users : Award
        return (
          <Card
            key={activity.id}
            className={`hover:shadow-lg transition-all duration-300 ${
              activity.isHighlighted && (searchQuery !== "" || selectedSkill !== null)
                ? "border-4 border-purple-500 shadow-2xl shadow-purple-200 ring-2 ring-purple-300 ring-opacity-50"
                : ""
            }`}
          >
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <IconComponent className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-balance text-slate-800">
                      {activity.url ? (
                        <a
                          href={activity.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors inline-flex items-center gap-2"
                        >
                          {highlightText(activity.title, searchQuery)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        highlightText(activity.title, searchQuery)
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground mt-2">
                      <span className="text-slate-700">{highlightText(activity.organization, searchQuery)}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <span className="text-slate-700">{activity.period}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{activity.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-pretty text-slate-800">{highlightText(activity.description, searchQuery)}</p>

              <div>
                <h4 className="font-semibold mb-2 text-slate-800">Key Responsibilities:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {activity.responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-pretty text-slate-700">
                      {highlightText(responsibility, searchQuery)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {activity.skills.map((skill) => (
                  <Badge key={skill} variant={selectedSkill === skill ? "default" : "secondary"} className="text-xs">
                    {skill.replace("-", " ").toUpperCase()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
