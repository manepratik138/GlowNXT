"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  getDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { localDb } from "@/lib/localStore";
import { BookingStatus, BOOKING_STATUS_LABELS, getBookingStatusColor } from "@/lib/bookingWorkflow";
import { 
  Calendar, Clock, MapPin, Star, Heart, X, Check, AlertCircle, RefreshCw,
  Navigation, AlertTriangle, Wallet, Share2, Copy, CheckCircle2, ShieldCheck
} from "lucide-react";
import { useWallet } from "@/lib/WalletContext";
import LiveTrackingModal from "@/components/LiveTrackingModal";
import SOSModal from "@/components/SOSModal";
import BookingChat from "@/components/BookingChat";
import NotificationCenter from "@/components/NotificationCenter";

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  customerId: string;
  customerName: string;
  date: string;
  timeSlot: string;
  address: string;
  familyMember: string;
  price: number;
  duration: number;
  status: BookingStatus;
  startOtp?: string;
  endOtp?: string;
  createdAt: string;
}

interface Professional {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  location: string;
}

export default function CustomerDashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favourites, setFavourites] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState<"bookings" | "wallet" | "favourites">("bookings");
  const [trackingBooking, setTrackingBooking] = useState<Booking | null>(null);
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);
  const [showSOS, setShowSOS] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const { balance, referralCode, transactions } = useWallet();

  // Reschedule state
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState("2026-08-25");
  const [newSlot, setNewSlot] = useState("10:00 AM");

  // Review state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      if (db) {
        // Fetch user bookings (Firebase)
        const bookingsRef = collection(db, "bookings");
        const qBookings = query(bookingsRef, where("customerId", "==", user.uid));
        const bookingsSnap = await getDocs(qBookings);
        const bookingsList = bookingsSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Booking)
        );
        setBookings(bookingsList.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));

        // Fetch favourites (Firebase)
        const favsRef = collection(db, "favourites");
        const qFavs = query(favsRef, where("customerId", "==", user.uid));
        const favsSnap = await getDocs(qFavs);
        
        const proPromises = favsSnap.docs.map(async (favDoc) => {
          const favData = favDoc.data();
          const proDocRef = doc(db!, "professionals", favData.professionalId);
          const proDoc = await getDoc(proDocRef);
          if (proDoc.exists()) {
            return { id: proDoc.id, ...proDoc.data() } as Professional;
          }
          return null;
        });
        const proList = (await Promise.all(proPromises)).filter(p => p !== null) as Professional[];
        setFavourites(proList);
      } else {
        // Local mode
        const localBookings = localDb.getDocs("bookings", (b) => b.customerId === user.uid) as unknown as Booking[];
        setBookings(localBookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));

        const localFavs = localDb.getDocs("favourites", (f) => f.customerId === user.uid);
        const proList = localFavs.map(f => {
          const proDoc = localDb.getDoc("professionals", f.professionalId as string);
          if (proDoc.exists()) {
            return { id: proDoc.id, ...proDoc.data() } as Professional;
          }
          return null;
        }).filter(p => p !== null) as Professional[];
        setFavourites(proList);
      }
    } catch (error) {
      console.error("Error loading customer dashboard:", error);
      setMessage({ text: "Failed to load dashboard data.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        window.location.href = "/auth/login";
      } else {
        loadDashboardData();
      }
    }
  }, [user, authLoading]);

  // Cancel Booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setActionLoading(true);
    setMessage({ text: "", type: "" });
    try {
      if (db) {
        const bookingRef = doc(db!, "bookings", bookingId);
        await updateDoc(bookingRef, { status: "cancelled" });
      } else {
        localDb.updateDoc("bookings", bookingId, { status: "cancelled" });
      }
      setMessage({ text: "Booking cancelled successfully.", type: "success" });
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to cancel booking.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Reschedule Booking
  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking) return;
    setActionLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Check conflict
      if (db) {
        const bookingsRef = collection(db, "bookings");
        const conflictQuery = query(
          bookingsRef,
          where("professionalId", "==", reschedulingBooking.professionalId),
          where("date", "==", newDate),
          where("timeSlot", "==", newSlot),
          where("status", "in", ["pending", "confirmed", "completed"])
        );
        const conflictSnapshot = await getDocs(conflictQuery);
        if (!conflictSnapshot.empty) {
          setMessage({ text: "This time slot is already booked for this professional. Please choose another date/time.", type: "error" });
          setActionLoading(false);
          return;
        }

        const bookingRef = doc(db!, "bookings", reschedulingBooking.id);
        await updateDoc(bookingRef, {
          date: newDate,
          timeSlot: newSlot,
          status: "pending" // reset to pending on reschedule
        });
      } else {
        const existingBookings = localDb.getDocs("bookings", (b) => 
          b.professionalId === reschedulingBooking.professionalId && 
          b.date === newDate && 
          b.timeSlot === newSlot && 
          ["pending", "confirmed", "completed"].includes(b.status as string)
        );
        if (existingBookings.length > 0) {
          setMessage({ text: "This time slot is already booked for this professional. Please choose another date/time.", type: "error" });
          setActionLoading(false);
          return;
        }
        
        localDb.updateDoc("bookings", reschedulingBooking.id, {
          date: newDate,
          timeSlot: newSlot,
          status: "pending"
        });
      }

      setMessage({ text: "Booking rescheduled successfully and pending professional approval.", type: "success" });
      setReschedulingBooking(null);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to reschedule booking.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setActionLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const reviewData = {
        bookingId: reviewBooking.id,
        customerId: user!.uid,
        customerName: userProfile?.name || "Customer",
        customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
        rating: rating,
        comment: comment,
        serviceName: reviewBooking.serviceName,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        professionalId: reviewBooking.professionalId,
        professionalName: reviewBooking.professionalName
      };

      if (db) {
        const existingReview = await getDocs(query(
          collection(db, "reviews"),
          where("bookingId", "==", reviewBooking.id),
          where("customerId", "==", user!.uid),
        ));
        if (!existingReview.empty) {
          setMessage({ text: "You have already reviewed this booking.", type: "error" });
          setActionLoading(false);
          return;
        }
        // Write review
        const reviewsRef = collection(db!, "reviews");
        await addDoc(reviewsRef, reviewData);

        // Update pro rating & reviewCount
        const proRef = doc(db!, "professionals", reviewBooking.professionalId);
        const proDoc = await getDoc(proRef);
        if (proDoc.exists()) {
          const proData = proDoc.data();
          const newCount = (proData.reviewCount || 0) + 1;
          const currentRating = proData.rating || 5;
          const newRating = parseFloat(((currentRating * (newCount - 1) + rating) / newCount).toFixed(1));

          await updateDoc(proRef, {
            rating: newRating,
            reviewCount: newCount
          });
        }
      } else {
        const existingReview = localDb.getDocs("reviews", (review) => review.bookingId === reviewBooking.id && review.customerId === user!.uid);
        if (existingReview.length > 0) {
          setMessage({ text: "You have already reviewed this booking.", type: "error" });
          setActionLoading(false);
          return;
        }
        const reviewId = `review_${Date.now()}`;
        localDb.setDoc("reviews", reviewId, reviewData);
        
        const proDoc = localDb.getDoc("professionals", reviewBooking.professionalId);
        if (proDoc.exists()) {
          const proData = proDoc.data();
          const newCount = ((proData.reviewCount as number) || 0) + 1;
          const currentRating = (proData.rating as number) || 5;
          const newRating = parseFloat(((currentRating * (newCount - 1) + rating) / newCount).toFixed(1));
          localDb.updateDoc("professionals", reviewBooking.professionalId, {
            rating: newRating,
            reviewCount: newCount
          });
        }
      }

      setMessage({ text: "Thank you! Your review was submitted.", type: "success" });
      setReviewBooking(null);
      setComment("");
      setRating(5);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to submit review.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Remove favourite
  const handleRemoveFavourite = async (proId: string) => {
    if (!user) return;
    try {
      if (db) {
        const favsRef = collection(db!, "favourites");
        const q = query(favsRef, where("customerId", "==", user.uid), where("professionalId", "==", proId));
        const snapshot = await getDocs(q);
        const promises = snapshot.docs.map(d => deleteDoc(doc(db!, "favourites", d.id)));
        await Promise.all(promises);
      } else {
        const favs = localDb.getDocs("favourites", (f) => f.customerId === user.uid && f.professionalId === proId);
        favs.forEach(f => localDb.deleteDoc("favourites", f.id));
      }
      setFavourites(prev => prev.filter(p => p.id !== proId));
      setMessage({ text: "Removed from Favourites.", type: "success" });
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "4px solid #f3f3f3", borderTop: "4px solid #e11d48", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}></div>
            <p style={{ color: "#64748b", fontWeight: 600 }}>Loading dashboard...</p>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
        <Footer />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => !["completed", "cancelled", "refunded"].includes(b.status));
  const pastBookings = bookings.filter(b => ["completed", "cancelled", "refunded"].includes(b.status));

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      {user && <NotificationCenter userId={user.uid} />}

      <main style={{ paddingTop: 110, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          
          {/* Welcome Banner */}
          <div style={{ background: "linear-gradient(135deg, #e11d48, #db2777)", borderRadius: 24, padding: "2rem", color: "white", marginBottom: "1.5rem", boxShadow: "0 10px 30px rgba(225,29,72,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: "0.25rem" }}>
                Hello, {userProfile?.name || "Beauty Lover"}! ✨
              </h1>
              <p style={{ fontSize: "0.95rem", color: "#ffe4e6", fontWeight: 500 }}>
                Manage your appointments, track professionals in real time, and earn referral wallet rewards.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowSOS(true)}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "2px solid rgba(255,255,255,0.4)",
                  padding: "0.6rem 1.25rem",
                  borderRadius: 99,
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
                }}
              >
                <AlertTriangle size={16} /> 24x7 Safety SOS
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: 10, marginBottom: "2rem", overflowX: "auto", paddingBottom: 4 }}>
            {[
              { id: "bookings", label: `📅 Appointments (${bookings.length})` },
              { id: "wallet", label: `💰 Wallet & Referrals (₹${balance})` },
              { id: "favourites", label: `⭐ Saved Pros (${favourites.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: 14,
                  border: "none",
                  fontWeight: 800,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  background: activeTab === tab.id ? "#0f172a" : "#ffffff",
                  color: activeTab === tab.id ? "white" : "#475569",
                  boxShadow: activeTab === tab.id ? "0 4px 14px rgba(15,23,42,0.2)" : "0 2px 6px rgba(0,0,0,0.04)",
                  borderBottom: activeTab === tab.id ? "none" : "1px solid #e2e8f0",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {message.text && (
            <div style={{ 
              background: message.type === "success" ? "#f0fdf4" : "#fef2f2", 
              border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fee2e2"}`, 
              color: message.type === "success" ? "#16a34a" : "#b91c1c", 
              padding: "0.875rem 1.25rem", 
              borderRadius: 14, 
              marginBottom: "1.5rem", 
              fontSize: "0.9rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <AlertCircle size={18} />
              {message.text}
            </div>
          )}

          {/* TAB 1: BOOKINGS */}
          {activeTab === "bookings" && (
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }} className="dashboard-grid">
              {/* LEFT COLUMN: Bookings */}
              <div>
                {/* Upcoming Bookings */}
                <section style={{ marginBottom: "2.5rem" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
                    📅 Upcoming Appointments ({upcomingBookings.length})
                  </h2>

                  {upcomingBookings.length === 0 ? (
                    <div style={{ background: "white", borderRadius: 20, padding: "3rem 1.5rem", textAlign: "center", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🗓️</div>
                      <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem" }}>No upcoming bookings.</p>
                      <Link href="/services" style={{ background: "linear-gradient(135deg,#e11d48,#db2777)", color: "white", textDecoration: "none", padding: "0.625rem 1.5rem", borderRadius: 99, fontWeight: 700, fontSize: "0.85rem", display: "inline-block" }}>
                        Explore Services & Book
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {upcomingBookings.map((b) => (
                        <div key={b.id} style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }} className="booking-card">
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                              <span style={{ 
                                background: getBookingStatusColor(b.status).background,
                                color: getBookingStatusColor(b.status).color,
                                fontSize: "0.7rem", 
                                fontWeight: 800, 
                                padding: "0.2rem 0.6rem", 
                                borderRadius: 99,
                                textTransform: "uppercase" 
                              }}>
                                {BOOKING_STATUS_LABELS[b.status]}
                              </span>
                              
                              {/* START OTP BADGE */}
                              {b.status !== "pending" && <span style={{
                                background: "#fff1f2",
                                color: "#be123c",
                                border: "1px dashed #f43f5e",
                                padding: "2px 8px",
                                borderRadius: 8,
                                fontSize: "0.75rem",
                                fontWeight: 800,
                              }}>
                                🔑 Doorstep Start OTP: <strong>{b.startOtp || "Waiting for confirmation"}</strong>
                              </span>
                              }

                              <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Recipient: {b.familyMember}</span>
                            </div>

                            <h3 style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a", marginBottom: 4 }}>{b.serviceName}</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0", color: "#475569", fontSize: "0.85rem" }}>
                              <div style={{ position: "relative", width: 24, height: 24 }}>
                                <Image src={b.professionalAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"} alt={b.professionalName} fill style={{ borderRadius: "50%", objectFit: "cover" }} />
                              </div>
                              <span>Pro: <strong>{b.professionalName}</strong></span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.8rem", color: "#64748b", marginTop: 8 }}>
                              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {b.date}</span>
                              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {b.timeSlot}</span>
                              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={14} /> {b.address.substring(0, 20)}...</span>
                            </div>
                          </div>

                          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 8, minWidth: 140 }}>
                            <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#e11d48" }}>₹{b.price}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <button
                                onClick={() => setChatBooking(b)}
                                style={{ background: "#fdf2f8", border: "none", color: "#be185d", padding: "0.4rem", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                              >
                                💬 Chat with Professional
                              </button>
                              {/* Live Tracking Trigger */}
                              <button
                                onClick={() => setTrackingBooking(b)}
                                disabled={b.status === "pending"}
                                style={{
                                  background: "linear-gradient(135deg, #0284c7, #0369a1)",
                                  color: "white",
                                  border: "none",
                                  padding: "0.45rem 0.75rem",
                                  borderRadius: 10,
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  cursor: b.status === "pending" ? "not-allowed" : "pointer",
                                  opacity: b.status === "pending" ? 0.5 : 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 4,
                                }}
                              >
                                <Navigation size={13} /> Track Pro Live
                              </button>

                              <button
                                onClick={() => {
                                  setReschedulingBooking(b);
                                  setNewDate(b.date);
                                  setNewSlot(b.timeSlot);
                                }}
                                disabled={actionLoading}
                                style={{ background: "#f1f5f9", border: "none", color: "#475569", padding: "0.4rem", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancelBooking(b.id)}
                                disabled={actionLoading}
                                style={{ background: "#fef2f2", border: "none", color: "#b91c1c", padding: "0.4rem", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              {/* Booking History */}
              <section>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem" }}>
                  📜 Booking History ({pastBookings.length})
                </h2>

                {pastBookings.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.875rem", fontStyle: "italic" }}>No past appointments recorded.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {pastBookings.map((b) => (
                      <div key={b.id} style={{ background: "white", borderRadius: 20, border: "1px solid #f1f5f9", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ 
                              background: b.status === "completed" ? "#d1fae5" : "#fee2e2", 
                              color: b.status === "completed" ? "#065f46" : "#991b1b", 
                              fontSize: "0.65rem", 
                              fontWeight: 800, 
                              padding: "0.2rem 0.5rem", 
                              borderRadius: 99 
                            }}>
                              {BOOKING_STATUS_LABELS[b.status]}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{b.date} • {b.timeSlot}</span>
                          </div>
                          <h4 style={{ fontWeight: 800, color: "#475569", fontSize: "0.95rem", margin: 0 }}>{b.serviceName}</h4>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Professional: {b.professionalName}</span>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 800, color: "#64748b", fontSize: "0.95rem" }}>₹{b.price}</div>
                          {b.status === "completed" && (
                            <button
                              onClick={() => {
                                setReviewBooking(b);
                                setRating(5);
                                setComment("");
                              }}
                              style={{ background: "#fff1f2", color: "#e11d48", border: "none", borderRadius: 8, padding: "0.3rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", marginTop: 6 }}
                            >
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: Favourites & Profile Info */}
            <div>
              {/* Favourites Section */}
              <section style={{ background: "white", borderRadius: 24, padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Heart size={18} color="#e11d48" className="fill-rose-600" /> Favourite Pros ({favourites.length})
                </h3>

                {favourites.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.8rem", textAlign: "center", padding: "1rem 0" }}>
                    No favourites saved yet. Favourites save you time during booking.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {favourites.map((pro) => (
                      <div key={pro.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "0.75rem", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ position: "relative", width: 36, height: 36 }}>
                            <Image src={pro.avatar} alt={pro.name} fill style={{ borderRadius: "50%", objectFit: "cover" }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a" }}>{pro.name}</div>
                            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{pro.title} • ⭐ {pro.rating}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Link href={`/book/${pro.id}`} style={{ textDecoration: "none", background: "#fff1f2", color: "#e11d48", padding: "0.3rem 0.6rem", borderRadius: 8, fontSize: "0.7rem", fontWeight: 700 }}>
                            Book
                          </Link>
                          <button
                            onClick={() => handleRemoveFavourite(pro.id)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
          )}

          {/* TAB 2: WALLET & REFERRALS */}
          {activeTab === "wallet" && (
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }} className="dashboard-grid">
              {/* Wallet Balance Card */}
              <div>
                <div
                  style={{
                    background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
                    borderRadius: 24,
                    padding: "2.5rem",
                    color: "white",
                    marginBottom: "2rem",
                    boxShadow: "0 10px 30px rgba(5,150,105,0.25)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "#a7f3d0", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    GlowNXT Cash Wallet
                  </div>
                  <div style={{ fontSize: "3.5rem", fontWeight: 900, margin: "10px 0" }}>
                    ₹{balance}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#d1fae5" }}>
                    ✨ Instant savings automatically applied on your at-home salon bookings (up to ₹150 off per appointment).
                  </div>
                </div>

                {/* Transaction History */}
                <div style={{ background: "white", borderRadius: 24, padding: "1.75rem", border: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem" }}>
                    Transaction History
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.875rem",
                          background: "#f8fafc",
                          borderRadius: 14,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>{tx.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{tx.date}</div>
                        </div>
                        <div
                          style={{
                            fontWeight: 900,
                            fontSize: "1rem",
                            color: tx.type === "credit" ? "#16a34a" : "#dc2626",
                          }}
                        >
                          {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Refer & Earn Card */}
              <div>
                <div
                  style={{
                    background: "white",
                    borderRadius: 24,
                    padding: "2rem",
                    border: "2px dashed #fda4af",
                    boxShadow: "0 8px 30px rgba(225,29,72,0.06)",
                  }}
                >
                  <span
                    style={{
                      background: "#ffe4e6",
                      color: "#e11d48",
                      padding: "4px 12px",
                      borderRadius: 99,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                    }}
                  >
                    Refer & Earn ₹150
                  </span>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0f172a", margin: "12px 0 6px" }}>
                    Invite Friends & Family
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    Give your friends ₹150 off their first beauty service. Once they complete their booking, you will receive ₹100 cashback in your wallet!
                  </p>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                      YOUR UNIQUE REFERRAL CODE:
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f8fafc",
                        border: "2px solid #e2e8f0",
                        borderRadius: 14,
                        padding: "8px 12px",
                      }}
                    >
                      <span style={{ flex: 1, fontWeight: 900, color: "#0f172a", letterSpacing: "0.1em", fontSize: "1.1rem" }}>
                        {referralCode}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(referralCode);
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        style={{
                          background: copiedCode ? "#16a34a" : "#0f172a",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                        {copiedCode ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Hey! Try GlowNXT doorstep salon services. Use my referral code ${referralCode} to get ₹150 off your first booking: https://glownxt.com`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "#22c55e",
                      color: "white",
                      padding: "0.85rem",
                      borderRadius: 14,
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                    }}
                  >
                    <Share2 size={18} /> Share via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAVOURITES */}
          {activeTab === "favourites" && (
            <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>
                ⭐ Saved Professionals ({favourites.length})
              </h2>
              {favourites.length === 0 ? (
                <p style={{ color: "#64748b", textAlign: "center", padding: "3rem 0" }}>
                  You haven't saved any professionals yet. Browse experts to save your favourites!
                </p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                  {favourites.map((pro) => (
                    <div key={pro.id} style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: "1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{ position: "relative", width: 48, height: 48 }}>
                          <Image src={pro.avatar} alt={pro.name} fill style={{ borderRadius: "50%", objectFit: "cover" }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>{pro.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{pro.title} • ⭐ {pro.rating}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link href={`/book/${pro.id}`} style={{ flex: 1, textAlign: "center", background: "linear-gradient(135deg,#e11d48,#db2777)", color: "white", padding: "0.5rem", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "0.8rem" }}>
                          Book Now
                        </Link>
                        <button onClick={() => handleRemoveFavourite(pro.id)} style={{ padding: "0.5rem 0.75rem", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", color: "#64748b" }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RESCHEDULE DIALOG */}
          {reschedulingBooking && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)", zIndex: 1100, display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: 24, padding: "2rem", width: "100%", maxWidth: 440, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.2rem" }}>Reschedule Appointment</h3>
                  <button onClick={() => setReschedulingBooking(null)} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={20} /></button>
                </div>

                <form onSubmit={handleReschedule}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Select Date</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: 12, border: "2px solid #e2e8f0", fontSize: "0.9rem", fontWeight: 600 }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Select Time Slot</label>
                    <select
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: 12, border: "2px solid #e2e8f0", fontSize: "0.9rem", fontWeight: 600 }}
                    >
                      {["9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    style={{ width: "100%", padding: "0.875rem", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#e11d48,#db2777)", color: "white", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}
                  >
                    {actionLoading ? "Processing..." : "Confirm Reschedule"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* REVIEW DIALOG */}
          {reviewBooking && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)", zIndex: 1100, display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: 24, padding: "2rem", width: "100%", maxWidth: 440, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.2rem" }}>Write a Review</h3>
                  <button onClick={() => setReviewBooking(null)} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmitReview}>
                  <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 8 }}>Rating</div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={{ background: "transparent", border: "none", cursor: "pointer" }}
                        >
                          <Star size={32} color="#f59e0b" className={rating >= star ? "fill-amber-500" : ""} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Your Feedback</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="How was your home service experience? Share detail to help others."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: 12, border: "2px solid #e2e8f0", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    style={{ width: "100%", padding: "0.875rem", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}
                  >
                    {actionLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* LIVE GPS TRACKING MODAL */}
          {chatBooking && user && (
            <BookingChat
              bookingId={chatBooking.id}
              userId={user.uid}
              userName={userProfile?.name || "Customer"}
              recipientName={chatBooking.professionalName}
              onClose={() => setChatBooking(null)}
            />
          )}

          {trackingBooking && (
            <LiveTrackingModal
              isOpen={Boolean(trackingBooking)}
              onClose={() => setTrackingBooking(null)}
              booking={{
                id: trackingBooking.id,
                serviceName: trackingBooking.serviceName,
                professionalName: trackingBooking.professionalName,
                professionalAvatar: trackingBooking.professionalAvatar,
                address: trackingBooking.address,
                date: trackingBooking.date,
                timeSlot: trackingBooking.timeSlot,
                startOtp: trackingBooking.startOtp,
              }}
            />
          )}

          {/* EMERGENCY SOS MODAL */}
          <SOSModal isOpen={showSOS} onClose={() => setShowSOS(false)} userId={user?.uid} bookingId={trackingBooking?.id} />

        </div>
      </main>

      <Footer />
      
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
