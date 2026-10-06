"use client";

import React from "react";
import ChessGame from "../../../components/portal/play/ChessGame";

export default function ChessPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-[26px] md:text-[30px] font-bold text-white">Play chess against Agent SIHU</h2>
        <p className="text-[15px] text-slate-400 mt-1">Pick a difficulty, then make your move. Easy for beginners, Hard for strong players.</p>
      </div>
      <ChessGame />
    </div>
  );
}
