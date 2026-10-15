import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About EatBit — Who We Are | Custom Software & AI Tools",
  description: "EatBit is a software development agency and free tools platform based in India. We build custom web apps, mobile apps, SaaS platforms, and AI tools — including the Gemini Watermark Remover.",
  alternates: { canonical: "https://eatbit.in/about" },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
            About <span className="text-primary">EatBit</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We&apos;re a software development agency that builds custom web apps, mobile apps, SaaS platforms,
            and free AI-powered tools — used by thousands of creators, developers, and businesses worldwide.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16 border border-primary/30 bg-primary/5 p-8">
          <h2 className="text-2xl font-extrabold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-7">
            Technology should be accessible to everyone, not just big companies. EatBit was founded on a simple idea:
            build genuinely useful tools and give them away free — no dark patterns, no fake &quot;free&quot; with hidden paywalls.
            We sustain this through our software development agency work and an optional Pro tier for heavy users.
          </p>
        </section>

        {/* What We Build */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-foreground mb-8">What We Build</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                emoji: "🛠️",
                title: "Free Online Tools",
                desc: "Browser-based utilities for image conversion, PDF editing, QR code generation, watermark removal, and more. All process data locally — we never see your files.",
              },
              {
                emoji: "🤖",
                title: "AI-Powered Tools",
                desc: "Tools like the Gemini Watermark Remover use advanced algorithms (Reverse Alpha Blending, ONNX models) to solve real problems that users search for every day.",
              },
              {
                emoji: "💻",
                title: "Custom Web Apps",
                desc: "Full-stack web applications built with Next.js, React, and modern APIs. From MVPs to production-grade SaaS platforms.",
              },
              {
                emoji: "📱",
                title: "Mobile Apps",
                desc: "Cross-platform mobile apps for iOS and Android, built with React Native and backed by scalable cloud infrastructure.",
              },
            ].map((item) => (
              <div key={item.title} className="border border-border bg-card p-6 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Tools */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-foreground mb-4">Our Most-Used Free Tools</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            {[
              { href: "/tools/gemini-watermark-remover", label: "Gemini Watermark Remover", desc: "Remove the visible Gemini AI watermark from images and videos, in-browser." },
              { href: "/tools/bulk-gemini-watermark-remover", label: "Bulk Gemini Watermark Remover", desc: "Remove watermarks from many Gemini images at once, with ZIP download." },
              { href: "/tools/free-pdf-editor-no-signup", label: "Free PDF Editor (No Sign-up)", desc: "Edit, annotate, and sign PDFs directly in your browser." },
              { href: "/tools/qr-code-generator", label: "QR Code Generator", desc: "Generate QR codes for URLs, WiFi, vCards, and email — free, no watermark." },
              { href: "/tools", label: "View all tools →", desc: "" },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} className="flex items-start gap-3 p-4 border border-border hover:border-primary/40 hover:bg-muted/30 transition-all duration-200 group">
                <span className="text-primary font-bold text-xs mt-0.5 shrink-0">→</span>
                <span>
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.label}</span>
                  {tool.desc && <span className="text-xs text-muted-foreground ml-2">— {tool.desc}</span>}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Team / Founder */}
        <section className="mb-16 border border-border bg-card p-8">
          <h2 className="text-2xl font-extrabold text-foreground mb-6">The Team</h2>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0 text-2xl font-extrabold text-primary">N</div>
            <div>
              <p className="font-bold text-foreground text-lg">Neelesh Baghel</p>
              <p className="text-primary text-sm mb-3">Founder & Lead Developer</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Full-stack developer with a focus on building tools that solve real problems. EatBit started as a collection of utilities
                he built for his own projects and grew into a platform used by thousands of people monthly.
                Connect on{" "}
                <a href="https://www.linkedin.com/in/antrisk40/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:opacity-80">LinkedIn</a>.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-extrabold text-foreground mb-4">Work With Us</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            We build production-grade SaaS, AI tools, and mobile apps — just like this one.
            Fast, affordable, and backed by real engineering. Get a free quote today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-us" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-primary/20">
              Get a Free Quote
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border bg-background text-foreground font-bold text-sm hover:border-primary/50 transition-all">
              Our Services
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
