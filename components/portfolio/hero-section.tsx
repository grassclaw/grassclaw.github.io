import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Linkedin } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-background to-card py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/188-HfYogLPVvZA-Tuwb2JauwSpe2uO55FRqGrieIv5sTI.jpeg"
              alt="Aaron Escamilla"
              className="w-48 h-48 rounded-full object-cover border-4 border-accent/20"
            />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Aaron Escamilla</h1>
            <h2 className="text-xl lg:text-2xl text-muted-foreground mb-6 text-pretty">
              Senior AI & ML Engineer • Cybersecurity Researcher • Academic
            </h2>

            <p className="text-lg mb-6 max-w-2xl text-pretty">
              Innovative professional with progressive experience in artificial intelligence, cybersecurity, and
              advanced threat detection. Skilled in designing and deploying AI/ML-driven models to identify, analyze,
              and predict cyber threats.
            </p>

            <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
              <Badge variant="secondary">LLMs</Badge>
              <Badge variant="secondary">AWS</Badge>
              <Badge variant="secondary">LangChain</Badge>
              <Badge variant="secondary">Threat Intelligence</Badge>
              <Badge variant="secondary">Golang</Badge>
              <Badge variant="secondary">Python</Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Button className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                aaronenv@proton.me
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Linkedin className="w-4 h-4" />
                LinkedIn Profile
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Tucson, AZ
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
