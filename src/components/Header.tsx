"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ShoppingBag, Globe, Wallet } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useLanguage, Language } from "@/lib/LanguageContext";
import { useWallet } from "@/lib/WalletContext";
import { useVIP } from "@/lib/VIPContext";

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { balance } = useWallet();
  const { isVIP, subscribeVIP } = useVIP();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = transparent && !scrolled;

  const dashboardLink = userProfile
    ? userProfile.role === "admin"
      ? "/dashboard/admin"
      : userProfile.role === "professional"
      ? "/dashboard/pro"
      : "/dashboard/customer"
    : "/dashboard/customer";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(255,255,255,0.97)"
          : transparent
          ? "transparent"
          : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        boxShadow: (scrolled || !transparent) ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
        borderBottom: (scrolled || !transparent) ? "1px solid rgba(226,232,240,0.8)" : "none",
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
                color: isDark ? "white" : "#0f172a",
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
                color: isDark ? "rgba(255,255,255,0.7)" : "#e11d48",
                textTransform: "uppercase",
              }}
            >
              Salon &amp; Spa
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }} className="hidden-mobile">
          {[
            { label: t("nav_services"), href: "/services" },
            { label: "🛍️ Shop Store", href: "/shop", badge: "New" },
            { label: "💄 AR Studio", href: "/ar-studio", badge: "AR" },
            { label: "💍 Wedding & Groom Planner", href: "/bridal-groom-planner" },
            { label: "AI Skin Analyzer", href: "/ai-analyzer", badge: "AI" },
            { label: "Transformations", href: "/transformations" },
            { label: t("nav_become_pro"), href: "/become-a-pro" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: isDark ? "rgba(255,255,255,0.85)" : "#475569",
                padding: "0.4rem 0.75rem",
                borderRadius: 99,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
              className="nav-link"
            >
              {item.label}
              {item.badge && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #e11d48, #db2777)",
                    color: "white",
                    padding: "1px 6px",
                    borderRadius: 99,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* CTA & Tools buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Language Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: isDark ? "rgba(255,255,255,0.15)" : "#f1f5f9",
              borderRadius: 99,
              padding: "2px 4px",
              gap: 2,
            }}
          >
            {(["en", "mr", "hi"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                style={{
                  background: language === l ? "#e11d48" : "transparent",
                  color: language === l ? "white" : isDark ? "#ffffff" : "#475569",
                  border: "none",
                  borderRadius: 99,
                  padding: "3px 8px",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {l === "en" ? "EN" : l === "mr" ? "मराठी" : "हिं"}
              </button>
            ))}
          </div>

          {/* VIP Pass Badge Pill */}
          <button
            onClick={() => {
              if (!isVIP) {
                if (window.confirm("Join GlowNXT VIP Club for ₹499/mo? Get 20% OFF all services & ₹0 travel fee!")) {
                  subscribeVIP("monthly");
                  alert("Welcome to GlowNXT VIP Club! 🎉 20% Discount unlocked.");
                }
              } else {
                alert("You are an active GlowNXT VIP Member! 👑 Enjoy 20% OFF every booking.");
              }
            }}
            style={{
              background: isVIP ? "linear-gradient(135deg, #d97706, #b45309)" : isDark ? "rgba(255,255,255,0.12)" : "#fef3c7",
              color: isVIP ? "white" : isDark ? "#fef08a" : "#b45309",
              border: `1px solid ${isVIP ? "#f59e0b" : "rgba(245,158,11,0.4)"}`,
              padding: "4px 10px",
              borderRadius: 99,
              fontSize: "0.75rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            👑 {isVIP ? "VIP Active" : "Get VIP Pass"}
          </button>

          {/* Wallet Balance Pill */}
          <Link
            href="/dashboard/customer"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: isDark ? "rgba(255,255,255,0.12)" : "#ecfdf5",
              color: isDark ? "white" : "#065f46",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "#a7f3d0"}`,
              padding: "4px 10px",
              borderRadius: 99,
              fontSize: "0.75rem",
              fontWeight: 800,
            }}
            title="GlowNXT Wallet Balance"
          >
            <Wallet size={13} color={isDark ? "white" : "#059669"} />
            <span>₹{balance}</span>
          </Link>

          {/* Cart Trigger Button */}
          <button
            onClick={openCart}
            style={{
              position: "relative",
              background: isDark ? "rgba(255,255,255,0.15)" : "#f8fafc",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.3)" : "#e2e8f0"}`,
              borderRadius: 99,
              padding: "7px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: isDark ? "white" : "#0f172a",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.8rem",
            }}
            title="View Cart"
          >
            <ShoppingBag size={16} />
            <span className="hidden-mobile">Cart</span>
            {itemCount > 0 && (
              <span
                style={{
                  background: "linear-gradient(135deg, #e11d48, #db2777)",
                  color: "white",
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(225,29,72,0.4)",
                }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {user ? (
            <>
              <Link
                href={dashboardLink}
                style={{
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: isDark ? "white" : "#0f172a",
                  padding: "0.45rem 1rem",
                  borderRadius: 99,
                  border: `2px solid ${isDark ? "rgba(255,255,255,0.4)" : "#e2e8f0"}`,
                  transition: "all 0.2s",
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); window.location.href = "/"; }}
                style={{
                  background: "transparent",
                  border: `2px solid ${isDark ? "rgba(255,255,255,0.2)" : "#fecdd3"}`,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: isDark ? "white" : "#e11d48",
                  padding: "0.45rem 1rem",
                  borderRadius: 99,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                style={{
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: isDark ? "white" : "#0f172a",
                  padding: "0.45rem 1rem",
                  borderRadius: 99,
                  border: `2px solid ${isDark ? "rgba(255,255,255,0.4)" : "#e2e8f0"}`,
                  transition: "all 0.2s",
                }}
              >
                Login
              </Link>
              <Link
                href="/services"
                style={{
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "white",
                  padding: "0.45rem 1.25rem",
                  borderRadius: 99,
                  background: "linear-gradient(135deg, #e11d48, #db2777)",
                  boxShadow: "0 4px 16px rgba(225,29,72,0.4)",
                  transition: "all 0.2s",
                }}
              >
                Book Now
              </Link>
            </>
          )}

          {/* Mobile menu btn */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: isDark ? "white" : "#0f172a",
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
          {[
            { label: "Services", href: "/services" },
            { label: "✨ AI Skin Analyzer", href: "/ai-analyzer" },
            { label: "Transformations", href: "/transformations" },
            { label: "Professionals", href: "/professionals" },
            { label: "Wedding Special", href: "/wedding" },
            { label: "Mehendi Art", href: "/mehendi" },
            { label: "Become a Pro", href: "/become-a-pro" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
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
              {item.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: "1rem" }}>
            {user ? (
              <>
                <Link
                  href={dashboardLink}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0.75rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: 12,
                    fontWeight: 700,
                    color: "#0f172a",
                    textDecoration: "none",
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); window.location.href = "/"; }}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0.75rem",
                    background: "transparent",
                    border: "2px solid #fecdd3",
                    borderRadius: 12,
                    fontWeight: 700,
                    color: "#e11d48",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0.75rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: 12,
                    fontWeight: 700,
                    color: "#0f172a",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/professionals"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0.75rem",
                    background: "linear-gradient(135deg,#e11d48,#db2777)",
                    borderRadius: 12,
                    fontWeight: 700,
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Book Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
