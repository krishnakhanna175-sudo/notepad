/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      resolveAlias: {
        "@": "./",
      },
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
