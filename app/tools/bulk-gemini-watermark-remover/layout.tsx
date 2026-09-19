import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Gemini Watermark Remover — Batch Process Videos & Images Free",
  description:
    "Remove Gemini watermarks from multiple images and videos at once. Bulk process your MP4, WebM, JPG, PNG files simultaneously for free, 100% in your browser.",
  keywords: [
    "bulk gemini watermark remover",
    "batch remove gemini watermark",
    "batch process gemini watermark",
    "remove gemini watermark from multiple files",
    "bulk remove watermark from gemini images",
    "bulk gemini video watermark remover",
    "remove gemini watermark bulk",
    "batch gemini video watermark remover",
    "multiple gemini watermark remover",
    "gemini watermark remover bulk free",
    "how to remove gemini watermark in bulk",
    "batch ai watermark remover",
    "bulk image watermark removal",
    "batch video watermark removal",
    "gemini bulk processing",
  ],
  openGraph: {
    title: "Bulk Gemini Watermark Remover — Batch Process Free",
    description:
      "Batch remove the visible Gemini AI watermark from multiple images and videos in your browser. Free, no account required, 100% private. Bulk process MP4, WebM, JPG, PNG.",
    url: "https://eatbit.in/tools/bulk-gemini-watermark-remover",
    siteName: "EatBit",
    type: "website",
    images: [
      {
        url: "https://eatbit.in/og-gemini-watermark-remover.png",
        width: 1200,
        height: 630,
        alt: "EatBit — Bulk Gemini Watermark Remover Free",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Gemini Watermark Remover — Batch Process Free",
    description:
      "Batch remove Gemini watermarks for images & videos. No account, 100% in-browser bulk processing. Supports MP4, WebM, JPG, PNG.",
    images: ["https://eatbit.in/og-gemini-watermark-remover.png"],
  },
  alternates: {
    canonical: "https://eatbit.in/tools/bulk-gemini-watermark-remover",
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
