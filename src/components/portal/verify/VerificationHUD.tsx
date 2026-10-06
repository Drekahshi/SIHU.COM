"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Zap, Coins } from 'lucide-react';

interface VerificationHUDProps {
  level: number;
  xp: number;
  xpNeeded: number;
  combo: number;
  streak: number;
  creditsToday: number;
  verifiedToday: number;
}

/** Your progress as a verifier: level, streak, multiplier and today's work. */
export default function VerificationHUD({ level, xp, xpNeeded, combo, streak, creditsToday, verifiedToday }: VerificationHUDProps) {
  const progressPercent = Math.min(100, Math.max(0, (xp / xpNeeded) * 100));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      <div className="col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-slate-500"><Award size={16} className="text-sky-600" /> Verifier level</span>
          <span className="text-[13px] font-semibold text-slate-500">{Math.round(xp)} / {xpNeeded} XP</span>
        </div>
        <p className="font-heading text-[28px] font-bold text-slate-900 mt-1">Level {level}</p>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full bg-sky-500 rounded-full" />
        </div>
        <p className="text-[12.5px] text-slate-500 mt-2">{Math.max(0, xpNeeded - Math.round(xp))} XP to level {level + 1}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-slate-500"><Flame size={16} className="text-orange-500" /> Streak</span>
        <p className="font-heading text-[28px] font-bold text-slate-900 mt-1">{streak} <span className="text-[15px] font-sans font-semibold text-slate-500">{streak === 1 ? 'day' : 'days'}</span></p>
        <p className="text-[12.5px] text-slate-500 mt-1">Verify every day to keep it.</p>
      </div>

      <div className={`rounded-2xl border p-5 transition-colors ${combo > 1 ? 'bg-sky-50 border-sky-200' : 'bg-white border-slate-200/80'}`}>
        <span className="flex items-center gap-2 text-[13px] font-semibold text-slate-500"><Zap size={16} className="text-sky-600" /> Multiplier</span>
        <p className={`font-heading text-[28px] font-bold mt-1 ${combo > 1 ? 'text-sky-700' : 'text-slate-900'}`}>{combo}.0x</p>
        <p className="text-[12.5px] text-slate-500 mt-1">Verify again within 30 s to raise it.</p>
      </div>

      <div className="col-span-2 lg:col-span-1 bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-emerald-800"><Coins size={16} /> Today</span>
        <p className="font-heading text-[28px] font-bold text-emerald-700 mt-1">+{creditsToday.toFixed(1)}</p>
        <p className="text-[12.5px] text-emerald-800/80 mt-1">credits from {verifiedToday} {verifiedToday === 1 ? 'check' : 'checks'}</p>
      </div>
    </div>
  );
}
