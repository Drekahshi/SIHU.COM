"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article, Podcast, Event } from "@/constants/articles";
import { articleService } from "@/services/articleService";
import { podcastService } from "@/services/podcastService";
import { eventService } from "@/services/eventService";

type TickerItem = { id: string; text: string };

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'article' | 'podcast' | 'event' | 'ticker'>('article');
  
  // States for Article
  const [articleTitle, setArticleTitle] = useState("");
  const [articleCategory, setArticleCategory] = useState("Politics");
  const [articleExcerpt, setArticleExcerpt] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleImage, setArticleImage] = useState("");
  const [articleAuthor, setArticleAuthor] = useState("");

  // States for Podcast
  const [podTitle, setPodTitle] = useState("");
  const [podEpisode, setPodEpisode] = useState("");
  const [podDuration, setPodDuration] = useState("");
  const [podImage, setPodImage] = useState("");

  // States for Event
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  // States for Ticker
  const [tickerText, setTickerText] = useState("");

  const [toast, setToast] = useState<{message: string, isError: boolean} | null>(null);
  
  // Lists
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [recentPodcasts, setRecentPodcasts] = useState<Podcast[]>([]);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);

  const loadData = () => {
      setRecentArticles(articleService.getArticles());
      setRecentPodcasts(podcastService.getPodcasts());
      setRecentEvents(eventService.getEvents());

      const storedTicker = localStorage.getItem("sango_ticker");
      if (storedTicker) setTickerItems(JSON.parse(storedTicker));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
     loadData();
  }, []);

  const showToast = (message: string, isError = false) => {
      setToast({ message, isError });
      setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
          setter(reader.result as string);
      };
      reader.readAsDataURL(file);
  };

  const handlePostArticle = (e: React.FormEvent) => {
      e.preventDefault();
      if (!articleTitle || !articleExcerpt || !articleImage || !articleAuthor) {
          showToast("Please fill all fields", true);
          return;
      }

      const newArticle: Article = {
          id: articleTitle.toLowerCase().replace(/\s+/g, '-'), // Better URL slugs
          title: articleTitle,
          category: articleCategory,
          excerpt: articleExcerpt,
          content: articleContent,
          image: articleImage,
          author: articleAuthor,
          time: "Just now",
          type: 'article'
      };

      const updatedArticles = [newArticle, ...recentArticles];
      articleService.saveArticles(updatedArticles);
      setRecentArticles(updatedArticles);
      
      // Reset Form
      setArticleTitle(""); setArticleExcerpt(""); setArticleContent(""); setArticleImage(""); setArticleAuthor("");
      showToast("Article published successfully to the portal!");
  };

  const handlePostPodcast = (e: React.FormEvent) => {
      e.preventDefault();
      if (!podTitle || !podEpisode || !podDuration || !podImage) {
          showToast("Please fill all fields", true);
          return;
      }

      const newPodcast: Podcast = {
          id: Date.now().toString(),
          title: podTitle,
          episode: podEpisode,
          duration: podDuration,
          image: podImage,
          type: 'podcast'
      };

      const updatedPodcasts = [newPodcast, ...recentPodcasts];
      podcastService.savePodcasts(updatedPodcasts);
      setRecentPodcasts(updatedPodcasts);
      
      // Reset Form
      setPodTitle(""); setPodEpisode(""); setPodDuration(""); setPodImage("");
      showToast("Podcast published successfully to the portal!");
  };

  const handlePostEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventDate || !eventLocation) {
        showToast("Please fill all fields", true);
        return;
    }

    const newEvent: Event = {
        id: Date.now().toString(),
        title: eventName,
        date: eventDate,
        location: eventLocation,
        image: "https://images.unsplash.com/photo-1595844784400-d85c493ecb05?w=400&q=80",
        description: "New event listed via Admin panel.",
        type: 'event'
    };

    const updated = [newEvent, ...recentEvents];
    eventService.saveEvents(updated);
    setRecentEvents(updated);
    setEventName(""); setEventDate(""); setEventLocation("");
    showToast("Event listed successfully!");
  };

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerText) return;

    const newItem = { id: Date.now().toString(), text: tickerText };
    const updated = [...tickerItems, newItem];
    localStorage.setItem("sango_ticker", JSON.stringify(updated));
    setTickerItems(updated);
    setTickerText("");
    showToast("Ticker item added!");
  };

  const handleDeleteArticle = (id: string) => {
      articleService.deleteArticle(id);
      setRecentArticles(articleService.getArticles());
      showToast("Article deleted");
  }

  const handleDeletePodcast = (id: string) => {
      podcastService.deletePodcast(id);
      setRecentPodcasts(podcastService.getPodcasts());
      showToast("Podcast deleted");
  }

  const handleDeleteEvent = (id: string) => {
      eventService.deleteEvent(id);
      setRecentEvents(eventService.getEvents());
      showToast("Event deleted");
  }

  const handleDeleteTicker = (id: string) => {
    const updated = tickerItems.filter(item => item.id !== id);
    localStorage.setItem("sango_ticker", JSON.stringify(updated));
    setTickerItems(updated);
  };

  const CATEGORIES = ["Politics", "Business", "Agriculture", "Health", "Education", "Environment", "News", "Sports"];

  return (
    <div className="max-w-6xl mx-auto py-8">
        {/* Admin Header with Logo */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <Link href="/" className="flex items-center">
                <Image 
                    src="/images/logo-main.png" 
                    alt="Sango Administration" 
                    width={200} 
                    height={54} 
                    className="h-12 w-auto"
                />
            </Link>
            <div className="text-center md:text-right">
                <h1 className="text-2xl font-heading font-bold text-slate-900 leading-tight">Post Management Terminal</h1>
                <p className="text-slate-500 text-sm">Welcome back. You are currently managing live portal content.</p>
            </div>
        </div>

        {toast && (
            <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-xl text-white font-medium z-50 animate-fade-in-up ${toast.isError ? 'bg-red-500' : 'bg-emerald-500'}`}>
                {toast.message}
            </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left: Forms */}
            <div className="xl:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex border-b border-slate-200">
                        <button 
                            onClick={() => setActiveTab('article')}
                            className={`flex-1 py-4 font-bold text-sm tracking-wide transition-colors ${activeTab === 'article' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <i className="fas fa-newspaper mr-2"></i> Articles
                        </button>
                        <button 
                            onClick={() => setActiveTab('podcast')}
                            className={`flex-1 py-4 font-bold text-sm tracking-wide transition-colors ${activeTab === 'podcast' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <i className="fas fa-podcast mr-2"></i> Podcasts
                        </button>
                        <button 
                            onClick={() => setActiveTab('event')}
                            className={`flex-1 py-4 font-bold text-sm tracking-wide transition-colors ${activeTab === 'event' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <i className="fas fa-calendar mr-2"></i> Events
                        </button>
                        <button 
                            onClick={() => setActiveTab('ticker')}
                            className={`flex-1 py-4 font-bold text-sm tracking-wide transition-colors ${activeTab === 'ticker' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <i className="fas fa-bolt mr-2"></i> Ticker
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* ARTICLE FORM */}
                        {activeTab === 'article' && (
                            <form onSubmit={handlePostArticle} className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Headline Title</label>
                                    <input type="text" value={articleTitle} onChange={e => setArticleTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="e.g. Action to enhance climate change resilience" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                        <select value={articleCategory} onChange={e => setArticleCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none">
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Author Name</label>
                                        <input type="text" value={articleAuthor} onChange={e => setArticleAuthor(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="e.g. Sango Info Hub" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image Upload</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, setArticleImage)} 
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                                    />
                                    {articleImage && (
                                        <div className="mt-4 w-32 h-24 relative rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                            <img src={articleImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Short Excerpt (Summary)</label>
                                    <input type="text" value={articleExcerpt} onChange={e => setArticleExcerpt(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="A brief summary for the preview card..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Story Content</label>
                                    <textarea 
                                        value={articleContent} 
                                        onChange={e => setArticleContent(e.target.value)}
                                        rows={8} 
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none resize-none" 
                                        placeholder="Write the full story here... This will be read by the AI voice narration."
                                    ></textarea>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                                        Publish to Portal
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* PODCAST FORM */}
                        {activeTab === 'podcast' && (
                            <form onSubmit={handlePostPodcast} className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Podcast Show Name</label>
                                    <input type="text" value={podTitle} onChange={e => setPodTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="e.g. Busia Today Podcast" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Episode Title</label>
                                    <input type="text" value={podEpisode} onChange={e => setPodEpisode(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="e.g. Episode 4: Lake Victoria Water Levels" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                                    <input type="text" value={podDuration} onChange={e => setPodDuration(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="e.g. 45 min" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Cover Artwork Upload</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, setPodImage)} 
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#38bdf8]/10 file:text-[#38bdf8] hover:file:bg-[#38bdf8]/20" 
                                    />
                                    {podImage && (
                                        <div className="mt-4 w-24 h-24 relative rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                            <img src={podImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                                        Publish Episode
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* EVENT FORM */}
                        {activeTab === 'event' && (
                            <form onSubmit={handlePostEvent} className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Event Name</label>
                                    <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="e.g. Sango Climate Summit" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Date & Time</label>
                                    <input type="text" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="e.g. April 15th, 2026 at 10:00 AM" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Location/Venue</label>
                                    <input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="e.g. Busia Town Hall" />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                                        List Event
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TICKER FORM */}
                        {activeTab === 'ticker' && (
                            <form onSubmit={handleAddTicker} className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ticker Text</label>
                                    <input type="text" value={tickerText} onChange={e => setTickerText(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none" placeholder="e.g. New flood alerts for River Nzoia..." />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                                        Add to Live Ticker
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Recent Stats & Posts */}
            <div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">Content Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                            <div className="text-3xl font-bold text-primary mb-1">{recentArticles.length}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Articles</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                            <div className="text-3xl font-bold text-[#38bdf8] mb-1">{recentPodcasts.length}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Podcasts</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center col-span-2">
                            <div className="text-2xl font-bold text-emerald-500 mb-1">{recentEvents.length}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upcoming Events</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-heading font-bold text-sm text-slate-700 uppercase tracking-wider">
                            {activeTab === 'article' ? 'Recent Articles' : 
                             activeTab === 'podcast' ? 'Recent Podcasts' : 
                             activeTab === 'event' ? 'Upcoming Events' : 'Ticker Items'}
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                        {activeTab === 'article' && recentArticles.map((article) => (
                            <div key={article.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img src={article.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{article.title}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">{article.category} • {article.time}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteArticle(article.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                        {activeTab === 'podcast' && recentPodcasts.map((podcast) => (
                            <div key={podcast.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img src={podcast.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{podcast.title}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">{podcast.episode}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDeletePodcast(podcast.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                        {activeTab === 'event' && recentEvents.map((event) => (
                            <div key={event.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{event.title}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">{event.date} • {event.location}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                        {activeTab === 'ticker' && tickerItems.map((item) => (
                            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <span className="text-sm text-slate-700 truncate">{item.text}</span>
                                <button onClick={() => handleDeleteTicker(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
