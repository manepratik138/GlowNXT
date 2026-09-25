"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Shield, Award, Users, CheckCircle } from "lucide-react";
import { STATS } from "@/lib/data";

export default function AboutPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ display: "inline-block", background: "#fce7f3", color: "#9d174d", padding: "0.25rem 0.875rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, marginBottom: "1rem" }}>
              ✨ OUR MISSION
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: "#0f172a", marginBottom: "1rem" }}>
              Redefining At-Home Beauty in India
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.0625rem", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              GlowNXT was founded to bring 5-star luxury salon & spa experiences directly to customers' homes, while empowering beauty professionals with flexible work and higher earnings.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: "white", padding: "2rem", borderRadius: 20, textAlign: "center", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#e11d48", marginBottom: 4 }}>{s.value}</div>
                <div style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
