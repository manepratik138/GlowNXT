"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Calendar, Users, CheckCircle, ShieldCheck, ArrowRight, Heart } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function BridalGroomPlannerPage() {
  const { addToCart, openCart } = useCart();
  const [eventCategory, setEventCategory] = useState<"bridal" | "groom">("bridal");
  const [guestCount, setGuestCount] = useState<number>(4);
  const [includeTrial, setIncludeTrial] = useState<boolean>(true);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Airbrush Makeup / Groom Styling",
    "Pre-Wedding Glow Facial",
    "Hair Styling & Setting",
  ]);

  const basePrice = eventCategory === "bridal" ? 9999 : 4999;
  const perGuestPrice = 1499;
  const trialPrice = includeTrial ? 1999 : 0;
  const totalPrice = basePrice + (guestCount - 1) * perGuestPrice + trialPrice;

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 50%, #831843 100%)",
              borderRadius: 24,
              padding: "3.5rem 2rem",
              color: "white",
              marginBottom: "2.5rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                background: "rgba(251,113,133,0.2)",
                color: "#fda4af",
                border: "1px solid rgba(251,113,133,0.4)",
                padding: "0.25rem 0.875rem",
                borderRadius: 99,
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "1rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "inline-block",
              }}
            >
              💍 Premium Wedding & Event Planner
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "0.75rem" }}>
              Bridal & Groom Event Package Calculator (लग्न बुकिंग प्लॅनर)
            </h1>
            <p style={{ color: "#e2e8f0", maxWidth: 640, margin: "0 auto", fontSize: "1rem" }}>
              Customized luxury beauty packages for Bride, Groom, Bridesmaids, Groomsmen & Family with guaranteed trial sessions.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem" }}>
            {/* Left Controls */}
            <div>
              {/* Category Selector */}
              <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
                  1. Choose Wedding Event Type
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => setEventCategory("bridal")}
                    style={{
                      padding: "1.25rem",
                      borderRadius: 16,
                      border: eventCategory === "bridal" ? "2px solid #e11d48" : "1px solid #cbd5e1",
                      background: eventCategory === "bridal" ? "#fff1f2" : "#f8fafc",
                      color: eventCategory === "bridal" ? "#e11d48" : "#475569",
                      fontWeight: 800,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>👰 Bride & Squad</div>
                    <div style={{ fontSize: "0.8rem" }}>Bridal Makeup, Mehendi & Facials</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventCategory("groom")}
                    style={{
                      padding: "1.25rem",
                      borderRadius: 16,
                      border: eventCategory === "groom" ? "2px solid #2563eb" : "1px solid #cbd5e1",
                      background: eventCategory === "groom" ? "#eff6ff" : "#f8fafc",
                      color: eventCategory === "groom" ? "#2563eb" : "#475569",
                      fontWeight: 800,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>🤵 Groom & Groomsmen</div>
                    <div style={{ fontSize: "0.8rem" }}>Groom Styling, Beard Spa & Charcoal Detox</div>
                  </button>
                </div>
              </div>

              {/* Guest Counter */}
              <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>2. Number of Guests / Family Members</h3>
                    <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Includes Bride/Groom + Bridesmaids / Family</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #cbd5e1", background: "white", fontSize: "1.2rem", fontWeight: 800, cursor: "pointer" }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a" }}>{guestCount} Persons</span>
                    <button
                      onClick={() => setGuestCount(guestCount + 1)}
                      style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #cbd5e1", background: "white", fontSize: "1.2rem", fontWeight: 800, cursor: "pointer" }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Included Services Selector */}
              <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
                  3. Select Treatment Suite
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {[
                    "Airbrush Makeup / Groom Styling",
                    "Pre-Wedding Glow Facial",
                    "Hair Styling & Setting",
                    "Bridal / Traditional Mehendi",
                    "Beard Spa & Charcoal Detox",
                    "Luxury Pedicure & Manicure",
                  ].map((srv) => (
                    <button
                      key={srv}
                      onClick={() => toggleService(srv)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: 12,
                        border: selectedServices.includes(srv) ? "2px solid #e11d48" : "1px solid #e2e8f0",
                        background: selectedServices.includes(srv) ? "#fff1f2" : "#f8fafc",
                        color: selectedServices.includes(srv) ? "#e11d48" : "#475569",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <CheckCircle size={16} color={selectedServices.includes(srv) ? "#e11d48" : "#cbd5e1"} /> {srv}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    id="trial"
                    checked={includeTrial}
                    onChange={(e) => setIncludeTrial(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#e11d48" }}
                  />
                  <label htmlFor="trial" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f172a", cursor: "pointer" }}>
                    Include Pre-Wedding Trial Session (+₹1,999)
                  </label>
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div>
              <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", position: "sticky", top: 100 }}>
                <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.75rem", borderRadius: 99, textTransform: "uppercase" }}>
                  ESTIMATED EVENT PACKAGE
                </span>
                <div style={{ margin: "1rem 0" }}>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>Total Package Price</span>
                  <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "#0f172a" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                  <span style={{ color: "#16a34a", fontSize: "0.8rem", fontWeight: 700, display: "block" }}>
                    🎉 Includes 20% Group Bundle Discount
                  </span>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: 8, fontSize: "0.85rem", color: "#475569" }}>
                  <div>👥 Persons: <strong>{guestCount} Guests</strong></div>
                  <div>✨ Category: <strong>{eventCategory === "bridal" ? "Bridal Suite" : "Groom Suite"}</strong></div>
                  <div>🧪 Trial Session: <strong>{includeTrial ? "Included ✅" : "Not Included"}</strong></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart({
                      id: `wedding_pack_${eventCategory}_${Date.now()}`,
                      name: `${eventCategory === "bridal" ? "Bridal" : "Groom"} Event Package (${guestCount} Guests)`,
                      category: "Wedding Packages",
                      price: totalPrice,
                      duration: 180,
                      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
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
                    boxShadow: "0 8px 24px rgba(225,29,72,0.35)",
                  }}
                >
                  <Sparkles size={18} /> Book Wedding Package Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
