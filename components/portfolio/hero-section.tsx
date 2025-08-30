import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Linkedin } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-transparent py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
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
            <circle cx="200" cy="125" r="1" fill="#8b5cf6" className="animate-ping" />
            <circle cx="400" cy="115" r="1" fill="#3b82f6" className="animate-ping" style={{ animationDelay: "1s" }} />
            <circle cx="600" cy="140" r="1" fill="#8b5cf6" className="animate-ping" style={{ animationDelay: "2s" }} />
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
                className="w-48 h-48 rounded-full object-cover border-4 border-purple-500/30 shadow-2xl shadow-purple-500/20"
              />
              {/* Animated graph elements around profile */}
              <div
                className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500/20 rounded-full animate-bounce"
                style={{ animationDelay: "1s" }}
              ></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-purple-400/30 rounded-full animate-pulse"></div>
              <div
                className="absolute bottom-1/4 -left-6 w-5 h-5 bg-blue-400/30 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance text-white">Aaron Escamilla</h1>
            <h2 className="text-xl lg:text-2xl text-gray-300 mb-6 text-pretty">
              Senior AI & ML Engineer • Cybersecurity Researcher • Academic
            </h2>

            <p className="text-lg mb-6 max-w-2xl text-pretty text-gray-200">
              Innovative professional with progressive experience in artificial intelligence, cybersecurity, and
              advanced threat detection. Skilled in designing and deploying AI/ML-driven models to identify, analyze,
              and predict cyber threats.
            </p>

            <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
              <Badge
                variant="secondary"
                className="bg-purple-600/20 text-purple-200 border-purple-500/30 hover:animate-wiggle"
              >
                LLMs
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-600/20 text-blue-200 border-blue-500/30 hover:animate-wiggle"
                style={{ animationDelay: "0.1s" }}
              >
                AWS
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-600/20 text-purple-200 border-purple-500/30 hover:animate-wiggle"
                style={{ animationDelay: "0.2s" }}
              >
                LangChain
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-600/20 text-blue-200 border-blue-500/30 hover:animate-wiggle"
                style={{ animationDelay: "0.3s" }}
              >
                Threat Intelligence
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-600/20 text-purple-200 border-purple-500/30 hover:animate-wiggle"
                style={{ animationDelay: "0.4s" }}
              >
                Golang
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-600/20 text-blue-200 border-blue-500/30 hover:animate-wiggle"
                style={{ animationDelay: "0.5s" }}
              >
                Python
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                <Mail className="w-4 h-4" />
                aaronenv@proton.me
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
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
