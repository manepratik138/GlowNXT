"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Star, CheckCircle, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { SERVICES } from "@/lib/data";

interface Transformation {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  clientName: string;
  location: string;
  rating: number;
  review: string;
  beforeImg: string;
  afterImg: string;
  price: number;
  duration: number;
}

const TRANSFORMATIONS: Transformation[] = [
  {
    id: "t1",
    serviceId: "s8",
    serviceName: "Royal Bridal Makeover & HD Glam",
    category: "Bridal Packages",
    clientName: "Pooja Deshmukh",
    location: "Pune, Maharashtra",
    rating: 5,
    review: "The bridal glow was out of this world! My skin felt so lightweight, and the makeup stayed completely fresh throughout the 10-hour ceremony.",
    beforeImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
    afterImg: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
    price: 4999,
    duration: 180,
  },
  {
    id: "t2",
    serviceId: "s1",
    serviceName: "De-Tan Radiance & Luxury Facial",
    category: "Facial & Skincare",
    clientName: "Sneha Kulkarni",
    location: "Mumbai",
    rating: 5,
    review: "Removed months of sun tan in a single 60-minute session. My face looks 2 shades brighter, and the professional was so gentle and hygienic.",
    beforeImg: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80",
    afterImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
    price: 1499,
    duration: 60,
  },
  {
    id: "t3",
    serviceId: "s2",
    serviceName: "Keratin Deep Smoothening Hair Spa",
    category: "Hair Styling",
    clientName: "Aditi Rao",
    location: "Bangalore",
    rating: 5,
    review: "My frizzy, uncontrollable curls became so manageable and shiny. Saved me a 4-hour salon visit by getting it right at home!",
    beforeImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    afterImg: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80",
    price: 1299,
    duration: 45,
  },
  {
    id: "t4",
    serviceId: "s3",
    serviceName: "Luxury Gel Extensions & Chrome Nail Art",
    category: "Nail Art",
    clientName: "Kavya Patel",
    location: "Hyderabad",
    rating: 5,
    review: "Salon-grade UV cured gel finish done in my living room. Zero chipping even after 3 weeks. Totally in love!",
    beforeImg: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80",
    afterImg: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80",
    price: 899,
    duration: 50,
  },
];

export default function TransformationsPage() {
  const [activeViews, setActiveViews] = useState<Record<string, "after" | "before">>({
    t1: "after",
    t2: "after",
    t3: "after",
    t4: "after",
  });

  const { addToCart, isItemInCart } = useCart();

  const toggleView = (id: string, view: "after" | "before") => {
    setActiveViews((prev) => ({ ...prev, [id]: view }));
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 110, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header Banner */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
              <Sparkles size={14} /> Real Verified Client Results
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
              Before & After Transformations
            </h1>
            <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 620, margin: "0 auto" }}>
              Explore real results from thousands of happy customers treated with single-use sterile kits by certified professionals right at their doorstep.
            </p>
          </div>

          {/* Transformation Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
            {TRANSFORMATIONS.map((item) => {
              const currentView = activeViews[item.id] || "after";
              const currentImg = currentView === "after" ? item.afterImg : item.beforeImg;

              return (
                <div
                  key={item.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 24,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image with Before/After Toggle */}
                  <div style={{ position: "relative", height: 280, width: "100%", background: "#0f172a" }}>
                    <Image src={currentImg} alt={item.serviceName} fill style={{ objectFit: "cover" }} />

                    {/* View Switcher Pills */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(15, 23, 42, 0.8)",
                        backdropFilter: "blur(8px)",
                        padding: 4,
                        borderRadius: 99,
                        display: "flex",
                        gap: 4,
                      }}
                    >
                      <button
                        onClick={() => toggleView(item.id, "before")}
                        style={{
                          background: currentView === "before" ? "#ffffff" : "transparent",
                          color: currentView === "before" ? "#0f172a" : "#cbd5e1",
                          border: "none",
                          padding: "4px 12px",
                          borderRadius: 99,
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        Before
                      </button>
                      <button
                        onClick={() => toggleView(item.id, "after")}
                        style={{
                          background: currentView === "after" ? "linear-gradient(135deg, #e11d48, #db2777)" : "transparent",
                          color: "white",
                          border: "none",
                          padding: "4px 14px",
                          borderRadius: 99,
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        ✨ After
                      </button>
                    </div>

                    {/* Category pill */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: "rgba(255,255,255,0.9)",
                        color: "#e11d48",
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.category}
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        • {item.clientName} ({item.location})
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                      {item.serviceName}
                    </h3>

                    <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.6, fontStyle: "italic", marginBottom: "1.25rem", flex: 1 }}>
                      &ldquo;{item.review}&rdquo;
                    </p>

                    {/* Price and Add to Cart */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "1rem",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Session Cost</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0f172a" }}>
                          ₹{item.price}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart({
                            id: item.serviceId,
                            name: item.serviceName,
                            price: item.price,
                            duration: item.duration,
                            category: item.category,
                            image: item.afterImg,
                          });
                        }}
                        style={{
                          background: isItemInCart(item.serviceId)
                            ? "#10b981"
                            : "linear-gradient(135deg, #e11d48, #db2777)",
                          color: "white",
                          border: "none",
                          borderRadius: 12,
                          padding: "0.6rem 1.1rem",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          boxShadow: "0 4px 14px rgba(225,29,72,0.25)",
                        }}
                      >
                        <ShoppingBag size={15} />
                        {isItemInCart(item.serviceId) ? "In Cart" : "Book This Service"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
