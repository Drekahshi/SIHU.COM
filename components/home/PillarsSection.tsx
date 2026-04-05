import React from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function PillarsSection() {
  return (
    <section id="pillars" className="py-16 md:py-32 bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 text-white relative overflow-hidden transition-all duration-1000">
      <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 1000 500" className="w-full h-full object-cover">
          <circle cx="200" cy="150" r="1.5" fill="currentColor" />
          <circle cx="250" cy="180" r="1.5" fill="currentColor" />
          <circle cx="300" cy="120" r="1.5" fill="currentColor" />
          <circle cx="450" cy="250" r="1.5" fill="currentColor" />
          <circle cx="700" cy="180" r="1.5" fill="currentColor" />
          <circle cx="800" cy="220" r="1.5" fill="currentColor" />
          {/* ... Add more map-like dots or use a simplified world map path ... */}
          <path d="M150,200 Q200,100 300,150 T500,200 T750,150" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M100,300 Q250,250 400,350 T800,300" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-start lg:items-center">
              <div className="lg:w-1/3">
                <RevealOnScroll>
                  <span className="text-primary font-black text-xs tracking-[0.3em] uppercase mb-4 block">Foundations</span>
                  <h2 className="text-3xl md:text-6xl font-black mt-2 mb-6 text-nyc-header uppercase">Key <br className="hidden md:block" /> Pillars</h2>
                  <p className="text-lg md:text-xl font-light text-slate-400 leading-relaxed">Our core principles driving sustainable change across the Lake Victoria ecosystem.</p>
                </RevealOnScroll>
              </div>
              <div className="lg:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {[
                          "Public engagement on developmental issues through elite digital media and public forums",
                          "Accountability demand on climate change and preservation of the Lake Victoria Ecosystem",
                          "Public watchdog amplifying community concerns on human rights and development",
                          "Sensitizing communities on dangers of cross-border insecurity and environmental protection"
                      ].map((pillar, idx) => (
                          <RevealOnScroll key={idx} delay={idx * 150}>
                            <div className="glass-premium p-6 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all duration-500 group h-full">
                                <div className="text-5xl md:text-7xl font-black text-primary/10 mb-4 md:mb-8 group-hover:text-primary/20 transition-colors">0{idx + 1}</div>
                                <p className="text-base md:text-xl font-medium leading-relaxed text-slate-200">{pillar}</p>
                            </div>
                          </RevealOnScroll>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
}
