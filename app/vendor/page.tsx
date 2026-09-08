"use client";

import { useState } from "react";
import Image from "next/image";

interface VendorService {
  id: string;
  title: string;
  customerRate: number;
  adminCommission: number; // 10% Auto Cut
  vendorEarnings: number; // 90% Vendor Cut
  requiredDocs: string;
}

interface Order {
  id: string;
  customerName: string;
  serviceTitle: string;
  status: "Pending" | "Accepted" | "Completed";
  customerDocs: string[];
  receiptUploaded: boolean;
}

export default function VendorDashboard() {
  const [vendorPass, setVendorPass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vendor Services List
  const [services, setServices] = useState<VendorService[]>([
    {
      id: "1",
      title: "जाति एवं निवास प्रमाण पत्र",
      customerRate: 150,
      adminCommission: 15, // 10%
      vendorEarnings: 135, // 90%
      requiredDocs: "आधार कार्ड, स्वप्रमाणित घोषणा पत्र, फोटो",
    },
  ]);

  // Form Inputs
  const [title, setTitle] = useState("");
  const [rate, setRate] = useState<number | "">("");
  const [docs, setDocs] = useState("");

  // Customer Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-9921",
      customerName: "Ramesh Kumar",
      serviceTitle: "जाति एवं निवास प्रमाण पत्र",
      status: "Pending",
      customerDocs: ["Aadhaar_Front.jpg", "Photo_Passport.jpg"],
      receiptUploaded: false,
    },
  ]);

  const handleVendorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorPass === "1234") { // Temporary Vendor Passcode
      setIsLoggedIn(true);
    } else {
      alert("गलत वेंडर पिन!");
    }
  };

  // Add Service with Auto 10% Admin Cut
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rate) return alert("कृपया सर्विस का नाम और रेट भरें!");

    const numericRate = Number(rate);
    const adminCut = Math.round(numericRate * 0.10); // Auto 10% Commission
    const vendorCut = numericRate - adminCut;

    const newService: VendorService = {
      id: Date.now().toString(),
      title,
      customerRate: numericRate,
      adminCommission: adminCut,
      vendorEarnings: vendorCut,
      requiredDocs: docs || "आधार कार्ड एवं संबंधित फोटो",
    };

    setServices([...services, newService]);
    setTitle("");
    setRate("");
    setDocs("");
    alert("नई जॉब/सर्विस सफलतापूर्वक पोस्ट हो गई!");
  };

  // Accept Order to Unlock Documents
  const handleAcceptOrder = (orderId: string) => {
    setOrders(
      orders.map((ord) =>
        ord.id === orderId ? { ...ord, status: "Accepted" } : ord
      )
    );
    alert("ऑर्डर स्वीकार कर लिया गया है। अब आप ग्राहक के दस्तावेज देख सकते हैं।");
  };

  // Upload Receipt & Wipe Customer Data Completely
  const handleCompleteAndWipe = (orderId: string) => {
    if (confirm("रसीद अपलोड करके ऑर्डर पूरा करें? पूरा होने के बाद ग्राहक का डेटा आपके पैनल से डिलीट हो जाएगा।")) {
      // Data Wipeout Logic
      setOrders(orders.filter((ord) => ord.id !== orderId));
      alert("ऑर्डर सफलतापूर्वक पूरा हुआ एवं रसीद ग्राहक को भेज दी गई। ग्राहक का गोपनीयता डेटा आपके डैशबोर्ड से सुरक्षित रूप से हटा दिया गया है।");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleVendorLogin} className="bg-white p-8 rounded-3xl max-w-sm w-full space-y-4 text-center shadow-2xl">
          <div className="text-4xl">🛠️</div>
          <h2 className="text-xl font-black text-slate-900">FormSaathi Vendor Portal</h2>
          <p className="text-xs text-slate-500">वेंडर लॉगिन पिन दर्ज करें</p>
          <input
            type="password"
            value={vendorPass}
            onChange={(e) => setVendorPass(e.target.value)}
            placeholder="Enter Vendor PIN (1234)"
            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-center font-bold text-lg outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-sm">
            वेंडर डैशबोर्ड खोलें 🔓
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 relative">
      {/* Watermark Background */}
      <div className="fixed inset-0 opacity-15 pointer-events-none flex items-center justify-center -z-10">
        <Image src="/watermark.png" alt="Watermark" width={650} height={650} priority className="object-contain" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md flex justify-between items-center">
          <div>
            <span className="px-2.5 py-0.5 bg-blue-800 text-blue-100 font-bold text-[10px] rounded-md">
              VERIFIED PARTNER
            </span>
            <h1 className="text-2xl font-black mt-1">वेंडर डैशबोर्ड (Service Partner)</h1>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-xs font-bold rounded-xl transition"
          >
            🔒 लॉगआउट
          </button>
        </div>

        {/* Add Job/Service Form */}
        <form onSubmit={handleAddService} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">➕ नई फॉर्म सर्विस / जॉब पोस्ट करें</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">सर्विस का नाम</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. आय प्रमाण पत्र"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">कस्टमर रेट (₹)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value ? Number(e.target.value) : "")}
                placeholder="उदा. 200"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">आवश्यक डॉक्यूमेंट्स</label>
            <input
              type="text"
              value={docs}
              onChange={(e) => setDocs(e.target.value)}
              placeholder="उदा. आधार कार्ड, फोटो, राशन कार्ड"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Revenue Breakup Preview (Vendor Private Only) */}
          {rate && Number(rate) > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex justify-between text-xs font-bold text-amber-900">
              <span>एडमिन कमीशन (10% फिक्स): ₹{Math.round(Number(rate) * 0.10)}</span>
              <span className="text-emerald-700">आपकी शुद्ध कमाई (90%): ₹{Number(rate) - Math.round(Number(rate) * 0.10)}</span>
            </div>
          )}

          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
            सर्विस लाइव करें 🚀
          </button>
        </form>

        {/* Orders List & Privacy Data Wipeout Logic */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">ग्राहक ऑर्डर एवं डॉक्यूमेंट प्रोसेसिंग</h2>

          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              वर्तमान में कोई एक्टिव ऑर्डर नहीं है।
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {ord.id}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{ord.customerName}</h3>
                      <p className="text-xs text-blue-600 font-semibold">{ord.serviceTitle}</p>
                    </div>

                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      ord.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {ord.status === "Pending" ? "⏳ नया ऑर्डर (Pending)" : "🔄 इन-प्रोग्रेस (Accepted)"}
                    </span>
                  </div>

                  {/* Document Access Control */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">ग्राहक दस्तावेज़:</p>

                    {ord.status === "Pending" ? (
                      <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium flex items-center justify-between">
                        <span>🔒 दस्तावेज़ लॉक हैं। ग्राहक का डेटा देखने के लिए पहले ऑर्डर रिसीव करें।</span>
                        <button
                          onClick={() => handleAcceptOrder(ord.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                        >
                          ऑर्डर रिसीव करें ✅
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          {ord.customerDocs.map((doc, i) => (
                            <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 font-mono text-xs rounded-lg border border-blue-200 flex items-center gap-1">
                              📄 {doc}
                            </span>
                          ))}
                        </div>

                        {/* Receipt Upload & Data Wipeout Button */}
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                          <input
                            type="file"
                            className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-slate-100"
                          />
                          <button
                            onClick={() => handleCompleteAndWipe(ord.id)}
                            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap"
                          >
                            रसीद अपलोड करें एवं डेटा मिटाएं 🧹
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}