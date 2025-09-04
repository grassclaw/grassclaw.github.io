"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePortfolio } from "@/contexts/portfolio-context"

const filterOptions = [
  { id: "leadership", label: "Leadership", category: "Skills" },
  { id: "research", label: "Research", category: "Skills" },
  { id: "automation", label: "Automation", category: "Skills" },
  { id: "cloud", label: "Cloud", category: "Skills" },
  { id: "ml", label: "Machine Learning", category: "Skills" },
  { id: "security", label: "Security", category: "Skills" },
  { id: "webdev", label: "Web Development", category: "Skills" },
  { id: "data", label: "Data Analysis", category: "Skills" },
  { id: "teaching", label: "Teaching", category: "Experience" },
  { id: "government", label: "Government", category: "Experience" },
  { id: "academic", label: "Academic", category: "Experience" },
  { id: "startup", label: "Startup", category: "Experience" },
]

interface FilterDropdownProps {
  className?: string
}

export function FilterDropdown({ className }: FilterDropdownProps) {
  const { additionalFilters, setAdditionalFilters } = usePortfolio()
  const [isOpen, setIsOpen] = useState(false)

  const toggleFilter = (filterId: string) => {
    setAdditionalFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId],
    )
  }

  const clearAllFilters = () => {
    setAdditionalFilters([])
  }

  const activeFilters = filterOptions.filter((option) => additionalFilters.includes(option.id))
  const skillFilters = filterOptions.filter((option) => option.category === "Skills")
  const experienceFilters = filterOptions.filter((option) => option.category === "Experience")

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-slate-800/50 border-slate-600/30 text-slate-200 hover:bg-slate-700/50"
          >
            <Filter className="w-4 h-4" />
            Filters
            {additionalFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-blue-500/20 text-blue-200 border-blue-400/30">
                {additionalFilters.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-slate-800/95 border-slate-600/30 backdrop-blur-sm">
          <DropdownMenuLabel className="text-slate-200">Filter Content</DropdownMenuLabel>
          {additionalFilters.length > 0 && (
            <>
              <DropdownMenuSeparator className="bg-slate-600/30" />
              <div className="px-2 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-full justify-start text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                >
                  <X className="w-3 h-3 mr-2" />
                  Clear All
                </Button>
              </div>
            </>
          )}
          <DropdownMenuSeparator className="bg-slate-600/30" />
          <DropdownMenuLabel className="text-slate-400 text-xs">Skills</DropdownMenuLabel>
          {skillFilters.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={additionalFilters.includes(option.id)}
              onCheckedChange={() => toggleFilter(option.id)}
              className="text-slate-200 focus:bg-slate-700/50 focus:text-slate-100"
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator className="bg-slate-600/30" />
          <DropdownMenuLabel className="text-slate-400 text-xs">Experience</DropdownMenuLabel>
          {experienceFilters.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={additionalFilters.includes(option.id)}
              onCheckedChange={() => toggleFilter(option.id)}
              className="text-slate-200 focus:bg-slate-700/50 focus:text-slate-100"
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filter badges */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="bg-blue-500/20 text-blue-200 border-blue-400/30 cursor-pointer hover:bg-blue-500/30"
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
