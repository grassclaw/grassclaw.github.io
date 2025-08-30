import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Award, Mic } from "lucide-react"

interface ExtracurricularsProps {
  searchQuery: string
  selectedSkill: string | null
}

export function Extracurriculars({ searchQuery, selectedSkill }: ExtracurricularsProps) {
  const activities = [
    {
      id: "commissioner-2025",
      title: "Commissioner - Planning & Zones Committee",
      organization: "Town of Sahuarita",
      location: "Sahuarita, AZ",
      period: "2025 — Present",
      type: "Public Service",
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
      id: "conference-speaker-2025",
      title: "Conference Speaker - AI Threat Detection",
      organization: "International Cybersecurity Conference",
      location: "Global Conference",
      period: "2025",
      type: "Speaking Engagement",
      description:
        "Selected to present peer-reviewed research on AI-based threat detection methodologies at a globally recognized cybersecurity conference. Presentation covers innovative approaches to automated threat intelligence.",
      responsibilities: [
        "Present original research to international audience of cybersecurity professionals",
        "Demonstrate practical applications of AI in threat detection",
        "Engage in Q&A sessions with industry experts",
        "Network with leading researchers and practitioners",
      ],
      skills: ["public-speaking", "research-presentation", "llms", "threat-intel", "networking"],
      icon: Mic,
    },
    {
      id: "youtube-creator",
      title: "Content Creator",
      organization: "Newine – YouTube Shorts",
      location: "Online Platform",
      period: "2022 — Present",
      type: "Creative Content",
      description:
        "Create educational and entertaining content focused on technology, AI, and cybersecurity topics. Build audience engagement through short-form video content that makes complex technical concepts accessible.",
      responsibilities: [
        "Research and script educational content on emerging technologies",
        "Produce and edit short-form video content",
        "Engage with online community and respond to technical questions",
        "Stay current with trends in AI, cybersecurity, and technology",
      ],
      skills: ["content-creation", "video-editing", "technical-communication", "social-media"],
      icon: Mic,
    },
    {
      id: "eagle-scout",
      title: "Eagle Scout",
      organization: "Boy Scouts of America",
      location: "Arizona",
      period: "Achievement",
      type: "Leadership Award",
      description:
        "Achieved the highest rank in Boy Scouts of America, demonstrating leadership, community service, and personal development. Completed extensive community service project and leadership training.",
      responsibilities: [
        "Led community service project benefiting local organization",
        "Mentored younger scouts in outdoor skills and leadership",
        "Demonstrated proficiency in outdoor survival and first aid",
        "Completed extensive leadership and character development training",
      ],
      skills: ["leadership", "project-management", "mentoring", "community-service"],
      icon: Award,
    },
    {
      id: "workshop-instructor",
      title: "AI and Coding Workshop Instructor",
      organization: "University of Arizona Creative Lab",
      location: "Tucson, AZ",
      period: "2024",
      type: "Educational Outreach",
      description:
        "Designed and delivered workshops making AI and programming concepts accessible to diverse audiences. Focused on practical applications and ethical considerations in AI development.",
      responsibilities: [
        "Develop curriculum for AI literacy and programming fundamentals",
        "Deliver interactive workshops to students and community members",
        "Create hands-on exercises and practical demonstrations",
        "Foster inclusive learning environment for diverse skill levels",
      ],
      skills: ["education", "curriculum-development", "public-speaking", "ai-ethics", "python"],
      icon: Users,
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
