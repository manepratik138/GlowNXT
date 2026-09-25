"use client";
import { useState } from "react";
import { X, Mail, Phone, Eye, EyeOff, Sparkles, CheckCircle } from "lucide-react";

interface CustomerAuthProps {
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

export default function CustomerAuthModal({ onClose, onLogin }: CustomerAuthProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // for register multi-step

  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "", age: "", gender: "",
    address: "", city: "", pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name: form.name || "Customer", email: form.email || form.mobile });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    onLogin({ name: form.name, email: form.email });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors z-10">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <Sparkles size={28} />
            <span className="font-extrabold text-2xl">Glow<span className="text-pink-200">NXT</span></span>
          </div>
          <p className="text-rose-100 relative z-10">
            {mode === "login" ? "Welcome back! 👋" : "Join us today! ✨"}
          </p>
        </div>

        {/* Toggle Login / Register */}
        <div className="flex bg-slate-100 m-6 rounded-2xl p-1">
          <button onClick={() => { setMode("login"); setStep(1); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === "login" ? "bg-white text-rose-600 shadow-md" : "text-slate-500"}`}>
            Login
          </button>
          <button onClick={() => { setMode("register"); setStep(1); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === "register" ? "bg-white text-rose-600 shadow-md" : "text-slate-500"}`}>
            Register
          </button>
        </div>

        <div className="px-6 pb-8">
          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {/* Email / Mobile Toggle */}
              <div className="flex gap-2 mb-1">
                <button type="button" onClick={() => setLoginMethod("email")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${loginMethod === "email" ? "border-rose-500 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-400"}`}>
                  <Mail size={16} /> Email
                </button>
                <button type="button" onClick={() => setLoginMethod("mobile")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${loginMethod === "mobile" ? "border-rose-500 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-400"}`}>
                  <Phone size={16} /> Mobile
                </button>
              </div>

              {loginMethod === "email" ? (
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email address" required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50 transition-colors" />
                </div>
              ) : (
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="mobile" value={form.mobile} onChange={handleChange} type="tel" placeholder="Mobile number (e.g. 9876543210)" required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50 transition-colors" />
                </div>
              )}

              <div className="relative">
                <input name="password" value={form.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Password" required
                  className="w-full pl-4 pr-12 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all active:scale-95 mt-2">
                Login to GlowNXT
              </button>

              <p className="text-center text-slate-500 text-sm">
                Don't have an account?{" "}
                <button type="button" onClick={() => setMode("register")} className="text-rose-600 font-bold hover:underline">
                  Register now
                </button>
              </p>
            </form>
          )}

          {/* REGISTER FORM - Step 1 */}
          {mode === "register" && step === 1 && (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Step 1 of 2 — Basic Info</p>
              <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Full Name" required
                className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50 transition-colors" />
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email address" required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50 transition-colors" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="mobile" value={form.mobile} onChange={handleChange} type="tel" placeholder="Mobile Number" required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50 transition-colors" />
              </div>
              <div className="relative">
                <input name="password" value={form.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Create Password" required
                  className="w-full pl-4 pr-12 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all active:scale-95 mt-2">
                Next →
              </button>
            </form>
          )}

          {/* REGISTER FORM - Step 2 */}
          {mode === "register" && step === 2 && (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Step 2 of 2 — Your Details</p>
              <div className="flex gap-3">
                <input name="age" value={form.age} onChange={handleChange} type="number" placeholder="Age" min="1" max="120"
                  className="w-1/3 px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="flex-1 px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50">
                  <option value="">Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input name="address" value={form.address} onChange={handleChange} type="text" placeholder="Street Address" required
                className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
              <div className="flex gap-3">
                <input name="city" value={form.city} onChange={handleChange} type="text" placeholder="City" required
                  className="flex-1 px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                <input name="pincode" value={form.pincode} onChange={handleChange} type="text" placeholder="Pincode" required
                  className="w-1/3 px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all">
                  ← Back
                </button>
                <button type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <CheckCircle size={20} /> Create Account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
