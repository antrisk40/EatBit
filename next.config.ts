import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@pilio/gemini-watermark-remover', 'mediabunny'],
  async redirects() {
    return [
      { source: '/blog/:slug*', destination: '/blogs/:slug*', permanent: true },
      { source: '/contact', destination: '/contact-us', permanent: true },

      // Doorway converter pages → one image converter
      { source: '/tools/jpg-to-png-converter', destination: '/tools/image-converter?from=jpg&to=png', permanent: true },
      { source: '/tools/png-to-jpg-converter', destination: '/tools/image-converter?from=png&to=jpg', permanent: true },
      { source: '/tools/webp-to-jpg-converter', destination: '/tools/image-converter?from=webp&to=jpg', permanent: true },
      { source: '/tools/heic-to-jpg-converter', destination: '/tools/image-converter?from=heic&to=jpg', permanent: true },
      { source: '/tools/jpg-to-webp-converter', destination: '/tools/image-converter?from=jpg&to=webp', permanent: true },
      { source: '/tools/png-to-webp-converter', destination: '/tools/image-converter?from=png&to=webp', permanent: true },

      // Doorway QR pages → one QR generator
      { source: '/tools/wifi-qr-code-generator', destination: '/tools/qr-code-generator?tab=wifi', permanent: true },
      { source: '/tools/whatsapp-qr-code-generator', destination: '/tools/qr-code-generator?tab=whatsapp', permanent: true },
      { source: '/tools/vcard-qr-code-generator', destination: '/tools/qr-code-generator?tab=vcard', permanent: true },
      { source: '/tools/email-qr-code-generator', destination: '/tools/qr-code-generator?tab=email', permanent: true },
      { source: '/tools/pdf-qr-code-generator', destination: '/tools/qr-code-generator?tab=pdf', permanent: true },

      // Doorway PDF clones → the actual editor
      { source: '/tools/edit-pdf-text-online', destination: '/tools/free-pdf-editor-no-signup', permanent: true },
      { source: '/tools/add-text-to-pdf', destination: '/tools/free-pdf-editor-no-signup', permanent: true },
      { source: '/tools/sign-pdf-online', destination: '/tools/free-pdf-editor-no-signup', permanent: true },
      { source: '/tools/annotate-pdf', destination: '/tools/free-pdf-editor-no-signup', permanent: true },

      // Thin how-to clones → the unique guides
      { source: '/blogs/how-to-convert-jpg-to-png-free', destination: '/blogs/ultimate-free-image-converter', permanent: true },
      { source: '/blogs/how-to-convert-png-to-jpg-free', destination: '/blogs/ultimate-free-image-converter', permanent: true },
      { source: '/blogs/how-to-convert-webp-to-jpg-free', destination: '/blogs/ultimate-free-image-converter', permanent: true },
      { source: '/blogs/how-to-convert-heic-to-jpg-free', destination: '/blogs/ultimate-free-image-converter', permanent: true },
      { source: '/blogs/convert-jpg-to-webp-for-faster-websites', destination: '/blogs/ultimate-free-image-converter', permanent: true },
      { source: '/blogs/convert-png-to-webp-guide', destination: '/blogs/ultimate-free-image-converter', permanent: true },
      { source: '/blogs/wifi-qr-code-generator-guide', destination: '/blogs/create-custom-qr-codes-free', permanent: true },
      { source: '/blogs/whatsapp-qr-code-generator-guide', destination: '/blogs/create-custom-qr-codes-free', permanent: true },
      { source: '/blogs/vcard-qr-code-generator-guide', destination: '/blogs/create-custom-qr-codes-free', permanent: true },
      { source: '/blogs/how-to-generate-email-qr-code-free', destination: '/blogs/create-custom-qr-codes-free', permanent: true },
      { source: '/blogs/create-pdf-qr-codes-free', destination: '/blogs/create-custom-qr-codes-free', permanent: true },
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

