import { Metadata } from "next";
import Image from "next/image";
import ImageConverter from "../image-converter/ImageConverter";

export const metadata: Metadata = {
  title: "Free PNG to WebP Converter — Smaller Files, Same Quality | EatBit",
  description: "Convert PNG to WebP free online. Reduce PNG file size by up to 50% while keeping transparency. Perfect for website optimisation. Batch convert up to 20 files. No upload, no sign-up.",
  keywords: "png to webp converter free, png to webp online, convert png to webp, png webp converter, compress png webp, webp transparency png, lossless png to webp",
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Does WebP support transparency like PNG?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. WebP supports an alpha channel (transparency) just like PNG. This makes it the ideal replacement for transparent PNGs on websites — you get the same transparency with significantly smaller file size." } },
    { "@type": "Question", "name": "How much smaller is WebP compared to PNG?", "acceptedAnswer": { "@type": "Answer", "text": "For photographic content, WebP is typically 25–35% smaller than PNG. For lossless WebP (which preserves transparency perfectly), files are still about 26% smaller than equivalent PNGs according to Google's research." } },
    { "@type": "Question", "name": "When should I use PNG to WebP instead of PNG to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Use PNG to WebP when your image has transparency that you want to preserve — logos, icons, product images with transparent backgrounds. WebP keeps the alpha channel; JPG does not support transparency at all." } },
    { "@type": "Question", "name": "Will transparent areas in my PNG remain transparent in WebP?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The converter preserves the alpha channel when converting from PNG to WebP. Transparent pixels remain transparent in the output file." } },
    { "@type": "Question", "name": "Is lossless WebP available?", "acceptedAnswer": { "@type": "Answer", "text": "This converter uses lossy WebP at your chosen quality setting (default 90%). At 90% quality, transparent PNG logos and icons look visually identical while being significantly smaller. For truly lossless WebP, use Squoosh.app or the cwebp command-line tool." } },
    { "@type": "Question", "name": "Can I convert multiple PNG files to WebP at once?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Drop up to 20 PNG files onto the converter. All are converted simultaneously in your browser." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24">
    <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border">
      <Image src="/images/png_to_webp.webp" alt="{metadata.title as string || 'Tool Illustration'}" width={1200} height={675} className="w-full h-auto object-cover" />
    </div>
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">PNG to WebP — smaller files with transparency</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p>Unlike JPG, <strong className="text-foreground">WebP fully supports transparency</strong> — making it the perfect modern replacement for PNG on websites. You get the transparent background your logo or icon needs, at a file size that is <strong className="text-foreground">25–50% smaller</strong> than the equivalent PNG.</p>
        <p>This is especially valuable for <strong className="text-foreground">e-commerce product images</strong> with white or transparent backgrounds, <strong className="text-foreground">logos</strong> used in headers and footers, and <strong className="text-foreground">UI icons</strong> in web apps — all cases where transparency is non-negotiable but performance matters.</p>
      </div>
    </section>
    <section className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/50"><th className="text-left px-4 py-3 font-semibold">Feature</th><th className="text-left px-4 py-3 font-semibold">PNG</th><th className="text-left px-4 py-3 font-semibold">WebP</th><th className="text-left px-4 py-3 font-semibold">JPG</th></tr></thead>
          <tbody className="divide-y divide-border">
            {[
              ["Transparency", "✅ Yes", "✅ Yes", "❌ No"],
              ["Compression", "Lossless (large)", "Lossy or lossless", "Lossy (small)"],
              ["Typical file size", "Large", "Small (−25–50%)", "Small"],
              ["Browser support", "✅ Universal", "✅ 96%+", "✅ Universal"],
              ["Best for web", "⚠️ Only if needed", "✅ Best choice", "Photos only"],
            ].map(r => <tr key={r[0]}><td className="px-4 py-3 font-medium text-foreground">{r[0]}</td><td className="px-4 py-3 text-muted-foreground">{r[1]}</td><td className="px-4 py-3 text-primary font-semibold">{r[2]}</td><td className="px-4 py-3 text-muted-foreground">{r[3]}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Frequently asked questions</h2>
      <div className="space-y-3">
        {FAQ_JSON_LD.mainEntity.map((f, i) => (
          <details key={i} className="group border border-border rounded-xl bg-card" open={i === 0}>
            <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-sm marker:content-none">{f.name}<svg className="ml-4 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></summary>
            <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{f.acceptedAnswer.text}</div>
          </details>
        ))}
      </div>
    </section>
  </div>
);

export default function PngToWebpPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <ImageConverter defaultFrom="png" defaultTo="webp"
        heroTitle="Free PNG to WebP Converter — Smaller Files, Transparency Kept"
        heroDesc="Convert PNG images to WebP and reduce file size by up to 50% while keeping transparency. Perfect for logos, icons and product images on websites. Free, no sign-up, no upload."
        seoContent={SEO_CONTENT} />
    </>
  );
}
