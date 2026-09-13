import { Metadata } from "next";
import Image from "next/image";
import ImageConverter from "../image-converter/ImageConverter";

export const metadata: Metadata = {
  title: "Free JPG to PNG Converter — Convert JPEG to PNG Online | EatBit",
  description: "Convert JPG to PNG free online. Add transparency, improve quality for logos and graphics. Batch convert up to 20 files. 100% browser-based — images never uploaded. No sign-up.",
  keywords: "jpg to png converter free, jpeg to png online, convert jpg to png, jpg to png free, jpeg to png converter, jpg png converter online no upload",
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Why convert JPG to PNG?", "acceptedAnswer": { "@type": "Answer", "text": "PNG supports transparency (alpha channel) while JPG does not. Converting to PNG is useful when you need a transparent background for a logo, icon or graphic. PNG is also lossless, so there is no additional quality loss on conversion from JPG, though the original JPG compression artefacts are preserved." } },
    { "@type": "Question", "name": "Does converting JPG to PNG improve quality?", "acceptedAnswer": { "@type": "Answer", "text": "No. JPG is a lossy format and compression artefacts are baked into the pixel data. Converting to PNG saves those pixels losslessly, but does not restore lost detail. The result looks identical to the JPG but is now in a lossless container." } },
    { "@type": "Question", "name": "Will the PNG file be larger than the JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, usually significantly larger. PNG uses lossless compression so photos typically produce 3–5x larger files than equivalent JPGs. For photographic images, JPG is the better format for sharing. PNG is best for logos, icons, screenshots and images with text." } },
    { "@type": "Question", "name": "Can I convert multiple JPG files to PNG at once?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Drag and drop up to 20 JPG files onto the drop zone. All files are converted simultaneously in your browser and you can download them individually or as a single ZIP file." } },
    { "@type": "Question", "name": "Are my images uploaded to a server?", "acceptedAnswer": { "@type": "Answer", "text": "No. This converter runs entirely in your browser using the Canvas API. Your images never leave your device and are never seen by any server." } },
    { "@type": "Question", "name": "What is the difference between JPG and JPEG?", "acceptedAnswer": { "@type": "Answer", "text": "Nothing — they are the same format. JPEG (Joint Photographic Experts Group) is the full name; JPG is the shortened extension used on older Windows systems that required 3-character extensions. Both .jpg and .jpeg files are identical." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24">
    <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border">
      <Image src="/images/jpg_to_png.webp" alt="{metadata.title as string || 'Tool Illustration'}" width={1200} height={675} className="w-full h-auto object-cover" />
    </div>
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Why convert JPG to PNG?</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p>The most common reason to convert <strong className="text-foreground">JPG to PNG</strong> is to gain <strong className="text-foreground">transparency support</strong>. JPG does not support an alpha (transparency) channel — backgrounds are always opaque. PNG supports full transparency, making it the right choice for logos, icons, stickers and any image that needs to sit on a coloured background without a white box around it.</p>
        <p>PNG is also a <strong className="text-foreground">lossless format</strong>, meaning no data is discarded during compression. Editing and re-saving a PNG never degrades quality, unlike JPG which loses detail every time it is resaved.</p>
      </div>
    </section>
    <section className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">JPG vs PNG — which to use?</h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/50"><th className="text-left px-4 py-3 font-semibold">Feature</th><th className="text-left px-4 py-3 font-semibold">JPG</th><th className="text-left px-4 py-3 font-semibold">PNG</th></tr></thead>
          <tbody className="divide-y divide-border">
            {[
              ["Transparency", "❌ No", "✅ Yes"],
              ["Compression", "Lossy (smaller files)", "Lossless (larger files)"],
              ["Best for", "Photos, social media", "Logos, icons, screenshots"],
              ["Editing safe", "❌ Degrades each save", "✅ No quality loss"],
              ["Browser support", "✅ Universal", "✅ Universal"],
            ].map(r => <tr key={r[0]}><td className="px-4 py-3 font-medium text-foreground">{r[0]}</td><td className="px-4 py-3 text-muted-foreground">{r[1]}</td><td className="px-4 py-3 text-muted-foreground">{r[2]}</td></tr>)}
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

export default function JpgToPngPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <ImageConverter defaultFrom="jpg" defaultTo="png"
        heroTitle="Free JPG to PNG Converter — No Upload Required"
        heroDesc="Convert JPG images to PNG format instantly in your browser. Add transparency support, get lossless quality, batch convert up to 20 files. Free, no sign-up, images never uploaded."
        seoContent={SEO_CONTENT} />
    </>
  );
}
