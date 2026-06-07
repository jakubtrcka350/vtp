/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent embedding in iframes (clickjacking)
          { key: "X-Frame-Options",        value: "DENY" },
          // Stop browsers from MIME-sniffing the response type
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Control referrer info sent to third parties
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          // Disable unnecessary browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Force HTTPS for 1 year (Vercel already enforces HTTPS, belt-and-suspenders)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Basic CSP — allow Next.js inline scripts, Google Fonts, and Blob images
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js requires unsafe-eval in dev; inline scripts for hydration
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              // Inline styles for Tailwind + Google Fonts stylesheet
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Google Fonts webfont files
              "font-src 'self' https://fonts.gstatic.com data:",
              // Local images, data URIs, blobs, and Vercel Blob CDN
              "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
              // API calls stay same-origin only
              "connect-src 'self'",
              // No plugins
              "object-src 'none'",
              // Prevent base tag hijacking
              "base-uri 'self'",
              // Forms post only to same origin
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
