"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, Plus, CheckCircle, ArrowLeft, ShieldCheck, DollarSign, Sparkles } from "lucide-react";

export default function AddVendorProductPage() {
  const [form, setForm] = useState({
    name: "",
    category: "Skincare",
    price: 499,
    vendorName: "",
    location: "",
    targetGender: "unisex",
    description: "",
    image: "https://images.unsplash.com/photo-1608248597260-8f9f7431e670?w=600&q=80",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const storedProds = JSON.parse(localStorage.getItem("glownxt_vendor_products") || localStorage.getItem("beautycare_vendor_products") || "[]");
      const newProduct = {
        id: "vprod_" + Date.now(),
        ...form,
        rating: 5.0,
        reviewCount: 1,
        badge: "Vendor Exclusive",
      };
      localStorage.setItem("glownxt_vendor_products", JSON.stringify([...storedProds, newProduct]));
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: "1.5rem" }}>
            <Link href="/shop" style={{ textDecoration: "none", color: "#64748b", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <ArrowLeft size={16} /> Back to Store
            </Link>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: "2.5rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
              <div style={{ background: "#eff6ff", color: "#2563eb", padding: "0.75rem", borderRadius: 16 }}>
                <Store size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>
                  Local Seller & Vendor Product Registration (दुकानदारांसाठी प्रॉडक्ट नोंदणी)
                </h1>
                <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                  List your salon kits & beauty products on GlowNXT Marketplace (Swiggy/Zomato Model).
                </p>
              </div>
            </div>

            {/* Hyperlocal Business Model Info Box */}
            <div
              style={{
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                borderRadius: 16,
                padding: "1rem 1.25rem",
                border: "1px solid #bfdbfe",
                marginBottom: "2rem",
                fontSize: "0.85rem",
                color: "#1e40af",
              }}
            >
              <h4 style={{ fontWeight: 800, marginBottom: 4 }}>💼 Swiggy/Zomato Vendor Revenue Share:</h4>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 6 }}>
                <div>• Vendor Payout: <strong>85% per sale</strong></div>
                <div>• App Owner Platform Commission: <strong>15%</strong></div>
                <div>• Delivery / Doorstep Delivery: <strong>Handled by GlowNXT Express</strong></div>
              </div>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", display: "block", marginBottom: 6 }}>
                    Product Name (प्रॉडक्टचे नाव) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Herbal Beard Oil or Kumkumadi Facial Kit"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", display: "block", marginBottom: 6 }}>
                      Category (प्रकार)
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", background: "white" }}
                    >
                      <option value="Skincare">Skincare</option>
                      <option value="Beard Care">Beard Care (Men)</option>
                      <option value="Hair Care">Hair Care</option>
                      <option value="Salon Kit">Salon & Facial Kit</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", display: "block", marginBottom: 6 }}>
                      Selling Price (₹ कीमत) *
                    </label>
                    <input
                      type="number"
                      required
                      min={49}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", display: "block", marginBottom: 6 }}>
                      Vendor / Store Name (तुमच्या दुकानाचे नाव) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Beauty Supplies & Parlour"
                      value={form.vendorName}
                      onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", display: "block", marginBottom: 6 }}>
                      Target Customer
                    </label>
                    <select
                      value={form.targetGender}
                      onChange={(e) => setForm({ ...form, targetGender: e.target.value as any })}
                      style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", background: "white" }}
                    >
                      <option value="unisex">✨ Unisex (Men & Women)</option>
                      <option value="women">👩 Women Only</option>
                      <option value="men">👨 Men Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", display: "block", marginBottom: 6 }}>
                    Product Description (तपशील)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe ingredients, benefits, and usage instructions..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #e11d48, #db2777)",
                    color: "white",
                    border: "none",
                    padding: "1rem",
                    borderRadius: 14,
                    fontWeight: 900,
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(225,29,72,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  <Plus size={18} /> Publish Product to Store Now
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.4rem", marginBottom: 6 }}>
                  Product Published Successfully! 🎉
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "2rem" }}>
                  Your product <strong>"{form.name}"</strong> is now live on the GlowNXT E-Commerce Marketplace.
                </p>
                <Link
                  href="/shop"
                  style={{
                    textDecoration: "none",
                    background: "#0f172a",
                    color: "white",
                    padding: "0.875rem 1.75rem",
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: "0.9rem",
                  }}
                >
                  View Product in Store
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
