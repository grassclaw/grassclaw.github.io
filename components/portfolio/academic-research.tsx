import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Users } from "lucide-react"

interface AcademiaProps {
  searchQuery: string
  selectedSkill: string | null
}

export function Academia({ searchQuery, selectedSkill }: AcademiaProps) {
  const researchPapers = [
    {
      id: "iscap-semantic-tech",
      title:
        "Semantic Technologies for Cybersecurity Education Competencies: JSON-LD Implementation of Distributed Learning Analytics",
      status: "Final Review",
      conference: "Information Systems & Computing Academic Professionals (ISCAP)",
      researchGroup: "University of Arizona cybersecurity research lab",
      year: "2025",
      description:
        "Implementation of semantic technologies using JSON-LD for distributed learning analytics in cybersecurity education competency frameworks.",
      link: null,
      skills: ["JSON-LD", "Semantic Web", "Learning Analytics", "Cybersecurity Education"],
    },
    {
      id: "ai-threat-2025",
      title: "AI Threat Detection Methodologies: Graph Neural Networks for Large-Scale Threat Categorization",
      status: "Pending",
      conference: "pending",
      researchGroup: "University of Arizona cybersecurity research lab",
      year: "2025",
      description:
        "Pioneering research on cost-effective ML pipeline optimization reducing processing costs by 89% through advanced Graph Neural Network implementations for automated threat categorization.",
      link: null,
      skills: ["Graph Neural Networks", "LLMs", "Threat Intelligence", "Python", "AWS"],
    },
    {
      id: "nl2kql-research",
      title: "Natural Language to KQL Translation for Cybersecurity Analysis",
      status: "Pending",
      conference: "pending",
      researchGroup: "University of Arizona cybersecurity research lab",
      year: "2025",
      description:
        "Development of advanced NL2KQL pipeline with schema validation, prompt normalization, and modular evaluation layers for enhanced security query generation.",
      link: null,
      skills: ["LangChain", "KQL", "Security Automation", "Prompt Engineering"],
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
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.conference?.toLowerCase().includes(searchLower) ||
      item.researchGroup?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      (item.skills && item.skills.some((skill: string) => skill.toLowerCase().includes(searchLower)))
    )
  }

  const hasMatches = researchPapers.some(matchesSearch)
  const showNoResultsMessage = searchQuery !== "" && !hasMatches

  return (
    <div className="space-y-6">
      {showNoResultsMessage && (
        <Card className="p-8 text-center border-2 border-dashed border-muted">
          <p className="text-slate-700 text-lg mb-2">Sorry, nothing was found for "{searchQuery}"</p>
          <p className="text-sm text-slate-600">However, it doesn't mean I haven't done it! Feel free to reach out.</p>
        </Card>
      )}

      {researchPapers.map((paper) => (
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
