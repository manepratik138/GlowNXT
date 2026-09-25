"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, Sparkles, Clock, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";
import PaymentModal from "@/components/PaymentModal";

export default function CartDrawer() {
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalDuration,
    itemCount,
    bundleDiscountPercent,
    bundleDiscount,
    total,
  } = useCart();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          height: "100%",
          background: "#ffffff",
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          zIndex: 10000,
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #e11d48, #db2777)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                {t("cart_title")}
              </h2>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                {itemCount} {itemCount === 1 ? "service" : "services"} • {totalDuration} mins
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 6,
                }}
                title="Clear Cart"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeCart}
              style={{
                width: 34,
                height: 34,
                borderRadius: 99,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Bundle Savings Progress Bar */}
        <div
          style={{
            background: bundleDiscountPercent > 0 ? "#fdf2f8" : "#f8fafc",
            borderBottom: "1px solid #f1f5f9",
            padding: "0.875rem 1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: bundleDiscountPercent > 0 ? "#be185d" : "#475569" }}>
              {itemCount === 0 && t("cart_add_more")}
              {itemCount === 1 && t("cart_save_10")}
              {itemCount === 2 && t("cart_save_20")}
              {itemCount >= 3 && t("cart_unlocked_20")}
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                background: bundleDiscountPercent > 0 ? "linear-gradient(135deg, #e11d48, #db2777)" : "#e2e8f0",
                color: bundleDiscountPercent > 0 ? "white" : "#64748b",
                padding: "2px 8px",
                borderRadius: 99,
              }}
            >
              {bundleDiscountPercent}% OFF
            </span>
          </div>
          {/* Progress track */}
          <div
            style={{
              height: 6,
              background: "#e2e8f0",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (itemCount / 3) * 100)}%`,
                background: "linear-gradient(90deg, #f43f5e, #ec4899)",
                borderRadius: 99,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#64748b",
                padding: "2rem 1rem",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#fdf2f8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#e11d48",
                  marginBottom: "1rem",
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                {t("cart_empty")}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: 260, marginBottom: "1.5rem" }}>
                Add facials, waxing, massage, or nail art to build your custom home salon package.
              </p>
              <Link
                href="/services"
                onClick={closeCart}
                style={{
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #e11d48, #db2777)",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Browse Services <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "0.875rem",
                  borderRadius: 16,
                  border: "1px solid #f1f5f9",
                  background: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  position: "relative",
                }}
              >
                {/* Service thumbnail */}
                <div
                  style={{
                    position: "relative",
                    width: 70,
                    height: 70,
                    borderRadius: 12,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#e11d48", textTransform: "uppercase" }}>
                    {item.category}
                  </span>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      color: "#0f172a",
                      margin: "2px 0 4px 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#64748b" }}>
                    <Clock size={12} /> {item.duration} mins
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    <div style={{ fontWeight: 900, color: "#0f172a", fontSize: "1rem" }}>
                      ₹{item.price * item.quantity}
                    </div>

                    {/* Quantity controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: "2px 6px",
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          padding: 2,
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: "0.8rem", fontWeight: 800, minWidth: 16, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          padding: 2,
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "none",
                    border: "none",
                    color: "#cbd5e1",
                    cursor: "pointer",
                    padding: 4,
                  }}
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderTop: "1px solid #f1f5f9",
              background: "#ffffff",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748b" }}>
                <span>Subtotal ({itemCount} items)</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>₹{subtotal}</span>
              </div>

              {bundleDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#16a34a" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Sparkles size={14} /> Combo Savings ({bundleDiscountPercent}%)
                  </span>
                  <span style={{ fontWeight: 700 }}>- ₹{bundleDiscount}</span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  color: "#0f172a",
                  paddingTop: 8,
                  borderTop: "1px dashed #e2e8f0",
                }}
              >
                <span>Total Payable</span>
                <span style={{ color: "#e11d48" }}>₹{total}</span>
              </div>
            </div>

            {/* Guaranteed single use seal banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.75rem",
                color: "#059669",
                background: "#ecfdf5",
                padding: "6px 10px",
                borderRadius: 8,
                marginBottom: "1rem",
              }}
            >
              <ShieldCheck size={14} />
              <span>100% Single-use sealed kits • Zero travel fee</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  padding: "0.85rem",
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
                }}
              >
                💳 Pay Online (UPI/Card)
              </button>
              <Link
                href={`/book/p1?fromCart=true`}
                onClick={closeCart}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "linear-gradient(135deg, #e11d48, #db2777)",
                  color: "white",
                  padding: "0.85rem",
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  boxShadow: "0 8px 24px rgba(225, 29, 72, 0.35)",
                }}
              >
                Book Slot <ArrowRight size={16} />
              </Link>
            </div>

            {/* Payment Modal */}
            <PaymentModal
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              amount={total}
              title="Cart Online Payment (UPI / Card / Wallet)"
              onSuccess={(payId) => {
                alert(`Online Payment Successful! TXN ID: ${payId}`);
                clearCart();
                closeCart();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
