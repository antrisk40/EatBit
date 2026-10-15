import { Metadata } from "next";
import Image from "next/image";
import QRCoder from "./QRCoder";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "Free QR Code Generator — URL, WiFi, vCard, WhatsApp | EatBit",
  description:
    "Create QR codes for links, WiFi, contacts, WhatsApp, email, phone, SMS and PDFs. Customise colours and logos, then download PNG, JPG or SVG. Runs in the browser.",
  alternates: { canonical: "https://eatbit.in/tools/qr-code-generator" },
  openGraph: {
    type: "website",
    title: "Free QR Code Generator — URL, WiFi, vCard, WhatsApp",
    description:
      "Create custom QR codes with colours, logos and frames. Download PNG, JPG or SVG. No account.",
    url: "https://eatbit.in/tools/qr-code-generator",
    siteName: "EatBit",
  },
};

const TABS = ["url", "text", "wifi", "social", "vcard", "email", "phone", "sms", "whatsapp", "pdf"] as const;
type TabState = (typeof TABS)[number];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "EatBit QR Code Generator",
      url: "https://eatbit.in/tools/qr-code-generator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (runs in web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Browser QR generator for URLs, WiFi, vCards, WhatsApp, email, phone, SMS and PDF links, with colour, logo and SVG export.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I make a WiFi QR code?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Open the WiFi tab, enter SSID, password and security type (usually WPA/WPA2), then download. iOS Camera and recent Android Wi-Fi settings can join without typing the password.",
          },
        },
        {
          "@type": "Question",
          name: "Does EatBit store my WiFi password?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The WIFI: payload is encoded in this tab. The password is inside the image you download; anyone who can scan that image can join the network.",
          },
        },
        {
          "@type": "Question",
          name: "Which download format should I use for print?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SVG. It stays sharp from a table card to a poster. PNG and JPG are for screens.",
          },
        },
        {
          "@type": "Question",
          name: "Do these QR codes expire?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No tracking layer. A URL code works until the link dies. A WiFi code works until you change the password or SSID.",
          },
        },
      ],
    },
  ],
};

const SEO_CONTENT = (
  <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24 px-4 max-w-5xl mx-auto">
    <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border">
      <Image src="/images/qr_code_generator.webp" alt="QR code generator with live preview" width={1200} height={675} className="w-full h-auto object-cover" />
    </div>

    <section className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
      <h2 className="text-3xl font-bold text-foreground text-center">What this generator actually encodes</h2>
      <p>
        Every tab writes a standard payload: a URL, plain text, a <code className="text-xs bg-muted px-1">WIFI:</code> string,
        a vCard, <code className="text-xs bg-muted px-1">mailto:</code>, <code className="text-xs bg-muted px-1">tel:</code>,{" "}
        <code className="text-xs bg-muted px-1">sms:</code>, a WhatsApp click-to-chat link, or a URL that points at a PDF you
        already host. There is no EatBit shortener and no scan analytics, which is why codes do not expire on our side.
      </p>
      <p>
        Separate WiFi / WhatsApp / vCard landing pages used to wrap this same editor. They now redirect here with the matching
        tab open so the site is not a stack of near-duplicate URLs.
      </p>
    </section>

    <section>
      <h2 className="text-3xl font-bold mb-8 text-center">Tabs and when to use them</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {[
          { title: "URL & text", body: "Menus, tickets, GitHub repos, or any string. Keep URLs on HTTPS; many cameras warn on plain HTTP." },
          { title: "WiFi", body: "Guest networks for cafés, Airbnbs and meeting rooms. Print at least 5×5 cm. Laminate table cards if they will be handled daily." },
          { title: "vCard", body: "Name, phone, email, company, site. Scanning offers Save Contact instead of opening a website. Useful on badges." },
          { title: "WhatsApp", body: "Builds a wa.me link with an optional pre-filled message so a poster can start the right conversation." },
          { title: "Email / phone / SMS", body: "Opens the default mail or dialer with fields filled. Confirm the country code on phone numbers." },
          { title: "PDF", body: "The QR only stores a link. Host the file (Drive, your site, a menu URL) first, then paste that URL here." },
        ].map((item) => (
          <div key={item.title} className="p-5 bg-card border border-border rounded-2xl">
            <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
      <h2 className="text-3xl font-bold text-foreground text-center">Design that still scans</h2>
      <p>
        Dark modules on a light background are the reliable default. A logo is fine if error correction is High — the generator
        switches that automatically when you add a logo. Do not cover finder patterns in the three corners. For print, leave a
        quiet zone (plain margin) around the code.
      </p>
      <p>
        Brand-coloured Instagram or TikTok styles are cosmetic. Phones still decode the bits; they do not require the official
        in-app QR. If a scan fails, increase contrast and size before changing the URL.
      </p>
    </section>

    <AdBanner slot="tool-bottom" className="mt-6" />
  </div>
);

export default async function QRCodeGeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const tab = TABS.includes(sp.tab as TabState) ? (sp.tab as TabState) : "url";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <QRCoder
        defaultTab={tab}
        heroTitle="QR Code Generator — URL, WiFi, vCard, WhatsApp and more"
        heroDesc="Encode a link, guest WiFi, contact card, or chat in this browser. Colour, logo and frame options. Download PNG, JPG or SVG. No account and no EatBit tracking on scans."
        seoContent={SEO_CONTENT}
      />
    </>
  );
}
