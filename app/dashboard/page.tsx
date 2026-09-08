"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Supabase Init with Session Persistence
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true }
});

interface DocType {
  id: string;
  name: string;
  url: string;
  size?: string;
}

export default function Dashboard() {
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocType | null>(null);
  const [userId, setUserId] = useState<string>("FS-2026-0001");
  const [plan, setPlan] = useState<"Free" | "Pro">("Free");

  const t = (hiText: string, enText: string) => (lang === "hi" ? hiText : enText);

  useEffect(() => {
    // Page top scroll fix
    window.scrollTo(0, 0);

    // Fetch Unique ID & Docs
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Unique ID based on account creation timestamp/index
        const shortId = session.user.id.slice(0, 4).toUpperCase();
        setUserId(`FS-2026-${shortId}`);
      }
      fetchDocuments();
    };

    initDashboard();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data } = await supabase.storage.from("documents").list();
    if (data) {
      const formattedDocs = data.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("documents")
          .getPublicUrl(file.name);
        
        const fileSize = file.metadata && "size" in file.metadata 
          ? `${((file.metadata as { size: number }).size / 1024).toFixed(1)} KB`
          : "Encrypted Cloud File";

        return {
          id: file.id || file.name,
          name: file.name,
          url: publicUrlData.publicUrl,
          size: fileSize,
        };
      });
      setDocuments(formattedDocs);
    }
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert(t("कृपया फ़ाइल चुनें!", "Please select a file!"));
    setLoading(true);

    const fileName = `${Date.now()}_${selectedFile.name}`;
    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, selectedFile);

    if (error) {
      alert(t("अपलोड में समस्या आई: ", "Upload failed: ") + error.message);
    } else {
      alert(t("दस्तावेज़ लॉकर में सुरक्षित सेव हो गया!", "Document safely stored in Vault!"));
      setSelectedFile(null);
      fetchDocuments();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 relative">
      {/* Background Watermark */}
      <div className="fixed inset-0 opacity-20 pointer-events-none flex items-center justify-center -z-10">
        <Image src="/watermark.png" alt="Watermark" width={650} height={650} priority className="object-contain" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6 z-10 relative">
        
        {/* User Card Header with Unique ID & Subscription Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 font-mono font-bold text-xs rounded-md">
                ID: {userId}
              </span>
              <span className={`px-2.5 py-0.5 font-bold text-xs rounded-md ${
                plan === "Pro" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
              }`}>
                {plan === "Pro" ? "👑 Pro Member" : "Free Member"}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              {t("आपका डिजिटल लॉकर", "Your Digital Vault")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "hi" ? "en" : "hi")}
              className="px-3 py-1.5 bg-slate-100 text-xs font-bold rounded-xl border border-slate-200"
            >
              {lang === "hi" ? "English" : "हिंदी"}
            </button>
            <button
              onClick={fetchDocuments}
              className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Subscription Upgrade Card (Optional Extra Income Feature) */}
        {plan === "Free" && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-lg">🚀 {t("FormSaathi Pro में अपग्रेड करें", "Upgrade to FormSaathi Pro")}</h3>
              <p className="text-xs text-blue-100 mt-1">
                {t(
                  "मात्र ₹49/महीना में पाएं अनलिमिटेड स्टोरेज, VIP फ़ास्ट वेंडर सर्विस और 24/7 सपोर्ट!",
                  "Get Unlimited Storage, Fast VIP Vendor Processing & Priority Support for just ₹49/month!"
                )}
              </p>
            </div>
            <button
              onClick={() => alert(t("Pro प्लैन के लिए धन्यवाद! UPI पेमेंट गेटवे जल्द उपलब्ध होगा।", "Thank you! UPI Payment Gateway coming soon."))}
              className="px-6 py-2.5 bg-white text-blue-700 font-bold text-xs rounded-xl shadow-sm hover:bg-blue-50 whitespace-nowrap"
            >
              {t("₹49/माह में एक्टिव करें", "Activate @ ₹49/mo")}
            </button>
          </div>
        )}

        {/* Upload Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">
            {t("नया दस्तावेज़ लॉकर में जोड़ें", "Add New Document to Vault")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-slate-500 text-xs border border-slate-200 rounded-xl p-1 w-full"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 transition whitespace-nowrap"
            >
              {loading ? t("अपलोड हो रहा है...", "Uploading...") : t("अपलोड करें 🔒", "Upload 🔒")}
            </button>
          </div>
        </div>

        {/* Saved Documents Grid with Live Preview */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">
            {t("सुरक्षित दस्तावेज़ सूची", "Stored Safe Documents")}
          </h2>

          {documents.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              {t("कोई दस्तावेज़ नहीं मिला। ऊपर से नया दस्तावेज़ अपलोड करें।", "No documents found. Upload a file above.")}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-lg">
                    📄
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-800 text-xs truncate">{doc.name}</p>
                    <p className="text-[10px] text-slate-400">{doc.size}</p>
                  </div>
                </div>

                <div className="flex gap-2 border-t pt-3 border-slate-100">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition text-center"
                  >
                    👁️ {t("देखें (Preview)", "Preview")}
                  </button>
                  <a
                    href={doc.url}
                    target="_blank"
                    download
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition text-center"
                  >
                    ⬇️ {t("डाउनलोड", "Download")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Screen HD Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-2xl w-full max-h-[90vh] flex flex-col relative shadow-2xl">
            <div className="flex justify-between items-center mb-3 border-b pb-2 border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{previewDoc.name}</h3>
                <p className="text-[10px] text-slate-400">{t("100% ओरिजिनल प्रिव्यू", "100% Original Preview")}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full font-bold text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="w-full h-[60vh] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-2">
              <img
                src={previewDoc.url}
                alt={previewDoc.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            <div className="mt-3 flex justify-end">
              <a
                href={previewDoc.url}
                target="_blank"
                download
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
              >
                {t("ओरिजिनल फ़ाइल डाउनलोड करें", "Download Original File")}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}