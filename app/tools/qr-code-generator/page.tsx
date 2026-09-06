import { Metadata } from "next";
import QRCoder from "./QRCoder";

export const metadata: Metadata = {
  title: "Free QR Code Generator Online – Create QR Codes for URL, WiFi, vCard, Instagram & More | PNG, JPG, SVG",
  description: "Generate free QR codes for websites, WiFi passwords, contact cards (vCard), Instagram and social profiles, email, phone and SMS. Instagram, TikTok, Facebook, X, YouTube and LinkedIn codes auto-match each platform's real brand colors. Choose dot styles, logos and border templates, then download as PNG, JPG or SVG. No sign-up, no watermark.",
  keywords: "qr code generator, free qr code generator, wifi qr code, vcard qr code, instagram qr code, instagram qr code design, qr code maker, custom qr code, qr code with logo, qr code svg download, qr code for business card, generate qr code online, qr code no sign up, scan me qr code, social media qr code, brand colored qr code",
  alternates: {
    canonical: "https://example.com/qr-code-generator" // To be updated to your actual domain
  },
  openGraph: {
    type: "website",
    title: "Free QR Code Generator – URL, WiFi, vCard, Instagram & More",
    description: "Create custom QR codes with colors, logos and border templates. Supports URLs, WiFi, contact cards, email, phone, SMS and social profiles. Download as PNG, JPG or SVG — free, no sign-up.",
    url: "https://example.com/qr-code-generator", // To be updated to your actual domain
    siteName: "QR Code Generator",
    images: [
      {
        url: "https://example.com/og-qr-generator.png", // To be updated to your actual domain
        width: 1200,
        height: 630,
        alt: "Free QR Code Generator Online"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator Online",
    description: "Make QR codes for links, WiFi, vCards, Instagram and more. Custom colors, logos and border templates. Download PNG, JPG or SVG for free.",
    images: ["https://example.com/og-qr-generator.png"] // To be updated to your actual domain
  }
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "QR Code Generator",
      "url": "https://example.com/qr-code-generator", // To be updated to your actual domain
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any (runs in web browser)",
      "description": "Free online QR code generator for URLs, WiFi networks, vCards, email, phone, SMS and social profiles like Instagram, TikTok and X. Customize colors, dot styles, logos and border templates, then export as PNG, JPG or SVG.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "URL, plain text, WiFi, vCard, email, phone, SMS and social profile QR codes",
        "Automatic brand-color and style matching for Instagram, TikTok, Facebook, X, YouTube and LinkedIn",
        "Custom foreground/background colors and gradients",
        "Square, rounded and dot module styles",
        "Logo upload with automatic high error-correction",
        "Scan Me banner, badge and colored card border templates",
        "Export to PNG, JPG or SVG",
        "No sign up, no watermark, processed entirely in the browser"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "How do I make a QR code for my WiFi password?", "acceptedAnswer": { "@type": "Answer", "text": "Switch to the WiFi tab, enter your network name (SSID), password and security type, then generate. Anyone who scans the code connects automatically without typing the password." } },
        { "@type": "Question", "name": "Can I add my logo to a QR code?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Upload a logo image and it's placed in the center of the code. Error correction automatically switches to High so the code still scans reliably around the logo." } },
        { "@type": "Question", "name": "What is a vCard QR code?", "acceptedAnswer": { "@type": "Answer", "text": "A vCard QR code stores a contact card — name, phone, email, company and website — so scanning it offers to save the contact directly to the phone, instead of opening a link." } },
        { "@type": "Question", "name": "Which file format should I download for printing?", "acceptedAnswer": { "@type": "Answer", "text": "SVG is best for print because it's vector-based and stays sharp at any size, from a business card to a poster. PNG and JPG are better for screens, apps and social posts." } },
        { "@type": "Question", "name": "Do QR codes expire?", "acceptedAnswer": { "@type": "Answer", "text": "No. A QR code generated here encodes your data directly (a URL, WiFi credentials, text, etc.) and works for as long as that data stays valid — for example, a URL QR code stops working only if the destination link is taken down." } },
        { "@type": "Question", "name": "Is this QR code generator really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — unlimited QR codes, no account, no watermark, and no expiration on dynamic tracking, because the code is generated locally in your browser." } },
        { "@type": "Question", "name": "Does the Instagram QR code match Instagram's real design?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Selecting Instagram on the Social tab automatically applies Instagram's actual brand gradient and a dotted module style, along with a matching preview card, so the code reads as an Instagram code at a glance." } }
      ]
    }
  ]
};

export default function QRCodeGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <QRCoder />
    </>
  );
}
