import NewsHeader from "@/components/portal/NewsHeader";

/* The home page shares the news portal's header, so the whole site feels like one. */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <NewsHeader />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
