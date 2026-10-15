import { MetadataRoute } from "next";

const BASE_URL = "https://eatbit.in";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // Main crawler: allow everything except internal paths
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/_next/",           // Next.js static assets — not pages
                    "/api/",             // API routes — not indexable content
                    "/tools/track-view", // Internal analytics endpoint (currently causing 404 in GSC)
                    "/favicon.ico",      // Binary asset — not a page
                    "/*.woff2$",         // Font files
                    "/*.woff$",
                    "/*.ttf$",
                ],
            },
            {
                // Block AI training crawlers from scraping tool content
                userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot", "anthropic-ai"],
                disallow: ["/"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
