"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { articleService } from "@/services/articleService";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const article = id ? articleService.getArticleById(id) : null;

  useEffect(() => {
    if (!article) {
      router.push("/portal");
    }
  }, [article, router]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading Article...</div>
      </div>
    );
  }

  const handleListen = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const text = `${article.title}. By ${article.author}. ${article.content}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <article className="bg-white min-h-screen pb-24">
      {/* Article Progress / Back Nav */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl flex justify-between items-center">
           <Link 
             href="/portal" 
             className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors group"
           >
             <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
             Back to Portal
           </Link>
           <div className="hidden sm:flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{article.category}</span>
           </div>
        </div>
      </div>

      {/* Hero Section */}
      <header className="container mx-auto px-4 lg:px-8 max-w-4xl pt-16 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
            <span>{article.category}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <span className="text-slate-400">{article.time}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-slate-900 leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-lg border border-slate-200">
                  {article.author.charAt(0)}
                </div>
                <div>
                   <div className="text-sm font-bold text-slate-900">{article.author}</div>
                   <div className="text-[11px] text-slate-500 uppercase tracking-widest">Sango Contributor</div>
                </div>
             </div>
             
             <div className="flex items-center gap-4 ml-auto">
                <button 
                  onClick={handleListen}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                  Listen to Story
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="container mx-auto px-0 md:px-4 lg:px-8 max-w-5xl mb-16">
        <div className="aspect-[21/9] md:rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Section */}
      <main className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:leading-relaxed prose-p:text-slate-700 prose-p:mb-8 font-serif">
          <p className="text-xl md:text-2xl text-slate-600 font-sans italic border-l-4 border-primary pl-6 mb-12 leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="whitespace-pre-line text-lg leading-[1.8] text-slate-800">
            {article.content}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <p className="text-slate-400 text-sm max-w-md">
              You&apos;re reading Sango News, a community media initiative focused on the Lake Victoria Basin environmental protection.
            </p>
            <Link 
              href="/portal" 
              className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-primary transition-all shadow-xl"
            >
              Discover More Stories
            </Link>
        </div>
      </main>
    </article>
  );
}
