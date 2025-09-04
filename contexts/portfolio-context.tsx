"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  type ResumeVariation,
  type FilteredPortfolioData,
  getPortfolioData,
  getAvailableVariations,
} from "@/lib/portfolio-data"

interface PortfolioContextType {
  currentVariation: ResumeVariation
  setCurrentVariation: (variation: ResumeVariation) => void
  additionalFilters: string[]
  setAdditionalFilters: React.Dispatch<React.SetStateAction<string[]>>
  portfolioData: FilteredPortfolioData
  availableVariations: Array<{ id: ResumeVariation; name: string; tagFilters: string[] }>
  isLoading: boolean
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [currentVariation, setCurrentVariation] = useState<ResumeVariation>("default")
  const [additionalFilters, setAdditionalFilters] = useState<string[]>([])
  const [portfolioData, setPortfolioData] = useState<FilteredPortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const availableVariations = getAvailableVariations()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = getPortfolioData(currentVariation, additionalFilters)
        setPortfolioData(data)
      } catch (error) {
        console.error("Failed to load portfolio data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [currentVariation, additionalFilters])

  const contextValue: PortfolioContextType = {
    currentVariation,
    setCurrentVariation,
    additionalFilters,
    setAdditionalFilters,
    portfolioData: portfolioData!,
    availableVariations,
    isLoading,
  }

  if (isLoading || !portfolioData) {
    return <div className="flex items-center justify-center min-h-screen">Loading portfolio data...</div>
  }

  return <PortfolioContext.Provider value={contextValue}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
