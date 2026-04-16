"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none">
      <div className="container mx-auto max-w-7xl pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden py-3 px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/portal" className="flex items-center gap-3 group">
              <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-slate-200 p-1.5 transition-all group-hover:shadow-lg group-hover:scale-105 duration-500">
                <Image 
                  src="/images/logo-main.png" 
                  alt="SIHU Hub" 
                  width={140} 
                  height={40} 
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="block font-black text-[11px] leading-tight uppercase tracking-[0.3em] text-slate-900 group-hover:text-primary transition-colors">Intelligence Portal</span>
                <span className="block text-[7px] text-primary font-black uppercase tracking-[0.4em] mt-0.5">Basin Network v2.4</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 font-bold text-[10px] uppercase tracking-widest">
              {[
                { name: "Home", href: "/" },
                { name: "AI Hub", href: "/ai" },
                { name: "DApp", href: "/dapp" },
                { name: "Play", href: "/play", icon: "🎮" },
                { name: "Verify", href: "/verify", icon: "✨", special: true },
              ].map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                    link.special 
                      ? 'bg-primary text-white hover:bg-slate-900 shadow-md' 
                      : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  {link.icon && <span>{link.icon}</span>}
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
               <Link href="/login" className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-primary hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-lg group/login">
                  Log In
                  <svg className="w-3.5 h-3.5 transition-transform group-hover/login:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 16l-4-4m0 0l4-4m-4 4h14"></path></svg>
               </Link>
               <button 
                className="lg:hidden p-2 text-slate-900 bg-slate-100 rounded-xl border border-slate-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="lg:hidden mt-2 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Home", href: "/" },
                  { name: "Info Portal", href: "/portal" },
                  { name: "AI Assistant", href: "/ai" },
                  { name: "Network DApp", href: "/dapp" },
                  { name: "Play & Staking", href: "/play" },
                  { name: "Verify & Earn", href: "/verify", special: true },
                ].map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${
                      link.special 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white/5 text-slate-400 border-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block w-full py-4 bg-white text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl mt-6 text-center"
                >
                  Member Log In
                </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
