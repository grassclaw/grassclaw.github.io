"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FilterDropdown } from "./filter-dropdown"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearchEnter?: () => void
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

export function SearchBar({ searchQuery, onSearchChange, onSearchEnter }: SearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 max-w-4xl mx-auto items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-spectra-cyan w-5 h-5" />
          <Input
            type="text"
            placeholder="Search skills, technologies, projects…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearchEnter?.()
            }}
            className="pl-12 h-13 text-base border border-border hover:border-spectra-cyan/40 focus:border-spectra-cyan transition-colors placeholder:text-muted-foreground rounded-xl shadow-sm bg-input/60 text-foreground"
          />
        </div>
        <FilterDropdown />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">Quick search</span>
        {suggestedKeywords.map((keyword) => (
          <Badge
            key={keyword}
            variant="outline"
            className="cursor-pointer border-border/70 bg-secondary/40 text-secondary-foreground hover:border-spectra-cyan/60 hover:text-spectra-cyan transition-colors"
            onClick={() => onSearchChange(keyword)}
          >
            {keyword}
          </Badge>
        ))}
      </div>
    </div>
  )
}
