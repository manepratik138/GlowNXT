"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, MapPin, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { MEHENDI_ARTISTS, MEHENDI_STYLES } from "@/lib/data";

export default function MehendiPage() {
  return (
    <div style={{ background: "#f0fdf4", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header Banner */}
          <div style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)", borderRadius: 24, padding: "3.5rem 2rem", color: "white", marginBottom: "3rem", textAlign: "center" }}>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#bbf7d0", padding: "0.25rem 0.875rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, marginBottom: "1rem" }}>
              🌿 MEHENDI ARTISTS MARKETPLACE
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", fontWeight: 900, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
              Top Mehendi Artists At Your Home
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: 540, margin: "0 auto 2rem", fontSize: "1rem" }}>
              Bridal, Arabic, Rajasthani, and Festival mehendi by certified master artists.
            </p>
          </div>

          {/* Styles Grid */}
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.5rem", textAlign: "center" }}>
              Popular Mehendi Styles
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.25rem" }}>
              {MEHENDI_STYLES.map((st, i) => (
                <div key={i} className="card" style={{ background: "white", padding: "1.5rem", borderRadius: 20, textAlign: "center", border: "1px solid #bbf7d0" }}>
                  <div style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>{st.icon}</div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", marginBottom: 4 }}>{st.name}</div>
                  <div style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.5rem" }}>{st.desc}</div>
                  <div style={{ color: "#16a34a", fontWeight: 900, fontSize: "0.9rem" }}>{st.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Artists */}
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.5rem", textAlign: "center" }}>
              Verified Mehendi Artists
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.75rem" }}>
              {MEHENDI_ARTISTS.map((artist) => (
                <div key={artist.id} className="card" style={{ background: "white", borderRadius: 24, padding: "1.75rem", border: "1px solid #bbf7d0" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: "1rem" }}>
                    <Image src={artist.avatar} alt={artist.name} width={64} height={64} style={{ borderRadius: "50%", border: "3px solid #bbf7d0", objectFit: "cover" }} />
                    <div>
                      <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>{artist.name}</h3>
                      <div style={{ color: "#16a34a", fontSize: "0.8rem", fontWeight: 700 }}>{artist.speciality}</div>
                      <div style={{ color: "#64748b", fontSize: "0.75rem" }}>📍 {artist.location} • {artist.experience} yrs exp</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    {artist.styles.map((s) => (
                      <span key={s} style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", fontSize: "0.725rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: 8 }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>{artist.rating}</strong> ({artist.reviewCount})
                      </div>
                      <div style={{ fontWeight: 900, color: "#16a34a", fontSize: "1.15rem" }}>₹{artist.price}+</div>
                    </div>
                    <Link
                      href={`/book/p1?service=Mehendi`}
                      style={{
                        textDecoration: "none",
                        background: "linear-gradient(135deg, #16a34a, #059669)",
                        color: "white",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        padding: "0.6rem 1.25rem",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      Book Artist <ArrowRight size={14} />
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
