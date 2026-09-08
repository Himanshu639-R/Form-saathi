import "./globals.css";

export const metadata = {
  title: "FormSaathi - Secure Locker & Government Services",
  description: "Private & Encrypted Document Locker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col">
        {/* Top Professional Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="FormSaathi Logo"
              className="w-9 h-9 rounded-lg object-contain"
            />
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Form<span className="text-blue-600">Saathi</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                Private & Encrypted Locker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              256-Bit SSL
            </span>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}