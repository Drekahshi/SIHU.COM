"use client";

import React, { createContext, useContext } from "react";

// Mock mode: Privy auth is disabled until credentials are configured.
// The interface is fully preserved so all call-sites compile without changes.

export interface SihuAuth {
  ready: boolean;
  available: boolean;
  signedIn: boolean;
  email: string | null;
  name: string | null;
  signInWithGoogle: () => void;
  signInWithEmail: () => void;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const MOCK_AUTH: SihuAuth = {
  ready: true,
  available: false,
  signedIn: false,
  email: null,
  name: null,
  signInWithGoogle: () => {},
  signInWithEmail: () => {},
  signOut: async () => {},
  getAccessToken: async () => null,
};

const Ctx = createContext<SihuAuth>(MOCK_AUTH);

export const useSihuAuth = () => useContext(Ctx);

export default function SihuAuthProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={MOCK_AUTH}>{children}</Ctx.Provider>;
}
