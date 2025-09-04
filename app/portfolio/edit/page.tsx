import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditPortfolioClient } from "@/components/portfolio/edit-portfolio-client"

export default async function EditPortfolioPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Load user's portfolio data
  const { data: portfolioData } = await supabase.from("portfolio_data").select("*").eq("user_id", data.user.id)

  // Load user's search keywords
  const { data: keywordsData } = await supabase.from("search_keywords").select("*").eq("user_id", data.user.id)

  return (
    <EditPortfolioClient
      userId={data.user.id}
      initialPortfolioData={portfolioData || []}
      initialKeywordsData={keywordsData || []}
    />
  )
}
