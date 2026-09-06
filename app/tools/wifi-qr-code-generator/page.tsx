import { Metadata } from "next";
import QRCoder from "../qr-code-generator/QRCoder";

export const metadata: Metadata = {
  title: "Free WiFi QR Code Generator — Share Your Password Instantly | EatBit",
  description: "Create a free WiFi QR code for your home, café, restaurant or Airbnb. Guests scan and connect automatically — no typing passwords. Supports WPA, WPA2, WEP and open networks. No sign-up. Download PNG, JPG or SVG.",
  keywords: "wifi qr code generator free, share wifi password qr code, qr code for home wifi, cafe wifi qr code, airbnb wifi qr, create wifi qr code, guest wifi qr code, restaurant wifi qr code, wifi password qr code maker, wifi qr code iphone, wifi qr code android",
  openGraph: {
    title: "Free WiFi QR Code Generator — Share Your Password Instantly",
    description: "Create a WiFi QR code your guests scan to connect automatically. Custom colors, dot styles, frames. Free, no sign-up, runs in your browser.",
  }
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How do I create a WiFi QR code?", "acceptedAnswer": { "@type": "Answer", "text": "Enter your network name (SSID), password and security type (WPA/WPA2 is most common) in the form above, then download the generated QR code as PNG, JPG or SVG. The whole process takes under a minute." } },
    { "@type": "Question", "name": "What security type should I choose for my WiFi QR code?", "acceptedAnswer": { "@type": "Answer", "text": "Most modern home and business routers use WPA/WPA2. If you are unsure, check your router settings page (usually at 192.168.1.1) or the sticker on the back of the router. If your network has no password, select None (open)." } },
    { "@type": "Question", "name": "Can I use this WiFi QR code in my café or restaurant?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Print the QR code and place it on your tables, menu, or counter. Customers scan it and connect to your guest WiFi without you needing to recite a complex password every time. Laminating it makes it durable for everyday use." } },
    { "@type": "Question", "name": "Does the QR code store my WiFi password?", "acceptedAnswer": { "@type": "Answer", "text": "The password is encoded directly in the QR code image and processed entirely in your browser using JavaScript. We never see, store or transmit your credentials to any server." } },
    { "@type": "Question", "name": "Does a WiFi QR code expire?", "acceptedAnswer": { "@type": "Answer", "text": "No. The code is permanent and encodes your credentials directly in the image. It will stop working only if you change your WiFi password or network name — in which case you generate a new code in under a minute." } },
    { "@type": "Question", "name": "How do I scan a WiFi QR code on iPhone?", "acceptedAnswer": { "@type": "Answer", "text": "Open the built-in Camera app on your iPhone (iOS 11 or later), point it at the QR code and tap the notification that appears. Your iPhone will prompt you to join the network automatically — no app needed." } },
    { "@type": "Question", "name": "How do I scan a WiFi QR code on Android?", "acceptedAnswer": { "@type": "Answer", "text": "On Android 9 and later, open the Camera app or go to Settings > WiFi, tap Add Network and then scan QR code. On older Android, use Google Lens or any free QR scanner app. The phone will connect automatically after scanning." } },
    { "@type": "Question", "name": "What size should I print the WiFi QR code?", "acceptedAnswer": { "@type": "Answer", "text": "For a table card or desk stand, 5×5 cm (about 2×2 inches) is the minimum for reliable scanning. For a wall sign or window sticker viewed from 30–60 cm away, use at least 10×10 cm. Download the SVG format for the crispest print at any size." } },
    { "@type": "Question", "name": "Can I add my logo to the WiFi QR code?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Use the Logo upload option in the Style panel. The generator automatically switches error correction to High so the code stays scannable even with a logo covering the centre." } },
  ]
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-20 border-t border-border pt-16 pb-24">

    {/* What is */}
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">What is a WiFi QR Code?</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        <p>A <strong className="text-foreground">WiFi QR code</strong> is a scannable image that encodes your wireless network credentials — the network name (SSID), password and security protocol — so that anyone with a smartphone can join your network with a single camera tap, no typing required.</p>
        <p>Internally it uses the open <strong className="text-foreground">WIFI: URI scheme</strong>, for example <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">WIFI:T:WPA;S:MyNetwork;P:MyPassword;;</code>. This standard is natively supported by the Camera app on iPhone (iOS 11+) and Android (8+), meaning guests need <em>zero</em> extra apps.</p>
        <p>The code is generated entirely in your browser using JavaScript. Your password never leaves your device — it is never sent to any server.</p>
      </div>
    </section>

    {/* Stats strip */}
    <section className="bg-card border border-border rounded-2xl p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { stat: "< 1 min", label: "to create & download" },
          { stat: "100%", label: "browser-based, zero uploads" },
          { stat: "iOS 11+", label: "native Camera support" },
          { stat: "Android 9+", label: "native Camera support" },
        ].map(s => (
          <div key={s.stat}>
            <div className="text-3xl font-black text-primary mb-1">{s.stat}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Step by step */}
    <section>
      <h2 className="text-3xl font-bold mb-10 text-center">How to create a WiFi QR code in 3 steps</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { step: "1", title: "Enter your network details", body: "Type your WiFi network name (SSID) exactly as it appears in the list of available networks. Add your password and choose WPA/WPA2 for most modern routers." },
          { step: "2", title: "Customise the design", body: "Pick a colour preset, choose dot and eye shapes, add your café or business logo, and select a border template like 'Scan Me'. Live preview updates instantly." },
          { step: "3", title: "Download & print", body: "Download as SVG for crisp print quality at any size — from a small table card to a large window sticker. PNG and JPG are also available for digital use." },
        ].map(s => (
          <div key={s.step} className="p-6 rounded-2xl bg-card border border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center mb-4">{s.step}</div>
            <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Use cases */}
    <section>
      <h2 className="text-3xl font-bold mb-10 text-center">Who uses WiFi QR codes?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {[
          { icon: "☕", title: "Cafés & Coffee Shops", body: "Place a laminated QR card on every table. Customers connect the moment they sit down — no staff interruptions, no squinting at tiny text." },
          { icon: "🍽️", title: "Restaurants & Bars", body: "Add the code to your menu or table tent. Pair it with a 'Scan Me' border template in your brand colours for a polished, professional look." },
          { icon: "🏠", title: "Airbnb & Holiday Lets", body: "Put it in your welcome booklet or frame it by the entrance. Guests arrive and get online before they've even unpacked — five-star first impression." },
          { icon: "🏢", title: "Offices & Co-working Spaces", body: "Stick one by reception or in every meeting room. Visitors never need to ask for the password again, and you never need to share it verbally." },
          { icon: "🏥", title: "Clinics & Waiting Rooms", body: "Patients and visitors can connect to your guest WiFi without touching a shared keyboard or disrupting the reception team." },
          { icon: "🎉", title: "Events & Conferences", body: "Print on lanyards, badges or a banner at the entrance. Hundreds of attendees can get online in minutes without queuing at a help desk." },
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

    {/* Comparison table */}
    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">WiFi QR code vs. sharing the password manually</h2>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-5 py-3 font-semibold text-foreground">Method</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground">Time to connect</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground">Risk of typos</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground">Staff effort</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="bg-primary/5">
              <td className="px-5 py-3 font-medium text-primary">📱 WiFi QR code</td>
              <td className="px-5 py-3 text-muted-foreground">~3 seconds</td>
              <td className="px-5 py-3 text-green-500 font-semibold">None</td>
              <td className="px-5 py-3 text-green-500 font-semibold">Zero</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-muted-foreground">🗣️ Verbal / written</td>
              <td className="px-5 py-3 text-muted-foreground">1–3 minutes</td>
              <td className="px-5 py-3 text-destructive">High</td>
              <td className="px-5 py-3 text-destructive">Every customer</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-muted-foreground">📋 Posted on a sign</td>
              <td className="px-5 py-3 text-muted-foreground">30–60 seconds</td>
              <td className="px-5 py-3 text-amber-500">Medium</td>
              <td className="px-5 py-3 text-muted-foreground">Minimal</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    {/* Design tips */}
    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Tips for a great WiFi QR code design</h2>
      <div className="space-y-4">
        {[
          { tip: "Use high contrast colours", detail: "Dark foreground on a white or light background scans fastest and most reliably. Avoid light-on-light or dark-on-dark combinations." },
          { tip: "Add a 'Scan for WiFi' label", detail: "Use the Banner or Badge border template and set the text to 'Scan for WiFi' or 'Free WiFi'. It removes any guesswork for customers." },
          { tip: "Download SVG for print", detail: "SVG is a vector format that stays sharp at any size, from a 5 cm table card to a 1 m window vinyl. PNG works for digital and social use." },
          { tip: "Minimum print size: 2.5 × 2.5 cm", detail: "Below this, camera autofocus struggles. For wall signs viewed from over 50 cm, use at least 10 × 10 cm." },
          { tip: "Laminate for longevity", detail: "A laminated QR card in a table stand lasts years without fading, peeling or smudging — far cheaper than reprinting menus." },
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

    {/* FAQ */}
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

export default function WiFiQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <QRCoder
        defaultTab="wifi"
        heroTitle="Free WiFi QR Code Generator — Share Your Password Instantly"
        heroDesc="Generate a WiFi QR code your guests scan to connect automatically — no typing needed. Works on iPhone and Android. Customise colours, add your logo, and download as PNG, JPG or SVG. Free, no sign-up, runs entirely in your browser."
        seoContent={SEO_CONTENT}
      />
    </>
  );
}
