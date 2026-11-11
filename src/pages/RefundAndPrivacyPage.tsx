import { Link } from "react-router-dom";
import { ArrowRight, Lock} from "lucide-react";

function PageHero({
  image,
  eyebrow,
  title,
  accent,
  copy,
  children,
}: {
  image: string;
  eyebrow: string;
  title: string;
  accent: string;
  copy: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[480px] items-center overflow-hidden md:min-h-[540px]">
      <img
        src={image}
        alt={eyebrow}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f7f9fb]/95 via-[#f7f9fb]/72 to-[#f7f9fb]/10" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 md:px-10">
        <div className="w-full max-w-[560px] rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_40px_-10px_rgba(184,0,53,.18)] backdrop-blur-2xl sm:p-8">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.13em] text-rose-800">
            <Lock size={14} fill="currentColor" /> {eyebrow}
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.12] tracking-[-.04em] text-[#8c0026] sm:text-5xl">
            {title}
            <br />
            <span className="font-light italic text-[#6f2f3a]">{accent}</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#5b4041] sm:text-base">
            {copy}
          </p>
          {children && (
            <div className="mt-7 flex flex-wrap gap-3">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}

function RefundAndPrivacySection(): React.JSX.Element {
  return (
    <section className="mx-auto max-w-4xl px-5 py-14 md:px-10">
      <div className="space-y-4">
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            1. Refunds
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Refund eligibility is decided on a case-by-case basis and is subject
            to the platform&apos;s commercial and consumer-terms of service. If
            you believe you qualify for a refund, please contact the Lovinara
            team so we can review your request. We will only offer refunds where
            permitted by applicable law and our refund terms.
          </p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            2. Cancellation and cancellation of access
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Members may cancel live subscriptions at any time through their
            account settings. Cancellation takes effect at the end of the
            current billing period, and access continues until that date. It does
            not refund any fees already charged. Cancelled members may continue
            to use purchased content until the period ends.
          </p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            3. Privacy, data and cookie usage
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Lovinara collects only the information needed to run accounts and
            keep the community safe. We do not sell personal data. Users may
            review, export, or request deletion of their data at any time by
            contacting the Lovinara team. Our privacy policy describes exactly
            what is collected, how it is used, and how you can control it.
          </p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            4. How to get in touch
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            For refund, cancellation, or privacy questions, write to us at
            privacy@lovinara.com. For urgent safety concerns, email
            safety@lovinara.com instead.
          </p>
        </article>
      </div>
    </section>
  );
}

export default function RefundAndPrivacyPage(): React.JSX.Element {
  return (
    <div className="bg-[#f7f9fb] font-body text-[#191c1e]">
      <PageHero
        image="/editorial-2 (1).jpg"
        eyebrow="Refunds and privacy"
        title="Your rights,"
        accent="clearly explained."
        copy="This page explains how refunds work, how to cancel access, and how we protect your privacy. It does not replace any agreement you have signed with Lovinara."
      >
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Contact us <ArrowRight size={16} />
        </Link>
      </PageHero>
      <RefundAndPrivacySection />
    </div>
  );
}
