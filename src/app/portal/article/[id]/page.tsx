import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleService } from "@/services/articleService";
import { Article } from "@/constants/articles";
import { Mic, Clock, User, ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const articles = await articleService.getArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await articleService.getArticleById(id);

  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Sango Hub`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await articleService.getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <article className="bg-white min-h-screen pb-24 selection:bg-sky-100 selection:text-sky-900">
      {/* Article Progress / Back Nav */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl flex justify-between items-center">
           <Link 
             href="/portal" 
             className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sky-500 transition-colors group"
           >
             <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
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
          <div className="flex items-center gap-4 text-xs font-bold text-sky-500 uppercase tracking-[0.2em] mb-2">
            <span>{article.category}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <span className="text-slate-400">{article.time}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight uppercase">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 font-bold text-lg border border-sky-100 shadow-sm">
                  {article.author.charAt(0)}
                </div>
                <div>
                   <div className="text-sm font-bold text-slate-900">{article.author}</div>
                   <div className="text-[11px] text-slate-500 uppercase tracking-widest">Sango Contributor</div>
                </div>
             </div>
             
             <div className="flex items-center gap-4 ml-auto">
                <button 
                  className="flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Mic size={16} strokeWidth={3} />
                  Listen to Story
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="container mx-auto px-0 md:px-4 lg:px-8 max-w-5xl mb-16">
        <div className="aspect-[21/9] md:rounded-3xl overflow-hidden shadow-2xl relative bg-slate-100">
          <Image 
            src={article.image || '/assets/placeholder-article.jpg'} 
            alt={article.title} 
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Content Section */}
      <main className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-p:leading-relaxed prose-p:text-slate-700 prose-p:mb-8">
          <p className="text-xl md:text-2xl text-slate-600 font-bold italic border-l-4 border-sky-500 pl-6 mb-12 leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="whitespace-pre-line text-lg leading-[1.8] text-slate-800 font-medium">
            {article.content}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-1 bg-sky-500 mb-6"></div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest max-w-md">
              You&apos;re reading Sango Intelligence Briefs, a community media initiative focused on Lake Victoria Basin protection.
            </p>
            <Link 
              href="/portal" 
              className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-500 transition-all shadow-xl"
            >
              Discover More Stories
            </Link>
        </div>
      </main>
    </article>
  );
}
