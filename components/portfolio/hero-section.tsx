"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Linkedin } from "lucide-react"
import { useState, useRef } from "react"

const roles = [
  {
    id: "ai-ml",
    title: "Senior AI/ML Engineer",
    subtitle: "Senior AI & ML Engineer • Cybersecurity Researcher • Academic",
    description:
      "Innovative professional with progressive experience in artificial intelligence, cybersecurity, and advanced threat detection. Skilled in designing and deploying AI/ML-driven models to identify, analyze, and predict cyber threats.",
    badges: ["LLMs", "AWS", "LangChain", "MLOps", "Python", "Golang"],
  },
  {
    id: "threat-intel",
    title: "Senior Threat Intelligence Researcher",
    subtitle: "Threat Intelligence Researcher • OSINT Investigator • Database Architect",
    description:
      "Cybersecurity expert specializing in threat intelligence analysis, OSINT investigations, and security research. Experienced in building threat detection systems and analyzing advanced persistent threats across diverse threat landscapes.",
    badges: ["Threat Intelligence", "OSINT", "STIX/TAXII", "KQL", "MITRE ATT&CK", "Python"],
  },
  {
    id: "web-ux",
    title: "Web Development and UXUI",
    subtitle: "Full-Stack Developer • UXUI Research • Product Development",
    description:
      "Full-stack developer and UX researcher focused on creating intuitive, user-centered digital experiences. Skilled in modern web technologies, user research methodologies, and product development from concept to deployment.",
    badges: ["React", "Next.js", "UX Research", "Figma", "TypeScript", "Node.js"],
  },
]

export function HeroSection() {
  const [selectedRole, setSelectedRole] = useState("ai-ml")
  const [isDragging, setIsDragging] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)
  const currentRole = roles.find((role) => role.id === selectedRole) || roles[0]

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleDragMove(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    handleDragMove(e.clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDragMove = (clientX: number) => {
    if (!tabsRef.current) return

    const rect = tabsRef.current.getBoundingClientRect()
    const relativeX = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, relativeX / rect.width))

    // Determine which role based on drag position
    if (percentage < 0.33) {
      setSelectedRole("ai-ml")
    } else if (percentage < 0.67) {
      setSelectedRole("threat-intel")
    } else {
      setSelectedRole("web-ux")
    }
  }

  return (
    <section className="relative bg-transparent pt-8 pb-4 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          {/* Animated network nodes */}
          <g className="animate-pulse">
            <circle cx="100" cy="100" r="3" fill="url(#grad1)" />
            <circle cx="300" cy="150" r="2" fill="url(#grad1)" />
            <circle cx="500" cy="80" r="4" fill="url(#grad1)" />
            <circle cx="700" cy="200" r="2" fill="url(#grad1)" />
            <circle cx="900" cy="120" r="3" fill="url(#grad1)" />
            <circle cx="1100" cy="180" r="2" fill="url(#grad1)" />
          </g>
          {/* Connecting lines */}
          <g className="animate-pulse" style={{ animationDelay: "0.5s" }}>
            <line x1="100" y1="100" x2="300" y2="150" stroke="url(#grad1)" strokeWidth="1" opacity="0.3" />
            <line x1="300" y1="150" x2="500" y2="80" stroke="url(#grad1)" strokeWidth="1" opacity="0.3" />
            <line x1="500" y1="80" x2="700" y2="200" stroke="url(#grad1)" strokeWidth="1" opacity="0.3" />
            <line x1="700" y1="200" x2="900" y2="120" stroke="url(#grad1)" strokeWidth="1" opacity="0.3" />
            <line x1="900" y1="120" x2="1100" y2="180" stroke="url(#grad1)" strokeWidth="1" opacity="0.3" />
          </g>
          {/* Data flow particles */}
          <g>
            <circle cx="200" cy="125" r="1" fill="#60a5fa" className="animate-ping" />
            <circle cx="400" cy="115" r="1" fill="#3b82f6" className="animate-ping" style={{ animationDelay: "1s" }} />
            <circle cx="600" cy="140" r="1" fill="#60a5fa" className="animate-ping" style={{ animationDelay: "2s" }} />
            <circle
              cx="800"
              cy="160"
              r="1"
              fill="#3b82f6"
              className="animate-ping"
              style={{ animationDelay: "0.5s" }}
            />
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-shrink-0 relative">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/188-HfYogLPVvZA-Tuwb2JauwSpe2uO55FRqGrieIv5sTI.jpeg"
                alt="Aaron Escamilla"
                className="w-48 h-48 rounded-full object-cover border-4 border-slate-500/30 shadow-2xl shadow-slate-500/20"
              />
              {/* Animated graph elements around profile */}
              <div
                className="absolute -top-4 -right-4 w-8 h-8 bg-slate-800/50 border border-slate-600/30 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500/20 rounded-full animate-bounce"
                style={{ animationDelay: "1s" }}
              ></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-slate-400/30 rounded-full animate-pulse"></div>
              <div
                className="absolute bottom-1/4 -left-6 w-5 h-5 bg-blue-400/30 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance text-white">Aaron E</h1>

            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl text-gray-300 mb-4 text-pretty transition-all duration-300">
                {currentRole.subtitle}
              </h2>

              <div className="flex justify-center lg:justify-start mb-4">
                <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full max-w-2xl">
                  <TabsList
                    ref={tabsRef}
                    className={`grid w-full grid-cols-3 bg-slate-800/50 border border-slate-600/30 ${isDragging ? "cursor-grabbing" : "cursor-grab"} select-none`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <TabsTrigger
                      value="ai-ml"
                      className="text-white font-semibold data-[state=active]:text-foreground data-[state=active]:bg-white/90 transition-all duration-300 pointer-events-none"
                    >
                      AI/ML Engineer
                    </TabsTrigger>
                    <TabsTrigger
                      value="threat-intel"
                      className="text-white font-semibold data-[state=active]:text-foreground data-[state=active]:bg-white/90 transition-all duration-300 pointer-events-none"
                    >
                      Threat Intel
                    </TabsTrigger>
                    <TabsTrigger
                      value="web-ux"
                      className="text-white font-semibold data-[state=active]:text-foreground data-[state=active]:bg-white/90 transition-all duration-300 pointer-events-none"
                    >
                      Web/UX
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <p className="text-lg mb-6 max-w-2xl text-pretty text-gray-200 transition-all duration-300">
              {currentRole.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
              {currentRole.badges.map((badge, index) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="bg-slate-600/20 text-slate-200 border-slate-500/30 hover:animate-wiggle transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {badge}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                onClick={() => window.open("https://www.linkedin.com/in/cyberaaron/", "_blank")}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn Profile
              </Button>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4" />
                Working remotely from USA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
