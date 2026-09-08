"use client";

import { useState } from "react";
import Image from "next/image";

interface FormService {
  id: string;
  title: string;
  category: string;
  price: number;
  commissionType: "Percentage" | "Fixed";
  commissionValue: number;
  requiredDocs: string[];
}

interface VendorProfile {
  id: string;
  name: string;
  shopName: string;
  mobile: string;
  storageUsedMB: number;
  storageLimitMB: number;
  isBlocked: boolean;
  totalOrdersCompleted: number;
  totalBilling: number;
  adminCommissionEarned: number;
}

interface AdBanner {
  id: string;
  title: string;
  imageUrl: string;
  redirectUrl: string;
  isActive: boolean;
  monthlyFeeEarned: number;
}

interface LedgerEntry {
  id: string;
  timestamp: string;
  orderId: string;
  vendorName: string;
  serviceTitle: string;
  totalAmount: number;
  adminCommission: number;
  vendorPayout: number;
  status: "ESCROW_HOLD" | "RELEASED" | "REFUNDED";
}

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "PAYMENT" | "SYSTEM" | "STORAGE_WARN";
}

export default function CompleteAdminDashboard() {
  const defaultPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "987654";
  const [masterPin] = useState<string>(defaultPin);
  const [inputPin, setInputPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Storage Quota Rules
  const customerStorageLimitMB = 50;
  const vendorStorageLimitMB = 500;

  // Active Tab Manager
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "vendors" | "ledger" | "ads" | "notifications">("overview");

  // 1. Services with Custom Commission
  const [services, setServices] = useState<FormService[]>([
    {
      id: "SRV-1",
      title: "जाति एवं निवास प्रमाण पत्र",
      category: "Government",
      price: 150,
      commissionType: "Percentage",
      commissionValue: 10,
      requiredDocs: ["आधार कार्ड", "फोटो"],
    },
    {
      id: "SRV-2",
      title: "पासपोर्ट / ट्रेड लाइसेंस",
      category: "Premium",
      price: 1000,
      commissionType: "Fixed",
      commissionValue: 150,
      requiredDocs: ["आधार कार्ड", "पैन कार्ड", "बैंक पासबुक"],
    },
  ]);

  // Editing Commission Modal States
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editType, setEditType] = useState<"Percentage" | "Fixed">("Percentage");
  const [editValue, setEditValue] = useState<number>(10);

  // 2. Vendors List & Storage Usage
  const [vendors] = useState<VendorProfile[]>([
    {
      id: "VND-101",
      name: "Ramesh Sharma",
      shopName: "Sharma Online Jan Seva",
      mobile: "9876543210",
      storageUsedMB: 180,
      storageLimitMB: vendorStorageLimitMB,
      isBlocked: false,
      totalOrdersCompleted: 42,
      totalBilling: 8400,
      adminCommissionEarned: 840,
    },
    {
      id: "VND-102",
      name: "Amit Patel",
      shopName: "Patel Digital Center",
      mobile: "9123456789",
      storageUsedMB: 420,
      storageLimitMB: vendorStorageLimitMB,
      isBlocked: false,
      totalOrdersCompleted: 85,
      totalBilling: 17000,
      adminCommissionEarned: 1700,
    },
  ]);

  // 3. Ad Banners System
  const [banners, setBanners] = useState<AdBanner[]>([
    {
      id: "BAN-1",
      title: "Apex Coaching Center Promotion",
      imageUrl: "https://via.placeholder.com/600x200?text=Apex+Coaching+Banner",
      redirectUrl: "https://example.com",
      isActive: true,
      monthlyFeeEarned: 1000,
    },
  ]);
  const [newAdTitle, setNewAdTitle] = useState("");
  const [newAdImage, setNewAdImage] = useState("");
  const [newAdFee, setNewAdFee] = useState("");

  // 4. Ledger & Escrow Transactions
  const [ledger] = useState<LedgerEntry[]>([
    {
      id: "TXN-9001",
      timestamp: "2026-03-30 10:30 AM",
      orderId: "ORD-5541",
      vendorName: "Sharma Online Jan Seva",
      serviceTitle: "जाति एवं निवास प्रमाण पत्र",
      totalAmount: 150,
      adminCommission: 15,
      vendorPayout: 135,
      status: "ESCROW_HOLD",
    },
    {
      id: "TXN-9002",
      timestamp: "2026-03-30 11:15 AM",
      orderId: "ORD-5542",
      vendorName: "Patel Digital Center",
      serviceTitle: "पासपोर्ट / ट्रेड लाइसेंस",
      totalAmount: 1000,
      adminCommission: 150,
      vendorPayout: 850,
      status: "RELEASED",
    },
  ]);

  // 5. Notifications
  const [notifications] = useState<SystemNotification[]>([
    {
      id: "NOTIF-1",
      title: "QR Escrow Hold Alert",
      message: "₹150 Order ORD-5541 is held in QR Escrow.",
      time: "10 mins ago",
      type: "PAYMENT",
    },
    {
      id: "NOTIF-2",
      title: "Storage Warning",
      message: "Patel Digital Center reached 84% free storage limit.",
      time: "1 hour ago",
      type: "STORAGE_WARN",
    },
  ]);

  // Helper Functions
  const calculateCommissionAmount = (service: FormService) => {
    if (service.commissionType === "Percentage") {
      return Math.round((service.price * service.commissionValue) / 100);
    }
    return service.commissionValue;
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === masterPin) {
      setIsAuthorized(true);
    } else {
      alert("गलत मास्टर पिन!");
    }
  };

  const handleSaveCommission = (serviceId: string) => {
    setServices(
      services.map((s) =>
        s.id === serviceId
          ? { ...s, commissionType: editType, commissionValue: Number(editValue) }
          : s
      )
    );
    setEditingServiceId(null);
    alert("कमीशन सफलतापूर्वक अपडेट हो गया!");
  };

  const handleAddAdBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle || !newAdFee) return alert("जानकारी पूरी भरें!");
    const banner: AdBanner = {
      id: `BAN-${Date.now()}`,
      title: newAdTitle,
      imageUrl: newAdImage || "https://via.placeholder.com/600x200?text=Ad+Banner",
      redirectUrl: "#",
      isActive: true,
      monthlyFeeEarned: Number(newAdFee),
    };
    setBanners([...banners, banner]);
    setNewAdTitle("");
    setNewAdImage("");
    setNewAdFee("");
    alert("नया एड बैनर जोड़ दिया गया है!");
  };

  // Calculations
  const totalCommissionEarned = vendors.reduce((sum, v) => sum + v.adminCommissionEarned, 0);
  const totalAdRevenue = banners.reduce((sum, b) => sum + (b.isActive ? b.monthlyFeeEarned : 0), 0);
  const netMonthlyRevenue = totalCommissionEarned + totalAdRevenue;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleAdminLogin} className="bg-white p-8 rounded-3xl max-w-sm w-full space-y-4 text-center shadow-2xl">
          <div className="text-5xl">👑</div>
          <h2 className="text-xl font-black text-slate-900">Master Admin Portal</h2>
          <p className="text-xs text-slate-500">सुरक्षित मास्टर पिन दर्ज करें</p>
          <input
            type="password"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value)}
            placeholder="PIN (987654)"
            className="w-full p-3 bg-slate-100 border rounded-2xl text-center font-bold text-lg text-slate-900 outline-none"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm transition">
            लॉगिन करें 🔓
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-8 relative">
      <div className="fixed inset-0 opacity-5 pointer-events-none flex items-center justify-center -z-10">
        <Image src="/watermark.png" alt="Watermark" width={600} height={600} priority className="object-contain" />
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="px-3 py-1 bg-amber-400 text-slate-900 font-bold text-[10px] rounded-full uppercase">
              MASTER CONTROL & PROFIT HUB
            </span>
            <h1 className="text-2xl font-black mt-2">Form Saathi Admin Panel</h1>
            <p className="text-xs text-slate-400">कमीशन, स्टोरेज खर्च, एड्स एवं ट्रांजैक्शन की पूरी जानकारी</p>
          </div>

          <div className="flex gap-3">
            <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">कुल नेट मासिक कमाई</p>
              <p className="text-2xl font-black text-emerald-400">₹{netMonthlyRevenue}</p>
            </div>
          </div>
        </div>

        {/* Global Storage Safeguard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-bold">कमीशन से कमाई</p>
            <p className="text-xl font-black text-blue-600">₹{totalCommissionEarned}</p>
            <p className="text-[10px] text-slate-400">सभी वेंडर ऑर्डर्स का एडमिन कट</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-bold">एड बैनर से कमाई</p>
            <p className="text-xl font-black text-emerald-600">₹{totalAdRevenue} / महीना</p>
            <p className="text-[10px] text-slate-400">लोकल विज्ञापनों से डायरेक्ट बैंक इनकम</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-bold">क्लाउड सर्वर सुरक्षा (Cost Protection)</p>
            <p className="text-xs font-bold text-slate-800">Customer Limit: <span className="text-blue-600">{customerStorageLimitMB} MB</span></p>
            <p className="text-xs font-bold text-slate-800">Vendor Limit: <span className="text-emerald-600">{vendorStorageLimitMB} MB</span></p>
            <p className="text-[10px] text-emerald-600 font-bold">अनुमानित सर्वर खर्च = ₹0</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: "overview", label: "📊 ओवरव्यू" },
            { id: "services", label: "📝 सर्विस & कमीशन" },
            { id: "vendors", label: "🏪 वेंडर & स्टोरेज" },
            { id: "ledger", label: "💰 लेजर & QR Escrow" },
            { id: "ads", label: "📢 एड बैनर सिस्टम" },
            { id: "notifications", label: "🔔 नोटिफिकेशन्स" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-2xl whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: SERVICES & CUSTOM COMMISSION */}
        {activeTab === "services" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">सर्विस लिस्ट एवं कस्टम कमीशन एडिटर</h2>
              <p className="text-xs text-slate-500">डिफ़ॉल्ट 10% रहता है। आप किसी भी फॉर्म का कमीशन अपनी मर्जी से ₹ या % में सेट कर सकते हैं।</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => {
                const commAmt = calculateCommissionAmount(srv);
                const vendorPayout = srv.price - commAmt;

                return (
                  <div key={srv.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{srv.title}</h3>
                        <p className="text-xs text-blue-600 font-bold">ग्राहकों के लिए रेट: ₹{srv.price}</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingServiceId(srv.id);
                          setEditType(srv.commissionType);
                          setEditValue(srv.commissionValue);
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg"
                      >
                        ✏️ कमीशन एडिट करें
                      </button>
                    </div>

                    {editingServiceId === srv.id ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                        <p className="text-xs font-bold text-amber-900">कमीशन मोड बदलें:</p>
                        <div className="flex gap-2">
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as any)}
                            className="p-2 text-xs bg-white border rounded-lg font-bold text-slate-900"
                          >
                            <option value="Percentage">प्रतिशत (%)</option>
                            <option value="Fixed">फिक्स रुपए (₹)</option>
                          </select>
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            className="w-20 p-2 text-xs bg-white border rounded-lg font-bold text-slate-900"
                          />
                          <button
                            onClick={() => handleSaveCommission(srv.id)}
                            className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg"
                          >
                            सेव
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold bg-white p-3 rounded-xl border">
                        <span className="text-emerald-700">आपका कमीशन: ₹{commAmt} ({srv.commissionType === "Percentage" ? `${srv.commissionValue}%` : "Fixed"})</span>
                        <span className="text-slate-600">वेंडर का हिस्सा: ₹{vendorPayout}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VENDORS & LIVE STORAGE */}
        {activeTab === "vendors" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">वेंडर लिस्ट एवं स्टोरेज ट्रैकर</h2>
            <div className="space-y-3">
              {vendors.map((v) => {
                const storagePercent = Math.round((v.storageUsedMB / v.storageLimitMB) * 100);
                return (
                  <div key={v.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{v.shopName} ({v.name})</h3>
                      <p className="text-xs text-slate-500">मोबाइल: {v.mobile} | कुल ऑर्डर्स: {v.totalOrdersCompleted}</p>
                      <p className="text-xs text-emerald-600 font-bold">इस वेंडर से एडमिन कमाई: ₹{v.adminCommissionEarned}</p>
                    </div>

                    <div className="w-full md:w-64 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>स्टोरेज: {v.storageUsedMB} MB / {v.storageLimitMB} MB</span>
                        <span>{storagePercent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${storagePercent > 80 ? "bg-red-500" : "bg-blue-600"}`}
                          style={{ width: `${storagePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: AD BANNER SYSTEM */}
        {activeTab === "ads" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">📢 नया एड बैनर जोड़ें (Local Ad Sponsorships)</h2>
              <form onSubmit={handleAddAdBanner} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="विज्ञापनदाता का नाम (e.g. Apex Coaching)"
                  value={newAdTitle}
                  onChange={(e) => setNewAdTitle(e.target.value)}
                  className="p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
                <input
                  type="text"
                  placeholder="इमेज URL"
                  value={newAdImage}
                  onChange={(e) => setNewAdImage(e.target.value)}
                  className="p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
                <input
                  type="number"
                  placeholder="मासिक फीस (₹)"
                  value={newAdFee}
                  onChange={(e) => setNewAdFee(e.target.value)}
                  className="p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
                <button type="submit" className="md:col-span-3 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">
                  बैनर एक्टिवेट करें 🚀
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">सक्रिय विज्ञापन बैनर्स</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                    <p className="font-bold text-xs text-slate-900">{b.title}</p>
                    <p className="text-xs text-emerald-600 font-bold">मासिक आय: ₹{b.monthlyFeeEarned}/महीना</p>
                    <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      ACTIVE AD
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEDGER & TRANSACTION HISTORY */}
        {activeTab === "ledger" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">ऑर्डर लेजर एवं QR Escrow स्टेटस</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">वेंडर</th>
                    <th className="p-3">सर्विस</th>
                    <th className="p-3">कुल राशि</th>
                    <th className="p-3 text-emerald-600">एडमिन कट</th>
                    <th className="p-3">स्टेटस</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-bold">{row.orderId}</td>
                      <td className="p-3">{row.vendorName}</td>
                      <td className="p-3">{row.serviceTitle}</td>
                      <td className="p-3 font-bold">₹{row.totalAmount}</td>
                      <td className="p-3 font-bold text-emerald-600">₹{row.adminCommission}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                          row.status === "ESCROW_HOLD" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">सिस्टम एवं पेमेंट अलर्ट्स</h2>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 bg-slate-50 border rounded-2xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{n.title}</h3>
                    <p className="text-xs text-slate-600">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEFAULT OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="text-4xl">🚀</div>
            <h2 className="text-base font-bold text-slate-900">आपका फॉर्म साथी सिस्टम पूरी तरह तैयार है</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              ऊपर दिए गए टैब्स का उपयोग करके सर्विस कमीशन बदलें, एड बैनर लगाएँ, और वेंडर्स का स्टोरेज एवं कमाई ट्रैक करें।
            </p>
          </div>
        )}

      </div>
    </div>
  );
}