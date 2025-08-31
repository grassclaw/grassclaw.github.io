import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Award, ExternalLink } from "lucide-react"

interface PublicServiceProps {
  searchQuery: string
  selectedSkill: string | null
  hasAnyMatches: boolean
}

export function PublicService({ searchQuery, selectedSkill, hasAnyMatches }: PublicServiceProps) {
  const activities = [
    {
      id: "commissioner-2025",
      title: "Commissioner - Planning & Zones Committee",
      organization: "Town of Sahuarita",
      location: "Sahuarita, AZ",
      period: "2025 — Present",
      type: "Government Service",
      url: "https://sahuaritaaz.gov/262/Planning-Zoning-Commission",
      description:
        "Appointed to serve on the Planning & Zones Committee, responsible for reviewing development proposals, zoning changes, and land use planning decisions that impact community growth and development.",
      responsibilities: [
        "Review and evaluate development proposals and zoning applications",
        "Participate in public hearings and community engagement sessions",
        "Collaborate with city planners and community stakeholders",
        "Ensure compliance with municipal planning codes and regulations",
      ],
      skills: ["leadership", "public-speaking", "policy-analysis", "community-engagement"],
      icon: Users,
    },
    {
      id: "youth-group-leader",
      title: "Community Youth Group Leader",
      organization: "EastMark Mesa Arizona",
      location: "Arizona",
      period: "2021 — 2023",
      type: "Public Service",
      description:
        "Guided youth in organizing skills training, community service projects, and outdoor recreational activities. Focused on character development, leadership skills, and community engagement through hands-on learning experiences.",
      responsibilities: [
        "Guided youth in organizing skills training workshops and activities",
        "Coordinated community service projects and volunteer initiatives",
        "Led outdoor recreational activities and team-building exercises",
        "Mentored young people in leadership development and character building",
      ],
      skills: ["leadership", "youth-development", "project-management", "mentoring", "community-service"],
      icon: Award,
    },
    {
      id: "census-enumerator-2020",
      title: "Census Enumerator",
      organization: "U.S. Bureau of Census",
      location: "Arizona",
      period: "2020",
      type: "Government Service",
      description:
        "Conducted door-to-door interviews and data collection for the 2020 U.S. Census, ensuring accurate population counts and demographic data collection for federal representation and funding allocation.",
      responsibilities: [
        "Conducted household interviews and collected demographic data",
        "Maintained confidentiality and data security protocols",
        "Navigated diverse communities and built rapport with residents",
        "Utilized government-issued technology for data entry and reporting",
      ],
      skills: ["data-collection", "communication", "attention-to-detail", "community-outreach"],
      icon: Users,
    },
    {
      id: "cub-scout-leader",
      title: "Cub Scout Leader",
      organization: "Boy Scouts of America",
      location: "Arizona",
      period: "2016 — 2017",
      type: "Public Service",
      description:
        "Lead and mentor young scouts in character development, outdoor skills, and leadership training. Focus on youth development through hands-on activities and community service projects.",
      responsibilities: [
        "Plan and execute weekly den meetings and activities",
        "Mentor youth in leadership skills and character development",
        "Organize community service projects and outdoor adventures",
        "Collaborate with parents and other leaders on program development",
      ],
      skills: ["youth-development", "leadership", "mentoring", "program-management"],
      icon: Award,
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
  const showNoResultsMessage = searchQuery !== "" && !hasMatches && !hasAnyMatches

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
