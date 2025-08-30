import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, GraduationCap } from "lucide-react"

interface AcademicResearchProps {
  searchQuery: string
  selectedSkill: string | null
}

export function AcademicResearch({ searchQuery, selectedSkill }: AcademicResearchProps) {
  const research = [
    {
      id: "ms-cyber-ops",
      title: "Master of Science in Cyber & Information Operations",
      institution: "University of Arizona",
      location: "Tucson, AZ",
      period: "Expected 2026",
      type: "Graduate Degree",
      description:
        "Advanced study in cybersecurity operations, information warfare, and AI applications in security. Focus on threat intelligence, machine learning for security, and cyber defense strategies.",
      areas: [
        "AI-driven threat detection and analysis",
        "Advanced persistent threat (APT) research",
        "Machine learning applications in cybersecurity",
        "Information operations and cyber warfare",
      ],
      skills: ["llms", "threat-intel", "mitre", "stix", "python", "ml-security"],
    },
    {
      id: "conference-2025",
      title: "AI Threat Detection Methodologies",
      institution: "International Cybersecurity Conference 2025",
      location: "Global Conference",
      period: "2025",
      type: "Peer-Reviewed Research",
      description:
        "Selected to present pioneering research on AI-based threat detection methodologies. Research focuses on Graph Neural Networks for threat categorization and automated enrichment workflows.",
      areas: [
        "Graph Neural Network applications in cybersecurity",
        "Automated threat intelligence enrichment",
        "Large-scale domain classification using AI",
        "Cost-effective ML pipeline optimization",
      ],
      skills: ["llms", "gnn", "threat-intel", "aws", "python", "vectordb"],
    },
    {
      id: "ua-research",
      title: "Student Research - AI Security Applications",
      institution: "University of Arizona",
      location: "Remote, AZ",
      period: "2024 — Present",
      type: "Research Project",
      description:
        "Ongoing research into applications of large language models and machine learning in cybersecurity contexts. Focus on natural language to query language translation and automated security analysis.",
      areas: [
        "Natural Language to KQL translation",
        "LLM applications in security operations",
        "Automated security query generation",
        "AI-assisted threat hunting",
      ],
      skills: ["llms", "langchain", "kql", "security-automation", "python"],
    },
    {
      id: "creative-lab",
      title: "AI and Coding Workshop Instructor",
      institution: "University of Arizona Creative Lab",
      location: "Tucson, AZ",
      period: "2024",
      type: "Teaching & Outreach",
      description:
        "Designed and delivered workshops on AI applications and coding fundamentals. Focused on making AI and programming concepts accessible to diverse audiences.",
      areas: [
        "AI literacy and practical applications",
        "Programming fundamentals",
        "Machine learning concepts for beginners",
        "Ethical AI development",
      ],
      skills: ["python", "llms", "education", "ai-ethics"],
    },
  ]

  const education = [
    {
      id: "bs-asu",
      title: "Bachelor of Science",
      institution: "Arizona State University",
      location: "Tempe, AZ",
      period: "2017",
      type: "Undergraduate Degree",
      description:
        "Foundation in engineering principles and analytical thinking that provided the groundwork for transition into cybersecurity and AI fields.",
    },
    {
      id: "fullstack-cert",
      title: "Certificate: Full Stack Web Development",
      institution: "University of Arizona",
      location: "Tucson, AZ",
      period: "2019",
      type: "Professional Certificate",
      description: "Comprehensive training in modern web development technologies and practices.",
    },
    {
      id: "security-plus",
      title: "Certificate: CompTIA Security+",
      institution: "CompTIA",
      location: "Expected 2025",
      type: "Professional Certification",
      description:
        "Industry-standard cybersecurity certification covering security concepts, threats, and best practices.",
    },
  ]

  const allItems = [...research, ...education]

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

  const itemsWithHighlight = allItems.map((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.areas && item.areas.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (item.skills && item.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesSkill = selectedSkill === null || (item.skills && item.skills.includes(selectedSkill))

    return {
      ...item,
      isHighlighted: matchesSearch && matchesSkill,
    }
  })

  const hasMatches = itemsWithHighlight.some((item) => item.isHighlighted)
  const showNoResultsMessage = searchQuery !== "" && !hasMatches

  return (
    <div className="space-y-6">
      {showNoResultsMessage && (
        <Card className="p-8 text-center border-2 border-dashed border-muted">
          <p className="text-slate-700 text-lg mb-2">Sorry, nothing was found for "{searchQuery}"</p>
          <p className="text-sm text-slate-600">However, it doesn't mean I haven't done it! Feel free to reach out.</p>
        </Card>
      )}

      <div className="grid gap-6">
        {itemsWithHighlight.map((item) => (
          <Card
            key={item.id}
            className={`hover:shadow-lg transition-all duration-300 ${
              item.isHighlighted && (searchQuery !== "" || selectedSkill !== null)
                ? "border-4 border-purple-500 shadow-2xl shadow-purple-200 ring-2 ring-purple-300 ring-opacity-50"
                : ""
            }`}
          >
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-balance">{highlightText(item.title, searchQuery)}</CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-700">{highlightText(item.institution, searchQuery)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-700">{item.period}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{item.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-pretty text-slate-800">{highlightText(item.description, searchQuery)}</p>

              {item.areas && (
                <div>
                  <h4 className="font-semibold mb-2 text-slate-800">Research Areas:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {item.areas.map((area, index) => (
                      <li key={index} className="text-pretty text-slate-700">
                        {highlightText(area, searchQuery)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.skills && (
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <Badge key={skill} variant={selectedSkill === skill ? "default" : "secondary"} className="text-xs">
                      {skill.replace("-", " ").toUpperCase()}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
