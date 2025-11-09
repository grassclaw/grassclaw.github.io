import workExperienceData from "@/data/work-experience.json"
import educationData from "@/data/education.json"
import extracurricularsData from "@/data/extracurriculars.json"
import publicServiceData from "@/data/public-service.json"
import academicResearchData from "@/data/academic-research.json"
import personalInfoData from "@/data/personal-info.json"
import conferencesData from "@/data/conferences.json"

export type ResumeVariation = "default" | "cybersecurity" | "software" | "webux" | "research" | "leadership"

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

export function filterByTags<T extends { tags?: string[] }>(
  items: T[],
  tagFilters: string[],
  mode: "any" | "all" = "any",
): T[] {
  if (tagFilters.length === 0) return items

  return items.filter((item) => {
    if (!item.tags || item.tags.length === 0) return false

    if (mode === "any") {
      return tagFilters.some((tag) => item.tags!.includes(tag))
    } else {
      return tagFilters.every((tag) => item.tags!.includes(tag))
    }
  })
}

export function filterWorkExperienceBullets(
  workExperience: typeof workExperienceData.workExperience,
  tagFilters: string[],
): typeof workExperienceData.workExperience {
  return workExperience.map((job) => ({
    ...job,
    bullets: filterByTags(job.bullets, tagFilters),
  }))
}

export function filterTechnicalSkills(
  technicalSkills: typeof workExperienceData.technicalSkills,
  tagFilters: string[],
): typeof workExperienceData.technicalSkills {
  const filtered: typeof workExperienceData.technicalSkills = {}

  Object.entries(technicalSkills).forEach(([category, skills]) => {
    const filteredSkills = filterByTags(skills, tagFilters)
    if (filteredSkills.length > 0) {
      filtered[category] = filteredSkills
    }
  })

  return filtered
}

export function getPortfolioData(
  variation: ResumeVariation = "default",
  additionalFilters: string[] = [],
): FilteredPortfolioData {
  const variationConfig = personalInfoData.resumeVariations[variation as keyof typeof personalInfoData.resumeVariations]

  // Combine variation tag filters with additional filters
  const allTagFilters = variationConfig ? [...variationConfig.tagFilters, ...additionalFilters] : additionalFilters

  if (!variationConfig && additionalFilters.length === 0) {
    // Return all data for default variation with no filters
    return {
      personalInfo: personalInfoData.personalInfo,
      workExperience: workExperienceData.workExperience,
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

  // Filter work experience and bullets
  const filteredWorkExperience =
    allTagFilters.length > 0
      ? filterByTags(workExperienceData.workExperience, allTagFilters)
      : workExperienceData.workExperience
  const workExperienceWithFilteredBullets =
    allTagFilters.length > 0
      ? filterWorkExperienceBullets(filteredWorkExperience, allTagFilters)
      : filteredWorkExperience

  // Filter technical skills
  const filteredTechnicalSkills =
    allTagFilters.length > 0
      ? filterTechnicalSkills(workExperienceData.technicalSkills, allTagFilters)
      : workExperienceData.technicalSkills

  // Filter other sections
  const filteredEducation =
    allTagFilters.length > 0 ? filterByTags(educationData.education, allTagFilters) : educationData.education
  const filteredCertificates =
    allTagFilters.length > 0 ? filterByTags(educationData.certificates, allTagFilters) : educationData.certificates
  const filteredCampusInvolvement =
    allTagFilters.length > 0
      ? filterByTags(educationData.campusInvolvement, allTagFilters)
      : educationData.campusInvolvement
  const filteredExtracurriculars =
    allTagFilters.length > 0
      ? filterByTags(extracurricularsData.extracurriculars, allTagFilters)
      : extracurricularsData.extracurriculars
  const filteredPublicService =
    allTagFilters.length > 0
      ? filterByTags(publicServiceData.publicService, allTagFilters)
      : publicServiceData.publicService
  const filteredAcademicResearch =
    allTagFilters.length > 0
      ? filterByTags(academicResearchData.academicResearch, allTagFilters)
      : academicResearchData.academicResearch
  const filteredConferences =
    allTagFilters.length > 0 ? filterByTags(conferencesData.conferences, allTagFilters) : conferencesData.conferences

  return {
    personalInfo: {
      ...personalInfoData.personalInfo,
      introduction: {
        ...personalInfoData.personalInfo.introduction,
        current:
          (variationConfig && personalInfoData.personalInfo.introduction.variations[variationConfig.introduction]) ||
          personalInfoData.personalInfo.introduction.default,
      },
    },
    workExperience: workExperienceWithFilteredBullets,
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
  return Object.entries(personalInfoData.resumeVariations).map(([key, config]) => ({
    id: key as ResumeVariation,
    name: config.name,
    tagFilters: config.tagFilters,
  }))
}

export function getVariationKeywords(variation: ResumeVariation): string[] {
  const data = getPortfolioData(variation)
  const keywords: string[] = []

  // Extract keywords from work experience
  data.workExperience.forEach((job) => {
    keywords.push(job.title.toLowerCase(), job.company.toLowerCase())
    job.skills.forEach((skill) => keywords.push(skill.toLowerCase()))
    job.bullets.forEach((bullet) => {
      bullet.tags?.forEach((tag) => keywords.push(tag.toLowerCase()))
    })
  })

  // Extract keywords from technical skills
  Object.values(data.technicalSkills)
    .flat()
    .forEach((skill) => {
      keywords.push(skill.name.toLowerCase(), skill.id.toLowerCase())
      skill.tags?.forEach((tag) => keywords.push(tag.toLowerCase()))
    })

  // Extract keywords from other sections
  data.extracurriculars.forEach((item) => {
    keywords.push(item.title.toLowerCase(), item.organization.toLowerCase())
    item.tags?.forEach((tag) => keywords.push(tag.toLowerCase()))
  })

  data.publicService.forEach((item) => {
    keywords.push(item.title.toLowerCase(), item.organization.toLowerCase())
    item.tags?.forEach((tag) => keywords.push(tag.toLowerCase()))
  })

  data.academicResearch.forEach((item) => {
    keywords.push(item.title.toLowerCase())
    item.tags?.forEach((tag) => keywords.push(tag.toLowerCase()))
  })

  data.conferences.forEach((item) => {
    keywords.push(item.name.toLowerCase())
    if (item.companyName) keywords.push(item.companyName.toLowerCase())
    item.tags?.forEach((tag) => keywords.push(tag.toLowerCase()))
    item.searchKeywords?.forEach((keyword) => keywords.push(keyword.toLowerCase()))
  })

  // Remove duplicates and return
  return [...new Set(keywords)]
}
