import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/theme-provider'
import { FaWhatsapp } from 'react-icons/fa'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'EatBit - Bite-Sized Tech, Giant Results',
  description: 'We transform complex technical challenges into digestible, elegant solutions.',
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
          src="https://www.googletagmanager.com/gtag/js?id=G-R7BFVRPLRS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R7BFVRPLRS');
          `}
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

          {/* Floating WhatsApp Icon */}
          <a
            href="https://wa.me/8319212779"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 hover:shadow-green-500/50"
            aria-label="Chat with us on WhatsApp"
          >
            <FaWhatsapp className="w-8 h-8" aria-hidden="true" focusable="false" />
          </a>
        </ThemeProvider>
      </body>
    </html>
  )
}


