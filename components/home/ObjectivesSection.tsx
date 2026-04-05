import React from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function ObjectivesSection() {
  return (
    <section id="objectives" className="py-16 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none flex items-center justify-center">
        <svg viewBox="0 0 500 500" className="w-[80%] h-auto text-primary/30 dark:text-primary/20">
          <path 
            fill="currentColor" 
            d="M200,100 C150,120 180,180 150,220 S100,280 120,350 S180,450 250,420 S350,400 380,320 S400,200 350,150 S250,80 200,100" 
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />
        </svg>
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <RevealOnScroll className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
              <span className="text-primary font-black text-xs tracking-[0.4em] uppercase mb-4 block">Our Mission</span>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-nyc-header text-foreground uppercase tracking-tight">Core Objectives</h2>
              <div className="w-20 md:w-24 h-1 md:h-1.5 bg-primary mx-auto mt-4 md:mt-10 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {[
                  { 
                    title: "Premium Content", 
                    desc: "Producing high-caliber professional content through an elite newsgathering network.",
                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM7 8h5m-5 4h5m-5 4h10" /></svg>
                  },
                  { 
                    title: "Civic Engagement", 
                    desc: "Establishing deep stakeholder networks and community involvement strategies.",
                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  },
                  { 
                    title: "Resource Strategy", 
                    desc: "Driving sustainability through robust financial and human resource mobilization.",
                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  },
                  { 
                    title: "Institutional Power", 
                    desc: "Building a solid network of modern equipment and elite editorial skills.",
                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  },
                  { 
                    title: "ICT Integration", 
                    desc: "Seamlessly weaving digital and traditional channels across our production pipelines.",
                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  },
                  { 
                    title: "Eco Watchdog", 
                    desc: "Maintaining a fierce demand for accountability on Lake Victoria ecosystem preservation.",
                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  },
              ].map((obj, idx) => (
                  <RevealOnScroll key={idx} delay={idx * 100}>
                    <div className="glass-premium p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 group h-full flex flex-col items-center text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                            {obj.icon}
                        </div>
                        <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-foreground uppercase tracking-tight">{obj.title}</h3>
                        <p className="text-muted-foreground text-base md:text-lg font-light leading-relaxed">{obj.desc}</p>
                    </div>
                  </RevealOnScroll>
              ))}
          </div>
      </div>
    </section>
  );
}
