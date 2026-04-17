"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NewsHeader from "./NewsHeader";
import NewsHero from "./NewsHero";
import NewsCategories from "./NewsCategories";
import Link from "next/link";
import Image from "next/image";
import { Article, defaultTicker, Podcast, Event } from "@/constants/articles";
import { articleService } from "@/services/articleService";
import { podcastService } from "@/services/podcastService";
import { eventService } from "@/services/eventService";
import {
  Clock,
  User,
  ArrowRight,
  Volume2,
  VolumeX,
  MapPin,
  Radio,
  PlayCircle,
  Tag,
  CalendarDays,
  Search,
  Mic,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

export default function NewsPortal() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickerItems, setTickerItems] = useState<{id: string, text: string}[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null);
  
   
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    // Check if we need to force reset for the new real-world content migration
    const MIGRATION_VERSION = "2026_04_03_REAL_NEWS";
    const currentVersion = localStorage.getItem("sango_news_version");

    if (currentVersion !== MIGRATION_VERSION) {
        localStorage.removeItem("sango_articles");
        localStorage.removeItem("sango_podcasts");
        localStorage.removeItem("sango_ticker");
        localStorage.setItem("sango_news_version", MIGRATION_VERSION);
    }

    // Load data asynchronously
    const loadData = async () => {
      try {
        const [articlesData, podcastsData, eventsData] = await Promise.all([
          articleService.getArticles(),
          podcastService.getPodcasts(),
          eventService.getEvents()
        ]);
        setArticles(articlesData);
        setPodcasts(podcastsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to defaults if services fail
        setArticles([]);
        setPodcasts([]);
        setEvents([]);
      }
    };

    loadData();

    const storedTicker = localStorage.getItem("sango_ticker");
     
    setTickerItems(storedTicker ? JSON.parse(storedTicker) : defaultTicker);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full mb-4 border border-primary/30 shadow-[0_0_20px_rgba(88,179,242,0.2)]"></div>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Initializing Intelligence Feed...</p>
        </div>
    </div>;
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const mainArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const sideArticles = filteredArticles.slice(1, 4);
  const latestArticles = filteredArticles.slice(4);

  const handleReadArticle = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 via-white to-blue-50/30 min-h-screen relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Background Decor - Premium Light Blue */}
      <div className="fixed inset-0 bg-grid opacity-[0.025] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-[700px] bg-gradient-to-b from-sky-100/60 via-blue-50/30 to-transparent pointer-events-none" />
      <div className="fixed -top-24 -right-24 w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] bg-sky-300/20 rounded-full blur-[90px] sm:blur-[110px] md:blur-[140px] pointer-events-none" />
      <div className="fixed -top-12 -left-12 w-96 h-96 bg-blue-200/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. BREAKING NEWS TICKER - Professional Azure */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-xl py-3.5 relative z-20 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center">
                <span className="bg-rose-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_15px_rgba(225,29,72,0.4)] animate-pulse">Live Update</span>
                <div className="ticker-wrapper ml-6 flex-1 overflow-hidden relative">
                    <div className="animate-ticker text-[10px] font-black uppercase tracking-widest text-slate-300">
                        {tickerItems.map(item => (
                            <React.Fragment key={item.id}>
                                <span className="mx-6 text-primary font-bold">•</span> {item.text}
                            </React.Fragment>
                        ))}
                        {/* Duplicate for seamless looping */}
                        {tickerItems.map(item => (
                            <React.Fragment key={item.id + "_dup"}>
                                <span className="mx-6 text-primary font-bold">•</span> {item.text}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10 space-y-20">
          
        {/* 2. HERO GRID */}
        <NewsHero mainArticle={mainArticle} sideArticles={sideArticles} />

        {/* 3. CATEGORIES STRIP */}
        <NewsCategories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {/* 4. LATEST NEWS */}
         <section id="latest-news">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-4 mb-8 gap-4">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                     Latest Intelligence
                   </h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Basin Environmental Feed</p>
                </div>
                <div className="flex gap-4 items-center w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <input 
                            type="text" 
                            placeholder="Search Intelligence..." 
                            className="w-full pl-10 pr-4 py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest border border-sky-100 bg-white/60 backdrop-blur-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-sky-600" strokeWidth={3} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestArticles.map((article, i) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="group relative glass-premium bg-sky-50/60 rounded-3xl overflow-hidden
                        border border-white/50 hover:border-white/90
                        shadow-lg hover:shadow-2xl hover:shadow-sky-300/20
                        hover:-translate-y-2 hover:scale-[1.02] hover:bg-sky-50/80
                        h-full flex flex-col transition-all duration-500 focus-within:ring-2 focus-within:ring-sky-400 focus-within:ring-offset-2"
                    >
                        {/* Category badge */}
                        <Link href={`/portal/article/${article.id}`} className="aspect-[16/10] overflow-hidden relative block cursor-pointer focus:outline-none bg-slate-100">
                            <Image
                              src={article.image || '/assets/placeholder-article.jpg'}
                              alt={article.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 via-sky-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 bg-sky-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 mix-blend-overlay" />
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                <span className="flex items-center gap-1.5 bg-sky-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/20">
                                    <Tag size={10} strokeWidth={2.5} />
                                    {article.category}
                                </span>
                            </div>
                        </Link>

                        <div className="p-7 flex flex-col flex-1 relative">
                            {/* Ambient light blobs */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/30 rounded-full blur-3xl group-hover:bg-sky-300/40 transition-colors duration-500" />

                            {/* Meta row */}
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-4 font-semibold uppercase tracking-wider relative z-10">
                                <span className="flex items-center gap-1.5">
                                    <Clock size={11} strokeWidth={2.5} className="text-sky-400" />
                                    {article.time}
                                </span>
                                <span className="text-sky-300">·</span>
                                <span className="flex items-center gap-1.5">
                                    <User size={11} strokeWidth={2.5} className="text-sky-400" />
                                    {article.author}
                                </span>
                            </div>

                            {/* Title */}
                            <Link href={`/portal/article/${article.id}`}>
                                <h4 className="text-base font-black text-slate-900 mb-3 leading-snug group-hover:text-sky-600 transition-colors cursor-pointer line-clamp-2 tracking-tight relative z-10">
                                    {article.title}
                                </h4>
                            </Link>

                            {/* Excerpt */}
                            <Link href={`/portal/article/${article.id}`} className="cursor-pointer flex-1">
                                <p className="text-slate-500 text-xs font-normal line-clamp-3 mb-6 leading-relaxed relative z-10 group-hover:text-slate-600 transition-colors">
                                    {article.excerpt}
                                </p>
                            </Link>

                            {/* Footer row */}
                            <div className="mt-auto pt-5 border-t border-sky-100 flex justify-between items-center relative z-10">
                                <Link
                                    href={`/portal/article/${article.id}`}
                                    className="flex items-center gap-2 text-[11px] font-bold text-sky-600 hover:text-sky-800 transition-colors group/btn"
                                >
                                    Read Article
                                    <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-1" />
                                </Link>

                                <button
                                    onClick={() => handleReadArticle(article.title + ". " + article.excerpt)}
                                    aria-label={`Listen to article: ${article.title}`}
                                    className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400
                                      hover:text-sky-600 transition-all group/audio px-3 py-2 rounded-xl
                                      hover:bg-sky-50 border border-transparent hover:border-sky-100
                                      focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1"
                                >
                                    <Volume2 size={14} strokeWidth={2} className="transition-transform group-hover/audio:scale-110 group-hover/audio:rotate-[-10deg]" />
                                    Listen
                                </button>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
        <section id="podcasts" className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl shadow-blue-900/5">
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
             <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-[100px] -ml-40 -mb-40"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid opacity-[0.02]" />

              <div className="flex flex-col md:flex-row justify-between items-center border-b border-sky-100 pb-8 mb-12 relative z-10">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Intelligence Briefings</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auditory deep-dives into basin protection</p>
                </div>
                <Link href="/portal/podcasts" className="group/nav bg-sky-100/50 hover:bg-sky-500 text-sky-600 hover:text-white transition-all px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-sky-200/50 hover:border-sky-400 shadow-sm flex items-center gap-2">
                    <Mic size={14} strokeWidth={3} className="transition-transform group-hover/nav:scale-110" />
                    Access Voice Registry
                </Link>
            </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
                 {podcasts.map((podcast, i) => (
                     <div key={i} onClick={() => setPlayingPodcast(podcast.id)} className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-sky-100/50 hover:bg-white/80 hover:border-sky-300 transition-all duration-300 flex items-center gap-6 group cursor-pointer hover:shadow-xl">
                         <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden relative shadow-2xl border border-white/5 bg-slate-100">
                             <Image 
                               src={podcast.image || '/assets/placeholder-podcast.jpg'} 
                               alt={podcast.title} 
                               fill
                               sizes="80px"
                               className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" 
                             />
                             <div className="absolute inset-0 bg-sky-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg text-sky-500 scale-90 group-hover:scale-100 transition-transform">
                                     <PlayCircle size={20} fill="currentColor" stroke="white" />
                                 </div>
                             </div>
                         </div>
                          <div>
                             <h5 className="font-black text-slate-900 text-sm mb-1 leading-tight uppercase tracking-tight">{podcast.title}</h5>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest line-clamp-1 mb-3">{podcast.episode}</p>
                             <div className="flex items-center gap-4 text-[9px] text-sky-600 font-black uppercase tracking-[0.2em]">
                                 <span className="flex items-center gap-1.5 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100/50">
                                    <Clock size={12} strokeWidth={3} className="text-sky-400" />
                                    {podcast.duration}
                                 </span>
                                 <span className="opacity-40">|</span>
                                 <span className={playingPodcast === podcast.id ? "text-emerald-500 animate-pulse" : ""}>{playingPodcast === podcast.id ? "Receiving Data..." : "Decipher Audio"}</span>
                             </div>
                             {playingPodcast === podcast.id && (
                                <div className="mt-4 flex gap-1 h-3 items-end">
                                    {[1, 2, 3, 4, 5, 2, 1, 4, 3, 2].map((h, j) => (
                                        <motion.div 
                                          key={j}
                                          animate={{ height: ['20%', '100%', '20%'] }}
                                          transition={{ duration: 0.5 + (j * 0.1), repeat: Infinity }}
                                          className="w-1 bg-primary rounded-full"
                                        />
                                    ))}
                                </div>
                             )}
                         </div>
                     </div>
                 ))}
                 
                 {podcasts.length === 0 && (
                     <p className="text-slate-500 text-sm italic">No podcasts available yet.</p>
                 )}
            </div>
        </section>


        {/* 6. UPCOMING EVENTS */}
        {events.length > 0 && (
        <section id="events" className="animate-fade-in pb-20">
             <div className="flex justify-between items-end border-b border-sky-100 pb-4 mb-8">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                     Network Deployments
                   </h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Strategic Environment Operations</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((event, i) => (
                    <div key={i} className="group relative bg-white/60 backdrop-blur-md border-l-[4px] border-sky-500 p-7 rounded-r-[1.5rem] shadow-sm hover:shadow-xl hover:bg-white/80 transition-all duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-200/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all" />
                        <div className="bg-sky-100 text-sky-600 font-black text-[9px] uppercase mb-5 px-4 py-1.5 rounded-full w-fit tracking-[0.2em] leading-none border border-sky-200/50">
                            {event.date}
                        </div>
                        <h4 className="font-black text-slate-900 text-base mb-4 leading-tight uppercase tracking-tight group-hover:text-sky-600 transition-colors">{event.title}</h4>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                <MapPin size={14} strokeWidth={3} className="text-sky-500" />
                                {event.location}
                            </div>
                            <ArrowUpRight size={16} strokeWidth={3} className="text-slate-300 group-hover:text-sky-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
        )}
      </div>
    </div>
  );
}
