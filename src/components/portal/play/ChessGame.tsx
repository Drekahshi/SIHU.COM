"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move, type Square } from "chess.js";
import { Chessboard, defaultPieces } from "react-chessboard";
import { Bot, User, RotateCcw, Flag, Undo2, Repeat, Plus, Trophy, Handshake, X, Lightbulb } from "lucide-react";
import { bestMove, evaluate, type Level } from "@/lib/chessAi";

/*
 * Play chess against Agent SIHU, laid out like a real chess site: player
 * bars with captured pieces above and below the board, click or drag to
 * move, legal-move dots, last-move and check highlights, a move list,
 * takeback, hint, resign and a result window.
 */

type Color = "w" | "b";
const LEVELS: { id: Level; label: string; elo: string }[] = [
  { id: "easy", label: "Easy", elo: "about 800" },
  { id: "medium", label: "Medium", elo: "about 1200" },
  { id: "hard", label: "Hard", elo: "about 1500" },
];
const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
const ORDER = ["q", "r", "b", "n", "p"];

/** Board colours of the classic green tournament board. */
const LIGHT = "#ebecd0";
const DARK = "#779556";

function Captured({ pieces, color }: { pieces: string[]; color: Color }) {
  const sorted = [...pieces].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  return (
    <span className="flex items-center -space-x-1.5">
      {sorted.map((p, i) => {
        const Piece = defaultPieces[`${color}${p.toUpperCase()}`];
        return Piece ? <span key={i} className="inline-block w-[18px] h-[18px]">{Piece({ svgStyle: { width: 18, height: 18 } })}</span> : null;
      })}
    </span>
  );
}

function PlayerBar({ name, sub, icon, active, captured, capturedColor, advantage }: {
  name: string; sub: string; icon: React.ReactNode; active: boolean; captured: string[]; capturedColor: Color; advantage: number;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${active ? "bg-[#81b64c] text-white" : "bg-[#3c3a37] text-slate-300"}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[15px] font-bold text-white leading-tight">
          {name} <span className="text-[12.5px] font-medium text-[#a7a6a2]">{sub}</span>
        </p>
        <div className="flex items-center gap-1.5 h-[20px] mt-0.5">
          <Captured pieces={captured} color={capturedColor} />
          {advantage > 0 && <span className="text-[12.5px] font-semibold text-[#a7a6a2] ml-1">+{advantage}</span>}
        </div>
      </div>
      {active && <span className="text-[12.5px] font-semibold text-[#81b64c] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#81b64c] animate-pulse" /> to move</span>}
    </div>
  );
}

export default function ChessGame() {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [history, setHistory] = useState<Move[]>([]);
  const [you, setYou] = useState<Color>("w");
  const [level, setLevel] = useState<Level>("medium");
  const [selected, setSelected] = useState<Square | null>(null);
  const [thinking, setThinking] = useState(false);
  const [resigned, setResigned] = useState(false);
  const [hint, setHint] = useState<{ from: string; to: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const listRef = useRef<HTMLDivElement>(null);

  const game = gameRef.current;
  const over = game.isGameOver() || resigned;
  const turn = game.turn() as Color;

  const sync = () => { setFen(game.fen()); setHistory(game.history({ verbose: true })); setSelected(null); setHint(null); };

  // Agent SIHU replies when it is its turn.
  useEffect(() => {
    if (over || turn === you) return;
    setThinking(true);
    const t = setTimeout(() => {
      const m = bestMove(game.fen(), level);
      if (m) game.move(m);
      setThinking(false);
      sync();
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, you, level, over]);

  useEffect(() => { if (game.isGameOver() || resigned) setShowResult(true); }, [fen, resigned, game]);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); }, [history.length]);

  const tryMove = (from: string, to: string) => {
    if (over || thinking || turn !== you) return false;
    try {
      const m = game.move({ from, to, promotion: "q" });
      if (!m) return false;
    } catch { return false; }
    sync();
    return true;
  };

  const onSquare = (square: string) => {
    if (over || thinking || turn !== you) return;
    const piece = game.get(square as Square);
    if (selected) {
      if (tryMove(selected, square)) return;
      if (piece && piece.color === you) { setSelected(square as Square); return; }
      setSelected(null);
      return;
    }
    if (piece && piece.color === you) setSelected(square as Square);
  };

  const newGame = (color: Color = you) => {
    gameRef.current = new Chess();
    setYou(color);
    setOrientation(color === "w" ? "white" : "black");
    setResigned(false);
    setShowResult(false);
    setThinking(false);
    setFen(gameRef.current.fen());
    setHistory([]);
    setSelected(null);
    setHint(null);
  };

  const takeBack = () => {
    if (thinking || history.length === 0) return;
    game.undo();
    if (game.turn() !== you && history.length > 1) game.undo();
    setResigned(false);
    setShowResult(false);
    sync();
  };

  const showHint = () => {
    if (over || thinking || turn !== you) return;
    const m = bestMove(game.fen(), "medium");
    if (m) setHint({ from: m.from, to: m.to });
  };

  // Highlights: last move, selection, legal targets, check and hint.
  const squareStyles = useMemo(() => {
    const s: Record<string, React.CSSProperties> = {};
    const last = history[history.length - 1];
    if (last) {
      s[last.from] = { backgroundColor: "rgba(255, 255, 51, 0.45)" };
      s[last.to] = { backgroundColor: "rgba(255, 255, 51, 0.45)" };
    }
    if (selected) {
      s[selected] = { backgroundColor: "rgba(255, 255, 51, 0.55)" };
      for (const m of game.moves({ square: selected, verbose: true })) {
        s[m.to] = {
          ...(s[m.to] ?? {}),
          background: m.captured
            ? "radial-gradient(transparent 58%, rgba(0,0,0,0.18) 60%)"
            : "radial-gradient(rgba(0,0,0,0.18) 22%, transparent 24%)",
        };
      }
    }
    if (game.inCheck()) {
      const b = game.board();
      for (const row of b) for (const p of row) if (p && p.type === "k" && p.color === game.turn()) s[p.square] = { ...(s[p.square] ?? {}), background: "radial-gradient(rgba(235,40,40,0.95) 0%, rgba(235,40,40,0.5) 45%, transparent 75%)" };
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, selected, history]);

  // Captured pieces and material difference.
  const { byWhite, byBlack, diff } = useMemo(() => {
    const byWhite: string[] = [], byBlack: string[] = [];
    for (const m of history) if (m.captured) (m.color === "w" ? byWhite : byBlack).push(m.captured);
    const sum = (xs: string[]) => xs.reduce((n, p) => n + (VALUE[p] ?? 0), 0);
    return { byWhite, byBlack, diff: sum(byWhite) - sum(byBlack) };
  }, [history]);

  const ai: Color = you === "w" ? "b" : "w";
  const youCaptured = you === "w" ? byWhite : byBlack;
  const aiCaptured = you === "w" ? byBlack : byWhite;
  const youAdv = you === "w" ? diff : -diff;

  let result = { title: "", text: "", win: false as boolean | null };
  if (resigned) result = { title: "You resigned", text: "Agent SIHU wins this game.", win: false };
  else if (game.isCheckmate()) result = turn === you ? { title: "Checkmate", text: "Agent SIHU wins.", win: false } : { title: "You won!", text: "Checkmate. Well played.", win: true };
  else if (game.isStalemate()) result = { title: "Draw", text: "Stalemate: no legal moves.", win: null };
  else if (game.isThreefoldRepetition()) result = { title: "Draw", text: "The same position came up three times.", win: null };
  else if (game.isInsufficientMaterial()) result = { title: "Draw", text: "Not enough pieces left to checkmate.", win: null };
  else if (game.isDraw()) result = { title: "Draw", text: "50 moves without a capture or pawn move.", win: null };

  const evalNow = evaluate(game) / 100;
  const evalForWhite = Math.max(-10, Math.min(10, evalNow));
  const whiteShare = 50 + evalForWhite * 4.5;

  const rows = Array.from({ length: Math.ceil(history.length / 2) }, (_, i) => [history[i * 2], history[i * 2 + 1]] as const);
  const status = over ? result.title : thinking ? "Agent SIHU is thinking..." : game.inCheck() ? "Check! Your move" : turn === you ? "Your move" : "Waiting...";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5 lg:gap-6 items-start">
      {/* Board column */}
      <div className="w-full max-w-[min(640px,calc(100vh-150px))] mx-auto lg:mx-0 lg:ml-auto">
        <PlayerBar name="Agent SIHU" sub={`${LEVELS.find((l) => l.id === level)?.label} · ${LEVELS.find((l) => l.id === level)?.elo}`} icon={<Bot size={22} />}
          active={!over && turn === ai} captured={aiCaptured} capturedColor={you} advantage={-youAdv} />
        <div className="flex gap-2">
          {/* Evaluation bar */}
          <div className="hidden sm:block w-3 rounded-sm overflow-hidden bg-[#403d39] relative" aria-hidden="true" title="Who is ahead">
            <div className="absolute left-0 right-0 bg-white transition-all duration-500"
              style={orientation === "white" ? { bottom: 0, height: `${whiteShare}%` } : { top: 0, height: `${whiteShare}%` }} />
          </div>
          <div className="flex-1 rounded-sm overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
            <Chessboard
              options={{
                id: "sihu-chess",
                position: fen,
                boardOrientation: orientation,
                onPieceDrop: ({ sourceSquare, targetSquare }) => (targetSquare ? tryMove(sourceSquare, targetSquare) : false),
                onSquareClick: ({ square }) => onSquare(square),
                onPieceClick: ({ square }) => { if (square) onSquare(square); },
                canDragPiece: ({ piece }) => !over && !thinking && turn === you && piece.pieceType[0] === you,
                squareStyles,
                darkSquareStyle: { backgroundColor: DARK },
                lightSquareStyle: { backgroundColor: LIGHT },
                darkSquareNotationStyle: { color: LIGHT, fontWeight: 700 },
                lightSquareNotationStyle: { color: DARK, fontWeight: 700 },
                dropSquareStyle: { boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.75)" },
                arrows: hint ? [{ startSquare: hint.from, endSquare: hint.to, color: "rgba(255,170,0,0.85)" }] : [],
                animationDurationInMs: 220,
                allowDrawingArrows: true,
              }}
            />
          </div>
        </div>
        <PlayerBar name="You" sub={you === "w" ? "White" : "Black"} icon={<User size={22} />}
          active={!over && turn === you} captured={youCaptured} capturedColor={ai} advantage={youAdv} />
      </div>

      {/* Side panel */}
      <aside className="w-full max-w-[640px] mx-auto lg:max-w-none bg-[#262522] rounded-lg overflow-hidden text-white flex flex-col lg:h-[min(760px,calc(100vh-180px))]">
        <div className="px-4 py-3 border-b border-black/30 bg-[#21201d]">
          <p className={`text-[15px] font-bold ${over ? (result.win ? "text-[#81b64c]" : "text-white") : game.inCheck() ? "text-rose-400" : "text-white"}`}>{status}</p>
          {!over && <p className="text-[12.5px] text-[#a7a6a2] mt-0.5">Click a piece to see its moves, or drag it.</p>}
        </div>

        <div className="px-4 py-3 border-b border-black/30">
          <p className="text-[12px] font-semibold text-[#a7a6a2] mb-2">Difficulty</p>
          <div className="grid grid-cols-3 gap-1.5">
            {LEVELS.map((l) => (
              <button key={l.id} onClick={() => setLevel(l.id)}
                className={`py-2 rounded-md text-[13.5px] font-semibold transition-colors ${level === l.id ? "bg-[#81b64c] text-white" : "bg-[#3c3a37] text-[#d0cfcb] hover:bg-[#4a4844]"}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Moves */}
        <div ref={listRef} className="flex-1 overflow-y-auto min-h-[160px] max-h-[320px] lg:max-h-none text-[14px]">
          {rows.length === 0 ? (
            <p className="px-4 py-8 text-center text-[#a7a6a2] text-[13.5px]">{you === "w" ? "You play White. Make the first move." : "Agent SIHU plays White and moves first."}</p>
          ) : (
            <table className="w-full">
              <tbody>
                {rows.map(([w, b], i) => (
                  <tr key={i} className={i % 2 ? "bg-[#2b2a27]" : ""}>
                    <td className="w-12 pl-4 py-1.5 text-[#a7a6a2]">{i + 1}.</td>
                    <td className={`py-1.5 font-semibold ${i * 2 === history.length - 1 ? "text-white" : "text-[#d0cfcb]"}`}>
                      <span className={i * 2 === history.length - 1 ? "bg-[#4b4847] px-1.5 py-0.5 rounded" : "px-1.5"}>{w?.san}</span>
                    </td>
                    <td className={`py-1.5 pr-4 font-semibold ${i * 2 + 1 === history.length - 1 ? "text-white" : "text-[#d0cfcb]"}`}>
                      {b && <span className={i * 2 + 1 === history.length - 1 ? "bg-[#4b4847] px-1.5 py-0.5 rounded" : "px-1.5"}>{b.san}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-4 border-t border-black/30 bg-[#21201d]">
          {[
            { Icon: Undo2, label: "Take back", onClick: takeBack, disabled: thinking || history.length === 0 },
            { Icon: Lightbulb, label: "Hint", onClick: showHint, disabled: over || thinking || turn !== you },
            { Icon: Repeat, label: "Flip", onClick: () => setOrientation((o) => (o === "white" ? "black" : "white")), disabled: false },
            { Icon: Flag, label: "Resign", onClick: () => setResigned(true), disabled: over || history.length === 0 },
          ].map((b) => (
            <button key={b.label} onClick={b.onClick} disabled={b.disabled}
              className="flex flex-col items-center gap-1 py-3 text-[12px] font-semibold text-[#d0cfcb] hover:bg-[#2b2a27] hover:text-white disabled:opacity-35 disabled:hover:bg-transparent transition-colors">
              <b.Icon size={19} /> {b.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 p-3 bg-[#21201d] border-t border-black/30">
          <button onClick={() => newGame("w")} className="inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[#81b64c] hover:bg-[#95c95e] text-white text-[14.5px] font-bold shadow-[0_4px_0_#5d8a32] active:translate-y-[2px] active:shadow-[0_2px_0_#5d8a32] transition-all">
            <Plus size={17} /> Play White
          </button>
          <button onClick={() => newGame("b")} className="inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[#3c3a37] hover:bg-[#4a4844] text-white text-[14.5px] font-bold shadow-[0_4px_0_#2a2826] active:translate-y-[2px] active:shadow-[0_2px_0_#2a2826] transition-all">
            <Plus size={17} /> Play Black
          </button>
        </div>
      </aside>

      {/* Result window */}
      {showResult && over && (
        <div className="fixed inset-0 z-[80] bg-black/55 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={result.title}>
          <div className="w-full max-w-[360px] bg-[#262522] text-white rounded-xl overflow-hidden shadow-2xl relative">
            <button onClick={() => setShowResult(false)} aria-label="Close" className="absolute top-3 right-3 w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center"><X size={18} /></button>
            <div className={`px-6 pt-8 pb-6 text-center ${result.win ? "bg-[#81b64c]/20" : "bg-[#21201d]"}`}>
              <span className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center ${result.win ? "bg-[#81b64c]" : result.win === null ? "bg-[#3c3a37]" : "bg-[#3c3a37]"}`}>
                {result.win ? <Trophy size={26} /> : result.win === null ? <Handshake size={26} /> : <Bot size={26} />}
              </span>
              <p className="text-[24px] font-extrabold mt-4">{result.title}</p>
              <p className="text-[14px] text-[#d0cfcb] mt-1">{result.text}</p>
              <p className="text-[12.5px] text-[#a7a6a2] mt-2">{history.length} moves · {LEVELS.find((l) => l.id === level)?.label}</p>
            </div>
            <div className="p-4 grid gap-2">
              <button onClick={() => newGame(you)} className="inline-flex items-center justify-center gap-2 py-3.5 rounded-md bg-[#81b64c] hover:bg-[#95c95e] text-white text-[15px] font-bold shadow-[0_4px_0_#5d8a32]">
                <RotateCcw size={17} /> Rematch
              </button>
              <button onClick={() => newGame(you === "w" ? "b" : "w")} className="py-3 rounded-md bg-[#3c3a37] hover:bg-[#4a4844] text-white text-[14px] font-semibold">
                Play as {you === "w" ? "Black" : "White"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
