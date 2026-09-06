import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog | EatBit",
  description: "Read the latest updates, guides, and insights on AI tools, privacy, and digital workflows from the EatBit team.",
  openGraph: {
    title: "Blog | EatBit",
    description: "Read the latest updates, guides, and insights on AI tools, privacy, and digital workflows from the EatBit team.",
    url: "https://eatbit.in/blog",
    siteName: "EatBit",
    type: "website",
  },
};

const BLOG_POSTS = [
  {
    title: "Why Your Image Tools Should Be Privacy-First",
    slug: "why-privacy-first-image-cropper",
    desc: "Crop and resize your images securely in your browser without losing quality. Our new client-side tools are fast, free, and never upload your photos to a server.",
    image: "/privacy_first_cropper.jpg",
    category: "Product Update",
    date: "Sep 06, 2026",
  },
  {
    title: "How to Remove the Gemini Watermark Free with Zero Blur",
    slug: "how-to-remove-gemini-watermark",
    desc: "Learn why AI inpainting ruins your images and how to use a mathematical Gemini logo remover to restore 100% of your original image and Veo 3 video quality.",
    image: "/watermark_removal_demo.jpg",
    category: "Guide",
    date: "Sep 06, 2026",
  },
  {
    title: "SynthID vs. Visible Sparkles: Understanding Gemini Watermarks",
    slug: "gemini-watermark-vs-synthid",
    desc: "What is the difference between Google's SynthID and the visible sparkle logo? Discover how to clean up your AI art with a dedicated Gemini logo remover.",
    image: "/ai_watermark_concept.jpg",
    category: "Educational",
    date: "Sep 06, 2026",
  },
  {
    title: "What Is the Gemini Watermark? — Explained",
    slug: "gemini-watermark-explained",
    desc: "Everything you need to know about the Google Gemini watermark: what it is, where it appears, why Google adds it, and how it differs from SynthID.",
    image: "/ai_watermark_concept.jpg",
    category: "Explainer",
    date: "Aug 21, 2026",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            The <span className="text-primary">EatBit</span> Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Insights, guides, and deep dives into AI tools, digital privacy, and building better web utilities.
          </p>
        </header>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`} 
              className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-muted overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-border text-foreground">
                  {post.category}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.desc}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground font-medium">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                    Read article <span className="text-lg leading-none">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
