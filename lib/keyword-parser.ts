import fs from "fs/promises"
import path from "path"

// Types for portfolio data
interface PortfolioData {
  workExperience?: any[]
  education?: any[]
  extracurriculars?: any[]
  publicService?: any[]
  academicResearch?: any[]
}

interface SearchKeywords {
  workExperience: string[]
  education: string[]
  academia: string[]
  extracurriculars: string[]
  publicService: string[]
}

// Extract keywords from text content
function extractKeywords(text: string): string[] {
  if (!text) return []

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Remove punctuation
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 && // Skip short words
        ![
          "the",
          "and",
          "for",
          "are",
          "but",
          "not",
          "you",
          "all",
          "can",
          "had",
          "her",
          "was",
          "one",
          "our",
          "out",
          "day",
          "get",
          "has",
          "him",
          "his",
          "how",
          "man",
          "new",
          "now",
          "old",
          "see",
          "two",
          "way",
          "who",
          "boy",
          "did",
          "its",
          "let",
          "put",
          "say",
          "she",
          "too",
          "use",
        ].includes(word), // Skip common words
    )
    .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
}

// Parse portfolio data and suggest new keywords
export async function parsePortfolioForKeywords(): Promise<{
  suggested: SearchKeywords
  current: SearchKeywords
}> {
  try {
    // Load current keywords
    const keywordsPath = path.join(process.cwd(), "data", "search-keywords.json")
    const currentKeywords: SearchKeywords = JSON.parse(await fs.readFile(keywordsPath, "utf-8"))

    // Load portfolio data files
    const dataDir = path.join(process.cwd(), "data")
    const workExp = JSON.parse(await fs.readFile(path.join(dataDir, "work-experience.json"), "utf-8"))
    const education = JSON.parse(await fs.readFile(path.join(dataDir, "education.json"), "utf-8"))
    const extracurriculars = JSON.parse(await fs.readFile(path.join(dataDir, "extracurriculars.json"), "utf-8"))
    const publicService = JSON.parse(await fs.readFile(path.join(dataDir, "public-service.json"), "utf-8"))
    const academia = JSON.parse(await fs.readFile(path.join(dataDir, "academic-research.json"), "utf-8"))

    // Extract keywords from work experience
    const workKeywords = new Set<string>()
    workExp.forEach((job: any) => {
      extractKeywords(job.title).forEach((k) => workKeywords.add(k))
      extractKeywords(job.company).forEach((k) => workKeywords.add(k))
      extractKeywords(job.summary).forEach((k) => workKeywords.add(k))
      job.achievements?.forEach((achievement: any) => {
        extractKeywords(achievement.text).forEach((k) => workKeywords.add(k))
      })
      job.skills?.forEach((skill: string) => {
        extractKeywords(skill).forEach((k) => workKeywords.add(k))
      })
    })

    // Extract keywords from education
    const eduKeywords = new Set<string>()
    education.degrees?.forEach((degree: any) => {
      extractKeywords(degree.degree).forEach((k) => eduKeywords.add(k))
      extractKeywords(degree.school).forEach((k) => eduKeywords.add(k))
      extractKeywords(degree.field).forEach((k) => eduKeywords.add(k))
    })
    education.certificates?.forEach((cert: any) => {
      extractKeywords(cert.name).forEach((k) => eduKeywords.add(k))
      extractKeywords(cert.issuer).forEach((k) => eduKeywords.add(k))
    })
    education.campusInvolvement?.forEach((activity: any) => {
      extractKeywords(activity.title).forEach((k) => eduKeywords.add(k))
      extractKeywords(activity.organization).forEach((k) => eduKeywords.add(k))
      extractKeywords(activity.description).forEach((k) => eduKeywords.add(k))
    })

    // Extract keywords from academia
    const academiaKeywords = new Set<string>()
    academia.forEach((paper: any) => {
      extractKeywords(paper.title).forEach((k) => academiaKeywords.add(k))
      extractKeywords(paper.conference).forEach((k) => academiaKeywords.add(k))
      extractKeywords(paper.description).forEach((k) => academiaKeywords.add(k))
      paper.tags?.forEach((tag: string) => {
        extractKeywords(tag).forEach((k) => academiaKeywords.add(k))
      })
    })

    // Extract keywords from extracurriculars
    const extraKeywords = new Set<string>()
    extracurriculars.forEach((activity: any) => {
      extractKeywords(activity.title).forEach((k) => extraKeywords.add(k))
      extractKeywords(activity.organization).forEach((k) => extraKeywords.add(k))
      extractKeywords(activity.description).forEach((k) => extraKeywords.add(k))
      activity.skills?.forEach((skill: string) => {
        extractKeywords(skill).forEach((k) => extraKeywords.add(k))
      })
    })

    // Extract keywords from public service
    const serviceKeywords = new Set<string>()
    publicService.forEach((service: any) => {
      extractKeywords(service.title).forEach((k) => serviceKeywords.add(k))
      extractKeywords(service.organization).forEach((k) => serviceKeywords.add(k))
      extractKeywords(service.description).forEach((k) => serviceKeywords.add(k))
      service.responsibilities?.forEach((resp: string) => {
        extractKeywords(resp).forEach((k) => serviceKeywords.add(k))
      })
    })

    const suggested: SearchKeywords = {
      workExperience: [...workKeywords].sort(),
      education: [...eduKeywords].sort(),
      academia: [...academiaKeywords].sort(),
      extracurriculars: [...extraKeywords].sort(),
      publicService: [...serviceKeywords].sort(),
    }

    return { suggested, current: currentKeywords }
  } catch (error) {
    console.error("Error parsing portfolio for keywords:", error)
    throw error
  }
}

// Update keywords file with new suggestions
export async function updateKeywords(newKeywords: SearchKeywords): Promise<void> {
  try {
    const keywordsPath = path.join(process.cwd(), "data", "search-keywords.json")
    await fs.writeFile(keywordsPath, JSON.stringify(newKeywords, null, 2))
  } catch (error) {
    console.error("Error updating keywords file:", error)
    throw error
  }
}

// Load keywords from JSON file
export async function loadSearchKeywords(): Promise<SearchKeywords> {
  try {
    const keywordsPath = path.join(process.cwd(), "data", "search-keywords.json")
    return JSON.parse(await fs.readFile(keywordsPath, "utf-8"))
  } catch (error) {
    console.error("Error loading search keywords:", error)
    throw error
  }
}
