import type { Metadata } from 'next';
import './globals.css';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'FormSaathi - Digital Data Locker',
  description: 'Secure Government Applications & Document Locker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="bg-gray-100 min-h-screen relative overflow-x-hidden">
        {/* Background Watermark */}
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-5 z-0">
          <img src="/watermark.png" alt="Watermark" className="w-80 h-80 object-contain" />
        </div>

        {/* Header with App Logo */}
        <header className="bg-blue-700 text-white p-3 shadow-md border-b border-blue-800 sticky top-0 z-50">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center shadow">
                <img src="/logo.png" alt="FormSaathi Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-wide text-white block leading-none">
                  FormSaathi
                </span>
                <span className="text-[10px] text-blue-200">Private & Encrypted Locker[cite: 1]</span>
              </div>
            </div>
            <div className="bg-blue-800 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-blue-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              256-Bit SSL
            </div>
          </div>
        </header>

        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}