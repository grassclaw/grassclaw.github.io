import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { User, Settings, FileText, LogOut } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.display_name || data.user.email}</h1>
            <p className="text-slate-300 mt-2">Manage your portfolio and account settings</p>
          </div>
          <form action={handleSignOut}>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Portfolio
              </CardTitle>
              <CardDescription className="text-slate-300">View and edit your public portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/portfolio/edit">Edit Portfolio</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/">View Public Portfolio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile
              </CardTitle>
              <CardDescription className="text-slate-300">Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </CardTitle>
              <CardDescription className="text-slate-300">Configure portfolio settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/dashboard/settings">Manage Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Portfolio Status</CardTitle>
            <CardDescription className="text-slate-300">
              Your portfolio is currently {profile ? "active" : "incomplete"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-300">
              {profile ? (
                <p>✅ Profile setup complete. Your portfolio is live and accessible.</p>
              ) : (
                <p>⚠️ Complete your profile setup to activate your portfolio.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
