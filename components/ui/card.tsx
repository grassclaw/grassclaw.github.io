import type * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "text-card-foreground flex flex-col gap-6 rounded-xl border py-4 shadow-sm bg-white/80 backdrop-blur-sm z-10 relative",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props} />
}

function GraphCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="graph-card"
      className={cn(
        "text-card-foreground flex gap-4 rounded-xl border-2 border-slate-200/50 py-4 shadow-lg bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-md opacity-100 flex-col w-full",
        className,
      )}
      {...props}
    />
  )
}

function TechnicalSkillsCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="technical-skills-card"
      className={cn(
        "text-card-foreground flex flex-col gap-4 rounded-xl border py-3 shadow-sm bg-gradient-to-br from-blue-50/90 to-slate-100/80 backdrop-blur-sm border-blue-200/50 bg-lime-500",
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  GraphCard,
  TechnicalSkillsCard,
}
