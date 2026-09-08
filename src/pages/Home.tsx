import { useEffect } from "react";
import type { ReactNode } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowRight, Heart, Lock, MessageCircle, ShieldCheck, Sparkles, UserRoundCheck, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const Image = "https://images.unsplash.com/";
const discovery = [
  { name: "Mutesi", age: 27, city: "Kigali", role: "Creative director", tags: ["Culture", "Music"], src: "/lume-3.jpg" },
  { name: "Ntwari", age: 31, city: "Kacyiru", role: "Software engineer", tags: ["Travel", "Literature"], src: "/lume-2.jpg" },
];
const steps = [
  { title: "Curate", copy: "Craft your narrative through the details, photographs, and prompts that show the person behind the profile.", src: "/editorial-1 (1).jpg" },
  { title: "Connect", copy: "Discover resonance through shared values, aesthetics, and relationship goals—not just proximity.", src: `${Image}photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85` },
  { title: "Converse", copy: "Limited active chats help every message carry more weight and leave room for genuine dialogue.", src: "/editorial-3 (1).jpg" },
];
steps[1].src = "/editorial-2 (1).jpg";
const testimonials = [
  { name: "Mugabo & Mutesi", quote: "Finally, a place where intention matters more than attention.", src: "/curated-1 (1).jpg", rotate: "-rotate-2" },
  { name: "Niyonzima & Aline", quote: "The three-chat limit completely changed how we connect. We're actually getting to know each other again.", src: "/curated-2 (1).jpg", rotate: "rotate-2 md:mt-16" },
  { name: "Kagabo & Uwase", quote: "It feels like a thoughtful community, made for romance.", src: "/hero.jpg", rotate: "-rotate-1 md:mt-32" },
];
const floatingHearts = [
  { left: "7%", top: "2%", size: 20, delay: "-1s", duration: "9s" },
  { left: "82%", top: "4%", size: 15, delay: "-5s", duration: "11s" },
  { left: "50%", top: "9%", size: 16, delay: "-3s", duration: "10s" },
  { left: "93%", top: "14%", size: 19, delay: "-6s", duration: "10s" },
  { left: "12%", top: "20%", size: 13, delay: "-2s", duration: "8s" },
  { left: "70%", top: "25%", size: 24, delay: "-7s", duration: "12s" },
  { left: "34%", top: "31%", size: 14, delay: "-4s", duration: "9s" },
  { left: "88%", top: "37%", size: 18, delay: "-8s", duration: "11s" },
  { left: "6%", top: "43%", size: 22, delay: "-3s", duration: "12s" },
  { left: "58%", top: "48%", size: 13, delay: "-6s", duration: "8s" },
  { left: "24%", top: "54%", size: 17, delay: "-2s", duration: "10s" },
  { left: "78%", top: "60%", size: 20, delay: "-5s", duration: "11s" },
  { left: "42%", top: "66%", size: 14, delay: "-7s", duration: "9s" },
  { left: "94%", top: "71%", size: 18, delay: "-1s", duration: "12s" },
  { left: "11%", top: "77%", size: 16, delay: "-4s", duration: "10s" },
  { left: "66%", top: "83%", size: 23, delay: "-8s", duration: "11s" },
  { left: "31%", top: "89%", size: 13, delay: "-6s", duration: "8s" },
  { left: "86%", top: "95%", size: 19, delay: "-3s", duration: "10s" },
  { left: "18%", top: "6%", size: 12, delay: "-7s", duration: "9s" },
  { left: "74%", top: "18%", size: 21, delay: "-4s", duration: "12s" },
  { left: "41%", top: "24%", size: 15, delay: "-9s", duration: "11s" },
  { left: "5%", top: "58%", size: 18, delay: "-5s", duration: "9s" },
  { left: "62%", top: "72%", size: 14, delay: "-2s", duration: "10s" },
  { left: "48%", top: "98%", size: 17, delay: "-6s", duration: "12s" },
];

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 650, once: true, offset: 45, easing: "ease-out-cubic" });
    const localImages: Record<string, string> = {
      "Couple sharing an intimate moment": "/hero.jpg",
      Sophia: "/lume-1.jpg",
      "Active match": "/editorial-2 (1).jpg",
    };
    Object.entries(localImages).forEach(([alt, src]) => {
      const image = document.querySelector<HTMLImageElement>(`img[alt="${alt}"]`);
      if (image) image.src = src;
    });
    const replacements: Record<string, string> = {
      Sophia: "Aline",
      "Amelia & Julian": "Mutesi & Ntwari",
      Lume: "Lovinara",
    };
    const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = textWalker.nextNode();
    while (node) {
      for (const [from, to] of Object.entries(replacements)) {
        if (node.nodeValue?.includes(from)) node.nodeValue = node.nodeValue.replaceAll(from, to);
      }
      node = textWalker.nextNode();
    }
  }, []);
  return <div className="home-page relative w-full max-w-full overflow-x-hidden bg-[#f7f9fb] text-[#191c1e] font-body">
    <div className="home-hearts" aria-hidden="true">{floatingHearts.map((heart, index) => <span key={index} className="home-heart" style={{ left: heart.left, top: heart.top, "--heart-delay": heart.delay, "--heart-duration": heart.duration } as React.CSSProperties}><Heart size={heart.size} fill="currentColor" strokeWidth={1.5}/></span>)}</div>
    <section className="relative flex min-h-[630px] items-center overflow-hidden md:min-h-[680px]">
      <img src={`${Image}photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1900&q=90`} alt="Couple sharing an intimate moment" className="absolute inset-0 h-full w-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-r from-[#f7f9fb]/95 via-[#f7f9fb]/72 to-[#f7f9fb]/10"/>
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 py-24 md:px-10">
        <div data-aos="fade-right" className="relative w-full max-w-[490px] rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_40px_-10px_rgba(184,0,53,.18)] backdrop-blur-2xl sm:p-8">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.13em] text-rose-800"><Heart size={14} fill="currentColor"/> Intentional connections</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.12] tracking-[-.04em] text-[#8c0026] sm:text-5xl">Find Your <br/><span className="font-light italic text-[#6f2f3a]">Intentional</span> Connection</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#5b4041] sm:text-base">Step away from endless swiping. Lume is a curated space for meaningful, sophisticated romance.</p>
          <Link to="/signup" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_-12px_rgba(184,0,53,.8)] transition hover:opacity-90 active:scale-95">Begin journey <ArrowRight size={16}/></Link>
          <article data-aos="zoom-in" data-aos-delay="350" className="absolute -bottom-24 left-4 z-10 w-64 rounded-2xl border border-white/70 bg-white/75 p-3 shadow-[0_20px_40px_-10px_rgba(184,0,53,.2)] backdrop-blur-2xl sm:-right-20 sm:bottom-10 sm:left-auto">
            <div className="flex items-center gap-3"><img className="h-12 w-12 rounded-full border-2 border-white object-cover" src={`${Image}photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=85`} alt="Sophia"/><div><h2 className="font-heading text-sm font-semibold">Sophia, 28</h2><p className="mt-0.5 text-[10px] text-slate-500">Art Director</p></div></div><div className="mt-3 flex items-center justify-between border-t border-rose-100 pt-2"><span className="flex items-center gap-1 text-[10px] font-bold text-rose-700"><Heart size={12} fill="currentColor"/>94% Match</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">2 miles</span></div>
          </article>
        </div>
      </div>
    </section>
    <div className="relative z-10 overflow-hidden border-y border-rose-800 bg-[#8c0026] py-3 text-white"><div className="home-ticker flex w-max items-center gap-8 whitespace-nowrap text-xs font-semibold"><TickerContent/><TickerContent/></div></div>
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20"><h2 data-aos="fade-up" className="font-heading text-2xl font-semibold tracking-[-.03em] sm:text-3xl">Curated Discoveries</h2><div className="mt-7 grid gap-5 md:grid-cols-12">{discovery.map((person, index) => <article data-aos={index === 0 ? "fade-right" : "fade-left"} key={person.name} className={`group relative overflow-hidden rounded-[2rem] shadow-[0_20px_40px_-18px_rgba(184,0,53,.35)] ${index === 0 ? "h-[380px] md:col-span-8 md:h-[520px]" : "h-[300px] md:col-span-4 md:h-[520px]"}`}><img src={person.src} alt={person.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"/><div className="absolute bottom-0 left-0 p-6 text-white"><h3 className="font-heading text-2xl font-semibold">{person.name}, {person.age}</h3><p className="mt-1 text-sm text-white/85">{person.role} · {person.city}</p><div className="mt-4 flex flex-wrap gap-2">{person.tags.map((tag) => <span key={tag} className="rounded-full border border-white/35 bg-white/15 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">{tag}</span>)}</div></div><Link to="/discover" aria-label={`Meet ${person.name}`} className="absolute inset-0"/></article>)}</div></section>
    <section className="border-y border-rose-100 bg-[#f2f4f6] px-5 py-16 md:px-10 md:py-20"><div className="mx-auto max-w-7xl"><h2 data-aos="fade-up" className="text-center font-heading text-2xl font-semibold tracking-[-.03em] sm:text-3xl">The Editorial Journey</h2><div className="mt-10 grid gap-8 md:grid-cols-3">{steps.map((step, index) => <article data-aos="fade-up" data-aos-delay={index * 120} key={step.title} className={index === 1 ? "md:mt-10" : index === 2 ? "md:mt-20" : ""}><div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_20px_38px_-20px_rgba(184,0,53,.4)]"><img src={step.src} alt={step.title} className="h-full w-full object-cover"/><span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#8c0026] font-heading text-lg text-white">{index + 1}</span></div><h3 className="mt-5 font-heading text-xl font-semibold text-[#8c0026]">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{step.copy}</p></article>)}</div></div></section>
    <section className="mx-auto max-w-7xl overflow-hidden px-5 py-16 md:px-10 md:py-20"><h2 data-aos="fade-up" className="font-heading text-2xl font-semibold tracking-[-.03em] sm:text-3xl">Voices of Lume</h2><div className="mt-8 grid gap-5 md:min-h-[450px] md:grid-cols-3 md:items-start md:px-12">{testimonials.map((story, index) => <article data-aos="zoom-in" data-aos-delay={index * 130} key={story.name} className={`rounded-2xl border border-rose-100 bg-white p-3 shadow-[0_20px_35px_-22px_rgba(15,23,42,.35)] ${story.rotate}`}><img src={story.src} alt={story.name} className="h-44 w-full rounded-xl object-cover"/><p className="mt-3 text-sm italic leading-6 text-slate-600">“{story.quote}”</p><p className="mt-3 text-xs font-bold text-[#8c0026]">— {story.name}</p></article>)}</div></section>
    <section className="border-y border-rose-100 bg-[#e6e8ea] px-5 py-16 md:px-10 md:py-20"><div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2"><div data-aos="fade-right"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8c0026]">Lume Premium</p><h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-.04em]">Data-Driven Romance</h2><p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">Unlock insights into your connection patterns. See when you resonate, when you chat most, and what makes your conversations click.</p><Link to="/pricing" className="mt-6 inline-flex rounded-full bg-[#8c0026] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#b80035]">Explore Premium Insights</Link></div><div data-aos="fade-left" className="grid grid-cols-2 gap-3"><Insight label="Compatibility" value="87%" caption="Avg. match resonance"/><Insight label="Golden hour" value="8 PM" caption="Peak conversation time"/><div className="col-span-2 rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-semibold text-slate-500">Top interest clusters</p><div className="mt-4 flex flex-wrap gap-2">{["Modern Art", "Specialty Coffee", "Indie Cinema", "Architecture"].map((name) => <span className="rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-semibold text-rose-800" key={name}>{name}</span>)}</div></div></div></div></section>
    <section className="relative overflow-hidden bg-[#f2f4f6] px-5 py-16 text-center md:px-10 md:py-20"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,0,53,.12),transparent_36%)]"/><div className="relative mx-auto max-w-4xl"><UsersRound data-aos="zoom-in" className="mx-auto text-[#8c0026]" size={40}/><h2 data-aos="fade-up" className="mt-4 font-heading text-3xl font-semibold tracking-[-.04em]">The Inner Circle Philosophy</h2><p data-aos="fade-up" className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">Quality requires focus. Lume limits active conversations to three, ensuring every connection receives the attention it deserves.</p><div className="mt-9 grid gap-4 md:grid-cols-3"><Slot type="active" title="Active" text="Currently connecting"/><Slot type="pending" title="Pending" text="Awaiting reply"/><Slot type="available" title="Available" text="Space for someone new"/></div></div></section>
    <section className="border-y border-rose-100 bg-white px-5 py-10 md:px-10"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row"><h3 className="font-heading text-lg font-semibold">Active Lume Hubs</h3><div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">{["New York", "London", "Paris", "Tokyo", "Berlin", "Kigali"].map((city) => <span className="flex items-center gap-2" key={city}><i className="h-2 w-2 rounded-full bg-[#8c0026]"/>{city}</span>)}</div></div></section>
    <section className="bg-[#f2f4f6] px-5 py-16 md:px-10 md:py-20"><div className="mx-auto max-w-7xl"><div data-aos="fade-up" className="mx-auto max-w-2xl text-center"><h2 className="font-heading text-3xl font-semibold tracking-[-.04em]">Intimacy built on trust</h2><p className="mt-3 text-sm leading-7 text-slate-600">Meaningful connections start with a secure environment. Every part of Lume is built around a private, verified community.</p></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><SafetyCard icon={<UserRoundCheck/>} title="Human verification" copy="Every member is reviewed to support an authentic community."/><SafetyCard icon={<Lock/>} title="Private by design" copy="Your conversations and profile details stay in your control."/><SafetyCard icon={<ShieldCheck/>} title="Community standards" copy="A clear code of conduct keeps the space respectful."/><SafetyCard icon={<MessageCircle/>} title="Safety concierge" copy="Guidance is there whenever you need it."/></div></div></section>
  </div>;
}
function TickerContent() { return <div className="flex items-center gap-8"><span className="flex items-center gap-2"><Heart size={13} fill="currentColor"/>Amelia & Julian just matched!</span><span className="opacity-50">•</span><span className="flex items-center gap-2"><MessageCircle size={13}/>5,420 intentional conversations today</span><span className="opacity-50">•</span><span className="flex items-center gap-2"><Sparkles size={13}/>New member from Kigali joined</span><span className="opacity-50">•</span><span>320 coffee dates planned this weekend</span></div>; }
function Insight({label, value, caption}: {label: string; value: string; caption: string}) { return <div className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-3 font-heading text-3xl font-semibold text-[#8c0026]">{value}</p><p className="mt-1 text-[10px] text-slate-500">{caption}</p></div>; }
function Slot({type, title, text}: {type: "active" | "pending" | "available"; title: string; text: string}) { const active = type === "active"; return <article data-aos="fade-up" className={`flex flex-col items-center rounded-3xl border p-6 ${type === "available" ? "border-dashed border-rose-200 bg-transparent" : "border-rose-100 bg-white shadow-sm"}`}><div className={`grid h-16 w-16 place-items-center rounded-full ${active ? "border-4 border-[#8c0026]" : "bg-slate-100 text-slate-400"}`}>{active ? <img className="h-full w-full rounded-full object-cover" src={`${Image}photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=85`} alt="Active match"/> : type === "pending" ? <MessageCircle size={26}/> : <Sparkles size={26}/>}</div><h3 className={`mt-4 font-heading text-lg font-semibold ${active ? "text-slate-800" : "text-slate-500"}`}>{title}</h3><p className="mt-1 text-xs text-slate-500">{text}</p></article>; }
function SafetyCard({icon, title, copy}: {icon: ReactNode; title: string; copy: string}) { return <article data-aos="fade-up" className="rounded-2xl bg-white p-5 shadow-sm"><span className="text-[#8c0026]">{icon}</span><h3 className="mt-4 font-heading text-base font-semibold">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-600">{copy}</p></article>; }
