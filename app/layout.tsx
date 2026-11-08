import type React from "react"
import type { Metadata } from "next"
import { Inter, Fraunces } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
})

export const metadata: Metadata = {
  title: "Aaron E — Principal Architect",
  description:
    "Aaron E — principal-level architect and engineering lead designing research-grade AI and security systems.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} ${fraunces.variable}`}>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
