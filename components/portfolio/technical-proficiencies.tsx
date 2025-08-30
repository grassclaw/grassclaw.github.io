"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TechnicalProficienciesProps {
  searchQuery: string
  onSkillClick: (skill: string) => void
  selectedSkill: string | null
}

export function TechnicalProficiencies({ searchQuery, onSkillClick, selectedSkill }: TechnicalProficienciesProps) {
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
    "nagra-2025": "Nagra Kudelski Group - Senior Cyber ML Architect",
    "netstar-2024": "Netstar DTA - Senior ML Engineer",
    "self-2022": "Self-Proprietor - Security Auditor & AI Consultant",
    "2u-2021": "2U Education - Technical Lead",
    "netstar-2020": "Netstar - Threat Intelligence Engineer",
    "barrick-2018": "Barrick Gold - Environmental Engineer",
  }

  const filteredCategories = skillCategories
    .map((category) => ({
      ...category,
      skills: category.skills.filter(
        (skill) =>
          searchQuery === "" ||
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.category.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.skills.length > 0)

  return (
    <div className="space-y-6">
      {filteredCategories.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle className="text-lg text-balance">{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {category.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Button
                      variant={selectedSkill === skill.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onSkillClick(skill.id)}
                      className="font-medium"
                    >
                      {skill.name}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skill.jobs.map((jobId) => (
                      <Badge key={jobId} variant="outline" className="text-xs">
                        {jobTitles[jobId as keyof typeof jobTitles]?.split(" - ")[0] || jobId}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredCategories.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No technical skills match your current search.</p>
        </Card>
      )}

      {selectedSkill && (
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <span className="font-medium">Selected:</span>{" "}
                {skillCategories.flatMap((cat) => cat.skills).find((skill) => skill.id === selectedSkill)?.name}
              </p>
              <Button variant="ghost" size="sm" onClick={() => onSkillClick("")}>
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
