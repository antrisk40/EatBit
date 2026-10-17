import { MetadataRoute } from "next";

const BASE_URL = "https://eatbit.in";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // Main crawler: allow everything except internal paths.
                // IMPORTANT: /_next/static/ must stay crawlable so Googlebot can
                // fetch the JS/CSS it needs to render pages fully.
                userAgent: "*",
                allow: ["/", "/_next/static/"],
                disallow: [
                    "/api/",             // API routes — not indexable content
                    "/tools/track-view", // Internal analytics endpoint (causing 404 in GSC)
                    "/favicon.ico",      // Binary asset — not a page
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
