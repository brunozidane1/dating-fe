import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#f7f9fb]">
      <section className="relative flex min-h-[540px] items-center overflow-hidden md:min-h-[600px]">
        <img src="/hero.jpg" alt="Couple sharing an intimate moment" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f9fb]/95 via-[#f7f9fb]/72 to-[#f7f9fb]/10" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 md:px-10">
          <div className="w-full max-w-[540px] rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_40px_-10px_rgba(184,0,53,.18)] backdrop-blur-2xl sm:p-8">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.13em] text-rose-800"><Heart size={14} fill="currentColor" /> Our story - Lovinara</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.12] tracking-[-.04em] text-[#8c0026] sm:text-5xl">Dating with <br /><span className="font-light italic text-[#6f2f3a]">intention</span>, built for real connection.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#5b4041] sm:text-base">Lovinara is a considered space for people seeking real conversations and meaningful relationships - not endless swiping. Love grows where attention, respect and curiosity meet.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/signup" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_-12px_rgba(184,0,53,.8)] transition hover:opacity-90 active:scale-95">Join Lovinara <ArrowRight size={16} /></Link>
              <Link to="/safety" className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-6 py-3 text-sm font-semibold text-[#8c0026] transition hover:bg-white"> <ShieldCheck size={16} /> How we keep you safe</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-[2rem] shadow-[0_20px_40px_-18px_rgba(184,0,53,.35)]">
            <img src="/editorial-3 (1).jpg" alt="Our story" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-rose-200">Since day one</p>
              <p className="mt-1 font-heading text-xl font-semibold">Slower, kinder, more intentional dating.</p>
            </div>
          </div>
          <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8c0026]">Our story</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Born from dating fatigue, built for something better.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Too many platforms reward speed - more matches, more messages, less meaning. Lovinara flips that. We ask members to slow down, show who they really are, and invest in a handful of connections that actually matter.</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">From thoughtful profiles and shared values to limited active chats, every detail nudges you toward depth: longer conversations, kinder behaviour and dates that feel like continuations - not auditions.</p>
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-rose-700">The spark</p><h3 className="mt-1 text-lg font-bold text-slate-900">Our story begins</h3><p className="mt-2 text-sm leading-6 text-slate-600">Lovinara started with a simple frustration: dating apps felt like games of attention, not paths to connection.</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-rose-700">The shift</p><h3 className="mt-1 text-lg font-bold text-slate-900">Designed for depth</h3><p className="mt-2 text-sm leading-6 text-slate-600">We built limited connection slots, thoughtful prompts and verified profiles - so people invest in real conversation.</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-rose-700">Today</p><h3 className="mt-1 text-lg font-bold text-slate-900">A growing community</h3><p className="mt-2 text-sm leading-6 text-slate-600">Members now use Lovinara to meet with purpose - sharing culture, values and dreams before rushing to meet.</p></article>
        </div>
      </section>
      <section className="border-y border-rose-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
          <article className="relative min-h-[280px] overflow-hidden rounded-3xl p-8 text-white">
            <img src="/editorial-1 (1).jpg" alt="Our mission" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/85" />
            <div className="relative">
            <span className="inline-flex rounded-full bg-rose-600/30 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-rose-100">Mission</span>
            <h2 className="mt-4 text-2xl font-bold">Help people love with purpose.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">Our mission is to give every member the tools, safety and space to build genuine relationships - through intentional profiles, respectful communication and community standards that protect vulnerability.</p>
            </div>
          </article>
          <article className="relative overflow-hidden rounded-3xl p-8 text-white">
            <img src="/editorial-2 (1).jpg" alt="Vision" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#8c0026]/95 via-[#8c0026]/85 to-slate-950/80" />
            <div className="relative">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">Vision</span>
            <h2 className="mt-4 text-2xl font-bold">A world where connection feels human again.</h2>
            <p className="mt-3 text-sm leading-7 text-rose-50">We envision a global community where technology deepens romance instead of cheapening it - where people across countries and cultures meet with curiosity, honesty and care.</p>
            </div>
          </article>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker flex items-center justify-center gap-2"><Sparkles size={14} /> Values</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">What we stand for, every day</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">These principles shape our product, our moderation and how we show up for members.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-base font-bold text-slate-900">Intentionality over impulse</h3><p className="mt-2 text-[13px] leading-6 text-slate-600">Fewer, better connections. We limit noise so every conversation has room to breathe and grow.</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-base font-bold text-slate-900">Safety with dignity</h3><p className="mt-2 text-[13px] leading-6 text-slate-600">Verification, clear controls and human review keep the community respectful without feeling policed.</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-base font-bold text-slate-900">Conversation first</h3><p className="mt-2 text-[13px] leading-6 text-slate-600">Profiles are conversation starters, not shop windows. Depth matters more than first impressions.</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-base font-bold text-slate-900">Respect for every story</h3><p className="mt-2 text-[13px] leading-6 text-slate-600">Every background, belief and pace of love is welcome here. Kindness is non-negotiable.</p></article>
        </div>
      </section>
      <section className="relative overflow-hidden text-white">
        <img src="/curated-1 (1).jpg" alt="Lovinara impact" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-rose-300">Impact</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Small by design, big on meaning</h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">We measure success in depth - not downloads. Fewer distractions, more dates that matter.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-4xl font-extrabold text-rose-300">92%</p><p className="mt-2 text-sm font-bold">say conversations feel more meaningful</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-4xl font-extrabold text-rose-300">3</p><p className="mt-2 text-sm font-bold">active connections at a time by design</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-4xl font-extrabold text-rose-300">40+</p><p className="mt-2 text-sm font-bold">countries with active members</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-4xl font-extrabold text-rose-300">24/7</p><p className="mt-2 text-sm font-bold">safety review and support</p></div>
          </div>
        </div>
      </section>
      <section className="border-y border-rose-100 bg-[#f2f4f6] px-5 py-16 md:px-10 md:py-20">
        <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm md:p-12">
          <h2 className="mx-auto mt-2 max-w-xl text-3xl font-extrabold tracking-tight text-slate-900">Ready for slower, kinder, more intentional dating?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">Create a profile that reflects who you are - and meet people ready to do the same.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="button button-primary">Create your profile</Link>
            <Link to="/pricing" className="button button-quiet">See membership plans</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
