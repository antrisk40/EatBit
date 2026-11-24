"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaBolt,
  FaFilm,
  FaLock,
  FaChevronDown,
  FaArrowRight,
} from "react-icons/fa";
import { useState } from "react";

const FEATURES = [
  {
    icon: <FaShieldAlt className="w-6 h-6" />,
    title: "100% Private",
    desc: "Files never leave your browser. Zero uploads, zero privacy risk.",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
  {
    icon: <FaBolt className="w-6 h-6" />,
    title: "Mathematical Precision",
    desc: "Reverse Alpha Blending — exact pixel recovery, not AI guesswork.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: <FaFilm className="w-6 h-6" />,
    title: "Images & Videos",
    desc: "JPG, PNG, WebP images and MP4 / WebM videos all supported.",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: <FaLock className="w-6 h-6" />,
    title: "Free · No Login",
    desc: "Start for free without an account. Sign in for unlimited processing.",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
];

const FAQS = [
  {
    q: "Does ChatGPT / DALL·E add a visible watermark?",
    a: "DALL·E 3 (via ChatGPT) does not add a visible logo watermark by default. However, images generated through the API or certain third-party integrations may display provider branding, and older DALL·E outputs sometimes included a small logo. If your ChatGPT image has a visible overlay, this tool can remove it.",
  },
  {
    q: "What visible AI watermarks can this tool remove?",
    a: "This tool is optimised for the Gemini sparkle logo watermark, which uses a known alpha-blending formula. It also works on other semi-transparent overlay watermarks where the original pixels are mathematically recoverable. If the watermark is a full opaque block, the tool will flag it as unremovable.",
  },
  {
    q: "Will it remove the C2PA / Content Credentials metadata from DALL·E images?",
    a: "No. Content Credentials is invisible metadata embedded in the file — not a visual watermark. This tool only removes visible overlay watermarks. C2PA data is not visible and cannot be removed by any browser tool.",
  },
  {
    q: "Is this tool free for DALL·E / ChatGPT images?",
    a: "Yes. You get 3 free image processes without signing in. Sign in free for unlimited processing.",
  },
  {
    q: "Does processing happen on my device or on a server?",
    a: "100% on your device. No file ever leaves your browser. This is especially important for creative and commercial work where you don't want your images processed on a third-party server.",
  },
  {
    q: "What's the difference between a visible watermark and an AI provenance signal?",
    a: "A visible watermark is a logo or text overlaid on the image — you can see it. An AI provenance signal (like C2PA from OpenAI or SynthID from Google) is embedded invisibly in the pixel data or file metadata. This tool removes visible overlays only.",
  },
];

const USE_CASES = [
  { emoji: "🖼️", title: "ChatGPT / DALL·E Images", desc: "Remove any visible branding overlaid on DALL·E-generated images before using them in presentations, marketing, or design work." },
  { emoji: "🎨", title: "Midjourney / Ideogram Downloads", desc: "Some Midjourney integrations and Ideogram exports include a watermark. Upload the image and remove the visible logo in seconds." },
  { emoji: "🤖", title: "Other AI Generator Outputs", desc: "Any semi-transparent logo overlay composited on an AI image using standard alpha blending can be mathematically reversed." },
  { emoji: "📸", title: "Screenshots of AI Outputs", desc: "Screenshot an AI-generated image from any source — the visible logo is captured in the flat image and can be removed with this tool." },
  { emoji: "🗂️", title: "Bulk Cleanup", desc: "Have a folder of AI-generated images from multiple sources? Use our Bulk Remover to process them all in one browser session." },
  { emoji: "🔒", title: "Privacy-Sensitive Work", desc: "Process confidential visual assets without uploading to any server. Ideal for legal, medical, or business imagery." },
];

export default function ChatGPTWatermarkRemoverPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AI Watermark Remover — ChatGPT, DALL·E, Gemini & More",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires a modern browser with JavaScript enabled",
            url: "https://eatbit.in/tools/chatgpt-watermark-remover",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free browser tool to remove visible AI watermarks from ChatGPT, DALL·E, Gemini, Midjourney, and other AI-generated images and videos. 100% private — no uploads.",
          }),
        }}
      />

      <div className="min-h-screen bg-background text-foreground pt-20">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              Free · No Upload · No Login
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              AI Watermark Remover —{" "}
              <span className="text-primary">ChatGPT, DALL·E</span> &amp; More
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Remove visible AI watermarks from images and videos generated by ChatGPT, DALL·E, Gemini, Midjourney, Ideogram, and other AI tools — all inside your browser. Zero uploads, pixel-perfect results.
            </p>

            {/* Primary CTA → redirect to main remover */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools/gemini-watermark-remover"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all rounded"
              >
                Remove AI Watermark Free <FaArrowRight />
              </Link>
              <Link
                href="/tools/bulk-gemini-watermark-remover"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-bold text-sm hover:border-primary/50 transition-all rounded"
              >
                Bulk Remover
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="bg-muted/20 border-y border-border py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-extrabold text-center mb-10">
              Why <span className="text-primary">EatBit</span> over generic AI erasers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`border ${f.bg} p-6 rounded-xl`}
                >
                  <div className={`mb-4 ${f.color}`}>{f.icon}</div>
                  <h3 className="font-bold text-foreground text-sm mb-2">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What watermarks */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-extrabold text-foreground mb-4">
            What visible AI watermarks can be removed?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            This tool uses <strong className="text-foreground">Reverse Alpha Blending</strong> — a mathematical technique that works on any semi-transparent logo overlay where the original pixels are recoverable. It is optimised for the Gemini sparkle logo but works on similar overlays from other sources.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-bold text-foreground">AI Tool</th>
                  <th className="text-left px-4 py-3 font-bold text-foreground">Visible Watermark?</th>
                  <th className="text-left px-4 py-3 font-bold text-foreground">Removable?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { tool: "Google Gemini (Imagen 3 / Veo 3)", visible: "Yes — sparkle logo, bottom-right", removable: "✅ Yes", ok: true },
                  { tool: "ChatGPT / DALL·E 3 (direct)", visible: "No visible logo by default", removable: "— No overlay to remove", ok: false },
                  { tool: "DALL·E via third-party apps", visible: "Sometimes — provider branding", removable: "✅ If semi-transparent overlay", ok: true },
                  { tool: "Midjourney (web / Discord)", visible: "No logo on direct downloads", removable: "— No overlay to remove", ok: false },
                  { tool: "Midjourney via API integrations", visible: "Sometimes — integration watermark", removable: "✅ If semi-transparent overlay", ok: true },
                  { tool: "Ideogram", visible: "Free tier adds visible watermark", removable: "✅ Yes", ok: true },
                  { tool: "Adobe Firefly", visible: "No visible logo on exports", removable: "— No overlay to remove", ok: false },
                  { tool: "Stability AI / Stable Diffusion", visible: "Depends on host platform", removable: "✅ If semi-transparent overlay", ok: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{row.tool}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.visible}</td>
                    <td className={`px-4 py-3 font-semibold ${row.ok ? "text-green-400" : "text-muted-foreground"}`}>{row.removable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            * Invisible provenance watermarks (OpenAI C2PA, Google SynthID) are embedded in pixel data or metadata — they cannot be removed by any browser tool and we do not attempt to.
          </p>
        </section>

        {/* Use cases */}
        <section className="bg-muted/20 border-y border-border py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-extrabold text-foreground text-center mb-10">Who uses this tool</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {USE_CASES.map((u, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="border border-border bg-card p-6 rounded-xl"
                >
                  <div className="text-2xl mb-3">{u.emoji}</div>
                  <h3 className="font-bold text-foreground text-sm mb-2">{u.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{u.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiators vs generic tools */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-extrabold text-foreground mb-6">
            Why not use UniConverter, BeautyPlus, or Vmake?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            General AI erasers handle arbitrary watermarks by inpainting — they guess what pixels should replace the logo. On the complex gradients and detailed textures common in AI-generated images, that guess leaves a smudge, blur, or colour patch.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            EatBit uses a fundamentally different approach. Because AI watermarks like Gemini&apos;s use a fixed alpha formula, we can <strong className="text-foreground">invert the equation</strong> and recover the exact original pixel values. No guessing. No blur. No quality loss.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-xl">
              <h3 className="font-bold text-foreground text-sm mb-3">Generic AI erasers</h3>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li>✗ Guess missing pixels → visible blur</li>
                <li>✗ Fail on dark/textured backgrounds</li>
                <li>✗ Upload your files to their servers</li>
                <li>✗ Often require paid subscription</li>
                <li>✗ Can&apos;t handle videos frame-by-frame</li>
                <li>✗ Compress output quality</li>
              </ul>
            </div>
            <div className="border border-green-500/20 bg-green-500/5 p-6 rounded-xl">
              <h3 className="font-bold text-foreground text-sm mb-3">EatBit AI Watermark Remover</h3>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li>✓ Mathematical inversion → exact pixels</li>
                <li>✓ Works on any background type</li>
                <li>✓ 100% browser-local, no upload</li>
                <li>✓ Free to start, no login needed</li>
                <li>✓ Full video support (frame-by-frame)</li>
                <li>✓ Full resolution output</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted/20 border-y border-border py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-extrabold text-foreground mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-border bg-background rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-sm text-foreground hover:text-primary transition-colors"
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    aria-expanded={activeFaq === i}
                  >
                    <span>{faq.q}</span>
                    <FaChevronDown
                      className={`shrink-0 transition-transform duration-200 ${activeFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {activeFaq === i && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-foreground mb-4">
            Remove your AI watermark now — free
          </h2>
          <p className="text-muted-foreground mb-8">
            No account. No upload. 100% in your browser. Works on images and videos from Gemini, DALL·E, and other AI tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools/gemini-watermark-remover"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all rounded"
            >
              Open Watermark Remover <FaArrowRight />
            </Link>
            <Link
              href="/tools/bulk-gemini-watermark-remover"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-bold text-sm hover:border-primary/50 transition-all rounded"
            >
              Bulk Remover
            </Link>
          </div>

          {/* Related links */}
          <div className="mt-12 text-left">
            <h3 className="text-lg font-extrabold text-foreground mb-4">Related guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/blogs/how-to-turn-off-gemini-watermark", title: "How to Turn Off the Gemini Watermark", desc: "Settings guide + when you still need a remover." },
                { href: "/blogs/how-to-remove-gemini-watermark", title: "How to Remove the Gemini Watermark (Zero Blur)", desc: "The mathematical method explained." },
                { href: "/blogs/gemini-watermark-older-images", title: "Older Images, Shared Files & Bulk Cleanup", desc: "Practical guide for large libraries." },
                { href: "/blogs/gemini-watermark-explained", title: "What Is the Gemini Watermark?", desc: "Technical explainer: alpha blending, SynthID, position." },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="group border border-border bg-background p-5 hover:border-primary/40 transition-all duration-200 rounded-lg">
                  <p className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
