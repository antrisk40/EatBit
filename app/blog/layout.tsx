import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EatBit Blog — Gemini AI & Web Tools",
  description:
    "In-depth guides, explainers, and technical articles about Gemini AI tools, watermarks, and browser-based utilities from EatBit.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://eatbit.in/blog" },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
