"use client";

import React from "react";

interface NewsCategoriesProps {
  /** The categories the stories actually have, with how many stories each. */
  categories: { name: string; count: number }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function NewsCategories({ categories, selectedCategory, onSelectCategory }: NewsCategoriesProps) {
  const total = categories.reduce((n, c) => n + c.count, 0);
  const all = [{ name: "All", count: total }, ...categories];
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Filter stories by topic">
      {all.map((c) => {
        const on = selectedCategory === c.name;
        return (
          <button
            key={c.name}
            role="tab"
            aria-selected={on}
            onClick={() => onSelectCategory(c.name)}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-semibold border transition-colors ${
              on ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
            }`}
          >
            {c.name}
            <span className={`text-[12px] font-medium ${on ? "text-slate-300" : "text-slate-400"}`}>{c.count}</span>
          </button>
        );
      })}
    </div>
  );
}
