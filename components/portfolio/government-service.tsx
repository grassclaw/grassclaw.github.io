import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText } from "lucide-react"

interface GovernmentServiceProps {
  searchQuery: string
  selectedSkill: string | null
}

export function GovernmentService({ searchQuery, selectedSkill }: GovernmentServiceProps) {
  const activities = [
    {
      id: "census-2020",
      title: "Census Enumerator",
      organization: "U.S. Bureau of the Census",
      location: "Arizona",
      period: "2020",
      type: "Federal Service",
      description:
        "Served as a Census Enumerator for the 2020 U.S. Census, conducting door-to-door interviews and data collection to ensure accurate population counts for congressional representation and federal funding allocation.",
      responsibilities: [
        "Conduct door-to-door interviews with residents for census data collection",
        "Verify and update address information in assigned geographic areas",
        "Maintain confidentiality and security of sensitive demographic information",
        "Use government-issued mobile devices and software for data entry",
        "Follow federal protocols and procedures for accurate data collection",
      ],
      skills: ["data-collection", "communication", "attention-to-detail", "federal-compliance", "field-work"],
      icon: FileText,
    },
  ]

  const activitiesWithHighlight = activities.map((activity) => {
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
          <p className="text-slate-700 text-lg mb-2">Sorry, nothing was found for "{searchQuery}"</p>
          <p className="text-sm text-slate-600">However, it doesn't mean I haven't done it! Feel free to reach out.</p>
        </Card>
      )}

      {activitiesWithHighlight.map((activity) => {
        const IconComponent = activity.icon
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
                      {highlightText(activity.title, searchQuery)}
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
