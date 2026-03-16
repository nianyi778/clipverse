import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Terms of Service | ClipVerse",
  description: "ClipVerse terms of service and user agreement",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="mb-2 text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mb-12 text-sm text-white/30">Last updated: March 2026</p>
        <div className="space-y-8 text-sm leading-relaxed text-white/50">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Acceptance of Terms</h2>
            <p>
              By accessing and using ClipVerse, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Service Description</h2>
            <p>
              ClipVerse provides a platform for downloading and processing video content from various online sources. Our service is provided on an "as-is" basis without warranties of any kind. We reserve the right to modify or discontinue the service at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Acceptable Use</h2>
            <p>
              You agree not to use ClipVerse for any unlawful purposes or in any way that could damage, disable, or impair the service. You may not download content that you do not have the right to download, or that infringes on the intellectual property rights of others.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Intellectual Property</h2>
            <p>
              The content, features, and functionality of ClipVerse are owned by ClipVerse, its licensors, or other providers of such material and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Limitation of Liability</h2>
            <p>
              In no event shall ClipVerse be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Termination</h2>
            <p>
              We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the service following the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which ClipVerse operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at support@clipverse.app.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
