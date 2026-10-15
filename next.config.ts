import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@pilio/gemini-watermark-remover', 'mediabunny'],
  async redirects() {
    return [
      // 301 redirect /blog/* → /blogs/* (fixes the 3 GSC 404s from old links)
      {
        source: '/blog/:slug*',
        destination: '/blogs/:slug*',
        permanent: true,
      },
      // 301 redirect /contact → /contact-us (old sitemap entry)
      {
        source: '/contact',
        destination: '/contact-us',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      // Tell Google not to index internal Next.js static paths or API endpoints
      {
        source: '/_next/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;

