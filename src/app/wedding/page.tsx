"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, CheckCircle, ArrowRight, Star, Heart, Calendar } from "lucide-react";
import { WEDDING_SERVICES, WEDDING_PACKAGES, PROFESSIONALS } from "@/lib/data";

export default function WeddingPage() {
  return (
    <div style={{ background: "#0c0720", color: "white", minHeight: "100vh" }}>
      <Header transparent />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", padding: "4rem 1rem", position: "relative" }}>
            <span style={{ display: "inline-block", background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)", padding: "0.3rem 1rem", borderRadius: 99, fontSize: "0.8rem", fontWeight: 800, marginBottom: "1.25rem", letterSpacing: "0.08em" }}>
              💍 LUXURY WEDDING BEAUTY EXPERIENCES
            </span>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem", letterSpacing: "-0.03em" }}>
              Your Dream Wedding Look,<br />
              <span style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b, #f43f5e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Crafted at Home.
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem", maxWidth: 620, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
              Complete wedding beauty management for Bride, Groom, Family & Guests. Airbrush makeup, saree draping, mehendi, and hair styling by top celebrity artists.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/book/p2?service=Bridal+Makeup" style={{ textDecoration: "none", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#0f172a", fontWeight: 900, fontSize: "1rem", padding: "1rem 2.5rem", borderRadius: 99, boxShadow: "0 8px 30px rgba(245,158,11,0.4)", display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={18} /> Book Bridal Artist Now
              </Link>
            </div>
          </div>

          {/* Categories Grid */}
          <div style={{ marginBottom: "5rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, textAlign: "center", marginBottom: "2rem", color: "#fbbf24" }}>
              Wedding Beauty Categories
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem" }}>
              {WEDDING_SERVICES.map((cat, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "1.75rem 1.25rem", textAlign: "center", backdropFilter: "blur(8px)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{cat.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: "0.375rem" }}>{cat.name}</div>
                  <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "0.875rem" }}>Starts {cat.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Packages */}
          <div style={{ marginBottom: "5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "2.25rem", fontWeight: 900, marginBottom: "0.5rem" }}>✨ Complete Wedding Packages</h2>
              <p style={{ color: "rgba(255,255,255,0.6)" }}>Save up to 30% with bundled bridal & wedding packages</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {WEDDING_PACKAGES.map((pkg) => (
                <div key={pkg.id} style={{ background: pkg.popular ? "linear-gradient(145deg, rgba(192,38,211,0.2), rgba(245,158,11,0.1))" : "rgba(255,255,255,0.05)", border: pkg.popular ? "2px solid #f59e0b" : "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: "2.25rem 1.75rem", position: "relative" }}>
                  {pkg.badge && (
                    <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#0f172a", fontWeight: 900, fontSize: "0.75rem", padding: "0.35rem 1.25rem", borderRadius: 99 }}>
                      {pkg.badge}
                    </div>
                  )}
                  <div style={{ fontSize: "1.375rem", fontWeight: 900, marginBottom: "0.5rem" }}>{pkg.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>⏱ {pkg.duration} Service</div>
                  <div style={{ marginBottom: "1.5rem" }}>
                    {pkg.services.map((svc) => (
                      <div key={svc} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", marginBottom: "0.6rem" }}>
                        <CheckCircle size={15} color="#fbbf24" /> {svc}
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", textDecoration: "line-through" }}>₹{pkg.originalPrice.toLocaleString()}</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fbbf24" }}>₹{pkg.price.toLocaleString()}</div>
                    </div>
                    <Link href={`/book/p2?package=${encodeURIComponent(pkg.name)}`} style={{ textDecoration: "none", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#0f172a", fontWeight: 800, fontSize: "0.875rem", padding: "0.75rem 1.5rem", borderRadius: 12 }}>
                      Book Package
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
