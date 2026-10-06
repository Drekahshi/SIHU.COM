"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pickaxe, Droplets, ArrowLeftRight, Landmark } from "lucide-react";

const TABS = [
  { name: "Overview", href: "/dapp", Icon: LayoutDashboard },
  { name: "Mine", href: "/dapp/mine", Icon: Pickaxe },
  { name: "Pools", href: "/dapp/pools", Icon: Droplets },
  { name: "Swap", href: "/dapp/swap", Icon: ArrowLeftRight },
  { name: "Vaults", href: "/dapp/vaults", Icon: Landmark },
];

/** Tabs that join the DApp pages together, under the site header. */
export default function DappNav() {
  const path = usePathname() ?? "";
  return (
    <div className="sticky top-[72px] z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10">
      <nav className="container mx-auto max-w-6xl px-4 lg:px-8 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="DApp">
        {TABS.map((t) => {
          const on = t.href === "/dapp" ? path === "/dapp" : path.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} aria-current={on ? "page" : undefined}
              className={`relative shrink-0 inline-flex items-center gap-2 px-4 h-12 text-[14px] font-semibold transition-colors ${on ? "text-white" : "text-slate-400 hover:text-white"}`}>
              <t.Icon size={16} /> {t.name}
              {on && <span className="absolute left-3 right-3 bottom-0 h-[3px] rounded-full bg-sky-400" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
