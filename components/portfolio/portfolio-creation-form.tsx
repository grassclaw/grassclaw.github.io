"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Plus, Trash2, Wand2 } from "lucide-react"

interface PortfolioCreationFormProps {
  userId: string
  userEmail: string
}

interface WorkExperience {
  title: string
  company: string
  period: string
  location: string
  description: string
  skills: string[]
}

interface Education {
  degree: string
  school: string
  period: string
  description: string
}

export function PortfolioCreationForm({ userId, userEmail }: PortfolioCreationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  // Form data
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    displayName: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
  })

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    {
      title: "",
      company: "",
      period: "",
      location: "",
      description: "",
      skills: [],
    },
  ])

  const [education, setEducation] = useState<Education[]>([
    {
      degree: "",
      school: "",
      period: "",
      description: "",
    },
  ])

  const steps = [
    { title: "Personal Information", description: "Tell us about yourself" },
    { title: "Work Experience", description: "Add your professional experience" },
    { title: "Education", description: "Add your educational background" },
    { title: "Generate Portfolio", description: "Create your portfolio" },
  ]

  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        title: "",
        company: "",
        period: "",
        location: "",
        description: "",
        skills: [],
      },
    ])
  }

  const removeWorkExperience = (index: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index))
  }

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...workExperience]
    updated[index] = { ...updated[index], [field]: value }
    setWorkExperience(updated)
  }

  const addEducation = () => {
    setEducation([
      ...education,
      {
        degree: "",
        school: "",
        period: "",
        description: "",
      },
    ])
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    setEducation(updated)
  }

  const generatePortfolio = async () => {
    setIsGenerating(true)

    try {
      const supabase = createClient()

      // Update profile
      await supabase.from("profiles").upsert({
        id: userId,
        email: userEmail,
        full_name: personalInfo.fullName,
        display_name: personalInfo.displayName,
        bio: personalInfo.bio,
        location: personalInfo.location,
        website_url: personalInfo.website,
        github_url: personalInfo.github,
        linkedin_url: personalInfo.linkedin,
      })

      // Generate work experience data
      const workData = workExperience
        .filter((exp) => exp.title && exp.company)
        .map((exp, index) => ({
          id: `work-${index + 1}`,
          title: exp.title,
          company: exp.company,
          period: exp.period,
          location: exp.location,
          description: exp.description,
          skills: exp.skills,
          tags: ["professional", "experience"],
        }))

      // Generate education data
      const educationData = education
        .filter((edu) => edu.degree && edu.school)
        .map((edu, index) => ({
          id: `edu-${index + 1}`,
          degree: edu.degree,
          school: edu.school,
          period: edu.period,
          description: edu.description,
          tags: ["education", "academic"],
        }))

      // Save portfolio data
      if (workData.length > 0) {
        await supabase.from("portfolio_data").upsert({
          user_id: userId,
          data_type: "work-experience",
          data: workData,
        })
      }

      if (educationData.length > 0) {
        await supabase.from("portfolio_data").upsert({
          user_id: userId,
          data_type: "education",
          data: educationData,
        })
      }

      // Generate basic search keywords
      const workKeywords = [
        ...workData.flatMap((exp) => [exp.title.toLowerCase(), exp.company.toLowerCase()]),
        ...workData.flatMap((exp) => exp.skills.map((skill) => skill.toLowerCase())),
      ]

      const educationKeywords = [
        ...educationData.flatMap((edu) => [edu.degree.toLowerCase(), edu.school.toLowerCase()]),
      ]

      await supabase.from("search_keywords").upsert([
        {
          user_id: userId,
          tab_name: "workExperience",
          keywords: [...new Set(workKeywords)],
        },
        {
          user_id: userId,
          tab_name: "education",
          keywords: [...new Set(educationKeywords)],
        },
      ])

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error generating portfolio:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Portfolio</h1>
          <p className="text-slate-300">Let's build your professional portfolio step by step</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index <= currentStep
                      ? "bg-purple-600 text-white"
                      : "bg-white/20 text-slate-400 border border-white/20"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="text-xs text-slate-300 mt-2 text-center max-w-20">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-slate-400">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-slate-300">{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Personal Information */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-white">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={personalInfo.displayName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, displayName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="John"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="bio" className="text-white">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={personalInfo.bio}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-white">
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={personalInfo.website}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-white">
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    value={personalInfo.github}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-white">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={personalInfo.linkedin}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            )}

            {/* Step 1: Work Experience */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {workExperience.map((exp, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-white text-lg">Experience {index + 1}</CardTitle>
                      {workExperience.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeWorkExperience(index)}
                          className="border-red-400/20 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Job Title *</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateWorkExperience(index, "title", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Company *</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Tech Company Inc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Period</Label>
                        <Input
                          value={exp.period}
                          onChange={(e) => updateWorkExperience(index, "period", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="2022 - Present"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Location</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateWorkExperience(index, "location", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Remote"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-white">Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Describe your role and achievements..."
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-white">Skills (comma-separated)</Label>
                        <Input
                          value={exp.skills.join(", ")}
                          onChange={(e) =>
                            updateWorkExperience(
                              index,
                              "skills",
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter((s) => s),
                            )
                          }
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="React, TypeScript, Node.js"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  onClick={addWorkExperience}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Experience
                </Button>
              </div>
            )}

            {/* Step 2: Education */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-white text-lg">Education {index + 1}</CardTitle>
                      {education.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          className="border-red-400/20 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Degree *</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Bachelor of Science in Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">School *</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) => updateEducation(index, "school", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="University of Technology"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Period</Label>
                        <Input
                          value={edu.period}
                          onChange={(e) => updateEducation(index, "period", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="2018 - 2022"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-white">Description</Label>
                        <Textarea
                          value={edu.description}
                          onChange={(e) => updateEducation(index, "description", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Relevant coursework, achievements, etc..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  onClick={addEducation}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Education
                </Button>
              </div>
            )}

            {/* Step 3: Generate Portfolio */}
            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Wand2 className="w-12 h-12 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate Your Portfolio!</h3>
                  <p className="text-slate-300">
                    We'll create your professional portfolio based on the information you've provided. You can always
                    edit and customize it later.
                  </p>
                </div>
                <Button
                  onClick={generatePortfolio}
                  disabled={isGenerating}
                  className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
                >
                  {isGenerating ? "Generating..." : "Generate My Portfolio"}
                </Button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-white/20">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentStep < steps.length - 1 && (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 0 && !personalInfo.fullName) ||
                    (currentStep === 1 && !workExperience.some((exp) => exp.title && exp.company)) ||
                    (currentStep === 2 && !education.some((edu) => edu.degree && edu.school))
                  }
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
