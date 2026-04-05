"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function NewsHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white border-b border-white/10 shadow-xl py-3">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/portal" className="flex items-center gap-3 group">
            <div className="bg-white p-1 rounded-lg">
              <Image 
                src="/images/logo-main.png" 
                alt="SUHU News" 
                width={180} 
                height={50} 
                className="h-10 md:h-12 w-auto"
              />
            </div>
            <div className="hidden sm:block">
              <span className="block font-heading font-bold text-lg leading-tight uppercase tracking-widest text-primary">News Portal</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-tighter">Lake Victoria Basin</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 font-bold text-xs uppercase tracking-widest">
            <Link href="/" className="hover:text-primary transition-colors py-2">Home</Link>
            <a href="#latest-news" className="hover:text-primary transition-colors py-2">Latest News</a>
            <a href="#podcasts" className="hover:text-primary transition-colors py-2">Podcasts</a>
            <a href="#events" className="hover:text-primary transition-colors py-2">Events</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hidden sm:flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-full hover:bg-white hover:text-primary transition-all font-bold text-xs shadow-lg shadow-primary/20">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
               Log In
            </Link>
            <button 
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900 border-t border-white/10 p-6 animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-6 font-bold text-center uppercase tracking-widest text-sm">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <a href="#latest-news" onClick={() => setMobileMenuOpen(false)}>Latest News</a>
            <a href="#podcasts" onClick={() => setMobileMenuOpen(false)}>Podcasts</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="bg-primary py-3 rounded-full text-white mt-4">Admin Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
