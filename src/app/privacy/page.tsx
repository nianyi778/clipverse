import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Privacy Policy | ClipVerse",
  description: "ClipVerse privacy policy and data protection information",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="mb-2 text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mb-12 text-sm text-white/30">Last updated: March 2026</p>
        <div className="space-y-8 text-sm leading-relaxed text-white/50">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, subscribe to a plan, or contact us for support. This includes your email address, name, and payment information. We also automatically collect certain information about your device and how you interact with our service, including IP address, browser type, and usage patterns.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">How We Use It</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our service, process transactions, send transactional and promotional communications, and comply with legal obligations. We analyze usage patterns to enhance user experience and develop new features.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. You can request deletion of your account and associated data at any time by contacting us. Some information may be retained for legal or compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our platform. These include session cookies for authentication and analytics cookies to understand how users interact with our service. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Third-Party Services</h2>
            <p>
              We may share information with third-party service providers who assist us in operating our website and conducting our business, such as payment processors and analytics providers. These providers are contractually obligated to use your information only as necessary to provide services to us.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. You may also have the right to opt-out of certain data processing activities. Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Contact</h2>
            <p>
              If you have questions about this privacy policy or our privacy practices, please contact us at privacy@clipverse.app. We will respond to your inquiry within 30 days.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
