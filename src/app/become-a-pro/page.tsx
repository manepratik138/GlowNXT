"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, CheckCircle, ArrowRight, Shield, Award, Phone, Mail, User, MapPin } from "lucide-react";
import { PRO_BENEFITS, PRO_TYPES } from "@/lib/data";

export default function BecomeAProPage() {
  const [selectedType, setSelectedType] = useState("freelance");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    experience: "3-5 years",
    services: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header Banner */}
          <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #831843 100%)", borderRadius: 24, padding: "3.5rem 2rem", color: "white", marginBottom: "3rem", textAlign: "center" }}>
            <span style={{ display: "inline-block", background: "rgba(225,29,72,0.2)", color: "#fda4af", border: "1px solid rgba(225,29,72,0.4)", padding: "0.25rem 0.875rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, marginBottom: "1rem" }}>
              💼 GROW YOUR BEAUTY BUSINESS
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", fontWeight: 900, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
              Earn With GlowNXT
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 540, margin: "0 auto", fontSize: "1rem", lineHeight: 1.6 }}>
              Join 2,500+ professionals earning 30%–50% higher income with flexible hours and verified clients.
            </p>
          </div>

          {/* Benefits Grid */}
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.5rem", textAlign: "center" }}>
              Why Partner With Us?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {PRO_BENEFITS.map((b, i) => (
                <div key={i} className="card" style={{ background: "white", padding: "1.5rem", borderRadius: 20, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{b.icon}</div>
                  <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem", marginBottom: 4 }}>{b.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.825rem", lineHeight: 1.5 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div style={{ background: "white", borderRadius: 24, padding: "2.5rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", maxWidth: 720, margin: "0 auto" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.5rem" }}>Application Submitted!</h2>
                <p style={{ color: "#64748b", fontSize: "0.95rem", maxWidth: 420, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
                  Thank you for registering. Our onboarding team will call you within 24 hours to verify your details and get you started.
                </p>
                <Link href="/" style={{ textDecoration: "none", background: "linear-gradient(135deg, #e11d48, #db2777)", color: "white", fontWeight: 800, padding: "0.75rem 2rem", borderRadius: 99, display: "inline-block" }}>
                  Return to Homepage
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.5rem", textAlign: "center" }}>
                  Become a Professional
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.875rem", textAlign: "center", marginBottom: "2rem" }}>
                  Fill in your details below to start receiving customer bookings.
                </p>

                {/* Pro Type Selection */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.875rem", display: "block", marginBottom: "0.75rem" }}>
                    Select Professional Category
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                    {PRO_TYPES.map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        style={{
                          padding: "0.75rem 0.5rem",
                          borderRadius: 12,
                          border: selectedType === t.id ? "2px solid #e11d48" : "1px solid #e2e8f0",
                          background: selectedType === t.id ? "#fce7f3" : "#f8fafc",
                          color: selectedType === t.id ? "#9d174d" : "#0f172a",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "1.25rem", marginBottom: 2 }}>{t.icon}</div>
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label style={{ fontWeight: 700, color: "#475569", fontSize: "0.825rem", display: "block", marginBottom: 4 }}>Full Name</label>
                    <input
                      required
                      placeholder="e.g. Priya Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: 12, border: "2px solid #e2e8f0", outline: "none", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, color: "#475569", fontSize: "0.825rem", display: "block", marginBottom: 4 }}>Phone Number</label>
                    <input
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: 12, border: "2px solid #e2e8f0", outline: "none", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label style={{ fontWeight: 700, color: "#475569", fontSize: "0.825rem", display: "block", marginBottom: 4 }}>City / Area</label>
                    <input
                      required
                      placeholder="e.g. Mumbai, Bandra"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: 12, border: "2px solid #e2e8f0", outline: "none", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, color: "#475569", fontSize: "0.825rem", display: "block", marginBottom: 4 }}>Years of Experience</label>
                    <select
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: 12, border: "2px solid #e2e8f0", outline: "none", fontSize: "0.9rem", background: "white" }}
                    >
                      <option>1-2 years</option>
                      <option>3-5 years</option>
                      <option>5-10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ fontWeight: 700, color: "#475569", fontSize: "0.825rem", display: "block", marginBottom: 4 }}>Services You Offer</label>
                  <input
                    placeholder="e.g. Bridal Makeup, Facials, Hair Styling"
                    value={form.services}
                    onChange={(e) => setForm({ ...form, services: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: 12, border: "2px solid #e2e8f0", outline: "none", fontSize: "0.9rem" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: 14,
                    border: "none",
                    background: "linear-gradient(135deg, #e11d48, #db2777)",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(225,29,72,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Sparkles size={18} /> Submit Registration
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
