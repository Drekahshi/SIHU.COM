"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { PrivyProvider, useLoginWithOAuth, usePrivy } from "@privy-io/react-auth";

/*
 * SIHU sign-in uses the same Privy app as the KAI platform, so one account
 * (Google or email) works on both. Google uses Privy's full-page redirect,
 * which is more reliable than a popup on phones.
 */

export interface SihuAuth {
  /** false until Privy has checked for an existing session */
  ready: boolean;
  /** false when no Privy app id is set for this site */
  available: boolean;
  signedIn: boolean;
  email: string | null;
  name: string | null;
  signInWithGoogle: () => void;
  signInWithEmail: () => void;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const OFF: SihuAuth = {
  ready: true, available: false, signedIn: false, email: null, name: null,
  signInWithGoogle: () => {}, signInWithEmail: () => {}, signOut: async () => {}, getAccessToken: async () => null,
};

const Ctx = createContext<SihuAuth>(OFF);
export const useSihuAuth = () => useContext(Ctx);

function Bridge({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const { initOAuth } = useLoginWithOAuth();
  const google = user?.google;
  const email = user?.email?.address ?? google?.email ?? null;
  const name = google?.name ?? null;

  const signInWithGoogle = useCallback(() => { void initOAuth({ provider: "google" }); }, [initOAuth]);
  const signInWithEmail = useCallback(() => login({ loginMethods: ["email"] }), [login]);

  const value = useMemo<SihuAuth>(() => ({
    ready, available: true, signedIn: ready && authenticated, email, name,
    signInWithGoogle, signInWithEmail,
    signOut: async () => { await logout(); },
    getAccessToken: async () => { try { return await getAccessToken(); } catch { return null; } },
  }), [ready, authenticated, email, name, signInWithGoogle, signInWithEmail, logout, getAccessToken]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export default function SihuAuthProvider({ children }: { children: React.ReactNode }) {
  // Privy app ids are 25 characters; a wrong value must not take the site down.
  const appId = (process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "").trim().replace(/^["']|["']$/g, "");
  if (appId.length !== 25) return <Ctx.Provider value={OFF}>{children}</Ctx.Provider>;
  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethodsAndOrder: { primary: ["email", "google"] },
        appearance: { theme: "light", accentColor: "#0284c7", logo: "/images/logo-main.png" },
        embeddedWallets: { ethereum: { createOnLogin: "off" } },
      }}
    >
      <Bridge>{children}</Bridge>
    </PrivyProvider>
  );
}
