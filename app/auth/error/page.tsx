import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {params?.error ? (
              <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded">Error: {params.error}</p>
            ) : (
              <p className="text-sm text-slate-300">An unexpected error occurred during authentication.</p>
            )}
            <p className="text-xs text-slate-400">Please try again or contact support if the problem persists.</p>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/auth/login">Try Again</Link>
              </Button>
              <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
