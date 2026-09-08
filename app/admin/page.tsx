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

interface VendorProfile {
  id: string;
  name: string;
  shopName: string;
  mobile: string;
  email: string;
  aadharLast4: string;
  address: string;
  isBlocked: boolean;
  totalOrdersCompleted: number;
  totalBilling: number;
  adminCommissionEarned: number; // 10%
  commissionStatus: "Pending" | "Received";
}

export default function AdminDashboard() {
  // Master PIN Logic (Env variable or LocalStorage)
  const defaultPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "987654"; 
  const [masterPin, setMasterPin] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("FS_ADMIN_PIN") || defaultPin;
    }
    return defaultPin;
  });

  const [inputPin, setInputPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Forgot / Reset PIN States
  const [isResetMode, setIsResetMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPin, setNewPin] = useState("");

  // Change PIN inside Dashboard State
  const [showChangePin, setShowChangePin] = useState(false);
  const [oldPinCheck, setOldPinCheck] = useState("");
  const [updatedPin, setUpdatedPin] = useState("");

  // Registered Vendors Directory & KYC
  const [vendors, setVendors] = useState<VendorProfile[]>([
    {
      id: "VND-101",
      name: "Ramesh Sharma",
      shopName: "Sharma Online Jan Seva",
      mobile: "9876543210",
      email: "sharma.janseva@gmail.com",
      aadharLast4: "5678",
      address: "Shop No. 4, Main Market, Lucknow",
      isBlocked: false,
      totalOrdersCompleted: 15,
      totalBilling: 3000,
      adminCommissionEarned: 300, // 10% of 3000
      commissionStatus: "Pending",
    },
  ]);

  // Master Services Data
  const [services, setServices] = useState<FormService[]>([
    {
      id: "1",
      title: "आधार कार्ड संशोधन / अपडेट",
      category: "Aadhaar Services",
      price: "₹100",
      commission: "₹10",
      requiredDocs: ["ओरिजिनल आधार कार्ड", "पहचान पत्र (PAN/Voter ID)", "मोबाइल नंबर"],
    },
    {
      id: "2",
      title: "नया पैन कार्ड (Instant PAN)",
      category: "PAN Services",
      price: "₹150",
      commission: "₹15",
      requiredDocs: ["आधार कार्ड linked with Mobile", "पासपोर्ट फोटो"],
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDocs, setNewDocs] = useState("");

  // Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === masterPin) {
      setIsAuthorized(true);
    } else {
      alert("गलत मास्टर पिन! केवल ऑपरेटर/मास्टर ही एक्सेस कर सकते हैं।");
    }
  };

  // OTP Reset Functions
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return alert("सही 10 अंकों का मोबाइल नंबर दर्ज करें!");
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    alert(`सुरक्षा OTP आपके मोबाइल (${phoneNumber}) पर भेजा गया है: ${randomOtp}`);
  };

  const handleVerifyOtpAndResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) return alert("गलत OTP!");
    if (newPin.length < 4) return alert("नया पिन कम से कम 4 अंकों का होना चाहिए!");

    setMasterPin(newPin);
    if (typeof window !== "undefined") {
      localStorage.setItem("FS_ADMIN_PIN", newPin);
    }
    alert("मास्टर पिन सफलतापूर्वक बदल दिया गया है!");
    setIsResetMode(false);
    setOtpSent(false);
    setEnteredOtp("");
    setPhoneNumber("");
    setNewPin("");
  };

  const handleChangePinInside = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPinCheck !== masterPin) return alert("पुराना मास्टर पिन गलत है!");
    if (updatedPin.length < 4) return alert("नया पिन कम से कम 4 अंकों का होना चाहिए!");

    setMasterPin(updatedPin);
    if (typeof window !== "undefined") {
      localStorage.setItem("FS_ADMIN_PIN", updatedPin);
    }
    alert("आपका एडमिन पिन सफलतापूर्वक अपडेट हो गया!");
    setShowChangePin(false);
    setOldPinCheck("");
    setUpdatedPin("");
  };

  // Vendor KYC & Security Control
  const toggleBlockVendor = (vendorId: string) => {
    setVendors(
      vendors.map((v) =>
        v.id === vendorId ? { ...v, isBlocked: !v.isBlocked } : v
      )
    );
  };

  const markCommissionReceived = (vendorId: string) => {
    setVendors(
      vendors.map((v) =>
        v.id === vendorId ? { ...v, commissionStatus: "Received" } : v
      )
    );
    alert("कमीशन प्राप्त के रूप में मार्क कर दिया गया है!");
  };

  // Service Management
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return alert("कृपया सर्विस नाम और रेट भरें!");

    const numericPrice = Number(newPrice);
    const calculatedCommission = Math.round(numericPrice * 0.10); // Auto 10%

    const newEntry: FormService = {
      id: Date.now().toString(),
      title: newTitle,
      category: "Government Form",
      price: `₹${numericPrice}`,
      commission: `₹${calculatedCommission}`,
      requiredDocs: newDocs ? newDocs.split(",") : ["सामान्य पहचान पत्र"],
    };

    setServices([...services, newEntry]);
    setNewTitle("");
    setNewPrice("");
    setNewDocs("");
    alert("नई सेवा एवं दस्तावेज़ लिस्ट जुड़ गई!");
  };

  const handleDeleteService = (id: string) => {
    if (confirm("क्या आप वाकई इस सेवा को प्लेटफॉर्म से हटाना चाहते हैं?")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  // Total Admin Earnings Calculation
  const totalAdminCommission = vendors.reduce((sum, v) => sum + v.adminCommissionEarned, 0);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="fixed inset-0 opacity-10 pointer-events-none flex items-center justify-center -z-0">
          <Image src="/watermark.png" alt="Watermark" width={600} height={600} priority className="object-contain" />
        </div>

        <div className="bg-white p-8 rounded-3xl max-w-sm w-full space-y-4 text-center shadow-2xl relative z-10">
          <div className="text-4xl">👑</div>
          <h2 className="text-xl font-black text-slate-900">FormSaathi Master Control</h2>

          {!isResetMode ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <p className="text-xs text-slate-500">अपना गुप्त मास्टर पिन दर्ज करें</p>
              <input
                type="password"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                placeholder="Enter Master PIN"
                className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-center font-bold text-lg outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-md">
                मास्टर कंट्रोल खोलें 🔓
              </button>
              
              <button
                type="button"
                onClick={() => setIsResetMode(true)}
                className="text-xs text-slate-400 hover:text-blue-600 font-semibold underline block mx-auto pt-2"
              >
                पिन भूल गए? (OTP से रीसेट करें)
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-left">
              <h3 className="text-xs font-bold text-slate-700 text-center uppercase">OTP से मास्टर पिन रीसेट करें</h3>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">रजिस्टर्ड मोबाइल नंबर</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9876543210"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-900"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                    OTP भेजें 📩
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpAndResetPin} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">6-अंकों का OTP दर्ज करें</label>
                    <input
                      type="text"
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 6-Digit OTP"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">नया मास्टर PIN दर्ज करें</label>
                    <input
                      type="password"
                      required
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="New Secret PIN"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center outline-none text-slate-900"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-xs">
                    पिन अपडेट करें एवं लॉगिन करें 🔒
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => { setIsResetMode(false); setOtpSent(false); }}
                className="text-xs text-slate-500 hover:underline block mx-auto text-center pt-2"
              >
                ← वापस लॉगिन पर जाएं
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 relative">
      <div className="fixed inset-0 opacity-15 pointer-events-none flex items-center justify-center -z-10">
        <Image src="/watermark.png" alt="Watermark" width={650} height={650} priority className="object-contain" />
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Admin Header */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-2.5 py-0.5 bg-amber-400 text-slate-900 font-bold text-[10px] rounded-md">
              SUPER ADMIN MASTER
            </span>
            <h1 className="text-2xl font-black mt-1">मास्टर एडमिन कंट्रोल पैनल</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-4 hidden sm:block">
              <p className="text-[10px] text-slate-400 uppercase font-bold">कुल एडमिन कमीशन (10%)</p>
              <p className="text-xl font-black text-emerald-400">₹{totalAdminCommission}</p>
            </div>
            <button
              onClick={() => setShowChangePin(!showChangePin)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl transition"
            >
              ⚙️ PIN बदलें
            </button>
            <button
              onClick={() => setIsAuthorized(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition"
            >
              🔒 लॉगआउट
            </button>
          </div>
        </div>

        {/* Inside PIN Change */}
        {showChangePin && (
          <form onSubmit={handleChangePinInside} className="bg-amber-50 p-6 rounded-2xl border border-amber-200 space-y-4">
            <h3 className="font-bold text-sm text-amber-900">🔐 अपना एडमिन गुप्त PIN बदलें</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                required
                value={oldPinCheck}
                onChange={(e) => setOldPinCheck(e.target.value)}
                placeholder="पुराना मास्टर PIN दर्ज करें"
                className="p-3 bg-white border border-amber-300 rounded-xl text-xs outline-none text-slate-900"
              />
              <input
                type="password"
                required
                value={updatedPin}
                onChange={(e) => setUpdatedPin(e.target.value)}
                placeholder="नया मास्टर PIN दर्ज करें"
                className="p-3 bg-white border border-amber-300 rounded-xl text-xs outline-none text-slate-900"
              />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md">
              PIN अपडेट करें
            </button>
          </form>
        )}

        {/* Vendor KYC Directory & Financial Accounts Ledger */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">📊 वेंडर कमीशन खाता एवं KYC डिटेल्स (Vendor Directory)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-3">वेंडर एवं दुकान</th>
                  <th className="p-3">संपर्क व आधार KYC</th>
                  <th className="p-3">कुल बिजनेस</th>
                  <th className="p-3">आपका 10% कमीशन</th>
                  <th className="p-3">कमीशन स्थिति</th>
                  <th className="p-3 text-right">सुरक्षा एक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vendors.map((v) => (
                  <tr key={v.id} className={v.isBlocked ? "bg-red-50" : ""}>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{v.shopName}</p>
                      <p className="text-[10px] text-slate-400">{v.name} ({v.id})</p>
                      <p className="text-[10px] text-slate-500">{v.address}</p>
                    </td>
                    <td className="p-3">
                      <p>📞 {v.mobile}</p>
                      <p>✉️ {v.email}</p>
                      <p className="text-[10px] text-slate-400">Aadhaar (Last 4): XXXX-XXXX-{v.aadharLast4}</p>
                    </td>
                    <td className="p-3 font-bold text-slate-700">₹{v.totalBilling} ({v.totalOrdersCompleted} फॉर्म)</td>
                    <td className="p-3 font-black text-emerald-600">₹{v.adminCommissionEarned}</td>
                    <td className="p-3">
                      {v.commissionStatus === "Received" ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          ✅ प्राप्त हो गया
                        </span>
                      ) : (
                        <button
                          onClick={() => markCommissionReceived(v.id)}
                          className="px-2.5 py-1 bg-amber-500 text-white font-bold rounded text-[10px]"
                        >
                          ⏳ लेने बाकी हैं (Mark Received)
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleBlockVendor(v.id)}
                        className={`px-3 py-1.5 font-bold rounded text-xs ${
                          v.isBlocked ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                        }`}
                      >
                        {v.isBlocked ? "अनब्लॉक करें" : "🚫 ब्लॉक करें (Block)"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Master Form Addition */}
        <form onSubmit={handleAddService} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">➕ नई मास्टर सर्विस व आवश्यक दस्तावेज़ जोड़ें</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="सेवा का नाम (जैसे: जाति प्रमाण पत्र)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-900"
            />
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="ग्राहक शुल्क (₹)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-900"
            />
          </div>
          <input
            type="text"
            value={newDocs}
            onChange={(e) => setNewDocs(e.target.value)}
            placeholder="ज़रूरी डॉक्यूमेंट्स की लिस्ट (Comma से अलग करें: जैसे आधार कार्ड, फोटो, राशन कार्ड)"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-900"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
            मास्टर लिस्ट में शामिल करें 🚀
          </button>
        </form>

        {/* Live Master Services List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">एक्टिव सेवाएं एवं ऑटो 10% एडमिन कट (Live Master Data)</h2>
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
                  <span className="text-blue-700">आपका 10% कमीशन: {item.commission}</span>
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