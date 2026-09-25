"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Star, Clock, Heart, ArrowRight, Filter, Plus, ShoppingBag } from "lucide-react";
import { SERVICES, CATEGORIES } from "@/lib/data";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCart } from "@/lib/CartContext";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  active?: boolean;
  gender?: "women" | "men" | "unisex";
}

function ServicesContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState<"all" | "women" | "men">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(6000);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    async function loadServices() {
      if (!db) { setLoading(false); return; }
      try {
        const snapshot = await getDocs(collection(db, "services"));
        const loaded = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Service));
        if (loaded.length) setServices(loaded);
      } catch (error) {
        console.error("Unable to load services:", error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const categories = ["All", ...CATEGORIES.map((c) => c.name)];

  const filteredServices = services.filter((service) => {
    if (service.active === false) return false;
    const matchesCat = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = service.price <= maxPrice;
    const matchesGender =
      selectedGender === "all" ||
      !service.gender ||
      service.gender === "unisex" ||
      service.gender === selectedGender;

    return matchesCat && matchesSearch && matchesPrice && matchesGender;
  });

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)",
              borderRadius: 24,
              padding: "3rem 2rem",
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
                background: "rgba(225,29,72,0.2)",
                color: "#fda4af",
                border: "1px solid rgba(225,29,72,0.4)",
                padding: "0.25rem 0.875rem",
                borderRadius: 99,
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "1rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              💅 Premium At-Home Services
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
              Explore Our Salon & Spa Services
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 540, margin: "0 auto 1.75rem", fontSize: "1rem" }}>
              Over 200+ top-rated beauty, skincare, and wellness treatments delivered safely to your home.
            </p>
            {searchParams.get("city") && <p style={{ color: "#fbcfe8", fontWeight: 700, fontSize: "0.85rem", margin: "-1rem 0 1rem" }}>Showing services for {searchParams.get("city")}</p>}

            {/* Search Box */}
            <div
              style={{
                maxWidth: 560,
                margin: "0 auto",
                background: "white",
                borderRadius: 16,
                padding: "0.5rem 0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <Search size={20} color="#e11d48" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (Facial, Hair, Massage, Nails...)"
                style={{ flex: 1, border: "none", outline: "none", fontSize: "0.9375rem", color: "#0f172a" }}
              />
            </div>
          </div>

          {/* Filters & Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem" }} className="services-layout">
            {/* Sidebar Filter */}
            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                height: "fit-content",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem", fontSize: "1.05rem" }}>
                <Filter size={18} color="#e11d48" /> Filters
              </div>

              {/* Gender Selector */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569", display: "block", marginBottom: 8, textTransform: "uppercase" }}>
                  Select Gender / Type
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { id: "all", label: "✨ All Services" },
                    { id: "women", label: "👩 Women Salon & Spa" },
                    { id: "men", label: "👨 Men Salon & Grooming" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGender(g.id as any)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: 10,
                        border: selectedGender === g.id ? "2px solid #e11d48" : "1px solid #e2e8f0",
                        background: selectedGender === g.id ? "#fff1f2" : "#f8fafc",
                        color: selectedGender === g.id ? "#e11d48" : "#475569",
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Happy Hours Off-Peak Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  border: "1px dashed #d97706",
                  borderRadius: 14,
                  padding: "0.875rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ fontSize: "0.75rem", fontWeight: 900, color: "#92400e", marginBottom: 2 }}>
                  ⚡ WEEKDAY HAPPY HOURS
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#78350f" }}>
                  Flat 25% OFF Tue–Thu (10 AM–2 PM)
                </div>
                <div style={{ fontSize: "0.7rem", color: "#a16207", marginTop: 4 }}>
                  Auto-applied at checkout for morning slots!
                </div>
              </div>

              {/* Categories */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.75rem" }}>
                  Category
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        textAlign: "left",
                        padding: "0.5rem 0.75rem",
                        borderRadius: 10,
                        border: "none",
                        background: selectedCategory === cat ? "#fce7f3" : "transparent",
                        color: selectedCategory === cat ? "#9d174d" : "#475569",
                        fontWeight: selectedCategory === cat ? 700 : 500,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>
                  Max Price: ₹{maxPrice}
                </label>
                <input
                  type="range"
                  min="300"
                  max="6000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#e11d48", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.75rem", marginTop: 4 }}>
                  <span>₹300</span>
                  <span>₹6,000</span>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.25rem" }}>
                  {selectedCategory === "All" ? "All Services" : selectedCategory} ({filteredServices.length})
                </h2>
              </div>

              {loading ? (
                <div style={{ background: "white", borderRadius: 20, padding: "4rem 2rem", textAlign: "center", border: "1px solid #e2e8f0", color: "#64748b" }}>Loading services...</div>
              ) : filteredServices.length === 0 ? (
                <div style={{ background: "white", borderRadius: 20, padding: "4rem 2rem", textAlign: "center", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                  <h3 style={{ fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>No services found</h3>
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Try adjusting your search filters or browse all categories.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
                  {filteredServices.map((service) => (
                    <div key={service.id} className="card" style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                      <div style={{ position: "relative", height: 180 }}>
                        <Image src={service.image} alt={service.name} fill style={{ objectFit: "cover" }} />
                        {service.badge && (
                          <div style={{ position: "absolute", top: 12, left: 12, background: "linear-gradient(135deg, #e11d48, #db2777)", color: "white", padding: "0.25rem 0.75rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 700 }}>
                            {service.badge}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "1.25rem" }}>
                        <div style={{ color: "#e11d48", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                          {service.category}
                        </div>
                        <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem", marginBottom: "0.5rem" }}>
                          {service.name}
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "0.825rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                          {service.description}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem", fontSize: "0.8rem", color: "#64748b" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <strong style={{ color: "#0f172a" }}>{service.rating ?? "New"}</strong>{service.reviewCount ? ` (${service.reviewCount})` : ""}
                          </div>
                          <div><Clock size={13} style={{ verticalAlign: "middle", marginRight: 3 }} />{service.duration} min</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                          <div>
                            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Starting</span>
                            <div style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.2rem" }}>₹{service.price}</div>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => addToCart({
                                id: service.id,
                                name: service.name,
                                category: service.category,
                                price: service.price,
                                duration: service.duration,
                                image: service.image,
                              })}
                              style={{
                                background: "rgba(225,29,72,0.1)",
                                color: "#e11d48",
                                border: "1px solid rgba(225,29,72,0.25)",
                                padding: "0.5rem 0.75rem",
                                borderRadius: 10,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              <Plus size={14} /> Cart
                            </button>
                            <Link
                              href={`/services/${service.id}`}
                              style={{
                                textDecoration: "none",
                                background: "linear-gradient(135deg, #e11d48, #db2777)",
                                color: "white",
                                padding: "0.5rem 0.875rem",
                                borderRadius: 10,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              Book <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .services-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#94a3b8", fontWeight: 700 }}>
          Loading GlowNXT Services...
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
