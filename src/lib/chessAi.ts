import { Chess, type Move } from "chess.js";

/*
 * A small chess engine for Agent SIHU: alpha-beta search over material and
 * piece-square tables. Easy picks loosely, Medium looks 2 moves deep, Hard 3.
 */

export type Level = "easy" | "medium" | "hard";

const VALUE: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

// Piece-square tables from White's side (a8 first). Black reads them mirrored.
const PST: Record<string, number[]> = {
  p: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
  n: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30, -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
  b: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10, -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
  r: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
  q: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5, 0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
  k: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20],
};

/** Material and position from White's point of view, in centipawns (no game-over checks). */
function material(game: Chess): number {
  let score = 0;
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const sq = board[r][f];
      if (!sq) continue;
      const idx = sq.color === "w" ? r * 8 + f : (7 - r) * 8 + f;
      const v = VALUE[sq.type] + PST[sq.type][idx];
      score += sq.color === "w" ? v : -v;
    }
  }
  return score;
}

/** Score from White's point of view, in centipawns. */
export function evaluate(game: Chess): number {
  if (game.isCheckmate()) return game.turn() === "w" ? -100000 : 100000;
  if (game.isDraw() || game.isStalemate()) return 0;
  return material(game);
}

const order = (moves: Move[]) =>
  moves.sort((a, b) => (b.captured ? VALUE[b.captured] - VALUE[b.piece] / 10 : 0) + (b.promotion ? 800 : 0)
    - ((a.captured ? VALUE[a.captured] - VALUE[a.piece] / 10 : 0) + (a.promotion ? 800 : 0)));

const MATE = 100000;

function search(game: Chess, depth: number, alpha: number, beta: number, white: boolean, ply: number): number {
  if (depth === 0) return material(game);
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return game.inCheck() ? (white ? -MATE + ply : MATE - ply) : 0;
  order(moves);
  if (white) {
    let best = -Infinity;
    for (const m of moves) {
      game.move(m);
      best = Math.max(best, search(game, depth - 1, alpha, beta, false, ply + 1));
      game.undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const m of moves) {
    game.move(m);
    best = Math.min(best, search(game, depth - 1, alpha, beta, true, ply + 1));
    game.undo();
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

/** The engine's choice for the side to move. */
export function bestMove(fen: string, level: Level): Move | null {
  const game = new Chess(fen);
  const moves = order(game.moves({ verbose: true }));
  if (!moves.length) return null;
  const white = game.turn() === "w";
  const depth = level === "hard" ? 3 : level === "medium" ? 2 : 1;
  // Easy and Medium score every move fully (to pick among good ones);
  // Hard narrows the window with the best score so far, which is much faster.
  const scored: { m: Move; s: number }[] = [];
  let bestSoFar = -Infinity;
  for (const m of moves) {
    game.move(m);
    let s: number;
    if (level === "hard") {
      // From the mover's view: search returns White's score.
      s = white
        ? search(game, depth - 1, bestSoFar - 11, Infinity, false, 1)
        : -search(game, depth - 1, -Infinity, -(bestSoFar - 11), true, 1);
    } else {
      const v = search(game, depth - 1, -Infinity, Infinity, !white, 1);
      s = white ? v : -v;
    }
    game.undo();
    scored.push({ m, s });
    if (s > bestSoFar) bestSoFar = s;
  }
  scored.sort((a, b) => b.s - a.s);
  // Easy plays one of its top moves at random, so it makes human mistakes.
  if (level === "easy") {
    const pool = scored.slice(0, Math.min(5, scored.length));
    return pool[Math.floor(Math.random() * pool.length)].m;
  }
  // Among equally good moves, vary the choice so games differ.
  const top = scored.filter((x) => x.s >= scored[0].s - 10);
  return top[Math.floor(Math.random() * top.length)].m;
}
