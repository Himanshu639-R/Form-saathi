"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Customer" | "Vendor">("Customer");
  const [loading, setLoading] = useState(false);

  // Authentication Logic (Unique Account & Persistence)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isForgot) {
      // Forgot Password Reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) alert("त्रुटि: " + error.message);
      else alert("पासवर्ड रिसेट लिंक आपकी ईमेल पर भेज दिया गया है!");
      setLoading(false);
      return;
    }

    if (isSignUp) {
      // New Account Signup (Prevents Duplicates)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { user_role: role },
        },
      });

      if (error) {
        alert("साइनअप में समस्या: " + error.message);
      } else {
        alert("अकाउंट सफलतापूर्वक बन गया! अब आप सीधे लॉगिन कर सकते हैं।");
        setIsSignUp(false);
      }
    } else {
      // Login with Existing Credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("लॉगिन असफल: ईमेल या पासवर्ड गलत है!");
      } else {
        alert("सफलतापूर्वक लॉगिन हुआ!");
        window.location.href = role === "Vendor" ? "/vendor" : "/dashboard";
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="fixed inset-0 opacity-10 pointer-events-none flex items-center justify-center -z-0">
        <Image src="/watermark.png" alt="Watermark" width={600} height={600} priority className="object-contain" />
      </div>

      <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl relative z-10 space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900">FormSaathi</h1>
          <p className="text-xs text-slate-500 mt-1">
            {isForgot
              ? "पासवर्ड रीसेट करें"
              : isSignUp
              ? "नया सुरक्षित अकाउंट बनाएं"
              : "अपने डिजिटल लॉकर में प्रवेश करें"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isForgot && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                अकाउंट का प्रकार (Account Role)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("Customer")}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    role === "Customer"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  👤 कस्टमर / यूज़र
                </button>
                <button
                  type="button"
                  onClick={() => setRole("Vendor")}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    role === "Vendor"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  🛠️ वेंडर पार्टनर्स
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ईमेल एड्रेस (Email)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
            />
          </div>

          {!isForgot && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">पासवर्ड (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
          >
            {loading
              ? "प्रक्रिया जारी है..."
              : isForgot
              ? "रीसेट लिंक भेजें 📩"
              : isSignUp
              ? "अकाउंट बनाएं 🚀"
              : "लॉगिन करें 🔓"}
          </button>
        </form>

        {/* Footer Navigation Controls */}
        <div className="flex flex-col gap-2 text-center text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
          {!isForgot ? (
            <>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline"
              >
                {isSignUp ? "पहले से अकाउंट है? लॉगिन करें" : "नया अकाउंट बनाना है? साइनअप करें"}
              </button>
              <button
                type="button"
                onClick={() => setIsForgot(true)}
                className="text-slate-400 hover:text-slate-600 text-[11px]"
              >
                पासवर्ड भूल गए? (Forgot Password)
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsForgot(false)}
              className="text-blue-600 hover:underline"
            >
              ← वापस लॉगिन पेज पर जाएं
            </button>
          )}
        </div>
      </div>
    </div>
  );
}