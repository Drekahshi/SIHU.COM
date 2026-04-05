"use client";

import React from "react";
import Link from "next/link";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function CtaSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <RevealOnScroll>
          <div className="glass-premium bg-slate-900 dark:bg-primary/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/10 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/30 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
              
              <div className="relative z-10 max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 text-nyc-header uppercase">
                      Stay Informed. <br />
                      <span className="text-primary text-transparent" style={{ WebkitTextStroke: '1px var(--primary)' }}>Stay Empowered.</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-slate-300 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
                      Join thousands of community members receiving real-time environmental and development updates across the Lake Victoria Basin.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                      <Link href="/portal" className="px-12 py-5 bg-primary text-white rounded-full font-black hover:bg-white hover:text-primary transition-all shadow-xl scale-105 active:scale-95">
                          Enter News Portal
                      </Link>
                  </div>
              </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
