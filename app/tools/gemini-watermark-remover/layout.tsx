import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Gemini Watermark from Video & Images Free — No Sign-up | EatBit",
  description:
    "Free Gemini watermark remover for images and videos. Remove the visible Google Gemini logo from any MP4, WebM, MOV, JPG, PNG or WebP — 100% in your browser, no upload, no sign-up required.",
  keywords: [
    // High-impression zero-click queries (your biggest opportunity)
    "gemini video watermark remover",
    "remove gemini watermark from video",
    "gemini watermark remover video",
    "remove watermark from gemini video",
    "gemini video watermark remove",
    "google gemini video watermark remover",
    "remove gemini video watermark",
    "gemini ai video watermark remover",
    "free gemini video watermark remover",
    // Already ranking / converting
    "gemini watermark remover free no sign up",
    "gemini watermark remover free no sign-up",
    "how to remove gemini watermark from video",
    "gemini logo remover online",
    "remove google gemini watermark free",
    "ai watermark eraser for gemini",
    "gemini image watermark remover",
    "gemini watermark remover",
    "remove gemini watermark",
    "gemini ai watermark",
    "google gemini watermark",
    "free watermark remover",
    "watermark remover no signup",
    "gemini watermark free",
    "local watermark remover",
    "synthid",
    "visible gemini watermark",
    "gemini ai image",
    "watermark removal online",
    "reverse alpha blending",
    "how to remove gemini watermark",
    "gemini watermark removal tool",
    "remove watermark from video gemini",
    "gemini watermark remover from video",
  ],
  openGraph: {
    title: "Remove Gemini Watermark from Video & Images — Free, No Sign-up",
    description:
      "Remove the visible Gemini AI watermark from images and videos in your browser. Free, no account required, 100% private. Supports MP4, WebM, MOV, JPG, PNG, WebP.",
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
    title: "Remove Gemini Watermark from Video & Images — Free, No Sign-up",
    description:
      "Free Gemini watermark remover for images & videos. No account, 100% in-browser. Supports MP4, WebM, MOV, JPG, PNG, WebP.",
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
