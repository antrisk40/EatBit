import { MetadataRoute } from "next";
import { CANONICAL_TOOLS } from "@/lib/tools-catalog";

const BASE_URL = "https://eatbit.in";

const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/plans",
  "/samples",
  "/careers",
  "/careers/bda",
  "/contact-us",
  "/blogs",
  "/tools",
  "/privacy-policy",
  "/terms-of-service",
];

const BLOG_SLUGS = [
  "why-privacy-first-image-cropper",
  "how-to-remove-gemini-watermark",
  "gemini-watermark-vs-synthid",
  "gemini-watermark-explained",
  "best-free-pdf-editor-no-signup",
  "ultimate-free-image-converter",
  "how-to-merge-and-split-pdf-files",
  "create-custom-qr-codes-free",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const tools = CANONICAL_TOOLS.map((tool) => ({
    url: `${BASE_URL}${tool.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogs = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blogs/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...tools, ...blogs];
}
