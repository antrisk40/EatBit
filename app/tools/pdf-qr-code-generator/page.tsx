import { Metadata } from "next";
import QRCoder from "../qr-code-generator/QRCoder";

export const metadata: Metadata = {
  title: "Free PDF QR Code Generator — Link a PDF to a QR Code | EatBit",
  description: "Create a QR code that links directly to any PDF — restaurant menus, product brochures, syllabuses, manuals and more. Paste your Google Drive or Dropbox PDF URL and generate instantly. Free, no sign-up, download PNG, JPG or SVG.",
  keywords: "qr code for pdf file, menu qr code generator free, pdf qr code generator, link pdf to qr code, restaurant menu qr code, digital menu qr code, google drive pdf qr code, dropbox pdf qr code, brochure qr code, syllabus qr code",
  openGraph: {
    title: "Free PDF QR Code Generator — Link a PDF to a QR Code",
    description: "Turn any hosted PDF into a scannable QR code. Perfect for restaurant menus, brochures and documents. Free, no sign-up, download PNG/SVG.",
  }
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How do I create a QR code for a PDF?", "acceptedAnswer": { "@type": "Answer", "text": "Upload your PDF to a file host (Google Drive, Dropbox, or any web server), get a public sharing link, paste it into the PDF tab above, and click generate. When scanned, the QR code opens that link and the PDF loads in the phone browser." } },
    { "@type": "Question", "name": "How do I get a shareable link for a PDF on Google Drive?", "acceptedAnswer": { "@type": "Answer", "text": "Upload the PDF to Google Drive, right-click it and choose Share. Set access to Anyone with the link and copy the URL. Paste it into the PDF tab above." } },
    { "@type": "Question", "name": "How do I get a shareable link for a PDF on Dropbox?", "acceptedAnswer": { "@type": "Answer", "text": "Upload the PDF to Dropbox, hover over it and click Share, then copy the shared link. Change the end of the URL from ?dl=0 to ?raw=1 so the browser opens the PDF directly rather than prompting a download. Paste that URL into the generator." } },
    { "@type": "Question", "name": "What is the best use for a PDF QR code?", "acceptedAnswer": { "@type": "Answer", "text": "The most popular use is digital restaurant menus — print the QR code on a table card and update the PDF file on your host whenever the menu changes, with no need to reprint the QR code. Other common uses include product brochures, course syllabuses, event programmes and instruction manuals." } },
    { "@type": "Question", "name": "Will the QR code still work if I update the PDF?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, if you replace the file at the same URL. On Google Drive, you can right-click the file and choose Manage versions > Upload new version — the sharing link stays identical and all printed QR codes keep working. On Dropbox, upload a new file with the same filename to the same folder." } },
    { "@type": "Question", "name": "Can I password-protect my PDF and still use a QR code?", "acceptedAnswer": { "@type": "Answer", "text": "Yes and no. The QR code will open the PDF link, but if the PDF itself requires a password the user will be prompted to enter it in their browser or PDF viewer. For public-facing use cases like menus, it is better to use an unprotected PDF." } },
    { "@type": "Question", "name": "Does the PDF open in the browser or download to the phone?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on the hosting service and the phone's settings. Google Drive opens a preview in the browser. A direct file URL (.pdf) may download automatically. For best results, use a Google Drive or OneDrive preview link, which opens cleanly in mobile browsers without triggering a download." } },
    { "@type": "Question", "name": "Is there a file size limit for the PDF?", "acceptedAnswer": { "@type": "Answer", "text": "There is no file size limit imposed by the QR code itself — it simply encodes a URL. The limit depends on your hosting service. Google Drive allows up to 5 TB per file; Dropbox allows up to 50 GB. However, very large PDFs (over 20 MB) may load slowly on mobile data, so optimise your PDF for web where possible." } },
    { "@type": "Question", "name": "What size should the PDF QR code be on a table card?", "acceptedAnswer": { "@type": "Answer", "text": "For a standard A5 or 148×148 mm table card, a 50×50 mm QR code works well. For a DL flyer (⅓ A4), use at least 40×40 mm. Download the SVG format for the crispest print at any size." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-20 border-t border-border pt-16 pb-24">

    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">How to link a PDF to a QR code</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p>A <strong className="text-foreground">PDF QR code</strong> is simply a URL QR code that points to a publicly hosted PDF file. When scanned, the phone opens the link and the PDF loads in the browser or the phone's built-in PDF viewer. No app, no login, no friction.</p>
        <p>The key is that the PDF must have a <strong className="text-foreground">publicly accessible URL</strong> — either from a cloud storage service like Google Drive, Dropbox, or OneDrive, or from a web server. The QR code itself is generated entirely in your browser and is just an image that encodes that URL.</p>
        <p>The most powerful feature: <strong className="text-foreground">if you replace the PDF at the same URL, all existing QR codes still work</strong>. This is why a PDF QR code is the ideal digital menu solution — update your menu daily, your printed table codes never need reprinting.</p>
      </div>
    </section>

    <section className="bg-card border border-border rounded-2xl p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { stat: "0", label: "reprints needed when PDF updates" },
          { stat: "< 1 min", label: "to generate & download" },
          { stat: "∞", label: "scans — no expiry" },
          { stat: "Free", label: "forever, no watermark" },
        ].map(s => (
          <div key={s.stat}>
            <div className="text-3xl font-black text-primary mb-1">{s.stat}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-3xl font-bold mb-10 text-center">Step-by-step: get your PDF URL from popular hosts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          {
            host: "Google Drive",
            icon: "🟡",
            steps: [
              "Upload your PDF to Google Drive",
              "Right-click the file → Share",
              "Set access to 'Anyone with the link'",
              "Click 'Copy link'",
              "Paste the link into the PDF tab above",
            ]
          },
          {
            host: "Dropbox",
            icon: "🔵",
            steps: [
              "Upload your PDF to Dropbox",
              "Hover over the file → click Share",
              "Copy the shared link",
              "Change ?dl=0 to ?raw=1 at the end",
              "Paste the modified link above",
            ]
          },
          {
            host: "OneDrive / SharePoint",
            icon: "🔷",
            steps: [
              "Upload your PDF to OneDrive",
              "Click the Share button → 'Anyone with link can view'",
              "Copy the link",
              "Paste it into the PDF tab above",
              "Test by scanning the generated QR",
            ]
          },
        ].map(h => (
          <div key={h.host} className="p-6 bg-card border border-border rounded-2xl">
            <div className="text-2xl mb-2">{h.icon}</div>
            <h3 className="font-bold text-foreground mb-4">{h.host}</h3>
            <ol className="space-y-2">
              {h.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-3xl font-bold mb-10 text-center">Popular uses for PDF QR codes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {[
          { icon: "🍽️", title: "Restaurant Menus", body: "The #1 use case globally. Print on table cards, menu covers or window stickers. Update the Google Drive PDF whenever the menu changes — no reprinting ever." },
          { icon: "📋", title: "Product Brochures", body: "Add a QR to product packaging or display stands. Customers scan to view the full specification, colour range or model comparison PDF." },
          { icon: "📚", title: "Course Syllabuses", body: "Print on the first handout. Students scan to access the always-current syllabus — no need to redistribute paper every time it changes." },
          { icon: "🎟️", title: "Event Programmes", body: "Put on tickets, lanyards or entrance signs. Attendees scan for the full schedule, speaker bios and venue map without a printed booklet." },
          { icon: "🏠", title: "Property Listings", body: "Add to estate agent boards and window cards. Buyers scan for the full floor plan PDF, EPC certificate and detailed spec sheet." },
          { icon: "🔧", title: "Instruction Manuals", body: "Stick on products instead of printing bulky manuals. Customers scan for the PDF manual in their language — saves print cost and space." },
        ].map(c => (
          <div key={c.title} className="p-5 bg-card border border-border rounded-2xl flex gap-4">
            <div className="text-2xl shrink-0">{c.icon}</div>
            <div>
              <h3 className="font-semibold text-foreground mb-1.5 text-sm">{c.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Tips for a better PDF QR code experience</h2>
      <div className="space-y-4">
        {[
          { tip: "Optimise your PDF for mobile viewing", detail: "Use portrait orientation and a minimum 14pt font size. Avoid landscape-only layouts. Mobile users pinch-to-zoom poorly on small text." },
          { tip: "Keep PDF file size under 5 MB", detail: "Compress images in your PDF (Acrobat, Canva or ilovepdf.com all have free compression). Large files load slowly on mobile data connections." },
          { tip: "Use Google Drive for auto-updates", detail: "Right-click → Manage versions → Upload new version in Google Drive. The sharing URL stays the same so all existing QR codes instantly show the new version." },
          { tip: "Download SVG for print", detail: "SVG scales without pixelation. Upload to Canva, Illustrator or your printer directly for perfectly sharp QR codes on cards, banners and menus." },
          { tip: "Add a 'Scan for menu' label", detail: "Add a Badge frame with the text 'Scan for menu' or 'Scan for full brochure'. A clear CTA dramatically increases the scan rate." },
        ].map((t, i) => (
          <div key={i} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
            <div>
              <div className="font-semibold text-sm text-foreground mb-1">{t.tip}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{t.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <div className="max-w-3xl mx-auto p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
      <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-2">💡 Restaurant menu pro tip</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">Upload your menu PDF to Google Drive with public access. Go to <strong className="text-foreground">File → Manage versions → Upload new version</strong> whenever the menu changes. All QR codes on your tables instantly show the new menu — <strong className="text-foreground">print once, update forever</strong>.</p>
    </div>

    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
      <div className="space-y-3">
        {FAQ_JSON_LD.mainEntity.map((f, i) => (
          <details key={i} className="group border border-border rounded-xl bg-card" open={i === 0}>
            <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-sm marker:content-none">
              {f.name}
              <svg className="ml-4 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{f.acceptedAnswer.text}</div>
          </details>
        ))}
      </div>
    </section>
  </div>
);

export default function PDFQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <QRCoder
        defaultTab="pdf"
        heroTitle="Free PDF QR Code Generator — Link a PDF to a QR Code"
        heroDesc="Turn any hosted PDF into a scannable QR code. Paste your Google Drive, Dropbox or OneDrive link into the PDF tab, customise the design, and download as PNG, JPG or SVG. Perfect for restaurant menus, brochures and syllabuses. Free, no sign-up."
        seoContent={SEO_CONTENT}
      />
    </>
  );
}
