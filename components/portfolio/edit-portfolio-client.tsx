"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface PortfolioDataItem {
  id: string
  user_id: string
  data_type: string
  data: any
  created_at: string
  updated_at: string
}

interface KeywordsDataItem {
  id: string
  user_id: string
  tab_name: string
  keywords: string[]
  created_at: string
  updated_at: string
}

interface EditPortfolioClientProps {
  userId: string
  initialPortfolioData: PortfolioDataItem[]
  initialKeywordsData: KeywordsDataItem[]
}

export function EditPortfolioClient({ userId, initialPortfolioData, initialKeywordsData }: EditPortfolioClientProps) {
  const [portfolioData, setPortfolioData] = useState<Record<string, any>>(() => {
    const data: Record<string, any> = {}
    initialPortfolioData.forEach((item) => {
      data[item.data_type] = item.data
    })
    return data
  })

  const [keywordsData, setKeywordsData] = useState<Record<string, string[]>>(() => {
    const data: Record<string, string[]> = {}
    initialKeywordsData.forEach((item) => {
      data[item.tab_name] = item.keywords
    })
    return data
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      const supabase = createClient()

      // Save portfolio data
      for (const [dataType, data] of Object.entries(portfolioData)) {
        const { error } = await supabase.from("portfolio_data").upsert({
          user_id: userId,
          data_type: dataType,
          data: data,
          updated_at: new Date().toISOString(),
        })

        if (error) throw error
      }

      // Save keywords data
      for (const [tabName, keywords] of Object.entries(keywordsData)) {
        const { error } = await supabase.from("search_keywords").upsert({
          user_id: userId,
          tab_name: tabName,
          keywords: keywords,
          updated_at: new Date().toISOString(),
        })

        if (error) throw error
      }

      setSaveMessage("Portfolio saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error saving portfolio:", error)
      setSaveMessage("Error saving portfolio. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const updatePortfolioSection = (section: string, data: any) => {
    setPortfolioData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const updateKeywords = (tabName: string, keywords: string[]) => {
    setKeywordsData((prev) => ({
      ...prev,
      [tabName]: keywords,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              asChild
              variant="outline"
              className="mr-4 border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Portfolio</h1>
              <p className="text-slate-300 mt-2">Customize your portfolio content and settings</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                {saveMessage}
              </span>
            )}
            <Button onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Edit Interface */}
        <Tabs defaultValue="work-experience" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="work-experience" className="text-white data-[state=active]:text-foreground">
              Work Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="text-white data-[state=active]:text-foreground">
              Education
            </TabsTrigger>
            <TabsTrigger value="extracurriculars" className="text-white data-[state=active]:text-foreground">
              Extracurriculars
            </TabsTrigger>
            <TabsTrigger value="public-service" className="text-white data-[state=active]:text-foreground">
              Public Service
            </TabsTrigger>
            <TabsTrigger value="academic-research" className="text-white data-[state=active]:text-foreground">
              Academia
            </TabsTrigger>
            <TabsTrigger value="keywords" className="text-white data-[state=active]:text-foreground">
              Keywords
            </TabsTrigger>
          </TabsList>

          <TabsContent value="work-experience" className="mt-6">
            <WorkExperienceEditor
              data={portfolioData["work-experience"] || []}
              onUpdate={(data) => updatePortfolioSection("work-experience", data)}
            />
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <EducationEditor
              data={portfolioData["education"] || []}
              onUpdate={(data) => updatePortfolioSection("education", data)}
            />
          </TabsContent>

          <TabsContent value="extracurriculars" className="mt-6">
            <ExtracurricularsEditor
              data={portfolioData["extracurriculars"] || []}
              onUpdate={(data) => updatePortfolioSection("extracurriculars", data)}
            />
          </TabsContent>

          <TabsContent value="public-service" className="mt-6">
            <PublicServiceEditor
              data={portfolioData["public-service"] || []}
              onUpdate={(data) => updatePortfolioSection("public-service", data)}
            />
          </TabsContent>

          <TabsContent value="academic-research" className="mt-6">
            <AcademicResearchEditor
              data={portfolioData["academic-research"] || []}
              onUpdate={(data) => updatePortfolioSection("academic-research", data)}
            />
          </TabsContent>

          <TabsContent value="keywords" className="mt-6">
            <KeywordsEditor data={keywordsData} onUpdate={updateKeywords} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Simple editor components for each section
function WorkExperienceEditor({ data, onUpdate }: { data: any[]; onUpdate: (data: any[]) => void }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Work Experience</CardTitle>
        <CardDescription className="text-slate-300">Edit your work experience entries</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={JSON.stringify(data, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              onUpdate(parsed)
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          className="min-h-[400px] bg-white/10 border-white/20 text-white font-mono text-sm"
          placeholder="Enter work experience data as JSON..."
        />
      </CardContent>
    </Card>
  )
}

function EducationEditor({ data, onUpdate }: { data: any[]; onUpdate: (data: any[]) => void }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Education</CardTitle>
        <CardDescription className="text-slate-300">Edit your education entries</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={JSON.stringify(data, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              onUpdate(parsed)
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          className="min-h-[400px] bg-white/10 border-white/20 text-white font-mono text-sm"
          placeholder="Enter education data as JSON..."
        />
      </CardContent>
    </Card>
  )
}

function ExtracurricularsEditor({ data, onUpdate }: { data: any[]; onUpdate: (data: any[]) => void }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Extracurriculars</CardTitle>
        <CardDescription className="text-slate-300">Edit your extracurricular activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={JSON.stringify(data, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              onUpdate(parsed)
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          className="min-h-[400px] bg-white/10 border-white/20 text-white font-mono text-sm"
          placeholder="Enter extracurriculars data as JSON..."
        />
      </CardContent>
    </Card>
  )
}

function PublicServiceEditor({ data, onUpdate }: { data: any[]; onUpdate: (data: any[]) => void }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Public Service</CardTitle>
        <CardDescription className="text-slate-300">Edit your public service activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={JSON.stringify(data, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              onUpdate(parsed)
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          className="min-h-[400px] bg-white/10 border-white/20 text-white font-mono text-sm"
          placeholder="Enter public service data as JSON..."
        />
      </CardContent>
    </Card>
  )
}

function AcademicResearchEditor({ data, onUpdate }: { data: any[]; onUpdate: (data: any[]) => void }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Academic Research</CardTitle>
        <CardDescription className="text-slate-300">Edit your academic research and publications</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={JSON.stringify(data, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              onUpdate(parsed)
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          className="min-h-[400px] bg-white/10 border-white/20 text-white font-mono text-sm"
          placeholder="Enter academic research data as JSON..."
        />
      </CardContent>
    </Card>
  )
}

function KeywordsEditor({
  data,
  onUpdate,
}: { data: Record<string, string[]>; onUpdate: (tabName: string, keywords: string[]) => void }) {
  const tabs = ["workExperience", "education", "academia", "extracurriculars", "publicService"]

  return (
    <div className="space-y-6">
      {tabs.map((tab) => (
        <Card key={tab} className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white capitalize">{tab} Keywords</CardTitle>
            <CardDescription className="text-slate-300">Edit search keywords for the {tab} section</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={(data[tab] || []).join(", ")}
              onChange={(e) => {
                const keywords = e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter((k) => k)
                onUpdate(tab, keywords)
              }}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter keywords separated by commas..."
              rows={3}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
