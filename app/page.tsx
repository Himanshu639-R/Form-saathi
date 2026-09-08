"use client";

import { useState, useEffect } from "react";

// --- TYPES & INTERFACES ---
interface Order {
  id: string;
  customerName: string;
  customerMobile: string;
  serviceTitle: string;
  totalAmount: number;
  adminCommission: number;
  vendorPayout: number;
  status:
    | "PENDING_ACCEPT"
    | "IN_PROGRESS"
    | "VENDOR_UPLOADED"
    | "CORRECTION_REQUESTED"
    | "COMPLETED_RELEASED"
    | "REFUNDED_24H";
  createdAt: number;
  uploadedAt?: number;
  correctionNote?: string;
  docsUploaded: string[];
  finalDocUrl?: string;
}

export default function CompleteFormSaathiProductionApp() {
  // --- AUTH & ROLE STATES ---
  const [authRole, setAuthRole] = useState<"CUSTOMER" | "VENDOR" | "ADMIN" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileInput, setMobileInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // --- BOTTOM NAV STATES (For Customer/Vendor inside dashboard) ---
  const [activeTab, setActiveTab] = useState<"HOME" | "SERVICES" | "FILES" | "PROFILE">("HOME");

  // --- ADMIN AUTH STATE ---
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // --- MERCHANT & SERVICE STATES ---
  const [merchantUpiId] = useState("yourbusiness@paytm");
  const [selectedService, setSelectedService] = useState("जाति एवं निवास प्रमाण पत्र");
  const [servicePrice, setServicePrice] = useState(150);
  const [customCommission] = useState(15);
  const [correctionInput, setCorrectionInput] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI_APP" | "QR_CODE">("UPI_APP");

  // --- DATABASE / ORDERS STATE ---
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-9901",
      customerName: "Rohan Verma",
      customerMobile: "9876543210",
      serviceTitle: "जाति प्रमाण पत्र",
      totalAmount: 150,
      adminCommission: 15,
      vendorPayout: 135,
      status: "VENDOR_UPLOADED",
      createdAt: Date.now() - 10 * 60 * 60 * 1000,
      uploadedAt: Date.now() - 13 * 60 * 60 * 1000,
      docsUploaded: ["Aadhaar_Doc.pdf"],
      finalDocUrl: "Receipt_Draft.pdf",
    },
  ]);

  // ⚡ AUTOMATION ENGINE (24H Refund + 12H Review Auto-Release)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setOrders((prevOrders) =>
        prevOrders.map((ord) => {
          const hoursSinceCreated = (now - ord.createdAt) / (1000 * 60 * 60);
          if (ord.status === "PENDING_ACCEPT" && hoursSinceCreated >= 24) {
            return { ...ord, status: "REFUNDED_24H" };
          }
          if (ord.status === "VENDOR_UPLOADED" && ord.uploadedAt) {
            const hoursSinceUpload = (now - ord.uploadedAt) / (1000 * 60 * 60);
            if (hoursSinceUpload >= 12) {
              return { ...ord, status: "COMPLETED_RELEASED" };
            }
          }
          return ord;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const upiIntentUrl = `upi://pay?pa=${merchantUpiId}&pn=FormSaathi&am=${servicePrice}&cu=INR`;

  // --- HANDLERS ---
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileInput.length < 10) return alert("कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें!");
    setOtpSent(true);
    alert("डैमोट हाइब्रिड OTP: 1234 दर्ज करें");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("गलत OTP! (डिमोट OTP: 1234 है)");
    }
  };

  const handleCustomerPaymentSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: authRole === "CUSTOMER" ? `User (${mobileInput})` : "Customer",
      customerMobile: mobileInput || "9876543210",
      serviceTitle: selectedService,
      totalAmount: servicePrice,
      adminCommission: customCommission,
      vendorPayout: servicePrice - customCommission,
      status: "PENDING_ACCEPT",
      createdAt: Date.now(),
      docsUploaded: ["Uploaded_Form_Doc.pdf"],
    };
    setOrders([newOrd, ...orders]);
    setPaymentDone(true);
    alert("पेमेंट और ऑर्डर सफलतापूर्वक दर्ज हो गया!");
  };

  const handleVendorAccept = (id: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "IN_PROGRESS" } : o)));
    alert("ऑर्डर स्वीकार कर लिया गया!");
  };

  const handleVendorUpload = (id: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "VENDOR_UPLOADED", uploadedAt: Date.now(), finalDocUrl: "Receipt_Final.pdf" } : o)));
    alert("रसीद अपलोड हो गई! ग्राहक के पास 12 घंटे का रिव्यू टाइमर शुरू हो गया है।");
  };

  const handleCustomerRequestEdit = (id: string) => {
    if (!correctionInput) return alert("कृपया सुधार (Edit) के बारे में विवरण लिखें!");
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "CORRECTION_REQUESTED", correctionNote: correctionInput } : o)));
    setCorrectionInput("");
    alert("सुधार की रिक्वेस्ट वेंडर को भेज दी गई है।");
  };

  const handleCustomerRelease = (id: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "COMPLETED_RELEASED" } : o)));
    alert("धन्यवाद! पेमेंट सफलतापूर्वक वेंडर को ट्रांसफर हो गई।");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "987654") {
      setIsAdminAuthenticated(true);
    } else {
      alert("गलत एडमिन पिन!");
    }
  };

  // ================= 1. ROLE SELECTION SCREEN (जब तक रोल न चुना जाए) =================
  if (!authRole) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-3xl">
            🛡️
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-amber-400 tracking-wider">FORM SAATHI</h1>
            <p className="text-xs text-slate-400">Secure Escrow & Service Portal</p>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-400 text-left">अपनी भूमिका (Role) चुनें:</p>
            <button
              onClick={() => setAuthRole("CUSTOMER")}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
            >
              👤 मैं ग्राहक हूँ (Customer Login/Signup)
            </button>
            <button
              onClick={() => setAuthRole("VENDOR")}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
            >
              🏪 मैं वेंडर हूँ (Vendor Partner Login)
            </button>
            <button
              onClick={() => setAuthRole("ADMIN")}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
            >
              👑 मास्टर एडमिन (Master Admin)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. LOGIN / SIGNUP SCREEN (अगर लॉग इन नहीं है) =================
  if (!isLoggedIn && authRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex justify-between items-center">
            <h1 className="text-sm font-black text-amber-400 uppercase">
              {authRole === "CUSTOMER" ? "Customer" : "Vendor"} Portal Auth
            </h1>
            <button onClick={() => setAuthRole(null)} className="text-[10px] text-slate-400 underline">
              ← पीछे जाएं
            </button>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">मोबाइल नंबर दर्ज करें (Login / Signup)</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow">
                OTP भेजें 📩
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">OTP दर्ज करें ({mobileInput} पर भेजा गया)</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none tracking-widest text-center font-bold text-lg"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow">
                वेरीफाई और लॉगिन करें 🔓
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ================= 3. MAIN DASHBOARD WITH BOTTOM NAVIGATION =================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex justify-center">
      <div className="w-full max-w-md bg-slate-950 min-h-screen flex flex-col shadow-2xl relative pb-24">
        
        {/* Top Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
          <div>
            <h1 className="text-sm font-black text-amber-400 tracking-wide">FORM SAATHI ({authRole})</h1>
            <p className="text-[10px] text-slate-400">Secure Escrow Engine</p>
          </div>
          <button
            onClick={() => { setIsLoggedIn(false); setAuthRole(null); }}
            className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-1 rounded-lg font-bold"
          >
            लॉग आउट 🚪
          </button>
        </div>

        {/* Content Area Based on Bottom Nav or Admin Role */}
        <div className="p-4 flex-1 space-y-4 overflow-y-auto">

          {/* ================= ADMIN VIEW ================= */}
          {authRole === "ADMIN" && (
            <div className="space-y-4">
              {!isAdminAuthenticated ? (
                <form onSubmit={handleAdminLogin} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-bold text-purple-400 uppercase">Master Admin Login</h2>
                    <button type="button" onClick={() => setAuthRole(null)} className="text-[10px] text-slate-400 underline">← पीछे</button>
                  </div>
                  <input
                    type="password"
                    placeholder="एडमिन पिन (987654)"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                  />
                  <button type="submit" className="w-full py-3 bg-purple-600 font-bold text-xs rounded-xl text-white">
                    लॉगिन करें 🔓
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl">
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Total Admin Commission</p>
                    <p className="text-lg font-black text-purple-400">
                      ₹{orders.reduce((sum, o) => sum + o.adminCommission, 0)}
                    </p>
                  </div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase">Live Database Orders</h2>
                  {orders.map((o) => (
                    <div key={o.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>{o.customerName}</span>
                        <span className="text-emerald-400">+₹{o.adminCommission}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Status: {o.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= CUSTOMER TABS ================= */}
          {authRole === "CUSTOMER" && (
            <>
              {/* TAB 1: HOME */}
              {activeTab === "HOME" && (
                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-3xl space-y-2">
                    <h2 className="text-sm font-black text-amber-400">नमस्ते, स्वागत है! 👋</h2>
                    <p className="text-xs text-slate-300">अपने सभी सरकारी फॉर्म और दस्तावेज यहाँ सुरक्षित रूप से बनवाएं। 24 घंटे की मनी-बैक गारंटी और 12 घंटे की एडिट विंडो के साथ।</p>
                    <button
                      onClick={() => setActiveTab("SERVICES")}
                      className="mt-2 px-4 py-2 bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow"
                    >
                      नया फॉर्म अप्लाई करें ⚡
                    </button>
                  </div>

                  <h2 className="text-xs font-bold text-slate-400 uppercase">हाल के ऑर्डर्स</h2>
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-white">{ord.serviceTitle}</h3>
                          <p className="text-[10px] text-slate-400">बिल: ₹{ord.totalAmount}</p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">{ord.status}</span>
                      </div>

                      {ord.status === "VENDOR_UPLOADED" && (
                        <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-blue-500/30">
                          <p className="text-[11px] text-blue-300 font-bold">📄 वेंडर ने रसीद अपलोड कर दी है!</p>
                          <button onClick={() => handleCustomerRelease(ord.id)} className="w-full py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl">
                            सब सही है - Confirm & Release 👍
                          </button>
                          <div className="pt-2 border-t border-slate-800 space-y-2">
                            <input
                              type="text"
                              placeholder="सुधार (Edit) चाहिए तो लिखें..."
                              value={correctionInput}
                              onChange={(e) => setCorrectionInput(e.target.value)}
                              className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
                            />
                            <button onClick={() => handleCustomerRequestEdit(ord.id)} className="w-full py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs rounded-lg">
                              सुधार/एडिट के लिए भेजें ✏️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: SERVICES & APPLY (यहाँ पेमेंट और सर्विस सिलेक्शन है) */}
              {activeTab === "SERVICES" && (
                <div className="space-y-4">
                  {!paymentDone ? (
                    <form onSubmit={handleCustomerPaymentSubmission} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
                      <h2 className="text-xs font-bold text-slate-300 uppercase">सर्विस चुनें और पेमेंट करें</h2>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">सर्विस का चयन</label>
                        <select
                          value={selectedService}
                          onChange={(e) => {
                            setSelectedService(e.target.value);
                            setServicePrice(e.target.value.includes("पासपोर्ट") ? 1000 : 150);
                          }}
                          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none"
                        >
                          <option value="जाति एवं निवास प्रमाण पत्र">जाति एवं निवास प्रमाण पत्र (₹150)</option>
                          <option value="आय प्रमाण पत्र">आय प्रमाण पत्र (₹150)</option>
                          <option value="पासपोर्ट आवेदन">पासपोर्ट आवेदन (₹1000)</option>
                        </select>
                      </div>

                      {/* Payment Options */}
                      <div className="space-y-2 pt-2">
                        <p className="text-[11px] font-bold text-slate-400">पेमेंट माध्यम:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("UPI_APP")}
                            className={`p-2.5 rounded-xl text-xs font-bold border ${paymentMethod === "UPI_APP" ? "bg-amber-400/20 border-amber-400 text-amber-400" : "bg-slate-950 border-slate-800 text-slate-400"}`}
                          >
                            📱 UPI App
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("QR_CODE")}
                            className={`p-2.5 rounded-xl text-xs font-bold border ${paymentMethod === "QR_CODE" ? "bg-amber-400/20 border-amber-400 text-amber-400" : "bg-slate-950 border-slate-800 text-slate-400"}`}
                          >
                            🖲️ QR Code
                          </button>
                        </div>
                      </div>

                      {paymentMethod === "UPI_APP" ? (
                        <div className="p-4 bg-slate-950 border border-amber-400/30 rounded-2xl text-center space-y-3">
                          <a
                            href={upiIntentUrl}
                            className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow text-center"
                          >
                            Pay ₹{servicePrice} via UPI App ⚡
                          </a>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-950 border border-amber-400/30 rounded-2xl text-center space-y-2">
                          <p className="text-xs font-bold text-amber-400">स्कैन करके भुगतान करें</p>
                          <div className="w-28 h-28 bg-white mx-auto rounded-xl flex items-center justify-center text-slate-950 font-black text-[10px] p-2 text-center">
                            [ QR: {merchantUpiId} ]
                          </div>
                          <p className="text-[10px] text-slate-400">राशि: ₹{servicePrice}</p>
                        </div>
                      )}

                      <button type="submit" className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow transition">
                        पेमेंट पूर्ण होने पर ऑर्डर सबमिट करें ✅
                      </button>
                    </form>
                  ) : (
                    <div className="p-5 bg-emerald-950/40 border border-emerald-500/30 rounded-3xl text-center space-y-3">
                      <div className="text-4xl">🎉</div>
                      <h2 className="text-sm font-bold text-emerald-400">ऑर्डर सफलतापूर्वक दर्ज हो गया!</h2>
                      <button onClick={() => setPaymentDone(false)} className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl text-slate-200">
                        दूसरा फॉर्म भरें
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FILES & UPLOADS (डॉक्यूमेंट फाइल अपलोड आप्शन) */}
              {activeTab === "FILES" && (
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase">डॉक्यूमेंट फाइल और अपलोड्स</h2>
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 text-center">
                    <div className="text-3xl">📁</div>
                    <p className="text-xs font-bold text-white">अपने जरूरी कागजात अपलोड करें</p>
                    <p className="text-[10px] text-slate-400">आधार कार्ड, पैन कार्ड या अन्य दस्तावेज (PDF/JPG)</p>
                    <label className="block w-full py-3 bg-amber-400/20 border border-amber-400/40 text-amber-400 font-bold text-xs rounded-xl cursor-pointer">
                      + फाइल चुनें और अपलोड करें
                      <input type="file" className="hidden" onChange={() => alert("फाइल सफलतापूर्वक अपलोड हो गई!")} />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE */}
              {activeTab === "PROFILE" && (
                <div className="space-y-4">
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 text-center">
                    <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto text-xl font-black text-amber-400">
                      👤
                    </div>
                    <h2 className="text-sm font-bold text-white">कस्टमर प्रोफाइल</h2>
                    <p className="text-xs text-slate-400">मोबाइल: {mobileInput || "9876543210"}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= VENDOR TABS ================= */}
          {authRole === "VENDOR" && (
            <>
              {activeTab === "HOME" && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold">RELEASED PAYOUT</p>
                      <p className="text-xl font-black text-emerald-400">
                        ₹{orders.filter((o) => o.status === "COMPLETED_RELEASED").reduce((sum, o) => sum + o.vendorPayout, 0)}
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg font-bold">रेडी</span>
                  </div>

                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xs font-bold text-white">{ord.serviceTitle} ({ord.customerName})</h3>
                          <p className="text-[10px] text-slate-400">पेआउट: <span className="text-emerald-400 font-bold">₹{ord.vendorPayout}</span></p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">{ord.status}</span>
                      </div>

                      {ord.status === "PENDING_ACCEPT" && (
                        <button onClick={() => handleVendorAccept(ord.id)} className="w-full py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl">
                          ऑर्डर स्वीकार (Accept) करें ✅
                        </button>
                      )}

                      {(ord.status === "IN_PROGRESS" || ord.status === "CORRECTION_REQUESTED") && (
                        <div className="space-y-2">
                          {ord.correctionNote && (
                            <p className="text-[10px] text-red-400 bg-red-950/20 p-2 rounded-lg border border-red-500/20">
                              ⚠️ सुधार माँगा गया: "{ord.correctionNote}"
                            </p>
                          )}
                          <button onClick={() => handleVendorUpload(ord.id)} className="w-full py-2 bg-blue-600 font-bold text-xs rounded-xl text-white">
                            रसीद/दस्तावेज़ अपलोड करें 📤
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "FILES" && (
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase">वेंडर फाइल मैनेजमेंट</h2>
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
                    <p className="text-xs text-slate-300">यहाँ आप ग्राहक के सभी सबमिट किए गए डॉक्यूमेंट देख सकते हैं।</p>
                  </div>
                </div>
              )}

              {activeTab === "PROFILE" && (
                <div className="space-y-4">
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-2">
                    <h2 className="text-sm font-bold text-white">वेंडर पार्टनर प्रोफाइल</h2>
                    <p className="text-xs text-slate-400">मोबाइल: {mobileInput || "9876543210"}</p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* ================= BOTTOM NAVIGATION BAR (Instagram/Native Style) ================= */}
        {authRole !== "ADMIN" && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex justify-around items-center px-2 z-50">
            <button
              onClick={() => setActiveTab("HOME")}
              className={`flex flex-col items-center gap-1 ${activeTab === "HOME" ? "text-amber-400" : "text-slate-400"}`}
            >
              <span className="text-lg">🏠</span>
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button
              onClick={() => setActiveTab("SERVICES")}
              className={`flex flex-col items-center gap-1 ${activeTab === "SERVICES" ? "text-amber-400" : "text-slate-400"}`}
            >
              <span className="text-lg">⚡</span>
              <span className="text-[10px] font-bold">Services</span>
            </button>
            <button
              onClick={() => setActiveTab("FILES")}
              className={`flex flex-col items-center gap-1 ${activeTab === "FILES" ? "text-amber-400" : "text-slate-400"}`}
            >
              <span className="text-lg">📁</span>
              <span className="text-[10px] font-bold">Files</span>
            </button>
            <button
              onClick={() => setActiveTab("PROFILE")}
              className={`flex flex-col items-center gap-1 ${activeTab === "PROFILE" ? "text-amber-400" : "text-slate-400"}`}
            >
              <span className="text-lg">👤</span>
              <span className="text-[10px] font-bold">Profile</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}