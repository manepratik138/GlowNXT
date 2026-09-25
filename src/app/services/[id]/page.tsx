"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, Clock, CheckCircle, ArrowRight, Shield, Award, Sparkles, Heart, Plus, ShoppingBag } from "lucide-react";
import { SERVICES, PROFESSIONALS, REVIEWS } from "@/lib/data";
import { useCart } from "@/lib/CartContext";

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart, openCart } = useCart();
  const resolvedParams = use(params);
  const service = SERVICES.find((s) => s.id === resolvedParams.id) || SERVICES[0];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Breadcrumb */}
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            <Link href="/" style={{ textDecoration: "none", color: "#64748b" }}>Home</Link> /{" "}
            <Link href="/services" style={{ textDecoration: "none", color: "#64748b" }}>Services</Link> /{" "}
            <span style={{ color: "#e11d48", fontWeight: 700 }}>{service.name}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem" }} className="detail-layout">
            {/* Left Content */}
            <div>
              <div style={{ position: "relative", height: 360, borderRadius: 24, overflow: "hidden", marginBottom: "1.75rem", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                <Image src={service.image} alt={service.name} fill style={{ objectFit: "cover" }} priority />
                {service.badge && (
                  <div style={{ position: "absolute", top: 16, left: 16, background: "linear-gradient(135deg, #e11d48, #db2777)", color: "white", padding: "0.35rem 1rem", borderRadius: 99, fontWeight: 700, fontSize: "0.8rem" }}>
                    {service.badge}
                  </div>
                )}
              </div>

              <span style={{ color: "#e11d48", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {service.category}
              </span>
              <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#0f172a", marginBottom: "0.75rem", lineHeight: 1.2 }}>
                {service.name}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Star size={18} fill="#f59e0b" color="#f59e0b" />
                  <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{service.rating}</strong>
                  <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>({service.reviewCount} reviews)</span>
                </div>
                <div style={{ color: "#94a3b8" }}>•</div>
                <div style={{ color: "#64748b", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={16} /> {service.duration} mins treatment
                </div>
              </div>

              <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
                <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem", marginBottom: "0.75rem" }}>Service Description</h3>
                <p style={{ color: "#475569", lineHeight: 1.75, fontSize: "0.95rem" }}>{service.description}</p>
              </div>

              {/* What's Included */}
              <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
                <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem", marginBottom: "1rem" }}>What's Included</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {[
                    "100% Certified Professional",
                    "Single-use Sanitized Kit",
                    "Post-treatment Skin Guidance",
                    "No Travel Charges",
                    "Hypoallergenic Products",
                    "100% Satisfaction Guarantee",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", fontSize: "0.875rem" }}>
                      <CheckCircle size={16} color="#10b981" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Booking Card */}
            <div>
              <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", position: "sticky", top: 100 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8", display: "block" }}>Total Price</span>
                    <span style={{ fontSize: "2.25rem", fontWeight: 900, color: "#0f172a" }}>₹{service.price}</span>
                  </div>
                  <span style={{ background: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: "0.75rem", padding: "0.3rem 0.75rem", borderRadius: 99 }}>
                    Includes Taxes & Travel
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: 14, border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>Duration</div>
                    <div style={{ fontWeight: 800, color: "#0f172a" }}>{service.duration} Minutes</div>
                  </div>
                  <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: 14, border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>Location</div>
                    <div style={{ fontWeight: 800, color: "#0f172a" }}>Your Home (Doorstep)</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart({
                        id: service.id,
                        name: service.name,
                        category: service.category,
                        price: service.price,
                        duration: service.duration,
                        image: service.image,
                      });
                      openCart();
                    }}
                    style={{
                      background: "rgba(225,29,72,0.1)",
                      color: "#e11d48",
                      border: "2px solid rgba(225,29,72,0.3)",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      padding: "0.875rem",
                      borderRadius: 14,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Plus size={18} /> Add to Cart (Save with Combos)
                  </button>

                  <Link
                    href={`/book/p1?serviceId=${service.id}`}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "linear-gradient(135deg, #e11d48, #db2777)",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "1rem",
                      padding: "1rem",
                      borderRadius: 14,
                      boxShadow: "0 8px 24px rgba(225,29,72,0.35)",
                    }}
                  >
                    <Sparkles size={18} /> Book Direct Service Now
                  </Link>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#64748b", fontSize: "0.8rem" }}>
                  <Shield size={14} color="#10b981" /> 100% Refundable up to 2 hrs before
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .detail-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
