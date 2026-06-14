"use client"

import { useEffect, useRef } from "react"

// ============================================================
//  Live dot-sphere — the 0xSpectra living centerpiece, ported
//  to React. A Fibonacci lattice of points on a slowly rotating
//  3D sphere with "signals" (arcs of light) travelling across
//  the surface. Cyan -> blue -> violet spectral palette.
//  Pauses off-screen; renders a single static frame under
//  prefers-reduced-motion.
// ============================================================

const stops = [
  [91, 200, 255], // cyan
  [111, 142, 255], // blue
  [162, 133, 242], // violet
] as const

function spectral(t: number): [number, number, number] {
  t = Math.min(1, Math.max(0, t))
  const seg = t * (stops.length - 1)
  const i = Math.min(stops.length - 2, Math.floor(seg))
  const f = seg - i
  const a = stops[i]
  const b = stops[i + 1]
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ]
}

type Vec = { x: number; y: number; z: number }

function randUnit(): Vec {
  const u = Math.random() * 2 - 1
  const t = Math.random() * Math.PI * 2
  const s = Math.sqrt(1 - u * u)
  return { x: s * Math.cos(t), y: s * Math.sin(t), z: u }
}

function norm(v: Vec): Vec {
  const m = Math.hypot(v.x, v.y, v.z) || 1
  return { x: v.x / m, y: v.y / m, z: v.z / m }
}

type Signal = {
  a: Vec
  b: Vec
  phase: number
  speed: number
  len: number
  hue: number
  life: number
  ttl: number
}

function makeSignal(): Signal {
  const a = randUnit()
  let b = randUnit()
  const d = a.x * b.x + a.y * b.y + a.z * b.z
  b = norm({ x: b.x - a.x * d, y: b.y - a.y * d, z: b.z - a.z * d })
  return {
    a,
    b,
    phase: Math.random() * Math.PI * 2,
    speed: 0.006 + Math.random() * 0.01,
    len: 0.45 + Math.random() * 0.5,
    hue: Math.random(),
    life: 0,
    ttl: 260 + Math.random() * 220,
  }
}

export function SpectraSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let W = 0
    let H = 0
    let DPR = 1
    let R = 0
    let cx = 0
    let cy = 0

    const N = 760
    const pts: { x: number; y: number; z: number; c: [number, number, number] }[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      pts.push({
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        c: spectral((i / (N - 1)) * 0.5 + (Math.cos(theta) * r * 0.25 + 0.25)),
      })
    }

    let signals: Signal[] = []
    const SIGNAL_COUNT = reduce ? 0 : 5
    for (let i = 0; i < SIGNAL_COUNT; i++) signals.push(makeSignal())

    let ry = 0
    const rx = -0.32
    const cosX = Math.cos(rx)
    const sinX = Math.sin(rx)

    function resize() {
      const rect = canvas.getBoundingClientRect()
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(1, rect.width)
      H = Math.max(1, rect.height)
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      R = Math.min(W, H) * 0.42
      cx = W * 0.5
      cy = H * 0.5
    }

    function project(p: Vec) {
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)
      const x = p.x * cosY + p.z * sinY
      const z = -p.x * sinY + p.z * cosY
      const y = p.y
      const y2 = y * cosX - z * sinX
      const z2 = y * sinX + z * cosX
      return { sx: cx + x * R, sy: cy + y2 * R, depth: z2 }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < N; i++) {
        const p = pts[i]
        const pr = project(p)
        const front = (pr.depth + 1) / 2
        const size = 0.6 + front * 1.7
        const alpha = 0.1 + front * 0.78
        const [r, g, b] = p.c
        ctx.beginPath()
        ctx.arc(pr.sx, pr.sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
        ctx.fill()
      }

      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s]
        sig.phase += sig.speed
        sig.life++
        const head = sig.phase
        const TRAIL = 26
        for (let k = 0; k < TRAIL; k++) {
          const ang = head - (k / TRAIL) * sig.len
          const ca = Math.cos(ang)
          const sa = Math.sin(ang)
          const wp = {
            x: sig.a.x * ca + sig.b.x * sa,
            y: sig.a.y * ca + sig.b.y * sa,
            z: sig.a.z * ca + sig.b.z * sa,
          }
          const pr = project(wp)
          const front = (pr.depth + 1) / 2
          if (front < 0.22) continue
          const fade = 1 - k / TRAIL
          const [r, g, b] = spectral(sig.hue)
          const a = fade * front * 0.9
          const size = (k === 0 ? 2.6 : 1.6) * (0.5 + front)
          ctx.beginPath()
          ctx.arc(pr.sx, pr.sy, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`
          ctx.fill()
          if (k === 0) {
            ctx.beginPath()
            ctx.arc(pr.sx, pr.sy, size * 2.4, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${r},${g},${b},${(a * 0.18).toFixed(3)})`
            ctx.fill()
          }
        }
        if (sig.life > sig.ttl) signals[s] = makeSignal()
      }

      if (!reduce) ry += 0.0016
      raf = requestAnimationFrame(drawFrame)
    }

    let raf = 0
    resize()
    const onResize = () => resize()
    window.addEventListener("resize", onResize, { passive: true })

    let visible = true
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
        if (visible && !raf && !reduce) raf = requestAnimationFrame(drawFrame)
        if (!visible && raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    if (reduce) {
      drawFrame()
      cancelAnimationFrame(raf)
      raf = 0
    } else {
      raf = requestAnimationFrame(drawFrame)
    }

    return () => {
      window.removeEventListener("resize", onResize)
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  )
}
