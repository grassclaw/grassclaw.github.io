import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PortfolioCreationForm } from "@/components/portfolio/portfolio-creation-form"

export default async function CreatePortfolioPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user already has portfolio data
  const { data: existingData } = await supabase.from("portfolio_data").select("id").eq("user_id", data.user.id).limit(1)

  if (existingData && existingData.length > 0) {
    // User already has a portfolio, redirect to edit
    redirect("/portfolio/edit")
  }

  return <PortfolioCreationForm userId={data.user.id} userEmail={data.user.email || ""} />
}
