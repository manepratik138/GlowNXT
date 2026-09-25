"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Search, MapPin, Star, Clock, CheckCircle, ArrowRight,
  ChevronLeft, ChevronRight, Sparkles, Shield, Award,
  Phone, Mail, Globe, Share2, MessageCircle, Play,
  Heart, Menu, X, Zap, Plus, ShoppingBag,
  Calendar, Timer, Locate
} from "lucide-react";
import {
  CATEGORIES, SERVICES, PROFESSIONALS, REVIEWS,
  STATS, HOW_IT_WORKS, WEDDING_SERVICES, WEDDING_PACKAGES,
  MEHENDI_STYLES, MEHENDI_ARTISTS, ELDER_SERVICES, ELDER_TRUST_POINTS,
  KIDS_SERVICES, FESTIVAL_PACKAGES, GROUP_PACKAGES,
  PRO_BENEFITS, PRO_TYPES, TRUST_POINTS, QUICK_FILTERS
} from "@/lib/data";

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
        borderBottom: scrolled ? "1px solid rgba(226,232,240,0.8)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #e11d48, #db2777)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(225,29,72,0.4)",
            }}
          >
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <span
              style={{
                fontWeight: 900,
                fontSize: "1.3rem",
                color: scrolled ? "#0f172a" : "white",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Glow<span style={{ color: "#e11d48" }}>NXT</span>
            </span>
            <span
              style={{
                display: "block",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: scrolled ? "#e11d48" : "rgba(255,255,255,0.8)",
                textTransform: "uppercase",
              }}
            >
              Salon &amp; Spa
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden-mobile">
          {["Services", "Professionals", "How It Works", "Blog"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/ /g, "-")}`}
              style={{
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: scrolled ? "#475569" : "rgba(255,255,255,0.85)",
                padding: "0.5rem 1rem",
                borderRadius: 99,
                transition: "all 0.2s",
              }}
              className="nav-link"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/auth/login"
            style={{
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: scrolled ? "#0f172a" : "white",
              padding: "0.5rem 1.25rem",
              borderRadius: 99,
              border: `2px solid ${scrolled ? "#e2e8f0" : "rgba(255,255,255,0.4)"}`,
              transition: "all 0.2s",
            }}
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            style={{
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: 99,
              background: "linear-gradient(135deg, #e11d48, #db2777)",
              boxShadow: "0 4px 16px rgba(225,29,72,0.4)",
              transition: "all 0.2s",
            }}
          >
            Book Now
          </Link>
          {/* Mobile menu btn */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: scrolled ? "#0f172a" : "white",
              padding: 4,
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "white",
            borderTop: "1px solid #f1f5f9",
            padding: "1rem 1.5rem 1.5rem",
          }}
        >
          {["Services", "Professionals", "How It Works", "Blog"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem 0",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#0f172a",
                textDecoration: "none",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {item}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: "1rem" }}>
            <Link href="/auth/login" style={{ flex: 1, textAlign: "center", padding: "0.75rem", border: "2px solid #e2e8f0", borderRadius: 12, fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>Login</Link>
            <Link href="/auth/register" style={{ flex: 1, textAlign: "center", padding: "0.75rem", background: "linear-gradient(135deg,#e11d48,#db2777)", borderRadius: 12, fontWeight: 700, color: "white", textDecoration: "none" }}>Book Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────
function HeroSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const searchServices = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (location.trim()) params.set("city", location.trim());
    router.push(`/services${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=90"
          alt="Luxury beauty service at home"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,27,75,0.75) 40%, rgba(131,24,67,0.6) 100%)",
          }}
        />
      </div>

      {/* Floating badges */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "20%",
          right: "8%",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 16,
          padding: "0.875rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: "1.5rem" }}>⭐</div>
        <div>
          <div style={{ color: "white", fontWeight: 800, fontSize: "1.1rem" }}>4.9/5</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}>50K+ Reviews</div>
        </div>
      </div>

      <div
        className="animate-float delay-300"
        style={{
          position: "absolute",
          bottom: "28%",
          right: "6%",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 16,
          padding: "0.875rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: "1.5rem" }}>✅</div>
        <div>
          <div style={{ color: "white", fontWeight: 800, fontSize: "1.1rem" }}>2,500+</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}>Verified Pros</div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "7rem 1.5rem 4rem",
          width: "100%",
        }}
      >
        {/* Badge */}
        <div className="animate-fade-in-down" style={{ marginBottom: "1.5rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(225,29,72,0.2)",
              border: "1px solid rgba(225,29,72,0.4)",
              borderRadius: 99,
              padding: "0.375rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#fda4af",
              letterSpacing: "0.05em",
              backdropFilter: "blur(8px)",
            }}
          >
            <Zap size={14} /> India's #1 At-Home Beauty Platform
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 700,
            marginBottom: "1.25rem",
          }}
        >
          Luxury Beauty,
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #f9a8d4, #fda4af, #fb923c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Delivered Home.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="animate-fade-in-up delay-200"
          style={{
            fontSize: "1.125rem",
            color: "rgba(255,255,255,0.75)",
            maxWidth: 560,
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          Book from 200+ premium beauty services with verified professionals.
          Your home transforms into a 5-star salon experience.
        </p>

        {/* Search Box */}
        <form
          onSubmit={(e) => { e.preventDefault(); searchServices(); }}
          className="animate-scale-in delay-300"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 20,
            padding: "0.75rem",
            maxWidth: 680,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Service search */}
          <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10, padding: "0 0.75rem" }}>
            <Search size={20} color="#e11d48" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search service (e.g. Facial, Massage...)"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "0.9375rem",
                color: "#0f172a",
                background: "transparent",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ width: 1, height: 36, background: "#e2e8f0" }} />
          {/* Location */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 0.75rem" }}>
            <MapPin size={18} color="#94a3b8" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your city"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "0.9375rem",
                color: "#0f172a",
                background: "transparent",
                fontFamily: "inherit",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #e11d48, #db2777)",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "0.875rem 1.5rem",
              fontWeight: 700,
              fontSize: "0.9375rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(225,29,72,0.4)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <Search size={16} /> Search
          </button>
        </form>

        {/* Quick tags */}
        <div className="animate-fade-in-up delay-500" style={{ marginTop: "1.5rem", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", alignSelf: "center" }}>Popular:</span>
          {["Bridal Makeup", "Facial", "Massage", "Nail Art", "Keratin"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => { setSearchTerm(tag); router.push(`/services?q=${encodeURIComponent(tag)}`); }}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 99,
                padding: "0.375rem 0.875rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div
          className="animate-fade-in-up delay-700"
          style={{
            marginTop: "3.5rem",
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: "1.75rem" }}>{stat.icon}</div>
              <div>
                <div style={{ color: "white", fontWeight: 900, fontSize: "1.375rem", lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1 }}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 20C1200 80 960 0 720 40C480 80 240 0 0 20L0 80Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}

// ─── Category Grid ────────────────────────────────────────────────────────
function CategorySection() {
  return (
    <section style={{ padding: "5rem 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge badge-brand" style={{ marginBottom: "0.75rem" }}>
            ✨ Browse by Category
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            What Would You Like Today?
          </h2>
          <p style={{ color: "#64748b", fontSize: "1.0625rem", maxWidth: 500, margin: "0 auto" }}>
            Choose from our wide range of premium beauty services, all delivered to your doorstep.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/services?category=${cat.id}`}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${i * 80}ms`,
                textDecoration: "none",
                display: "block",
              }}
            >
              <div
                className="card"
                style={{
                  padding: "1.75rem 1.5rem",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Gradient blob */}
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`,
                    transition: "all 0.3s",
                  }}
                />
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${cat.color}18, ${cat.color}08)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  {cat.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 800,
                    color: "#0f172a",
                    fontSize: "1rem",
                    marginBottom: "0.375rem",
                  }}
                >
                  {cat.name}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>
                  {cat.count} services
                </p>
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: cat.color,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Professionals ───────────────────────────────────────────────
function ProfessionalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section style={{ padding: "5rem 0", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: "0.75rem" }}>⭐ Top Professionals</span>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Meet Our Expert Beauties
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem", marginTop: "0.5rem" }}>
              Handpicked, verified & top-rated professionals near you.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => scroll("left")}
              style={{
                width: 44, height: 44, borderRadius: "50%", border: "2px solid #e2e8f0",
                background: "white", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}
            >
              <ChevronLeft size={20} color="#475569" />
            </button>
            <button
              onClick={() => scroll("right")}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg, #e11d48, #db2777)",
                border: "none", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <ChevronRight size={20} color="white" />
            </button>
          </div>
        </div>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "1.25rem",
            overflowX: "auto",
            paddingBottom: "1rem",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {PROFESSIONALS.map((pro) => (
            <div
              key={pro.id}
              className="card"
              style={{
                minWidth: 280,
                maxWidth: 280,
                flex: "0 0 auto",
                padding: "1.5rem",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ position: "relative" }}>
                  <Image
                    src={pro.avatar}
                    alt={pro.name}
                    width={64}
                    height={64}
                    style={{ borderRadius: "50%", objectFit: "cover", border: "3px solid #fce7f3" }}
                  />
                  {pro.available && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "#10b981",
                        border: "2px solid white",
                      }}
                    />
                  )}
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <Heart size={20} color="#e2e8f0" />
                </button>
              </div>

              <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem", marginBottom: 2 }}>{pro.name}</h3>
              <p style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.75rem" }}>{pro.title}</p>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
                <Star size={15} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>{pro.rating}</span>
                <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>({pro.reviewCount})</span>
                {pro.badge && (
                  <span className="badge badge-brand" style={{ marginLeft: "auto" }}>{pro.badge}</span>
                )}
              </div>

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.8rem" }}>
                  <MapPin size={13} /> {pro.location}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.8rem" }}>
                  <Award size={13} /> {pro.experience} yrs · {pro.completedJobs.toLocaleString()} jobs
                </div>
              </div>

              {/* Services */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: "1.25rem" }}>
                {pro.services.slice(0, 3).map((s) => (
                  <span key={s} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "0.2rem 0.6rem", fontSize: "0.7rem", fontWeight: 600, color: "#475569" }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Starting at</span>
                  <div style={{ fontWeight: 900, color: "#e11d48", fontSize: "1.1rem" }}>₹{pro.price}</div>
                </div>
                <Link
                  href={`/professionals/${pro.id}`}
                  style={{
                    textDecoration: "none",
                    background: "linear-gradient(135deg, #e11d48, #db2777)",
                    color: "white",
                    padding: "0.5rem 1.125rem",
                    borderRadius: 10,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link
            href="/professionals"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "2px solid #e11d48",
              color: "#e11d48",
              fontWeight: 700,
              fontSize: "0.9375rem",
              padding: "0.75rem 2rem",
              borderRadius: 99,
              transition: "all 0.2s",
            }}
          >
            View All Professionals <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Popular Services ─────────────────────────────────────────────────────
function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart, isItemInCart } = useCart();
  const cats = ["All", ...new Set(SERVICES.map((s) => s.category))];

  const filtered = activeCategory === "All" ? SERVICES : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <section style={{ padding: "5rem 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="badge badge-green" style={{ marginBottom: "0.75rem" }}>💅 Popular Services</span>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Trending Right Now
          </h2>
          <p style={{ color: "#64748b", fontSize: "1.0625rem", maxWidth: 480, margin: "0 auto" }}>
            From everyday grooming to special occasion glamour — we've got it all.
          </p>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {cats.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: 99,
                border: "2px solid",
                borderColor: activeCategory === cat ? "#e11d48" : "#e2e8f0",
                background: activeCategory === cat ? "linear-gradient(135deg, #e11d48, #db2777)" : "white",
                color: activeCategory === cat ? "white" : "#475569",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filtered.map((service, i) => (
            <div
              key={service.id}
              className="card animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                />
                {service.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "linear-gradient(135deg, #e11d48, #db2777)",
                      color: "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: 99,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {service.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "1.25rem" }}>
                <p style={{ color: "#e11d48", fontSize: "0.75rem", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {service.category}
                </p>
                <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.0625rem", marginBottom: "0.5rem", lineHeight: 1.3 }}>
                  {service.name}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                  {service.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontWeight: 800, fontSize: "0.875rem", color: "#0f172a" }}>{service.rating}</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>({service.reviewCount})</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b", fontSize: "0.8rem" }}>
                    <Clock size={13} /> {service.duration} min
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}>Price</span>
                    <span style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.25rem" }}>₹{service.price}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => addToCart({ id: service.id, name: service.name, price: service.price, duration: service.duration, category: service.category, image: service.image })}
                      style={{
                        background: isItemInCart(service.id) ? "#10b981" : "#f1f5f9",
                        color: isItemInCart(service.id) ? "white" : "#0f172a",
                        border: "none",
                        borderRadius: 10,
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {isItemInCart(service.id) ? "✓ Added" : "+ Cart"}
                    </button>
                    <Link
                      href={`/services/${service.id}`}
                      style={{
                        textDecoration: "none",
                        background: "linear-gradient(135deg, #e11d48, #db2777)",
                        color: "white",
                        padding: "0.5rem 0.85rem",
                        borderRadius: 10,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link
            href="/services"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, #e11d48, #db2777)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9375rem",
              padding: "0.875rem 2.5rem",
              borderRadius: 99,
              boxShadow: "0 8px 24px rgba(225,29,72,0.35)",
            }}
          >
            View All Services <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section
      style={{
        padding: "5rem 0",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(219,39,119,0.15), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="badge" style={{ background: "rgba(225,29,72,0.2)", color: "#fda4af", border: "1px solid rgba(225,29,72,0.3)", marginBottom: "0.75rem" }}>
            🚀 Simple Process
          </span>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            How It Works
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.0625rem", maxWidth: 480, margin: "0 auto" }}>
            Book your dream beauty experience in just 3 simple steps.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.step}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${i * 150}ms`,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 24,
                padding: "2.5rem 2rem",
                textAlign: "center",
                backdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Step number watermark */}
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  right: 20,
                  fontSize: "6rem",
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.04)",
                  lineHeight: 1,
                  pointerEvents: "none",
                }}
              >
                {step.step}
              </div>

              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`,
                  border: "2px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.25rem",
                  margin: "0 auto 1.5rem",
                }}
              >
                {step.icon}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${step.color.includes("rose") ? "#e11d48" : step.color.includes("violet") ? "#7c3aed" : "#d97706"}, transparent)`,
                  borderRadius: 99,
                  padding: "0.25rem 0.875rem",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "0.1em",
                  marginBottom: "1rem",
                }}
              >
                STEP {step.step}
              </div>

              <h3 style={{ fontWeight: 800, color: "white", fontSize: "1.25rem", marginBottom: "0.75rem" }}>
                {step.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <Link
            href="/auth/register"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "linear-gradient(135deg, #e11d48, #db2777)",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "1rem 2.5rem",
              borderRadius: 99,
              boxShadow: "0 8px 32px rgba(225,29,72,0.5)",
            }}
          >
            <Sparkles size={20} /> Get Started Free
          </Link>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "1rem" }}>
            No subscription. Pay only when you book.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────
function ReviewsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % REVIEWS.length);
  const prev = () => setCurrent((c) => (c - 1 + REVIEWS.length) % REVIEWS.length);

  const review = REVIEWS[current];

  return (
    <section style={{ padding: "5rem 0", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge badge-gold" style={{ marginBottom: "0.75rem" }}>💬 Reviews</span>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            What Our Customers Say
          </h2>
          <p style={{ color: "#64748b", fontSize: "1.0625rem", maxWidth: 480, margin: "0 auto" }}>
            Over 50,000 happy customers have trusted GlowNXT for their beauty needs.
          </p>
        </div>

        {/* Grid of 3 review cards + featured */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {REVIEWS.slice(0, 3).map((rev, i) => (
            <div
              key={rev.id}
              className="card animate-fade-in-up"
              style={{ padding: "1.75rem", animationDelay: `${i * 100}ms` }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: "1rem" }}>
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} fill={idx < rev.rating ? "#f59e0b" : "none"} color={idx < rev.rating ? "#f59e0b" : "#e2e8f0"} />
                ))}
              </div>

              <p style={{ color: "#334155", lineHeight: 1.75, fontSize: "0.9375rem", marginBottom: "1.5rem", fontStyle: "italic" }}>
                "{rev.comment}"
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                <Image src={rev.customerAvatar} alt={rev.customerName} width={44} height={44} style={{ borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>{rev.customerName}</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{rev.service} · {rev.date}</div>
                </div>
                <CheckCircle size={18} color="#10b981" style={{ marginLeft: "auto" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Load more reviews */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {REVIEWS.slice(3).map((rev, i) => (
            <div
              key={rev.id}
              className="card animate-fade-in-up"
              style={{ padding: "1.75rem", animationDelay: `${i * 100}ms` }}
            >
              <div style={{ display: "flex", gap: 3, marginBottom: "1rem" }}>
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} fill={idx < rev.rating ? "#f59e0b" : "none"} color={idx < rev.rating ? "#f59e0b" : "#e2e8f0"} />
                ))}
              </div>
              <p style={{ color: "#334155", lineHeight: 1.75, fontSize: "0.9375rem", marginBottom: "1.5rem", fontStyle: "italic" }}>
                "{rev.comment}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                <Image src={rev.customerAvatar} alt={rev.customerName} width={44} height={44} style={{ borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>{rev.customerName}</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{rev.service} · {rev.date}</div>
                </div>
                <CheckCircle size={18} color="#10b981" style={{ marginLeft: "auto" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{ marginTop: "3.5rem", background: "#f8fafc", borderRadius: 24, padding: "2rem 2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", alignItems: "center" }}>
            {[
              { icon: <Shield size={24} color="#10b981" />, text: "100% Safe & Verified Professionals" },
              { icon: <Award size={24} color="#f59e0b" />, text: "5-Star Rated on App Store & Play Store" },
              { icon: <CheckCircle size={24} color="#3b82f6" />, text: "Money-Back Guarantee" },
              { icon: <Sparkles size={24} color="#e11d48" />, text: "50,000+ Happy Customers" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {item.icon}
                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section
      style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(135deg, #e11d48 0%, #db2777 50%, #9333ea 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blobs */}
      <div style={{ position: "absolute", top: -50, right: -50, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>💆‍♀️</div>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
          Ready for Your Glow-Up?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.125rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Join 50,000+ satisfied customers. Book your first service today and get
          <strong style={{ color: "white" }}> ₹200 off</strong> with code <strong style={{ color: "#fef08a" }}>BEAUTY200</strong>.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/auth/register"
            style={{
              textDecoration: "none",
              background: "white",
              color: "#e11d48",
              fontWeight: 800,
              fontSize: "1rem",
              padding: "1rem 2.5rem",
              borderRadius: 99,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Sparkles size={18} /> Book Now — Get ₹200 Off
          </Link>
          <Link
            href="/professionals"
            style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "1rem 2.5rem",
              borderRadius: 99,
              border: "2px solid rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Browse Professionals
          </Link>
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "1.5rem" }}>
          No credit card required · Cancel anytime · Safe & secure payments
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#0f172a", color: "white" }}>
      {/* Main footer */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 1.5rem 3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem" }}>
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #e11d48, #db2777)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={20} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1.25rem" }}>Glow<span style={{ color: "#e11d48" }}>NXT</span></div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#e11d48", textTransform: "uppercase" }}>Salon &amp; Spa</div>
              </div>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              India's most trusted on-demand beauty platform. Connecting you with certified beauty professionals.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[Globe, Share2, MessageCircle, Play].map((Icon, i) => (
                <button
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={16} color="#94a3b8" />
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.9rem", color: "white", marginBottom: "1.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Services</h4>
            {["Facial & Skincare", "Bridal Packages", "Hair Styling", "Body Massage", "Nail Art", "Waxing & Threading"].map((s) => (
              <Link key={s} href="#" style={{ display: "block", color: "#64748b", fontSize: "0.875rem", textDecoration: "none", marginBottom: "0.625rem", transition: "color 0.2s" }}>
                {s}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.9rem", color: "white", marginBottom: "1.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Company</h4>
            {["About Us", "Our Story", "Careers", "Press", "Blog", "Partner With Us"].map((s) => (
              <Link key={s} href="#" style={{ display: "block", color: "#64748b", fontSize: "0.875rem", textDecoration: "none", marginBottom: "0.625rem" }}>
                {s}
              </Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.9rem", color: "white", marginBottom: "1.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Support</h4>
            {["Help Center", "Safety", "Terms of Service", "Privacy Policy", "Cookie Policy", "Refund Policy"].map((s) => (
              <Link key={s} href="#" style={{ display: "block", color: "#64748b", fontSize: "0.875rem", textDecoration: "none", marginBottom: "0.625rem" }}>
                {s}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.9rem", color: "white", marginBottom: "1.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", fontSize: "0.875rem" }}>
                <Phone size={15} color="#e11d48" /> +91 98765 43210
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", fontSize: "0.875rem" }}>
                <Mail size={15} color="#e11d48" /> support@glownxt.com
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <p style={{ color: "#475569", fontSize: "0.8rem", marginBottom: "0.75rem" }}>Download our app</p>
                <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                  {["App Store", "Google Play"].map((store) => (
                    <button
                      key={store}
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 8,
                        padding: "0.5rem 1rem",
                        color: "white",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {store === "App Store" ? "🍎" : "🤖"} {store}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ color: "#475569", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} GlowNXT Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <Link key={l} href="#" style={{ color: "#475569", fontSize: "0.8rem", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
          <p style={{ color: "#374151", fontSize: "0.75rem" }}>
            🇮🇳 Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── AI & Transformation Banners ────────────────────────────────────────────────────────────
function AIBannerSection() {
  const { t } = useLanguage();
  return (
    <section style={{ padding: "5rem 1.5rem", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", color: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
        <div>
          <span style={{ background: "rgba(225,29,72,0.2)", color: "#fda4af", border: "1px solid rgba(225,29,72,0.4)", padding: "0.3rem 0.8rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            ✨ {t("ai_suite")}
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginTop: "1rem", marginBottom: "1rem", lineHeight: 1.2 }}>
            {t("analyzer_title")}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2rem" }}>
            {t("analyzer_subtitle")}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/ai-analyzer"
              style={{
                textDecoration: "none",
                background: "linear-gradient(135deg, #e11d48, #db2777)",
                color: "white",
                padding: "0.875rem 1.75rem",
                borderRadius: 14,
                fontWeight: 800,
                boxShadow: "0 8px 24px rgba(225,29,72,0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Sparkles size={18} /> Try AI Diagnostic Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/transformations"
              style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "0.875rem 1.75rem",
                borderRadius: 14,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              📷 View Real Transformations
            </Link>
          </div>
        </div>
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", height: 380 }}>
          <Image
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800"
            alt="AI Diagnostic Suite"
            fill
            style={{ objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.9), transparent)" }} />
          <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, background: "rgba(15,23,42,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#fda4af", fontWeight: 700 }}>AI Scorecard Sample</div>
              <div style={{ fontWeight: 800, color: "white", fontSize: "0.95rem" }}>Hydration: 88/100 • Glow: 92/100</div>
            </div>
            <span style={{ background: "#22c55e", color: "white", padding: "0.25rem 0.6rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 800 }}>⚡ 98.4% Precision</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Men's Grooming Showcase Section ────────────────────────────────────────────────────────────
function MenSection() {
  const { addToCart } = useCart();
  const menServices = SERVICES.filter((s) => s.gender === "men");

  return (
    <section style={{ padding: "5rem 1.5rem", background: "#0f172a", color: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ background: "rgba(37,99,235,0.2)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.4)", padding: "0.25rem 0.875rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
              👨 Men's Salon & Grooming at Home
            </span>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, marginTop: "0.75rem" }}>
              Exclusive Grooming & Barbering Services for Men (पुरुषांसाठी होम सलून)
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Certified Master Barbers bringing precision haircuts, beard styling, and charcoal detox facials to your doorstep.
            </p>
          </div>
          <Link
            href="/services?gender=men"
            style={{
              textDecoration: "none",
              color: "#60a5fa",
              fontWeight: 800,
              fontSize: "0.9rem",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            View All Men's Treatments <ArrowRight size={16} />
          </Link>
        </div>

        {/* Men Services Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {menServices.slice(0, 4).map((s) => (
            <div key={s.id} style={{ background: "rgba(30,41,59,0.7)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <div style={{ position: "relative", height: 180 }}>
                <Image src={s.image} alt={s.name} fill style={{ objectFit: "cover" }} />
                {s.badge && (
                  <div style={{ position: "absolute", top: 10, left: 10, background: "#2563eb", color: "white", padding: "0.2rem 0.6rem", borderRadius: 99, fontSize: "0.65rem", fontWeight: 800 }}>
                    {s.badge}
                  </div>
                )}
              </div>
              <div style={{ padding: "1.25rem" }}>
                <div style={{ color: "#60a5fa", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>
                  {s.category}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "0.5rem", color: "white" }}>
                  {s.name}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  {s.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.875rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#64748b" }}>Starting</span>
                    <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "white" }}>₹{s.price}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart({ id: s.id, name: s.name, category: s.category, price: s.price, duration: s.duration, image: s.image })}
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 0.875rem",
                      borderRadius: 10,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Plus size={14} /> Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}>
      <Header transparent />
      <HeroSection />
      <CategorySection />
      <MenSection />
      <ProfessionalsSection />
      <AIBannerSection />
      <ServicesSection />
      <HowItWorksSection />
      <ReviewsSection />
      <CTASection />
      <Footer />

      {/* Global style overrides for hover effects that need CSS classes */}
      <style>{`
        .nav-link:hover {
          background: rgba(255,255,255,0.1);
          color: white !important;
        }
        .hidden-mobile {
          display: flex;
        }
        .mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        .card:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
