import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Mic } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

interface ExtracurricularsProps {
  searchQuery: string
  selectedSkill: string | null
  hasAnyMatches: boolean
  otherTabsWithMatches?: string[]
}

export function Extracurriculars({
  searchQuery,
  selectedSkill,
  hasAnyMatches,
  otherTabsWithMatches = [],
}: ExtracurricularsProps) {
  const { portfolioData } = usePortfolio()

  const creativeInitiatives = portfolioData.extracurriculars.filter((activity) => activity.tags?.includes("creative"))
  const tutoringMentoring = portfolioData.extracurriculars.filter(
    (activity) => activity.tags?.includes("tutoring") || activity.tags?.includes("mentoring"),
  )

  const activitiesWithHighlight = portfolioData.extracurriculars.map((activity) => {
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
          <span key={index} className="bg-spectra-cyan/20 text-spectra-cyan px-1 rounded">
            {part}
          </span>
        )
      }
      return part
    })
  }

  const renderActivityCard = (activity: any) => {
    const IconComponent = activity.tags?.includes("creative") ? Mic : Users
    return (
      <Card
        key={activity.id}
        className={`hover:shadow-lg transition-all duration-300 ${
          activity.isHighlighted && (searchQuery !== "" || selectedSkill !== null)
            ? "border border-spectra-cyan/70 shadow-2xl shadow-spectra-blue/20 ring-1 ring-spectra-cyan/40"
            : ""
        }`}
      >
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary/50 rounded-lg">
                <IconComponent className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg text-balance text-card-foreground">
                  {highlightText(activity.title, searchQuery)}
                </CardTitle>
                <div className="flex items-center gap-4 text-muted-foreground mt-2">
                  <span className="text-card-foreground/85">{highlightText(activity.organization, searchQuery)}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-card-foreground/85">{activity.period}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-pretty text-card-foreground">{highlightText(activity.description, searchQuery)}</p>

          <div>
            <h4 className="font-semibold mb-2 text-card-foreground">Key Responsibilities:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {activity.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-pretty text-card-foreground/85">
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
  }

  return (
    <div className="space-y-6">
      {showNoResultsMessage && (
        <Card className="p-8 text-center border-2 border-dashed border-muted">
          {otherTabsWithMatches.length > 0 ? (
            <p className="text-card-foreground/85 text-lg">
              There are results for '{searchQuery}' on the following tabs: {otherTabsWithMatches.join(", ")}
            </p>
          ) : (
            <p className="text-card-foreground/85 text-lg">
              0 results, this does not mean I haven't done it. Feel free to reach out and check!
            </p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Creative Initiatives */}
        <div className="space-y-6">
          <div className="border-l-4 border-border pl-4">
            <h3 className="text-xl font-bold mb-4 text-foreground">Creative Initiatives</h3>
          </div>
          <div className="space-y-4">
            {creativeInitiatives
              .map((activity) => activitiesWithHighlight.find((a) => a.id === activity.id))
              .filter(Boolean)
              .map((activity) => renderActivityCard(activity))}
          </div>
        </div>

        {/* Right Column - Tutoring & Mentoring */}
        <div className="space-y-6">
          <div className="border-l-4 border-border pl-4">
            <h3 className="text-xl font-bold mb-4 text-foreground">Tutoring & Mentoring</h3>
          </div>
          <div className="space-y-4">
            {tutoringMentoring
              .map((activity) => activitiesWithHighlight.find((a) => a.id === activity.id))
              .filter(Boolean)
              .map((activity) => renderActivityCard(activity))}
          </div>
        </div>
      </div>
    </div>
  )
}
