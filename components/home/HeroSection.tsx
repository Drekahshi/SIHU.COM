"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center md:bg-fixed transition-transform duration-1000 group-hover:scale-105" 
        style={{ backgroundImage: 'url("/images/6.jpg")' }}
      >
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center md:text-left text-white">
          <div className="max-w-4xl">
              <h2 className="text-primary font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-6 animate-fade-in-up flex items-center gap-4">
                <span className="w-12 h-[2px] bg-primary"></span>
                Sango Information Hub
              </h2>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] text-nyc-header animate-fade-in-up drop-shadow-2xl" style={{ animationDelay: '100ms' }}>
                  WE CARE <br className="hidden md:block" /> 
                  <span className="text-white">ABOUT</span> <br className="hidden md:block" />
                  <span className="text-transparent border-t-2 md:border-t-4 border-primary pt-2 md:pt-4 inline-block md:block" style={{ WebkitTextStroke: '1px white' }}>LAKE VICTORIA</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl animate-fade-in-up font-light leading-relaxed opacity-80" style={{ animationDelay: '200ms' }}>
                  An elite community media network established for stakeholders engagement and environmental protection across the Lake Victoria Basin.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <a href="#intro" className="px-10 py-5 bg-white text-slate-900 rounded-full font-black hover:bg-primary hover:text-white transition-all text-center shadow-2xl scale-105 active:scale-95">
                      Explore Hub
                  </a>
                  <Link href="/portal" className="px-10 py-5 bg-transparent border-2 border-white/30 backdrop-blur-md text-white rounded-full font-black hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3 group/btn">
                      News Portal 
                      <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                  </Link>
              </div>
          </div>
      </div>
    </section>
  );
}
