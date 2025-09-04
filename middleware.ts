import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Skip middleware entirely if Supabase environment variables are not configured
  // This allows the site to work as a static site on GitHub Pages
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return
  }

  // Only import and run Supabase middleware if environment variables are present
  try {
    const { updateSession } = await import("@/lib/supabase/middleware")
    return await updateSession(request)
  } catch (error) {
    // If Supabase modules fail to load, continue without authentication
    console.warn("[v0] Supabase middleware failed to load, continuing without authentication:", error)
    return
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
