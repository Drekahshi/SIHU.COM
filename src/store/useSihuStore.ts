import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Account } from "viem";

interface SihuState {
  connected: boolean;
  walletType: "native" | "core" | "metamask" | null;
  accountId: string;
  privateKey: string | null;
  publicKey: string | null;
  autoMineActive: boolean;
  balances: { avax: number; avaxUsd: string; sihu: number; usdt: number };
  account: Account | null;
  connectWallet: (
    type: "native" | "core" | "metamask",
    accountId?: string,
    priv?: string,
    pub?: string,
    account?: Account,
  ) => void;
  setBalances: (avax: number, avaxUsd: string) => void;
  disconnectWallet: () => void;
  toggleAutoMine: () => void;
  incrementSihu: (amount: number) => void;
}

export const useSihuStore = create<SihuState>()(
  persist(
    set => ({
      connected: false,
      walletType: null,
      accountId: "",
      privateKey: null,
      publicKey: null,
      autoMineActive: false,
      balances: { avax: 0, avaxUsd: "0.00", sihu: 0, usdt: 0 },
      account: null,

      connectWallet: (type, accountId, priv, pub, account) =>
        set({
          connected: true,
          walletType: type,
          accountId: accountId ?? "",
          privateKey: priv ?? null,
          publicKey: pub ?? null,
          account: account ?? null,
          balances: { avax: 0, avaxUsd: "0.00", sihu: 0, usdt: 0 },
        }),

      setBalances: (avax, avaxUsd) =>
        set(s => ({ balances: { ...s.balances, avax, avaxUsd } })),

      disconnectWallet: () =>
        set({
          connected: false,
          walletType: null,
          accountId: "",
          privateKey: null,
          publicKey: null,
          autoMineActive: false,
          balances: { avax: 0, avaxUsd: "0.00", sihu: 0, usdt: 0 },
          account: null,
        }),

      toggleAutoMine: () => set(s => ({ autoMineActive: !s.autoMineActive })),

      incrementSihu: amount =>
        set(s => ({ balances: { ...s.balances, sihu: s.balances.sihu + amount } })),
    }),
    {
      name: "sihu-wallet",
      // Only persist non-sensitive state — never persist privateKey
      partialize: s => ({
        connected: s.connected,
        walletType: s.walletType,
        accountId: s.accountId,
        publicKey: s.publicKey,
      }),
    },
  ),
);
