import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.github.dev",
        "localhost:3000"
      ],
    }
  },
}

export default nextConfig
