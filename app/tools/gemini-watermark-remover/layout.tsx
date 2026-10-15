import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Gemini Watermark Free — No Sign-up | EatBit",
  description:
    "Remove the visible Google Gemini watermark from images and videos — 100% in your browser, no upload, no sign-up. 1 free download per day. Supports MP4, WebM, MOV, JPG, PNG, WebP.",
  keywords: [
    "gemini watermark remover",
    "remove gemini watermark",
    "gemini video watermark remover",
    "remove gemini watermark from video",
    "google gemini watermark remover",
    "gemini image watermark remover",
    "gemini watermark remover free no sign up",
    "how to remove gemini watermark",
    "gemini logo remover online",
    "visible gemini watermark",
    "synthid",
    "reverse alpha blending",
    "watermark remover no signup",
  ],
  openGraph: {
    title: "Remove Gemini Watermark Free — No Sign-up | EatBit",
    description:
      "Remove the visible Gemini AI watermark from images and videos in your browser. 1 free download per day, no account required, 100% private. Supports MP4, WebM, MOV, JPG, PNG, WebP.",
    url: "https://eatbit.in/tools/gemini-watermark-remover",
    siteName: "EatBit",
    type: "website",
    images: [
      {
        url: "https://eatbit.in/og-gemini-watermark-remover.png",
        width: 1200,
        height: 630,
        alt: "EatBit — Remove Gemini Watermark from Video & Images Free",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Gemini Watermark Free — No Sign-up | EatBit",
    description:
      "Remove the visible Gemini AI watermark from images & videos. 1 free download/day, no account, 100% in-browser. Supports MP4, WebM, MOV, JPG, PNG, WebP.",
    images: ["https://eatbit.in/og-gemini-watermark-remover.png"],
  },
  alternates: {
    canonical: "https://eatbit.in/tools/gemini-watermark-remover",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
