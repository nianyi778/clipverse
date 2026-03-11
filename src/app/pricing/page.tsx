"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Minus,
  Zap,
  ChevronDown,
  CreditCard,
  Shield,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { useI18n } from "@/lib/i18n";
import { Footer } from "@/components/footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

interface Tier {
  name: string;
  badge?: string;
  badgeGradient?: string;
  monthlyPrice: string;
  yearlyPrice: string;
  period: string;
  yearlyPeriod: string;
  originalPrice?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

interface ComparisonRow {
  feature: string;
  free: string | boolean;
  pro: string | boolean;
  lifetime: string | boolean;
  team: string | boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 + index * 0.06 }}
      className="border-b border-white/[0.06] last:border-b-0"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-sm font-medium text-white/80 sm:text-base">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-white/30 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-white/40">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ComparisonCell({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-sm text-white/60">{value}</span>;
  }
  if (value) {
    return <Check className="mx-auto size-4 text-violet-400" />;
  }
  return <Minus className="mx-auto size-4 text-white/15" />;
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useI18n();

  const handleCheckout = async (tierName: string) => {
    const plan = tierName.toLowerCase();
    if (plan === "free") {
      router.push("/register");
      return;
    }
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const tiers: Tier[] = [
    {
      name: t("pricing.free.name"),
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      period: t("pricing.period.forever"),
      yearlyPeriod: t("pricing.period.forever"),
      description: t("pricing.free.description"),
      features: [
        t("pricing.free.feature1"),
        t("pricing.free.feature2"),
        t("pricing.free.feature3"),
        t("pricing.free.feature4"),
        t("pricing.free.feature5"),
      ],
      cta: t("pricing.free.cta"),
      highlighted: false,
    },
    {
      name: t("pricing.pro.name"),
      badge: t("pricing.pro.badge"),
      badgeGradient: "from-violet-600 to-purple-600",
      monthlyPrice: "$3.99",
      yearlyPrice: "$24.99",
      period: t("pricing.period.month"),
      yearlyPeriod: t("pricing.period.year"),
      description: t("pricing.pro.description"),
      features: [
        t("pricing.pro.feature1"),
        t("pricing.pro.feature2"),
        t("pricing.pro.feature3"),
        t("pricing.pro.feature4"),
        t("pricing.pro.feature5"),
        t("pricing.pro.feature6"),
        t("pricing.pro.feature7"),
        t("pricing.pro.feature8"),
      ],
      cta: t("pricing.pro.cta"),
      highlighted: true,
    },
    {
      name: t("pricing.lifetime.name"),
      badge: t("pricing.lifetime.badge"),
      badgeGradient: "from-amber-500 to-orange-500",
      monthlyPrice: "$29.99",
      yearlyPrice: "$29.99",
      period: t("pricing.period.onetime"),
      yearlyPeriod: t("pricing.period.onetime"),
      originalPrice: "$49.99",
      description: t("pricing.lifetime.description"),
      features: [
        t("pricing.lifetime.feature1"),
        t("pricing.lifetime.feature2"),
        t("pricing.lifetime.feature3"),
        t("pricing.lifetime.feature4"),
        t("pricing.lifetime.feature5"),
        t("pricing.lifetime.feature6"),
        t("pricing.lifetime.feature7"),
      ],
      cta: t("pricing.lifetime.cta"),
      highlighted: false,
    },
    {
      name: t("pricing.team.name"),
      monthlyPrice: "$9.99",
      yearlyPrice: "$6.99",
      period: t("pricing.period.person.month"),
      yearlyPeriod: t("pricing.period.person.month"),
      description: t("pricing.team.description"),
      features: [
        t("pricing.team.feature1"),
        t("pricing.team.feature2"),
        t("pricing.team.feature3"),
        t("pricing.team.feature4"),
        t("pricing.team.feature5"),
      ],
      cta: t("pricing.team.cta"),
      highlighted: false,
    },
  ];

  const comparisonData: ComparisonRow[] = [
    { feature: t("pricing.compare.row.downloads"), free: "5", pro: t("pricing.compare.value.unlimited"), lifetime: t("pricing.compare.value.unlimited"), team: t("pricing.compare.value.unlimited") },
    { feature: t("pricing.compare.row.quality"), free: "1080p", pro: "4K", lifetime: "4K", team: "4K" },
    { feature: t("pricing.compare.row.duration"), free: t("pricing.compare.value.30min"), pro: t("pricing.compare.value.2hours"), lifetime: t("pricing.compare.value.2hours"), team: t("pricing.compare.value.2hours") },
    { feature: t("pricing.compare.row.batch"), free: false, pro: t("pricing.compare.value.10atonce"), lifetime: t("pricing.compare.value.10atonce"), team: t("pricing.compare.value.10atonce") },
    { feature: t("pricing.compare.row.chrome"), free: false, pro: true, lifetime: true, team: true },
    { feature: t("pricing.compare.row.speed"), free: false, pro: true, lifetime: true, team: true },
    { feature: t("pricing.compare.row.formats"), free: false, pro: true, lifetime: true, team: true },
    { feature: t("pricing.compare.row.separation"), free: false, pro: true, lifetime: true, team: true },
    { feature: t("pricing.compare.row.updates"), free: false, pro: false, lifetime: true, team: true },
    { feature: t("pricing.compare.row.subtitles"), free: false, pro: false, lifetime: true, team: true },
    { feature: t("pricing.compare.row.storage"), free: false, pro: false, lifetime: t("pricing.compare.value.10gb"), team: t("pricing.compare.value.50gb.shared") },
    { feature: t("pricing.compare.row.api"), free: false, pro: false, lifetime: true, team: true },
    { feature: t("pricing.compare.row.support"), free: false, pro: false, lifetime: true, team: true },
    { feature: t("pricing.compare.row.badge"), free: false, pro: false, lifetime: true, team: true },
    { feature: t("pricing.compare.row.team"), free: false, pro: false, lifetime: false, team: true },
    { feature: t("pricing.compare.row.license"), free: false, pro: false, lifetime: false, team: true },
    { feature: t("pricing.compare.row.sla"), free: false, pro: false, lifetime: false, team: true },
  ];

  const faqItems: FAQItem[] = [
    { question: t("pricing.faq.q1"), answer: t("pricing.faq.a1") },
    { question: t("pricing.faq.q2"), answer: t("pricing.faq.a2") },
    { question: t("pricing.faq.q3"), answer: t("pricing.faq.a3") },
    { question: t("pricing.faq.q4"), answer: t("pricing.faq.a4") },
    { question: t("pricing.faq.q5"), answer: t("pricing.faq.a5") },
    { question: t("pricing.faq.q6"), answer: t("pricing.faq.a6") },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Ambient backgrounds */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[15%] h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.12)_0%,transparent_70%)]" />
        <div className="absolute right-0 top-[40%] h-[500px] w-[500px] bg-[radial-gradient(ellipse,rgba(6,182,212,0.06)_0%,transparent_70%)]" />
        <div className="absolute bottom-[10%] left-0 h-[400px] w-[400px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.05)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative px-6 pb-8 pt-32 md:pt-40">
        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs text-white/50 backdrop-blur-sm">
              <Zap className="size-3 text-violet-400" />
              {t("pricing.hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            {t("pricing.hero.title1")}{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t("pricing.hero.title2")}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-xl text-lg text-white/40"
          >
            {t("pricing.hero.subtitle")}
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1"
          >
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                !yearly
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              {t("pricing.hero.monthly")}
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                yearly
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              {t("pricing.hero.yearly")}
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                -30%
              </span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing cards */}
      <section className="relative px-6 pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.08 }}
                className={cn(
                  "group relative rounded-2xl border p-7 transition-all duration-300",
                  tier.highlighted
                    ? "border-violet-500/25 bg-violet-500/[0.06] lg:scale-[1.03]"
                    : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1]"
                )}
              >
                {tier.highlighted && (
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/10 to-transparent opacity-60" />
                )}

                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={cn(
                        "whitespace-nowrap rounded-full bg-gradient-to-r px-4 py-1 text-xs font-semibold text-white",
                        tier.badgeGradient
                      )}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="relative mb-6">
                  <h3 className="mb-1 text-lg font-semibold text-white/80">
                    {tier.name}
                  </h3>
                  <p className="mb-4 text-sm text-white/30">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    {tier.originalPrice && (
                      <span className="text-lg text-white/25 line-through">
                        {tier.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-white">
                      {yearly ? tier.yearlyPrice : tier.monthlyPrice}
                    </span>
                    <span className="text-sm text-white/30">
                      {yearly ? tier.yearlyPeriod : tier.period}
                    </span>
                  </div>
                  {yearly && tier.name === t("pricing.team.name") && (
                    <p className="mt-1.5 text-xs text-emerald-400/70">
                      {t("pricing.team.billed")}
                    </p>
                  )}
                  {yearly && tier.name === t("pricing.pro.name") && (
                    <p className="mt-1.5 text-xs text-emerald-400/70">
                      {t("pricing.pro.billed")}
                    </p>
                  )}
                </div>

                <ul className="relative mb-8 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-white/50"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-violet-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleCheckout(tier.name)}
                  disabled={loadingPlan === tier.name.toLowerCase()}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
                    tier.highlighted
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_24px_rgba(124,58,237,0.3)]"
                      : "border border-white/[0.08] text-white/65 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  {loadingPlan === tier.name.toLowerCase() ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    tier.cta
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-cyan-400"
            >
              {t("pricing.compare.label")}
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              {t("pricing.compare.title")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-3 text-white/40"
            >
              {t("pricing.compare.subtitle")}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.01]"
          >
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-4 text-left text-sm font-medium text-white/40">
                    {t("pricing.compare.feature")}
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white/50">
                    {t("pricing.free.name")}
                  </th>
                  <th className="bg-violet-500/[0.04] px-4 py-4 text-center text-sm font-semibold text-violet-400">
                    {t("pricing.pro.name")}
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white/50">
                    {t("pricing.lifetime.name")}
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white/50">
                    {t("pricing.team.name")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      "transition-colors hover:bg-white/[0.015]",
                      i < comparisonData.length - 1 &&
                        "border-b border-white/[0.04]"
                    )}
                  >
                    <td className="px-5 py-3.5 text-sm text-white/55">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <ComparisonCell value={row.free} />
                    </td>
                    <td className="bg-violet-500/[0.02] px-4 py-3.5 text-center">
                      <ComparisonCell value={row.pro} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <ComparisonCell value={row.lifetime} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <ComparisonCell value={row.team} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Payment methods */}
      <section className="px-6 py-16">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-white/25">
            {t("pricing.payment.title")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-3">
              <CreditCard className="size-5 text-violet-400/60" />
              <span className="text-sm font-medium text-white/40">Stripe</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-3">
              <Shield className="size-5 text-blue-400/60" />
              <span className="text-sm font-medium text-white/40">Alipay</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-3">
              <CreditCard className="size-5 text-emerald-400/60" />
              <span className="text-sm font-medium text-white/40">
                WeChat Pay
              </span>
            </div>
          </div>
          <p className="mt-5 text-xs text-white/20">
            {t("pricing.payment.note")}
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-400"
            >
              {t("pricing.faq.label")}
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              {t("pricing.faq.title")}
            </motion.h2>
          </motion.div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6">
            {faqItems.map((item, i) => (
              <FAQAccordion key={item.question} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.04] px-6 py-24">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {t("pricing.cta.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-white/40">
            {t("pricing.cta.subtitle")}
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
          >
            {t("pricing.cta.button")}
            <ArrowRight className="size-4" />
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
