"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FilterDropdown } from "./filter-dropdown"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

const suggestedKeywords = [
  "LLMs",
  "AWS",
  "LangChain",
  "Python",
  "Golang",
  "Cybersecurity",
  "Machine Learning",
  "Threat Intelligence",
  "Docker",
  "Kubernetes",
]

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-white mr-2">Quick search:</span>
        {suggestedKeywords.map((keyword) => (
          <Badge
            key={keyword}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => onSearchChange(keyword)}
          >
            {keyword}
          </Badge>
        ))}
      </div>

      <div className="flex gap-3 max-w-4xl mx-auto items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search skills, technologies, projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-14 text-lg border-2 border-border hover:border-primary/50 focus:border-primary transition-colors placeholder:text-muted-foreground rounded-xl shadow-sm bg-black font-semibold text-white"
          />
        </div>
        <FilterDropdown />
      </div>
    </div>
  )
}
