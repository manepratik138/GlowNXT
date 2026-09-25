"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Mail, Lock } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { localAuthService } from "@/lib/localAuthService";
import { localDb } from "@/lib/localStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        if (role === "admin") {
          window.location.href = "/dashboard/admin";
        } else if (role === "professional") {
          window.location.href = "/dashboard/pro";
        } else {
          window.location.href = "/dashboard/customer";
        }
      } else {
        setError("User profile not found in database.");
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error(err);
      const code = (err as { code?: string }).code ?? "";
      let message = "Failed to sign in. Please check your credentials.";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        message = "Invalid email or password.";
      } else if (code === "auth/invalid-email") {
        message = "Invalid email format.";
      }
      setError(message);
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

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 6, display: "block" }}>
                  Email Address
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 14, border: "2px solid #e2e8f0", background: "white" }}>
                  <Mail size={18} color="#94a3b8" />
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ border: "none", outline: "none", fontSize: "1rem", width: "100%", fontWeight: 600, color: "#0f172a" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 6, display: "block" }}>
                  Password
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem", borderRadius: 14, border: "2px solid #e2e8f0", background: "white" }}>
                  <Lock size={18} color="#94a3b8" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ border: "none", outline: "none", fontSize: "1rem", width: "100%", fontWeight: 600, color: "#0f172a" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: 14,
                  border: "none",
                  background: loading ? "#cbd5e1" : "linear-gradient(135deg, #e11d48, #db2777)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 8px 24px rgba(225,29,72,0.35)",
                }}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

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
