import os
import json

BLOGS = [
    {
        "id": "email-qr-code-generator",
        "slug": "how-to-generate-email-qr-code-free",
        "title": "How to Generate Email QR Codes for Free",
        "desc": "Learn how to easily create custom email QR codes that open directly in your users' mail clients with pre-filled subjects and messages.",
        "image": "/images/email-qr.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/email-qr-code-generator",
        "tool_name": "Email QR Code Generator"
    },
    {
        "id": "free-pdf-editor-no-signup",
        "slug": "best-free-pdf-editor-no-signup",
        "title": "The Best Free PDF Editor with No Sign-Up Required",
        "desc": "Edit your PDF files directly in your browser. Add text, images, and signatures securely without creating an account or uploading your sensitive documents.",
        "image": "/images/free-pdf.jpg",
        "category": "Product Update",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/free-pdf-editor-no-signup",
        "tool_name": "Free PDF Editor"
    },
    {
        "id": "heic-to-jpg-converter",
        "slug": "how-to-convert-heic-to-jpg-free",
        "title": "How to Convert HEIC to JPG Free and Fast",
        "desc": "Struggling to open iPhone photos on your PC? Learn how to convert HEIC images to standard JPG format without losing quality.",
        "image": "/images/heic-to-jpg.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/heic-to-jpg-converter",
        "tool_name": "HEIC to JPG Converter"
    },
    {
        "id": "image-converter",
        "slug": "ultimate-free-image-converter",
        "title": "The Ultimate Free Image Converter for Web Developers",
        "desc": "Convert between WebP, PNG, JPG, and GIF locally in your browser. Ensure maximum privacy with zero server uploads.",
        "image": "/images/image-converter.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/image-converter",
        "tool_name": "Image Converter"
    },
    {
        "id": "jpg-to-png-converter",
        "slug": "how-to-convert-jpg-to-png-free",
        "title": "How to Convert JPG to PNG for Free",
        "desc": "Need a lossless image format? Learn how to seamlessly convert your JPG files into PNGs completely offline.",
        "image": "/images/jpg-to-png.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/jpg-to-png-converter",
        "tool_name": "JPG to PNG Converter"
    },
    {
        "id": "jpg-to-webp-converter",
        "slug": "convert-jpg-to-webp-for-faster-websites",
        "title": "Convert JPG to WebP for Faster Websites",
        "desc": "Boost your website's performance by converting heavy JPG images into next-gen WebP formats for faster loading times and better SEO.",
        "image": "/images/jpg-to-webp.jpg",
        "category": "Educational",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/jpg-to-webp-converter",
        "tool_name": "JPG to WebP Converter"
    },
    {
        "id": "merge-and-split-pdf",
        "slug": "how-to-merge-and-split-pdf-files",
        "title": "How to Merge and Split PDF Files Locally",
        "desc": "Combine multiple PDFs or extract specific pages quickly and securely. All processing happens on your device.",
        "image": "/images/merge-split-pdf.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/merge-and-split-pdf",
        "tool_name": "Merge & Split PDF Tool"
    },
    {
        "id": "pdf-qr-code-generator",
        "slug": "create-pdf-qr-codes-free",
        "title": "How to Create PDF QR Codes for Free",
        "desc": "Share your menus, resumes, and brochures effortlessly by converting your PDF links into scannable QR codes.",
        "image": "/images/pdf-qr.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/pdf-qr-code-generator",
        "tool_name": "PDF QR Code Generator"
    },
    {
        "id": "png-to-jpg-converter",
        "slug": "how-to-convert-png-to-jpg-free",
        "title": "How to Convert PNG to JPG for Free",
        "desc": "Reduce image file size by converting lossless PNG images into highly compatible JPG formats instantly.",
        "image": "/images/png-to-jpg.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/png-to-jpg-converter",
        "tool_name": "PNG to JPG Converter"
    },
    {
        "id": "png-to-webp-converter",
        "slug": "convert-png-to-webp-guide",
        "title": "The Complete Guide to Converting PNG to WebP",
        "desc": "Maintain transparency while drastically reducing image weight. Convert PNG to WebP securely in your browser.",
        "image": "/images/png-to-webp.jpg",
        "category": "Educational",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/png-to-webp-converter",
        "tool_name": "PNG to WebP Converter"
    },
    {
        "id": "qr-code-generator",
        "slug": "create-custom-qr-codes-free",
        "title": "How to Create Custom QR Codes for Free",
        "desc": "Generate high-quality, customizable QR codes for links, text, and more without any subscription or sign-ups.",
        "image": "/images/qr-code.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/qr-code-generator",
        "tool_name": "QR Code Generator"
    },
    {
        "id": "vcard-qr-code-generator",
        "slug": "vcard-qr-code-generator-guide",
        "title": "Share Your Contact Info Instantly with vCard QR Codes",
        "desc": "Network smarter by generating a vCard QR code. Let people save your contact details straight to their phones with a simple scan.",
        "image": "/images/vcard-qr.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/vcard-qr-code-generator",
        "tool_name": "vCard QR Code Generator"
    },
    {
        "id": "webp-to-jpg-converter",
        "slug": "how-to-convert-webp-to-jpg-free",
        "title": "How to Convert WebP to JPG for Free",
        "desc": "Having trouble using WebP images on older software? Quickly convert WebP files back to standard JPG format.",
        "image": "/images/webp-to-jpg.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/webp-to-jpg-converter",
        "tool_name": "WebP to JPG Converter"
    },
    {
        "id": "whatsapp-qr-code-generator",
        "slug": "whatsapp-qr-code-generator-guide",
        "title": "Start Conversations Faster with WhatsApp QR Codes",
        "desc": "Create WhatsApp QR codes with pre-filled messages. Make it easier for customers and friends to message you directly.",
        "image": "/images/whatsapp-qr.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/whatsapp-qr-code-generator",
        "tool_name": "WhatsApp QR Code Generator"
    },
    {
        "id": "wifi-qr-code-generator",
        "slug": "wifi-qr-code-generator-guide",
        "title": "Share Your WiFi Network Securely Using QR Codes",
        "desc": "Stop giving out your complicated WiFi password. Generate a WiFi QR code to let guests connect instantly.",
        "image": "/images/wifi-qr.jpg",
        "category": "Guide",
        "date": "Sep 12, 2026",
        "tool_link": "/tools/wifi-qr-code-generator",
        "tool_name": "WiFi QR Code Generator"
    }
]


template = """import type {{ Metadata }} from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {{
  title: "{title}",
  description:
    "{desc}",
  keywords: [
    "{tool_name} free",
    "no sign-up",
    "{id} free no sign up",
    "ai tools",
    "privacy-first",
    "browser tools"
  ],
  openGraph: {{
    title: "{title}",
    description:
      "{desc}",
    url: "https://eatbit.in/blog/{slug}",
    siteName: "EatBit",
    type: "article",
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{title}",
    description:
      "{desc}",
  }},
  alternates: {{
    canonical: "https://eatbit.in/blog/{slug}",
  }},
  robots: {{ index: true, follow: true }},
}};

export default function BlogPostPage() {{
  return (
    <>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        {{/* Breadcrumb */}}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground">{title}</span>
        </nav>

        {{/* Header */}}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            {category}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-5">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {desc}
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <span>By EatBit Team</span>
            <span>•</span>
            <time dateTime="2026-09-12">{date}</time>
          </div>
        </header>

        {{/* Hero Image */}}
        <div className="mb-12 rounded-xl overflow-hidden shadow-2xl border border-border">
          <Image 
            src="{image}" 
            alt="{title} Demo" 
            width={{1200}} 
            height={{675}} 
            className="w-full h-auto object-cover"
          />
        </div>

        {{/* Body */}}
        <div className="prose-custom space-y-10 text-muted-foreground text-[15px] leading-8">
          
          <p>
            Welcome to the ultimate guide on using our <strong>{tool_name}</strong>. {desc}
          </p>
          <p>
            Whether you are a developer, designer, or just looking to optimize your digital workflow, having the right tools can make all the difference. Our tools are designed with a privacy-first approach, ensuring that your data stays on your device.
          </p>

          <section>
            <h2 className="text-2xl font-extrabold text-foreground mb-4">Why Use Our {tool_name}?</h2>
            <p>
              Unlike many online tools that force you to upload files to their servers, our {tool_name} operates entirely within your browser. This means:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li><strong>Absolute Privacy:</strong> Your data never leaves your device.</li>
              <li><strong>Zero Wait Times:</strong> Processing is instant, utilizing your own machine's power.</li>
              <li><strong>No Sign-Up Required:</strong> You don't need to create an account or provide an email address.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-foreground mb-4">How to Get Started</h2>
            <p>
              Using the tool is incredibly straightforward:
            </p>
            <ol className="list-decimal pl-5 mt-4 space-y-2">
              <li>Navigate to the <Link href="{tool_link}" className="text-primary hover:underline">{tool_name}</Link> page.</li>
              <li>Input your data or upload your file securely.</li>
              <li>Adjust any settings or parameters as needed.</li>
              <li>Click the generate/convert button to get your results instantly!</li>
            </ol>
          </section>

          {{/* CTA */}}
          <div className="border border-primary/30 bg-primary/5 p-8 text-center mt-10">
            <h2 className="text-2xl font-extrabold text-foreground mb-3">Try It Now — Free</h2>
            <p className="text-sm mb-6">
              Use our {tool_name} securely and for free. No account, no upload, no waiting.
            </p>
            <Link
              href="{tool_link}"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all"
            >
              Open the {tool_name} →
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}}
"""

for blog in BLOGS:
    directory = f"/home/Neelesh/Desktop/EatBit/app/blog/{blog['slug']}"
    os.makedirs(directory, exist_ok=True)
    content = template.format(**blog)
    with open(f"{directory}/page.tsx", "w") as f:
        f.write(content)

print("Generated all blog pages!")

# Also output the JSON array snippet to easily insert into app/blog/page.tsx
out_array = []
for blog in BLOGS:
    out_array.append({
        "title": blog['title'],
        "slug": blog['slug'],
        "desc": blog['desc'],
        "image": blog['image'],
        "category": blog['category'],
        "date": blog['date']
    })

with open("/home/Neelesh/Desktop/EatBit/new_blogs_array.json", "w") as f:
    json.dump(out_array, f, indent=2)

print("Generated new_blogs_array.json")
