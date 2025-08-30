"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** quick sizing helper; override with className if you want exact h-XX */
  size?: "sm" | "md" | "lg"
}

/**
 * Opinionated Radix Slider wrapper
 * - No hard-coded h-full/min-h-44 for vertical
 * - Easy height via `size` or your own className
 * - Sensible padding so the thumb never clips top/bottom
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  size = "md",
  ...props
}: SliderProps) {
  // keep Radix happy when given single vs array values
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  )

  // height presets for vertical; width presets for horizontal
  const sizeClass = {
    sm: "data-[orientation=vertical]:h-24 data-[orientation=horizontal]:w-32",
    md: "data-[orientation=vertical]:h-38 data-[orientation=horizontal]:w-48",
    lg: "data-[orientation=vertical]:h-36 data-[orientation=horizontal]:w-64",
  }[size]

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        // base
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50",
        // orientation layouts
        "data-[orientation=horizontal]:h-6 data-[orientation=horizontal]:flex-row",
        "data-[orientation=vertical]:w-8 data-[orientation=vertical]:flex-col",
        // add breathing room so the thumb never kisses edges
        "data-[orientation=horizontal]:px-2 data-[orientation=vertical]:py-2",
        // size preset (can be overridden by className)
        sizeClass,
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted",
          "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-cyan-900",
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>

      {Array.from({ length: _values.length }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className={cn(
            "block size-5 shrink-0 rounded-full border border-primary bg-background shadow-sm",
            "transition-[box-shadow,outline-color] hover:ring-4 focus-visible:ring-4 ring-ring/50",
            "focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
