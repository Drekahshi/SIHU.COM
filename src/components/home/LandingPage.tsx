"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, Megaphone, Leaf, Eye, ShieldAlert, Newspaper, Users, Coins, Building2, Laptop, ShieldCheck,
  MapPin, Mail, Phone, Bot, Send, MessageCircle, Clock, CheckCircle2,
} from "lucide-react";
import type { Article } from "@/constants/articles";
import { articleService } from "@/services/articleService";

/*
 * The SIHU home page: who SIHU is, what it does, the latest stories, and
 * how to reach the team. Same words, logo and photos as before; a calmer,
 * modern layout that works on phones.
 */

const SIHU_EMAIL = "sangoinformationhub@gmail.com";
const SIHU_PHONE = "0722 318 820";
const SIHU_WHATSAPP = "https://wa.me/254722318820";
const SIHU_TELEGRAM = "https://t.me/SihuHubBot";

const PILLARS = [
  { Icon: Megaphone, title: "Public engagement", text: "Public engagement on developmental issues through digital media and public forums." },
  { Icon: Leaf, title: "Climate accountability", text: "Accountability demand on climate change and preservation of the Lake Victoria ecosystem." },
  { Icon: Eye, title: "Public watchdog", text: "Amplifying community concerns on human rights and development." },
  { Icon: ShieldAlert, title: "Safety and environment", text: "Sensitizing communities on the dangers of cross-border insecurity and on environmental protection." },
];

const OBJECTIVES = [
  { Icon: Newspaper, title: "Quality content", text: "Producing professional content through a strong newsgathering network." },
  { Icon: Users, title: "Civic engagement", text: "Building stakeholder networks and community involvement." },
  { Icon: Coins, title: "Resources", text: "Sustainability through financial and human resource mobilization." },
  { Icon: Building2, title: "Strong institution", text: "Modern equipment and strong editorial skills." },
  { Icon: Laptop, title: "ICT integration", text: "Weaving digital and traditional channels into one production pipeline." },
  { Icon: ShieldCheck, title: "Eco watchdog", text: "Demanding accountability on preserving the Lake Victoria ecosystem." },
];

const STATS = [
  { value: 10, suffix: "", label: "counties in the Kenyan basin" },
  { value: 40, suffix: "M+", label: "people depend on the lake" },
  { value: 3, suffix: "", label: "countries share Lake Victoria" },
  { value: 90, suffix: "%", label: "of the region's city water comes from the lake" },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const } }),
};

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`text-[13px] font-bold uppercase tracking-[0.14em] ${light ? "text-sky-300" : "text-sky-700"}`}>{children}</p>;
}

export default function LandingPage() {
  const [stories, setStories] = useState<Article[]>([]);
  const [active, setActive] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let live = true;
    articleService.getArticles().then((a) => { if (live) setStories(a.slice(0, 6)); }).catch(() => {});
    return () => { live = false; };
  }, []);

  // The hero story card turns every 6 seconds.
  useEffect(() => {
    if (stories.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % Math.min(stories.length, 4)), 6000);
    return () => clearInterval(t);
  }, [stories.length]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    // The site has no mail server: open the visitor's email app, ready to send.
    const subject = `Message from ${form.name}`;
    const body = `${form.message}\n\nFrom: ${form.name} (${form.email})`;
    window.location.href = `mailto:${SIHU_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const story = stories[active];

  return (
    <div className="bg-white text-slate-900">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-slate-950 pt-[72px]">
        <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: "easeOut" }}>
          <Image src="/images/lake-victoria-sunrise-hd.png" alt="" fill priority quality={85} sizes="100vw" className="object-cover object-[center_45%]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/80 to-transparent" />

        <div className="relative container mx-auto max-w-7xl px-4 lg:px-8 py-16 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div variants={fade} initial="hidden" animate="show" custom={0} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-[13px] font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Sango Information Hub · Busia, Kenya
            </motion.div>
            <motion.h1 variants={fade} initial="hidden" animate="show" custom={1} className="font-heading text-white text-[40px] leading-[1.08] sm:text-6xl lg:text-[68px] font-bold mt-6">
              Elevating environmental governance <span className="text-sky-300">around Lake Victoria.</span>
            </motion.h1>
            <motion.p variants={fade} initial="hidden" animate="show" custom={2} className="text-slate-200 text-lg md:text-xl leading-relaxed mt-6 max-w-2xl">
              We care about the lake. Community correspondents report on the environment, development and governance across the Lake Victoria Basin, so people can act on trusted information.
            </motion.p>
            <motion.div variants={fade} initial="hidden" animate="show" custom={3} className="flex flex-wrap gap-3 mt-9">
              <Link href="/portal" className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-[16px] font-semibold shadow-lg shadow-sky-500/30 transition-colors">
                Read the latest news <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#story" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/25 text-white text-[16px] font-semibold transition-colors">
                Our story
              </a>
            </motion.div>
          </div>

          {/* Latest story, turning */}
          <motion.div variants={fade} initial="hidden" animate="show" custom={4} className="lg:col-span-5">
            {story ? (
              <div className="bg-white/95 backdrop-blur rounded-3xl p-3 shadow-2xl max-w-md lg:ml-auto">
                <Link href={`/portal/article/${story.id}`} className="group block">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
                    <motion.div key={story.id} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                      <Image src={story.image || "/images/lake-victoria-bg.png"} alt="" fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
                    </motion.div>
                    <span className="absolute top-3 left-3 bg-white text-slate-900 text-[12px] font-semibold px-2.5 py-1 rounded-full">Latest story</span>
                  </div>
                  <div className="px-3 pt-4 pb-3">
                    <p className="text-[12.5px] font-semibold text-sky-700">{story.category}</p>
                    <motion.h2 key={`t-${story.id}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-[19px] font-bold leading-snug mt-1 line-clamp-2 group-hover:text-sky-700 transition-colors">{story.title}</motion.h2>
                    <p className="flex items-center gap-1.5 text-[13px] text-slate-500 mt-2"><span className="font-semibold text-slate-700">{story.author}</span> · <Clock size={13} /> {story.time}</p>
                  </div>
                </Link>
                <div className="flex items-center justify-between px-3 pb-2">
                  <div className="flex gap-1.5" role="tablist" aria-label="Latest stories">
                    {stories.slice(0, 4).map((s, i) => (
                      <button key={s.id} role="tab" aria-selected={i === active} aria-label={`Story ${i + 1}`} onClick={() => setActive(i)}
                        className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-sky-500" : "w-3 bg-slate-300 hover:bg-slate-400"}`} />
                    ))}
                  </div>
                  <Link href="/portal" className="text-[13px] font-semibold text-sky-700 hover:text-sky-900">All news</Link>
                </div>
              </div>
            ) : (
              <div className="hidden lg:block h-[380px] max-w-md ml-auto rounded-3xl bg-white/10 animate-pulse" />
            )}
          </motion.div>
        </div>
      </section>

      {/* ===== THE LAKE IN NUMBERS ===== */}
      <section className="bg-slate-950 text-white border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={s.label} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
              <p className="font-heading text-4xl md:text-5xl font-bold text-sky-300">{s.value}{s.suffix}</p>
              <p className="text-[14px] text-slate-300 mt-1 leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section id="story" className="scroll-mt-20 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="font-heading text-[34px] md:text-[44px] font-bold leading-tight mt-3">Community media for the Lake Victoria Basin</h2>
            <p className="text-[17px] text-slate-600 leading-relaxed mt-6">
              Sango Information Hub (SIHU) is a registered community media initiative that works on knowledge management and information sharing on natural resources, environmental protection and development around the Lake Victoria Basin in Kenya.
            </p>
            <p className="text-[17px] text-slate-600 leading-relaxed mt-4">
              We work through community involvement: producing radio content, gathering and sharing digital information, and running a community information and traditional knowledge restoration centre.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "The basin covers ten counties in Kenya, mostly in Western and Nyanza, nearly 10% of Kenya's territory, and is densely populated.",
                "Our community correspondents produce development news and environmental protection stories from across the basin.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[16px] text-slate-700 leading-relaxed"><CheckCircle2 size={20} className="text-sky-600 shrink-0 mt-0.5" /> {t}</li>
              ))}
            </ul>
            <p className="inline-flex items-center gap-2 mt-8 text-[14px] font-semibold text-slate-500"><MapPin size={16} className="text-sky-600" /> Fort Jesus Road, Busia Town</p>
          </motion.div>
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} custom={1} className="relative">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-[0_30px_80px_-30px_rgba(15,23,42,0.5)]">
              <Image src="/images/lake-victoria-bg.png" alt="Satellite view of Lake Victoria" fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-[280px]">
              <Image src="/images/sihu-logo.png" alt="" width={48} height={48} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-[15px] leading-tight">Sango Information Hub</p>
                <p className="text-[13px] text-slate-500">We care about Lake Victoria</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== WHAT WE STAND FOR ===== */}
      <section id="pillars" className="scroll-mt-20 relative overflow-hidden bg-slate-950 text-white py-20 md:py-28">
        <Image src="/images/sihu_network_bg.png" alt="" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
        <div className="relative container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow light>Key pillars</Eyebrow>
            <h2 className="font-heading text-[34px] md:text-[44px] font-bold leading-tight mt-3">What we stand for</h2>
            <p className="text-[17px] text-slate-300 leading-relaxed mt-4">The principles that drive our reporting across the Lake Victoria ecosystem.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {PILLARS.map((p, i) => (
              <motion.div key={p.title} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={i}
                className="group rounded-3xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-sky-400/40 p-7 transition-colors">
                <span className="w-12 h-12 rounded-2xl bg-sky-400/15 text-sky-300 flex items-center justify-center group-hover:scale-110 transition-transform"><p.Icon size={22} /></span>
                <p className="text-[12px] font-bold text-slate-400 mt-6">Pillar {i + 1}</p>
                <h3 className="font-heading text-[20px] font-bold mt-1">{p.title}</h3>
                <p className="text-[15px] text-slate-300 leading-relaxed mt-3">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OBJECTIVES ===== */}
      <section className="py-20 md:py-28 bg-[#f6f8fb]">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow>Our mission</Eyebrow>
            <h2 className="font-heading text-[34px] md:text-[44px] font-bold leading-tight mt-3">Core objectives</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {OBJECTIVES.map((o, i) => (
              <motion.div key={o.title} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={i % 3}
                className="group bg-white rounded-3xl p-7 border border-slate-200/80 hover:border-sky-200 hover:shadow-[0_20px_40px_-24px_rgba(2,132,199,0.45)] hover:-translate-y-1 transition-all">
                <span className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors"><o.Icon size={22} /></span>
                <h3 className="font-heading text-[20px] font-bold mt-5">{o.title}</h3>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">{o.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FROM THE NEWSROOM ===== */}
      {stories.length > 1 && (
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <Eyebrow>From the newsroom</Eyebrow>
                <h2 className="font-heading text-[34px] md:text-[44px] font-bold leading-tight mt-3">Latest stories</h2>
              </div>
              <Link href="/portal" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-300 hover:border-slate-900 text-[15px] font-semibold transition-colors w-fit">
                All news <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {stories.slice(0, 3).map((s, i) => (
                <motion.div key={s.id} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={i}>
                  <Link href={`/portal/article/${s.id}`} className="group block">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
                      <Image src={s.image || "/images/lake-victoria-bg.png"} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <p className="text-[13px] font-semibold text-sky-700 mt-4">{s.category}</p>
                    <h3 className="font-heading text-[19px] font-bold leading-snug mt-1 line-clamp-2 group-hover:text-sky-700 transition-colors">{s.title}</h3>
                    <p className="text-[14px] text-slate-600 leading-relaxed mt-2 line-clamp-2">{s.excerpt}</p>
                    <p className="text-[13px] text-slate-500 mt-3"><span className="font-semibold text-slate-700">{s.author}</span> · {s.time}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== REACH US ===== */}
      <section className="pb-6">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-sky-600 to-blue-800 text-white p-8 md:p-14 relative overflow-hidden">
            <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-white/10" />
            <div className="absolute right-20 -bottom-32 w-72 h-72 rounded-full bg-white/5" />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-heading text-[30px] md:text-[40px] font-bold leading-tight">Stay informed about the lake</h2>
                <p className="text-[17px] text-sky-100 leading-relaxed mt-4 max-w-lg">Get stories and alerts on Telegram or WhatsApp, or ask our AI assistant about the Lake Victoria Basin.</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { href: SIHU_TELEGRAM, Icon: Send, title: "Telegram", text: "Updates bot", ext: true },
                  { href: SIHU_WHATSAPP, Icon: MessageCircle, title: "WhatsApp", text: "Chat with us", ext: true },
                  { href: "/ai", Icon: Bot, title: "AI assistant", text: "Ask a question", ext: false },
                ].map((c) => {
                  const inner = (
                    <>
                      <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center"><c.Icon size={20} /></span>
                      <span className="block font-bold text-[16px] mt-4">{c.title}</span>
                      <span className="block text-[13.5px] text-sky-100">{c.text}</span>
                    </>
                  );
                  const cls = "block rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 p-5 transition-colors";
                  return c.ext
                    ? <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                    : <Link key={c.title} href={c.href} className={cls}>{inner}</Link>;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="scroll-mt-20 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="font-heading text-[34px] md:text-[44px] font-bold leading-tight mt-3">Start a conversation</h2>
            <p className="text-[17px] text-slate-600 leading-relaxed mt-4">Have a story, a tip or a question about the basin? Write to the SIHU team.</p>
            <div className="mt-8 space-y-4">
              <a href={`mailto:${SIHU_EMAIL}`} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-colors">
                <span className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center"><Mail size={20} /></span>
                <span><span className="block text-[13px] text-slate-500">Email</span><span className="block font-semibold text-[15px] break-all">{SIHU_EMAIL}</span></span>
              </a>
              <a href={`tel:+254722318820`} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-colors">
                <span className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center"><Phone size={20} /></span>
                <span><span className="block text-[13px] text-slate-500">Phone</span><span className="block font-semibold text-[15px]">{SIHU_PHONE}</span></span>
              </a>
            </div>
          </div>
          <form onSubmit={send} className="lg:col-span-3 bg-[#f6f8fb] rounded-[2rem] p-6 md:p-10 border border-slate-200/80 space-y-5">
            {sent && (
              <p className="flex items-start gap-2 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-[15px]" role="status">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> Your email app is opening with your message. Press send there to reach us.
              </p>
            )}
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="block text-[14px] font-semibold text-slate-700 mb-2">Your name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-[15px] focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15" placeholder="Full name" />
              </label>
              <label className="block">
                <span className="block text-[14px] font-semibold text-slate-700 mb-2">Your email</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-[15px] focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15" placeholder="you@example.com" />
              </label>
            </div>
            <label className="block">
              <span className="block text-[14px] font-semibold text-slate-700 mb-2">Message</span>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-[15px] leading-relaxed focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15 resize-y" placeholder="Tell us what is on your mind" />
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-sky-600 text-white text-[15px] font-semibold transition-colors">
              <Send size={17} /> Send message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
