"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/constants/articles";

interface NewsHeroProps {
  mainArticle: Article | null;
  sideArticles: Article[];
}

export default function NewsHero({ mainArticle, sideArticles }: NewsHeroProps) {
  if (!mainArticle) return null;

  return (
    <section className="animate-fade-in mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Featured Article */}
        <div className="lg:col-span-8">
          <Link 
            href={`/portal/article/${mainArticle.id}`}
            className="group relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[21/9] lg:aspect-auto lg:h-[520px] border border-white/10 p-1 block cursor-pointer"
          >
            {/* Clickable Image Area */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-slate-100" />
                <Image 
                src={mainArticle.image || '/assets/placeholder-article.jpg'} 
                alt={mainArticle.title} 
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-100" 
                />
                {/* Multi-layered Professional Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-transparent" />
            </div>            
            <div className="absolute bottom-0 left-0 p-8 md:p-14 w-full z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-2xl border border-white/20">
                  Priority Dispatch
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] transition-colors drop-shadow-2xl uppercase tracking-tighter">
                {mainArticle.title}
              </h2>
              
              <p className="text-slate-100 text-sm md:text-lg line-clamp-2 md:line-clamp-3 mb-8 max-w-3xl font-medium leading-relaxed">
                {mainArticle.excerpt}
              </p>
              
              <div className="flex items-center text-[10px] md:text-xs text-slate-800 font-black uppercase tracking-[0.2em] bg-white backdrop-blur-xl w-fit px-6 py-3 rounded-2xl border border-slate-200 shadow-xl">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black mr-4 shadow-md">
                    {mainArticle.author.charAt(0)}
                </div>
                <span className="text-slate-900">{mainArticle.author}</span>
                <span className="mx-4 opacity-10 text-slate-900">|</span>
                <span className="flex items-center gap-2 text-primary font-bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {mainArticle.time}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Side Articles Stack */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 pb-3 mb-1">
            Intelligence Stream
          </h3>
          {sideArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/portal/article/${article.id}`} 
              className="group flex gap-5 bg-white p-4 rounded-3xl border border-slate-200 hover:border-primary hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/20 transition-all" />
              
              <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden relative shadow-2xl border border-white/5 bg-slate-900">
                <Image 
                  src={article.image || '/assets/placeholder-article.jpg'} 
                  alt={article.title} 
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" 
                />
              </div>
              <div className="flex flex-col flex-1 justify-center relative z-10">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1.5 px-3 py-1 bg-white/5 w-fit rounded-full border border-white/5">
                  {article.category}
                </span>
                <h4 className="font-black text-white text-xs leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-3 mt-3 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                   <span className="flex items-center gap-1.5 font-black text-primary/60">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {article.time}
                   </span>
                   <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                   <span className="hover:text-primary transition-colors">Listen Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
