"use client"

import { Card, CardContent, CardHeader, CardTitle, TechnicalSkillsCard } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Building, Code, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface WorkExperienceProps {
  searchQuery: string
  selectedSkill: string | null
}

const highlightText = (text: string, searchQuery: string) => {
  if (!searchQuery.trim()) return text

  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-purple-200 text-purple-900 px-1 rounded font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

export function WorkExperience({ searchQuery, selectedSkill }: WorkExperienceProps) {
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(true)

  const skillCategories = [
    {
      category: "LLM & ML Frameworks/Tools",
      skills: [
        { name: "LangChain", id: "langchain", jobs: ["nagra-2025", "netstar-2024"] },
        { name: "Unsloth", id: "unsloth", jobs: ["netstar-2024"] },
        { name: "Transformers (HuggingFace)", id: "transformers", jobs: ["netstar-2024"] },
        { name: "LoRA fine-tuning", id: "lora", jobs: ["netstar-2024"] },
        { name: "ggml", id: "ggml", jobs: ["netstar-2024"] },
        { name: "GPTQ", id: "gptq", jobs: ["netstar-2024"] },
        { name: "sentence-transformers", id: "sentence-transformers", jobs: ["netstar-2024"] },
        { name: "RAG pipelines", id: "rag", jobs: ["nagra-2025", "netstar-2024"] },
        { name: "MCP servers", id: "mcp", jobs: ["nagra-2025", "netstar-2024"] },
      ],
    },
    {
      category: "ML Infrastructure & MLOps",
      skills: [
        { name: "AWS (S3, EC2, Lambda, CloudTrail, SageMaker)", id: "aws", jobs: ["nagra-2025", "netstar-2024"] },
        { name: "Azure AI Services", id: "azure", jobs: ["netstar-2024"] },
        { name: "Docker", id: "docker", jobs: ["netstar-2024"] },
        { name: "Kubernetes", id: "kubernetes", jobs: ["netstar-2024"] },
        { name: "Terraform", id: "terraform", jobs: ["netstar-2024"] },
        { name: "Ansible", id: "ansible", jobs: ["netstar-2024"] },
        { name: "Makefiles", id: "makefiles", jobs: ["netstar-2024"] },
      ],
    },
    {
      category: "Security & Threat Intelligence Tools",
      skills: [
        { name: "STIX/TAXII", id: "stix", jobs: ["netstar-2024", "netstar-2020"] },
        { name: "MITRE ATT&CK", id: "mitre", jobs: ["netstar-2024", "netstar-2020"] },
        { name: "KQL (Sentinel emulation)", id: "kql", jobs: ["nagra-2025"] },
      ],
    },
    {
      category: "Programming & Scripting Languages",
      skills: [
        {
          name: "Python",
          id: "python",
          jobs: ["nagra-2025", "netstar-2024", "self-2022", "2u-2021", "netstar-2020", "barrick-2018"],
        },
        { name: "Golang", id: "golang", jobs: ["netstar-2024"] },
        { name: "SQL", id: "sql", jobs: ["nagra-2025", "netstar-2024", "self-2022"] },
      ],
    },
    {
      category: "Data & Database Tools",
      skills: [
        { name: "MongoDB", id: "mongodb", jobs: ["self-2022"] },
        { name: "PostgreSQL", id: "postgres", jobs: ["netstar-2024"] },
        { name: "TimescaleDB", id: "timescaledb", jobs: ["netstar-2024"] },
        { name: "Neo4j", id: "neo4j", jobs: ["netstar-2024"] },
        { name: "Custom vector store generation", id: "vectordb", jobs: ["netstar-2024"] },
        { name: "Graph enrichment tools", id: "graph-tools", jobs: ["netstar-2024"] },
        { name: "REST API interface design", id: "rest-api", jobs: ["netstar-2024", "self-2022"] },
      ],
    },
    {
      category: "Collaboration & Dev Tools",
      skills: [
        { name: "GitHub Projects", id: "github", jobs: ["netstar-2024", "self-2022"] },
        { name: "GitLab CI", id: "gitlab", jobs: ["netstar-2024"] },
        { name: "Jira", id: "jira", jobs: ["netstar-2024", "2u-2021"] },
        { name: "Confluence", id: "confluence", jobs: ["netstar-2024", "2u-2021"] },
        { name: "VS Code", id: "vscode", jobs: ["netstar-2024"] },
        { name: "Cursor", id: "cursor", jobs: ["netstar-2024"] },
        { name: "ServiceNow", id: "servicenow", jobs: ["netstar-2024", "2u-2021"] },
      ],
    },
  ]

  const jobTitles = {
    "nagra-2025": "Nagra Kudelski Group",
    "netstar-2024": "Netstar DTA",
    "self-2022": "Self-Proprietor",
    "2u-2021": "2U Education",
    "netstar-2020": "Netstar",
    "barrick-2018": "Barrick Gold",
  }

  const experiences = [
    {
      id: "nagra-2025",
      title: "Consulting Senior Cyber ML Architect",
      company: "Nagra Kudelski Group",
      location: "Working remotely from USA",
      period: "2025 — Present",
      type: "Contract/Research Partner",
      description:
        "Redesigned the NL2KQL investigative pipeline by adding schema validation, prompt normalization, and modular evaluation layers. Built a custom KQL emulator for runtime testing and error catching.",
      achievements: [
        "Reduced analyst triage time by 80% through multi-step NL2KQL inference pipeline",
        "Improved LLM runtime efficiency by 300% with prompt compression",
        "Built AWS architecture including Lambda, EC2, and S3 for Bedrock-powered investigative assistant",
      ],
      skills: ["llms", "aws", "langchain", "python", "sql", "kql", "bedrock"],
    },
    {
      id: "netstar-2024",
      title: "Senior Machine Learning Engineer - Threat Intelligence",
      company: "Netstar DTA Global Reach, Inc.",
      location: "Working remotely from USA",
      period: "2024 — Present",
      type: "Full-time",
      description:
        "Designed and deployed a modular micro-LLM system for classifying 40M+ domains quarterly. Built secure ML pipelines with full lifecycle ownership including model development, evaluation, containerized deployment.",
      achievements: [
        "Selected to present peer-reviewed AI threat detection research at global 2025 conference",
        "Built Graph Neural Network pipeline accelerating categorization by 90%",
        "Reduced quarterly processing costs from $50K to $4K while scaling efficiency",
        "Designed MCP Threat Intelligence Server with S3, Postgres/Timescale integration",
      ],
      skills: ["llms", "aws", "docker", "kubernetes", "postgres", "s3", "python", "golang", "stix", "mitre"],
    },
    {
      id: "self-2022",
      title: "Web Security Auditor & AI Web Consultant",
      company: "Self-Proprietor",
      location: "Working remotely from USA",
      period: "2022 — 2024",
      type: "Consulting",
      description:
        "Applied AI techniques to improve training simulations for autonomous systems. Conducted security audits and optimized authentication systems for various clients.",
      achievements: [
        "Resolved 100% of authentication logout failures in OpenContour platform",
        "Cut autonomous vehicle onboarding time by 2 days, saving $4K per employee",
        "Optimized SaaS 3D plane-to-vector mesh conversion from O(n²) to O(n)",
      ],
      skills: ["python", "sql", "react", "mongodb", "security-audit"],
    },
    {
      id: "2u-2021",
      title: "Staffing Operations Technical Lead",
      company: "2U Education",
      location: "Working remotely from USA",
      period: "2021 — 2022",
      type: "Full-time",
      description:
        "Automated employee lifecycle management through Salesforce, ADP, and Greenhouse. Provided technical leadership to cross-functional teams in cybersecurity bootcamp operations.",
      achievements: [
        "Reduced annual new hire costs by $85K through efficient remote upskilling",
        "Updated technical training materials for API utilization and Python Anaconda",
      ],
      skills: ["python", "salesforce", "api-integration"],
    },
    {
      id: "netstar-2020",
      title: "Threat Intelligence Research Engineer",
      company: "Netstar",
      location: "Working remotely from USA",
      period: "2020 — 2021",
      type: "Full-time",
      description:
        "Collaborated on fortifying software security by identifying vulnerabilities. Created comprehensive technical documentation and designed demo environments for SaaS security products.",
      achievements: [
        "Engineered software libraries to automate threat intelligence categorization",
        "Strengthened detection capabilities for Insite Threat Intelligence Service",
        "Generated up to $1.3M in annual revenue through new enterprise client feeds",
      ],
      skills: ["threat-intel", "stix", "python", "security-audit"],
    },
    {
      id: "barrick-2018",
      title: "Environmental Engineer",
      company: "Barrick Gold/Nevada Gold Mines",
      location: "Carlin, NV",
      period: "2018 — 2020",
      type: "Full-time",
      description:
        "Executed internal audits following ISO14001 standards. Automated anomaly detection and data analysis through Python, PI Systems, and PowerBI.",
      achievements: [
        "Led regulatory engagement efforts, driving 90% reduction in compliance deficiencies",
        "Cut reportable air incidents from 25 to 3 per year via automated anomaly detection",
      ],
      skills: ["python", "powerbi", "data-analysis", "automation"],
    },
  ]

  const experiencesWithHighlight = experiences.map((exp) => {
    const matchesSearch =
      searchQuery === "" ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.achievements.some((achievement) => achievement.toLowerCase().includes(searchQuery.toLowerCase())) ||
      exp.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSkill = selectedSkill === null || exp.skills.includes(selectedSkill)

    return {
      ...exp,
      isHighlighted: matchesSearch && matchesSkill,
    }
  })

  const hasMatches = experiencesWithHighlight.some((exp) => exp.isHighlighted)
  const showNoResultsMessage = searchQuery !== "" && !hasMatches

  return (
    <div className="space-y-6">
      <TechnicalSkillsCard>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code className="w-5 h-5" />
              Technical Skills & Proficiencies
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
              className="flex items-center gap-1"
            >
              {isSkillsExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Expand
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {isSkillsExpanded && (
          <CardContent className="pt-0 pb-4 space-y-3">
            {skillCategories.map((category) => (
              <div key={category.category}>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-800 whitespace-nowrap">{category.category}:</h3>
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="outline"
                      className="bg-blue-600 text-white border-blue-600 font-medium text-xs"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </TechnicalSkillsCard>

      {showNoResultsMessage && (
        <Card className="p-8 text-center border-2 border-dashed border-muted">
          <p className="text-slate-700 text-lg mb-2">Sorry, nothing was found for "{searchQuery}"</p>
          <p className="text-sm text-slate-600">However, it doesn't mean I haven't done it! Feel free to reach out.</p>
        </Card>
      )}

      {experiencesWithHighlight.map((exp) => (
        <Card
          key={exp.id}
          className={`hover:shadow-lg transition-all duration-300 ${
            exp.isHighlighted && (searchQuery !== "" || selectedSkill !== null)
              ? "border-4 border-purple-500 shadow-2xl shadow-purple-200 ring-2 ring-purple-300 ring-opacity-50"
              : ""
          }`}
        >
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-balance">{highlightText(exp.title, searchQuery)}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-slate-800">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span className="text-sm">{highlightText(exp.company, searchQuery)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.period}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline">{exp.type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-pretty">{highlightText(exp.description, searchQuery)}</p>

            <div>
              <h4 className="font-semibold mb-2">Key Achievements:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {exp.achievements.map((achievement, index) => (
                  <li key={index} className="text-pretty">
                    {highlightText(achievement, searchQuery)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {exp.skills.map((skill) => (
                <Badge key={skill} variant={selectedSkill === skill ? "default" : "secondary"} className="text-xs">
                  {skill.replace("-", " ").toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
