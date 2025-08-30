"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface SkillNode {
  id: string
  label: string
  category: string
  x: number
  y: number
  connections: string[]
}

interface SkillsGraphProps {
  onSkillSelect: (skill: string | null) => void
  selectedSkill: string | null
}

export function SkillsGraph({ onSkillSelect, selectedSkill }: SkillsGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.5)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  const skills: SkillNode[] = [
    // AI/ML Core - centered around 350,200
    { id: "llms", label: "LLMs", category: "AI", x: 350, y: 200, connections: ["langchain", "transformers", "rag"] },
    { id: "langchain", label: "LangChain", category: "AI", x: 250, y: 150, connections: ["llms", "rag", "python"] },
    { id: "transformers", label: "Transformers", category: "AI", x: 450, y: 150, connections: ["llms", "huggingface"] },
    {
      id: "rag",
      label: "RAG Pipelines",
      category: "AI",
      x: 300,
      y: 250,
      connections: ["llms", "langchain", "vectordb"],
    },

    // Infrastructure - right side
    {
      id: "aws",
      label: "AWS",
      category: "Infrastructure",
      x: 550,
      y: 200,
      connections: ["docker", "kubernetes", "s3"],
    },
    { id: "docker", label: "Docker", category: "Infrastructure", x: 500, y: 300, connections: ["aws", "kubernetes"] },
    {
      id: "kubernetes",
      label: "Kubernetes",
      category: "Infrastructure",
      x: 600,
      y: 300,
      connections: ["aws", "docker"],
    },
    { id: "s3", label: "S3", category: "Infrastructure", x: 650, y: 200, connections: ["aws"] },

    // Security - left side
    { id: "mitre", label: "MITRE ATT&CK", category: "Security", x: 100, y: 350, connections: ["stix", "threat-intel"] },
    { id: "stix", label: "STIX/TAXII", category: "Security", x: 200, y: 400, connections: ["mitre", "threat-intel"] },
    {
      id: "threat-intel",
      label: "Threat Intelligence",
      category: "Security",
      x: 150,
      y: 300,
      connections: ["mitre", "stix"],
    },

    // Programming - center bottom
    {
      id: "python",
      label: "Python",
      category: "Programming",
      x: 350,
      y: 350,
      connections: ["langchain", "golang", "sql"],
    },
    { id: "golang", label: "Golang", category: "Programming", x: 450, y: 350, connections: ["python", "sql"] },
    { id: "sql", label: "SQL", category: "Programming", x: 400, y: 400, connections: ["python", "golang", "postgres"] },

    // Data - bottom right
    { id: "postgres", label: "PostgreSQL", category: "Data", x: 500, y: 450, connections: ["sql", "vectordb"] },
    { id: "vectordb", label: "Vector Stores", category: "Data", x: 400, y: 450, connections: ["rag", "postgres"] },
    { id: "huggingface", label: "HuggingFace", category: "AI", x: 550, y: 150, connections: ["transformers"] },
  ]

  const categories = {
    AI: "#8b5cf6",
    Infrastructure: "#3b82f6",
    Security: "#ef4444",
    Programming: "#10b981",
    Data: "#f97316",
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const { width, height } = entry.contentRect
        setCanvasSize({
          width: Math.max(600, width),
          height: Math.max(400, height - 20), // Account for padding
        })
      }
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvasSize.width * dpr
    canvas.height = canvasSize.height * dpr
    ctx.scale(dpr, dpr)

    const draw = () => {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

      ctx.save()
      ctx.scale(zoom, zoom)
      ctx.translate(panX, panY)

      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1

      skills.forEach((skill) => {
        skill.connections.forEach((connectionId) => {
          const connectedSkill = skills.find((s) => s.id === connectionId)
          if (connectedSkill) {
            ctx.beginPath()
            ctx.moveTo(skill.x, skill.y)
            ctx.lineTo(connectedSkill.x, connectedSkill.y)
            ctx.stroke()
          }
        })
      })

      skills.forEach((skill) => {
        const isSelected = selectedSkill === skill.id
        const radius = isSelected ? 25 : 20

        ctx.fillStyle = categories[skill.category as keyof typeof categories]
        ctx.beginPath()
        ctx.arc(skill.x, skill.y, radius, 0, 2 * Math.PI)
        ctx.fill()

        if (isSelected) {
          ctx.strokeStyle = "#1f2937"
          ctx.lineWidth = 3
          ctx.stroke()
        }

        ctx.fillStyle = "#1f2937"
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText(skill.label, skill.x, skill.y + radius + 8)
      })

      ctx.restore()
    }

    draw()
  }, [selectedSkill, zoom, panX, panY, canvasSize])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) * (canvasSize.width / rect.width)) / zoom - panX
    const y = ((event.clientY - rect.top) * (canvasSize.height / rect.height)) / zoom - panY

    const clickedSkill = skills.find((skill) => {
      const distance = Math.sqrt((x - skill.x) ** 2 + (y - skill.y) ** 2)
      return distance <= 25
    })

    if (clickedSkill) {
      onSkillSelect(selectedSkill === clickedSkill.id ? null : clickedSkill.id)
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setLastMousePos({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const deltaX = event.clientX - lastMousePos.x
    const deltaY = event.clientY - lastMousePos.y

    setPanX((prev) => prev + deltaX / zoom)
    setPanY((prev) => prev + deltaY / zoom)
    setLastMousePos({ x: event.clientX, y: event.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.3, Math.min(1.0, zoom * zoomFactor))
    setZoom(newZoom)
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(1.0, prev * 1.2))
  const handleZoomOut = () => setZoom((prev) => Math.max(0.3, prev / 1.2))
  const handleReset = () => {
    setZoom(0.5)
    setPanX(0)
    setPanY(0)
  }

  return (
    <div className="space-y-4 h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(categories).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm text-muted-foreground">{category}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 p-2 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-muted-foreground">Zoom:</span>
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={0.3}
            max={1.0}
            step={0.1}
            className="flex-1 max-w-32"
          />
          <span className="text-sm text-muted-foreground min-w-12">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 transition-all duration-300 min-h-96 overflow-hidden relative">
        <canvas
          ref={canvasRef}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          className={`border rounded-lg ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Click on nodes to highlight related experience •{" "}
        {selectedSkill ? `Selected: ${skills.find((s) => s.id === selectedSkill)?.label}` : "No selection"}
      </p>
    </div>
  )
}
