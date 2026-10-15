import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CANONICAL_TOOLS } from "@/lib/tools-catalog";

export const metadata: Metadata = {
  title: "Free Browser Tools for Images, PDFs & QR Codes | EatBit",
  description:
    "Use EatBit’s privacy-first image converter, PDF editor, QR generator, and Gemini watermark remover. Files stay on your device. Maintained as real products, not keyword pages.",
  alternates: { canonical: "https://eatbit.in/tools" },
};

const categories = ["Image", "PDF", "QR"] as const;

export default function ToolsHubPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Last reviewed 15 October 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Tools we actually maintain
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Each listing below is a distinct product with its own interface and code path.
            Conversion, PDF edits, and QR generation run in your browser — files are not uploaded
            to EatBit servers. We collapsed lookalike landing pages so you land on the real tool
            instead of a keyword wrapper.
          </p>
          <Button size="lg" className="rounded-none font-bold shadow-xl shadow-primary/20" asChild>
            <Link href="/tools/free-pdf-editor-no-signup">Open the PDF editor</Link>
          </Button>
        </div>

        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-border pb-2">
                {category} tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CANONICAL_TOOLS.filter((tool) => tool.category === category).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="group block bg-card border border-border p-6 rounded-2xl hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="text-3xl mb-4">{tool.icon}</div>
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-20 max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold text-foreground text-center">How these tools work</h2>
          <p>
            Image conversion uses the Canvas API (and heic2any for iPhone photos). PDF editing uses
            pdf.js for rendering and pdf-lib for export. QR codes are drawn with qrcode-generator in
            the page. That is why conversions start immediately and why we can say we do not receive
            the file contents.
          </p>
          <p>
            If you need a format pair such as HEIC to JPG or PNG to WebP, open the{" "}
            <Link href="/tools/image-converter" className="text-primary underline">
              image converter
            </Link>{" "}
            and set both dropdowns. WiFi, WhatsApp, vCard, email, and PDF codes live as tabs on the{" "}
            <Link href="/tools/qr-code-generator" className="text-primary underline">
              QR generator
            </Link>
            . Signing, annotating, and editing PDF text are tools inside the{" "}
            <Link href="/tools/free-pdf-editor-no-signup" className="text-primary underline">
              PDF editor
            </Link>
            .
          </p>
          <p>
            We keep this hub short on purpose. Guides with original write-ups live on the{" "}
            <Link href="/blogs" className="text-primary underline">
              blog
            </Link>
            — watermark detection, SynthID vs visible sparkles, privacy-first cropping, and how the
            PDF editor compares to upload-based products.
          </p>
        </section>
      </div>
    </div>
  );
}
