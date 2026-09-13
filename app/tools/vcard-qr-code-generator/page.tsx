import { Metadata } from "next";
import Image from "next/image";
import QRCoder from "../qr-code-generator/QRCoder";

export const metadata: Metadata = {
  title: "Free vCard QR Code Generator for Business Cards — Save Contact in One Scan | EatBit",
  description: "Create a vCard QR code for your business card. Scanning saves your name, phone, email, company and website directly to any smartphone — no app needed. Free, no sign-up, download PNG, JPG or SVG.",
  keywords: "vcard qr code generator free, qr code for business card contact, scan to save contact qr, contact qr code generator, business card qr code, vcf qr code, digital business card qr, qr code contact card iphone android",
  openGraph: {
    title: "Free vCard QR Code Generator for Business Cards",
    description: "Generate a contact QR code that saves your name, phone, email and company to any phone instantly. Free, no account, download as PNG/SVG.",
  }
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a vCard QR code?", "acceptedAnswer": { "@type": "Answer", "text": "A vCard QR code encodes a digital contact card (name, phone, email, company, website) using the vCard 3.0 standard. When scanned, the phone's Contacts app opens and offers to save all your details in one tap — no manual typing." } },
    { "@type": "Question", "name": "How does scanning a vCard QR code work on iPhone?", "acceptedAnswer": { "@type": "Answer", "text": "On iPhone (iOS 11+), open the Camera app, point it at the QR code and tap the notification banner that appears. The Contacts app opens with all fields pre-filled — just tap 'Add Contact' to save." } },
    { "@type": "Question", "name": "How does scanning a vCard QR code work on Android?", "acceptedAnswer": { "@type": "Answer", "text": "On Android 8 and later, open the Camera app or Google Lens, point at the QR code and tap the prompt. The phone offers to add the contact directly to your address book without any extra app." } },
    { "@type": "Question", "name": "What information can I include in a vCard QR code?", "acceptedAnswer": { "@type": "Answer", "text": "You can include first name, last name, phone number, email address, company name and website URL. This follows the vCard 3.0 standard which is supported by every major phone contacts app." } },
    { "@type": "Question", "name": "Is a vCard QR code better than a LinkedIn QR code for business cards?", "acceptedAnswer": { "@type": "Answer", "text": "A vCard QR code saves contact details directly to the phone's address book without needing any app installed. A LinkedIn QR code requires the LinkedIn app. For maximum compatibility across all phones and age groups, vCard is the better choice for printed business cards." } },
    { "@type": "Question", "name": "What file format should I use to print a vCard QR code on a business card?", "acceptedAnswer": { "@type": "Answer", "text": "Download as SVG for the best print quality. SVG is a vector format that prints perfectly at any size — from a tiny 1 cm spot on a business card to a large A4 poster. Most print-on-demand services (Vistaprint, Canva Print, Moo) accept SVG files." } },
    { "@type": "Question", "name": "Can I add a logo to the vCard QR code?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Upload your company logo using the Logo option in the Style panel. Error correction automatically switches to High so the QR code stays reliably scannable even with the logo in the centre." } },
    { "@type": "Question", "name": "How big should the QR code be on my business card?", "acceptedAnswer": { "@type": "Answer", "text": "On a standard 90×55 mm business card, a 20×20 mm QR code in one corner is sufficient. The iPhone and Android camera apps can scan this size reliably in good lighting. Avoid going smaller than 15×15 mm." } },
    { "@type": "Question", "name": "Does my contact information expire or need updating?", "acceptedAnswer": { "@type": "Answer", "text": "The data is encoded directly in the image, so it does not expire. However, if your phone number or email changes, you will need to generate a new QR code and reprint your cards." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-20 border-t border-border pt-16 pb-24">
    <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border">
      <Image src="/images/vcard_qr_generator.webp" alt="{metadata.title as string || 'Tool Illustration'}" width={1200} height={675} className="w-full h-auto object-cover" />
    </div>

    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">What is a vCard QR Code?</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p>A <strong className="text-foreground">vCard QR code</strong> is a scannable image that contains a complete digital contact card. When someone points their phone camera at it, the operating system reads the encoded <strong className="text-foreground">vCard 3.0</strong> data and immediately offers to save your name, phone number, email address, company and website to their address book — all in a single tap, with no typing.</p>
        <p>It is the modern replacement for the printed contact card. Instead of hoping that someone will manually key in your details correctly, a QR code transfers everything perfectly and instantly — on iPhone, Android and even most smart feature phones.</p>
        <p>Because everything is encoded directly in the image, there is no server involved, no app required, and no subscription. The code works forever as long as your contact details stay the same.</p>
      </div>
    </section>

    <section className="bg-card border border-border rounded-2xl p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { stat: "0", label: "apps required to scan" },
          { stat: "1 tap", label: "to save full contact" },
          { stat: "100%", label: "free, no watermark" },
          { stat: "iOS & Android", label: "native support" },
        ].map(s => (
          <div key={s.stat}>
            <div className="text-3xl font-black text-primary mb-1">{s.stat}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-3xl font-bold mb-10 text-center">Where to use your vCard QR code</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {[
          { icon: "🪪", title: "Business Cards", body: "Add the QR to the back of your card. Clients scan and your full details land in their contacts — zero chance of a transcription error, zero fumbling." },
          { icon: "🏷️", title: "Conference Name Badges", body: "Print on your lanyard or badge. Anyone you meet at a networking event can save you in under 5 seconds while you are still talking." },
          { icon: "📧", title: "Email Signatures", body: "Embed a small QR code image in your email footer. Colleagues and clients on mobile can scan the screen and add you to contacts instantly." },
          { icon: "🖥️", title: "LinkedIn & Social Profiles", body: "Use the QR image in your LinkedIn featured section or as a story card. Followers scan to save your number — great for recruiters and sales." },
          { icon: "📄", title: "CV & Portfolio", body: "Add a vCard QR to the top of your CV. Hiring managers scan it to save your number before the interview — you stay top of mind." },
          { icon: "🛍️", title: "Product Packaging", body: "Include the QR on product labels so customers can easily save your support or sales number when they unbox." },
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
      <h2 className="text-3xl font-bold mb-10 text-center">vCard QR vs other digital contact methods</h2>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-5 py-3 font-semibold text-foreground">Method</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground">App needed</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground">Works offline</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground">Saves to Contacts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="bg-primary/5">
              <td className="px-5 py-3 font-medium text-primary">📱 vCard QR code</td>
              <td className="px-5 py-3 text-green-500 font-semibold">None</td>
              <td className="px-5 py-3 text-green-500 font-semibold">Yes</td>
              <td className="px-5 py-3 text-green-500 font-semibold">Yes, natively</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-muted-foreground">💼 LinkedIn QR</td>
              <td className="px-5 py-3 text-destructive">LinkedIn app</td>
              <td className="px-5 py-3 text-destructive">No</td>
              <td className="px-5 py-3 text-amber-500">Via profile only</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-muted-foreground">💳 NFC card</td>
              <td className="px-5 py-3 text-green-500 font-semibold">None</td>
              <td className="px-5 py-3 text-green-500 font-semibold">Yes</td>
              <td className="px-5 py-3 text-green-500 font-semibold">Yes</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-muted-foreground">🖨️ Printed number</td>
              <td className="px-5 py-3 text-muted-foreground">None</td>
              <td className="px-5 py-3 text-green-500 font-semibold">Yes</td>
              <td className="px-5 py-3 text-destructive">Manual typing</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Design tips for business card QR codes</h2>
      <div className="space-y-4">
        {[
          { tip: "Match your brand colours", detail: "Use the custom foreground colour picker to set your brand colour. It makes the QR code feel like a natural part of your card design rather than an afterthought." },
          { tip: "Rounded or dot modules look premium", detail: "Switch from square to rounded or dot module style for a softer, more modern look that pairs well with professional card designs." },
          { tip: "Add a brief call-to-action", detail: "Print 'Scan to save my contact' in small text next to the QR code. First-time encounters with QR codes on business cards still benefit from a short label." },
          { tip: "Test before you print", detail: "Always scan your downloaded QR code with both an iPhone and an Android device before sending files to the printer. Check all fields save correctly." },
          { tip: "Use SVG for the print file", detail: "SVG scales to any size without pixelation. Upload it directly to Canva, Adobe Illustrator, Affinity Designer, or any professional print service." },
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

export default function VCardQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <QRCoder
        defaultTab="vcard"
        heroTitle="Free vCard QR Code Generator for Business Cards"
        heroDesc="Create a contact QR code that saves your name, phone, email and company to any smartphone in one scan. Customise colours, add your logo, and download as PNG, JPG or SVG. Free, no sign-up, no uploads."
        seoContent={SEO_CONTENT}
      />
    </>
  );
}
