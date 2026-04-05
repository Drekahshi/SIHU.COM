"use client";

import React from "react";
import Link from "next/link";
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
          <div className="group relative rounded-2xl overflow-hidden shadow-xl aspect-[16/9] md:aspect-[21/9] lg:aspect-auto lg:h-[480px]">
            <img 
              src={mainArticle.image} 
              alt={mainArticle.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
              <span className="bg-primary text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest mb-4 inline-block shadow-lg">
                Featured News
              </span>
              
              <Link href={`/portal/article/${mainArticle.id}`}>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 leading-tight hover:text-primary transition-colors cursor-pointer drop-shadow-md">
                  {mainArticle.title}
                </h2>
              </Link>
              
              <p className="text-slate-200 text-sm md:text-lg line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl opacity-90">
                {mainArticle.excerpt}
              </p>
              
              <div className="flex items-center text-xs md:text-sm text-slate-300 font-medium bg-black/20 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/10">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3 border border-primary/30">
                    {mainArticle.author.charAt(0)}
                </div>
                <span className="text-white font-semibold">{mainArticle.author}</span>
                <span className="mx-3 opacity-30">|</span>
                <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {mainArticle.time}
                </span>
                <span className="mx-3 opacity-30">|</span>
                <span className="flex items-center gap-1.5 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                    Listen
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Articles Stack */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <h3 className="text-lg font-heading font-bold text-foreground border-b border-border pb-2 mb-1">
            Recent Articles
          </h3>
          {sideArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/portal/article/${article.id}`} 
              className="group flex gap-4 bg-card p-3 rounded-xl shadow-sm border border-border hover:border-primary/50 transition-all cursor-pointer hover:shadow-md"
            >
              <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden relative shadow-inner">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              <div className="flex flex-col flex-1 justify-center">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 px-2 py-0.5 bg-primary/5 w-fit rounded">
                  {article.category}
                </span>
                <h4 className="font-heading font-bold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-medium">
                   <span>{article.time}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                   <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>
                      Listen
                   </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
