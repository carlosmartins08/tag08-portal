import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net https://s.pinimg.com https://snap.licdn.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://i.ytimg.com https://www.facebook.com https://ct.pinterest.com https://px.ads.linkedin.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googleapis.com https://www.facebook.com https://connect.facebook.net https://ct.pinterest.com https://px.ads.linkedin.com https://snap.licdn.com",
  "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com https://www.google.com.br",
  "upgrade-insecure-requests"
].join("; ");

// Enforce the policy by default. Set CSP_REPORT_ONLY=true only while diagnosing
// a newly introduced third-party integration in staging.
const contentSecurityPolicyHeader = process.env.CSP_REPORT_ONLY === "true"
  ? "Content-Security-Policy-Report-Only"
  : "Content-Security-Policy";
const nextConfig: NextConfig = {
  // Keep Turbopack's mutable dev manifests away from production build output.
  // This prevents a concurrent `next build` from corrupting a running dev server.
  distDir: isDevelopment ? ".next-dev" : ".next",
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
          { key: contentSecurityPolicyHeader, value: contentSecurityPolicy }
        ]
      }
    ];
  }
};

export default nextConfig;
