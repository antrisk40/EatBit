import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog | EatBit",
  description: "Read the latest updates, guides, and insights on AI tools, privacy, and digital workflows from the EatBit team.",
  openGraph: {
    title: "Blog | EatBit",
    description: "Read the latest updates, guides, and insights on AI tools, privacy, and digital workflows from the EatBit team.",
    url: "https://eatbit.in/blogs",
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
  {
    title: "How to Generate Email QR Codes for Free",
    slug: "how-to-generate-email-qr-code-free",
    desc: "Learn how to easily create custom email QR codes that open directly in your users' mail clients with pre-filled subjects and messages.",
    image: "/images/email-qr.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "The Best Free PDF Editor with No Sign-Up Required",
    slug: "best-free-pdf-editor-no-signup",
    desc: "Edit your PDF files directly in your browser. Add text, images, and signatures securely without creating an account or uploading your sensitive documents.",
    image: "/images/free-pdf.jpg",
    category: "Product Update",
    date: "Sep 12, 2026",
  },
  {
    title: "How to Convert HEIC to JPG Free and Fast",
    slug: "how-to-convert-heic-to-jpg-free",
    desc: "Struggling to open iPhone photos on your PC? Learn how to convert HEIC images to standard JPG format without losing quality.",
    image: "/images/heic-to-jpg.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "The Ultimate Free Image Converter for Web Developers",
    slug: "ultimate-free-image-converter",
    desc: "Convert between WebP, PNG, JPG, and GIF locally in your browser. Ensure maximum privacy with zero server uploads.",
    image: "/images/image-converter.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "How to Convert JPG to PNG for Free",
    slug: "how-to-convert-jpg-to-png-free",
    desc: "Need a lossless image format? Learn how to seamlessly convert your JPG files into PNGs completely offline.",
    image: "/images/jpg-to-png.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "Convert JPG to WebP for Faster Websites",
    slug: "convert-jpg-to-webp-for-faster-websites",
    desc: "Boost your website's performance by converting heavy JPG images into next-gen WebP formats for faster loading times and better SEO.",
    image: "/images/jpg-to-webp.jpg",
    category: "Educational",
    date: "Sep 12, 2026",
  },
  {
    title: "How to Merge and Split PDF Files Locally",
    slug: "how-to-merge-and-split-pdf-files",
    desc: "Combine multiple PDFs or extract specific pages quickly and securely. All processing happens on your device.",
    image: "/images/merge-split-pdf.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "How to Create PDF QR Codes for Free",
    slug: "create-pdf-qr-codes-free",
    desc: "Share your menus, resumes, and brochures effortlessly by converting your PDF links into scannable QR codes.",
    image: "/images/pdf-qr.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "How to Convert PNG to JPG for Free",
    slug: "how-to-convert-png-to-jpg-free",
    desc: "Reduce image file size by converting lossless PNG images into highly compatible JPG formats instantly.",
    image: "/images/png-to-jpg.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "The Complete Guide to Converting PNG to WebP",
    slug: "convert-png-to-webp-guide",
    desc: "Maintain transparency while drastically reducing image weight. Convert PNG to WebP securely in your browser.",
    image: "/images/png-to-webp.jpg",
    category: "Educational",
    date: "Sep 12, 2026",
  },
  {
    title: "How to Create Custom QR Codes for Free",
    slug: "create-custom-qr-codes-free",
    desc: "Generate high-quality, customizable QR codes for links, text, and more without any subscription or sign-ups.",
    image: "/images/qr-code.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "Share Your Contact Info Instantly with vCard QR Codes",
    slug: "vcard-qr-code-generator-guide",
    desc: "Network smarter by generating a vCard QR code. Let people save your contact details straight to their phones with a simple scan.",
    image: "/images/vcard-qr.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "How to Convert WebP to JPG for Free",
    slug: "how-to-convert-webp-to-jpg-free",
    desc: "Having trouble using WebP images on older software? Quickly convert WebP files back to standard JPG format.",
    image: "/images/webp-to-jpg.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "Start Conversations Faster with WhatsApp QR Codes",
    slug: "whatsapp-qr-code-generator-guide",
    desc: "Create WhatsApp QR codes with pre-filled messages. Make it easier for customers and friends to message you directly.",
    image: "/images/whatsapp-qr.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  },
  {
    title: "Share Your WiFi Network Securely Using QR Codes",
    slug: "wifi-qr-code-generator-guide",
    desc: "Stop giving out your complicated WiFi password. Generate a WiFi QR code to let guests connect instantly.",
    image: "/images/wifi-qr.jpg",
    category: "Guide",
    date: "Sep 12, 2026",
  }
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
              href={`/blogs/${post.slug}`} 
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
