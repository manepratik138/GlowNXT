"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRODUCTS, Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { Search, Star, ShoppingBag, Plus, Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export default function ShopPage() {
  const { addToCart, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState<"all" | "women" | "men">("all");

  const categories = ["All", "Beard Care", "Hair Care", "Skincare", "Salon Kit"];

  useEffect(() => {
    try {
      const vendorProds = JSON.parse(localStorage.getItem("glownxt_vendor_products") || localStorage.getItem("beautycare_vendor_products") || "[]");
      if (vendorProds.length) {
        setAllProducts([...PRODUCTS, ...vendorProds]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesGender =
      selectedGender === "all" ||
      !product.targetGender ||
      product.targetGender === "unisex" ||
      product.targetGender === selectedGender;

    return matchesSearch && matchesCategory && matchesGender;
  });

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #431407 100%)",
              borderRadius: 24,
              padding: "3.5rem 2rem",
              color: "white",
              marginBottom: "2.5rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(245,158,11,0.2)",
                color: "#fde047",
                border: "1px solid rgba(245,158,11,0.4)",
                padding: "0.25rem 0.875rem",
                borderRadius: 99,
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "1rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              🛍️ Official GlowNXT Essentials Store
            </span>
            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                marginBottom: "0.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              Post-Treatment Beauty & Grooming Care
            </h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "2rem", flexWrap: "wrap" }}>
              <Link
                href="/shop/add-product"
                style={{
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #e11d48, #db2777)",
                  color: "white",
                  padding: "0.6rem 1.25rem",
                  borderRadius: 99,
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 4px 16px rgba(225,29,72,0.4)",
                }}
              >
                <Plus size={16} /> Sell Product as Local Vendor (दुकानदारांसाठी प्रॉडक्ट जोडणी)
              </Link>
            </div>

            {/* Search Input */}
            <div style={{ maxWidth: 540, margin: "0 auto", position: "relative" }}>
              <input
                type="text"
                placeholder="Search products (e.g. Beard Oil, Hair Serum, Charcoal Scrub)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem 1.25rem 0.875rem 3rem",
                  borderRadius: 99,
                  border: "none",
                  outline: "none",
                  fontSize: "0.95rem",
                  color: "#0f172a",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                }}
              />
              <Search
                size={20}
                color="#64748b"
                style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          {/* Perks Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            {[
              { icon: Truck, title: "Free Doorstep Delivery", desc: "On orders above ₹499" },
              { icon: ShieldCheck, title: "100% Authentic Products", desc: "Directly from lab partners" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7 days return guarantee" },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    background: "#fef3c7",
                    color: "#d97706",
                    padding: "0.6rem",
                    borderRadius: 12,
                  }}
                >
                  <p.icon size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a" }}>{p.title}</h4>
                  <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {/* Gender Switcher */}
            <div
              style={{
                background: "#e2e8f0",
                padding: 4,
                borderRadius: 99,
                display: "flex",
                gap: 4,
              }}
            >
              {[
                { id: "all", label: "✨ All Products" },
                { id: "women", label: "👩 Women" },
                { id: "men", label: "👨 Men & Grooming" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGender(g.id as "all" | "women" | "men")}
                  style={{
                    border: "none",
                    background: selectedGender === g.id ? "white" : "transparent",
                    color: selectedGender === g.id ? "#e11d48" : "#64748b",
                    padding: "0.4rem 1rem",
                    borderRadius: 99,
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    boxShadow: selectedGender === g.id ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: selectedCategory === cat ? "#0f172a" : "white",
                    color: selectedCategory === cat ? "white" : "#475569",
                    border: "1px solid #cbd5e1",
                    padding: "0.4rem 1rem",
                    borderRadius: 99,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: "white",
                  borderRadius: 20,
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                }}
              >
                <div>
                  <div style={{ position: "relative", height: 190 }}>
                    <Image src={prod.image} alt={prod.name} fill style={{ objectFit: "cover" }} />
                    {prod.badge && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          background: "linear-gradient(135deg, #d97706, #b45309)",
                          color: "white",
                          padding: "0.2rem 0.6rem",
                          borderRadius: 99,
                          fontSize: "0.65rem",
                          fontWeight: 800,
                        }}
                      >
                        {prod.badge}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <div style={{ color: "#d97706", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>
                      {prod.category}
                    </div>
                    <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                      {prod.name}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.8rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                      {prod.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem" }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <strong style={{ color: "#0f172a" }}>{prod.rating}</strong> ({prod.reviewCount} reviews)
                    </div>
                  </div>
                </div>

                <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#94a3b8", display: "block" }}>Price</span>
                    <span style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.2rem" }}>₹{prod.price}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart({
                        id: prod.id,
                        name: prod.name,
                        category: prod.category,
                        price: prod.price,
                        duration: 0,
                        image: prod.image,
                      });
                      openCart();
                    }}
                    style={{
                      background: "linear-gradient(135deg, #e11d48, #db2777)",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 0.9rem",
                      borderRadius: 10,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      boxShadow: "0 4px 12px rgba(225,29,72,0.3)",
                    }}
                  >
                    <Plus size={14} /> Add to Cart
                  </button>
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
