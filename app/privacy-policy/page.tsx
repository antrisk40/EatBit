import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | EatBit",
  description: "EatBit's Privacy Policy — how we collect, use, and protect your data across our tools and website.",
  alternates: { canonical: "https://eatbit.in/privacy-policy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "October 15, 2026";
const CONTACT_EMAIL = "neeleshbaghel40@gmail.com";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Content */}
        <div className="prose-sm space-y-10 text-muted-foreground leading-7">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Who We Are</h2>
            <p>
              EatBit (<strong className="text-foreground">eatbit.in</strong>) is a software development agency and free online tools platform operated by EatBit Tech Services, based in India.
              For privacy enquiries, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-4">{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. What Data We Collect</h2>
            <h3 className="font-semibold text-foreground mb-2 text-sm">a) Files You Upload</h3>
            <p>
              Our browser-based tools (including the Gemini Watermark Remover) process your files <strong className="text-foreground">entirely on your device</strong>.
              No files are transmitted to our servers. We never see, store, or have access to any files you process.
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-2 text-sm">b) Account Data (if you sign in)</h3>
            <p>
              If you create a free account or sign in via Google OAuth, we collect your name, email address, and profile picture
              provided by Google. This information is used solely to manage your account and enforce per-account usage limits.
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-2 text-sm">c) Usage Analytics</h3>
            <p>
              We use <strong className="text-foreground">Google Analytics</strong> and <strong className="text-foreground">Microsoft Clarity</strong> to understand how visitors use our tools.
              These services collect anonymised data such as pages visited, session duration, and country of origin.
              We also track page views and tool usage events on our own servers to improve the product.
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-2 text-sm">d) Cookies</h3>
            <p>
              We use essential cookies to keep you signed in. Third-party cookies may be set by Google Analytics,
              Google AdSense, and Microsoft Clarity for analytics and advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Google AdSense</h2>
            <p>
              We display advertisements served by <strong className="text-foreground">Google AdSense</strong> (<code className="text-primary text-xs bg-muted px-1.5 py-0.5 rounded">ca-pub-4123566150896961</code>).
              Google may use cookies and device identifiers to serve personalised ads based on your browsing history across sites.
              You can opt out of personalised advertising at{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">adssettings.google.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. How We Use Your Data</h2>
            <ul className="list-none space-y-2 text-sm">
              {[
                "To operate and improve our tools and services",
                "To enforce fair-use limits (downloads per day) on a per-account or per-IP basis",
                "To send transactional emails if you have an account (e.g. password reset)",
                "To serve relevant advertisements via Google AdSense",
                "To analyse aggregate usage patterns via Google Analytics and Clarity",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Data Sharing</h2>
            <p>
              We do <strong className="text-foreground">not</strong> sell your personal data. We may share anonymised aggregate
              statistics (e.g. total tool usage counts) publicly for transparency. We share data with third-party processors
              only where necessary to operate our services (Google Analytics, Google AdSense, Microsoft Clarity, our hosting provider).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Data Retention</h2>
            <p>
              Account data is retained for as long as your account is active. You may request deletion at any time by emailing us.
              Analytics data is retained per Google&apos;s and Microsoft&apos;s standard retention policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
            <p>
              Depending on your jurisdiction (including GDPR in Europe and DPDPA in India), you may have the right to access,
              correct, or delete your personal data, and to object to or restrict certain processing. To exercise any of these
              rights, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-4">{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed at children under 13. We do not knowingly collect personal data from children.
              If you believe a child has provided us personal data, please contact us to have it removed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this page will always
              reflect the most recent revision. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Contact</h2>
            <p>
              Questions or concerns about this policy? Email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-4">{CONTACT_EMAIL}</a>{" "}
              or reach out via the{" "}
              <a href="/contact-us" className="text-primary underline underline-offset-4">contact form</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
