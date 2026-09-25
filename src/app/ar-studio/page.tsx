"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Camera, Palette, Scissors, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function ARStudioPage() {
  const { addToCart, openCart } = useCart();
  const [mode, setMode] = useState<"lipstick" | "hair" | "beard" | "mehendi">("lipstick");
  const [selectedColor, setSelectedColor] = useState("#e11d48");
  const [selectedStyle, setSelectedStyle] = useState("Royal Velvet");

  const colors = [
    { name: "Ruby Red", hex: "#e11d48" },
    { name: "Plum Glam", hex: "#7c3aed" },
    { name: "Nude Pink", hex: "#f43f5e" },
    { name: "Royal Gold / Chestnut", hex: "#d97706" },
    { name: "Raven Black", hex: "#1e293b" },
  ];

  const styles = {
    lipstick: ["Matte Velvet", "Glossy Shine", "Ombre Rose", "Satin Pearl"],
    hair: ["Caramel Balayage", "Burgundy Highlights", "Golden Blonde", "Espresso Gloss"],
    beard: ["Royal Ducktail", "French Beard Trim", "Full Stubble Detox", "Imperial Handlebar"],
    mehendi: ["Traditional Bridal Arabic", "Minimalist Floral Mandala", "Modern Rajasthani", "Geometric Wrist Band"],
  };

  return (
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span
              style={{
                background: "rgba(225,29,72,0.2)",
                color: "#fda4af",
                border: "1px solid rgba(225,29,72,0.4)",
                padding: "0.25rem 0.875rem",
                borderRadius: 99,
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              ✨ GlowNXT AR Studio v2.0
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginTop: "0.75rem", marginBottom: "0.5rem" }}>
              Virtual AR Try-On Studio (फिल्टर & लूक ट्राय-ऑन)
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: 600, margin: "0 auto" }}>
              Test lipstick shades, hair highlights, beard trims, and mehendi patterns on a canvas before your doorstep treatment!
            </p>
          </div>

          {/* AR Studio Controls & Canvas Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", alignItems: "start" }}>
            {/* Left Interactive AR Canvas */}
            <div
              style={{
                background: "rgba(30,41,59,0.7)",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: 400,
                  borderRadius: 20,
                  overflow: "hidden",
                  border: `3px solid ${selectedColor}`,
                  transition: "all 0.3s ease",
                }}
              >
                <Image
                  src={
                    mode === "beard"
                      ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                      : mode === "mehendi"
                      ? "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80"
                      : "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                  }
                  alt="AR Canvas Preview"
                  fill
                  style={{ objectFit: "cover" }}
                />

                {/* Simulated Color Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: selectedColor,
                    opacity: mode === "lipstick" ? 0.25 : mode === "hair" ? 0.2 : 0.15,
                    mixBlendMode: "overlay",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    background: "rgba(15,23,42,0.85)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 14,
                    padding: "0.75rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#fda4af", fontWeight: 700 }}>ACTIVE PREVIEW</div>
                    <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>{selectedStyle} ({mode.toUpperCase()})</div>
                  </div>
                  <span style={{ background: "#22c55e", color: "white", padding: "0.2rem 0.6rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 800 }}>
                    ⚡ AR Live Filter Active
                  </span>
                </div>
              </div>
            </div>

            {/* Right Controls Panel */}
            <div
              style={{
                background: "rgba(30,41,59,0.7)",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "2rem",
              }}
            >
              {/* Category Selector */}
              <label style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700, display: "block", marginBottom: 8 }}>
                1. SELECT TREATMENT TYPE
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.5rem" }}>
                {[
                  { id: "lipstick", label: "💄 Lipstick Shades" },
                  { id: "hair", label: "💇 Hair Color" },
                  { id: "beard", label: "🧔 Beard Trim (Men)" },
                  { id: "mehendi", label: "🌿 Mehendi Design" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMode(item.id as any);
                      setSelectedStyle(styles[item.id as keyof typeof styles][0]);
                    }}
                    style={{
                      background: mode === item.id ? "linear-gradient(135deg, #e11d48, #db2777)" : "rgba(255,255,255,0.06)",
                      color: "white",
                      border: mode === item.id ? "none" : "1px solid rgba(255,255,255,0.1)",
                      padding: "0.6rem",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Color Palette */}
              <label style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700, display: "block", marginBottom: 8 }}>
                2. SELECT COLOR PALETTE
              </label>
              <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.hex)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 99,
                      background: c.hex,
                      border: selectedColor === c.hex ? "3px solid white" : "none",
                      cursor: "pointer",
                      boxShadow: selectedColor === c.hex ? "0 0 12px " + c.hex : "none",
                    }}
                  />
                ))}
              </div>

              {/* Style Variations */}
              <label style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700, display: "block", marginBottom: 8 }}>
                3. CHOOSE STYLE VARIATIONS
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "2rem" }}>
                {styles[mode].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStyle(st)}
                    style={{
                      background: selectedStyle === st ? "rgba(225,29,72,0.15)" : "rgba(255,255,255,0.04)",
                      color: selectedStyle === st ? "#fda4af" : "#cbd5e1",
                      border: selectedStyle === st ? "1px solid #e11d48" : "1px solid rgba(255,255,255,0.08)",
                      padding: "0.6rem 1rem",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {st}
                    {selectedStyle === st && <Check size={16} color="#e11d48" />}
                  </button>
                ))}
              </div>

              {/* Book Action */}
              <button
                type="button"
                onClick={() => {
                  addToCart({
                    id: "ar_look_" + mode,
                    name: `Custom AR Look: ${selectedStyle}`,
                    category: mode === "beard" ? "Men's Grooming" : "Custom Styling",
                    price: 1299,
                    duration: 60,
                    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
                  });
                  openCart();
                }}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #e11d48, #db2777)",
                  color: "white",
                  border: "none",
                  padding: "1rem",
                  borderRadius: 14,
                  fontWeight: 900,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 8px 24px rgba(225,29,72,0.4)",
                }}
              >
                <Sparkles size={18} /> Book This AR Look (₹1,299)
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
