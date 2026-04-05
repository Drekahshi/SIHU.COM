import React from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function IntroSection() {
  return (
    <section 
      id="intro" 
      className="py-16 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Enhanced map background for context */}
      <div 
        className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none transition-opacity duration-1000"
        style={{ 
          backgroundImage: 'url("/images/Map.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'overlay'
        }}
      />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-stretch">
              <div className="lg:w-1/2">
                <RevealOnScroll>
                   <div className="glass-premium p-8 md:p-14 rounded-[2.5rem] md:rounded-[3rem] h-full shadow-2xl border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mt-16 group-hover:bg-primary/10 transition-all duration-500"></div>
                      <span className="text-primary font-black text-xs tracking-[0.3em] uppercase mb-4 block relative z-10">Origins</span>
                      <h2 className="text-3xl md:text-5xl font-black mt-2 mb-8 text-nyc-header text-foreground uppercase relative z-10">
                        Our <br /> Story
                      </h2>
                      <div className="space-y-6 text-nyc-body text-muted-foreground text-base md:text-lg font-light leading-relaxed relative z-10">
                          <p>Sango Information Hub (SIHU) is a registered community media initiative that works on knowledge management and information sharing on natural resources and environmental protection and development around the Lake Victoria Basin in Kenya.</p>
                          <p>The Sango Information Hub works through community involvement in production of radio content, digital information gathering and sharing, community information and traditional knowledge restoration centre.</p>
                      </div>
                   </div>
                </RevealOnScroll>
              </div>
              <div className="lg:w-1/2">
                <RevealOnScroll delay={200}>
                  <div className="glass-premium p-8 md:p-14 rounded-[2.5rem] md:rounded-[3rem] h-full shadow-2xl border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-500"></div>
                       <div className="space-y-6 md:space-y-8 text-nyc-body text-muted-foreground text-base md:text-lg font-light leading-relaxed relative z-10 h-full flex flex-col justify-between">
                          <div>
                            <p className="mb-6">The Lake Victoria Basin Region is made up of ten Counties in Kenya mostly the Western and Nyanza that cover nearly 10% of Kenya&apos;s territory, is highly densely populated.</p>
                            <p>Producing content and information through community correspondents majorly with focus on development news and environmental protection in the Lake Victoria Basin.</p>
                          </div>
                          <div className="pt-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-[1px] bg-primary"></div>
                              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Fort Jesus Road, Busia Town</span>
                            </div>
                          </div>
                       </div>
                  </div>
                </RevealOnScroll>
              </div>
          </div>
      </div>
    </section>
  );
}
