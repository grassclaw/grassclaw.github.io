import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Mic } from "lucide-react"

interface ExtracurricularsProps {
  searchQuery: string
  selectedSkill: string | null
}

export function Extracurriculars({ searchQuery, selectedSkill }: ExtracurricularsProps) {
  const creativeInitiatives = [
    {
      id: "webaphors-initiative",
      title: "Webaphors Channel Initiative",
      organization: "Creative Content Platform",
      location: "Online Platform",
      period: "2023 — Present",
      description:
        "Founded and developed the Webaphors channel initiative, creating educational content that bridges complex technical concepts with accessible metaphors and visual storytelling.",
      responsibilities: [
        "Develop creative content strategy for technical education",
        "Create visual metaphors for complex programming concepts",
        "Build audience engagement through innovative storytelling",
        "Collaborate with educators and content creators",
      ],
      skills: ["content-creation", "creative-writing", "technical-communication", "visual-design"],
      icon: Mic,
    },
    {
      id: "youtube-discord-community",
      title: "YouTube Shorts & Discord Learning Community",
      organization: "Newine – YouTube Platform",
      location: "Online Platform",
      period: "2022 — Present",
      description:
        "Create educational YouTube Shorts and manage Discord learning community focused on technology, AI, and cybersecurity topics. Build audience engagement through short-form video content and interactive discussions.",
      responsibilities: [
        "Research and script educational content on emerging technologies",
        "Produce and edit short-form video content",
        "Moderate Discord community and facilitate learning discussions",
        "Stay current with trends in AI, cybersecurity, and technology",
      ],
      skills: ["content-creation", "video-editing", "community-management", "social-media"],
      icon: Mic,
    },
  ]

  const tutoringMentoring = [
    {
      id: "math-tutor-byu",
      title: "Math Tutor (Calculus/Statistics)",
      organization: "Brigham Young University",
      location: "Provo, UT",
      period: "2020 — 2022",
      description:
        "Provided one-on-one and group tutoring for undergraduate students in advanced mathematics courses, specializing in calculus and statistics with focus on practical applications.",
      responsibilities: [
        "Tutor students in calculus, statistics, and related mathematics courses",
        "Develop personalized learning strategies for diverse learning styles",
        "Create practice problems and study materials",
        "Track student progress and adjust teaching methods accordingly",
      ],
      skills: ["education", "mathematics", "mentoring", "curriculum-development"],
      icon: Users,
    },
    {
      id: "cybersecurity-bootcamp-mentor",
      title: "Cybersecurity Bootcamp Mentor",
      organization: "Various Bootcamp Programs",
      location: "Remote",
      period: "2023 — Present",
      description:
        "Mentor students and assist faculty in cybersecurity bootcamps, helping build knowledge assessments and providing guidance on practical cybersecurity skills and career development.",
      responsibilities: [
        "Mentor students in cybersecurity fundamentals and advanced topics",
        "Assist faculty in developing knowledge assessments and curriculum",
        "Provide career guidance and industry insights",
        "Review and improve educational materials and exercises",
      ],
      skills: ["mentoring", "cybersecurity", "curriculum-development", "career-guidance"],
      icon: Users,
    },
  ]

  const allActivities = [...creativeInitiatives, ...tutoringMentoring]

  const activitiesWithHighlight = allActivities.map((activity) => {
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

  const renderActivityCard = (activity: any) => {
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
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <IconComponent className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg text-balance text-slate-800">
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
  }

  return (
    <div className="space-y-6">
      {showNoResultsMessage && (
        <Card className="p-8 text-center border-2 border-dashed border-muted">
          <p className="text-slate-700 text-lg mb-2">Sorry, nothing was found for "{searchQuery}"</p>
          <p className="text-sm text-slate-600">However, it doesn't mean I haven't done it! Feel free to reach out.</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Creative Initiatives */}
        <div className="space-y-6">
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="text-xl font-bold mb-4 text-white">Creative Initiatives</h3>
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
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="text-xl font-bold mb-4 text-white">Tutoring & Mentoring</h3>
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
