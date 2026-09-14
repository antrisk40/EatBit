import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import '@fontsource/amiri'
import '@fontsource/arimo'
import '@fontsource/caladea'
import '@fontsource/carlito'
import '@fontsource/eb-garamond'
import '@fontsource/fira-sans'
import '@fontsource/inter'
import '@fontsource/lato'
import '@fontsource/noto-sans'
import '@fontsource/noto-sans-chakma'
import '@fontsource/noto-serif'
import '@fontsource/noto-serif-tamil'
import '@fontsource/open-sans'
import '@fontsource/open-sans-condensed'
import '@fontsource/oranienbaum'
import '@fontsource/poppins'
import '@fontsource/pt-sans'
import '@fontsource/pt-sans-caption'
import '@fontsource/pt-sans-narrow'
import '@fontsource/pt-serif'
import '@fontsource/pt-serif-caption'
import '@fontsource/scheherazade-new'
import '@fontsource/roboto'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/theme-provider'
import { FaWhatsapp } from 'react-icons/fa'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif']
})

export const metadata: Metadata = {
  title: 'EatBit — Custom Software Development Agency | Web, Mobile & AI',
  description: 'EatBit is a software development agency building custom web apps, mobile apps, SaaS platforms, and AI tools. Based in India. Free consultation — get a quote today.',
  keywords: 'software development agency, custom web development, mobile app development, saas development, ai development, next.js development, react development, software agency india',
  openGraph: {
    title: 'EatBit — Custom Software Development Agency',
    description: 'We build custom web apps, mobile apps, SaaS platforms, and AI tools. Based in India. Free consultation.',
    url: 'https://eatbit.in',
    siteName: 'EatBit',
    type: 'website',
    images: [
      {
        url: 'https://eatbit.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EatBit — Custom Software Development Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EatBit — Custom Software Development Agency',
    description: 'We build custom web apps, mobile apps, SaaS platforms, and AI tools. Based in India.',
    images: ['https://eatbit.in/og-image.png'],
  },
  alternates: {
    canonical: 'https://eatbit.in',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <style>{`
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
      </head>
      <body className={`${poppins.variable} font-sans antialiased text-foreground bg-background transition-colors duration-300`}>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TRB57BHFJF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TRB57BHFJF');
          `}
        </Script>
        {/* Organization Structured Data */}
        <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "EatBit",
            url: "https://eatbit.in",
            logo: "https://eatbit.in/favicon.ico",
            description: "EatBit is a software development agency building custom web apps, mobile apps, SaaS platforms, and AI tools.",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-8319212779",
              contactType: "customer service",
              availableLanguage: ["English", "Hindi"],
            },
            sameAs: [
              "https://eatbit.in",
            ],
          })}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Out of the Box Global Background */}
          <div className="fixed inset-0 z-0 pointer-events-none bg-background">
            {/* Dynamic dot matrix grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#80808040_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Animated ambient glowing orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Subtle Vignette to darken edges for a cinematic feel */}
            <div className="absolute inset-0 bg-background [mask-image:radial-gradient(transparent,white_85%)]"></div>
          </div>

          <div className="flex flex-col min-h-screen relative z-10">
            <Navbar />
            <main className="flex-1 relative">
              {children}
            </main>
            <Footer />
          </div>

          {/* Floating WhatsApp Button */}
          <a
            href="https://wa.me/8319212779?text=Hi%2C%20I%27m%20interested%20in%20building%20a%20custom%20web%20or%20mobile%20app."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 hover:shadow-green-500/50"
            aria-label="Chat with us on WhatsApp"
          >
            {/* Ping animation rings */}
            <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60 animate-ping" />
            <FaWhatsapp className="w-8 h-8 relative z-10" aria-hidden="true" focusable="false" />
            {/* Tooltip */}
            <span className="absolute right-16 whitespace-nowrap bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
              Chat on WhatsApp
            </span>
          </a>
        </ThemeProvider>
      </body>
    </html>
  )
}


