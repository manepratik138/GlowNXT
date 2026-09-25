"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, MapPin, Award, CheckCircle, ArrowRight, Search, Heart } from "lucide-react";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { localDb } from "@/lib/localStore";
import { PROFESSIONALS } from "@/lib/data";
import { useAuth } from "@/lib/AuthContext";

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
  badge?: string;
  completedJobs: number;
  verificationStatus?: "pending" | "approved" | "rejected";
}

export default function ProfessionalsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [favouritesList, setFavouritesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const locations = ["All", "Mumbai", "Bangalore", "Hyderabad", "Chennai"];

  const loadData = async () => {
    try {
      setLoading(true);
      const firestore = db;
      if (firestore) {
        const snap = await getDocs(collection(firestore, "professionals"));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Professional));
        setProfessionals(list.length > 0 ? list.filter(p => p.available !== false) : PROFESSIONALS);

        if (user) {
          const favsSnap = await getDocs(collection(firestore, "favourites"));
          const favIds = favsSnap.docs
            .filter(d => d.data().customerId === user.uid)
            .map(d => d.data().professionalId as string);
          setFavouritesList(favIds);
        }
      } else {
        const localList = localDb.getDocs("professionals") as unknown as Professional[];
        setProfessionals(localList.length > 0 ? localList.filter(p => p.available !== false) : PROFESSIONALS);
        if (user) {
          const favs = localDb.getDocs("favourites", (d) => d.customerId === user.uid);
          setFavouritesList(favs.map(f => f.professionalId as string));
        }
      }
    } catch (err) {
      console.error("Error loading professionals:", err);
      setProfessionals(PROFESSIONALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const toggleFavourite = async (proId: string) => {
    if (!user) {
      alert("Please log in to save favourites.");
      return;
    }

    try {
      const isFav = favouritesList.includes(proId);
      const firestore = db;
      if (firestore) {
        if (isFav) {
          // Remove
          const favsSnap = await getDocs(collection(firestore, "favourites"));
          const targetDoc = favsSnap.docs.find(d => d.data().customerId === user.uid && d.data().professionalId === proId);
          if (targetDoc) {
            await deleteDoc(doc(firestore, "favourites", targetDoc.id));
          }
          setFavouritesList(prev => prev.filter(id => id !== proId));
        } else {
          // Add
          await setDoc(doc(collection(firestore, "favourites")), {
            customerId: user.uid,
            professionalId: proId,
            createdAt: new Date().toISOString()
          });
          setFavouritesList(prev => [...prev, proId]);
        }
      } else {
        if (isFav) {
          const favs = localDb.getDocs("favourites", (d) => d.customerId === user.uid && d.professionalId === proId);
          favs.forEach(f => localDb.deleteDoc("favourites", f.id));
          setFavouritesList(prev => prev.filter(id => id !== proId));
        } else {
          const favId = "fav_" + Date.now();
          localDb.setDoc("favourites", favId, {
            customerId: user.uid,
            professionalId: proId,
            createdAt: new Date().toISOString()
          });
          setFavouritesList(prev => [...prev, proId]);
        }
      }
    } catch (err) {
      console.error("Error toggling favourite:", err);
    }
  };

  const filtered = professionals.filter((pro) => {
    const matchesSearch = pro.name.toLowerCase().includes(search.toLowerCase()) ||
                          pro.title.toLowerCase().includes(search.toLowerCase()) ||
                          pro.services.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesLoc = filterLocation === "All" || pro.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesLoc;
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
              padding: "3.5rem 2rem",
              color: "white",
              marginBottom: "2.5rem",
              textAlign: "center",
            }}
          >
            <span style={{ display: "inline-block", background: "rgba(245,158,11,0.2)", color: "#fef08a", border: "1px solid rgba(245,158,11,0.4)", padding: "0.25rem 0.875rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, marginBottom: "1rem" }}>
              ⭐ Verified Experts
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
              Top-Rated Beauty Professionals
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 540, margin: "0 auto 1.75rem", fontSize: "1rem" }}>
              Handpicked, background-checked, and highly rated therapists & stylists near you.
            </p>

            <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 2, minWidth: 200, background: "white", borderRadius: 14, padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: 10 }}>
                <Search size={18} color="#e11d48" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, service or skill..."
                  style={{ border: "none", outline: "none", width: "100%", fontSize: "0.9rem", color: "#0f172a" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 140, background: "white", borderRadius: 14, padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={16} color="#64748b" />
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  style={{ border: "none", outline: "none", width: "100%", fontSize: "0.9rem", color: "#0f172a", background: "transparent" }}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "4px solid #f3f3f3", borderTop: "4px solid #e11d48", animation: "spin 1s linear infinite" }}></div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b", fontWeight: 600 }}>
              No available professionals found matching filters.
            </div>
          ) : (
            /* Grid of Pros */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {filtered.map((pro) => (
                <div key={pro.id} className="card" style={{ background: "white", borderRadius: 20, padding: "1.5rem", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "relative", width: 68, height: 68 }}>
                        <Image src={pro.avatar} alt={pro.name} fill style={{ borderRadius: "50%", objectFit: "cover", border: "3px solid #fce7f3" }} />
                      </div>
                      {pro.verified && (
                        <div style={{ position: "absolute", bottom: 0, right: 0, background: "#10b981", color: "white", borderRadius: "50%", padding: 2 }} title="Verified Pro">
                          <CheckCircle size={14} fill="#10b981" color="white" />
                        </div>
                      )}
                    </div>
                    <button onClick={() => toggleFavourite(pro.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <Heart size={20} color={favouritesList.includes(pro.id) ? "#e11d48" : "#e2e8f0"} fill={favouritesList.includes(pro.id) ? "#e11d48" : "none"} />
                    </button>
                  </div>

                  <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem", marginBottom: 2 }}>{pro.name}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.825rem", fontWeight: 500, marginBottom: "0.75rem" }}>{pro.title}</p>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
                    <Star size={15} fill="#f59e0b" color="#f59e0b" />
                    <strong style={{ color: "#0f172a", fontSize: "0.9rem" }}>{pro.rating}</strong>
                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>({pro.reviewCount})</span>
                    {pro.badge && (
                      <span style={{ marginLeft: "auto", background: "#fce7f3", color: "#9d174d", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 99 }}>
                        {pro.badge}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1rem", color: "#64748b", fontSize: "0.825rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <MapPin size={14} /> {pro.location}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Award size={14} /> {pro.experience} yrs exp · {pro.completedJobs.toLocaleString()} jobs
                    </div>
                    {/* Safety & Certification Badges */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                      <span style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", padding: "0.15rem 0.5rem", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700 }}>
                        🛡️ Police Verified
                      </span>
                      <span style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", padding: "0.15rem 0.5rem", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700 }}>
                        📜 Certified Pro
                      </span>
                      <span style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", padding: "0.15rem 0.5rem", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700 }}>
                        🧼 Sanitized Kit
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: "1.25rem" }}>
                    {pro.services.map((s) => (
                      <span key={s} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "0.2rem 0.6rem", fontSize: "0.725rem", fontWeight: 600, color: "#475569" }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                    <div>
                      <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Starts at</span>
                      <div style={{ fontWeight: 900, color: "#e11d48", fontSize: "1.15rem" }}>₹{pro.price}</div>
                    </div>
                    <Link
                      href={`/professionals/${pro.id}`}
                      style={{
                        textDecoration: "none",
                        background: "linear-gradient(135deg, #e11d48, #db2777)",
                        color: "white",
                        padding: "0.6rem 1.25rem",
                        borderRadius: 10,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      View Profile <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

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
