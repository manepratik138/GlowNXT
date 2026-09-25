"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, CheckCircle, ArrowRight, Shield, Award, Zap } from "lucide-react";
import { HOW_IT_WORKS, TRUST_POINTS } from "@/lib/data";

export default function HowItWorksPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ display: "inline-block", background: "#fce7f3", color: "#9d174d", padding: "0.25rem 0.875rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, marginBottom: "1rem" }}>
              🚀 SIMPLE & TRANSPARENT
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: "#0f172a", marginBottom: "1rem" }}>
              How GlowNXT Works
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.0625rem", maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
              Getting 5-star salon treatments in the comfort of your living room is as simple as 1-2-3.
            </p>
          </div>

          {/* Steps Detail */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", marginBottom: "5rem" }}>
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.step} style={{ background: "white", borderRadius: 24, padding: "2.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg, #e11d48, #db2777)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.25rem", fontWeight: 900, flexShrink: 0 }}>
                  {step.icon}
                </div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ color: "#e11d48", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Step {step.step}</div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.5rem" }}>{step.title}</h3>
                  <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: "0.95rem" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Instant 30 min feature */}
          <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", borderRadius: 24, padding: "3rem 2rem", color: "white", textAlign: "center", marginBottom: "4rem" }}>
            <Zap size={40} color="#fda4af" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.75rem" }}>Need Salon Immediately?</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500, margin: "0 auto 2rem" }}>
              Our "Salon in 30 Minutes" feature dispatches nearby available professionals directly to your door.
            </p>
            <Link href="/book/p1" style={{ textDecoration: "none", background: "linear-gradient(135deg, #e11d48, #db2777)", color: "white", fontWeight: 800, fontSize: "1rem", padding: "0.875rem 2rem", borderRadius: 99, display: "inline-block" }}>
              Book Immediate Service
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
