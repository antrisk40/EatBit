import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | EatBit",
  description: "EatBit's Terms of Service — rules governing your use of our website, free tools, and software development services.",
  alternates: { canonical: "https://eatbit.in/terms-of-service" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "October 15, 2026";
const CONTACT_EMAIL = "neeleshbaghel40@gmail.com";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Content */}
        <div className="prose-sm space-y-10 text-muted-foreground leading-7">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using any part of the EatBit website (<strong className="text-foreground">eatbit.in</strong>), including our free online tools, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use our services. EatBit is operated by EatBit Tech Services, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Description of Services</h2>
            <p>
              EatBit provides free browser-based online tools (such as the Gemini Watermark Remover, PDF tools, image converters, and QR code generators)
              as well as custom software development services. Free tools may have usage limits (e.g. downloads per day) enforced by IP address or account tier.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Free Tool Usage Limits</h2>
            <p>
              Free (no-account) access is limited to <strong className="text-foreground">1 download per day</strong> per tool, enforced by IP.
              Creating a free account provides up to 3 downloads per day. EatBit Pro subscribers receive unlimited downloads.
              Attempting to circumvent usage limits (e.g. via VPNs, proxies, or automated scripts) is a violation of these Terms
              and may result in temporary or permanent IP-level restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Permitted Use</h2>
            <p>You agree to use EatBit services only for lawful purposes. You must not:</p>
            <ul className="list-none space-y-2 text-sm mt-3">
              {[
                "Use any tool to process files you do not have the right to modify",
                "Attempt to reverse-engineer, scrape, or systematically download from EatBit",
                "Use our services in any way that violates applicable laws or third-party rights",
                "Impersonate another person or entity, or misrepresent your affiliation",
                "Use our services to infringe copyrights or distribute unlicensed content",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✕</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. AI-Generated Content & Watermarks</h2>
            <p>
              Our Gemini Watermark Remover removes the <strong className="text-foreground">visible overlay watermark</strong> from Google Gemini-generated images and videos.
              By using this tool, you confirm that you are the creator or licensee of the content and that you are complying with
              Google&apos;s <a href="https://policies.google.com/terms/generative-ai" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">Generative AI Terms</a>{" "}
              and any applicable disclosure requirements for AI-generated content in your jurisdiction.
              EatBit is not responsible for how you use the processed output.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Intellectual Property</h2>
            <p>
              All EatBit website content, branding, tool designs, and software are the intellectual property of EatBit Tech Services.
              You retain full ownership of any files you upload and process. EatBit does not claim any rights over your content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Disclaimer of Warranties</h2>
            <p>
              EatBit tools and services are provided <strong className="text-foreground">&quot;as is&quot;</strong> without warranty of any kind.
              We do not guarantee that tools will be error-free, uninterrupted, or produce results suitable for any particular purpose.
              Use of our tools is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, EatBit Tech Services shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of or inability to use our services, even if we have been
              advised of the possibility of such damages. Our total liability to you shall not exceed INR 1,000 or the amount you
              have paid us in the past 12 months, whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Third-Party Services</h2>
            <p>
              Our website includes advertising served by <strong className="text-foreground">Google AdSense</strong> and analytics
              provided by <strong className="text-foreground">Google Analytics</strong> and <strong className="text-foreground">Microsoft Clarity</strong>.
              These services are governed by their own terms and privacy policies. EatBit is not responsible for third-party content or conduct.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Account Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms, engage in abuse, or circumvent usage limits,
              without prior notice. You may close your account at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts
              located in Madhya Pradesh, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">12. Changes to These Terms</h2>
            <p>
              We may revise these Terms at any time. The &quot;Last updated&quot; date at the top of this page will reflect the current version.
              Continued use of our services after revisions constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">13. Contact</h2>
            <p>
              Questions about these Terms? Email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-4">{CONTACT_EMAIL}</a>{" "}
              or use the{" "}
              <a href="/contact-us" className="text-primary underline underline-offset-4">contact form</a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
