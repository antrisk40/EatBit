import { MetadataRoute } from "next";

const BASE_URL = "https://eatbit.in"; // Update to match your production domain

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
