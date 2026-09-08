"use client";

import { useState } from "react";
import Image from "next/image";

interface SavedDocument {
  id: string;
  name: string;
  category: string;
  uploadDate: string;
  fileUrl: string;
  size: string;
}

interface AdBanner {
  id: string;
  imageUrl: string;
  title: string;
  linkUrl: string;
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<"locker" | "order" | "status">("locker");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDoc, setPreviewDoc] = useState<SavedDocument | null>(null);

  // Active Ads managed EXCLUSIVELY by Admin
  const [activeAd, setActiveAd] = useState<AdBanner>({
    id: "ad-1",
    imageUrl: "/watermark.png",
    title: "📢 स्पेशल ऑफर: प्रो मेंबरशिप लें और हर फॉर्म पर ₹50 बचाएं!",
    linkUrl: "#",
  });

  // Digital Locker Saved Documents
  const [userDocs, setUserDocs] = useState<SavedDocument[]>([
    {
      id: "DOC-101",
      name: "Aadhaar Card (Original HD)",
      category: "Identity Proof",
      uploadDate: "2026-09-01",
      fileUrl: "/watermark.png",
      size: "1.2 MB",
    },
    {
      id: "DOC-102",
      name: "Passport Size Photo",
      category: "Photo",
      uploadDate: "2026-09-02",
      fileUrl: "/watermark.png",
      size: "450 KB",
    },
  ]);

  // Order & Payment Hold State
  const [utrNumber, setUtrNumber] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const currentService = {
    title: "जाति एवं निवास प्रमाण पत्र",
    rate: 150,
    vendorName: "Sharma Online Jan Seva",
    vendorUpi: "9876543210@paytm",
    vendorQrImage: "/watermark.png",
  };

  // Document Upload to Digital Locker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newDoc: SavedDocument = {
        id: `DOC-${Date.now()}`,
        name: file.name,
        category: "General Document",
        uploadDate: new Date().toISOString().split("T")[0],
        fileUrl: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };
      setUserDocs([newDoc, ...userDocs]);
      alert("दस्तावेज़ आपके सुरक्षित डिजिटल लॉकर में सेव कर दिया गया है!");
    }
  };

  // Payment Submission with Escrow Hold logic
  const handlePayAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 6) {
      return alert("कृपया सही UTR / Transaction Number दर्ज करें!");
    }
    setOrderSubmitted(true);
  };

  // Filtered documents search
  const filteredDocs = userDocs.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 relative">
      {/* Background Watermark */}
      <div className="fixed inset-0 opacity-10 pointer-events-none flex items-center justify-center -z-10">
        <Image src="/watermark.png" alt="Watermark" width={650} height={650} priority className="object-contain" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Admin Managed Dynamic Ad Banner */}
        {activeAd && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-white text-amber-700 font-bold text-[10px] px-2 py-1 rounded-md uppercase">Sponsored Ad</span>
              <p className="text-xs font-bold">{activeAd.title}</p>
            </div>
            <a
              href={activeAd.linkUrl}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition whitespace-nowrap"
            >
              अभी देखें 🚀
            </a>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3 py-1 bg-blue-600 text-blue-100 font-bold text-[10px] rounded-full uppercase">
              100% Encrypted Cloud Vault
            </span>
            <h1 className="text-2xl font-black mt-2">FormSaathi Digital Dashboard</h1>
            <p className="text-xs text-slate-400">सुरक्षित दस्तावेज़ लॉकर एवं त्वरित फ़ॉर्म सेवाएं</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("locker")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "locker" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              📁 डिजिटल लॉकर
            </button>
            <button
              onClick={() => setActiveTab("order")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "order" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              📝 फ़ॉर्म अप्लाई करें
            </button>
          </div>
        </div>

        {/* TAB 1: DIGITAL LOCKER & HD PREVIEW / DOWNLOAD */}
        {activeTab === "locker" && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 अपने दस्तावेज़ खोजें (उदा. आधार कार्ड)..."
                className="w-full sm:w-2/3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-900"
              />

              <label className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer text-center transition shadow-md">
                📤 नया दस्तावेज़ जोड़ें
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        {doc.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{doc.size}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mt-2 line-clamp-1">{doc.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">अपलोड तारीख: {doc.uploadDate}</p>
                  </div>

                  {/* Actions: HD Preview & Direct Download */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                    >
                      👁️ प्रिव्यू
                    </button>
                    <a
                      href={doc.fileUrl}
                      download={doc.name}
                      className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl text-center"
                    >
                      ⬇️ डाउनलोड
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: APPLY FORM WITH QR CODE & ESCROW PAYMENT HOLD */}
        {activeTab === "order" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            {!orderSubmitted ? (
              <form onSubmit={handlePayAndSubmit} className="space-y-4">
                <div className="text-center space-y-1 border-b pb-4">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                    🛡️ FormSaathi Escrow Payment Guarantee
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-2">{currentService.title}</h2>
                  <p className="text-xs text-slate-500">वेंडर: {currentService.vendorName}</p>
                  <p className="text-3xl font-black text-blue-600 mt-1">₹{currentService.rate}</p>
                </div>

                {/* QR Code & Direct Scan */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                  <p className="text-xs font-bold text-slate-700">नीचे दिए गए QR Code को किसी भी UPI ऐप से स्कैन करें:</p>
                  
                  <div className="w-44 h-44 mx-auto bg-white p-2 rounded-2xl border shadow-inner relative flex items-center justify-center">
                    <Image src={currentService.vendorQrImage} alt="Vendor QR" width={160} height={160} className="object-contain" />
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border text-xs font-mono font-bold text-blue-900 select-all">
                    UPI ID: {currentService.vendorUpi}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    पेमेंट के बाद UTR / Transaction Number दर्ज करें
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="उदा. 409182739182"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition">
                  पेमेंट HOLD सुरक्षा के साथ फ़ॉर्म सबमिट करें 🛡️
                </button>
              </form>
            ) : (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="text-4xl">🔒</div>
                <h3 className="font-bold text-emerald-900">आपकी पेमेंट HOLD (सुरक्षित) में रखी गई है!</h3>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  आपका UTR (<strong>{utrNumber}</strong>) वेंडर के पास सत्यापन के लिए भेज दिया गया है। जब वेंडर आपका काम पूरा करके रसीद अपलोड करेगा, तभी आपका पैसा रिलीज होगा।
                </p>
                <button
                  onClick={() => { setOrderSubmitted(false); setUtrNumber(""); }}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  एक और फ़ॉर्म भरें
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODAL: HD DOCUMENT PREVIEW */}
        {previewDoc && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{previewDoc.name}</h3>
                  <p className="text-[10px] text-slate-400">{previewDoc.category} • {previewDoc.size}</p>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs"
                >
                  ✕ बंद करें
                </button>
              </div>

              <div className="w-full h-64 bg-slate-100 rounded-2xl border flex items-center justify-center relative overflow-hidden">
                <Image src={previewDoc.fileUrl} alt="HD Preview" fill className="object-contain" />
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={previewDoc.fileUrl}
                  download={previewDoc.name}
                  className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl text-center shadow-md"
                >
                  ओरिजिनल HD डाउनलोड करें ⬇️
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}