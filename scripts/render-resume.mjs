#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")

const readJson = (rel) => JSON.parse(readFileSync(resolve(ROOT, rel), "utf8"))

const roleId = process.argv[2]
if (!roleId) {
  console.error("usage: node scripts/render-resume.mjs <role-id>")
  console.error("example: node scripts/render-resume.mjs jataware-engineering")
  process.exit(1)
}

const role = readJson(`data/roles/${roleId}.json`)
const personal = readJson("data/personal-info.json").personalInfo
const variations = readJson("data/resume-variations.json").angles
const work = readJson("data/work-experience.json")
const edu = readJson("data/education.json")
const research = readJson("data/academic-research.json").academicResearch
const extracur = readJson("data/extracurriculars.json").extracurriculars
const service = readJson("data/public-service.json").publicService

const angleFilter = new Set(role.angles || [])
const emphasizedTags = new Set(role.tagEmphasize || [])
const omit = new Set(role.omitIds || [])

const matchesAngles = (item) => {
  if (!item || omit.has(item.id)) return false
  const itemAngles = item.angles || []
  if (angleFilter.size === 0) return true
  return itemAngles.some((a) => angleFilter.has(a))
}

const rankBullet = (b) => {
  const weight = typeof b.weight === "number" ? b.weight : 2
  const emphasized = (b.tags || []).some((t) => emphasizedTags.has(t))
  return weight - (emphasized ? 0.5 : 0)
}

const selectBullets = (bullets = [], limit) => {
  const ranked = [...bullets].sort((a, b) => rankBullet(a) - rankBullet(b))
  return typeof limit === "number" ? ranked.slice(0, limit) : ranked
}

const sectionBreak = "\n\n---\n\n"

const renderHeader = () => {
  const contact = [
    personal.email,
    personal.linkedin,
    personal.github,
    personal.location,
    personal.remote ? "Remote (USA)" : undefined,
  ]
    .filter(Boolean)
    .join(" · ")

  const status = [
    personal.citizenship,
    personal.clearance ? `Security Clearance: ${personal.clearance}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ")

  const subtitle = role.headerSubtitle || variations[role.anglePrimary]?.name || "Senior Engineer"

  return [`# ${personal.name}`, "", `**${subtitle}**`, "", contact, "", `**${status}**`].join("\n")
}

const renderSummary = () => {
  const intro = role.introOverride || personal.introductions[role.anglePrimary] || personal.introductions.default
  return `## Summary\n\n${intro}`
}

const renderSkills = () => {
  const categories = work.technicalSkills
  const lines = ["## Technical Skills"]
  for (const [category, skills] of Object.entries(categories)) {
    const filtered = skills.filter((s) => matchesAngles(s) || (s.angles || []).length === 0 ? matchesAngles(s) : false)
    if (filtered.length === 0) continue
    const names = filtered.map((s) => s.name).join(", ")
    lines.push("", `**${category}** — ${names}`)
  }
  return lines.join("\n")
}

const renderJob = (job) => {
  const phases = (job.titleHistory || []).filter((p) => {
    if (!p.angles || p.angles.length === 0) return true
    return p.angles.some((a) => angleFilter.has(a)) || angleFilter.size === 0
  })
  if (phases.length === 0) return ""

  const lines = []
  lines.push(`### ${job.company}`)
  lines.push(`*${job.employmentType} · ${job.location} · ${job.period}*`)
  lines.push("")

  const multiPhase = phases.length > 1

  for (const phase of phases) {
    const phaseHeader = multiPhase
      ? `#### ${phase.title} *(${phase.period})*`
      : `#### ${phase.title}`
    lines.push(phaseHeader, "")
    if (phase.description) lines.push(phase.description, "")
    const bullets = selectBullets(phase.bullets, role.maxBulletsPerJob)
    for (const b of bullets) {
      lines.push(`- ${b.text}`)
    }
    lines.push("")
  }

  if (job.stack?.length) {
    lines.push(`**Stack:** ${job.stack.join(", ")}`)
  }

  return lines.join("\n").trim()
}

const renderExperience = () => {
  const jobs = work.workExperience.filter(matchesAngles)
  if (jobs.length === 0) return ""
  const lines = ["## Experience", ""]
  const currentJobs = jobs.filter((j) => (j.tags || []).includes("current"))
  const fulltimeCurrent = currentJobs.filter((j) => j.employmentType === "Full-time")
  const contractCurrent = currentJobs.filter((j) => j.employmentType && j.employmentType.toLowerCase().includes("contract"))
  if (currentJobs.length > 1 && fulltimeCurrent.length >= 1) {
    const contractWord = contractCurrent.length === 1 ? "contract" : "contracts"
    const contractCount = contractCurrent.length === 2 ? "two" : contractCurrent.length === 1 ? "one" : `${contractCurrent.length}`
    lines.push(
      `*Currently holding one full-time role alongside ${contractCount} concurrent consulting ${contractWord}.*`,
      "",
    )
  }
  for (const job of jobs) {
    const rendered = renderJob(job)
    if (rendered) {
      lines.push(rendered, "")
    }
  }
  return lines.join("\n").trim()
}

const renderResearch = () => {
  const items = research.filter(matchesAngles)
  if (items.length === 0) return ""
  const lines = ["## Research & Publications", ""]
  for (const r of items) {
    const venuePart =
      r.conference && r.conference !== "pending"
        ? `${r.conference}, ${r.year}`
        : `${r.status || "In preparation"}, ${r.year}`
    const statusTail =
      r.status && r.conference && r.conference !== "pending" ? ` — ${r.status}` : ""
    lines.push(`**${r.title}**`)
    const authorLabel = Array.isArray(r.authors) && r.authors.length > 0 ? r.authors.join(", ") : r.role
    const meta = [`*${venuePart}${statusTail}.*`, authorLabel, r.researchGroup].filter(Boolean).join(" · ")
    lines.push(meta)
    if (r.paperLink) lines.push(`[Paper](${r.paperLink})`)
    if (r.description) lines.push("", r.description)
    lines.push("")
  }
  return lines.join("\n").trim()
}

const ACHIEVEMENT_IDS = new Set(["eagle-scout"])

const renderEducation = () => {
  const degrees = edu.education.filter(matchesAngles)
  const certs = edu.certificates.filter((c) => matchesAngles(c) && !ACHIEVEMENT_IDS.has(c.id))
  if (degrees.length === 0 && certs.length === 0) return ""
  const lines = ["## Education", ""]
  for (const d of degrees) {
    const status = d.status === "in-progress" ? ` *(${d.year}, in progress)*` : ` *(${d.year})*`
    lines.push(`- **${d.degree}** — ${d.institution}${status}`)
  }
  for (const c of certs) {
    const status = c.status === "expected" ? ` *(expected ${c.year})*` : c.year ? ` *(${c.year})*` : ""
    lines.push(`- **${c.name}** — ${c.issuer}${status}`)
  }
  return lines.join("\n").trim()
}

const renderPublicService = () => {
  const items = [
    ...service.filter(matchesAngles),
    ...edu.campusInvolvement.filter(matchesAngles),
  ]
  if (items.length === 0) return ""
  const lines = ["## Public Service & Leadership", ""]
  for (const s of items) {
    const period = s.period || s.year || ""
    const desc = s.description ? ` — ${s.description.split(".")[0]}` : ""
    lines.push(`- **${s.title}** — ${s.organization}${period ? ` *(${period})*` : ""}${desc}`)
  }
  const eagle = edu.certificates.find((c) => c.id === "eagle-scout")
  if (eagle && !omit.has(eagle.id) && matchesAngles(eagle)) {
    lines.push(`- **Eagle Scout** — Boy Scouts of America`)
  }
  return lines.join("\n").trim()
}

const renderExtracurriculars = () => {
  const items = extracur.filter(matchesAngles)
  if (items.length === 0) return ""
  const lines = ["## Additional", ""]
  for (const x of items) {
    lines.push(`- **${x.title}** — ${x.organization} *(${x.period})*`)
  }
  return lines.join("\n").trim()
}

const renderWhyCompany = () => {
  if (!role.whyCompany) return ""
  return `## Why ${role.company}\n\n${role.whyCompany}`
}

const sections = []
sections.push(renderHeader())
if (role.includeSections?.summary !== false) sections.push(renderSummary())
if (role.includeSections?.technicalSkills !== false) sections.push(renderSkills())
if (role.includeSections?.experience !== false) sections.push(renderExperience())
if (role.includeSections?.research !== false) sections.push(renderResearch())
if (role.includeSections?.education !== false) sections.push(renderEducation())
if (role.includeSections?.publicService !== false) sections.push(renderPublicService())
if (role.includeSections?.extracurriculars) sections.push(renderExtracurriculars())
if (role.includeSections?.whyCompany !== false) sections.push(renderWhyCompany())

const output = sections.filter(Boolean).join(sectionBreak) + "\n"

const outDir = resolve(ROOT, "resumes")
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
const outPath = resolve(outDir, `${roleId}.md`)
writeFileSync(outPath, output)

console.log(`✓ wrote ${outPath}`)
console.log(`  role: ${role.company} — ${role.role}`)
console.log(`  angle: ${role.anglePrimary} (+ ${(role.angles || []).filter((a) => a !== role.anglePrimary).join(", ") || "none"})`)
console.log(`  ${output.length} chars, ~${Math.round(output.split("\n").length)} lines`)
