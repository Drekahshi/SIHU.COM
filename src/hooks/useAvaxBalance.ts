"use client";

import { useEffect, useCallback } from "react";
import { useSihuStore } from "@/store/useSihuStore";
import { getWalletBalance } from "@/services/avalancheService";

/**
 * Polls the live AVAX balance every 30 seconds while a wallet is connected.
 * Updates useSihuStore.balances.avax and avaxUsd automatically.
 */
export function useAvaxBalance() {
  const { connected, accountId, setBalances } = useSihuStore();

  const refresh = useCallback(async () => {
    if (!connected || !accountId || !accountId.startsWith("0x")) return;
    try {
      const bal = await getWalletBalance(accountId as `0x${string}`);
      setBalances(Number(bal.avaxFormatted), bal.avaxUsd);
    } catch {
      // Network error — keep existing balance displayed
    }
  }, [connected, accountId, setBalances]);

  useEffect(() => {
    if (!connected) return;
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [connected, refresh]);

  return { refresh };
}
