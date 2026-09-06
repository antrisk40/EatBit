import { Metadata } from "next";
import QRCoder from "../qr-code-generator/QRCoder";

export const metadata: Metadata = {
  title: "Free Email QR Code Generator — Scan to Send a Pre-filled Email | EatBit",
  description: "Create an email QR code that opens the mail app with the To, Subject and Body pre-filled. Perfect for feedback forms, event registration, customer support and product registration. Free, no sign-up, download PNG, JPG or SVG.",
  keywords: "email qr code generator, scan to send email qr, mailto qr code, qr code feedback form, qr code email link, qr code for email address, pre-filled email qr code, email qr code free",
  openGraph: {
    title: "Free Email QR Code Generator — Scan to Send",
    description: "Generate a QR code that opens any mail app with the address, subject and message pre-filled. Free, no account, download PNG/SVG.",
  }
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How does an email QR code work?", "acceptedAnswer": { "@type": "Answer", "text": "It encodes a mailto: link. When scanned, the phone's default email app opens with the To, Subject and Body fields already filled in. The user just taps Send — no typing required." } },
    { "@type": "Question", "name": "Which email apps support mailto QR codes?", "acceptedAnswer": { "@type": "Answer", "text": "All major email clients on iOS and Android respond to mailto: links, including Apple Mail, Gmail, Outlook, Yahoo Mail and Samsung Email. The phone opens whichever app the user has set as their default." } },
    { "@type": "Question", "name": "What are the best uses for an email QR code?", "acceptedAnswer": { "@type": "Answer", "text": "Common uses include feedback request cards on restaurant tables, event registration (scan to email the organiser), product registration forms, printed customer satisfaction surveys, support requests and job application prompts on flyers." } },
    { "@type": "Question", "name": "Can I pre-fill both the subject line and the email body?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Fill in the Subject and optional Message body fields in the generator above and both will be encoded into the QR code. When scanned, both fields appear pre-filled in the compose window." } },
    { "@type": "Question", "name": "What is the character limit for a mailto QR code?", "acceptedAnswer": { "@type": "Answer", "text": "QR codes can technically encode hundreds of characters, but very long bodies can produce a dense code that is harder to scan reliably. For best results, keep the total encoded string under 300 characters. Use a short subject and a brief prompt message rather than a full email body." } },
    { "@type": "Question", "name": "Does the email send automatically when the code is scanned?", "acceptedAnswer": { "@type": "Answer", "text": "No. Scanning opens the mail app with fields pre-filled, but the user must still tap Send. This is intentional — it ensures consent and gives the user a chance to personalise the message before sending." } },
    { "@type": "Question", "name": "Can I use an email QR code for a no-reply or automated address?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. You can encode any valid email address, including noreply@yourcompany.com or a dedicated inbox like feedback@yourcompany.com. The QR code works regardless of whether the address accepts replies." } },
    { "@type": "Question", "name": "What format should I download for printing on cards?", "acceptedAnswer": { "@type": "Answer", "text": "Download as SVG for print. SVG is a vector format that stays perfectly sharp at any size, from a small 2 cm QR on a business card to a large poster. PNG at maximum size also works well for most print services." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-20 border-t border-border pt-16 pb-24">

    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">What is an Email QR Code?</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p>An <strong className="text-foreground">email QR code</strong> encodes a <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">mailto:</code> URI — the web standard for pre-addressing an email. When a user scans it with their phone camera, the default mail app opens instantly with the <strong className="text-foreground">recipient address, subject line and message body already filled in</strong>. The user just taps Send.</p>
        <p>Unlike a contact QR code (which saves to the address book), an email QR code <em>triggers an action</em> — it nudges the user to send a specific message to a specific address, with zero friction. This makes it ideal for feedback collection, event sign-ups and customer support prompts where you want a structured, predictable response.</p>
        <p>The <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">mailto:</code> standard is supported by every email client on iOS, Android, Windows and macOS — no app beyond the built-in mail client is needed.</p>
      </div>
    </section>

    <section className="bg-card border border-border rounded-2xl p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { stat: "0", label: "apps needed to scan" },
          { stat: "3", label: "fields pre-filled (To, Subject, Body)" },
          { stat: "100%", label: "compatible with all mail apps" },
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
      <h2 className="text-3xl font-bold mb-10 text-center">Use cases</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
        {[
          { icon: "⭐", title: "Customer Feedback", body: "Print on receipts or table cards with a pre-filled subject like 'Feedback for my visit'. Customers scan and submit in under 30 seconds." },
          { icon: "🎟️", title: "Event Registration", body: "Put on an event poster or flyer. Attendees scan to send their RSVP email to the organiser — no form, no website, no friction." },
          { icon: "📦", title: "Product Registration", body: "Include in packaging. Scan to send a registration email with the product name or serial number pre-filled in the Subject line." },
          { icon: "🎧", title: "Customer Support", body: "Add to product manuals and packaging. Scan to open a pre-addressed support email so the customer reaches the right team immediately." },
          { icon: "📋", title: "Job Applications", body: "Add to a job posting flyer. Candidates scan to send their CV to your recruitment inbox — lower barrier than a complex ATS form." },
          { icon: "📚", title: "Educational Feedback", body: "Lecturers add to handouts. Students scan at the end of class to send one-line feedback — response rates far exceed online survey links." },
          { icon: "🏢", title: "Building Access Requests", body: "Receptionists post a QR at the entrance. Visitors scan to email the host to announce their arrival — no calls, no buzzer guessing." },
          { icon: "🤝", title: "Partnership Enquiries", body: "On a brochure or business card. Prospects scan to send an intro email to your partnerships inbox — structured from the first touchpoint." },
        ].map(c => (
          <div key={c.title} className="p-5 bg-card border border-border rounded-2xl flex gap-3">
            <div className="text-xl shrink-0">{c.icon}</div>
            <div>
              <h3 className="font-semibold text-foreground mb-1 text-sm">{c.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Tips for effective email QR codes</h2>
      <div className="space-y-4">
        {[
          { tip: "Keep the subject line specific", detail: "A pre-filled subject like 'Table feedback – 6 Sep' tells you exactly what the email is about and helps you sort replies automatically with email filters." },
          { tip: "Keep the body short", detail: "Pre-fill a one-sentence prompt ('Please describe your experience in a few words'). Long bodies produce denser QR codes that are harder to scan and feel overwhelming to users." },
          { tip: "Use a dedicated inbox", detail: "Route to feedback@yourcompany.com or support@yourcompany.com rather than a personal address. It keeps your primary inbox clean and lets you track volume." },
          { tip: "Add a label next to the QR code", detail: "'Scan to give feedback' removes ambiguity. Users who are unsure what a QR code does are more likely to scan when there is a clear, friendly prompt beside it." },
          { tip: "Test on both iOS and Android", detail: "The default mail app varies by phone (Apple Mail on iPhone, Gmail on many Androids, Samsung Email on Galaxy devices). Test your mailto QR on at least two platforms before printing." },
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

export default function EmailQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <QRCoder
        defaultTab="email"
        heroTitle="Free Email QR Code Generator — Scan to Send"
        heroDesc="Create a QR code that opens the mail app with your address, subject and message already filled in. One scan, one tap on Send. Perfect for feedback forms, events and support. Free, no sign-up."
        seoContent={SEO_CONTENT}
      />
    </>
  );
}
