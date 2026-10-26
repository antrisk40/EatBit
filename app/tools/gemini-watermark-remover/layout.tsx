import type { Metadata } from "next";
import { getLimitsConfig } from "@/lib/limits-config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getLimitsConfig();
  const seo = config.seo_text;

  // Build description dynamically from CRM-managed limits
  const description = `Remove the visible Google Gemini watermark from images and videos — 100% in your browser, no upload, no sign-up. ${seo.image_limit_text}. ${seo.video_limit_text}. Supports MP4, WebM, MOV, JPG, PNG, WebP.`;
  const ogDescription = `Remove the visible Gemini AI watermark from images and videos in your browser. ${seo.image_limit_text}. ${seo.video_limit_text}. 100% private. Supports MP4, WebM, MOV, JPG, PNG, WebP.`;

  return {
    title: "Remove Gemini Watermark Free — No Sign-up | EatBit",
    description,
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
      description: ogDescription,
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
      description: ogDescription,
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
        "max-image-preview": "large" as const,
        "max-video-preview": -1,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
