import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gemini Watermark Remover — Free, No Signup | EatBit Tools",
  description:
    "Remove Google Gemini AI watermarks from images instantly. 100% free, no account required, fully local processing. Drop your image and download a clean version in seconds.",
  keywords: [
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
  ],
  openGraph: {
    title: "Gemini Watermark Remover — Free, No Signup",
    description:
      "Remove Google Gemini AI watermarks from images for free. No account, 100% private, all processing in your browser.",
    url: "https://eatbit.in/tools/gemini-watermark-remover",
    siteName: "EatBit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gemini Watermark Remover — Free, No Signup",
    description:
      "Remove Google Gemini AI watermarks from images instantly. No account needed, 100% local.",
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
