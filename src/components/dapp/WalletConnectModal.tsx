"use client";

import { useState } from "react";
import {
  X, Shield, KeyRound, CheckCircle2, Copy, Rocket,
  Lock, Loader2, AlertCircle, ExternalLink,
} from "lucide-react";
import { useSihuStore } from "@/store/useSihuStore";
import {
  generateAvaxWallet,
  walletFromPrivateKey,
  connectMetaMaskToAvax,
  getWalletBalance,
  network,
  shortAddress,
  explorerLink,
} from "@/services/avalancheService";

type Step = "select" | "generating" | "importing" | "metamask" | "done" | "error";

export default function WalletConnectModal({ onClose }: { onClose: () => void }) {
  const { connectWallet, setBalances } = useSihuStore();
  const [step, setStep] = useState<Step>("select");
  const [errorMsg, setErrorMsg] = useState("");
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [importAddr, setImportAddr] = useState("");
  const [importKey, setImportKey] = useState("");

  const copy = (txt: string) => {
    navigator.clipboard?.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const fetchAndStoreBalance = async (addr: `0x${string}`) => {
    try {
      const bal = await getWalletBalance(addr);
      setBalances(Number(bal.avaxFormatted), bal.avaxUsd);
    } catch {
      // Balance fetch is non-critical — don't block the flow
    }
  };

  const handleGenerate = async () => {
    setStep("generating");
    await new Promise(r => setTimeout(r, 800));
    try {
      const wallet = generateAvaxWallet();
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      connectWallet("native", wallet.address, wallet.privateKey, "", wallet.account);
      await fetchAndStoreBalance(wallet.address);
      setStep("done");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Failed to generate wallet.");
      setStep("error");
    }
  };

  const handleImport = async () => {
    if (!importKey) return;
    setStep("generating");
    try {
      const wallet = walletFromPrivateKey(importKey);
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      connectWallet("native", wallet.address, wallet.privateKey, "", wallet.account);
      await fetchAndStoreBalance(wallet.address);
      setStep("done");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Invalid private key.");
      setStep("error");
    }
  };

  const handleMetaMask = async () => {
    setStep("metamask");
    try {
      const addr = await connectMetaMaskToAvax();
      setAddress(addr);
      connectWallet("metamask", addr);
      await fetchAndStoreBalance(addr);
      setStep("done");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "MetaMask connection failed.");
      setStep("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
      style={{ background: "rgba(15,23,42,0.88)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] rounded-t-3xl md:rounded-3xl border border-sky-500/20 shadow-2xl p-6"
        style={{ background: "linear-gradient(180deg,#0F172A 0%,#1e293b 100%)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="md:hidden w-12 h-1.5 rounded-full bg-white/10 mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Connect wallet</h2>
            <p className="text-sm text-sky-400/60 font-medium">
              {network.name} · Chain {network.chainId}
              {network.isTestnet && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                  testnet
                </span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white p-2 rounded-full bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* ── Select ────────────────────────────────────────────── */}
        {step === "select" && (
          <div className="flex flex-col gap-3">
            <button onClick={handleGenerate}
              className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
              style={{ background: "rgba(16,185,129,0.05)" }}>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0">
                <Rocket size={24} className="text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-white text-[16px]">Create new wallet</p>
                <p className="text-sm text-emerald-400/60">Generate a fresh secp256k1 keypair</p>
              </div>
            </button>

            <button onClick={handleMetaMask}
              className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 hover:border-orange-400/50 hover:bg-white/5 transition-all group"
              style={{ background: "rgba(251,146,60,0.05)" }}>
              <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0 text-2xl">
                🦊
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-white text-[16px]">MetaMask / Core Wallet</p>
                <p className="text-sm text-orange-400/60">Connect an existing EVM wallet</p>
              </div>
            </button>

            <button onClick={() => setStep("importing")}
              className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 hover:border-sky-500/50 hover:bg-white/5 transition-all group"
              style={{ background: "rgba(59,130,246,0.05)" }}>
              <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center shrink-0">
                <KeyRound size={24} className="text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-white text-[16px]">Import wallet</p>
                <p className="text-sm text-sky-400/60">Use an existing private key</p>
              </div>
            </button>

            <p className="text-[11px] text-white/25 text-center mt-3 leading-relaxed px-4">
              Keys stay in your browser only. This DApp runs on {network.name} — {network.isTestnet ? "no real funds." : "real funds. Handle with care."}
            </p>
          </div>
        )}

        {/* ── Import ────────────────────────────────────────────── */}
        {step === "importing" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-black text-white/40 uppercase tracking-widest mb-2 block">
                Private key (0x…)
              </label>
              <input type="password" value={importKey} onChange={e => setImportKey(e.target.value)}
                placeholder="0x1a2b3c…"
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm text-white font-mono outline-none focus:border-sky-500/50" />
              <p className="text-[10px] text-white/25 mt-1.5 px-1">
                Your address will be derived automatically from the key.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("select")}
                className="flex-[0.5] py-4 rounded-2xl text-xs font-black uppercase text-white/40 bg-white/5 hover:bg-white/10 transition-colors">
                Back
              </button>
              <button onClick={handleImport} disabled={!importKey.trim()}
                className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-sky-600 hover:bg-sky-500 text-white transition-colors disabled:opacity-30 disabled:pointer-events-none">
                Import wallet
              </button>
            </div>
          </div>
        )}

        {/* ── Generating ─────────────────────────────────────────── */}
        {(step === "generating" || step === "metamask") && (
          <div className="flex flex-col items-center gap-6 py-10">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={26} className="text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-1">
                {step === "metamask" ? "Waiting for wallet…" : "Generating keypair…"}
              </p>
              <p className="text-sm text-emerald-400/60">
                {step === "metamask" ? "Confirm the prompt in your wallet app" : "secp256k1 · Avalanche C-Chain"}
              </p>
            </div>
          </div>
        )}

        {/* ── Error ──────────────────────────────────────────────── */}
        {step === "error" && (
          <div className="flex flex-col items-center gap-5 py-6">
            <AlertCircle size={40} className="text-red-400" />
            <p className="text-white font-bold text-lg text-center">{errorMsg}</p>
            <button onClick={() => { setStep("select"); setErrorMsg(""); }}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors">
              Try again
            </button>
          </div>
        )}

        {/* ── Done ───────────────────────────────────────────────── */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <p className="font-black text-white text-2xl tracking-tight">Wallet connected!</p>

            {/* Address */}
            <div className="w-full bg-black/20 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">C-Chain address</p>
                <a href={explorerLink(address, "address")} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-sky-400 flex items-center gap-1 hover:text-sky-300">
                  View <ExternalLink size={10} />
                </a>
              </div>
              <button onClick={() => copy(address)} className="text-left w-full group">
                <p className="text-xs text-sky-400 font-mono tracking-wider break-all group-hover:text-sky-300 transition-colors">
                  {address}
                </p>
                <p className="text-[10px] text-white/20 mt-1">{copied ? "✓ Copied!" : "Click to copy"}</p>
              </button>
            </div>

            {/* Private key — native wallets only */}
            {privateKey && (
              <div className="w-full bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Private key</p>
                  <button onClick={() => copy(privateKey)} className="text-amber-400/50 hover:text-amber-300 transition-colors">
                    <Copy size={14} />
                  </button>
                </div>
                <p className="text-[10px] text-white/50 font-mono break-all leading-relaxed">{shortAddress(privateKey, 8)}…</p>
                <div className="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-[10px] text-red-400 font-bold text-center uppercase tracking-wider">
                    ⚠ Save this key securely. It will not be shown again.
                  </p>
                </div>
              </div>
            )}

            <button onClick={onClose}
              className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors mt-1">
              <Shield size={16} /> Enter SIHU DApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
