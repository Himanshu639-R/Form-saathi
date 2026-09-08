"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 overflow-hidden">
      {/* Dynamic Background Watermark */}
      <div className="fixed inset-0 opacity-[0.07] pointer-events-none flex items-center justify-center -z-10">
        <Image
          src="/watermark.png"
          alt="FormSaathi Watermark"
          width={600}
          height={600}
          priority
          className="object-contain"
        />
      </div>

      {/* Hero Banner Section */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          100% Encrypted & Cloud Secured Storage
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          आपके सभी दस्तावेज़, <br className="hidden sm:block" />
          <span className="text-blue-600">FormSaathi</span> के साथ सुरक्षित।
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          सरकारी सेवाओं के फॉर्म भरें, अपने ज़रूरी दस्तावेज़ स्टोर करें और कभी भी डाउनलोड या शेयर करें।
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/25 transition duration-200 text-lg"
          >
            डिजिटल लॉकर खोलें 🚀
          </Link>
          <Link
            href="/services"
            className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-2xl border border-slate-200 shadow-sm transition duration-200 text-lg"
          >
            सरकारी सेवाएं 📄
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
        <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="font-bold text-lg text-slate-900 mb-1">सुरक्षित क्लाउड स्टोरेज</h3>
          <p className="text-sm text-slate-600">आपके दस्तावेज़ Supabase Cloud Locker में हमेशा सुरक्षित रहते हैं।</p>
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-3xl mb-3">👁️</div>
          <h3 className="font-bold text-lg text-slate-900 mb-1">लाइव प्रिव्यू सुविधा</h3>
          <p className="text-sm text-slate-600">फ़ोन से डिलीट होने के बाद भी अपने ओरिजिनल डॉक्यूमेंट को कभी भी खोलकर देखें।</p>
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-bold text-lg text-slate-900 mb-1">त्वरित फॉर्म सर्विस</h3>
          <p className="text-sm text-slate-600">एक क्लिक में वेंडर को सुरक्षित रूप से अपने दस्तावेज़ भेजकर फॉर्म भरवाएं।</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/50">
        © 2026 FormSaathi. All rights reserved.
      </footer>
    </main>
  );
}