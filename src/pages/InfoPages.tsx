import { Link } from "react-router-dom";
import { ArrowRight, Eye, Flag, Heart, Lock, ShieldCheck } from "lucide-react";

function PageHero({ image, eyebrow, title, accent, copy, children }: { image: string; eyebrow: string; title: string; accent: string; copy: string; children?: React.ReactNode }) {
  return (
    <section className="relative flex min-h-[480px] items-center overflow-hidden md:min-h-[540px]">
      <img src={image} alt={eyebrow} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f7f9fb]/95 via-[#f7f9fb]/72 to-[#f7f9fb]/10" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 md:px-10">
        <div className="w-full max-w-[560px] rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_40px_-10px_rgba(184,0,53,.18)] backdrop-blur-2xl sm:p-8">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.13em] text-rose-800"><Heart size={14} fill="currentColor" /> {eyebrow}</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.12] tracking-[-.04em] text-[#8c0026] sm:text-5xl">{title}<br /><span className="font-light italic text-[#6f2f3a]">{accent}</span></h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#5b4041] sm:text-base">{copy}</p>
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function SafetyPage() {
  return (
    <div className="bg-[#f7f9fb] font-body text-[#191c1e]">
      <PageHero image="/editorial-3 (1).jpg" eyebrow="Safety at Lovinara" title="Date with confidence," accent="we protect the space." copy="Verification, smart limits and a human safety team keep Lovinara respectful - so you can focus on connection, not caution.">
        <Link to="/guidelines" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Guidelines <ArrowRight size={16} /></Link>
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-6 py-3 text-sm font-semibold text-[#8c0026] transition hover:bg-white">Report a concern</Link>
      </PageHero>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl bg-white p-5 shadow-sm"><ShieldCheck size={20} className="text-[#8c0026]" /><h3 className="mt-3 font-heading text-base font-semibold">Human verification</h3><p className="mt-2 text-xs leading-6 text-slate-600">Every member is reviewed before joining. Fakes and scammers are removed fast.</p></article>
          <article className="rounded-2xl bg-white p-5 shadow-sm"><Lock size={20} className="text-[#8c0026]" /><h3 className="mt-3 font-heading text-base font-semibold">Private by design</h3><p className="mt-2 text-xs leading-6 text-slate-600">You decide what to share and when. Details stay in your control.</p></article>
          <article className="rounded-2xl bg-white p-5 shadow-sm"><Eye size={20} className="text-[#8c0026]" /><h3 className="mt-3 font-heading text-base font-semibold">Only 3 active chats</h3><p className="mt-2 text-xs leading-6 text-slate-600">Limited slots reduce spam and pressure - and keep conversation genuine.</p></article>
          <article className="rounded-2xl bg-white p-5 shadow-sm"><Flag size={20} className="text-[#8c0026]" /><h3 className="mt-3 font-heading text-base font-semibold">One-tap reporting</h3><p className="mt-2 text-xs leading-6 text-slate-600">Block or report instantly. Every report is reviewed within 24 hours.</p></article>
        </div>
      </section>
      <section className="border-y border-rose-100 bg-white px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[3/4] max-h-[520px] overflow-hidden rounded-3xl shadow-[0_20px_38px_-20px_rgba(184,0,53,.4)]">
            <img src="/curated-1 (1).jpg" alt="Safe dating" className="h-full w-full object-cover" />
            <span className="absolute left-4 top-4 rounded-full bg-[#8c0026] px-4 py-1.5 text-[11px] font-bold text-white">Verified community</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8c0026]">Your safety checklist</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-.04em]">Smart habits for safer dating</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3 rounded-2xl border border-rose-100 bg-[#f7f9fb] p-4"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#8c0026]" /><div><p className="text-sm font-bold">Keep details private</p><p className="mt-1 text-xs leading-6 text-slate-600">Never share home address, workplace or financial info until deep trust is built.</p></div></li>
              <li className="flex gap-3 rounded-2xl border border-rose-100 bg-[#f7f9fb] p-4"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#8c0026]" /><div><p className="text-sm font-bold">Chat inside Lovinara first</p><p className="mt-1 text-xs leading-6 text-slate-600">Early conversations stay in-app where blocking and reporting protect you.</p></div></li>
              <li className="flex gap-3 rounded-2xl border border-rose-100 bg-[#f7f9fb] p-4"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#8c0026]" /><div><p className="text-sm font-bold">Video call before meeting</p><p className="mt-1 text-xs leading-6 text-slate-600">A short call confirms identity and chemistry. Never feel rushed to meet.</p></div></li>
              <li className="flex gap-3 rounded-2xl border border-rose-100 bg-[#f7f9fb] p-4"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#8c0026]" /><div><p className="text-sm font-bold">Meet in public, tell a friend</p><p className="mt-1 text-xs leading-6 text-slate-600">Choose busy public places for first dates and share plans with someone you trust.</p></div></li>
            </ul>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10">
        <div className="rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-sm md:p-12">
          <h2 className="mx-auto max-w-xl font-heading text-2xl font-semibold tracking-[-.03em]">Something feels wrong? Tell us right away.</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">Our safety team reviews every report within 24 hours. Email safety@lovinara.com - we are here 24/7.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Contact safety team <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function GuidelinesPage() {
  return (
    <div className="bg-[#f7f9fb] font-body text-[#191c1e]">
      <PageHero image="/curated-2 (1).jpg" eyebrow="Community guidelines" title="Kindness is" accent="the house rule." copy="Lovinara is for respectful adults seeking genuine connection. These standards keep our community warm, honest and safe for everyone.">
        <Link to="/safety" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Safety centre <ArrowRight size={16} /></Link>
      </PageHero>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#8c0026]">01 - Be real</p><h3 className="mt-2 font-heading text-lg font-semibold">Authentic profiles only</h3><p className="mt-2 text-sm leading-7 text-slate-600">Use recent photos of yourself, your true age and honest intentions. No impersonation, catfishing, or misleading relationship goals. Verified members earn more trust - and more matches.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#8c0026]">02 - Be kind</p><h3 className="mt-2 font-heading text-lg font-semibold">Respect every person</h3><p className="mt-2 text-sm leading-7 text-slate-600">No harassment, hate speech, insults, or explicit content. Rejection happens - handle it with grace. A simple thank you and goodbye keeps the community kind.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#8c0026]">03 - Be safe</p><h3 className="mt-2 font-heading text-lg font-semibold">Protect privacy</h3><p className="mt-2 text-sm leading-7 text-slate-600">Never share someone else's photos, messages or personal details. No solicitation, scams, or requests for money. Report suspicious behaviour instead of engaging.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#8c0026]">04 - Be intentional</p><h3 className="mt-2 font-heading text-lg font-semibold">Date with purpose</h3><p className="mt-2 text-sm leading-7 text-slate-600">You have 3 active connection slots - use them well. Read profiles, write thoughtful openers, reply within a reasonable time. Ghosting repeatedly may limit your visibility.</p></article>
        </div>
      </section>
      <section className="border-y border-rose-100 bg-white px-5 py-14 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8c0026]">Enforcement</p>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-[-.03em] sm:text-3xl">What happens when rules are broken</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">First violation: warning and content removal. Second: temporary suspension and re-verification. Severe violations - harassment, scams, explicit content, underage use - mean an immediate permanent ban. You can appeal any decision within 30 days at appeals@lovinara.com.</p>
        </div>
      </section>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="bg-[#f7f9fb] font-body text-[#191c1e]">
      <PageHero image="/lume-2.jpg" eyebrow="Contact Lovinara" title="We are here" accent="to help you." copy="Questions, feedback or a safety concern? Message the Lovinara team directly - we reply within one business day.">
        <a href="mailto:info@lovinara.com" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Email us <ArrowRight size={16} /></a>
      </PageHero>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
            <h2 className="font-heading text-xl font-semibold">Send us a message</h2>
            <p className="mt-2 text-xs leading-6 text-slate-500">Fill this in and we will get back to you at your account email.</p>
            <form className="mt-5 space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input required placeholder="Your name" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300" />
              <input required type="email" placeholder="Email address" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300" />
              <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300" defaultValue="General question"><option>General question</option><option>Safety concern</option><option>Report a member</option><option>Billing and Premium</option><option>Feedback</option></select>
              <textarea required placeholder="How can we help?" rows={5} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300" />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Send message</button>
            </form>
          </div>
          <div className="space-y-4">
            <article className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#8c0026]">General support</p><p className="mt-2 text-sm font-bold">info@lovinara.com</p><p className="mt-1 text-xs leading-6 text-slate-600">Questions about profiles, matches, connections and your account.</p></article>
            <article className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#8c0026]">Safety team</p><p className="mt-2 text-sm font-bold">safety@lovinara.com - 0788765430</p><p className="mt-1 text-xs leading-6 text-slate-600">Urgent safety issues and member reports. Available 24/7.</p></article>
            <article className="relative overflow-hidden rounded-2xl shadow-sm"><img src="/lume-3.jpg" alt="Visit us" className="h-44 w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-0 p-5 text-white"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-rose-200">Response time</p><p className="mt-1 text-sm font-semibold">Under 24 hours on business days. Safety reports prioritized.</p></div></article>
          </div>
        </div>
      </section>
    </div>
  );
}

export function HelpPage() {
  const faqs = [
    ["How do connections work?", "Browse Discover, send a request to someone who interests you, and start chatting once they accept. You can keep 3 active connections at a time - this keeps every conversation meaningful."],
    ["How do I get verified?", "Go to Profile and complete photo verification. Verified members get a badge, rank higher in Discover, and earn far more responses."],
    ["How do I edit my profile?", "Open Profile, tap Edit, and update your photos, bio, interests and intentions. Complete profiles get 5x more connection requests."],
    ["Someone is bothering me. What do I do?", "Open their profile or chat, tap Block or Report. Our safety team reviews every report within 24 hours. For urgent issues email safety@lovinara.com."],
    ["How do I cancel Premium?", "Go to Settings, Billing, Cancel. You keep Premium until the end of your billing period - no hidden charges, cancel anytime."],
    ["How do I delete my account?", "Go to Settings, Delete account. Your profile, photos and messages are permanently removed within 30 days."],
  ];
  return (
    <div className="bg-[#f7f9fb] font-body text-[#191c1e]">
      <PageHero image="/lume-1.jpg" eyebrow="Help centre" title="Answers," accent="right when you need them." copy="Everything about profiles, connections, safety and billing - in plain language, no jargon.">
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Still stuck? Contact us <ArrowRight size={16} /></Link>
      </PageHero>
      <section className="mx-auto max-w-4xl px-5 py-14 md:px-10">
        <div className="space-y-4">
          {faqs.map(([q, a]) => (
            <details key={q} className="group rounded-2xl bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none text-sm font-bold text-slate-900">{q}</summary>
              <p className="mt-2 text-sm leading-7 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}


export function PrivacyPage() {
  return (
    <div className="bg-[#f7f9fb] font-body text-[#191c1e]">
      <PageHero image="/editorial-2 (1).jpg" eyebrow="Privacy at Lovinara" title="Your story," accent="your control." copy="You decide what you share and when. We never sell your data, and every control is one tap away. Last updated October 2026.">
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Privacy questions <ArrowRight size={16} /></Link>
      </PageHero>
      <section className="mx-auto max-w-4xl px-5 py-14 md:px-10">
        <div className="space-y-4">
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">1. What we collect</h3><p className="mt-2 text-sm leading-7 text-slate-600">Account details (name, email, age), profile content you add (photos, bio, interests), and usage data (matches, messages metadata). We never access your private messages for advertising.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">2. Why we use it</h3><p className="mt-2 text-sm leading-7 text-slate-600">To run your account, suggest compatible matches, keep the community safe (verification, moderation), and improve Lovinara. Legal basis: contract performance and legitimate interests.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">3. What we never do</h3><p className="mt-2 text-sm leading-7 text-slate-600">We never sell personal profile information, never share your exact location publicly, and never show your profile to search engines. Your photos stay inside Lovinara.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">4. Your rights</h3><p className="mt-2 text-sm leading-7 text-slate-600">Access, correct, export or delete your data anytime from Settings, or email privacy@lovinara.com. Deletion completes within 30 days. You can withdraw consent for optional processing anytime.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">5. Security and retention</h3><p className="mt-2 text-sm leading-7 text-slate-600">Encrypted in transit and at rest, access limited to trained staff. Inactive accounts are anonymised after 2 years. Safety reports are kept 1 year for legal protection.</p></article>
        </div>
      </section>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="bg-[#f7f9fb] font-body text-[#191c1e]">
      <PageHero image="/lume-3.jpg" eyebrow="Terms of service" title="Fair rules" accent="for everyone." copy="Using Lovinara means dating respectfully and lawfully. Plain-language version - effective October 2026.">
        <Link to="/guidelines" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Guidelines <ArrowRight size={16} /></Link>
      </PageHero>
      <section className="mx-auto max-w-4xl px-5 py-14 md:px-10">
        <div className="space-y-4">
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">1. Who can join</h3><p className="mt-2 text-sm leading-7 text-slate-600">You must be 18 or older and use one honest account in your own name. Underage accounts are removed immediately.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">2. Your responsibilities</h3><p className="mt-2 text-sm leading-7 text-slate-600">Keep information accurate, keep logins private, treat every member with respect. You are responsible for content you post.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">3. What is not allowed</h3><p className="mt-2 text-sm leading-7 text-slate-600">Harassment, hate speech, explicit content, scams, spam, fake profiles, or sharing others' private info. Violations lead to warnings, suspension or bans.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">4. Premium and refunds</h3><p className="mt-2 text-sm leading-7 text-slate-600">Premium renews until cancelled in Settings. Access continues until period end. Refunds follow store policies and consumer law.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">5. Safety and liability</h3><p className="mt-2 text-sm leading-7 text-slate-600">We verify and moderate actively, but always meet new people carefully in public. Lovinara is not liable for member actions to the extent permitted by law.</p></article>
        </div>
      </section>
    </div>
  );
}

export function CookiesPage() {
  return (
    <div className="bg-[#f7f9fb] font-body text-[#191c1e]">
      <PageHero image="/hero.jpg" eyebrow="Cookie preferences" title="Small files," accent="big transparency." copy="Cookies remember your login, keep chats reliable and help us improve. You are always in control.">
        <Link to="/privacy" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Privacy policy <ArrowRight size={16} /></Link>
      </PageHero>
      <section className="mx-auto max-w-4xl px-5 py-14 md:px-10">
        <div className="space-y-4">
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">Essential - always on</h3><p className="mt-2 text-sm leading-7 text-slate-600">Login sessions, security and load balancing. Lovinara cannot work without these.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">Preferences</h3><p className="mt-2 text-sm leading-7 text-slate-600">Language, filters and display settings. Disable anytime - the app still works.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">Analytics</h3><p className="mt-2 text-sm leading-7 text-slate-600">Anonymous usage counts that help fix bugs and improve matching. No ad profiles.</p></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-heading text-base font-semibold">Manage anytime</h3><p className="mt-2 text-sm leading-7 text-slate-600">Clear cookies in browser settings, or email privacy@lovinara.com to opt out of non-essential cookies.</p></article>
        </div>
      </section>
    </div>
  );
}