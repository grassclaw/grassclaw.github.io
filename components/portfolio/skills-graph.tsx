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

const ZOOM_MIN = 0.3
const ZOOM_MAX = 1.0
const ZOOM_STEP = 0.1

// Slider is 0..100; map to zoom 0.3..1.0
const zoomToSlider = (z: number) =>
  Math.round(((Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z)) - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * 100)

const sliderToZoom = (s: number) =>
  +(ZOOM_MIN + (Math.min(100, Math.max(0, s)) / 100) * (ZOOM_MAX - ZOOM_MIN)).toFixed(3)

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

  // Resize observer
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setCanvasSize({ width: Math.max(600, width), height: Math.max(400, height - 20) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.max(1, window.devicePixelRatio || 1)
    canvas.width = canvasSize.width * dpr
    canvas.height = canvasSize.height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // reset & scale for DPR

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)
    ctx.save()

    // translate first, then scale — pan is in world units
    ctx.translate(panX, panY)
    ctx.scale(zoom, zoom)

    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 1 / zoom

    // edges
    skills.forEach((s) => {
      s.connections.forEach((cid) => {
        const t = skills.find((x) => x.id === cid)
        if (!t) return
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(t.x, t.y)
        ctx.stroke()
      })
    })

    // nodes
    skills.forEach((s) => {
      const isSel = selectedSkill === s.id
      const r = isSel ? 25 : 20

      ctx.fillStyle = categories[s.category as keyof typeof categories]
      ctx.beginPath()
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
      ctx.fill()

      if (isSel) {
        ctx.strokeStyle = "#1f2937"
        ctx.lineWidth = 3 / zoom
        ctx.stroke()
      }

      ctx.fillStyle = "#ffffff"
      ctx.font = `${14 / zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(s.label, s.x, s.y + r + 8 / zoom)
    })

    ctx.restore()
  }, [selectedSkill, zoom, panX, panY, canvasSize])

  // Helpers
  const worldFromClient = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const xCanvas = (clientX - rect.left) * (canvasSize.width / rect.width)
    const yCanvas = (clientY - rect.top) * (canvasSize.height / rect.height)
    // convert canvas coords to world coords (invert current pan/zoom)
    const wx = xCanvas / zoom - panX / 1
    const wy = yCanvas / zoom - panY / 1
    return { wx, wy, xCanvas, yCanvas }
  }

  const setZoomAroundPoint = (clientX: number, clientY: number, nextZoom: number) => {
    nextZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextZoom))
    const { wx, xCanvas, wy, yCanvas } = worldFromClient(clientX, clientY)
    // keep world point under cursor anchored after zoom:
    setPanX(wx - xCanvas / nextZoom)
    setPanY(wy - yCanvas / nextZoom)
    setZoom(nextZoom)
  }

  // Interaction
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return
    const { wx, wy } = worldFromClient(event.clientX, event.clientY)
    const clicked = skills.find((s) => Math.hypot(wx - s.x, wy - s.y) <= 25)
    if (clicked) onSkillSelect(selectedSkill === clicked.id ? null : clicked.id)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    const dx = e.clientX - lastMousePos.x
    const dy = e.clientY - lastMousePos.y
    // pan in world units so pan speed feels consistent across zoom levels
    setPanX((p) => p + dx / zoom)
    setPanY((p) => p + dy / zoom)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 1 / (1 + ZOOM_STEP) : 1 + ZOOM_STEP
    setZoomAroundPoint(e.clientX, e.clientY, zoom * factor)
  }

  const handleZoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(3)))
  const handleZoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(3)))
  const handleReset = () => {
    setZoom(0.5)
    setPanX(0)
    setPanY(0)
  }

  return (
    <div className="space-y-4 h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-center">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(categories).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm text-black">{category}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="flex-1 transition-all duration-300 min-h-[500px] overflow-hidden relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-md text-sm backdrop-blur-sm">
          Click and drag to pan • Scroll to zoom • Click nodes to highlight connections
        </div>

        {/* Zoom bar */}
        <div className="absolute right-4 top-4 z-10 flex flex-col items-center backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 gap-3 bg-transparent border-dashed">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomIn}
            className="w-10 h-5 p-0 hover:bg-slate-50 bg-transparent border-0"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5 text-white" />
          </Button>

          {/* Track strictly between buttons */}
          <div className="h-32 w-8 flex items-center justify-center">
            <Slider
              value={[zoomToSlider(zoom)]} // 0..100
              onValueChange={(vals) => setZoom(sliderToZoom(vals[0]))}
              min={0}
              max={100}
              step={1}
              orientation="vertical"
              aria-label="Zoom level"
              className="h-32 w-8"
            />
          </div>

          <div className="text-xs font-semibold text-slate-700 select-none mt-2">{Math.round(zoom * 100)}%</div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomOut}
            className="w-10 h-10 p-0 hover:bg-slate-50 bg-transparent border-0"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5 text-white" />
          </Button>

          <div className="w-full h-px bg-gray-200" />

          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="w-10 h-10 p-0 hover:bg-gray-50 bg-transparent border-0"
            aria-label="Reset zoom"
          >
            <RotateCcw className="h-4 w-4 text-white" />
          </Button>
        </div>

        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", display: "block" }}
          className={`rounded-lg border border-gray-200 bg-slate-600 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
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
