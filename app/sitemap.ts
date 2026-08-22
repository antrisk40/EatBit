import { MetadataRoute } from "next";

const BASE_URL = "https://eatbit.in"; // Update this to your production domain

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        {
            url: `${BASE_URL}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/services`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/plans`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/samples`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/careers`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/careers/bda`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.8,
        },
        // ── Tools ──
        {
            url: `${BASE_URL}/tools/gemini-watermark-remover`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        // ── Blog ──
        {
            url: `${BASE_URL}/blog/how-to-remove-gemini-watermark`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/blog/gemini-watermark-explained`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/blog/gemini-watermark-vs-synthid`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];
}
