"use client"

import { useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface SkillNode {
  id: string
  label: string
  category: string
  connections: string[]
}
interface SkillsGraphProps {
  onSkillSelect: (skill: string | null) => void
  selectedSkill: string | null
}

// NOTE: ids + connections are the contract — clicking a node filters "The
// Record" below by these ids. Positions are computed in 3D (force layout), so
// no x/y here anymore.
const skills: SkillNode[] = [
  { id: "llms", label: "LLMs", category: "AI", connections: ["langchain", "transformers", "rag"] },
  { id: "langchain", label: "LangChain", category: "AI", connections: ["llms", "rag", "python"] },
  { id: "transformers", label: "Transformers", category: "AI", connections: ["llms", "huggingface"] },
  { id: "rag", label: "RAG Pipelines", category: "AI", connections: ["llms", "langchain", "vectordb"] },
  { id: "aws", label: "AWS", category: "Infrastructure", connections: ["docker", "kubernetes", "s3"] },
  { id: "docker", label: "Docker", category: "Infrastructure", connections: ["aws", "kubernetes"] },
  { id: "kubernetes", label: "Kubernetes", category: "Infrastructure", connections: ["aws", "docker"] },
  { id: "s3", label: "S3", category: "Infrastructure", connections: ["aws"] },
  { id: "mitre", label: "MITRE ATT&CK", category: "Security", connections: ["stix", "threat-intel"] },
  { id: "stix", label: "STIX/TAXII", category: "Security", connections: ["mitre", "threat-intel"] },
  { id: "threat-intel", label: "Threat Intelligence", category: "Security", connections: ["mitre", "stix"] },
  { id: "python", label: "Python", category: "Programming", connections: ["langchain", "golang", "sql"] },
  { id: "golang", label: "Golang", category: "Programming", connections: ["python", "sql"] },
  { id: "sql", label: "SQL", category: "Programming", connections: ["python", "golang", "postgres"] },
  { id: "postgres", label: "PostgreSQL", category: "Data", connections: ["sql", "vectordb"] },
  { id: "vectordb", label: "Vector Stores", category: "Data", connections: ["rag", "postgres"] },
  { id: "huggingface", label: "HuggingFace", category: "AI", connections: ["transformers"] },
]

// All on the 0xSpectra spectral run — cyan → blue → violet → magenta. The
// three middle stops are the exact --spectra-* theme tokens.
const categories: Record<string, [number, number, number]> = {
  Security: [91, 200, 255], // spectra cyan  #5bc8ff
  Infrastructure: [111, 142, 255], // spectra blue   #6f8eff
  Programming: [137, 138, 249], // indigo        #8989f9
  AI: [162, 133, 242], // spectra violet #a285f2
  Data: [208, 123, 227], // orchid/magenta #d07be3
}

type P3 = { x: number; y: number; z: number; vx: number; vy: number; vz: number }

// Lightweight 3D force-directed layout, run once. 17 nodes → instantaneous.
function computeLayout(nodes: SkillNode[], edges: [string, string][]): Record<string, P3> {
  const pos: Record<string, P3> = {}
  for (const n of nodes) {
    const u = Math.random() * 2 - 1
    const t = Math.random() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    pos[n.id] = { x: s * Math.cos(t), y: s * Math.sin(t), z: u, vx: 0, vy: 0, vz: 0 }
  }
  const ids = nodes.map((n) => n.id)
  const K_REP = 0.9
  const K_ATT = 0.02
  const REST = 1.15
  const K_CENTER = 0.014
  for (let iter = 0; iter < 420; iter++) {
    const cool = 1 - iter / 420
    for (let i = 0; i < ids.length; i++) {
      const a = pos[ids[i]]
      for (let j = i + 1; j < ids.length; j++) {
        const b = pos[ids[j]]
        let dx = a.x - b.x
        let dy = a.y - b.y
        let dz = a.z - b.z
        const d2 = dx * dx + dy * dy + dz * dz + 0.01
        const d = Math.sqrt(d2)
        const f = K_REP / d2
        dx /= d
        dy /= d
        dz /= d
        a.vx += dx * f
        a.vy += dy * f
        a.vz += dz * f
        b.vx -= dx * f
        b.vy -= dy * f
        b.vz -= dz * f
      }
    }
    for (const [s, t] of edges) {
      const a = pos[s]
      const b = pos[t]
      let dx = b.x - a.x
      let dy = b.y - a.y
      let dz = b.z - a.z
      const d = Math.hypot(dx, dy, dz) || 0.001
      const f = K_ATT * (d - REST)
      dx /= d
      dy /= d
      dz /= d
      a.vx += dx * f
      a.vy += dy * f
      a.vz += dz * f
      b.vx -= dx * f
      b.vy -= dy * f
      b.vz -= dz * f
    }
    for (const id of ids) {
      const p = pos[id]
      p.vx -= p.x * K_CENTER
      p.vy -= p.y * K_CENTER
      p.vz -= p.z * K_CENTER
      p.x += p.vx * cool
      p.y += p.vy * cool
      p.z += p.vz * cool
      p.vx *= 0.85
      p.vy *= 0.85
      p.vz *= 0.85
    }
  }
  let maxR = 0
  for (const id of ids) {
    const p = pos[id]
    maxR = Math.max(maxR, Math.hypot(p.x, p.y, p.z))
  }
  const scale = maxR > 0 ? 1 / maxR : 1
  for (const id of ids) {
    const p = pos[id]
    p.x *= scale
    p.y *= scale
    p.z *= scale
  }
  return pos
}

export function SkillsGraph({ onSkillSelect, selectedSkill }: SkillsGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef(selectedSkill)
  selectedRef.current = selectedSkill
  const onSelectRef = useRef(onSkillSelect)
  onSelectRef.current = onSkillSelect

  // Derived graph structure (stable for the session).
  const { edges, neighbors, degree } = useMemo(() => {
    const byId = new Set(skills.map((s) => s.id))
    const seen = new Set<string>()
    const edges: [string, string][] = []
    const neighbors: Record<string, Set<string>> = {}
    skills.forEach((s) => (neighbors[s.id] = new Set()))
    skills.forEach((s) =>
      s.connections.forEach((c) => {
        if (!byId.has(c)) return
        const key = [s.id, c].sort().join("|")
        if (seen.has(key)) return
        seen.add(key)
        edges.push([s.id, c])
        neighbors[s.id].add(c)
        neighbors[c].add(s.id)
      }),
    )
    const degree: Record<string, number> = {}
    skills.forEach((s) => (degree[s.id] = neighbors[s.id].size))
    return { edges, neighbors, degree }
  }, [])

  // Layout computed once on the client.
  const layoutRef = useRef<Record<string, P3> | null>(null)
  if (layoutRef.current === null) layoutRef.current = computeLayout(skills, edges)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const layout = layoutRef.current!
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let W = 0
    let H = 0
    let DPR = 1
    let R = 0
    let cx = 0
    let cy = 0

    // View state.
    let ry = 0.5
    let rx = -0.25
    let zoom = 1
    let dragging = false
    let lastX = 0
    let lastY = 0
    let moved = 0
    let hoverId: string | null = null
    let hoverX = -1
    let hoverY = -1
    let cursor = "grab"

    const screen: Record<string, { sx: number; sy: number; depth: number; front: number; persp: number }> = {}
    const FOCAL = 2.7

    function resize() {
      const rect = container.getBoundingClientRect()
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(1, rect.width)
      H = Math.max(1, rect.height)
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      R = Math.min(W, H) * 0.34
      cx = W * 0.5
      cy = H * 0.5
    }

    function project() {
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)
      const cosX = Math.cos(rx)
      const sinX = Math.sin(rx)
      const scale = R * zoom
      for (const s of skills) {
        const p = layout[s.id]
        const x1 = p.x * cosY + p.z * sinY
        const z1 = -p.x * sinY + p.z * cosY
        const y1 = p.y
        const y2 = y1 * cosX - z1 * sinX
        const z2 = y1 * sinX + z1 * cosX
        const persp = FOCAL / (FOCAL - z2)
        screen[s.id] = {
          sx: cx + x1 * scale * persp,
          sy: cy + y2 * scale * persp,
          depth: z2,
          front: (z2 + 1) / 2,
          persp,
        }
      }
    }

    function nodeAt(x: number, y: number): string | null {
      let best: string | null = null
      let bd = 18 * 18
      for (const s of skills) {
        const sc = screen[s.id]
        if (!sc) continue
        const rr = (7 + degree[s.id] * 1.3) * sc.persp
        const dx = sc.sx - x
        const dy = sc.sy - y
        const d = dx * dx + dy * dy
        // generous hit radius, prefer nearer-to-camera on ties
        const hit = Math.max(bd, rr * rr)
        if (d <= hit && (best === null || sc.depth > screen[best].depth) && d <= rr * rr + 80) {
          best = s.id
        }
      }
      return best
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)

      if (!dragging && !reduce) ry += 0.0016
      project()

      const sel = selectedRef.current
      hoverId = !dragging && hoverX >= 0 ? nodeAt(hoverX, hoverY) : null
      const focusId = hoverId || sel
      const active = focusId ? new Set<string>([focusId, ...neighbors[focusId]]) : null

      // Edges, back-to-front by midpoint depth.
      const ordered = [...edges].sort(
        (a, b) => (screen[a[0]].depth + screen[a[1]].depth) / 2 - (screen[b[0]].depth + screen[b[1]].depth) / 2,
      )
      for (const [a, b] of ordered) {
        const sa = screen[a]
        const sb = screen[b]
        const isActive = focusId ? a === focusId || b === focusId : false
        const front = (sa.front + sb.front) / 2
        let alpha = (0.06 + front * 0.16) * (active ? (isActive ? 1 : 0.18) : 1)
        const grad = ctx.createLinearGradient(sa.sx, sa.sy, sb.sx, sb.sy)
        const [r1, g1, b1] = categories[skills.find((s) => s.id === a)!.category]
        const [r2, g2, b2] = categories[skills.find((s) => s.id === b)!.category]
        if (isActive) alpha = Math.min(0.85, 0.4 + front * 0.5)
        grad.addColorStop(0, `rgba(${r1},${g1},${b1},${alpha.toFixed(3)})`)
        grad.addColorStop(1, `rgba(${r2},${g2},${b2},${alpha.toFixed(3)})`)
        ctx.strokeStyle = grad
        ctx.lineWidth = isActive ? 1.6 : 1
        ctx.beginPath()
        ctx.moveTo(sa.sx, sa.sy)
        ctx.lineTo(sb.sx, sb.sy)
        ctx.stroke()
      }

      // Nodes, back-to-front.
      const nodesOrdered = [...skills].sort((a, b) => screen[a.id].depth - screen[b.id].depth)
      for (const s of nodesOrdered) {
        const sc = screen[s.id]
        const [r, g, b] = categories[s.category]
        const isSel = sel === s.id
        const isHover = hoverId === s.id
        const dim = active && !active.has(s.id)
        const rad = (7 + degree[s.id] * 1.3) * sc.persp
        // faked lighting: front-facing = brighter
        const lum = 0.45 + sc.front * 0.55
        const baseA = dim ? 0.22 : 1
        const fill = `rgba(${Math.round(r * lum)},${Math.round(g * lum)},${Math.round(b * lum)},${baseA})`

        // glow for hovered / selected
        if ((isHover || isSel) && !dim) {
          const halo = ctx.createRadialGradient(sc.sx, sc.sy, 0, sc.sx, sc.sy, rad * 2.6)
          halo.addColorStop(0, `rgba(${r},${g},${b},0.45)`)
          halo.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.fillStyle = halo
          ctx.beginPath()
          ctx.arc(sc.sx, sc.sy, rad * 2.6, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(sc.sx, sc.sy, rad, 0, Math.PI * 2)
        ctx.fillStyle = fill
        ctx.fill()
        // specular highlight
        if (!dim) {
          ctx.beginPath()
          ctx.arc(sc.sx - rad * 0.3, sc.sy - rad * 0.32, rad * 0.32, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${(0.25 * sc.front).toFixed(3)})`
          ctx.fill()
        }
        if (isSel) {
          ctx.strokeStyle = "rgba(255,255,255,0.95)"
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // labels: front nodes, plus always for active/hover/selected
        const showLabel = !dim && (sc.front > 0.42 || isHover || isSel)
        if (showLabel) {
          const fs = Math.max(10, 12 * sc.persp)
          ctx.font = `${isSel || isHover ? "600 " : ""}${fs}px ui-sans-serif, system-ui, -apple-system, sans-serif`
          ctx.textAlign = "center"
          ctx.textBaseline = "top"
          const la = isHover || isSel ? 1 : 0.35 + sc.front * 0.5
          ctx.fillStyle = `rgba(232,236,248,${la.toFixed(3)})`
          ctx.fillText(s.label, sc.sx, sc.sy + rad + 3)
        }
      }

      const wantCursor = dragging ? "grabbing" : hoverId ? "pointer" : "grab"
      if (wantCursor !== cursor) {
        cursor = wantCursor
        canvas.style.cursor = wantCursor
      }

      raf = requestAnimationFrame(draw)
    }

    let raf = 0
    resize()
    const ro = new ResizeObserver(() => resize())
    ro.observe(container)

    // --- interaction ---
    const localPoint = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onDown = (e: PointerEvent) => {
      dragging = true
      moved = 0
      lastX = e.clientX
      lastY = e.clientY
      try {
        canvas.setPointerCapture(e.pointerId)
      } catch {}
    }
    const onMove = (e: PointerEvent) => {
      const p = localPoint(e)
      hoverX = p.x
      hoverY = p.y
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      moved += Math.abs(dx) + Math.abs(dy)
      ry -= dx * 0.006
      rx = Math.max(-1.3, Math.min(1.3, rx - dy * 0.006))
    }
    const onUp = (e: PointerEvent) => {
      if (dragging && moved < 6) {
        const p = localPoint(e)
        const id = nodeAt(p.x, p.y)
        if (id) onSelectRef.current(selectedRef.current === id ? null : id)
      }
      dragging = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {}
    }
    const onLeave = () => {
      hoverX = -1
      hoverY = -1
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.92 : 1.08
      zoom = Math.max(0.6, Math.min(2.4, zoom * factor))
    }

    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointerleave", onLeave)
    canvas.addEventListener("wheel", onWheel, { passive: false })

    // expose a reset for the button via a custom event
    const onReset = () => {
      ry = 0.5
      rx = -0.25
      zoom = 1
      onSelectRef.current(null)
    }
    container.addEventListener("skills-graph:reset", onReset)

    raf = requestAnimationFrame(draw)

    return () => {
      ro.disconnect()
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("wheel", onWheel)
      container.removeEventListener("skills-graph:reset", onReset)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [edges, neighbors, degree])

  const handleReset = () => {
    containerRef.current?.dispatchEvent(new Event("skills-graph:reset"))
  }

  return (
    <div className="relative flex h-full flex-col gap-3">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {Object.entries(categories).map(([category, [r, g, b]]) => (
          <div key={category} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `rgb(${r},${g},${b})` }} />
            <span className="text-sm text-card-foreground/80">{category}</span>
          </div>
        ))}
      </div>

      <div ref={containerRef} className="relative flex-1 overflow-hidden rounded-xl border border-border/40">
        {/* faint depth vignette behind the graph */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 45%, rgba(40,60,120,0.18), rgba(7,13,29,0) 70%), #070d1d",
          }}
        />
        <canvas ref={canvasRef} className="relative block h-full w-full cursor-grab" style={{ touchAction: "none" }} />

        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          aria-label="Reset view"
          className="absolute right-3 top-3 h-8 w-8 border border-border/60 bg-card/70 p-0 backdrop-blur-md hover:bg-secondary/60"
        >
          <RotateCcw className="h-4 w-4 text-card-foreground" />
        </Button>

        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border border-border/50 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          Drag to rotate • Scroll to zoom • Click a skill to focus
        </div>
      </div>
    </div>
  )
}
