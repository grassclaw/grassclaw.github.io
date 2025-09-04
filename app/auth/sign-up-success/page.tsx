import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Check Your Email</CardTitle>
            <CardDescription className="text-slate-300">We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-slate-300">
              You've successfully signed up! Please check your email and click the confirmation link to activate your
              account.
            </p>
            <p className="text-xs text-slate-400">
              Once confirmed, you'll be able to sign in and start building your portfolio.
            </p>
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <Link href="/auth/login">Return to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
