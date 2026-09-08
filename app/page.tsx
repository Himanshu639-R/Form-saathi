"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [lang, setLang] = useState<"hi" | "en">("hi");

  const t = (hiText: string, enText: string) => (lang === "hi" ? hiText : enText);

  return (
    <main className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between bg-slate-50 text-slate-800 overflow-hidden">
      {/* Prominent & Clear Watermark Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none flex items-center justify-center -z-10">
        <Image
          src="/watermark.png"
          alt="FormSaathi Watermark"
          width={650}
          height={650}
          priority
          className="object-contain"
        />
      </div>

      {/* Language Switcher */}
      <div className="max-w-5xl mx-auto w-full pt-4 px-4 flex justify-end z-10">
        <div className="bg-white p-1 rounded-xl flex items-center border border-slate-200 shadow-sm">
          <button
            onClick={() => setLang("hi")}
            className={`px-3.5 py-1 rounded-lg text-xs font-bold transition ${
              lang === "hi" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3.5 py-1 rounded-lg text-xs font-bold transition ${
              lang === "en" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-6 pb-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          {t("100% एन्क्रिप्टेड एवं सुरक्षित डिजिटल लॉकर", "100% Encrypted & Safe Cloud Vault")}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {t("आपके सभी दस्तावेज़,", "All Your Official Documents,")}{" "}
          <br className="hidden sm:block" />
          <span className="text-blue-600">FormSaathi</span>{" "}
          {t("के साथ पूरी तरह सुरक्षित।", "Secured Always with FormSaathi.")}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          {t(
            "ऑनलाइन सरकारी फॉर्म भरवाएं, अपने ज़रूरी डॉक्यूमेंट्स क्लाउड लॉकर में सुरक्षित रखें और कभी भी फुल फोटो प्रिव्यू देखें।",
            "Fill government forms online, keep your essential documents safe in cloud storage, and view full previews anytime."
          )}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition text-base"
          >
            {t("डिजिटल लॉकर खोलें 🚀", "Open Digital Locker 🚀")}
          </Link>
          <Link
            href="/services"
            className="px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-200 shadow-sm transition text-base"
          >
            {t("सरकारी फॉर्म सेवाएं 📄", "Form Services 📄")}
          </Link>
        </div>
      </section>

      {/* Security & Features Cards */}
      <section className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-5 z-10">
        <div className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="font-bold text-base text-slate-900 mb-1">
            {t("एन्क्रिप्टेड क्लाउड स्टोरेज", "Encrypted Cloud Storage")}
          </h3>
          <p className="text-xs text-slate-600">
            {t(
              "डेटा Supabase Private Storage में पूरी सुरक्षा के साथ सेव रहता है। कोई लीकेज का खतरा नहीं।",
              "Files are saved securely in Supabase Private Storage with zero risk of unauthorized access."
            )}
          </p>
        </div>

        <div className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-3xl mb-2">👁️</div>
          <h3 className="font-bold text-lg text-slate-900 mb-1">
            {t("एचडी डॉक्यूमेंट प्रिव्यू", "HD Document Preview")}
          </h3>
          <p className="text-xs text-slate-600">
            {t(
              "अगर मोबाइल से फोटो डिलीट भी हो जाए, तो भी यहाँ पूरी फोटो क्लियर दिखेगी और डाउनलोड होगी।",
              "Access high-definition previews and download files anytime even if deleted locally."
            )}
          </p>
        </div>

        <div className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-bold text-lg text-slate-900 mb-1">
            {t("फास्ट वेंडर सर्विस", "Verified Vendor Service")}
          </h3>
          <p className="text-xs text-slate-600">
            {t(
              "घर बैठे वेंडर के ज़रिए सरकारी योजनाओं व फॉर्म की ऑनलाइन प्रक्रिया पूरी करवाएं।",
              "Get government forms filled quickly and hassle-free through verified expert vendors."
            )}
          </p>
        </div>
      </section>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60">
        © 2026 FormSaathi. All rights reserved.
      </footer>
    </main>
  );
}