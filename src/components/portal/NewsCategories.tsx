"use client";

import React from "react";
import {
  Landmark,
  TrendingUp,
  Wheat,
  HeartPulse,
  GraduationCap,
  Leaf,
  LayoutGrid,
  ChevronRight
} from "lucide-react";

const CATEGORIES = [
  {
    name: 'All',
    Icon: LayoutGrid,
    color: 'from-slate-700 to-slate-900',
    lightColor: 'from-slate-100 to-slate-200',
    accent: '#475569',
    desc: 'All Topics'
  },
  {
    name: 'Politics',
    Icon: Landmark,
    color: 'from-blue-600 to-blue-900',
    lightColor: 'from-blue-50 to-blue-100',
    accent: '#2563eb',
    desc: 'Governance'
  },
  {
    name: 'Business',
    Icon: TrendingUp,
    color: 'from-emerald-600 to-emerald-900',
    lightColor: 'from-emerald-50 to-emerald-100',
    accent: '#059669',
    desc: 'Economy'
  },
  {
    name: 'Agriculture',
    Icon: Wheat,
    color: 'from-amber-500 to-orange-700',
    lightColor: 'from-amber-50 to-orange-100',
    accent: '#d97706',
    desc: 'Farming & Food'
  },
  {
    name: 'Health',
    Icon: HeartPulse,
    color: 'from-rose-500 to-rose-800',
    lightColor: 'from-rose-50 to-rose-100',
    accent: '#e11d48',
    desc: 'Wellbeing'
  },
  {
    name: 'Education',
    Icon: GraduationCap,
    color: 'from-violet-600 to-violet-900',
    lightColor: 'from-violet-50 to-violet-100',
    accent: '#7c3aed',
    desc: 'Learning'
  },
  {
    name: 'Environment',
    Icon: Leaf,
    color: 'from-teal-500 to-teal-800',
    lightColor: 'from-teal-50 to-teal-100',
    accent: '#0d9488',
    desc: 'Ecosystem'
  },
];

interface NewsCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function NewsCategories({ selectedCategory, onSelectCategory }: NewsCategoriesProps) {
  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            Focus Domains
          </h3>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Filter by Category</p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          const { Icon } = cat;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              aria-label={`Filter by ${cat.name}`}
              aria-pressed={isActive}
              className={`
                group relative flex items-center gap-3 px-6 py-4 md:px-5 md:py-3 rounded-[1.25rem] font-bold text-sm md:text-base
                border transition-all duration-300 cursor-pointer select-none
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500
                ${
                  isActive
                    ? `bg-gradient-to-br ${cat.color} text-white border-transparent shadow-lg scale-[1.04] ring-2 ring-offset-2 ring-sky-200`
                    : `bg-white/80 backdrop-blur-sm border-slate-200 text-slate-600
                       hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:scale-[1.02]
                       hover:bg-gradient-to-br hover:${cat.lightColor}`
                }
              `}
              style={isActive ? { boxShadow: `0 8px 24px -4px ${cat.accent}55` } : {}}
            >
              {/* Icon container */}
              <span
                className={`
                  flex items-center justify-center w-10 h-10 md:w-8 md:h-8 rounded-xl transition-all duration-500
                  ${
                    isActive
                      ? 'bg-white/20 shadow-inner'
                      : 'bg-slate-100 group-hover:bg-white group-hover:shadow-sm group-hover:scale-110'
                  }
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-transform duration-500 ease-out ${
                    isActive ? 'text-white scale-110' : 'text-slate-500 group-hover:text-slate-700 group-hover:rotate-[15deg] group-hover:scale-110'
                  }`}
                />
              </span>

              {/* Label */}
              <span className={`tracking-wide transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'
              }`}>
                {cat.name}
              </span>

              {/* Sub-label */}
              <span className={`hidden md:block text-[10px] font-medium transition-colors duration-200 ${
                isActive ? 'text-white/70' : 'text-slate-400 group-hover:text-slate-500'
              }`}>
                · {cat.desc}
              </span>

              {/* Active indicator arrow */}
              {isActive && (
                <ChevronRight size={14} className="text-white/80 ml-auto animate-pulse" />
              )}

              {/* Glow ring on active */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-[1.25rem] pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.25)` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
