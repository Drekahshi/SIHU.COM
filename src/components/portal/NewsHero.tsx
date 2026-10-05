"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Article } from "@/constants/articles";

interface NewsHeroProps {
  mainArticle: Article | null;
  sideArticles: Article[];
}

export default function NewsHero({ mainArticle, sideArticles }: NewsHeroProps) {
  if (!mainArticle) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Featured story */}
      <Link
        href={`/portal/article/${mainArticle.id}`}
        className="group relative lg:col-span-8 rounded-3xl overflow-hidden bg-slate-900 min-h-[420px] md:min-h-[480px] lg:min-h-[540px] flex items-end shadow-[0_20px_50px_-20px_rgba(15,23,42,0.45)] focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
      >
        <Image
          src={mainArticle.image || "/images/lake-victoria-bg.png"}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/5" />
        <div className="relative p-6 sm:p-8 md:p-12 w-full">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-sky-500 text-white text-[12px] font-semibold px-3 py-1 rounded-full">Featured</span>
            <span className="text-sky-200 text-[13px] font-medium">{mainArticle.category}</span>
          </div>
          <h2 className="font-heading text-[28px] sm:text-4xl lg:text-[44px] font-bold text-white leading-[1.15] max-w-3xl">
            {mainArticle.title}
          </h2>
          <p className="text-slate-200 text-[15px] md:text-[17px] leading-relaxed mt-4 max-w-2xl line-clamp-3">
            {mainArticle.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-[13px] text-slate-300">
            <span className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center font-semibold">
                {mainArticle.author.charAt(0)}
              </span>
              <span className="font-semibold text-white">{mainArticle.author}</span>
            </span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {mainArticle.time}</span>
            <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-white font-semibold group-hover:gap-2.5 transition-all">
              Read the story <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </Link>

      {/* Latest updates */}
      <div className="lg:col-span-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-1 border-b border-slate-200">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-slate-900">Latest updates</h3>
          <a href="#latest-news" className="text-[13px] font-semibold text-sky-700 hover:text-sky-900">All news</a>
        </div>
        <div className="flex flex-col divide-y divide-slate-200/80">
          {sideArticles.map((article) => (
            <Link key={article.id} href={`/portal/article/${article.id}`} className="group flex gap-4 py-4 focus:outline-none focus-visible:bg-sky-50 rounded-xl">
              <div className="w-24 h-20 sm:w-28 sm:h-[84px] shrink-0 rounded-xl overflow-hidden relative bg-slate-100">
                <Image src={article.image || "/images/lake-victoria-bg.png"} alt="" fill sizes="112px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="flex flex-col min-w-0 justify-center">
                <span className="text-[12px] font-semibold text-sky-700">{article.category}</span>
                <h4 className="font-heading text-[15px] font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-sky-700 transition-colors">
                  {article.title}
                </h4>
                <span className="flex items-center gap-1.5 text-[12px] text-slate-500 mt-1.5"><Clock size={12} /> {article.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
