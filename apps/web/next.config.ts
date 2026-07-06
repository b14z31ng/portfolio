import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ──────────────────────────────────────
  // API Proxy (avoids CORS in development)
  // ──────────────────────────────────────
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/uploads/:path*`,
      },
    ];
  },

  // ──────────────────────────────────────
  // Image optimization
  // ──────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },

  // ──────────────────────────────────────
  // Experimental
  // ──────────────────────────────────────
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
