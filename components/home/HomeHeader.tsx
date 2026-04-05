"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomeHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "glass-premium py-2 shadow-2xl border-b border-white/10" 
          : "bg-transparent py-6 text-white"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`logo-container-premium p-1.5 rounded-xl transition-all duration-500 shadow-2xl ${
              isScrolled ? "bg-white/90 scale-90" : "bg-white/10 backdrop-blur-xl scale-110"
            }`}>
              <Image 
                src="/images/logo-main.png" 
                alt="Suhu Hub" 
                width={180} 
                height={50} 
                className="h-10 md:h-16 w-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-bold text-sm uppercase tracking-wider">
            <a href="#intro" className="hover:text-primary transition-colors">Introduction</a>
            <a href="#pillars" className="hover:text-primary transition-colors">Key Pillars</a>
            <a href="#objectives" className="hover:text-primary transition-colors">Objectives</a>
            <Link href="/portal" className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg scale-105 active:scale-95">
              News Portal
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-24 glass-premium p-10 rounded-[2.5rem] shadow-2xl animate-fade-in z-50 border border-white/20">
          <div className="flex flex-col gap-10 font-black text-center text-slate-900 dark:text-white uppercase tracking-[0.2em] text-xs">
            <a href="#intro" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Introduction</a>
            <a href="#pillars" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Key Pillars</a>
            <a href="#objectives" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Objectives</a>
            <Link href="/portal" onClick={() => setMobileMenuOpen(false)} className="bg-slate-900 dark:bg-primary text-white py-5 rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95">
              News Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
