import { Metadata } from "next";
import Image from "next/image";
import ImageConverter from "../image-converter/ImageConverter";

export const metadata: Metadata = {
  title: "Free HEIC to JPG Converter — Open iPhone Photos Online | EatBit",
  description: "Convert HEIC photos from iPhone to JPG free online. Open HEIC files on Windows, Android and any device. Batch convert up to 20 files. 100% browser-based — photos never uploaded. No sign-up.",
  keywords: "heic to jpg converter free, convert heic to jpeg online, heic to jpg, open heic file windows, heic converter free, iphone heic to jpg, heic to jpeg free online no upload",
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a HEIC file?", "acceptedAnswer": { "@type": "Answer", "text": "HEIC (High Efficiency Image Container) is the default photo format used by iPhones and iPads since iOS 11. It is based on the HEIF standard and produces photos that are about 50% smaller than JPG at the same quality. The problem is that Windows, Android and many apps cannot open HEIC files natively." } },
    { "@type": "Question", "name": "Why can't I open HEIC photos on Windows?", "acceptedAnswer": { "@type": "Answer", "text": "Windows does not include a HEIC decoder by default. Windows 10 and 11 can open HEIC if you install the HEIF Image Extensions from the Microsoft Store (free). Alternatively, convert to JPG using this free online tool — the result opens on any device or app." } },
    { "@type": "Question", "name": "How do I stop my iPhone from saving photos as HEIC?", "acceptedAnswer": { "@type": "Answer", "text": "Go to Settings > Camera > Formats and select 'Most Compatible'. This saves new photos as JPG instead of HEIC. Photos already taken will remain in HEIC format — use this converter to convert them." } },
    { "@type": "Question", "name": "Does the HEIC to JPG conversion keep EXIF data?", "acceptedAnswer": { "@type": "Answer", "text": "EXIF data (camera settings, GPS location, timestamp) is not preserved in this browser-based converter. If you need to keep EXIF data, use a desktop tool like XnView or the Windows HEIC codec with a photo editor." } },
    { "@type": "Question", "name": "Is my iPhone photo uploaded to a server?", "acceptedAnswer": { "@type": "Answer", "text": "No. The HEIC decoder (heic2any) runs entirely inside your browser using JavaScript. Your photos are never sent to any server, ensuring complete privacy — important since iPhone photos often contain location data." } },
    { "@type": "Question", "name": "Can I convert multiple HEIC files at once?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Drop up to 20 HEIC files onto the converter. They are all decoded and converted simultaneously in your browser. Download them individually or as a single ZIP archive." } },
    { "@type": "Question", "name": "Why are my AirDropped iPhone photos opening as HEIC on Mac?", "acceptedAnswer": { "@type": "Answer", "text": "When you AirDrop photos from iPhone to Mac, they transfer in HEIC format by default. Mac's Preview app can open HEIC natively (macOS High Sierra and later). If you need JPG for compatibility with other apps, convert using this tool or use Preview > File > Export as JPEG." } },
    { "@type": "Question", "name": "What quality does the HEIC to JPG conversion produce?", "acceptedAnswer": { "@type": "Answer", "text": "The default quality is 90%, which is visually indistinguishable from the HEIC source for most photos. Use the quality slider to go up to 100% for maximum fidelity or down to 75% for the smallest JPG file size." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24">
    <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border">
      <Image src="/images/heic_jpg.webp" alt="{metadata.title as string || 'Tool Illustration'}" width={1200} height={675} className="w-full h-auto object-cover" />
    </div>
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">What is HEIC and why can&apos;t I open it?</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p><strong className="text-foreground">HEIC</strong> (High Efficiency Image Container) is Apple's default photo format for iPhone and iPad, introduced in iOS 11. It stores photos at <strong className="text-foreground">roughly half the file size of JPG</strong> with the same visual quality — great for saving storage on your phone.</p>
        <p>The problem: <strong className="text-foreground">Windows, Android, and most apps don't support HEIC</strong> natively. When you share an iPhone photo by email or messaging, or copy it to a Windows PC, you often get a file that nothing can open. Converting to JPG gives you a universally compatible image in seconds.</p>
        <p>This converter uses the open-source <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">heic2any</code> library, which runs entirely in your browser. <strong className="text-foreground">Your photos never leave your device</strong> — critical since iPhone photos often contain GPS location data.</p>
      </div>
    </section>
    <section className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">HEIC support across platforms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { platform: "iPhone / iPad", support: "✅ Native", note: "HEIC is taken here by default" },
          { platform: "Mac (macOS High Sierra+)", support: "✅ Native", note: "Preview opens HEIC without conversion" },
          { platform: "Windows 10 / 11", support: "⚠️ With extension", note: "Needs free HEIF codec from Microsoft Store" },
          { platform: "Windows 7 / 8", support: "❌ No support", note: "Convert to JPG for compatibility" },
          { platform: "Android", support: "⚠️ Varies", note: "Some apps support it, most don't" },
          { platform: "WhatsApp / Telegram", support: "✅ Usually", note: "May auto-convert on send" },
          { platform: "Microsoft Word / PowerPoint", support: "❌ No", note: "Convert to JPG first" },
          { platform: "Google Photos", support: "✅ Yes", note: "Opens and converts on upload" },
        ].map(r => (
          <div key={r.platform} className="flex items-start gap-3 p-3 bg-muted/40 rounded-xl">
            <span className="text-sm shrink-0 font-mono">{r.support}</span>
            <div><div className="text-sm font-medium text-foreground">{r.platform}</div><div className="text-xs text-muted-foreground">{r.note}</div></div>
          </div>
        ))}
      </div>
    </section>
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center">How to convert HEIC to JPG</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { step: "1", title: "Find your HEIC photos", body: "Copy iPhone photos to your computer via USB, iCloud Drive, AirDrop or email. They will have a .heic or .heif extension." },
          { step: "2", title: "Drop them above", body: "Drag up to 20 HEIC files onto the converter. Each photo is decoded and converted to JPG entirely in your browser." },
          { step: "3", title: "Download the JPGs", body: "Click Download next to each photo, or Download all to get a ZIP. Share, print or open the JPGs anywhere." },
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

export default function HeicToJpgPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <ImageConverter defaultFrom="heic" defaultTo="jpg"
        heroTitle="Free HEIC to JPG Converter — Open iPhone Photos Anywhere"
        heroDesc="Convert HEIC photos from your iPhone or iPad to JPG instantly. Open them on Windows, Android, and any app. Batch convert up to 20 photos. Your photos never leave your browser. Free, no sign-up."
        seoContent={SEO_CONTENT} />
    </>
  );
}
