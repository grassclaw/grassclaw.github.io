import workExperienceData from "@/data/work-experience.json"
import educationData from "@/data/education.json"
import extracurricularsData from "@/data/extracurriculars.json"
import publicServiceData from "@/data/public-service.json"
import academicResearchData from "@/data/academic-research.json"
import personalInfoData from "@/data/personal-info.json"
import resumeVariationsData from "@/data/resume-variations.json"
import conferencesData from "@/data/conferences.json"

export type ResumeAngle =
  | "default"
  | "architecture"
  | "ml-ai"
  | "cybersecurity"
  | "research"
  | "leadership"

export type ResumeVariation = ResumeAngle

export interface Bullet {
  text: string
  weight?: number
  angles?: string[]
  tags?: string[]
}

export interface TitlePhase {
  title: string
  period: string
  phase?: string
  description?: string
  angles?: string[]
  bullets: Bullet[]
}

export interface Tagged {
  angles?: string[]
  tags?: string[]
}

export interface FilteredPortfolioData {
  personalInfo: typeof personalInfoData.personalInfo
  workExperience: typeof workExperienceData.workExperience
  technicalSkills: typeof workExperienceData.technicalSkills
  education: typeof educationData.education
  certificates: typeof educationData.certificates
  campusInvolvement: typeof educationData.campusInvolvement
  extracurriculars: typeof extracurricularsData.extracurriculars
  publicService: typeof publicServiceData.publicService
  academicResearch: typeof academicResearchData.academicResearch
  conferences: typeof conferencesData.conferences
}

export function filterByAngles<T extends Tagged>(
  items: T[],
  angles: string[],
  mode: "any" | "all" = "any",
): T[] {
  if (angles.length === 0) return items
  return items.filter((item) => {
    if (!item.angles || item.angles.length === 0) return false
    return mode === "any"
      ? angles.some((a) => item.angles!.includes(a))
      : angles.every((a) => item.angles!.includes(a))
  })
}

export function filterByTags<T extends Tagged>(
  items: T[],
  tags: string[],
  mode: "any" | "all" = "any",
): T[] {
  if (tags.length === 0) return items
  return items.filter((item) => {
    if (!item.tags || item.tags.length === 0) return false
    return mode === "any"
      ? tags.some((t) => item.tags!.includes(t))
      : tags.every((t) => item.tags!.includes(t))
  })
}

export function flattenJobBullets(
  job: typeof workExperienceData.workExperience[number],
): Bullet[] {
  return (job.titleHistory || []).flatMap((phase) => phase.bullets || [])
}

// Legacy-shape adapter: synthesizes `title`, `description`, `bullets`, `skills`,
// `type`, and `titleProgression` on each job so the existing React UI
// (work-experience.tsx, etc.) keeps working without being rewritten.
function asLegacyJob(job: any) {
  const phases = job.titleHistory || []
  const latest = phases[0] || {}
  const bullets = phases.flatMap((p: any) => p.bullets || [])
  const titleProgression =
    phases.length > 1
      ? phases
          .slice()
          .reverse()
          .map((p: any) => `${p.title} (${p.period})`)
          .join(" → ")
      : undefined
  return {
    ...job,
    title: latest.title || "",
    description: latest.description || "",
    bullets,
    skills: job.stack || [],
    type: job.employmentType || "",
    titleProgression,
  }
}

function adaptWorkExperience(jobs: any[]) {
  return jobs.map(asLegacyJob)
}

export function rankBullets(bullets: Bullet[], emphasizedTags: string[] = []): Bullet[] {
  return [...bullets].sort((a, b) => {
    const boostA = (a.tags || []).some((t) => emphasizedTags.includes(t)) ? -0.5 : 0
    const boostB = (b.tags || []).some((t) => emphasizedTags.includes(t)) ? -0.5 : 0
    return (a.weight ?? 2) + boostA - ((b.weight ?? 2) + boostB)
  })
}

export function getPortfolioData(
  variation: ResumeVariation = "default",
  additionalAngles: string[] = [],
): FilteredPortfolioData {
  const angleConfig =
    variation !== "default"
      ? resumeVariationsData.angles[variation as keyof typeof resumeVariationsData.angles]
      : undefined

  const angleFilter =
    angleConfig !== undefined ? [variation, ...additionalAngles] : additionalAngles

  if (!angleConfig && additionalAngles.length === 0) {
    return {
      personalInfo: personalInfoData.personalInfo,
      workExperience: adaptWorkExperience(workExperienceData.workExperience) as any,
      technicalSkills: workExperienceData.technicalSkills,
      education: educationData.education,
      certificates: educationData.certificates,
      campusInvolvement: educationData.campusInvolvement,
      extracurriculars: extracurricularsData.extracurriculars,
      publicService: publicServiceData.publicService,
      academicResearch: academicResearchData.academicResearch,
      conferences: conferencesData.conferences,
    }
  }

  const filteredWorkExperience =
    angleFilter.length > 0
      ? filterByAngles(workExperienceData.workExperience, angleFilter)
      : workExperienceData.workExperience

  const filteredEducation =
    angleFilter.length > 0 ? filterByAngles(educationData.education, angleFilter) : educationData.education
  const filteredCertificates =
    angleFilter.length > 0 ? filterByAngles(educationData.certificates, angleFilter) : educationData.certificates
  const filteredCampusInvolvement =
    angleFilter.length > 0
      ? filterByAngles(educationData.campusInvolvement, angleFilter)
      : educationData.campusInvolvement
  const filteredExtracurriculars =
    angleFilter.length > 0
      ? filterByAngles(extracurricularsData.extracurriculars, angleFilter)
      : extracurricularsData.extracurriculars
  const filteredPublicService =
    angleFilter.length > 0 ? filterByAngles(publicServiceData.publicService, angleFilter) : publicServiceData.publicService
  const filteredAcademicResearch =
    angleFilter.length > 0
      ? filterByAngles(academicResearchData.academicResearch, angleFilter)
      : academicResearchData.academicResearch
  // Conferences are venue/reference data — always return the full list regardless of angle filter
  const filteredConferences = conferencesData.conferences

  const filteredTechnicalSkills: typeof workExperienceData.technicalSkills = {} as any
  Object.entries(workExperienceData.technicalSkills).forEach(([category, skills]) => {
    const filteredSkills = angleFilter.length > 0 ? filterByAngles(skills as any, angleFilter) : skills
    if ((filteredSkills as any[]).length > 0) {
      ;(filteredTechnicalSkills as any)[category] = filteredSkills
    }
  })

  return {
    personalInfo: personalInfoData.personalInfo,
    workExperience: adaptWorkExperience(
      filteredWorkExperience.length > 0 ? filteredWorkExperience : workExperienceData.workExperience,
    ) as any,
    technicalSkills: filteredTechnicalSkills,
    education: filteredEducation.length > 0 ? filteredEducation : educationData.education,
    certificates: filteredCertificates.length > 0 ? filteredCertificates : educationData.certificates,
    campusInvolvement:
      filteredCampusInvolvement.length > 0 ? filteredCampusInvolvement : educationData.campusInvolvement,
    extracurriculars:
      filteredExtracurriculars.length > 0 ? filteredExtracurriculars : extracurricularsData.extracurriculars,
    publicService: filteredPublicService.length > 0 ? filteredPublicService : publicServiceData.publicService,
    academicResearch:
      filteredAcademicResearch.length > 0 ? filteredAcademicResearch : academicResearchData.academicResearch,
    conferences: filteredConferences.length > 0 ? filteredConferences : conferencesData.conferences,
  }
}

export function getAvailableVariations() {
  return Object.entries(resumeVariationsData.angles).map(([key, config]) => ({
    id: key as ResumeAngle,
    name: config.name,
    tagFilters: config.tagFilters,
    description: config.description,
  }))
}

export function getVariationKeywords(variation: ResumeVariation): string[] {
  const data = getPortfolioData(variation)
  const keywords: string[] = []

  data.workExperience.forEach((job) => {
    keywords.push(job.company.toLowerCase())
    ;(job.titleHistory || []).forEach((phase) => {
      keywords.push(phase.title.toLowerCase())
      phase.bullets?.forEach((b) => b.tags?.forEach((t) => keywords.push(t.toLowerCase())))
    })
    job.tags?.forEach((t) => keywords.push(t.toLowerCase()))
  })

  Object.values(data.technicalSkills)
    .flat()
    .forEach((skill: any) => {
      keywords.push(skill.name.toLowerCase(), skill.id.toLowerCase())
      skill.tags?.forEach((t: string) => keywords.push(t.toLowerCase()))
    })

  data.extracurriculars.forEach((item) => {
    keywords.push(item.title.toLowerCase(), item.organization.toLowerCase())
    item.tags?.forEach((t) => keywords.push(t.toLowerCase()))
  })

  data.publicService.forEach((item) => {
    keywords.push(item.title.toLowerCase(), item.organization.toLowerCase())
    item.tags?.forEach((t) => keywords.push(t.toLowerCase()))
  })

  data.academicResearch.forEach((item) => {
    keywords.push(item.title.toLowerCase())
    item.tags?.forEach((t) => keywords.push(t.toLowerCase()))
  })

  data.conferences.forEach((item: any) => {
    keywords.push(item.name.toLowerCase())
    if (item.companyName) keywords.push(item.companyName.toLowerCase())
    item.tags?.forEach((tag: string) => keywords.push(tag.toLowerCase()))
    item.searchKeywords?.forEach((keyword: string) => keywords.push(keyword.toLowerCase()))
  })

  return [...new Set(keywords)]
}
