import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

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
        {/* 1. Purpose and membership plans */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            1. Purpose and membership plans
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            This Cancellation Policy explains how members of Lovinara, an online
            matchmaking platform for adults aged 18 and above, can stop future
            paid membership renewals and what happens to access after
            cancellation.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            The advertised plans on 9 November 2026 are Free (UGX 0), Basic (UGX
            6,000/month), and Premium (UGX 10,000/month). Free users can message
            up to two different people; Basic members can connect with up to
            three people and receive priority discovery visibility; Premium
            includes unlimited connections and chats and unlimited discovery
            visibility. Current plan descriptions appear at{" "}
            <a
              href="https://lovinara.com/pricing"
              className="text-rose-700 hover:underline"
            >
              https://lovinara.com/pricing
            </a>
            .
          </p>
        </article>

        {/* 2. Monthly membership does not necessarily mean auto-renewal */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            2. Monthly membership does not necessarily mean auto-renewal
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            The price notation "mo" describes the monthly membership period; it
            does not alone authorise recurring payment. A one-time or manually
            renewed membership expires at the end of the purchased period unless
            the member makes a new payment.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Where automatic renewal is offered, Lovinara must show the renewal
            amount, timing, payment method, and cancellation instructions before
            checkout, and the member must affirmatively agree to recurring
            billing. No automatic payment is to be initiated without that
            consent.
          </p>
        </article>

        {/* 3. How to cancel future renewals */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            3. How to cancel future renewals
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            A member may request cancellation at any time by emailing{" "}
            <a
              href="mailto:support@lovinara.com"
              className="text-rose-700 hover:underline"
            >
              support@lovinara.com
            </a>{" "}
            with the subject "Cancel Lovinara Renewal" and identifying the
            Lovinara account email or member ID. Where a working self-service
            billing or membership-cancellation function is available in the
            account, members may use it instead. We may reasonably verify
            account ownership but will never ask for a password, PIN or one-time
            password. We will confirm that the request has been recorded and
            state the paid-access end date.
          </p>
        </article>

        {/* 4. Effective date and future charges */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            4. Effective date and future charges
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            No cancellation fee is charged by Lovinara. To prevent the next
            scheduled automatic payment, cancellation must be received before
            that payment is processed. If a valid request arrives before the
            charge, an internal handling delay must not be used as a reason to
            charge the next renewal.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            After cancellation of automatic renewal, Lovinara will not initiate
            future Lovinara-controlled recurring payments for that membership. A
            payment already processed is reviewed separately under the Refund
            Policy and applicable consumer rights.
          </p>
        </article>

        {/* 5. Paid access after cancellation */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            5. Paid access after cancellation
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Ordinarily, cancelling a future renewal does not immediately
            terminate paid access. Members retain the features of the already
            paid Basic or Premium plan until the end of the paid period, subject
            to lawful and properly disclosed safety or account restrictions.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            When the paid period expires without a new payment, the account can
            return to the Free plan, currently described as allowing messages to
            up to two different people. The unused part of a paid period is not
            automatically refundable, except as required by law or under the
            Refund Policy.
          </p>
        </article>

        {/* 6. Upgrades, downgrades and renewals */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            6. Upgrades, downgrades and renewals
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            A member who changes between Basic and Premium or renews manually
            must be shown the price, effective date, any treatment of remaining
            paid time, and what features become available before confirming the
            change. We will not assume that an upgrade automatically converts a
            manual subscription into recurring billing.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            If payment fails and no new payment is successfully authorised,
            renewal and paid access cannot be assumed to continue; the account
            may revert to Free at the end of the paid term.
          </p>
        </article>

        {/* 7. Trials, promotions and changes in price */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            7. Trials, promotions and changes in price
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            If Lovinara introduces a free trial or promotional offer, its
            duration, any future charge and how to cancel must be clearly
            explained before a member accepts it. No trial is represented by
            this policy as currently available.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            If a recurring plan price changes, members will receive the
            information and an opportunity to cancel before the revised charge,
            and fresh consent will be obtained where the law or
            payment-provider rules require it.
          </p>
        </article>

        {/* 8. Account deletion is different from membership cancellation */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            8. Account deletion is different from membership cancellation
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Cancelling a payment renewal does not itself delete your Lovinara
            account, profile or messages. For account deletion, follow the
            available account controls or contact{" "}
            <a
              href="mailto:support@lovinara.com"
              className="text-rose-700 hover:underline"
            >
              support@lovinara.com
            </a>
            ; personal-data handling and retention are covered by the Privacy
            Policy.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            A verified deletion request will also be treated as a request to
            stop Lovinara-controlled future recurring charges. If billing is
            administered by an independent external merchant, members may need
            to follow that provider's cancellation flow; Lovinara will provide
            reasonable guidance.
          </p>
        </article>

        {/* 9. Refunds, statutory rights and account suspensions */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            9. Refunds, statutory rights and account suspensions
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Cancelling a future subscription charge and cancelling an electronic
            purchase for a statutory refund are distinct processes. Refer to the
            Refund Policy or email{" "}
            <a
              href="mailto:support@lovinara.com"
              className="text-rose-700 hover:underline"
            >
              support@lovinara.com
            </a>{" "}
            about the original transaction.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Nothing here limits consumer rights under the Electronic
            Transactions Act, 2011 or other applicable law. An account suspended
            for Community Guidelines or safety violations does not automatically
            eliminate any mandatory refund right.
          </p>
        </article>

        {/* 10. Contact and policy updates */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            10. Contact and policy updates
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Business operator: Lovinara Meeting Point (registered business name,
            Uganda). Address: Mbogo Zone 1, Kawempe I, Kawempe Division, Kampala
            Central, Uganda. Cancellation support:{" "}
            <a
              href="mailto:support@lovinara.com"
              className="text-rose-700 hover:underline"
            >
              support@lovinara.com
            </a>
            .
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Related pages:{" "}
            <a
              href="https://lovinara.com/pricing"
              className="text-rose-700 hover:underline"
            >
              https://lovinara.com/pricing
            </a>{" "}
            |{" "}
            <a
              href="https://lovinara.com/privacy"
              className="text-rose-700 hover:underline"
            >
              https://lovinara.com/privacy
            </a>{" "}
            |{" "}
            <a
              href="https://lovinara.com/guidelines"
              className="text-rose-700 hover:underline"
            >
              https://lovinara.com/guidelines
            </a>
            .
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Material revisions will have a new effective date and any notice
            required by law.
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