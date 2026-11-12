import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ArrowRight, Lock } from "lucide-react";

type PageHeroProps = {
  image: string;
  eyebrow: string;
  title: string;
  accent: string;
  copy: string;
  children?: ReactNode;
};

function PageHero({
  image,
  eyebrow,
  title,
  accent,
  copy,
  children,
}: PageHeroProps) {
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
          {children ? (
            <div className="mt-7 flex flex-wrap gap-3">{children}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function RefundAndPrivacySection() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-14 md:px-10">
      <div className="space-y-4">
        {/* 1 */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            1. Who operates Lovinara and what this policy covers
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Lovinara is an online matchmaking platform for adults aged 18 and
            above, available at{" "}
            <a
              href="https://lovinara.com"
              className="text-rose-700 hover:underline"
            >
              https://lovinara.com
            </a>
            . It is operated under the registered Ugandan business name Lovinara
            Meeting Point. Business address: Mbogo Zone 1, Kawempe I, Kawempe
            Division, Kampala Central, Uganda.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            This Refund Policy applies to paid Basic and Premium membership
            access purchased directly from Lovinara. The Free plan carries no
            membership charge, so there is no Free-plan payment to refund.
            Third-party payment processors may assist with payment collection
            and returns; the payment method actually available will be shown at
            checkout.
          </p>
        </article>

        {/* 2 */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            2. Membership plans and published prices
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            As displayed on the Lovinara pricing page on 9 November 2026, the
            membership options are:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-slate-600">
            <li>
              <b>Free:</b> UGX 0. Browse discovery, complete a profile, and send
              messages to up to two different people.
            </li>
            <li>
              <b>Basic:</b> UGX 6,000 per month. Free features plus connections
              with up to three people and priority discovery visibility.
            </li>
            <li>
              <b>Premium:</b> UGX 10,000 per month. Basic features plus
              unlimited connections and chats and unlimited discovery
              visibility.
            </li>
          </ul>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            These prices describe the advertised monthly plans. The total
            amount payable, billing-period dates, applicable fees or taxes, and
            any renewal arrangement must be confirmed at checkout. If a
            published price changes, the price clearly accepted for an
            individual transaction governs that purchase, subject to applicable
            law.
          </p>
        </article>

        {/* 3 */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            3. Purchase, access and recurring payments
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            A successful paid purchase should activate the selected membership
            features for the billing period shown in the order confirmation. A
            plan labelled "/mo" describes a monthly price and does not, by
            itself, mean that recurring payment has been authorised.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            If Lovinara offers an automatically renewing plan, the renewal
            frequency, next charge, payment method and cancellation
            instructions must be clearly presented and affirmatively accepted
            before any recurring charge is made. If payment is one-time or
            manual-renewal, no automatic renewal will be charged.
          </p>
        </article>

        {/* 4 */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            4. Situations in which refunds are available
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            We will investigate and issue an appropriate refund when:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-slate-600">
            <li>
              A payment is duplicated or the amount charged differs from the
              confirmed purchase.
            </li>
            <li>
              The payment was completed but the purchased plan was not activated
              due to a verified Lovinara problem that we cannot reasonably
              resolve.
            </li>
            <li>
              A material and sustained failure made purchased membership
              features unavailable and a suitable remedy was not provided.
            </li>
            <li>
              A renewal was charged after a valid cancellation request had been
              received before the charge was processed.
            </li>
            <li>
              A payment was unauthorised, following reasonable verification and
              any payment-provider investigation.
            </li>
            <li>
              A refund or cancellation remedy is required by applicable law.
            </li>
          </ul>
        </article>

        {/* 5 */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            5. Requests that do not automatically qualify
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Lovinara provides access to online matchmaking and communication
            features; it does not promise that another member will reply, agree
            to meet, form a relationship or produce a particular personal
            outcome.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Outside circumstances where the law requires a refund or Lovinara
            agrees to another remedy, dissatisfaction solely because no
            connection, reply or relationship resulted does not automatically
            qualify for a refund. Neither cancellation of future billing nor
            account suspension automatically decides whether a refund is due.
          </p>
        </article>

        {/* 6 */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            6. Consumer cancellation rights under Ugandan law
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Uganda&apos;s Electronic Transactions Act, 2011 provides consumer
            information requirements and cancellation/refund rights for
            qualifying electronic transactions. In particular, section 25
            provides a seven-day cancellation rule for qualifying transactions
            and a refund within 30 days where that statutory right applies. The
            application of the law and any relevant conditions must be assessed
            for the particular purchase.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Nothing in this policy takes away a consumer right that cannot
            lawfully be excluded. Where a member exercises an applicable
            statutory cancellation right, we will handle the service
            cancellation and the legally required refund in accordance with the
            Act.
          </p>
        </article>

        {/* 7 */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            7. How to request a refund
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Send an email to{" "}
            <a
              href="mailto:support@lovinara.com"
              className="text-rose-700 hover:underline"
            >
              support@lovinara.com
            </a>{" "}
            with the subject "Lovinara Refund Request". Include your account
            email or member ID, transaction or receipt reference, payment date,
            payment method, amount in UGX, and a short explanation of the
            issue. Include supporting screenshots only when relevant.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Do not email any password, mobile-money PIN, one-time code, full
            card number or crypto-wallet private key. We may ask for limited
            information needed to verify the transaction and prevent fraud.
          </p>
        </article>

        {/* 8 */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            8. Review, return method and timing
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Lovinara will acknowledge and investigate requests within a
            reasonable time, update members if additional evidence or
            payment-provider review is needed, and explain the outcome.
            Approved refunds will be initiated without unreasonable delay and
            no later than the legal deadline that applies.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Where technically supported, money is refunded to the original
            Mobile Money account, card or other payment method. A secure
            alternative may be arranged if a return to the original method is
            unavailable and the payer is verified. Processing times may also
            depend on the relevant payment provider. A statutory full refund
            will not be reduced in violation of applicable law.
          </p>
        </article>

        {/* 9 */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            9. Payment disputes and account action
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Members may contact support to challenge a payment and retain the
            right to raise a lawful chargeback or other dispute with their
            financial service provider. Lovinara may make proportionate
            adjustments to access while a disputed payment is investigated, but
            will not treat a dispute as forfeiture of mandatory consumer
            rights.
          </p>
        </article>

        {/* 10 — combines the PDF's duplicate "10" heading content:
            suspended-membership sentence + operator info + related links +
            closing note, all of which belong under section 10. */}
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-semibold">
            10. Contact and related policies
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Where a membership is suspended or terminated for a verified
            violation of the Community Guidelines, any refund request will
            still be assessed under this policy and the law.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Business operator: Lovinara Meeting Point (registered business
            name, Uganda). Address: Mbogo Zone 1, Kawempe I, Kawempe Division,
            Kampala Central, Uganda. Refund support:{" "}
            <a
              href="mailto:support@lovinara.com"
              className="text-rose-700 hover:underline"
            >
              support@lovinara.com
            </a>
            .
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Related information:{" "}
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
            Read this policy with the Lovinara Cancellation Policy. Material
            updates will be dated and notified where required by law; they do
            not remove rights arising from earlier transactions.
          </p>
        </article>
      </div>
    </section>
  );
}

export default function RefundAndPrivacyPage() {
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