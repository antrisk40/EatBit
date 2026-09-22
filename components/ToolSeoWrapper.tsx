import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ToolSeoWrapperProps {
  title: string;
  description: React.ReactNode;
  imageUrl?: string;
  howToSteps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export function ToolSeoWrapper({ title, description, imageUrl, howToSteps, faqs }: ToolSeoWrapperProps) {
  return (
    <div className="mt-20 space-y-16 border-t border-border pt-16 pb-24 px-4 max-w-5xl mx-auto">
      {imageUrl && (
        <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border">
          <Image src={imageUrl} alt={title} width={1200} height={675} className="w-full h-auto object-cover" />
        </div>
      )}
      
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black mb-6 text-foreground tracking-tight">
          {title}
        </h2>
        <div className="text-muted-foreground leading-relaxed space-y-4 text-base">
          {description}
        </div>
      </section>

      {/* Feature highlights grid */}
      <section className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
        <h2 className="text-2xl font-bold mb-8 text-center text-foreground">
          Why use EatBit PDF Editor?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-foreground text-lg mb-2">100% Secure & Local</h3>
            <p className="text-sm text-muted-foreground">Files never leave your browser.</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-foreground text-lg mb-2">No Sign-Up Needed</h3>
            <p className="text-sm text-muted-foreground">Start editing immediately.</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
            <div className="text-3xl mb-3">💸</div>
            <h3 className="font-bold text-foreground text-lg mb-2">Completely Free</h3>
            <p className="text-sm text-muted-foreground">No watermarks or hidden fees.</p>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">
          How to use this tool
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howToSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center mb-4">
                {idx + 1}
              </div>
              <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-border rounded-2xl bg-card transition-all"
                open={i === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-foreground text-sm sm:text-base marker:content-none select-none">
                  {faq.question}
                  <svg
                    className="ml-4 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/40 pt-3">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      <section className="max-w-4xl mx-auto text-center border-t border-border pt-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Explore Related PDF Tools</h2>
          <div className="flex flex-wrap justify-center gap-4">
             <Link href="/tools/edit-pdf-text-online" className="px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">Edit PDF</Link>
             <Link href="/tools/merge-and-split-pdf" className="px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">Merge PDF</Link>
             <Link href="/tools/sign-pdf-online" className="px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">Sign PDF</Link>
             <Link href="/tools/add-text-to-pdf" className="px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">Add Text to PDF</Link>
          </div>
      </section>
    </div>
  );
}
