import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "DMCA Policy | ClipVerse",
  description: "ClipVerse DMCA policy and copyright infringement procedures",
};

export default function DMCAPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="mb-2 text-3xl font-bold text-white">DMCA Policy</h1>
        <p className="mb-12 text-sm text-white/30">Last updated: March 2026</p>
        <div className="space-y-8 text-sm leading-relaxed text-white/50">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Overview</h2>
            <p>
              ClipVerse respects the intellectual property rights of others and is committed to complying with the Digital Millennium Copyright Act (DMCA). This policy outlines our procedures for handling copyright infringement claims and counter-notifications.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Copyright Infringement Claims</h2>
            <p>
              If you believe that content available on ClipVerse infringes your copyright, you may submit a written notice to our DMCA agent. Your notice must include: (1) a physical or electronic signature; (2) identification of the copyrighted work claimed to have been infringed; (3) identification of the material that is claimed to be infringing; (4) your contact information; (5) a statement that you have a good faith belief that the use is not authorized; and (6) a statement under penalty of perjury that the information in the notice is accurate.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Counter-Notification</h2>
            <p>
              If you believe that material you submitted has been wrongly removed due to a DMCA notice, you may submit a counter-notification. Your counter-notification must include: (1) your physical or electronic signature; (2) identification of the material that was removed; (3) a statement under penalty of perjury that you have a good faith belief that the material was removed in error; and (4) your contact information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Repeat Infringers</h2>
            <p>
              ClipVerse will terminate the accounts of users who are repeat infringers of copyright laws. We reserve the right to take appropriate action against users who repeatedly violate intellectual property rights, including account suspension or termination.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Contact</h2>
            <p>
              To submit a DMCA notice or counter-notification, please contact our DMCA agent at dmca@clipverse.app. Please allow 10-15 business days for a response to your notice.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
