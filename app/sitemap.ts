import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE_URL = "https://eatbit.in"; // Update this to your production domain

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes = [
        "",
        "/services",
        "/plans",
        "/samples",
        "/careers",
        "/careers/bda",
        "/contact",
        "/blogs",
        "/tools"
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1.0 : 0.8,
    }));

    // Dynamically get tools
    let tools: MetadataRoute.Sitemap = [];
    try {
        const toolsDir = path.join(process.cwd(), "app/tools");
        tools = fs.readdirSync(toolsDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => ({
                url: `${BASE_URL}/tools/${dirent.name}`,
                lastModified: now,
                changeFrequency: "weekly" as const,
                priority: 0.9,
            }));
    } catch (e) {
        console.error("Failed to read tools directory for sitemap", e);
    }

    // Dynamically get blogs
    let blogs: MetadataRoute.Sitemap = [];
    try {
        const blogsDir = path.join(process.cwd(), "app/blogs");
        blogs = fs.readdirSync(blogsDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => ({
                url: `${BASE_URL}/blogs/${dirent.name}`,
                lastModified: now,
                changeFrequency: "monthly" as const,
                priority: 0.8,
            }));
    } catch (e) {
        console.error("Failed to read blog directory for sitemap", e);
    }

    return [...staticRoutes, ...tools, ...blogs];
}
