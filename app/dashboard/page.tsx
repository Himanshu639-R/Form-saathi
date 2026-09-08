"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

// Supabase Init
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DocType {
  id: string;
  name: string;
  url: string;
  created_at?: string;
  size?: string;
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocType | null>(null);

  // Fetch Documents
  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from("documents").list();
    if (data) {
      const formattedDocs = data.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("documents")
          .getPublicUrl(file.name);
        
        // Safe size calculation without metadata TS errors
        const fileSize = file.metadata && "size" in file.metadata 
          ? `${((file.metadata as { size: number }).size / 1024).toFixed(1)} KB`
          : "Cloud Stored";

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

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload File Function
  const handleUpload = async () => {
    if (!selectedFile) return alert("कृपया पहले कोई फ़ाइल चुनें!");
    setLoading(true);

    const fileName = `${Date.now()}_${selectedFile.name}`;
    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, selectedFile);

    if (error) {
      alert("अपलोड में समस्या आई: " + error.message);
    } else {
      alert("दस्तावेज़ सफलतापूर्वक अपलोड हो गया!");
      setSelectedFile(null);
      fetchDocuments();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 relative">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">डिजिटल लॉकर (Document Vault)</h1>
            <p className="text-sm text-slate-500">आपके अपलोड किए गए दस्तावेज़ यहाँ सुरक्षित संग्रहीत हैं।</p>
          </div>
          <button
            onClick={fetchDocuments}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition"
          >
            🔄 रिफ्रेश लिस्ट
          </button>
        </div>

        {/* Upload Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800">नया दस्तावेज़ जोड़ें</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-slate-500 text-sm border border-slate-200 rounded-xl p-1 w-full"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-50 transition"
            >
              {loading ? "अपलोड हो रहा है..." : "अपलोड करें"}
            </button>
          </div>
        </div>

        {/* Documents List Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">आपके दस्तावेज़</h2>

          {documents.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
              कोई दस्तावेज़ नहीं मिला। ऊपर से नया दस्तावेज़ अपलोड करें।
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xl">
                    📄
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-slate-800 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.size || "Cloud Stored"}</p>
                  </div>
                </div>

                {/* Preview & Action Buttons */}
                <div className="flex gap-2 border-t pt-3 border-slate-100">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition text-center"
                  >
                    👁️ देखें (Preview)
                  </button>
                  <a
                    href={doc.url}
                    target="_blank"
                    download
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition text-center"
                  >
                    ⬇️ डाउनलोड
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Document/Image Preview Lightbox Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] flex flex-col relative shadow-2xl animate-in fade-in zoom-in duration-150">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{previewDoc.name}</h3>
                <p className="text-xs text-slate-400">दस्तावेज़ प्रिव्यू</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full font-bold text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content (Full Photo View) */}
            <div className="w-full h-[65vh] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-2 relative">
              <img
                src={previewDoc.url}
                alt={previewDoc.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              />
            </div>

            {/* Modal Footer */}
            <div className="mt-4 flex justify-end gap-3">
              <a
                href={previewDoc.url}
                target="_blank"
                download
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
              >
                ओरिजिनल फ़ाइल डाउनलोड करें
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}