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
  acceptedAt?: number;
  uploadedAt?: number;
  correctionNote?: string;
  docsUploaded: string[];
  finalDocUrl?: string;
}

export default function CompleteFormSaathiApp() {
  // App Navigation States (बिल्कुल शुरुआत से चलने के लिए)
  const [appStarted, setAppStarted] = useState(false);
  const [currentRole, setCurrentRole] = useState<"CUSTOMER" | "VENDOR" | "ADMIN">("CUSTOMER");
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Storage Stats (0 Cost Monitoring)
  const customerStorageUsedMB = 12;
  const customerStorageLimitMB = 50;
  const vendorStorageUsedMB = 120;
  const vendorStorageLimitMB = 500;

  // Form Input States
  const [selectedService, setSelectedService] = useState("जाति एवं निवास प्रमाण पत्र");
  const [servicePrice] = useState(150);
  const [customCommission] = useState(15); // 10% Default
  const [custName, setCustName] = useState("");
  const [custMobile, setCustMobile] = useState("");
  const [correctionInput, setCorrectionInput] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);

  // Initial Sample Orders
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
      uploadedAt: Date.now() - 13 * 60 * 60 * 1000, // 13 Hours passed
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
          // Rule 1: 24h No Acceptance -> Refund
          const hoursSinceCreated = (now - ord.createdAt) / (1000 * 60 * 60);
          if (ord.status === "PENDING_ACCEPT" && hoursSinceCreated >= 24) {
            return { ...ord, status: "REFUNDED_24H" };
          }

          // Rule 2: 12h Customer Silence after Vendor Upload -> Auto Release
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

  // Handlers
  const handleCustomerPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custMobile) return alert("कृपया अपना नाम और मोबाइल नंबर भरें!");

    const newOrd: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: custName,
      customerMobile: custMobile,
      serviceTitle: selectedService,
      totalAmount: servicePrice,
      adminCommission: customCommission,
      vendorPayout: servicePrice - customCommission,
      status: "PENDING_ACCEPT",
      createdAt: Date.now(),
      docsUploaded: ["Uploaded_Doc.pdf"],
    };

    setOrders([newOrd, ...orders]);
    setPaymentDone(true);
  };

  const handleVendorAccept = (id: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "IN_PROGRESS", acceptedAt: Date.now() } : o)));
    alert("ऑर्डर स्वीकार कर लिया गया है! अब फॉर्म भरकर रसीद अपलोड करें।");
  };

  const handleVendorUpload = (id: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "VENDOR_UPLOADED", uploadedAt: Date.now(), finalDocUrl: "Receipt_Final.pdf" } : o)));
    alert("रसीद अपलोड हो गई! ग्राहक के पास रिव्यू/एडिट के लिए 12 घंटे का समय है।");
  };

  const handleCustomerRequestEdit = (id: string) => {
    if (!correctionInput) return alert("कृपया बताएं कि क्या सुधार करना है!");
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "CORRECTION_REQUESTED", correctionNote: correctionInput } : o)));
    setCorrectionInput("");
    alert("सुधार की जानकारी वेंडर को भेज दी गई है।");
  };

  const handleCustomerRelease = (id: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "COMPLETED_RELEASED" } : o)));
    alert("धन्यवाद! पेमेंट वेंडर को सुरक्षित ट्रांसफर कर दी गई है।");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "987654") {
      setIsAdminAuthenticated(true);
    } else {
      alert("गलत पिन! सही एडमिन पिन दर्ज करें (Demo: 987654)");
    }
  };

  // ================= 1. SPLASH / WELCOME SCREEN (शुरुआत) =================
  if (!appStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-3xl">
            🤝
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-amber-400 tracking-wider">FORM SAATHI</h1>
            <p className="text-xs text-slate-400">आपका डिजिटल फॉर्म और ऑनलाइन सहायता केंद्र</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
            <p className="font-bold text-amber-400">⚡ 100% सुरक्षित सर्विस सिस्टम:</p>
            <p className="text-slate-300">• QR Escrow Hold Protection</p>
            <p className="text-slate-300">• 24 घंटे में काम न होने पर ऑटो-रिफंड</p>
            <p className="text-slate-300">• 12 घंटे की समीक्षा व एडिट सुविधा</p>
          </div>

          <button
            onClick={() => setAppStarted(true)}
            className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition"
          >
            ऐप शुरू करें (Start App) 🚀
          </button>
        </div>
      </div>
    );
  }

  // ================= 2. MAIN APP PORTAL =================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex justify-center">
      <div className="w-full max-w-md bg-slate-950 min-h-screen flex flex-col shadow-2xl relative pb-20">
        
        {/* App Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
          <div>
            <h1 className="text-lg font-black text-amber-400 tracking-wide">FORM SAATHI</h1>
            <p className="text-[10px] text-slate-400">Escrow & Review Protection Engine</p>
          </div>
          <button onClick={() => setAppStarted(false)} className="text-[10px] text-slate-500 underline">
            Exit
          </button>
        </div>

        {/* Role Switcher Tabs */}
        <div className="p-2 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex justify-around text-xs font-bold">
          <button
            onClick={() => { setCurrentRole("CUSTOMER"); setPaymentDone(false); }}
            className={`px-3 py-1.5 rounded-xl transition ${currentRole === "CUSTOMER" ? "bg-amber-400 text-slate-950" : "text-slate-400"}`}
          >
            👤 Customer
          </button>
          <button
            onClick={() => setCurrentRole("VENDOR")}
            className={`px-3 py-1.5 rounded-xl transition ${currentRole === "VENDOR" ? "bg-blue-500 text-white" : "text-slate-400"}`}
          >
            🏪 Vendor
          </button>
          <button
            onClick={() => setCurrentRole("ADMIN")}
            className={`px-3 py-1.5 rounded-xl transition ${currentRole === "ADMIN" ? "bg-purple-600 text-white" : "text-slate-400"}`}
          >
            👑 Admin
          </button>
        </div>

        {/* App Body Content */}
        <div className="p-4 flex-1 space-y-4">

          {/* ================= A. CUSTOMER VIEW ================= */}
          {currentRole === "CUSTOMER" && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center text-xs">
                <span className="text-slate-400">क्लाउड स्टोरेज क्षमता</span>
                <span className="font-bold text-amber-400">{customerStorageUsedMB} MB / {customerStorageLimitMB} MB</span>
              </div>

              {!paymentDone ? (
                <form onSubmit={handleCustomerPayment} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
                  <h2 className="text-xs font-bold text-slate-300 uppercase">नया फॉर्म ऑर्डर करें</h2>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">सर्विस चुनें</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none"
                    >
                      <option value="जाति एवं निवास प्रमाण पत्र">जाति एवं निवास प्रमाण पत्र (₹150)</option>
                      <option value="पासपोर्ट आवेदन">पासपोर्ट आवेदन (₹1000)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">आपका नाम</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Kumar"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">मोबाइल नंबर</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={custMobile}
                      onChange={(e) => setCustMobile(e.target.value)}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                    />
                  </div>

                  <div className="p-4 bg-slate-950 border border-amber-400/30 rounded-2xl text-center space-y-2">
                    <p className="text-xs font-bold text-amber-400">QR Escrow Payment (100% Safe)</p>
                    <div className="w-28 h-28 bg-white mx-auto rounded-xl flex items-center justify-center text-slate-950 font-black text-xs">
                      [ QR CODE ]
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition">
                    पेमेंट पुष्टि करें (₹{servicePrice})
                  </button>
                </form>
              ) : (
                <div className="p-5 bg-emerald-950/40 border border-emerald-500/30 rounded-3xl text-center space-y-3">
                  <div className="text-4xl">✅</div>
                  <h2 className="text-sm font-bold text-emerald-400">पेमेंट सुरक्षित जमा हो गई!</h2>
                  <p className="text-xs text-slate-300">वेंडर के पास ऑर्डर चला गया है।</p>
                  <button onClick={() => setPaymentDone(false)} className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl text-slate-200">
                    नया फॉर्म भरें
                  </button>
                </div>
              )}

              {/* Customer Orders List */}
              <h2 className="text-xs font-bold text-slate-400 uppercase pt-2">आपके एक्टिव ऑर्डर्स</h2>
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
                        सब सही है - Confirm & Release Payment 👍
                      </button>

                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <input
                          type="text"
                          placeholder="गलती सुधारने के लिए लिखें..."
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

          {/* ================= B. VENDOR VIEW ================= */}
          {currentRole === "VENDOR" && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center text-xs">
                <span className="text-slate-400">वेंडर स्टोरेज कोटा</span>
                <span className="font-bold text-blue-400">{vendorStorageUsedMB} MB / {vendorStorageLimitMB} MB</span>
              </div>

              <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">RELEASED PAYOUT</p>
                  <p className="text-xl font-black text-emerald-400">
                    ₹{orders.filter((o) => o.status === "COMPLETED_RELEASED").reduce((sum, o) => sum + o.vendorPayout, 0)}
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg font-bold">रेडी टू ट्रांसफर</span>
              </div>

              {orders.map((ord) => (
                <div key={ord.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-white">{ord.serviceTitle}</h3>
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
                        रसीद अपलोड करें 📤
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ================= C. ADMIN VIEW ================= */}
          {currentRole === "ADMIN" && (
            <div className="space-y-4">
              {!isAdminAuthenticated ? (
                <form onSubmit={handleAdminLogin} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                  <h2 className="text-xs font-bold text-purple-400 uppercase">Master Admin Auth</h2>
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
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Master Admin Dashboard</p>
                    <p className="text-lg font-black text-purple-400">
                      कमीशन आय: ₹{orders.reduce((sum, o) => sum + o.adminCommission, 0)}
                    </p>
                  </div>

                  <h2 className="text-xs font-bold text-slate-400 uppercase">Escrow Control Panel</h2>
                  {orders.map((o) => (
                    <div key={o.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>{o.customerName}</span>
                        <span className="text-emerald-400">+₹{o.adminCommission} Cut</span>
                      </div>
                      <p className="text-[10px] text-slate-400">स्टेटस: {o.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}