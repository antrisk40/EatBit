import { Metadata } from "next";
import ImageConverter from "../image-converter/ImageConverter";

export const metadata: Metadata = {
  title: "Free WebP to JPG Converter — Open Chrome WebP Images | EatBit",
  description: "Convert WebP to JPG free online. Open WebP images saved by Chrome on any device. Batch convert up to 20 files. 100% browser-based — images never uploaded. No sign-up.",
  keywords: "webp to jpg converter, convert webp to jpeg free, webp to jpg online, webp to jpeg converter, open webp file, chrome webp to jpg, webp converter free",
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a WebP file and why can't I open it?", "acceptedAnswer": { "@type": "Answer", "text": "WebP is an image format created by Google. Chrome saves screenshots and downloaded images as WebP by default. While newer apps support it, many older apps, email clients, Windows Photo Viewer (pre-Windows 10), and some social platforms do not. Converting to JPG gives you universal compatibility." } },
    { "@type": "Question", "name": "Why does Chrome save images as WebP?", "acceptedAnswer": { "@type": "Answer", "text": "Websites increasingly serve images in WebP format because it is 25–35% smaller than equivalent JPG at the same visual quality. When you right-click and save an image in Chrome, it saves it in whatever format the website served — which is often WebP. The file gets a .webp extension that many apps cannot open." } },
    { "@type": "Question", "name": "How do I convert a WebP file to JPG on Windows?", "acceptedAnswer": { "@type": "Answer", "text": "Use this free converter — drag your .webp file onto the drop zone above, wait one second for it to convert, then click Download. No software installation required. Alternatively, you can open the .webp file in Microsoft Paint (Windows 10+) and Save As JPEG." } },
    { "@type": "Question", "name": "How do I convert WebP to JPG on Mac?", "acceptedAnswer": { "@type": "Answer", "text": "On Mac, open the .webp file in Preview (it supports WebP natively), then go to File > Export and choose JPEG. Alternatively, use this free online converter — drag the file, download the JPG. No software needed." } },
    { "@type": "Question", "name": "Will the JPG quality be the same as the WebP?", "acceptedAnswer": { "@type": "Answer", "text": "At 90% quality the JPG is visually indistinguishable from the WebP source. The converter default is 90%, which gives the best balance of quality and file size. Use the quality slider to go higher (up to 100%) if you need maximum fidelity." } },
    { "@type": "Question", "name": "Can I convert multiple WebP files to JPG at once?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Drop up to 20 WebP files onto the converter at once. All files are converted simultaneously and you can download them individually or as a single ZIP." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24">
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Why can&apos;t I open WebP files?</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p><strong className="text-foreground">WebP</strong> is Google's modern image format. It delivers images that are <strong className="text-foreground">25–35% smaller than JPG</strong> at the same visual quality, which is why websites and Chrome use it. The problem is that many apps, devices and platforms still don't support it.</p>
        <p>When you <strong className="text-foreground">right-click and save an image in Chrome</strong>, it saves whatever format the website served — increasingly WebP. Then you try to open it in Windows Photo Viewer, WhatsApp, Word, or send it by email, and nothing works. Converting to JPG takes one second and fixes the problem permanently.</p>
      </div>
    </section>
    <section className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Apps that don&apos;t support WebP</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["Windows Photo Viewer (pre-Win10)", "WhatsApp (older versions)", "Microsoft Word / PowerPoint", "Some email clients", "Adobe Photoshop (without plugin)", "Older Android gallery apps", "Many social media upload tools", "Print shop upload portals"].map(app => (
          <div key={app} className="flex gap-2 items-start text-xs text-muted-foreground p-3 bg-muted/40 rounded-xl">
            <span className="text-destructive shrink-0">✗</span><span>{app}</span>
          </div>
        ))}
      </div>
    </section>
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center">How to convert WebP to JPG — step by step</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { step: "1", title: "Find your WebP file", body: "It's usually in your Downloads folder after saving an image from Chrome. It will have a .webp extension." },
          { step: "2", title: "Drop it above", body: "Drag the file onto the drop zone, or click to browse. Conversion starts instantly in your browser." },
          { step: "3", title: "Download as JPG", body: "Click Download next to your file. Open the JPG in any app — it works everywhere." },
        ].map(s => (
          <div key={s.step} className="p-6 rounded-2xl bg-card border border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center mb-4">{s.step}</div>
            <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
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

export default function WebpToJpgPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <ImageConverter defaultFrom="webp" defaultTo="jpg"
        heroTitle="Free WebP to JPG Converter — Open Chrome WebP Images"
        heroDesc="Convert WebP images saved by Chrome to JPG instantly. Works on Windows, Mac, iPhone and Android. Batch convert up to 20 files. Free, no sign-up, images never uploaded."
        seoContent={SEO_CONTENT} />
    </>
  );
}
