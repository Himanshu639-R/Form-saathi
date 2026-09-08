"use client";

import { useState } from "react";
import Image from "next/image";

export default function Services() {
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [selectedService, setSelectedService] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const t = (hiText: string, enText: string) => (lang === "hi" ? hiText : enText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobileNumber || !selectedService) {
      alert(t("कृपया सभी mandatory फ़ील्ड भरें!", "Please fill all mandatory fields!"));
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 relative">
      {/* Background Watermark */}
      <div className="fixed inset-0 opacity-20 pointer-events-none flex items-center justify-center -z-10">
        <Image src="/watermark.png" alt="Watermark" width={600} height={600} priority className="object-contain" />
      </div>

      <div className="max-w-3xl mx-auto space-y-6 z-10 relative">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {t("ऑनलाइन सरकारी सेवाएं", "Online Form Services")}
            </h1>
            <p className="text-xs text-slate-500">
              {t("अपने फॉर्म भरने का आवेदन सीधे सत्यापित वेंडर को भेजें", "Apply for online forms directly to verified vendors")}
            </p>
          </div>
          <button
            onClick={() => setLang(lang === "hi" ? "en" : "hi")}
            className="px-3 py-1 bg-slate-100 font-bold text-xs rounded-lg border border-slate-200"
          >
            {lang === "hi" ? "English" : "हिंदी"}
          </button>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
            <div className="text-4xl">🎉</div>
            <h2 className="text-xl font-bold text-emerald-800">
              {t("आवेदन सफलतापूर्वक जमा हुआ!", "Application Submitted Successfully!")}
            </h2>
            <p className="text-sm text-emerald-700">
              {t(
                "हमारा वेंडर जल्द ही आपके मोबाइल नंबर पर संपर्क करके प्रक्रिया शुरू करेगा।",
                "Our representative vendor will contact your mobile number shortly to proceed."
              )}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm"
            >
              {t("दूसरा आवेदन करें", "Submit Another Application")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t("सेवा का चयन करें (Service Name) *", "Select Service *")}
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- {t("सेवा चुनें", "Choose Service")} --</option>
                <option value="Aadhaar Update">{t("आधार कार्ड अपडेट / सुधार", "Aadhaar Card Update / Correction")}</option>
                <option value="PAN Card">{t("नया पैन कार्ड / संशोधन", "New PAN Card / Correction")}</option>
                <option value="Income Certificate">{t("आय / जाति / निवास प्रमाण पत्र", "Income / Caste / Domicile Certificate")}</option>
                <option value="PF Withdrawal">{t("पीएफ निकासी (PF Claim)", "PF Withdrawal Claim")}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t("पूरा नाम (Full Name) *", "Full Name (English) *")}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t("मोबाइल नंबर (Mobile Number) *", "Mobile Number *")}
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit Mobile Number"
                maxLength={10}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
            >
              {t("आवेदन सबमिट करें 🚀", "Submit Application 🚀")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}