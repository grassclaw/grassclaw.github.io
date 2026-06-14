"use client"

import { useEffect, useRef } from "react"

// ============================================================
//  Live dot-sphere — the 0xSpectra living centerpiece, ported
//  to React. A Fibonacci lattice of points on a slowly rotating
//  3D sphere with "signals" (arcs of light) travelling across
//  the surface. Cyan -> blue -> violet spectral palette.
//  Pauses off-screen; renders a single static frame under
//  prefers-reduced-motion.
//
//  Secret easter egg (pointer-enabled, motion allowed):
//    • drag      → grab and spin the globe, with momentum
//    • hover     → nearest node lights up, cursor becomes a pointer
//    • click/tap → that node pulses and fires a new light-signal
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

// A signal travels the great circle spanned by orthonormal {a, b}.
function signalFrom(a: Vec, fast = false): Signal {
  let b = randUnit()
  const d = a.x * b.x + a.y * b.y + a.z * b.z
  b = norm({ x: b.x - a.x * d, y: b.y - a.y * d, z: b.z - a.z * d })
  return {
    a: { x: a.x, y: a.y, z: a.z },
    b,
    phase: fast ? 0 : Math.random() * Math.PI * 2,
    speed: (fast ? 0.012 : 0.006) + Math.random() * 0.01,
    len: 0.45 + Math.random() * 0.5,
    hue: Math.random(),
    life: 0,
    ttl: 260 + Math.random() * 220,
  }
}

function makeSignal(): Signal {
  return signalFrom(randUnit())
}

// A "beacon" is a special node, scattered across the lattice, that glows on its
// own cycle and is the only kind of node the visitor can hover / click. `i` is
// an index into the Fibonacci lattice (0..759); pick spread-out values.
export type Beacon = { i: number; label: string; href?: string; modal?: string }

const DEFAULT_BEACONS: Beacon[] = []

export function SpectraSphere({
  className,
  beacons: beaconProp,
  onActivate,
}: {
  className?: string
  beacons?: Beacon[]
  onActivate?: (b: Beacon) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // Keep the latest callback without re-running the whole effect on each render.
  const onActivateRef = useRef(onActivate)
  onActivateRef.current = onActivate
  const beaconRef = useRef(beaconProp)
  beaconRef.current = beaconProp

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const interactive = !reduce

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

    // Per-frame projected screen coords, reused to avoid GC churn.
    const screen = Array.from({ length: N }, () => ({ sx: 0, sy: 0, front: 0 }))

    // Beacons: the only interactive nodes. Glow on a staggered pulse cycle.
    const beacons = (beaconRef.current && beaconRef.current.length ? beaconRef.current : DEFAULT_BEACONS).filter(
      (b) => b.i >= 0 && b.i < N,
    )
    const beaconAt = new Map<number, number>()
    beacons.forEach((b, k) => beaconAt.set(b.i, k))
    const beaconPhase = beacons.map((_, k) => k * 1.7)
    let frame = 0

    let signals: Signal[] = []
    const SIGNAL_COUNT = reduce ? 0 : 5
    for (let i = 0; i < SIGNAL_COUNT; i++) signals.push(makeSignal())

    // Click ripples: expanding rings anchored to a node index.
    const pulses: { idx: number; life: number; ttl: number }[] = []

    // Rotation state (live, so drag can mutate it). Trig is recomputed once
    // per frame and shared by project().
    let ry = 0
    let rx = -0.32
    let cosY = Math.cos(ry)
    let sinY = Math.sin(ry)
    let cosX = Math.cos(rx)
    let sinX = Math.sin(rx)

    // Pointer / drag state.
    let dragging = false
    let lastX = 0
    let lastY = 0
    let moved = 0
    let velRY = 0
    let velRX = 0
    let hoverX = -1
    let hoverY = -1
    let hoverIdx = -1
    let cursor = "grab"

    function project(p: Vec) {
      const x = p.x * cosY + p.z * sinY
      const z = -p.x * sinY + p.z * cosY
      const y = p.y
      const y2 = y * cosX - z * sinX
      const z2 = y * sinX + z * cosX
      return { sx: cx + x * R, sy: cy + y2 * R, depth: z2 }
    }

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

    function nearestBeacon(x: number, y: number, maxD: number) {
      let best = -1
      let bd = maxD * maxD
      for (const b of beacons) {
        const sc = screen[b.i]
        if (sc.front < 0.45) continue
        const dx = sc.sx - x
        const dy = sc.sy - y
        const d = dx * dx + dy * dy
        if (d < bd) {
          bd = d
          best = b.i
        }
      }
      return best
    }

    function drawFrame() {
      frame++
      // Advance rotation: drag momentum, easing back to the resting tilt and
      // the slow ambient spin once the user lets go.
      if (!dragging) {
        ry += velRY
        rx += velRX
        velRY *= 0.95
        velRX *= 0.95
        rx = Math.max(-1.25, Math.min(1.25, rx))
        const idle = Math.abs(velRY) < 0.0005 && Math.abs(velRX) < 0.0005
        if (idle) {
          if (!reduce) ry += 0.001
          rx += (-0.32 - rx) * 0.02
        }
      }
      cosY = Math.cos(ry)
      sinY = Math.sin(ry)
      cosX = Math.cos(rx)
      sinX = Math.sin(rx)

      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < N; i++) {
        const p = pts[i]
        const pr = project(p)
        const front = (pr.depth + 1) / 2
        const sc = screen[i]
        sc.sx = pr.sx
        sc.sy = pr.sy
        sc.front = front
        const size = 0.6 + front * 1.7
        const alpha = 0.1 + front * 0.78
        const [r, g, b] = p.c
        ctx.beginPath()
        ctx.arc(pr.sx, pr.sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
        ctx.fill()

        // Beacon: pulsing halo + bright core so the eye is drawn to it.
        const bk = beaconAt.get(i)
        if (bk !== undefined && front > 0.25) {
          const pulse = 0.5 + 0.5 * Math.sin(frame * 0.045 + beaconPhase[bk])
          const halo = 6 + pulse * 8
          const grd = ctx.createRadialGradient(pr.sx, pr.sy, 0, pr.sx, pr.sy, halo)
          grd.addColorStop(0, `rgba(${r},${g},${b},${(0.55 * front * (0.35 + pulse * 0.65)).toFixed(3)})`)
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(pr.sx, pr.sy, halo, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(pr.sx, pr.sy, 1.4 + pulse * 1.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${((0.45 + pulse * 0.55) * front).toFixed(3)})`
          ctx.fill()
        }
      }

      // Resolve hover against the freshly projected positions (beacons only).
      hoverIdx = interactive && hoverX >= 0 && !dragging ? nearestBeacon(hoverX, hoverY, 16) : -1
      if (hoverIdx >= 0) {
        const sc = screen[hoverIdx]
        const [r, g, b] = pts[hoverIdx].c
        ctx.beginPath()
        ctx.arc(sc.sx, sc.sy, 8, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},0.95)`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Floating label so the visitor knows where it leads.
        const bk = beaconAt.get(hoverIdx)
        const label = bk !== undefined ? beacons[bk].label : ""
        if (label) {
          ctx.font = "600 12px ui-sans-serif, system-ui, -apple-system, sans-serif"
          const tw = ctx.measureText(label).width
          const rw = tw + 14
          const rh = 22
          const left = sc.sx > W * 0.6
          const bx = left ? sc.sx - 14 - rw : sc.sx + 14
          const by = sc.sy - rh / 2
          ctx.beginPath()
          if (typeof (ctx as CanvasRenderingContext2D & { roundRect?: unknown }).roundRect === "function") {
            ctx.roundRect(bx, by, rw, rh, 7)
          } else {
            ctx.rect(bx, by, rw, rh)
          }
          ctx.fillStyle = "rgba(7,13,29,0.92)"
          ctx.fill()
          ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.fillStyle = "rgba(231,238,255,0.97)"
          ctx.fillText(label, bx + 7, by + 15)
        }
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

      // Click ripples, drawn on top.
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pu = pulses[i]
        pu.life++
        const sc = screen[pu.idx]
        const t = pu.life / pu.ttl
        const rad = 4 + t * 26
        const a = (1 - t) * 0.85
        const [r, g, b] = pts[pu.idx].c
        ctx.beginPath()
        ctx.arc(sc.sx, sc.sy, rad, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`
        ctx.lineWidth = 2 * (1 - t) + 0.5
        ctx.stroke()
        if (pu.life >= pu.ttl) pulses.splice(i, 1)
      }

      const wantCursor = dragging ? "grabbing" : hoverIdx >= 0 ? "pointer" : "grab"
      if (wantCursor !== cursor) {
        cursor = wantCursor
        canvas.style.cursor = wantCursor
      }

      raf = requestAnimationFrame(drawFrame)
    }

    let raf = 0
    resize()
    const onResize = () => resize()
    window.addEventListener("resize", onResize, { passive: true })

    // --- Pointer interaction (the easter egg) ---
    function localPoint(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    function onDown(e: PointerEvent) {
      dragging = true
      moved = 0
      lastX = e.clientX
      lastY = e.clientY
      velRY = 0
      velRX = 0
      try {
        canvas.setPointerCapture(e.pointerId)
      } catch {}
    }
    function onMove(e: PointerEvent) {
      const p = localPoint(e)
      hoverX = p.x
      hoverY = p.y
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      moved += Math.abs(dx) + Math.abs(dy)
      // Surface follows the cursor (grab-to-drag), so deltas are negated.
      ry -= dx * 0.006
      rx = Math.max(-1.25, Math.min(1.25, rx - dy * 0.006))
      velRY = -dx * 0.006
      velRX = -dy * 0.006
    }
    function onUp(e: PointerEvent) {
      if (dragging && moved < 6) {
        // It was a tap, not a drag → only beacons respond.
        const p = localPoint(e)
        const idx = nearestBeacon(p.x, p.y, 18)
        if (idx >= 0) {
          pulses.push({ idx, life: 0, ttl: 42 })
          signals.push(signalFrom(pts[idx], true))
          if (signals.length > 16) signals.shift()
          const bk = beaconAt.get(idx)
          if (bk !== undefined) {
            const b = beacons[bk]
            if (onActivateRef.current) onActivateRef.current(b)
            else if (b.href) window.open(b.href, "_blank", "noopener")
          }
        }
      }
      dragging = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {}
    }
    function onLeave() {
      hoverX = -1
      hoverY = -1
    }
    function onCancel() {
      dragging = false
    }

    if (interactive) {
      canvas.addEventListener("pointerdown", onDown)
      canvas.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
      canvas.addEventListener("pointerleave", onLeave)
      canvas.addEventListener("pointercancel", onCancel)
    }

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
      if (interactive) {
        canvas.removeEventListener("pointerdown", onDown)
        canvas.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
        canvas.removeEventListener("pointerleave", onLeave)
        canvas.removeEventListener("pointercancel", onCancel)
      }
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`${className ?? ""} pointer-events-auto cursor-grab`}
      style={{ touchAction: "pan-y" }}
      role="presentation"
      aria-hidden="true"
      title="Drag to spin · click a node"
    />
  )
}
