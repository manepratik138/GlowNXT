"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin, Globe, Share2, MessageCircle, Play } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer style={{ background: "#0f172a", color: "white" }}>
      {/* Newsletter strip */}
      <div style={{ background: "linear-gradient(135deg, #e11d48, #db2777)", padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.25rem", color: "white", marginBottom: 4 }}>Get Exclusive Beauty Deals</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem" }}>Subscribe & get ₹200 off your first booking + weekly offers</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ padding: "0.75rem 1.25rem", borderRadius: 12, border: "none", outline: "none", fontSize: "0.9rem", minWidth: 260, fontFamily: "inherit" }}
            />
            <button style={{ background: "white", color: "#e11d48", fontWeight: 800, fontSize: "0.9rem", padding: "0.75rem 1.5rem", borderRadius: 12, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>Subscribe</button>
          </div>
        </div>
      </div>
      {/* Main footer */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 1.5rem 3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #e11d48, #db2777)", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={20} color="white" /></div>
              <div><div style={{ fontWeight: 900, fontSize: "1.25rem" }}>Glow<span style={{ color: "#e11d48" }}>NXT</span></div><div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#e11d48", textTransform: "uppercase" }}>Salon &amp; Spa</div></div>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>India's premier on-demand salon & beauty platform with 2,500+ verified professionals across 35+ cities.</p>
            <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
              {[Globe, Share2, MessageCircle, Play].map((Icon, i) => (
                <button key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color="#94a3b8" />
                </button>
              ))}
            </div>
          </div>
          {/* Services */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.8rem", color: "white", marginBottom: "1.25rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Services</h4>
            {[
              { label: "Facial & Skincare", href: "/services?category=facial" },
              { label: "Bridal Packages", href: "/wedding" },
              { label: "Hair Styling", href: "/services?category=hair" },
              { label: "Body Massage", href: "/services?category=massage" },
              { label: "Nail Art", href: "/services?category=nails" },
              { label: "Mehendi Art", href: "/mehendi" },
              { label: "Senior Care", href: "/services?category=elder" },
              { label: "Kids Grooming", href: "/services?category=kids" },
            ].map((s) => (<Link key={s.label} href={s.href} style={{ display: "block", color: "#64748b", fontSize: "0.825rem", textDecoration: "none", marginBottom: "0.6rem" }}>{s.label}</Link>))}
          </div>
          {/* Company */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.8rem", color: "white", marginBottom: "1.25rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Company</h4>
            {[
              { label: "About Us", href: "/about" },
              { label: "Professionals", href: "/professionals" },
              { label: "Become a Pro", href: "/become-a-pro" },
              { label: "Careers", href: "/careers" },
              { label: "Blog", href: "/blog" },
            ].map((s) => (<Link key={s.label} href={s.href} style={{ display: "block", color: "#64748b", fontSize: "0.825rem", textDecoration: "none", marginBottom: "0.6rem" }}>{s.label}</Link>))}
          </div>
          {/* Support */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.8rem", color: "white", marginBottom: "1.25rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Support</h4>
            {[
              { label: "Help Center", href: "#" },
              { label: "FAQ", href: "#" },
              { label: "Privacy Policy", href: "#" },
              { label: "Terms & Conditions", href: "#" },
              { label: "Refund Policy", href: "#" },
            ].map((s) => (<Link key={s.label} href={s.href} style={{ display: "block", color: "#64748b", fontSize: "0.825rem", textDecoration: "none", marginBottom: "0.6rem" }}>{s.label}</Link>))}
          </div>
          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.8rem", color: "white", marginBottom: "1.25rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", fontSize: "0.825rem" }}><Phone size={14} color="#e11d48" /> +91 98765 43210</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", fontSize: "0.825rem" }}><Mail size={14} color="#e11d48" /> support@glownxt.com</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", fontSize: "0.825rem" }}><MapPin size={14} color="#e11d48" /> Mumbai, Maharashtra, India</div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ color: "#475569", fontSize: "0.8rem" }}>© {new Date().getFullYear()} GlowNXT Technologies Pvt. Ltd. All rights reserved.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Refund Policy", "FAQ"].map((l) => (<Link key={l} href="#" style={{ color: "#475569", fontSize: "0.78rem", textDecoration: "none" }}>{l}</Link>))}
          </div>
          <p style={{ color: "#374151", fontSize: "0.75rem" }}>🇮🇳 Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
