import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Watermark Remover — ChatGPT, DALL·E, Gemini & More | EatBit",
  description:
    "Remove visible AI watermarks from ChatGPT, DALL·E, Gemini, Midjourney, and Ideogram images and videos — 100% free, in your browser, no upload, no sign-up. Pixel-perfect results using Reverse Alpha Blending.",
  keywords: [
    "chatgpt watermark remover",
    "dall-e watermark remover",
    "ai watermark remover",
    "remove ai watermark",
    "midjourney watermark remover",
    "ideogram watermark remover",
    "ai image watermark remover free",
    "ai watermark remover no upload",
    "chatgpt image watermark",
    "dall-e logo remover",
    "gemini watermark remover",
  ],
  openGraph: {
    title: "AI Watermark Remover — ChatGPT, DALL·E, Gemini & More | EatBit",
    description:
      "Remove visible AI watermarks from ChatGPT, DALL·E, Gemini, and Midjourney images. 100% browser-local, no upload, free.",
    url: "https://eatbit.in/tools/chatgpt-watermark-remover",
    siteName: "EatBit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Watermark Remover — ChatGPT, DALL·E, Gemini & More | EatBit",
    description:
      "Remove visible AI watermarks from ChatGPT, DALL·E, Gemini, and Midjourney images. Free, no upload.",
  },
  alternates: {
    canonical: "https://eatbit.in/tools/chatgpt-watermark-remover",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large" as const,
      "max-video-preview": -1,
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
