"use client";

import React, { useState, useEffect } from "react";
import NewsHeader from "./NewsHeader";
import NewsHero from "./NewsHero";
import NewsCategories from "./NewsCategories";
import Link from "next/link";
import { Article, defaultTicker, Podcast, Event } from "@/constants/articles";
import { articleService } from "@/services/articleService";
import { podcastService } from "@/services/podcastService";
import { eventService } from "@/services/eventService";

export default function NewsPortal() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickerItems, setTickerItems] = useState<{id: string, text: string}[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null);
  
  // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // Read from localStorage or use defaults via services
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArticles(articleService.getArticles());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPodcasts(podcastService.getPodcasts());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvents(eventService.getEvents());

    const storedTicker = localStorage.getItem("sango_ticker");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTickerItems(storedTicker ? JSON.parse(storedTicker) : defaultTicker);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Loading Sango News...</p>
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
    <div className="bg-background min-h-screen">
      {/* 1. BREAKING NEWS TICKER */}
      <div className="border-b border-border bg-slate-50 dark:bg-slate-900/50 py-3">
        <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center">
                <span className="bg-destructive text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-tighter shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse">BREAKING</span>
                <div className="ticker-wrapper ml-6 flex-1 overflow-hidden relative">
                    <div className="animate-ticker text-sm font-semibold text-foreground whitespace-nowrap">
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-4 mb-8 gap-4">
                <h3 className="text-2xl font-heading font-bold text-foreground relative after:content-[''] after:absolute after:bottom-[-16px] after:left-0 after:w-16 after:h-1 after:bg-primary">
                  Latest News
                </h3>
                <div className="flex gap-4 items-center w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <input 
                            type="text" 
                            placeholder="Search articles..." 
                            className="w-full pl-9 pr-4 py-1.5 rounded-full text-sm border border-border bg-card focus:outline-none focus:border-primary transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {latestArticles.map((article, i) => (
                    <article key={article.id} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:-translate-y-2 group h-full flex flex-col transition-all duration-300">
                        <div className="aspect-[16/10] overflow-hidden relative">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute top-4 left-4">
                                <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg border border-white/20">
                                    {article.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-7 flex flex-col flex-1">
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    {article.time}
                                </span>
                                <span className="text-primary opacity-50">•</span>
                                <span className="flex items-center gap-1.5 italic">
                                    {article.author}
                                </span>
                            </div>
                            
                            <Link href={`/portal/article/${article.id}`}>
                                <h4 className="text-xl font-heading font-bold mb-4 leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                                    {article.title}
                                </h4>
                            </Link>
                            
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                                {article.excerpt}
                            </p>
                            
                            <div className="mt-auto pt-6 border-t border-border flex justify-between items-center">
                                <Link 
                                    href={`/portal/article/${article.id}`}
                                    className="text-xs font-bold text-foreground flex items-center gap-2 group/btn hover:text-primary transition-colors"
                                >
                                    Read Article
                                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                </Link>
                                <button 
                                    onClick={() => handleReadArticle(article.title + ". " + article.excerpt)}
                                    className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-inner group/audio"
                                    title="Listen to story"
                                >
                                    <svg className="w-5 h-5 transition-transform group-hover/audio:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>

        {/* 5. PODCASTS */}
        <section id="podcasts" className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-14 relative overflow-hidden shadow-2xl">
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

             <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 mb-10 relative z-10">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h3 className="text-3xl font-heading font-bold text-white mb-2 tracking-tight">Popular Podcasts</h3>
                    <p className="text-slate-400 text-sm">Deep dives into Lake Victoria&apos;s environmental protection.</p>
                </div>
                <Link href="/portal/podcasts" className="bg-white/10 hover:bg-white text-white hover:text-slate-900 transition-all px-8 py-3 rounded-full text-sm font-bold border border-white/10 shadow-lg">
                    Browse All Episodes
                </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
                 {podcasts.map((podcast, i) => (
                     <div key={i} onClick={() => setPlayingPodcast(podcast.id)} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center gap-6 group cursor-pointer hover:shadow-xl">
                         <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden relative shadow-2xl">
                             <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg text-primary">
                                     <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                 </div>
                             </div>
                         </div>
                         <div>
                             <h5 className="font-heading font-bold text-white text-lg mb-1 leading-tight">{podcast.title}</h5>
                             <p className="text-xs text-slate-400 line-clamp-1 mb-3">{podcast.episode}</p>
                             <div className="flex items-center gap-4 text-[10px] text-primary font-black uppercase tracking-[0.2em]">
                                 <span className="flex items-center gap-1.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    {podcast.duration}
                                 </span>
                                 <span className="opacity-40">|</span>
                                 <span>{playingPodcast === podcast.id ? "Now Playing" : "Listen Now"}</span>
                             </div>
                             {playingPodcast === podcast.id && (
                                <audio controls autoPlay className="w-full mt-3 h-8 scale-90 origin-left">
                                    <source src="" type="audio/mp3" />
                                </audio>
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
        <section id="events" className="animate-fade-in pb-12">
             <div className="flex justify-between items-end border-b border-border pb-4 mb-8">
                <h3 className="text-2xl font-heading font-bold text-foreground relative after:content-[''] after:absolute after:bottom-[-16px] after:left-0 after:w-16 after:h-1 after:bg-primary">
                  Upcoming Events
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((event, i) => (
                    <div key={i} className="bg-card border-l-[6px] border-primary p-6 rounded-r-2xl shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="bg-primary/10 text-primary font-black text-[10px] uppercase mb-4 px-3 py-1 rounded-full w-fit tracking-widest leading-none">
                            {event.date}
                        </div>
                        <h4 className="font-heading font-bold text-foreground text-lg mb-3 leading-tight">{event.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <svg className="w-4 h-4 text-primary opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {event.location}
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
