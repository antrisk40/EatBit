import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "The Complete Guide to Converting PNG to WebP",
  description:
    "Maintain transparency while drastically reducing image weight. Convert PNG to WebP securely in your browser.",
  keywords: [
    "PNG to WebP Converter free",
    "no sign-up",
    "png-to-webp-converter free no sign up",
    "ai tools",
    "privacy-first",
    "browser tools"
  ],
  openGraph: {
    title: "The Complete Guide to Converting PNG to WebP",
    description:
      "Maintain transparency while drastically reducing image weight. Convert PNG to WebP securely in your browser.",
    url: "https://eatbit.in/blogs/convert-png-to-webp-guide",
    siteName: "EatBit",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Complete Guide to Converting PNG to WebP",
    description:
      "Maintain transparency while drastically reducing image weight. Convert PNG to WebP securely in your browser.",
  },
  alternates: {
    canonical: "https://eatbit.in/blogs/convert-png-to-webp-guide",
  },
  robots: { index: true, follow: true },
};

export default function BlogPostPage() {
  return (
    <>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground">The Complete Guide to Converting PNG to WebP</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Educational
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-5">
            The Complete Guide to Converting PNG to WebP
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Maintain transparency while drastically reducing image weight. Convert PNG to WebP securely in your browser.
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <span>By EatBit Team</span>
            <span>•</span>
            <time dateTime="2026-09-12">Sep 12, 2026</time>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-12 rounded-xl overflow-hidden shadow-2xl border border-border">
          <Image 
            src="/blogs/png_to_webp.webp" 
            alt="The Complete Guide to Converting PNG to WebP Demo" 
            width={1200} 
            height={675} 
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Body */}
        <div className="prose-custom space-y-10 text-muted-foreground text-[15px] leading-8">
          
          <p>
            Welcome to the ultimate guide on using our <strong>PNG to WebP Converter</strong>. Maintain transparency while drastically reducing image weight. Convert PNG to WebP securely in your browser.
          </p>
          <p>
            Whether you are a developer, designer, or just looking to optimize your digital workflow, having the right tools can make all the difference. Our tools are designed with a privacy-first approach, ensuring that your data stays on your device.
          </p>

          <section>
            <h2 className="text-2xl font-extrabold text-foreground mb-4">Why Use Our PNG to WebP Converter?</h2>
            <p>
              Unlike many online tools that force you to upload files to their servers, our PNG to WebP Converter operates entirely within your browser. This means:
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
              <li>Navigate to the <Link href="/tools/png-to-webp-converter" className="text-primary hover:underline">PNG to WebP Converter</Link> page.</li>
              <li>Input your data or upload your file securely.</li>
              <li>Adjust any settings or parameters as needed.</li>
              <li>Click the generate/convert button to get your results instantly!</li>
            </ol>
          </section>

          {/* CTA */}
          <div className="border border-primary/30 bg-primary/5 p-8 text-center mt-10">
            <h2 className="text-2xl font-extrabold text-foreground mb-3">Try It Now — Free</h2>
            <p className="text-sm mb-6">
              Use our PNG to WebP Converter securely and for free. No account, no upload, no waiting.
            </p>
            <Link
              href="/tools/png-to-webp-converter"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all"
            >
              Open the PNG to WebP Converter →
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
