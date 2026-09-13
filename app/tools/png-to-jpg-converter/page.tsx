import { Metadata } from "next";
import Image from "next/image";
import ImageConverter from "../image-converter/ImageConverter";

export const metadata: Metadata = {
  title: "Free PNG to JPG Converter — Reduce File Size Online | EatBit",
  description: "Convert PNG to JPG free online. Reduce file size up to 80%, remove transparency, compress for email and social media. Batch convert up to 20 files. Browser-based, images never uploaded.",
  keywords: "png to jpg converter free, png to jpeg online, convert png to jpg, png jpg converter, png to jpeg free, compress png to jpg",
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Why convert PNG to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "The main reason is file size. A photographic PNG is typically 3–10x larger than the equivalent JPG at 90% quality. Converting reduces file size for faster email attachments, website loading and social media uploads. JPG is also universally accepted by every platform and app." } },
    { "@type": "Question", "name": "What happens to transparency when converting PNG to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "JPG does not support transparency, so transparent areas are filled with white by default. If your PNG has a transparent background and you need a different fill colour, consider editing the image before converting." } },
    { "@type": "Question", "name": "How much smaller will the JPG file be?", "acceptedAnswer": { "@type": "Answer", "text": "For photographs and complex images, a JPG at 90% quality is typically 5–10x smaller than the equivalent PNG. For simple graphics with large flat colour areas, the difference is smaller. The file size comparison is shown for each file after conversion." } },
    { "@type": "Question", "name": "Does converting PNG to JPG reduce quality?", "acceptedAnswer": { "@type": "Answer", "text": "At 90% quality the visual difference is imperceptible to the human eye for most images. At 75% quality the file is much smaller but fine details like text or sharp edges may show slight artefacts. Use the quality slider to balance size and quality." } },
    { "@type": "Question", "name": "Can I convert PNG files with transparency to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Transparent areas are filled with white automatically. If your logo or image has a transparent background and you want it on a specific colour, edit it in a tool like Canva or GIMP first, then convert to JPG here." } },
    { "@type": "Question", "name": "Is batch PNG to JPG conversion supported?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Drag and drop up to 20 PNG files. All are converted simultaneously and you can download individually or as a ZIP." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24">
    <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border">
      <Image src="/images/png_to_jpeg.webp" alt="{metadata.title as string || 'Tool Illustration'}" width={1200} height={675} className="w-full h-auto object-cover" />
    </div>
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Why convert PNG to JPG?</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p>Converting <strong className="text-foreground">PNG to JPG</strong> is the fastest way to dramatically reduce image file size. PNG uses lossless compression — great for quality, but the files are large. JPG uses lossy compression tuned for photographs, producing files that are <strong className="text-foreground">5–10x smaller</strong> at visually identical quality.</p>
        <p>This matters for <strong className="text-foreground">email attachments</strong> (many clients have a 10–25 MB limit), <strong className="text-foreground">social media uploads</strong> (faster and no auto-recompression artefacts when you upload an already-compressed JPG), and <strong className="text-foreground">website performance</strong> (smaller images = faster page loads = better Core Web Vitals scores).</p>
      </div>
    </section>
    <section className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[{ stat: "5–10×", label: "typical file size reduction" }, { stat: "90%", label: "recommended quality setting" }, { stat: "< 1s", label: "per image conversion time" }, { stat: "20", label: "max files per batch" }].map(s => (
          <div key={s.stat}><div className="text-3xl font-black text-primary mb-1">{s.stat}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
        ))}
      </div>
    </section>
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center">Best uses for PNG → JPG conversion</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {[
          { icon: "📧", title: "Email Attachments", body: "Reduce screenshots and images to under 1 MB for clean, fast email attachments that don't hit size limits." },
          { icon: "📱", title: "Social Media", body: "Instagram, Facebook and WhatsApp re-compress large PNGs. Upload an already-optimised JPG for the best result." },
          { icon: "🌐", title: "Website Images", body: "Replace large product or blog images with optimised JPGs to improve page load speed and Core Web Vitals scores." },
          { icon: "📂", title: "Storage Savings", body: "Batch convert a folder of screenshots or exports to free up gigabytes of disk or cloud storage." },
          { icon: "🖨️", title: "Print Submission", body: "Many online print services prefer JPG. Convert your PNG design at 95–100% quality for lossless-equivalent print output." },
          { icon: "📊", title: "Presentation Slides", body: "Large PNGs slow down PowerPoint and Keynote files. Convert to JPG to keep presentations fast and lightweight." },
        ].map(c => (
          <div key={c.title} className="p-5 bg-card border border-border rounded-2xl flex gap-4">
            <div className="text-2xl shrink-0">{c.icon}</div>
            <div><h3 className="font-semibold text-foreground mb-1.5 text-sm">{c.title}</h3><p className="text-xs text-muted-foreground leading-relaxed">{c.body}</p></div>
          </div>
        ))}
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

export default function PngToJpgPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <ImageConverter defaultFrom="png" defaultTo="jpg"
        heroTitle="Free PNG to JPG Converter — Reduce File Size Instantly"
        heroDesc="Convert PNG images to JPG and reduce file size by up to 80%. Batch convert up to 20 files at once. Control quality with the slider. Free, no sign-up, images never leave your browser."
        seoContent={SEO_CONTENT} />
    </>
  );
}
