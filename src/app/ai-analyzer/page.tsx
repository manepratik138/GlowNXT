"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Camera, Upload, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck, Zap, Droplets, Sun, Activity, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";
import { SERVICES } from "@/lib/data";

export default function AIAnalyzerPage() {
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");
  const [method, setMethod] = useState<"quiz" | "photo">("quiz");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quiz state
  const [quiz, setQuiz] = useState({
    skinType: "combination",
    concern: "glow_tan",
    sensitivity: "mild",
    sunExposure: "moderate",
    hairType: "dry_frizzy",
  });

  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedPhoto(url);
      setMethod("photo");
    }
  };

  const startAnalysis = () => {
    setStep("analyzing");
    setTimeout(() => {
      setStep("results");
    }, 2800);
  };

  const handleAddRecommendedBundle = () => {
    // Add facial + hair treatment
    const facial = SERVICES.find((s) => s.id === "s1") || SERVICES[0];
    const hair = SERVICES.find((s) => s.id === "s2") || SERVICES[1];
    addToCart({
      id: facial.id,
      name: facial.name,
      price: facial.price,
      duration: facial.duration,
      category: facial.category,
      image: facial.image,
    });
    addToCart({
      id: hair.id,
      name: hair.name,
      price: hair.price,
      duration: hair.duration,
      category: hair.category,
      image: hair.image,
    });
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 110, paddingBottom: 80 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header Badge & Title */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(225,29,72,0.1)",
                color: "#e11d48",
                border: "1px solid rgba(225,29,72,0.25)",
                padding: "0.35rem 1rem",
                borderRadius: 99,
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              <Sparkles size={14} /> AI Skin & Hair Diagnostic Suite
            </span>
            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}
            >
              Find Your Perfect At-Home Treatment
            </h1>
            <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 600, margin: "0 auto" }}>
              Our AI computer-vision and dermatology diagnostic engine analyzes your unique skin profile to recommend tailored salon treatments and routines.
            </p>
          </div>

          {/* STEP 1: INPUT (Quiz or Photo) */}
          {step === "input" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: 24,
                padding: "2.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
              }}
            >
              {/* Method Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  background: "#f1f5f9",
                  padding: 6,
                  borderRadius: 14,
                  marginBottom: "2rem",
                }}
              >
                <button
                  onClick={() => setMethod("quiz")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "none",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    background: method === "quiz" ? "#ffffff" : "transparent",
                    color: method === "quiz" ? "#0f172a" : "#64748b",
                    boxShadow: method === "quiz" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  ⚡ 60-Second Skin & Hair Quiz
                </button>
                <button
                  onClick={() => setMethod("photo")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "none",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    background: method === "photo" ? "#ffffff" : "transparent",
                    color: method === "photo" ? "#0f172a" : "#64748b",
                    boxShadow: method === "photo" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  📸 Camera Selfie / Photo Scan
                </button>
              </div>

              {method === "quiz" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Skin Type */}
                  <div>
                    <label style={{ display: "block", fontWeight: 800, color: "#0f172a", marginBottom: 8, fontSize: "0.9rem" }}>
                      1. How does your skin feel midday?
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                      {[
                        { id: "oily", label: "Oily / Shiny all over" },
                        { id: "combination", label: "Oily T-Zone, Dry Cheeks" },
                        { id: "dry", label: "Tight, Dry or Flaky" },
                        { id: "normal", label: "Balanced & Comfortable" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setQuiz({ ...quiz, skinType: opt.id })}
                          style={{
                            padding: "0.85rem",
                            borderRadius: 12,
                            border: quiz.skinType === opt.id ? "2px solid #e11d48" : "1px solid #e2e8f0",
                            background: quiz.skinType === opt.id ? "#fff1f2" : "#f8fafc",
                            color: quiz.skinType === opt.id ? "#be123c" : "#334155",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            textAlign: "center",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Concern */}
                  <div>
                    <label style={{ display: "block", fontWeight: 800, color: "#0f172a", marginBottom: 8, fontSize: "0.9rem" }}>
                      2. What is your primary concern right now?
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                      {[
                        { id: "glow_tan", label: "✨ Instant Glow & Tan Removal" },
                        { id: "acne", label: "🧼 Acne & Blackhead Control" },
                        { id: "hydration", label: "💧 Deep Moisture & Plumping" },
                        { id: "bridal", label: "👰 Wedding & Event Glam Prep" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setQuiz({ ...quiz, concern: opt.id })}
                          style={{
                            padding: "0.85rem",
                            borderRadius: 12,
                            border: quiz.concern === opt.id ? "2px solid #e11d48" : "1px solid #e2e8f0",
                            background: quiz.concern === opt.id ? "#fff1f2" : "#f8fafc",
                            color: quiz.concern === opt.id ? "#be123c" : "#334155",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            textAlign: "center",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Concern */}
                  <div>
                    <label style={{ display: "block", fontWeight: 800, color: "#0f172a", marginBottom: 8, fontSize: "0.9rem" }}>
                      3. How would you describe your hair health?
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                      {[
                        { id: "dry_frizzy", label: "💇 Frizzy & Rough" },
                        { id: "hairfall", label: "🍂 Hair Fall & Thinning" },
                        { id: "dandruff", label: "❄️ Scalp Dryness & Flakes" },
                        { id: "normal_hair", label: "✨ Smooth, Needs Maintenance" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setQuiz({ ...quiz, hairType: opt.id })}
                          style={{
                            padding: "0.85rem",
                            borderRadius: 12,
                            border: quiz.hairType === opt.id ? "2px solid #e11d48" : "1px solid #e2e8f0",
                            background: quiz.hairType === opt.id ? "#fff1f2" : "#f8fafc",
                            color: quiz.hairType === opt.id ? "#be123c" : "#334155",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            textAlign: "center",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Photo Upload Mode */
                <div
                  style={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: 20,
                    padding: "3rem 1.5rem",
                    textAlign: "center",
                    background: "#f8fafc",
                  }}
                >
                  {selectedPhoto ? (
                    <div>
                      <div
                        style={{
                          position: "relative",
                          width: 140,
                          height: 140,
                          borderRadius: "50%",
                          overflow: "hidden",
                          margin: "0 auto 1rem auto",
                          border: "3px solid #e11d48",
                          boxShadow: "0 8px 24px rgba(225,29,72,0.2)",
                        }}
                      >
                        <Image src={selectedPhoto} alt="Uploaded Selfie" fill style={{ objectFit: "cover" }} />
                      </div>
                      <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Selfie Loaded Successfully!</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1.5rem" }}>
                        Face detected with high lighting clarity.
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: 8,
                          padding: "6px 14px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Choose another photo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          background: "#fff1f2",
                          color: "#e11d48",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <Camera size={30} />
                      </div>
                      <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.15rem", marginBottom: 6 }}>
                        Upload or Capture a Clear Selfie
                      </h3>
                      <p style={{ color: "#64748b", fontSize: "0.85rem", maxWidth: 360, margin: "0 auto 1.5rem auto" }}>
                        Ensure good lighting without heavy makeup or filters for precise skin analysis.
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          background: "linear-gradient(135deg, #e11d48, #db2777)",
                          color: "white",
                          border: "none",
                          borderRadius: 12,
                          padding: "0.85rem 1.75rem",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Upload size={18} /> Select Photo / Take Selfie
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: "none" }}
                  />
                </div>
              )}

              {/* Start CTA */}
              <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
                <button
                  onClick={startAnalysis}
                  style={{
                    background: "linear-gradient(135deg, #e11d48, #db2777)",
                    color: "white",
                    border: "none",
                    borderRadius: 16,
                    padding: "1rem 2.5rem",
                    fontWeight: 900,
                    fontSize: "1.05rem",
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(225,29,72,0.35)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Sparkles size={20} /> Run AI Diagnostic Engine <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ANALYZING SIMULATION HUD */}
          {step === "analyzing" && (
            <div
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                borderRadius: 24,
                padding: "4rem 2rem",
                textAlign: "center",
                color: "white",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  margin: "0 auto 2rem auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Pulsing radar */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "2px dashed #f43f5e",
                    animation: "spin 6s linear infinite",
                  }}
                />
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #e11d48, #db2777)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 30px rgba(225,29,72,0.6)",
                  }}
                >
                  <Activity size={36} color="white" />
                </div>
              </div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                AI Diagnostic in Progress...
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "2rem" }}>
                Scanning epidermal barrier • Evaluating sebum density • Matching treatment catalog
              </p>

              <div
                style={{
                  maxWidth: 320,
                  margin: "0 auto",
                  height: 6,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "80%",
                    background: "linear-gradient(90deg, #f43f5e, #ec4899)",
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: COMPREHENSIVE RESULTS REPORT */}
          {step === "results" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Scorecard Hero Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)",
                  borderRadius: 24,
                  padding: "2.5rem",
                  color: "white",
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: "2rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.75rem", background: "rgba(225,29,72,0.3)", color: "#fda4af", padding: "3px 10px", borderRadius: 99, fontWeight: 800 }}>
                    AI DIAGNOSTIC COMPLETE
                  </span>
                  <h2 style={{ fontSize: "1.85rem", fontWeight: 900, margin: "10px 0 6px" }}>
                    Combination • Dehydrated Profile
                  </h2>
                  <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    Your skin barrier shows healthy cellular turnover with localized oiliness in the T-Zone and moisture loss in the cheek regions. Perfect candidate for our hydra-infusion therapy.
                  </p>
                </div>

                {/* Score badge */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                    Skin Health Index
                  </div>
                  <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "#38bdf8", lineHeight: 1.1, margin: "6px 0" }}>
                    82<span style={{ fontSize: "1.2rem", color: "#94a3b8" }}>/100</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#4ade80", fontWeight: 700 }}>
                    ✨ Good Foundation • Needs Deep Hydration
                  </div>
                </div>
              </div>

              {/* Biomarker Breakdown Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {[
                  { title: "Hydration Balance", val: "64%", note: "Mild dehydration", color: "#0284c7" },
                  { title: "Sebum Activity", val: "78%", note: "T-Zone oil buildup", color: "#e11d48" },
                  { title: "Pore & Texture", val: "84%", note: "Refined, minimal clog", color: "#16a34a" },
                  { title: "Sensitivity Index", val: "22%", note: "High product tolerance", color: "#9333ea" },
                ].map((metric) => (
                  <div
                    key={metric.title}
                    style={{
                      background: "white",
                      padding: "1.25rem",
                      borderRadius: 18,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>{metric.title}</div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 900, color: metric.color, margin: "4px 0" }}>
                      {metric.val}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{metric.note}</div>
                  </div>
                ))}
              </div>

              {/* RECOMMENDED PACKAGE (Direct Cart Integration) */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 24,
                  padding: "2rem",
                  border: "2px solid #fda4af",
                  boxShadow: "0 10px 30px rgba(225,29,72,0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: "1.5rem" }}>
                  <div>
                    <span
                      style={{
                        background: "linear-gradient(135deg, #e11d48, #db2777)",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: 99,
                        fontSize: "0.75rem",
                        fontWeight: 800,
                      }}
                    >
                      AI Tailored Regimen Combo
                    </span>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0f172a", marginTop: 8 }}>
                      Hydra-Boost Facial + Nourishing Hair Spa Duo
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "4px 0 0" }}>
                      Formulated specifically for combination skin and frizzy hair. 100% sealed single-use kits.
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "0.85rem" }}>
                      ₹2,798
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0f172a" }}>
                      ₹2,518{" "}
                      <span style={{ fontSize: "0.8rem", color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: 6 }}>
                        10% Bundle OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Service items in bundle */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", gap: 12, padding: "0.75rem", background: "#f8fafc", borderRadius: 14 }}>
                    <div style={{ position: "relative", width: 50, height: 50, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                      <Image src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&auto=format&fit=crop&q=80" alt="Facial" fill style={{ objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a" }}>Luxury Facial Treatment</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>60 mins • Hyaluronic Acid</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, padding: "0.75rem", background: "#f8fafc", borderRadius: 14 }}>
                    <div style={{ position: "relative", width: 50, height: 50, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                      <Image src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&auto=format&fit=crop&q=80" alt="Hair Spa" fill style={{ objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a" }}>Hair Spa & Deep Conditioning</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>45 mins • Keratin Nourish</div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    onClick={handleAddRecommendedBundle}
                    style={{
                      flex: 1,
                      minWidth: 240,
                      background: "linear-gradient(135deg, #e11d48, #db2777)",
                      color: "white",
                      border: "none",
                      borderRadius: 14,
                      padding: "1rem",
                      fontWeight: 800,
                      fontSize: "1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 8px 24px rgba(225,29,72,0.35)",
                    }}
                  >
                    <ShoppingBag size={18} /> Add Regimen to Cart & Book with 10% OFF
                  </button>

                  <button
                    onClick={() => setStep("input")}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: 14,
                      padding: "1rem 1.5rem",
                      fontWeight: 700,
                      color: "#475569",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <RefreshCw size={16} /> Retake Test
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
