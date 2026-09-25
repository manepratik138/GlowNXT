"use client";
import { useState } from "react";
import { X, Mail, Phone, Eye, EyeOff, Briefcase, CheckCircle, Camera, Clock, MapPin } from "lucide-react";

interface ProAuthProps {
  onClose: () => void;
  onLogin: (pro: { name: string; email: string }) => void;
}

const SERVICES = ["Haircut", "Hairstyling", "Hair Coloring", "Hair Spa", "Bridal Makeup", "Party Makeup", "Facial", "Waxing", "Manicure", "Pedicure", "Nail Art", "Mehendi", "Kids Haircut", "Beard Styling", "Men's Grooming"];

export default function ProAuthModal({ onClose, onLogin }: ProAuthProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "",
    experience: "", bio: "", address: "", city: "", pincode: "",
    gender: "", idProof: "", certificate: "",
    workStartTime: "09:00", workEndTime: "20:00",
    serviceable_radius: "5",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleService = (s: string) =>
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name: form.name || "Professional", email: form.email });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); return; }
    onLogin({ name: form.name, email: form.email });
  };

  const stepLabels = ["Basic Info", "Professional Details", "Services & Availability"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-blue-900 p-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors z-10">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <Briefcase size={28} className="text-blue-400" />
            <span className="font-extrabold text-2xl">Professional Portal</span>
          </div>
          <p className="text-blue-200 relative z-10">
            {mode === "login" ? "Welcome back, Pro! 💼" : "Grow your beauty business 🚀"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-slate-100 mx-6 mt-6 rounded-2xl p-1 shrink-0">
          <button onClick={() => { setMode("login"); setStep(1); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === "login" ? "bg-white text-blue-600 shadow-md" : "text-slate-500"}`}>
            Login
          </button>
          <button onClick={() => { setMode("register"); setStep(1); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === "register" ? "bg-white text-blue-600 shadow-md" : "text-slate-500"}`}>
            Register
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 pb-8 pt-4">
          {/* LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email address" required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
              </div>
              <div className="relative">
                <input name="password" value={form.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Password" required
                  className="w-full pl-4 pr-12 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
                ⏳ Your account will be active after admin verification.
              </div>
              <button type="submit"
                className="w-full py-4 bg-gradient-to-r from-slate-800 to-blue-800 text-white font-extrabold rounded-2xl shadow-lg transition-all active:scale-95 mt-2">
                Login as Professional
              </button>
            </form>
          )}

          {/* REGISTER - Step indicator */}
          {mode === "register" && (
            <>
              <div className="flex gap-2 mb-6">
                {stepLabels.map((label, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold transition-all ${i + 1 < step ? "bg-blue-600 text-white" : i + 1 === step ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-slate-200 text-slate-400"}`}>
                      {i + 1 < step ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-semibold text-center ${i + 1 === step ? "text-blue-600" : "text-slate-400"}`}>{label}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                {/* STEP 1: Basic Info */}
                {step === 1 && (
                  <>
                    <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Full Name" required
                      className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email address" required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input name="mobile" value={form.mobile} onChange={handleChange} type="tel" placeholder="Mobile Number" required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                    </div>
                    <div className="relative">
                      <input name="password" value={form.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Create Password" required
                        className="w-full pl-4 pr-12 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <select name="gender" value={form.gender} onChange={handleChange}
                      className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50">
                      <option value="">Select Gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </>
                )}

                {/* STEP 2: Professional Details */}
                {step === 2 && (
                  <>
                    <div className="flex gap-3">
                      <input name="experience" value={form.experience} onChange={handleChange} type="number" placeholder="Years Experience" min="0" max="50" required
                        className="w-1/3 px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                      <input name="serviceable_radius" value={form.serviceable_radius} onChange={handleChange} type="number" placeholder="km radius" min="1" max="50" required
                        className="flex-1 px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                    </div>
                    <textarea name="bio" value={form.bio} onChange={handleChange as any} placeholder="Tell customers about yourself & your expertise..." rows={3} required
                      className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50 resize-none" />
                    <input name="address" value={form.address} onChange={handleChange} type="text" placeholder="Street Address" required
                      className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                    <div className="flex gap-3">
                      <input name="city" value={form.city} onChange={handleChange} type="text" placeholder="City" required
                        className="flex-1 px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                      <input name="pincode" value={form.pincode} onChange={handleChange} type="text" placeholder="Pincode" required
                        className="w-1/3 px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                    </div>
                    {/* Doc Upload (simulated) */}
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <Camera size={28} className="mx-auto mb-2 text-slate-400" />
                      <p className="font-bold text-slate-600 text-sm">Upload ID Proof & Certificate</p>
                      <p className="text-xs text-slate-400 mt-1">Aadhar, PAN, or Beauty Certificate</p>
                    </div>
                  </>
                )}

                {/* STEP 3: Services & Availability */}
                {step === 3 && (
                  <>
                    <p className="font-bold text-slate-700 text-sm mb-1">Select Your Services</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {SERVICES.map(s => (
                        <button key={s} type="button" onClick={() => toggleService(s)}
                          className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${selectedServices.includes(s) ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2"><Clock size={16} />Working Hours</p>
                      <div className="flex gap-3 items-center">
                        <input name="workStartTime" value={form.workStartTime} onChange={handleChange} type="time"
                          className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                        <span className="text-slate-400 font-bold">to</span>
                        <input name="workEndTime" value={form.workEndTime} onChange={handleChange} type="time"
                          className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none font-medium text-slate-700 bg-slate-50" />
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700 flex gap-3">
                      <CheckCircle size={20} className="shrink-0 mt-0.5 text-blue-500" />
                      Your profile will be reviewed by our team within 24 hours and activated after verification.
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-2">
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)}
                      className="flex-1 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all">
                      ← Back
                    </button>
                  )}
                  <button type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-slate-800 to-blue-800 text-white font-extrabold rounded-2xl shadow-lg transition-all active:scale-95">
                    {step < 3 ? "Next →" : "Submit for Verification ✓"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
