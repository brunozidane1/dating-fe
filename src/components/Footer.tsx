import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState } from "react";

type FootLink = { label: string; to: string };
const links: Array<{ title: string; items: FootLink[] }> = [
  { title: "Product", items: [{ label: "Discover", to: "/discover" }, { label: "Matches", to: "/matches" }, { label: "Plans", to: "/pricing" }] },
  { title: "Support", items: [{ label: "Safety", to: "/safety" }, { label: "Help centre", to: "/help" }, { label: "Contact", to: "/contact" }] },
  { title: "Company", items: [{ label: "About", to: "/about" }, { label: "Community guidelines", to: "/guidelines" }, { label: "Privacy", to: "/privacy" }] },
];

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  return <footer className="bg-slate-950 text-slate-300"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8"><div className="lg:col-span-2"><Link to="/" className="flex items-center gap-2 font-heading text-xl font-extrabold text-white"><Heart size={18} fill="currentColor" className="text-rose-500"/>Lovinara</Link><p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">A considered space for people seeking real conversations and meaningful connection.</p><form className="mt-5 flex max-w-md gap-2" onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><label className="sr-only" htmlFor="newsletter">Email address</label><input id="newsletter" required type="email" placeholder="Email for thoughtful updates" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500"/><button className="rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-500">Join</button></form>{subscribed && <p className="mt-2 text-xs text-emerald-400">You are on the list. Thank you.</p>}</div>{links.map(({ title, items }) => <div key={title}><h2 className="text-sm font-bold text-white">{title}</h2><ul className="mt-4 space-y-3">{items.map(({ label, to }) => <li key={label}><Link to={to} className="text-sm text-slate-400 transition hover:text-white">{label}</Link></li>)}</ul></div>)}</div><div className="border-t border-slate-800"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8"><span>© {new Date().getFullYear()} Lovinara. Made for intentional connection.</span><div className="flex gap-4"><Link to="/terms" className="transition hover:text-white">Terms</Link><Link to="/privacy" className="transition hover:text-white">Privacy</Link><Link to="/cookies" className="transition hover:text-white">Cookies</Link></div></div></div></footer>;
}
