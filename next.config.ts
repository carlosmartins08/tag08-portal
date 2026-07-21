import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Prisma uses a Node-only driver adapter at request time. Keep it external so
  // Next traces and copies the package into the standalone runtime image.
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
  turbopack: {
    root: process.cwd()
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()"
          },
          {
            // Enforced only after staging confirms every allowed third-party integration.
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://i.ytimg.com",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googleapis.com",
              "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com https://www.google.com.br",
              "upgrade-insecure-requests"
            ].join("; ")
          }
        ]
      }
    ];
  }
};

export default nextConfig;
