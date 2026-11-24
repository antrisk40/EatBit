import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "SSC Exam Photo & Signature Resizer Guide (20KB–50KB, 165×215 px) | EatBit",
  description:
    "Exact SSC CGL, CHSL, MTS & GD photo and signature dimensions (20KB–50KB photo, 10KB–20KB signature), Name & Date (DOP) rules, common rejection reasons, and free browser SSC image cropper.",
  keywords: [
    "ssc exam image cropper",
    "ssc photo resizer",
    "ssc photo size 20kb to 50kb",
    "ssc signature resizer 10kb to 20kb",
    "ssc cgl photo resize",
    "ssc chsl photo size",
    "ssc mts photo cropper",
    "name and date on ssc photo",
    "ssc photo background rules",
  ],
  openGraph: {
    title: "SSC Exam Photo & Signature Size Guide (20KB–50KB) | EatBit",
    description:
      "Crop your SSC photo to 165×215 px (20–50 KB) and signature to 140×60 px (10–20 KB) in 10 seconds with zero upload.",
    url: "https://eatbit.in/blogs/ssc-photo-and-signature-size-guide",
    siteName: "EatBit",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "SSC Exam Photo & Signature Resizer Guide (20KB–50KB)",
    description:
      "Official SSC CGL, CHSL & MTS photo/signature dimensions + free instant browser cropper.",
  },
  alternates: {
    canonical: "https://eatbit.in/blogs/ssc-photo-and-signature-size-guide",
  },
  robots: { index: true, follow: true },
};

export default function SscPhotoSignatureGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "SSC Exam Photo & Signature Resizer Guide (20KB–50KB, 165×215 px)",
            description:
              "Exact SSC CGL, CHSL, MTS & GD photo and signature dimensions, Name & Date strip rules, and how to crop cleanly without server uploads.",
            author: { "@type": "Organization", name: "EatBit", url: "https://eatbit.in" },
            publisher: { "@type": "Organization", name: "EatBit", url: "https://eatbit.in" },
            mainEntityOfPage: "https://eatbit.in/blogs/ssc-photo-and-signature-size-guide",
            datePublished: "2026-11-25",
            dateModified: "2026-11-25",
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is the exact photo size for SSC CGL, CHSL, and MTS?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "SSC requires a JPEG passport photo measuring 3.5 cm (width) × 4.5 cm (height), which corresponds to roughly 165 × 215 pixels, with a file size strictly between 20 KB and 50 KB.",
                },
              },
              {
                "@type": "Question",
                name: "What is the SSC signature size requirement?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Your signature must be signed with black or blue ink on plain white paper, cropped to 4.0 cm × 2.0 cm (140 × 60 pixels), saved as JPEG, and sized strictly between 10 KB and 20 KB.",
                },
              },
              {
                "@type": "Question",
                name: "How do I resize an SSC signature if it goes below 10 KB?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "EatBit's SSC Signature preset automatically enforces the 10 KB minimum. If a white-background signature compresses under 10 KB, EatBit safely embeds compliant JPEG metadata padding so the SSC portal never rejects it for being undersized.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need Name and Date of Photo (DOP) printed on my SSC photo?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "While recent SSC One-Time Registration (OTR) forms often use live webcam capture, several SSC notifications and state-level forms still ask for the date on uploaded photos. EatBit includes an optional 1-click Name & Date strip toggle.",
                },
              },
            ],
          }),
        }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground">SSC Exam Photo &amp; Signature Size Guide</span>
        </nav>

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Exam Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-5">
            SSC Exam{" "}
            <span className="text-primary">Photo &amp; Signature Cropper</span>{" "}
            Guide (20KB–50KB)
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Every year, thousands of SSC CGL, CHSL, and MTS forms get rejected over blurry photos, wrong KB sizes, or shadowed signatures. Here are the exact dimensions and how to resize both in 10 seconds inside your browser.
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <span>By EatBit Team</span>
            <span>•</span>
            <time dateTime="2026-11-25">November 25, 2026</time>
            <span>•</span>
            <span>4 min read</span>
          </div>
        </header>

        {/* Direct CTA Banner */}
        <div className="mb-12 border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-foreground mb-1">Need to resize right now?</p>
            <p className="text-xs text-muted-foreground">Open EatBit with the SSC Photo or Signature preset already locked.</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href="/tools/govt-exam-photo-resizer?preset=ssc-photo"
              className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Crop SSC Photo (20–50 KB) →
            </Link>
            <Link
              href="/tools/govt-exam-photo-resizer?preset=ssc-sign"
              className="px-4 py-2.5 border border-border bg-card text-foreground text-xs font-bold hover:border-primary/50 transition-colors"
            >
              Crop Signature (10–20 KB)
            </Link>
          </div>
        </div>

        <div className="mb-12 rounded-xl overflow-hidden shadow-2xl border border-border">
          <Image
            src="/blogs/privacy_first.webp"
            alt="Privacy-first SSC exam photo and signature cropper in browser"
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="space-y-10 text-muted-foreground text-[15px] leading-8">
          <section>
            <h2 className="text-2xl font-extrabold text-foreground mb-4">
              1. Official SSC Photo &amp; Signature Specifications
            </h2>
            <div className="overflow-x-auto border border-border bg-card my-4">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-foreground">
                    <th className="px-4 py-3 font-bold">Requirement</th>
                    <th className="px-4 py-3 font-bold">SSC Passport Photo</th>
                    <th className="px-4 py-3 font-bold">SSC Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-foreground">Dimensions (cm)</td>
                    <td className="px-4 py-3">3.5 cm × 4.5 cm</td>
                    <td className="px-4 py-3">4.0 cm × 2.0 cm</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-foreground">Dimensions (px)</td>
                    <td className="px-4 py-3 font-mono text-xs text-primary font-bold">165 × 215 px</td>
                    <td className="px-4 py-3 font-mono text-xs text-primary font-bold">140 × 60 px</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-foreground">File Size</td>
                    <td className="px-4 py-3 font-mono text-xs">20 KB – 50 KB</td>
                    <td className="px-4 py-3 font-mono text-xs">10 KB – 20 KB</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-foreground">Format</td>
                    <td className="px-4 py-3">JPEG (.jpg / .jpeg)</td>
                    <td className="px-4 py-3">JPEG (.jpg / .jpeg)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-foreground mb-4">
              2. Top 5 Reasons SSC Rejects Uploaded Photos &amp; Signatures
            </h2>
            <ul className="list-disc pl-5 space-y-2.5">
              <li><strong className="text-foreground">Blurred or miniature photo:</strong> Using low-resolution screenshots or shrinking without binary quality search turns faces blurry.</li>
              <li><strong className="text-foreground">Wearing spectacles or caps:</strong> SSC notifications strictly reject photos with glasses, tinted lenses, hats, or masks.</li>
              <li><strong className="text-foreground">Dark or patterned background:</strong> Always use a plain white or light-colored background with even lighting on your face.</li>
              <li><strong className="text-foreground">Signature smaller than 10 KB:</strong> Plain ink on white paper naturally compresses down to 4–7 KB, triggering a rejection on upload.</li>
              <li><strong className="text-foreground">Greyish paper shadow on signature:</strong> Taking a phone photo of paper in dim light makes the background look dark grey instead of white.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-foreground mb-4">
              3. Step-by-Step: Resize Without Uploading Personal Photos
            </h2>
            <p>
              Because admit forms also involve personal identification documents, never upload your passport photo or handwritten signature to random cloud resizers. Use EatBit&apos;s browser-local tool instead:
            </p>
            <ol className="list-decimal list-inside space-y-2.5 mt-4 pl-2">
              <li>Open the <Link href="/tools/govt-exam-photo-resizer?preset=ssc-photo" className="text-primary font-semibold underline underline-offset-4">SSC Photo Preset (165×215 px)</Link>.</li>
              <li>Upload your photo from phone or PC — crop ratio locks to <strong className="text-foreground">3.5:4.5</strong> automatically.</li>
              <li>Optional: Turn on <strong className="text-foreground">Add Name &amp; Date Strip</strong> if your form requires DOP printed at the bottom.</li>
              <li>Download your JPEG — file size is automatically optimized inside <strong className="text-foreground">20 KB – 50 KB</strong>.</li>
              <li>Switch to the <Link href="/tools/govt-exam-photo-resizer?preset=ssc-sign" className="text-primary font-semibold underline underline-offset-4">SSC Signature Preset (140×60 px)</Link>, enable <strong className="text-foreground">Clean White Paper Background</strong>, and download inside <strong className="text-foreground">10 KB – 20 KB</strong>.</li>
            </ol>
          </section>
        </div>
      </article>
    </>
  );
}
