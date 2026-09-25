"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      id: "b1",
      title: "10 Essential Pre-Bridal Skincare Tips for 2026 Brides",
      desc: "Learn how to prepare your skin 3 months before your wedding for that natural bridal glow.",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
      category: "Bridal Skincare",
      readTime: "5 min read",
      date: "Aug 1, 2026",
    },
    {
      id: "b2",
      title: "Why Keratin Treatments Are Perfect Before Monsoons",
      desc: "Protect your hair from humidity and frizz with long-lasting keratin and cysteine treatments.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
      category: "Hair Care",
      readTime: "4 min read",
      date: "Jul 25, 2026",
    },
    {
      id: "b3",
      title: "The Ultimate Guide to At-Home Ayurvedic Spa & Wellness",
      desc: "Discover how traditional herbs and oils revitalize mind, body, and soul at home.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
      category: "Wellness & Spa",
      readTime: "6 min read",
      date: "Jul 18, 2026",
    },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ display: "inline-block", background: "#fce7f3", color: "#9d174d", padding: "0.25rem 0.875rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, marginBottom: "1rem" }}>
              📖 BEAUTY TIPS & GUIDES
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: "#0f172a", marginBottom: "0.75rem" }}>
              GlowNXT Journal
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.0625rem", maxWidth: 500, margin: "0 auto" }}>
              Expert advice, bridal trends, and home pampering secrets from top beauty therapists.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {posts.map((post) => (
              <div key={post.id} className="card" style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <div style={{ position: "relative", height: 200 }}>
                  <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(15,23,42,0.8)", color: "white", padding: "0.25rem 0.75rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 700, backdropFilter: "blur(4px)" }}>
                    {post.category}
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: 6 }}>{post.date} • {post.readTime}</div>
                  <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem", marginBottom: "0.5rem", lineHeight: 1.4 }}>{post.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>{post.desc}</p>
                  <Link href="#" style={{ textDecoration: "none", color: "#e11d48", fontWeight: 800, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 4 }}>
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
