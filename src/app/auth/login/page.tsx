"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Mail, Lock, Phone, ShieldCheck } from "lucide-react";
import { ConfirmationResult, RecaptchaVerifier, signInWithEmailAndPassword, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { localAuthService } from "@/lib/localAuthService";
import { localDb } from "@/lib/localStore";
import { recordLoginActivity } from "@/lib/authActivity";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirmationResult = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setInterval(() => setResendSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const normalizedPhone = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
    return "";
  };

  const redirectForUser = async (uid: string, fallbackPhone?: string) => {
    if (db) {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid,
          email: `${fallbackPhone || "customer"}@phone.glownxt.local`,
          name: "GlowNXT Customer",
          phone: fallbackPhone || "",
          role: "customer",
          createdAt: new Date().toISOString(),
        });
        window.location.href = "/dashboard/customer";
        return;
      }
      const role = userDoc.data().role;
      window.location.href = role === "admin" ? "/dashboard/admin" : role === "professional" ? "/dashboard/pro" : "/dashboard/customer";
      return;
    }
    window.location.href = "/dashboard/customer";
  };

  const sendPhoneOtp = async () => {
    const formattedPhone = normalizedPhone();
    if (!formattedPhone) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (resendSeconds > 0) return;
    setLoading(true);
    setError("");
    try {
      if (!auth) {
        setDemoOtp("123456");
        setOtpSent(true);
        setResendSeconds(30);
        return;
      }
      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      }
      confirmationResult.current = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);
      setOtpSent(true);
      setResendSeconds(30);
    } catch (err: unknown) {
      console.error("Firebase Phone Auth Error:", err);
      const code = (err as { code?: string }).code || "";
      const messages: Record<string, string> = {
        "auth/invalid-phone-number": "Invalid phone number. Use a 10-digit Indian number.",
        "auth/operation-not-allowed": "Phone provider is not enabled in Firebase Authentication Console.",
        "auth/captcha-check-failed": "reCAPTCHA failed. Add this domain in Firebase Authorized domains.",
        "auth/invalid-app-credential": "Firebase could not verify this app. Check Authorized Domains.",
        "auth/unauthorized-domain": "This website domain is not authorized in Firebase Authentication settings.",
        "auth/quota-exceeded": "Firebase SMS quota exceeded.",
        "auth/too-many-requests": "Too many attempts. Wait and try again later.",
      };
      const baseMsg = messages[code] || "Could not send SMS OTP to your phone.";
      setError(code ? `${baseMsg} (${code})` : baseMsg);
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = null;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (!auth) {
        if (otp !== demoOtp) throw new Error("invalid-demo-otp");
        window.location.href = "/dashboard/customer";
        return;
      }
      if (!confirmationResult.current) throw new Error("otp-session-expired");
      const credential = await confirmationResult.current.confirm(otp);
      void recordLoginActivity({ userId: credential.user.uid, email: credential.user.email, phone: normalizedPhone(), method: "phone", role: "customer" });
      await redirectForUser(credential.user.uid, normalizedPhone());
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      setError(code === "auth/invalid-verification-code" ? "Incorrect OTP. Check the SMS sent to your phone." : code === "auth/code-expired" ? "OTP expired. Request a new OTP." : "OTP verification failed. Please try again.");
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // ── LOCAL MODE (Firebase not configured) ─────────────────
    if (!auth || !db) {
      try {
        const session = localAuthService.signIn(email, password);
        const userDoc = localDb.getDoc("users", session.uid);
        if (userDoc.exists()) {
          const userData = userDoc.data() as { role: string };
          void recordLoginActivity({ userId: session.uid, email: session.email, method: "local-demo", role: userData.role });
          if (userData.role === "admin") {
            window.location.href = "/dashboard/admin";
          } else if (userData.role === "professional") {
            window.location.href = "/dashboard/pro";
          } else {
            window.location.href = "/dashboard/customer";
          }
        } else {
          window.location.href = "/dashboard/customer";
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";
        setError(
          msg === "auth/invalid-credential"
            ? "Incorrect email or password. Please try again."
            : "Login failed. Please try again."
        );
        setLoading(false);
      }
      return;
    }

    // ── FIREBASE MODE ─────────────────────────────────────────
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await redirectForUser(user.uid);
      void recordLoginActivity({ userId: user.uid, email: user.email, method: "email" });
    } catch (err: unknown) {
      console.error("Firebase Login Error:", err);
      const code = (err as { code?: string }).code ?? "";
      
      // Fallback to local session login if user exists locally
      try {
        const session = localAuthService.signIn(email, password);
        const userDoc = localDb.getDoc("users", session.uid);
        const userData = userDoc.exists() ? (userDoc.data() as { role: string }) : { role: "customer" };
        void recordLoginActivity({ userId: session.uid, email: session.email, method: "local-demo", role: userData.role });
        window.location.href = userData.role === "admin" ? "/dashboard/admin" : userData.role === "professional" ? "/dashboard/pro" : "/dashboard/customer";
        return;
      } catch (localErr) {
        console.error("Local login error:", localErr);
      }

      let message = "Failed to sign in. Please check your credentials.";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        message = "Invalid email or password.";
      } else if (code === "auth/invalid-email") {
        message = "Invalid email format.";
      } else if (code === "auth/operation-not-allowed") {
        message = "Enable Email/Password provider in Firebase Authentication Console.";
      }
      setError(code ? `${message} (${code})` : message);
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 460, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ background: "white", borderRadius: 24, padding: "2.5rem 2rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #e11d48, #db2777)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 4px 16px rgba(225,29,72,0.4)" }}>
              <Sparkles size={24} color="white" />
            </div>

            <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.5rem" }}>
              Welcome Back
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "2rem" }}>
              Log in to manage bookings, profiles, and services.
            </p>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", padding: "0.75rem 1rem", borderRadius: 12, marginBottom: "1.5rem", fontSize: "0.875rem", textAlign: "left" }}>
                {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.25rem", background: "#f1f5f9", padding: 4, borderRadius: 12 }}>
              <button type="button" onClick={() => { setLoginMethod("email"); setError(""); }} style={{ padding: "0.65rem", border: "none", borderRadius: 9, background: loginMethod === "email" ? "white" : "transparent", color: loginMethod === "email" ? "#e11d48" : "#64748b", fontWeight: 800, cursor: "pointer" }}><Mail size={15} style={{ verticalAlign: "middle", marginRight: 5 }} /> Email</button>
              <button type="button" onClick={() => { setLoginMethod("phone"); setError(""); }} style={{ padding: "0.65rem", border: "none", borderRadius: 9, background: loginMethod === "phone" ? "white" : "transparent", color: loginMethod === "phone" ? "#e11d48" : "#64748b", fontWeight: 800, cursor: "pointer" }}><Phone size={15} style={{ verticalAlign: "middle", marginRight: 5 }} /> Mobile OTP</button>
            </div>

            {loginMethod === "email" ? (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Email Address</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 14, border: "2px solid #e2e8f0", background: "white" }}>
                    <Mail size={18} color="#94a3b8" />
                    <input required type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ border: "none", outline: "none", fontSize: "1rem", width: "100%", fontWeight: 600, color: "#0f172a" }} />
                  </div>
                </div>
                <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Password</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 14, border: "2px solid #e2e8f0", background: "white" }}>
                    <Lock size={18} color="#94a3b8" />
                    <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ border: "none", outline: "none", fontSize: "1rem", width: "100%", fontWeight: 600, color: "#0f172a" }} />
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.875rem", borderRadius: 14, border: "none", background: loading ? "#cbd5e1" : "linear-gradient(135deg, #e11d48, #db2777)", color: "white", fontWeight: 800, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 8px 24px rgba(225,29,72,0.35)" }}>{loading ? "Logging in..." : "Log In"}</button>
              </form>
            ) : (
              <div>
                <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Contact Number</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 14, border: "2px solid #e2e8f0", background: "white" }}>
                    <Phone size={18} color="#94a3b8" />
                    <input type="tel" inputMode="numeric" placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} style={{ border: "none", outline: "none", fontSize: "1rem", width: "100%", fontWeight: 600, color: "#0f172a" }} />
                  </div>
                </div>
                {!otpSent ? (
                  <button type="button" onClick={sendPhoneOtp} disabled={loading} style={{ width: "100%", padding: "0.875rem", borderRadius: 14, border: "none", background: loading ? "#cbd5e1" : "linear-gradient(135deg, #e11d48, #db2777)", color: "white", fontWeight: 800, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Sending OTP..." : "Send OTP"}</button>
                ) : (
                  <>
                    <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                      <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 6, display: "block" }}>6-Digit OTP</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 14, border: "2px solid #fda4af", background: "#fff7f8" }}>
                        <ShieldCheck size={18} color="#e11d48" />
                        <input type="text" inputMode="numeric" maxLength={6} placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} style={{ border: "none", outline: "none", fontSize: "1.1rem", letterSpacing: "0.25em", width: "100%", fontWeight: 800, color: "#0f172a", background: "transparent" }} />
                      </div>
                    </div>
                    {demoOtp && <p style={{ color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "0.6rem", fontSize: "0.75rem", textAlign: "left" }}>Firebase is not configured. Demo OTP: <strong>123456</strong></p>}
                    <button type="button" onClick={verifyPhoneOtp} disabled={loading} style={{ width: "100%", padding: "0.875rem", borderRadius: 14, border: "none", background: loading ? "#cbd5e1" : "linear-gradient(135deg, #e11d48, #db2777)", color: "white", fontWeight: 800, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Verifying..." : "Verify & Continue"}</button>
                    <button type="button" onClick={() => { setOtpSent(false); setOtp(""); setDemoOtp(""); }} disabled={resendSeconds > 0} style={{ width: "100%", marginTop: 8, padding: "0.6rem", border: "none", background: "transparent", color: resendSeconds > 0 ? "#94a3b8" : "#e11d48", fontWeight: 800, cursor: resendSeconds > 0 ? "not-allowed" : "pointer" }}>{resendSeconds > 0 ? `Change number or resend in ${resendSeconds}s` : "Use another number"}</button>
                  </>
                )}
                <div id="recaptcha-container" />
              </div>
            )}

            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9", fontSize: "0.85rem", color: "#64748b" }}>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" style={{ color: "#e11d48", fontWeight: 800, textDecoration: "none" }}>
                Register Here
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
