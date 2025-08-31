import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Award, Users, ExternalLink } from "lucide-react"

interface EducationProps {
  searchQuery: string
  selectedSkill: string | null
  hasAnyMatches: boolean
}

export function Education({ searchQuery, selectedSkill, hasAnyMatches }: EducationProps) {
  const education = [
    {
      id: "ms-cyber-ops",
      degree: "Master of Science in Cyber & Information Operations",
      institution: "University of Arizona",
      year: "2026",
      status: "in-progress",
    },
    {
      id: "fullstack-cert",
      degree: "Full Stack Web Development Certificate",
      institution: "University of Arizona",
      year: "2019",
      status: "completed",
    },
    {
      id: "bs-asu",
      degree: "Bachelor of Science",
      institution: "Arizona State University",
      year: "2017",
      status: "completed",
    },
    {
      id: "associates",
      degree: "Associate Degree",
      institution: "Bellevue College",
      year: "2015",
      status: "completed",
    },
  ]

  const certificates = [
    {
      id: "security-plus",
      name: "CompTIA Security+",
      issuer: "CompTIA",
      year: "2025",
      status: "expected",
    },
    {
      id: "eagle-scout",
      name: "Eagle Scout",
      issuer: "Boy Scouts of America",
      year: "Achievement",
      status: "completed",
    },
  ]

  const campusInvolvement = [
    {
      id: "perplexity-partner",
      title: "Sponsored Perplexity AI Campus Partner",
      organization: "Perplexity AI",
      year: "2025-Present",
      description:
        "Advocate for AI-driven research and learning, host AI-related events, work with clubs and professors as partnership liaison",
      url: "https://www.perplexity.ai/hub/legal/campus-partners-program-terms",
    },
    {
      id: "creative-lab",
      title: "AI and Coding Workshop Instructor",
      organization: "University of Arizona Creative Lab",
      year: "2025",
      description: "Teaching AI applications and coding fundamentals to students",
    },
    {
      id: "social-media-coordinator",
      title: "Social Media Coordinator",
      organization: "Cyber Saguaro Club",
      year: "2024-2025",
      description: "Managing social media presence and digital outreach for cybersecurity club",
      url: "https://cybersaguaros.com/",
    },
    {
      id: "research-assistant",
      title: "Student Research Assistant",
      organization: "University of Arizona",
      year: "2024-Present",
      description: "Contributing to cybersecurity and AI research initiatives",
    },
  ]

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

    const matches =
      item.degree?.toLowerCase().includes(searchLower) ||
      item.institution?.toLowerCase().includes(searchLower) ||
      item.name?.toLowerCase().includes(searchLower) ||
      item.issuer?.toLowerCase().includes(searchLower) ||
      item.title?.toLowerCase().includes(searchLower) ||
      item.organization?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)

    return matches
  }

  const hasMatches =
    education.some(matchesSearch) || certificates.some(matchesSearch) || campusInvolvement.some(matchesSearch)
  const showNoResultsMessage = searchQuery !== "" && !hasMatches && !hasAnyMatches

  return (
    <div className="space-y-8">
      {showNoResultsMessage && (
        <Card className="p-8 text-center border-2 border-dashed border-muted">
          <p className="text-slate-700 text-lg mb-2">Sorry, nothing was found for "{searchQuery}"</p>
          <p className="text-sm text-slate-600">However, it doesn't mean I haven't done it! Feel free to reach out.</p>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Education Timeline - Left Column */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="w-5 h-5 text-slate-600" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-300"></div>

              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className={`relative flex items-start gap-4 ${
                      matchesSearch(edu) && searchQuery !== ""
                        ? "bg-purple-50 p-3 rounded-lg border border-purple-200"
                        : ""
                    }`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 w-3 h-3 rounded-full border-2 ${
                        edu.status === "completed"
                          ? "bg-slate-600 border-slate-600"
                          : "bg-blue-500 border-blue-500 animate-pulse"
                      }`}
                    ></div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-800">{highlightText(edu.degree, searchQuery)}</h4>
                        {edu.status === "in-progress" && (
                          <Badge variant="outline" className="text-xs">
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{highlightText(edu.institution, searchQuery)}</p>
                      <p className="text-xs text-slate-500">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates - Right Column */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Award className="w-5 h-5 text-slate-600" />
              Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className={`p-4 rounded-lg border ${
                    matchesSearch(cert) && searchQuery !== "" ? "border-purple-500 bg-purple-50" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">{highlightText(cert.name, searchQuery)}</h4>
                    <Badge variant={cert.status === "completed" ? "default" : "outline"} className="text-xs">
                      {cert.status === "expected" ? "Expected" : "Completed"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{highlightText(cert.issuer, searchQuery)}</p>
                  <p className="text-xs text-slate-500">{cert.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campus Involvement - Bottom Section */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="w-5 h-5 text-slate-600" />
            Campus Involvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {campusInvolvement.map((involvement) => (
              <div
                key={involvement.id}
                className={`p-4 rounded-lg border ${
                  matchesSearch(involvement) && searchQuery !== ""
                    ? "border-purple-500 bg-purple-50"
                    : "border-slate-200"
                } hover:shadow-md transition-shadow`}
              >
                <h4 className="font-semibold text-slate-800 mb-1">
                  {involvement.url ? (
                    <a
                      href={involvement.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      {highlightText(involvement.title, searchQuery)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    highlightText(involvement.title, searchQuery)
                  )}
                </h4>
                <p className="text-sm text-slate-600 mb-2">{highlightText(involvement.organization, searchQuery)}</p>
                <p className="text-xs text-slate-500 mb-2">{involvement.year}</p>
                <p className="text-sm text-slate-700">{highlightText(involvement.description, searchQuery)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
