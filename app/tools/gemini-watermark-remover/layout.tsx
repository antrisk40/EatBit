import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Gemini Watermark & Logo Remover (No Sign-up)",
  description:
    "Remove visible Gemini AI watermarks from images and videos directly in your browser. Free, no signup, and your files stay on your device.",
  keywords: [
    "gemini logo remover online",
    "remove google gemini watermark free",
    "ai watermark eraser for gemini",
    "gemini image watermark remover",
    "gemini watermark remover",
    "remove gemini watermark",
    "gemini ai watermark",
    "google gemini watermark",
    "free watermark remover",
    "gemini image watermark",
    "remove ai watermark",
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
  ],
  openGraph: {
    title: "Free Gemini Watermark & Logo Remover (No Sign-up)",
    description:
      "Remove visible Gemini AI watermarks from images and videos for free. No account, 100% private, all processing in your browser.",
    url: "https://eatbit.in/tools/gemini-watermark-remover",
    siteName: "EatBit",
    type: "website",
    images: [
      {
        url: "https://eatbit.in/og-gemini-watermark-remover.png",
        width: 1200,
        height: 630,
        alt: "EatBit Gemini Watermark Remover — Free, No Signup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Gemini Watermark & Logo Remover (No Sign-up)",
    description:
      "Remove visible Gemini AI watermarks from images and videos instantly. No account needed, 100% local browser processing.",
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
