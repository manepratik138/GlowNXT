"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, MapPin, Award, CheckCircle, Sparkles, Shield, Calendar, Clock, ArrowRight } from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Professional {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  experience: number;
  services: string[];
  price: number;
  verified: boolean;
  available: boolean;
  bio: string;
  badge?: string;
  completedJobs: number;
  specializations?: string[];
  certificates?: string[];
  portfolio?: string[];
  availableSlots?: string[];
  priceList?: { service: string; price: number }[];
}

interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  serviceName: string;
  date: string;
}

export default function ProfessionalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const proId = resolvedParams.id;

  const [pro, setPro] = useState<Professional | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!db) return;
      try {
        setLoading(true);
        // Load professional
        const proDocRef = doc(db!, "professionals", proId);
        const proDoc = await getDoc(proDocRef);
        if (!proDoc.exists()) {
          setError("Professional not found.");
          setLoading(false);
          return;
        }
        setPro({ id: proDoc.id, ...proDoc.data() } as Professional);

        // Load reviews
        const reviewsQuery = query(
          collection(db!, "reviews"),
          where("professionalId", "==", proId)
        );
        const reviewsSnap = await getDocs(reviewsQuery);
        const reviewsList = reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
        setReviews(reviewsList);

      } catch (err) {
        console.error("Error loading professional details:", err);
        setError("Failed to load details.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [proId]);

  if (loading) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "4px solid #f3f3f3", borderTop: "4px solid #e11d48", animation: "spin 1s linear infinite" }}></div>
        </div>
        <Footer />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !pro) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "120px 2rem" }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: 20, textAlign: "center", maxWidth: 400, border: "1px solid #fee2e2" }}>
            <span style={{ fontSize: "2rem" }}>⚠️</span>
            <h3 style={{ color: "#b91c1c", fontWeight: 800, marginTop: "1rem" }}>Error</h3>
            <p style={{ color: "#ef4444", margin: "0.5rem 0 1.5rem" }}>{error || "Could not find profile details."}</p>
            <Link href="/professionals" style={{ background: "#0f172a", color: "white", padding: "0.5rem 1.5rem", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>
              Back to Professionals
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Top Profile Card */}
          <div style={{ background: "white", borderRadius: 24, padding: "2.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "relative", width: 120, height: 120 }}>
                  <Image src={pro.avatar} alt={pro.name} fill style={{ borderRadius: "50%", objectFit: "cover", border: "4px solid #fce7f3" }} priority />
                </div>
                {pro.verified && (
                  <div style={{ position: "absolute", bottom: 4, right: 4, background: "#10b981", color: "white", borderRadius: "50%", padding: 4 }} title="Verified">
                    <CheckCircle size={18} fill="#10b981" color="white" />
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                  <h1 style={{ fontSize: "1.875rem", fontWeight: 900, color: "#0f172a" }}>{pro.name}</h1>
                  {pro.badge && (
                    <span style={{ background: "linear-gradient(135deg, #e11d48, #db2777)", color: "white", fontWeight: 700, fontSize: "0.75rem", padding: "0.3rem 0.875rem", borderRadius: 99 }}>
                      {pro.badge}
                    </span>
                  )}
                </div>

                <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>{pro.title}</p>

                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.25rem", fontSize: "0.9rem", color: "#475569" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <strong style={{ color: "#0f172a" }}>{pro.rating}</strong> ({pro.reviewCount} reviews)
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <MapPin size={16} color="#e11d48" /> {pro.location}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Award size={16} color="#7c3aed" /> {pro.experience} Years Experience
                  </div>
                </div>

                <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "0.95rem" }}>{pro.bio}</p>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: 20, padding: "1.5rem", border: "1px solid #f1f5f9", minWidth: 220, textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Starting Price</div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#e11d48", margin: "0.25rem 0 1rem" }}>₹{pro.price}</div>
                <Link
                  href={`/book/${pro.id}`}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "linear-gradient(135deg, #e11d48, #db2777)",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "0.9375rem",
                    padding: "0.875rem 1.5rem",
                    borderRadius: 14,
                    boxShadow: "0 6px 20px rgba(225,29,72,0.35)",
                  }}
                >
                  <Sparkles size={16} /> Book Appointment
                </Link>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }} className="pro-profile-grid">
            {/* Left Column */}
            <div>
              {/* Specializations & Certifications */}
              <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.25rem" }}>
                  Specializations & Certificates
                </h2>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.75rem" }}>Specialized In</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(pro.specializations || pro.services).map((spec) => (
                      <span key={spec} style={{ background: "#fce7f3", color: "#9d174d", fontWeight: 700, fontSize: "0.85rem", padding: "0.4rem 1rem", borderRadius: 99 }}>
                        ✨ {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {pro.certificates && pro.certificates.length > 0 && (
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.75rem" }}>Certificates</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {pro.certificates.map((cert) => (
                        <span key={cert} style={{ background: "#dbeafe", color: "#1e40af", fontWeight: 700, fontSize: "0.85rem", padding: "0.4rem 1rem", borderRadius: 99 }}>
                          📜 {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price List */}
              <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.25rem" }}>
                  Services & Pricing
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {(pro.priceList || [
                    { service: "Luxury Facial Treatment", price: pro.price },
                  ]).map((item) => (
                    <div key={item.service} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#f8fafc", borderRadius: 14, border: "1px solid #f1f5f9" }}>
                      <div>
                        <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>{item.service}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>Includes doorstep setup & products</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontWeight: 900, color: "#e11d48", fontSize: "1.1rem" }}>₹{item.price}</span>
                        <Link href={`/book/${pro.id}`} style={{ textDecoration: "none", background: "linear-gradient(135deg, #e11d48, #db2777)", color: "white", padding: "0.4rem 0.875rem", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700 }}>
                          Select
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Gallery */}
              {pro.portfolio && pro.portfolio.length > 0 && (
                <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.25rem" }}>
                    Portfolio Gallery
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                    {pro.portfolio.map((img, idx) => (
                      <div key={idx} style={{ position: "relative", height: 160, borderRadius: 16, overflow: "hidden" }}>
                        <Image src={img} alt="Portfolio work" fill style={{ objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Reviews */}
              <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.25rem" }}>
                  Client Reviews ({reviews.length})
                </h2>
                {reviews.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.95rem", fontStyle: "italic" }}>No reviews written yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {reviews.map((rev) => (
                      <div key={rev.id} style={{ padding: "1.25rem", background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ position: "relative", width: 36, height: 36 }}>
                              <Image src={rev.customerAvatar} alt={rev.customerName} fill style={{ borderRadius: "50%", objectFit: "cover" }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.875rem" }}>{rev.customerName}</div>
                              <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{rev.serviceName}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 2 }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < rev.rating ? "#f59e0b" : "none"} color={i < rev.rating ? "#f59e0b" : "#e2e8f0"} />
                            ))}
                          </div>
                        </div>
                        <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.6, fontStyle: "italic" }}>"{rev.comment}"</p>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "right", marginTop: 4 }}>{rev.date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column — Time Slots & Instant Booking */}
            <div>
              <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", position: "sticky", top: 100 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0f172a", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <Calendar size={18} color="#e11d48" /> Available Time Slots
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "1.25rem" }}>Select a slot for today or upcoming dates:</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.5rem" }}>
                  {(pro.availableSlots || ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"]).map((slot) => (
                    <span
                      key={slot}
                      style={{
                        padding: "0.5rem",
                        textAlign: "center",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#475569",
                      }}
                    >
                      {slot}
                    </span>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: "0.85rem", color: "#475569" }}>
                    <Shield size={16} color="#10b981" /> <span>Safety & Hygiene Guidelines Met</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>
                    All services are performed using premium single-use kits. Professionals are background checked and verified.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
