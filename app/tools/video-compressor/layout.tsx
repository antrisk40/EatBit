import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Video Compressor Online — Compress MP4, MOV, MKV, WebM | EatBit",
  description:
    "Compress MP4, MOV, MKV and WebM videos online for free — 1GB, 2GB, even 10GB files. 100% private: your video never leaves your browser. No upload, no sign-up, no watermark. Works on Chrome, Safari, Edge.",
  keywords: [
    "video compressor online",
    "compress mp4 online free",
    "compress video online free",
    "compress mp4 online",
    "compress video file size",
    "reduce video file size",
    "reduce video size online",
    "compress 1gb video online",
    "compress 2gb video online",
    "compress large video file",
    "video compressor no watermark",
    "compress mp4 for whatsapp",
    "compress mp4 for discord",
    "compress mp4 for email",
    "compress video without losing quality",
    "compress mov online",
    "compress mkv online",
    "compress webm online",
    "free video compressor",
    "online video compressor",
    "reduce mp4 size",
    "shrink video file",
    "video size reducer",
    "video file compressor",
    "compress video for youtube",
    "compress video for instagram",
    "in browser video compressor",
    "private video compressor",
    "no upload video compressor",
    "video compressor no signup",
  ],
  openGraph: {
    title: "Free Video Compressor Online — Compress MP4, MOV, MKV, WebM | EatBit",
    description:
      "Compress MP4, MOV, MKV and WebM videos online free. 1GB, 2GB, 10GB — no upload limit. 100% private, runs in your browser. No watermark, no sign-up.",
    url: "https://eatbit.in/tools/video-compressor",
    siteName: "EatBit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Video Compressor Online — Compress MP4, MOV, MKV, WebM",
    description:
      "Compress videos online for free. No upload, no watermark, no sign-up. Works on 1GB, 2GB, 10GB files.",
  },
  alternates: {
    canonical: "https://eatbit.in/tools/video-compressor",
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
