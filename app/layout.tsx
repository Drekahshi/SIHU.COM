import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sango Information Hub | News Portal",
  description: "Knowledge management and information sharing on natural resources and environmental protection around the Lake Victoria Basin in Kenya.",
  keywords: ["Sango", "Information Hub", "Lake Victoria", "Environment", "News", "Kenya"],
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        
        {/* Viewport for children */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-950 text-white py-24 border-t border-white/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
               <div className="md:col-span-2">
                  <h3 className="font-black text-2xl mb-6 uppercase tracking-tighter text-nyc-header">Sango Information Hub</h3>
                  <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md">
                    An elite community media network established for knowledge management and environmental protection across the Lake Victoria Basin.
                  </p>
                  <div className="mt-10 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-primary transition-all cursor-pointer">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </div>
                    {/* Add more icons as needed */}
                  </div>
               </div>
               <div>
                  <h4 className="font-black mb-6 uppercase tracking-[0.2em] text-[10px] text-primary">Intelligence</h4>
                  <ul className="space-y-4 text-slate-400 font-medium text-sm">
                    <li><a href="/portal" className="hover:text-white transition-colors">Latest News</a></li>
                    <li><a href="/portal#podcasts" className="hover:text-white transition-colors">Podcasts</a></li>
                    <li><a href="/portal#events" className="hover:text-white transition-colors">Events</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-black mb-6 uppercase tracking-[0.2em] text-[10px] text-primary">Access</h4>
                  <ul className="space-y-4 text-slate-400 font-medium text-sm">
                    <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                    <li><Link href="/admin" className="hover:text-white transition-colors">Admin Gateway</Link></li>
                    <li><a href="#contact" className="hover:text-white transition-colors">Connect</a></li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                  © {new Date().getFullYear()} Sango Information Hub. Elite Media Network.
               </div>
               <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
                  <span className="hover:text-primary cursor-pointer transition-colors">Terms of Reach</span>
               </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
