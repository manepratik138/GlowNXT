"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Mail, Lock, User, Phone } from "lucide-react";
import { ConfirmationResult, RecaptchaVerifier, createUserWithEmailAndPassword, signInWithPhoneNumber, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { localAuthService } from "@/lib/localAuthService";
import { localDb } from "@/lib/localStore";

const CITIES = [
  "Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad",
  "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Nagpur",
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer" as "customer" | "professional",
    city: "Mumbai",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");
  const confirmationResult = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  const normalizedPhone = () => {
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
    return "";
  };

  const sendRegistrationOtp = async () => {
    const formattedPhone = normalizedPhone();
    if (!formattedPhone) {
      setError("Enter a valid 10-digit Indian mobile number.");
      setLoading(false);
      return;
    }
    try {
      if (!auth) {
        setDemoOtp("123456");
      } else {
        if (!recaptchaVerifier.current) {
          recaptchaVerifier.current = new RecaptchaVerifier(auth, "registration-recaptcha", { size: "invisible" });
        }
        confirmationResult.current = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);
      }
      setOtpSent(true);
      setError("");
    } catch (err: unknown) {
      console.error("Firebase Phone Auth Error:", err);
      const code = (err as { code?: string }).code || "";
      let msg = "Could not send SMS OTP to your phone number.";
      if (code === "auth/operation-not-allowed") {
        msg = "Phone provider is not enabled in Firebase Authentication. Please enable it in Firebase Console.";
      } else if (code === "auth/unauthorized-domain" || code === "auth/invalid-app-credential") {
        msg = "Domain not authorized in Firebase. Add this domain to Authorized Domains in Firebase Settings.";
      } else if (code === "auth/quota-exceeded") {
        msg = "SMS quota exceeded in Firebase Console.";
      } else if (code === "auth/invalid-phone-number") {
        msg = "Invalid phone number format.";
      }
      setError(code ? `${msg} (${code})` : msg);
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = null;
    } finally {
      setLoading(false);
    }
  };

  const verifyRegistrationOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP.");
      setLoading(false);
      return;
    }
    try {
      if (!auth) {
        if (otp !== demoOtp) throw new Error("invalid-demo-otp");
      } else {
        if (!confirmationResult.current) throw new Error("otp-session-expired");
        await confirmationResult.current.confirm(otp);
        await signOut(auth);
      }
      setPhoneVerified(true);
      setError("");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      setError(code === "auth/invalid-verification-code" ? "Incorrect OTP entered. Check the SMS on your mobile." : "OTP verification failed. Please check the OTP sent to your phone.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (!phoneVerified) {
      if (otpSent) await verifyRegistrationOtp();
      else await sendRegistrationOtp();
      return;
    }

    // ── LOCAL MODE (Firebase not configured) ─────────────────
    if (!auth || !db) {
      try {
        const uid = localAuthService.createUser(form.email, form.password, form.name);

        const userProfile = {
          uid,
          email: form.email.toLowerCase().trim(),
          name: form.name,
          phone: form.phone,
          role: form.role,
          city: form.city,
          createdAt: new Date().toISOString(),
        };
        localDb.setDoc("users", uid, userProfile);

        if (form.role === "professional") {
          const professionalProfile = {
            id: uid,
            name: form.name,
            title: "Beauty Professional",
            avatar: "",
            rating: 5.0,
            reviewCount: 0,
            location: `${form.city}, India`,
            experience: 1,
            services: [],
            price: 999,
            available: true,
            verificationStatus: "pending",
            createdAt: new Date().toISOString(),
            bio: "Newly registered Beauty Professional on GlowNXT.",
            completedJobs: 0,
            specializations: [],
            portfolio: [],
            availableSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
            priceList: [],
          };
          localDb.setDoc("professionals", uid, professionalProfile);
        }

        setSuccess(true);
        setTimeout(() => {
          window.location.href = form.role === "professional" ? "/dashboard/pro" : "/dashboard/customer";
        }, 1500);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";
        setError(
          msg === "auth/email-already-in-use"
            ? "This email is already registered. Please log in."
            : "Registration failed. Please try again."
        );
        setLoading(false);
      }
      return;
    }

    // ── FIREBASE MODE ─────────────────────────────────────────
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      const userProfile = {
        uid: user.uid,
        email: form.email,
        name: form.name,
        phone: form.phone,
        role: form.role,
        city: form.city,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", user.uid), userProfile);

      if (form.role === "professional") {
        const professionalProfile = {
          id: user.uid,
          name: form.name,
          title: "Beauty Professional",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80",
          rating: 5.0,
          reviewCount: 0,
          location: `${form.city}, India`,
          experience: 1,
          services: [],
          price: 999,
          available: true,
          verificationStatus: "approved",
          createdAt: new Date().toISOString(),
          bio: "Newly registered Beauty Professional on GlowNXT.",
          completedJobs: 0,
          specializations: [],
          portfolio: [],
          availableSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
          priceList: [],
        };
        await setDoc(doc(db, "professionals", user.uid), professionalProfile);
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = form.role === "professional" ? "/dashboard/pro" : "/dashboard/customer";
      }, 1500);
    } catch (err: unknown) {
      console.error(err);
      const code = (err as { code?: string }).code ?? "";
      let message = "Registration failed. Please try again.";
      if (code === "auth/email-already-in-use") message = "This email is already in use.";
      else if (code === "auth/weak-password") message = "Password should be at least 6 characters.";
      else if (code === "auth/invalid-email") message = "Invalid email format.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ background: "white", borderRadius: 24, padding: "2.5rem 2rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #e11d48, #db2777)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 4px 16px rgba(225,29,72,0.4)" }}>
              <Sparkles size={24} color="white" />
            </div>

            <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.5rem", textAlign: "center" }}>
              Create Your Account
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "2rem", textAlign: "center" }}>
              Join GlowNXT — India&apos;s Premium Beauty Network.
            </p>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", padding: "0.75rem 1rem", borderRadius: 12, marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "0.75rem 1rem", borderRadius: 12, marginBottom: "1.5rem", fontSize: "0.875rem", fontWeight: 700, textAlign: "center" }}>
                🎉 Account created! Redirecting to your dashboard...
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* Role Selector */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 8, display: "block" }}>
                  I want to
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "customer" })}
                    style={{
                      padding: "1rem",
                      borderRadius: 14,
                      border: `2px solid ${form.role === "customer" ? "#e11d48" : "#e2e8f0"}`,
                      background: form.role === "customer" ? "#fff1f2" : "white",
                      color: form.role === "customer" ? "#e11d48" : "#475569",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>💆</div>
                    Book Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "professional" })}
                    style={{
                      padding: "1rem",
                      borderRadius: 14,
                      border: `2px solid ${form.role === "professional" ? "#e11d48" : "#e2e8f0"}`,
                      background: form.role === "professional" ? "#fff1f2" : "white",
                      color: form.role === "professional" ? "#e11d48" : "#475569",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>✂️</div>
                    Offer Services
                  </button>
                </div>
                {form.role === "professional" && (
                  <div style={{ marginTop: 8, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "0.6rem 0.875rem", fontSize: "0.78rem", color: "#92400e" }}>
                    ✨ After registering, set up your profile with your photo, services, and prices from your dashboard.
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Full Name</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 12, border: "2px solid #e2e8f0" }}>
                  <User size={18} color="#94a3b8" />
                  <input
                    required
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ border: "none", outline: "none", fontSize: "0.9rem", width: "100%", fontWeight: 600, color: "#0f172a" }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Mobile Number</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 12, border: "2px solid #e2e8f0" }}>
                  <Phone size={18} color="#94a3b8" />
                  <input
                    required
                    placeholder="98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ border: "none", outline: "none", fontSize: "0.9rem", width: "100%", fontWeight: 600, color: "#0f172a" }}
                  />
                </div>
                {otpSent && !phoneVerified && <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, padding: "0.65rem 0.8rem", borderRadius: 10, border: "2px solid #fda4af", background: "#fff7f8" }}><Phone size={16} color="#e11d48" /><input type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontWeight: 800, letterSpacing: "0.2em" }} /></div>}
                {phoneVerified && <div style={{ marginTop: 8, color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "0.55rem 0.75rem", fontSize: "0.78rem", fontWeight: 800 }}>✓ Mobile number verified</div>}
                {demoOtp && !phoneVerified && <div style={{ marginTop: 6, color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "0.55rem 0.75rem", fontSize: "0.75rem" }}>Local demo OTP: <strong>123456</strong></div>}
                <div id="registration-recaptcha" />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Email Address</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 12, border: "2px solid #e2e8f0" }}>
                  <Mail size={18} color="#94a3b8" />
                  <input
                    required
                    type="email"
                    placeholder="priya@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ border: "none", outline: "none", fontSize: "0.9rem", width: "100%", fontWeight: 600, color: "#0f172a" }}
                  />
                </div>
              </div>

              {/* City */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>City</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "2px solid #e2e8f0", fontSize: "0.9rem", fontWeight: 600, color: "#0f172a", background: "white", outline: "none" }}
                >
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Password</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 12, border: "2px solid #e2e8f0" }}>
                  <Lock size={18} color="#94a3b8" />
                  <input
                    required
                    type="password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ border: "none", outline: "none", fontSize: "0.9rem", width: "100%", fontWeight: 600, color: "#0f172a" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: 14,
                  border: "none",
                  background: (loading || success) ? "#cbd5e1" : "linear-gradient(135deg, #e11d48, #db2777)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: (loading || success) ? "not-allowed" : "pointer",
                  boxShadow: (loading || success) ? "none" : "0 8px 24px rgba(225,29,72,0.35)",
                }}
              >
                {loading ? (otpSent && !phoneVerified ? "Verifying OTP..." : "Sending OTP...") : success ? "Redirecting..." : phoneVerified ? "Create Account 🚀" : otpSent ? "Verify Mobile OTP" : "Send Mobile OTP"}
              </button>
            </form>

            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9", fontSize: "0.85rem", color: "#64748b", textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/auth/login" style={{ color: "#e11d48", fontWeight: 800, textDecoration: "none" }}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
