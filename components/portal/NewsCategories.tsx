"use client";

import React from "react";

const CATEGORIES = [
  { name: 'Politics', icon: 'M4 19h16v2H4zM4 15h16v2H4zM4 11h16v2H4z M12 2L2 9h20L12 2z' },
  { name: 'Business', icon: 'M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5z' },
  { name: 'Agriculture', icon: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' },
  { name: 'Health', icon: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z' },
  { name: 'Education', icon: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72M12 12.72v-3.72' },
  { name: 'Environment', icon: 'M17.09 10.56L14 13.5v-3.5H4v-2h10V4.5l3.09 2.94a1.5 1.5 0 010 2.12zm-4.7 6.36L9 14.5v3.5h11v2H9v3.5l-3.39-2.94a1.5 1.5 0 010-2.12z' }
];

interface NewsCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function NewsCategories({ selectedCategory, onSelectCategory }: NewsCategoriesProps) {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-end border-b border-border pb-4 mb-8">
        <h3 className="text-2xl font-heading font-bold text-foreground relative after:content-[''] after:absolute after:bottom-[-16px] after:left-0 after:w-16 after:h-1 after:bg-primary">
          Top Categories
        </h3>
        <button 
          onClick={() => onSelectCategory('All')}
          className="text-primary font-bold text-sm hover:underline translate-y-[-4px] flex items-center gap-1.5 transition-all hover:gap-2"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {CATEGORIES.map((cat, i) => (
          <div 
            key={i} 
            onClick={() => onSelectCategory(cat.name)}
            className={`group bg-slate-50 dark:bg-slate-900 border ${selectedCategory === cat.name ? 'border-primary bg-primary/10' : 'border-border dark:border-slate-800'} p-6 rounded-2xl text-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 relative overflow-hidden`}
          >
            {/* Background Icon Watermark */}
            <div className="absolute top-0 right-0 p-3 opacity-[0.03] text-foreground group-hover:text-white transition-colors duration-300 pointer-events-none">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d={cat.icon}/></svg>
            </div>

            <div className="w-14 h-14 mx-auto bg-primary/10 dark:bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300 rotate-3 group-hover:rotate-0 shadow-inner">
              <svg 
                className="w-7 h-7 text-primary group-hover:text-white transition-all duration-300 scale-90 group-hover:scale-110" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d={cat.icon}/>
              </svg>
            </div>
            
            <span className="font-heading font-bold text-foreground text-sm uppercase tracking-widest group-hover:text-white transition-colors block relative z-10">
              {cat.name}
            </span>
            
            <div className="mt-3 w-0 h-0.5 bg-white/40 mx-auto transition-all duration-500 group-hover:w-12 rounded-full"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
