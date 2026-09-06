import { Metadata } from "next";
import BundleClient from "./BundleClient";

export const metadata: Metadata = {
  title: "PDF Merger Free No Sign Up — Split & Bundle Online | EatBit",
  description: "Merge multiple PDFs, drag and drop to reorder pages, and split into multiple files. 100% browser-based. Your PDFs are never uploaded to any server. Free, no sign-up.",
  keywords: "pdf merger free no sign up, merge pdf free, split pdf, combine pdfs, reorder pdf pages, pdf tools free, browser based pdf editor, privacy first pdf tools",
  openGraph: {
    title: "PDF Merger Free No Sign Up — Split & Bundle Online",
    description: "Merge, split, and reorder PDF pages instantly in your browser. Complete privacy — your files never leave your device. Free, no sign-up.",
  }
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EatBit PDF Bundle Tool",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any (runs in browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "Free browser-based PDF merger and splitter. Drag and drop pages to reorder, mark splits, and combine multiple PDFs. No uploads, no sign-up.",
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Are my PDFs uploaded to your servers?", "acceptedAnswer": { "@type": "Answer", "text": "No. The entire PDF merging, splitting, and rendering process happens locally in your web browser using JavaScript (specifically pdf-lib). Your files are never uploaded, sent, or saved to any external server." } },
    { "@type": "Question", "name": "How do I split a PDF?", "acceptedAnswer": { "@type": "Answer", "text": "Upload your PDF. You will see a grid of all pages. Hover between any two pages and click the '✂' icon to mark a split. When you click Export, a separate PDF file will be downloaded for each split segment." } },
    { "@type": "Question", "name": "How do I merge multiple PDFs?", "acceptedAnswer": { "@type": "Answer", "text": "Click 'Add more files' or drop multiple PDFs into the dropzone at once. All pages from all uploaded PDFs will appear in the grid. You can drag and drop the pages to mix them into whatever order you want, then export as a single bundled PDF." } },
    { "@type": "Question", "name": "Can I remove specific pages from a PDF?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Hover over any page thumbnail and click the '×' button to remove that page from your bundle before exporting." } },
    { "@type": "Question", "name": "Why is my browser blocking the download of split PDFs?", "acceptedAnswer": { "@type": "Answer", "text": "When you split a PDF into multiple segments, the tool triggers multiple file downloads at the same time. Some browsers block this as a security measure. Look for a pop-up blocker icon in your URL bar and allow multiple downloads from this site." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24">
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Merge, Split, and Reorder PDFs — Privately</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p>Combining documents or extracting specific pages shouldn't require uploading sensitive information to a random server. That's why we built this <strong className="text-foreground">client-side PDF Bundle tool</strong>. Everything happens right here in your browser.</p>
        <p>Whether you're compiling tax documents, removing a blank page from a scan, or splitting a large manual into chapters, our tool gives you full visual control with drag-and-drop simplicity, all without compromising your data privacy.</p>
      </div>
    </section>
    
    <section className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Features at a glance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-3xl mb-3">🔄</div>
          <h3 className="font-bold text-foreground mb-1">Merge PDFs</h3>
          <p className="text-sm text-muted-foreground">Drop multiple files and combine them into one seamless document.</p>
        </div>
        <div>
          <div className="text-3xl mb-3">✂️</div>
          <h3 className="font-bold text-foreground mb-1">Split PDFs</h3>
          <p className="text-sm text-muted-foreground">Insert split markers between pages to export multiple smaller PDFs at once.</p>
        </div>
        <div>
          <div className="text-3xl mb-3">🖐️</div>
          <h3 className="font-bold text-foreground mb-1">Drag & Drop</h3>
          <p className="text-sm text-muted-foreground">Visually rearrange pages or remove unwanted ones before exporting.</p>
        </div>
      </div>
    </section>

    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Frequently asked questions</h2>
      <div className="space-y-3">
        {FAQ_JSON_LD.mainEntity.map((f, i) => (
          <details key={i} className="group border border-border rounded-xl bg-card" open={i === 0}>
            <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-sm marker:content-none">
              {f.name}
              <svg className="ml-4 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{f.acceptedAnswer.text}</div>
          </details>
        ))}
      </div>
    </section>
  </div>
);

export default function BundlePdfPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <div className="pt-8">
        <BundleClient />
        {SEO_CONTENT}
      </div>
    </>
  );
}
