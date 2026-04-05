"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return sessionStorage.getItem("sango_admin_auth") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  
  const ADMIN_PASSWORD = "sihuhub"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("sango_admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Hint: try 'sango'");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sango_admin_auth");
    setIsAuthenticated(false);
  };

  // Still checking session storage
  if (isAuthenticated === null) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Not authenticated -> Show Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                <span className="text-white font-heading font-bold text-2xl">SH</span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-slate-900">Admin Access</h2>
            <p className="text-slate-500 text-sm mt-2">Please enter the master password to continue to the Sango News Dashboard.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Master Password</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-slate-50 outline-none"
                placeholder="••••••••"
              />
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
            </div>
            
            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md">
              Unlock Dashboard
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <Link href="/" className="text-sm text-slate-500 hover:text-primary transition-colors">← Back to Public Site</Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated -> Show Admin Layout
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 md:min-h-screen flex flex-col">
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(88,179,242,0.4)]">
                    <span className="text-white font-heading font-bold text-xl">SH</span>
                </div>
                <div>
                   <h2 className="font-bold text-lg leading-tight uppercase tracking-wider">Dashboard</h2>
                   <span className="text-[10px] text-slate-400">Content Manager</span>
                </div>
            </div>
            
            <nav className="space-y-2">
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/5">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    Manage Posts
                </Link>
             </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-white/10">
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full text-sm font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Secure Logout
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
         {/* Top bar */}
         <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
            <h1 className="text-2xl font-heading font-bold text-slate-900">Post Management</h1>
            <div className="flex gap-4">
                <a href="/portal" target="_blank" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
                    View Live Portal <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
            </div>
         </div>
         
         {children}
      </main>
    </div>
  );
}
