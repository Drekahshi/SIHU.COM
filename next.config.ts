import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Optimize for Vercel serverless
  output: "standalone",

  // Turbopack config
  turbopack: {
    root: __dirname,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Optimize for mobile
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    qualities: [75, 85],
  },

  // Compression
  compress: true,

  // Experimental optimizations
  experimental: {
    // Optimize package imports for common libraries
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Headers for caching and mobile optimization
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          // Any site may call the public APIs, but never with the visitor's cookies.
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
      {
        // Cache static assets
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Mobile viewport optimization and security headers on every page
        source: "/:path*",
        headers: [
          // No other site may show SIHU inside a frame (clickjacking / fake login pages).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://*.privy.io https://accounts.google.com" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), payment=(), microphone=(self)" },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Accept-CH",
            value: "DPR, Viewport-Width, Width",
          },
        ],
      },
    ];
  },

  // Redirects for clean URLs
  async redirects() {
    return [
      {
        source: "/agent",
        destination: "/ai",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
