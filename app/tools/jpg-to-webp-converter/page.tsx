import { Metadata } from "next";
import ImageConverter from "../image-converter/ImageConverter";

export const metadata: Metadata = {
  title: "Free JPG to WebP Converter — Compress Images for the Web | EatBit",
  description: "Convert JPG to WebP free online. Reduce image file size by 25–35% for faster websites and better Core Web Vitals. Batch convert up to 20 files. No upload, no sign-up.",
  keywords: "jpg to webp converter free, jpeg to webp online, convert jpg to webp, jpg webp converter, compress jpg to webp, core web vitals image optimisation",
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Why should I convert JPG to WebP?", "acceptedAnswer": { "@type": "Answer", "text": "WebP images are 25–35% smaller than equivalent JPGs at the same visual quality. Smaller images load faster, which improves your website's Core Web Vitals scores (especially Largest Contentful Paint), reduces bandwidth costs and improves user experience on mobile." } },
    { "@type": "Question", "name": "Does every browser support WebP?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — as of 2024, WebP is supported by all major browsers: Chrome, Firefox, Safari (since iOS 14), Edge and Opera. Global browser support is over 96%. For the remaining 4%, you can serve JPG as a fallback using the HTML picture element." } },
    { "@type": "Question", "name": "How much smaller is WebP compared to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Google's research shows WebP is on average 25–34% smaller than JPEG at equivalent visual quality. For a 500 KB JPG, the WebP equivalent is typically 325–375 KB. The saving varies by image content — photos with lots of detail see the most benefit." } },
    { "@type": "Question", "name": "Will converting to WebP affect my Google rankings?", "acceptedAnswer": { "@type": "Answer", "text": "Positively. Page speed is a Google ranking factor and WebP images improve load times. Google's own PageSpeed Insights recommends serving images in WebP format. Faster pages rank better, especially on mobile." } },
    { "@type": "Question", "name": "How do I use WebP images on my website?", "acceptedAnswer": { "@type": "Answer", "text": "In Next.js and most modern frameworks, use the built-in Image component which serves WebP automatically. In plain HTML, use the picture element with a WebP source and a JPG fallback: <picture><source srcset='image.webp' type='image/webp'><img src='image.jpg' alt='...'></picture>" } },
    { "@type": "Question", "name": "Can I convert multiple JPG files to WebP at once?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Drop up to 20 JPG files onto the converter. All are converted simultaneously and can be downloaded individually or as a ZIP archive." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24">
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Why convert JPG to WebP for your website?</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p><strong className="text-foreground">WebP</strong> is the modern image format recommended by Google for websites. It achieves the same visual quality as JPG at <strong className="text-foreground">25–35% smaller file size</strong> — meaning your pages load faster, users see content sooner, and Google's PageSpeed scores improve.</p>
        <p>Google's <strong className="text-foreground">Core Web Vitals</strong> — which directly influence search rankings — include <em>Largest Contentful Paint (LCP)</em>, which measures how fast your main image loads. Switching from JPG to WebP is one of the quickest wins for LCP and overall performance.</p>
      </div>
    </section>
    <section className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[{ stat: "25–35%", label: "smaller than JPG" }, { stat: "96%+", label: "global browser support" }, { stat: "✅", label: "Google PageSpeed recommended" }, { stat: "Free", label: "forever, no watermark" }].map(s => (
          <div key={s.stat}><div className="text-3xl font-black text-primary mb-1">{s.stat}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
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

export default function JpgToWebpPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <ImageConverter defaultFrom="jpg" defaultTo="webp"
        heroTitle="Free JPG to WebP Converter — Compress Images for the Web"
        heroDesc="Convert JPG images to WebP and reduce file size by 25–35% for faster websites and better Google PageSpeed scores. Batch convert up to 20 files. Free, no sign-up, no upload."
        seoContent={SEO_CONTENT} />
    </>
  );
}
