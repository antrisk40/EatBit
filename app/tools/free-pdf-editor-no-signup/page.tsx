import { Metadata } from "next";
import PdfEditorClient from "./PdfEditorClient";

export const metadata: Metadata = {
  title: "Free PDF Editor No Sign Up — Edit Text & Images Online | EatBit",
  description:
    "Free online PDF editor with no sign up. Edit existing PDF text directly in your browser, add images and signatures, whiteout sensitive text, rotate and delete pages. 100% private.",
  keywords:
    "free pdf editor no signup, edit pdf text online, free pdf editor without registration, sejda alternative free, edit pdf browser, redact pdf online free, private pdf editor, pdf editor free online no watermark",
  openGraph: {
    title: "Free PDF Editor No Sign Up — Edit Text & Images Online",
    description:
      "Edit existing PDF text directly in your browser, add images, whiteout sensitive data, and reorder pages without uploading to any server. Free and no registration.",
    type: "website",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EatBit Free PDF Editor No Sign Up",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any (runs in browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description":
    "Browser-based PDF editor with no signup required. Edit existing PDF text, insert new text with custom fonts, add and resize images, whiteout redactions, rotate and delete pages locally.",
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is this PDF editor really free with no signup or credit card required?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, 100% free! You do not need to create an account, register your email, or provide payment details. Simply drag and drop your PDF and start editing immediately.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I edit text that is already inside my PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Like Sejda, clicking any detected text in your PDF automatically covers the original text with a matching whiteout mask and opens an editable text field right over it with the same font size and baseline position, allowing you to retype words or numbers instantly.",
      },
    },
    {
      "@type": "Question",
      "name": "Are my sensitive documents uploaded to external servers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Never. All PDF parsing, rendering, text editing, and exporting are processed locally inside your web browser using client-side JavaScript (pdf.js and pdf-lib). Your files and data never leave your device.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I add images, signatures, or stamps?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Click the 'Image' tool in the toolbar and select your PNG, JPG, or WebP image. Click anywhere on the page to place the image. You can drag it to reposition and use the corner resize handle to adjust its size.",
      },
    },
    {
      "@type": "Question",
      "name": "How does the Whiteout / Redact tool work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Select the 'Whiteout' tool and click and drag a rectangle over any section you wish to hide or erase. When you export the PDF, that area is permanently masked with a solid white rectangle in the document's vector layers.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I rotate or delete pages before saving?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The left thumbnail panel displays all pages in your document. Hover over any page thumbnail to rotate it clockwise by 90 degrees or click the delete button to omit that page from your final exported document.",
      },
    },
  ],
};

const SEO_CONTENT = (
  <div className="mt-20 space-y-16 border-t border-border pt-16 pb-24 px-4 max-w-5xl mx-auto">
    <section className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-black mb-6 text-foreground tracking-tight">
        The Privacy-First PDF Editor That Runs in Your Browser
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-4 text-base">
        <p>
          Editing a PDF shouldn&apos;t mean having to upload confidential financial records, personal identification, or
          legal contracts to an unknown cloud server. Most online editors force you to register, pay expensive monthly
          subscriptions, or leave watermarks on your work.
        </p>
        <p>
          EatBit&apos;s <strong className="text-foreground">Free PDF Editor No Sign Up</strong> is engineered from the ground
          up using cutting-edge WebAssembly and HTML5 Canvas technology. Every edit—from changing a typo in a contract to
          redacting social security numbers—happens entirely on your own machine.
        </p>
      </div>
    </section>

    {/* Feature highlights grid */}
    <section className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
      <h2 className="text-2xl font-bold mb-8 text-center text-foreground">
        Powerful Tools Without the Paywall
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
          <div className="text-3xl mb-3">✏️</div>
          <h3 className="font-bold text-foreground text-lg mb-2">Click to Retype Text</h3>
          <p className="text-sm text-muted-foreground">
            Click directly on any existing sentence or figure to edit it in place with matching font metrics.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
          <div className="text-3xl mb-3">🖼️</div>
          <h3 className="font-bold text-foreground text-lg mb-2">Insert Images & Logos</h3>
          <p className="text-sm text-muted-foreground">
            Drop in signatures, business logos, stamps, or illustrations with smooth corner resize handles.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="font-bold text-foreground text-lg mb-2">Whiteout & Redact</h3>
          <p className="text-sm text-muted-foreground">
            Easily drag redaction boxes over sensitive prices, addresses, or confidential details.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
          <div className="text-3xl mb-3">🔄</div>
          <h3 className="font-bold text-foreground text-lg mb-2">Rotate & Delete Pages</h3>
          <p className="text-sm text-muted-foreground">
            Fix upside-down scans with 90° rotation or remove unnecessary pages from the document with one click.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="font-bold text-foreground text-lg mb-2">Zero Server Uploads</h3>
          <p className="text-sm text-muted-foreground">
            100% client-side. Your PDFs never touch any backend server, ensuring compliance and security.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-bold text-foreground text-lg mb-2">No Sign-Up or Limits</h3>
          <p className="text-sm text-muted-foreground">
            No email required, no watermarks added, and no hidden subscriptions. Ready whenever you are.
          </p>
        </div>
      </div>
    </section>

    {/* How to use */}
    <section className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">
        How to Edit a PDF for Free in 3 Easy Steps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center mb-4">
            1
          </div>
          <h3 className="font-bold text-foreground mb-2">Upload Your Document</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop any PDF file into the editor. The document renders instantly in your browser.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center mb-4">
            2
          </div>
          <h3 className="font-bold text-foreground mb-2">Make Your Edits</h3>
          <p className="text-sm text-muted-foreground">
            Click existing text to retype it, add new text annotations, insert images, or cover confidential info.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center mb-4">
            3
          </div>
          <h3 className="font-bold text-foreground mb-2">Export Your PDF</h3>
          <p className="text-sm text-muted-foreground">
            Click &quot;Export PDF&quot; to compile your modified document and download it without any watermarks.
          </p>
        </div>
      </div>
    </section>

    {/* Frequently Asked Questions */}
    <section className="max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {FAQ_JSON_LD.mainEntity.map((faq, i) => (
          <details
            key={i}
            className="group border border-border rounded-2xl bg-card transition-all"
            open={i === 0}
          >
            <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-foreground text-sm sm:text-base marker:content-none select-none">
              {faq.name}
              <svg
                className="ml-4 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/40 pt-3">
              {faq.acceptedAnswer.text}
            </div>
          </details>
        ))}
      </div>
    </section>
  </div>
);

export default function FreePdfEditorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <div className="pt-2">
        <PdfEditorClient />
        {SEO_CONTENT}
      </div>
    </>
  );
}
