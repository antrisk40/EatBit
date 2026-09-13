import { Metadata } from "next";
import Image from "next/image";
import QRCoder from "../qr-code-generator/QRCoder";

export const metadata: Metadata = {
  title: "Free WhatsApp QR Code Generator — Scan to Chat Instantly | EatBit",
  description: "Create a WhatsApp QR code for your business. Customers scan and open a chat with your number and a pre-filled message in one tap. Works with WhatsApp and WhatsApp Business. Free, no sign-up, download PNG, JPG or SVG.",
  keywords: "whatsapp qr code generator, qr code for whatsapp chat, scan to message whatsapp, whatsapp business qr code, wa.me qr code, click to chat whatsapp, whatsapp qr code free, whatsapp link qr code, whatsapp order qr code",
  openGraph: {
    title: "Free WhatsApp QR Code Generator — Scan to Chat",
    description: "Generate a WhatsApp click-to-chat QR code with a pre-filled message. Perfect for restaurants, retail and customer support. Free, no sign-up.",
  }
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How does a WhatsApp QR code work?", "acceptedAnswer": { "@type": "Answer", "text": "The code encodes a wa.me link (e.g. https://wa.me/15551234567?text=Hello). When someone scans it, WhatsApp opens on their phone with your number loaded in a new conversation. If you added a pre-filled message, that text appears in the chat box ready to send." } },
    { "@type": "Question", "name": "Do I need WhatsApp Business for this QR code?", "acceptedAnswer": { "@type": "Answer", "text": "No. The wa.me link works with both the standard WhatsApp app and WhatsApp Business. However, WhatsApp Business gives additional tools like automated replies, a business profile, and catalogues — recommended for commercial use." } },
    { "@type": "Question", "name": "What is a pre-filled message in a WhatsApp QR code?", "acceptedAnswer": { "@type": "Answer", "text": "It is a message that automatically appears in the chat box after the customer scans the code. For example, a restaurant might pre-fill 'I would like to place a takeaway order' so the customer just taps Send." } },
    { "@type": "Question", "name": "Where should I display my WhatsApp QR code?", "acceptedAnswer": { "@type": "Answer", "text": "Common placements include: restaurant table cards and takeaway boxes, shop windows and entrance doors, product packaging, business cards, flyers, posters, websites (as a PNG image) and social media posts and stories." } },
    { "@type": "Question", "name": "Does the customer need WhatsApp installed to use the QR code?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The wa.me link opens the WhatsApp app (or WhatsApp Web on desktop). If WhatsApp is not installed, the phone may open the App Store or Play Store instead. WhatsApp has over 2 billion active users globally, so this is rarely a barrier." } },
    { "@type": "Question", "name": "What phone number format should I use?", "acceptedAnswer": { "@type": "Answer", "text": "Use the international format without spaces, dashes or the + sign. For example, an Indian number +91 98765 43210 should be entered as 919876543210. The generator strips all non-numeric characters automatically." } },
    { "@type": "Question", "name": "Can I use this for a WhatsApp group instead of a personal number?", "acceptedAnswer": { "@type": "Answer", "text": "No — wa.me links only support direct messages to individual numbers. For WhatsApp groups, generate an invite link from the WhatsApp app, then paste that link into the Website URL tab of this QR generator instead." } },
    { "@type": "Question", "name": "Is this QR code free with no watermark?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — completely free, no account needed, no watermark, no expiry. The QR code is generated locally in your browser and you own the image. Print it as many times as you like." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-20 border-t border-border pt-16 pb-24">
    <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border">
      <Image src="/images/whatsapp_qr_generator.webp" alt="{metadata.title as string || 'Tool Illustration'}" width={1200} height={675} className="w-full h-auto object-cover" />
    </div>

    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">What is a WhatsApp QR Code?</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p>A <strong className="text-foreground">WhatsApp QR code</strong> encodes a <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">wa.me</code> click-to-chat link. When a customer scans it, <strong className="text-foreground">WhatsApp opens directly</strong> with your business number pre-loaded in a new conversation. If you added a pre-filled message, it appears in the text box — the customer just taps Send.</p>
        <p>There is no need for the customer to save your number first, search for your account, or type anything. One scan → open chat → done. It is the fastest way for a new customer to start a conversation with your business.</p>
        <p>The underlying <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">wa.me</code> link is an official WhatsApp feature, supported by both the standard WhatsApp app and WhatsApp Business on iOS and Android.</p>
      </div>
    </section>

    <section className="bg-card border border-border rounded-2xl p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { stat: "2B+", label: "WhatsApp active users" },
          { stat: "1 scan", label: "to open a direct chat" },
          { stat: "0 apps", label: "extra needed to scan" },
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
      <h2 className="text-3xl font-bold mb-10 text-center">Best uses for businesses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {[
          { icon: "🍽️", title: "Restaurants & Food Delivery", body: "Pre-fill \"I'd like to place an order\" on table cards and takeaway boxes. Customers message you in two taps — faster than calling." },
          { icon: "🛍️", title: "Retail & Local Shops", body: "Put the QR on your window. Passersby scan to ask about stock, price or opening hours without walking in — you respond when free." },
          { icon: "🎧", title: "Customer Support", body: "Add to product packaging, receipts and your website. Customers scan to reach support instantly — far lower friction than email forms." },
          { icon: "🏥", title: "Clinics & Services", body: "Let patients book appointments or ask questions via WhatsApp. Pre-fill 'I would like to book an appointment' to guide the conversation." },
          { icon: "💈", title: "Salons & Spas", body: "Place on your front desk and mirror cards. Clients scan to book their next visit directly — you get bookings even when you are with a customer." },
          { icon: "🏠", title: "Real Estate", body: "Add to property listing boards and brochures. Interested buyers scan to ask questions immediately — you capture hot leads the moment interest peaks." },
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

    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">WhatsApp QR vs other customer contact methods</h2>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-5 py-3 font-semibold text-foreground">Method</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground">Effort for customer</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground">Pre-filled message</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground">Response time expectation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="bg-primary/5">
              <td className="px-5 py-3 font-medium text-primary">🟢 WhatsApp QR</td>
              <td className="px-5 py-3 text-green-500 font-semibold">1 scan, 1 tap Send</td>
              <td className="px-5 py-3 text-green-500 font-semibold">Yes</td>
              <td className="px-5 py-3 text-muted-foreground">Minutes (chat feel)</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-muted-foreground">📞 Phone call</td>
              <td className="px-5 py-3 text-amber-500">Dial number manually</td>
              <td className="px-5 py-3 text-destructive">No</td>
              <td className="px-5 py-3 text-muted-foreground">Immediate</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-muted-foreground">📧 Email form</td>
              <td className="px-5 py-3 text-destructive">Fill long form</td>
              <td className="px-5 py-3 text-amber-500">Partial (subject)</td>
              <td className="px-5 py-3 text-muted-foreground">Hours or days</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-muted-foreground">💬 Live chat widget</td>
              <td className="px-5 py-3 text-amber-500">Needs website visit</td>
              <td className="px-5 py-3 text-destructive">No</td>
              <td className="px-5 py-3 text-muted-foreground">Minutes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Tips for a better WhatsApp QR code</h2>
      <div className="space-y-4">
        {[
          { tip: "Write a specific pre-filled message", detail: "The more specific your pre-filled message, the more actionable the first reply. 'I want to order' is better than 'Hello'. 'I found your listing at X' tells you the source." },
          { tip: "Use your brand colour", detail: "Set the QR foreground to your brand colour. A green foreground is recognisable as 'WhatsApp' to customers at a glance." },
          { tip: "Add a 'Scan to Chat' frame", detail: "Use the Badge or Label frame template to add 'Scan to WhatsApp' text below the code. Customers understand what will happen before they scan." },
          { tip: "Test the pre-filled message length", detail: "WhatsApp truncates very long pre-filled messages. Keep it under 100 characters for reliable encoding across all devices." },
          { tip: "Switch to WhatsApp Business", detail: "WhatsApp Business lets you set an automated greeting message, away hours, quick replies and a product catalogue — transforming the first scan into a full customer journey." },
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

export default function WhatsAppQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <QRCoder
        defaultTab="whatsapp"
        heroTitle="Free WhatsApp QR Code Generator — Scan to Chat Instantly"
        heroDesc="Create a WhatsApp QR code for your business. Customers scan and open a chat with your number and a pre-filled message — in one tap. Customise colours, add your logo, download as PNG, JPG or SVG. Free, no sign-up."
        seoContent={SEO_CONTENT}
      />
    </>
  );
}
