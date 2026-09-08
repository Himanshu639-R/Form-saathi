"use client";

import { useState } from "react";
import Image from "next/image";

interface FormService {
  id: string;
  title: string;
  category: string;
  price: string;
  commission: string;
  requiredDocs: string[];
}

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Initial Services List (Master Control)
  const [services, setServices] = useState<FormService[]>([
    {
      id: "1",
      title: "आधार कार्ड संशोधन / अपडेट",
      category: "Aadhaar Services",
      price: "₹100",
      commission: "₹30",
      requiredDocs: ["ओरिजिनल आधार कार्ड", "पहचान पत्र (PAN/Voter ID)", "मोबाइल नंबर"],
    },
    {
      id: "2",
      title: "नया पैन कार्ड (Instant PAN)",
      category: "PAN Services",
      price: "₹150",
      commission: "₹40",
      requiredDocs: ["आधार कार्ड linked with Mobile", "पासपोर्ट फोटो"],
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCommission, setNewCommission] = useState("");
  const [newDocs, setNewDocs] = useState("");

  // Master Access Lock (Admin Secret Pin)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "6399") { // Master PIN
      setIsAuthorized(true);
    } else {
      alert("गलत मास्टर पिन! केवल ऑपरेटर/मास्टर ही एक्सेस कर सकते हैं।");
    }
  };

  // Add New Form Service & Requirement List
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return alert("कृपया सर्विस नाम और रेट भरें!");

    const newEntry: FormService = {
      id: Date.now().toString(),
      title: newTitle,
      category: "Government Form",
      price: `₹${newPrice}`,
      commission: `₹${newCommission || "20"}`,
      requiredDocs: newDocs ? newDocs.split(",") : ["सामान्य पहचान पत्र"],
    };

    setServices([...services, newEntry]);
    setNewTitle("");
    setNewPrice("");
    setNewCommission("");
    setNewDocs("");
    alert("नई सेवा और डॉक्यूमेंट लिस्ट सफलतापूर्वक जुड़ गई!");
  };

  // Delete Service (Master Right Only)
  const handleDeleteService = (id: string) => {
    if (confirm("क्या आप वाकई इस सेवा को पूरे प्लेटफॉर्म से हटाना चाहते हैं?")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleAdminLogin} className="bg-white p-8 rounded-3xl max-w-sm w-full space-y-4 text-center shadow-2xl">
          <div className="text-4xl">👑</div>
          <h2 className="text-xl font-black text-slate-900">FormSaathi Master Control</h2>
          <p className="text-xs text-slate-500">सुरक्षा पिन दर्ज करें</p>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter Master PIN (6399)"
            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-center font-bold text-lg outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-sm">
            मास्टर कंट्रोल खोलें 🔓
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 relative">
      {/* Background Watermark */}
      <div className="fixed inset-0 opacity-15 pointer-events-none flex items-center justify-center -z-10">
        <Image src="/watermark.png" alt="Watermark" width={650} height={650} priority className="object-contain" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <span className="px-2 py-0.5 bg-amber-400 text-slate-900 font-bold text-[10px] rounded-md">
              SUPER ADMIN MASTER
            </span>
            <h1 className="text-2xl font-black mt-1">मास्टर कंट्रोल पैनल (Owner Panel)</h1>
          </div>
          <button
            onClick={() => setIsAuthorized(false)}
            className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl hover:bg-slate-700 transition"
          >
            🔒 लॉगआउट
          </button>
        </div>

        {/* Master Form Addition */}
        <form onSubmit={handleAddService} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">➕ नई फॉर्म सेवा व आवश्यक दस्तावेज़ जोड़ें</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="सेवा का नाम (जैसे: जाति प्रमाण पत्र)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            />
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="ग्राहक शुल्क (₹)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            />
            <input
              type="number"
              value={newCommission}
              onChange={(e) => setNewCommission(e.target.value)}
              placeholder="वेंडर कमीशन (₹)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            />
          </div>
          <input
            type="text"
            value={newDocs}
            onChange={(e) => setNewDocs(e.target.value)}
            placeholder="ज़रूरी डॉक्यूमेंट्स की लिस्ट (Comma से अलग करें: जैसे आधार कार्ड, फोटो, राशन कार्ड)"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
            मास्टर लिस्ट में शामिल करें 🚀
          </button>
        </form>

        {/* Live Master Services List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">एक्टिव सेवाएं एवं वेंडर रेट कट (Live Master Data)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                    <p className="text-[10px] text-slate-400">{item.category}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteService(item.id)}
                    className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold"
                  >
                    🗑️ डिलीट
                  </button>
                </div>

                <div className="flex gap-4 text-xs font-semibold bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-emerald-700">रेट: {item.price}</span>
                  <span className="text-blue-700">वेंडर कमीशन: {item.commission}</span>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-700 mb-1">आवश्यक डॉक्यूमेंट्स:</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    {item.requiredDocs.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}