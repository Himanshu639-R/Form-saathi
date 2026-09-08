"use client";

import { useState } from "react";
import Image from "next/image";

interface VendorService {
  id: string;
  title: string;
  customerRate: number;
  adminCommission: number;
  vendorEarnings: number;
  requiredDocs: string;
}

interface Order {
  id: string;
  customerName: string;
  serviceTitle: string;
  amount: number;
  utrNumber: string;
  paymentStatus: "Pending_Verification" | "Verified";
  orderStatus: "Pending" | "Accepted" | "Completed";
  customerDocs: string[];
}

export default function VendorDashboard() {
  const [vendorPass, setVendorPass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vendor KYC Profile
  const vendorProfile = {
    name: "Ramesh Sharma",
    shopName: "Sharma Online Jan Seva",
    mobile: "9876543210",
    aadharLast4: "5678",
    upiId: "9876543210@paytm",
  };

  // Services Postings
  const [services, setServices] = useState<VendorService[]>([
    {
      id: "1",
      title: "जाति एवं निवास प्रमाण पत्र",
      customerRate: 150,
      adminCommission: 15,
      vendorEarnings: 135,
      requiredDocs: "आधार कार्ड, स्वप्रमाणित घोषणा पत्र, फोटो",
    },
  ]);

  const [title, setTitle] = useState("");
  const [rate, setRate] = useState<number | "">("");
  const [docs, setDocs] = useState("");

  // Customer Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-9921",
      customerName: "Ramesh Kumar",
      serviceTitle: "जाति एवं निवास प्रमाण पत्र",
      amount: 150,
      utrNumber: "UPI-409182739182",
      paymentStatus: "Pending_Verification",
      orderStatus: "Pending",
      customerDocs: ["Aadhaar_Front.jpg", "Photo_Passport.jpg"],
    },
  ]);

  const handleVendorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorPass === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("गलत वेंडर पिन!");
    }
  };

  // Add Service with Auto 10% Cut
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rate) return alert("कृपया नाम और रेट भरें!");

    const numericRate = Number(rate);
    const adminCut = Math.round(numericRate * 0.10);
    const vendorCut = numericRate - adminCut;

    const newService: VendorService = {
      id: Date.now().toString(),
      title,
      customerRate: numericRate,
      adminCommission: adminCut,
      vendorEarnings: vendorCut,
      requiredDocs: docs || "आधार कार्ड एवं फोटो",
    };

    setServices([...services, newService]);
    setTitle("");
    setRate("");
    setDocs("");
    alert("नई सर्विस सफलतापूर्वक पोस्ट हो गई!");
  };

  // Verify Manual Payment
  const handleVerifyPayment = (orderId: string) => {
    setOrders(
      orders.map((ord) =>
        ord.id === orderId
          ? { ...ord, paymentStatus: "Verified", orderStatus: "Accepted" }
          : ord
      )
    );
    alert("पेमेंट वेरिफाई हो गई! अब आप ग्राहक के दस्तावेज देख सकते हैं।");
  };

  // Complete Order & Wipeout Privacy Data
  const handleCompleteAndWipe = (orderId: string) => {
    if (confirm("रसीद अपलोड करके ऑर्डर पूरा करें? पूरा होने के बाद ग्राहक का डेटा डिलीट हो जाएगा।")) {
      setOrders(orders.filter((ord) => ord.id !== orderId));
      alert("ऑर्डर पूरा हुआ! ग्राहक का डेटा आपके डैशबोर्ड से डिलीट कर दिया गया।");
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
            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-center font-bold text-lg outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
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
            <h1 className="text-2xl font-black mt-1">{vendorProfile.shopName}</h1>
            <p className="text-xs text-blue-200">Owner: {vendorProfile.name} | UPI: {vendorProfile.upiId}</p>
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
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">कस्टमर रेट (₹)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value ? Number(e.target.value) : "")}
                placeholder="उदा. 200"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-900"
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
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-900"
            />
          </div>

          {/* Revenue Breakup Preview */}
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

        {/* Customer Orders & Document Privacy */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">ग्राहक ऑर्डर एवं मैनुअल पेमेंट सत्यापन</h2>

          {orders.map((ord) => (
            <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-2 border-slate-100">
                <div>
                  <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">{ord.id}</span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{ord.customerName} - {ord.serviceTitle}</h3>
                  <p className="text-xs text-emerald-700 font-bold">पेमेंट राशि: ₹{ord.amount}</p>
                  <p className="text-xs font-mono text-slate-500">Transaction/UTR ID: {ord.utrNumber}</p>
                </div>

                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  ord.paymentStatus === "Verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {ord.paymentStatus === "Verified" ? "✅ पेमेंट प्राप्त हुआ" : "⏳ पेमेंट सत्यापन बाकी"}
                </span>
              </div>

              {/* Step 1: Lock Docs until Payment Verified */}
              {ord.paymentStatus === "Pending_Verification" ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <span className="text-amber-900 font-medium">
                    🔒 दस्तावेज़ लॉक हैं। अपने Paytm/PhonePe पर UTR ({ord.utrNumber}) चेक करके पेमेंट कन्फर्म करें।
                  </span>
                  <button
                    onClick={() => handleVerifyPayment(ord.id)}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl whitespace-nowrap"
                  >
                    पेमेंट मिल गई (Confirm Payment) ✅
                  </button>
                </div>
              ) : (
                /* Step 2: Show Documents & Upload Receipt */
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-700">कस्टमर दस्तावेज़:</p>
                  <div className="flex gap-2">
                    {ord.customerDocs.map((doc, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 font-mono text-xs rounded-lg border border-blue-200 flex items-center gap-1">
                        📄 {doc}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                    <input type="file" className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-slate-100" />
                    <button
                      onClick={() => handleCompleteAndWipe(ord.id)}
                      className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
                    >
                      रसीद भेजें एवं डेटा मिटाएं 🧹
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}