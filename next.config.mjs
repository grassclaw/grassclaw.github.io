/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ← Critical for static export!
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optional: add basePath if deploying to a subfolder (e.g., repo site rather than username.github.io)
  // basePath: '/repo-name',
}
export default nextConfig
