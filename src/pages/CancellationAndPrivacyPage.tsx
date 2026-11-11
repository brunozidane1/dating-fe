import { Link } from "react-router-dom";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";

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
            <ShieldCheck size={14} fill="currentColor" /> {eyebrow}
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

function CancellationAndPrivacySection(): React.JSX.Element {
  return (
    <section className="mx-auto max-w-4xl px-5 py-14 md:px-10">
      <div className="space-y-4">
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            1. Cancelling Premium
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            If you subscribe to Premium, you can cancel at any time from your
            account settings under Billing. Your Premium access continues until
            the end of the current billing period, and you will not be charged
            again after you cancel.
          </p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            2. Refunds
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Refunds are available only where permitted by law and only for a
            qualifying refund reason, such as a failure to deliver a subscription
            or a platform error. For a refund, we ask you to contact our support
            team so we can review the request and, where eligible, process a
            refund in line with our refund policy.
          </p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            3. Privacy and data protection
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Your privacy is protected under applicable data protection and
            privacy laws. Lovinara collects only the personal data necessary to
            operate accounts, matches, and safety systems. We do not sell your
            personal data. You can access, update, or request deletion of your
            data by contacting our privacy team at
            privacy@lovinara.com.
          </p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            4. Storing and managing your account
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            As a logged-out or cancelled member, your profile and personal data
            remain on file as required by law and by our terms of service until
            they are deleted. You may ask us to delete your data by emailing
            privacy@lovinara.com.
          </p>
        </article>
      </div>
    </section>
  );
}

export default function CancellationAndPrivacyPage(): React.JSX.Element {
  return (
    <div className="bg-[#f7f9fb] font-body text-[#191c1e]">
      <PageHero
        image="/editorial-3 (1).jpg"
        eyebrow="Cancellation and privacy"
        title="Stay in control,"
        accent="of your account and your data."
        copy="This page explains how to cancel Premium, how refunds are handled, and how we protect your personal information. It does not replace the Lovinara Terms of Service or Privacy Policy."
      >
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Contact us <ArrowRight size={16} />
        </Link>
      </PageHero>
      <CancellationAndPrivacySection />
    </div>
  );
}
