"use client";

import { useState, useEffect, useRef } from "react";
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
  getDoc 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { localDb } from "@/lib/localStore";
import { BookingStatus, BOOKING_STATUS_LABELS, canTransitionBooking } from "@/lib/bookingWorkflow";
import BookingChat from "@/components/BookingChat";
import NotificationCenter, { createLocalNotification } from "@/components/NotificationCenter";
import { 
  DollarSign, Check, X, Calendar, Clock, Sparkles, MapPin, User, Star, Edit, Shield, Info, AlertCircle, Camera, Upload
} from "lucide-react";

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
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
  startOtpVerifiedAt?: string;
  endOtpVerifiedAt?: string;
  createdAt: string;
}

export default function ProDashboardPage() {
  const { user, proProfile, userProfile, loading: authLoading, refreshProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inputOtps, setInputOtps] = useState<{ [bookingId: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);

  // Profile Editor state
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    title: "",
    bio: "",
    experience: 1,
    location: "",
    services: [] as string[],
    price: 999,
    priceListText: "",
  });

  // Photo upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const loadProData = async () => {
    if (!user) return;
    try {
      setLoading(true);

      if (db) {
        // ── Firebase mode ──────────────────────────────────
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("professionalId", "==", user.uid));
        const snap = await getDocs(q);
        const bookingsList = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
        setBookings(bookingsList.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      } else {
        // ── Local mode ─────────────────────────────────────
        const localBookings = localDb.getDocs(
          "bookings",
          (b) => b.professionalId === user.uid
        ) as unknown as Booking[];
        setBookings(localBookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      }

      if (proProfile) {
        setProfileForm({
          title: proProfile.title || "Beauty Therapist",
          bio: proProfile.bio || "",
          experience: proProfile.experience || 1,
          location: proProfile.location || "",
          services: proProfile.services || [],
          price: proProfile.price || 999,
          priceListText: proProfile.priceList 
            ? proProfile.priceList.map(item => `${item.service}:${item.price}`).join("\n")
            : "Luxury Facial Treatment:999",
        });
      }
    } catch (error) {
      console.error("Error loading pro dashboard data:", error);
      setMessage({ text: "Failed to load dashboard data.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        window.location.href = "/auth/login";
      } else if (userProfile?.role !== "professional") {
        setMessage({ text: "Access denied. Professional account required.", type: "error" });
        setLoading(false);
      } else {
        loadProData();
      }
    }
  }, [user, proProfile, authLoading, userProfile]);

  // Toggle Availability
  const toggleAvailability = async () => {
    if (!user || !proProfile) return;
    setActionLoading(true);
    try {
      if (db) {
        const proDocRef = doc(db, "professionals", user.uid);
        await updateDoc(proDocRef, { available: !proProfile.available });
      } else {
        localDb.updateDoc("professionals", user.uid, { available: !proProfile.available });
      }
      setMessage({ text: "Availability status updated.", type: "success" });
      await refreshProfile();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update availability.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Accept Booking
  const handleAcceptBooking = async (bookingId: string) => {
    setActionLoading(true);
    setMessage({ text: "", type: "" });
    try {
      if (db) {
        const bookingRef = doc(db, "bookings", bookingId);
        await updateDoc(bookingRef, { status: "confirmed" });
      } else {
        localDb.updateDoc("bookings", bookingId, { status: "confirmed" });
      }
      const acceptedBooking = bookings.find((booking) => booking.id === bookingId);
      if (acceptedBooking) createLocalNotification(acceptedBooking.customerId, "Booking accepted", `${acceptedBooking.professionalName} accepted your ${acceptedBooking.serviceName} booking.`);
      setMessage({ text: "Booking accepted! ✅", type: "success" });
      await loadProData();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to accept booking.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Reject Booking
  const handleRejectBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to decline this booking request?")) return;
    setActionLoading(true);
    setMessage({ text: "", type: "" });
    try {
      if (db) {
        const bookingRef = doc(db, "bookings", bookingId);
        await updateDoc(bookingRef, { status: "cancelled" });
      } else {
        localDb.updateDoc("bookings", bookingId, { status: "cancelled" });
      }
      const rejectedBooking = bookings.find((booking) => booking.id === bookingId);
      if (rejectedBooking) createLocalNotification(rejectedBooking.customerId, "Booking declined", `${rejectedBooking.professionalName} declined your booking request.`);
      setMessage({ text: "Booking declined.", type: "success" });
      await loadProData();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to decline booking.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, nextStatus: BookingStatus) => {
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking || !canTransitionBooking(booking.status, nextStatus)) {
      setMessage({ text: "This booking cannot move to that status.", type: "error" });
      return;
    }
    setActionLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const updates = { status: nextStatus, ...(nextStatus === "arrived" ? { arrivedAt: new Date().toISOString() } : {}) };
      if (db) await updateDoc(doc(db, "bookings", bookingId), updates);
      else localDb.updateDoc("bookings", bookingId, updates);
      setMessage({ text: `Booking moved to ${BOOKING_STATUS_LABELS[nextStatus]}.`, type: "success" });
      await loadProData();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update booking status.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Start service only after the professional has arrived and verifies the customer's OTP.
  const handleStartService = async (bookingId: string, expectedOtp?: string) => {
    const userEnteredOtp = inputOtps[bookingId]?.trim();
    if (!expectedOtp || userEnteredOtp !== expectedOtp) {
      setMessage({ text: "Invalid Start OTP! Please ask customer for their 4-digit Start OTP.", type: "error" });
      return;
    }
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking || !canTransitionBooking(booking.status, "in_progress")) {
      setMessage({ text: "The professional must mark the booking as Arrived first.", type: "error" });
      return;
    }
    setActionLoading(true);
    setMessage({ text: "", type: "" });
    try {
      if (db) {
        const bookingRef = doc(db, "bookings", bookingId);
        await updateDoc(bookingRef, { status: "in_progress", startOtpVerifiedAt: new Date().toISOString() });
      } else {
        localDb.updateDoc("bookings", bookingId, { status: "in_progress", startOtpVerifiedAt: new Date().toISOString() });
      }
      setMessage({ text: "Start OTP verified. Service is now active. ✅", type: "success" });
      await loadProData();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to complete booking.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteBooking = async (bookingId: string, expectedOtp?: string) => {
    const userEnteredOtp = inputOtps[bookingId]?.trim();
    if (!expectedOtp || userEnteredOtp !== expectedOtp) {
      setMessage({ text: "Invalid End OTP! Ask the customer for the completion OTP.", type: "error" });
      return;
    }
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking || !canTransitionBooking(booking.status, "completed")) {
      setMessage({ text: "Start OTP must be verified before completing the service.", type: "error" });
      return;
    }
    setActionLoading(true);
    try {
      if (db) {
        await updateDoc(doc(db, "bookings", bookingId), { status: "completed", endOtpVerifiedAt: new Date().toISOString(), completedAt: new Date().toISOString() });
        const proRef = doc(db, "professionals", user!.uid);
        const proSnap = await getDoc(proRef);
        if (proSnap.exists()) await updateDoc(proRef, { completedJobs: (proSnap.data().completedJobs || 0) + 1 });
      } else {
        localDb.updateDoc("bookings", bookingId, { status: "completed", endOtpVerifiedAt: new Date().toISOString(), completedAt: new Date().toISOString() });
        const proDoc = localDb.getDoc("professionals", user!.uid);
        localDb.updateDoc("professionals", user!.uid, { completedJobs: (proDoc.exists() ? ((proDoc.data().completedJobs as number) || 0) : 0) + 1 });
      }
      setMessage({ text: "End OTP verified. Service completed successfully. 🎉", type: "success" });
      await refreshProfile();
      await loadProData();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to complete booking.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle photo file selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ text: "Please select a valid image file.", type: "error" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "Image must be under 5MB.", type: "error" });
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Upload photo — Firebase Storage if available, else base64 in localStorage
  const handlePhotoUpload = async (): Promise<string | null> => {
    if (!photoFile || !user) return null;
    setUploadingPhoto(true);
    try {
      if (storage) {
        // Firebase Storage upload
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, photoFile);
        return await getDownloadURL(storageRef);
      } else {
        // Base64 fallback with compression
        return await new Promise<string>((resolve, reject) => {
          const img = document.createElement("img");
          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target?.result as string;
          };
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 400;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress to JPEG
            } else {
              resolve(img.src);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(photoFile!);
        });
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
      setMessage({ text: "Photo upload failed. Please try again.", type: "error" });
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Save profile updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setActionLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const parsedPriceList = profileForm.priceListText
        .split("\n")
        .filter(line => line.includes(":"))
        .map(line => {
          const parts = line.split(":");
          return {
            service: parts[0].trim(),
            price: parseFloat(parts[1].trim()) || 999
          };
        });

      // Upload photo
      let avatarUrl: string | null = null;
      if (photoFile) {
        avatarUrl = await handlePhotoUpload();
      }

      const updateData: Record<string, unknown> = {
        title: profileForm.title,
        bio: profileForm.bio,
        experience: Number(profileForm.experience),
        location: profileForm.location,
        price: Number(profileForm.price),
        services: parsedPriceList.map(item => item.service),
        priceList: parsedPriceList,
      };
      if (avatarUrl) updateData.avatar = avatarUrl;

      if (db) {
        // Firebase update
        const proRef = doc(db, "professionals", user.uid);
        await updateDoc(proRef, updateData);
      } else {
        // LocalStorage update
        localDb.updateDoc("professionals", user.uid, updateData);
      }

      setPhotoFile(null);
      setPhotoPreview(null);
      setMessage({ text: "Profile updated successfully! ✨", type: "success" });
      setEditing(false);
      await refreshProfile();
      await loadProData();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };


  if (authLoading || loading) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "4px solid #f3f3f3", borderTop: "4px solid #e11d48", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}></div>
            <p style={{ color: "#64748b", fontWeight: 600 }}>Loading partner portal...</p>
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

  // Stats
  const pendingRequests = bookings.filter(b => b.status === "pending");
  const activeBookings = bookings.filter(b => ["confirmed", "on_the_way", "arrived", "in_progress"].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === "completed");
  const earnings = completedBookings.reduce((sum, b) => sum + b.price, 0);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      {user && <NotificationCenter userId={user.uid} />}

      <main style={{ paddingTop: 110, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          
          {/* Welcome Banner */}
          <div style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", borderRadius: 24, padding: "2rem", color: "white", marginBottom: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.25rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 900 }}>
                  Welcome, {proProfile?.name || "Beauty Expert"}
                </h1>
                <span style={{ background: "#38bdf8", color: "#0369a1", fontSize: "0.7rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: 99 }}>PRO</span>
              </div>
              <p style={{ fontSize: "0.95rem", color: "#94a3b8" }}>{proProfile?.title || "Senior Therapist"} · Experience: {proProfile?.experience || 1} years</p>
            </div>

            {/* Availability Switch */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", padding: "0.75rem 1.25rem", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: proProfile?.available ? "#4ade80" : "#ef4444" }}>
                {proProfile?.available ? "🟢 Active & Accepting Bookings" : "🔴 Off-Duty (Invisible)"}
              </span>
              <button
                type="button"
                onClick={toggleAvailability}
                disabled={actionLoading}
                style={{
                  background: proProfile?.available ? "#22c55e" : "#64748b",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "0.5rem 1rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  transition: "all 0.2s"
                }}
              >
                Toggle Mode
              </button>
            </div>
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

          {/* Quick Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
              <div style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase" }}>Pending Requests</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#d97706", marginTop: 4 }}>{pendingRequests.length}</div>
            </div>
            <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase" }}>Confirmed Bookings</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0ea5e9", marginTop: 4 }}>{activeBookings.length}</div>
            </div>
            <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase" }}>Total Earnings</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#16a34a", marginTop: 4, display: "flex", alignItems: "center" }}>
                <DollarSign size={24} /> {earnings}
              </div>
            </div>
            <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase" }}>Completed Jobs</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#7c3aed", marginTop: 4 }}>{proProfile?.completedJobs || 0}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "2rem" }} className="dashboard-grid">
            
            {/* LEFT COLUMN: Booking Requests */}
            <div>
              {/* Pending Requests */}
              <section style={{ marginBottom: "2.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
                  🔔 Booking Requests ({pendingRequests.length})
                </h3>

                {pendingRequests.length === 0 ? (
                  <div style={{ background: "white", borderRadius: 20, padding: "2.5rem", textAlign: "center", border: "1px solid #e2e8f0" }}>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>No pending booking requests.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {pendingRequests.map((b) => (
                      <div key={b.id} style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div>
                            <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "0.7rem", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: 99, textTransform: "uppercase" }}>PENDING</span>
                            <h4 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", marginTop: 6, marginBottom: 2 }}>{b.serviceName}</h4>
                            <span style={{ fontSize: "0.8rem", color: "#475569" }}>Client: <strong>{b.customerName}</strong> ({b.familyMember})</span>
                          </div>
                          <div style={{ fontWeight: 900, color: "#e11d48", fontSize: "1.2rem" }}>₹{b.price}</div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem", color: "#64748b", margin: "10px 0" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {b.date}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {b.timeSlot}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={14} /> {b.address}</span>
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: "1rem" }}>
                          <button
                            onClick={() => handleAcceptBooking(b.id)}
                            disabled={actionLoading}
                            style={{ flex: 1, padding: "0.5rem", borderRadius: 10, border: "none", background: "#22c55e", color: "white", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                          >
                            <Check size={16} /> Accept Request
                          </button>
                          <button
                            onClick={() => handleRejectBooking(b.id)}
                            disabled={actionLoading}
                            style={{ flex: 1, padding: "0.5rem", borderRadius: 10, border: "none", background: "#ef4444", color: "white", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                          >
                            <X size={16} /> Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Confirmed Appointments */}
              <section style={{ marginBottom: "2.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
                  🗓️ Confirmed Upcoming Appointments ({activeBookings.length})
                </h3>

                {activeBookings.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.875rem", fontStyle: "italic" }}>No upcoming confirmed services.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {activeBookings.map((b) => (
                      <div key={b.id} style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div>
                            <span style={{ background: b.status === "in_progress" ? "#dbeafe" : "#dcfce7", color: b.status === "in_progress" ? "#1d4ed8" : "#166534", fontSize: "0.7rem", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: 99, textTransform: "uppercase" }}>{BOOKING_STATUS_LABELS[b.status]}</span>
                            <h4 style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a", marginTop: 6, marginBottom: 2 }}>{b.serviceName}</h4>
                            <span style={{ fontSize: "0.8rem", color: "#475569" }}>Client: <strong>{b.customerName}</strong></span>
                          </div>
                          <div style={{ fontWeight: 900, color: "#e11d48", fontSize: "1.1rem" }}>₹{b.price}</div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem", color: "#64748b", margin: "10px 0" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {b.date}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {b.timeSlot}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={14} /> {b.address}</span>
                        </div>

                        {(b.status === "arrived" || b.status === "in_progress") && (
                          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "0.75rem", border: "1px dashed #cbd5e1", margin: "10px 0" }}>
                            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>
                              🔑 Enter Customer {b.status === "arrived" ? "Start" : "End"} OTP:
                            </label>
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="e.g. 4821"
                              value={inputOtps[b.id] || ""}
                              onChange={(e) => setInputOtps({ ...inputOtps, [b.id]: e.target.value })}
                              style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.9rem", fontWeight: 800, textAlign: "center", letterSpacing: "0.2em", background: "white" }}
                            />
                          </div>
                        )}

                        {b.status === "confirmed" && <button onClick={() => updateBookingStatus(b.id, "on_the_way")} disabled={actionLoading} style={{ width: "100%", padding: "0.6rem", borderRadius: 10, border: "none", background: "#0ea5e9", color: "white", fontWeight: 800, cursor: "pointer", marginTop: 6, fontSize: "0.85rem" }}>🚗 Mark On The Way</button>}
                        {b.status === "on_the_way" && <button onClick={() => updateBookingStatus(b.id, "arrived")} disabled={actionLoading} style={{ width: "100%", padding: "0.6rem", borderRadius: 10, border: "none", background: "#8b5cf6", color: "white", fontWeight: 800, cursor: "pointer", marginTop: 6, fontSize: "0.85rem" }}>📍 Mark Arrived</button>}
                        {b.status === "arrived" && <button onClick={() => handleStartService(b.id, b.startOtp)} disabled={actionLoading} style={{ width: "100%", padding: "0.6rem", borderRadius: 10, border: "none", background: "#2563eb", color: "white", fontWeight: 800, cursor: "pointer", marginTop: 6, fontSize: "0.85rem" }}>🔑 Verify Start OTP & Start Service</button>}
                        {b.status === "in_progress" && <button onClick={() => handleCompleteBooking(b.id, b.endOtp)} disabled={actionLoading} style={{ width: "100%", padding: "0.6rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", fontWeight: 800, cursor: "pointer", marginTop: 6, fontSize: "0.85rem" }}>✅ Verify End OTP & Complete</button>}
                        <button onClick={() => setChatBooking(b)} style={{ width: "100%", padding: "0.55rem", borderRadius: 10, border: "1px solid #fbcfe8", background: "#fdf2f8", color: "#be185d", fontWeight: 800, cursor: "pointer", marginTop: 6, fontSize: "0.8rem" }}>💬 Chat with Customer</button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: Profile & Settings */}
            <div>
              <section style={{ background: "white", borderRadius: 24, padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    🔧 Profile & Services
                  </h3>
                  <button
                    onClick={() => { setEditing(!editing); setPhotoFile(null); setPhotoPreview(null); }}
                    style={{ background: "transparent", border: "none", color: "#e11d48", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Edit size={14} /> {editing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {/* Avatar Display */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div style={{ position: "relative", width: 90, height: 90 }}>
                    <img
                      src={photoPreview || proProfile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(proProfile?.name || "Pro")}&background=e11d48&color=fff&size=200`}
                      alt="Profile Photo"
                      style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid #e11d48", boxShadow: "0 4px 16px rgba(225,29,72,0.25)" }}
                    />
                    {editing && (
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        style={{
                          position: "absolute", bottom: 0, right: 0,
                          width: 28, height: 28, borderRadius: "50%",
                          background: "linear-gradient(135deg,#e11d48,#db2777)",
                          border: "2px solid white", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          cursor: "pointer", boxShadow: "0 2px 8px rgba(225,29,72,0.4)"
                        }}
                      >
                        <Camera size={14} color="white" />
                      </button>
                    )}
                  </div>
                  {editing && (
                    <>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handlePhotoSelect}
                      />
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        style={{ marginTop: 8, fontSize: "0.75rem", color: "#e11d48", fontWeight: 700, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Upload size={12} /> {photoFile ? `📷 ${photoFile.name.substring(0, 20)}...` : "Upload Profile Photo"}
                      </button>
                      {!storage && (
                        <span style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: 4, textAlign: "center" }}>
                          ⚠️ Configure Firebase to enable photo upload
                        </span>
                      )}
                    </>
                  )}
                  {!editing && (
                    <div style={{ marginTop: 8, textAlign: "center" }}>
                      <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>{proProfile?.name}</div>
                      <div style={{ color: "#64748b", fontSize: "0.78rem" }}>{proProfile?.title}</div>
                    </div>
                  )}
                </div>

                {!editing ? (
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                      <strong>Biography:</strong> <br />
                      {proProfile?.bio || "No biography added yet."}
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "1.25rem" }}>
                      <strong>Service Location:</strong> <br />
                      📍 {proProfile?.location || "Not specified"}
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "#475569" }}>
                      <strong>Offering Services & Prices:</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                        {proProfile?.priceList?.length ? proProfile.priceList.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0.75rem", background: "#f8fafc", borderRadius: 8, fontSize: "0.78rem" }}>
                            <span>{item.service}</span>
                            <strong style={{ color: "#e11d48" }}>₹{item.price}</strong>
                          </div>
                        )) : (
                          <p style={{ color: "#94a3b8", fontSize: "0.8rem", fontStyle: "italic" }}>No services listed yet. Click Edit Profile to add.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile}>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Professional Title</label>
                      <input
                        required
                        type="text"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                        placeholder="e.g. Hair Cutting Specialist"
                        style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: "0.85rem", fontWeight: 600, outline: "none" }}
                      />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Location / Area</label>
                      <input
                        required
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="e.g. Pune, Maharashtra"
                        style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: "0.85rem", fontWeight: 600, outline: "none" }}
                      />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Years of Experience</label>
                      <input
                        required
                        type="number"
                        min={0}
                        max={50}
                        value={profileForm.experience}
                        onChange={(e) => setProfileForm({ ...profileForm, experience: Number(e.target.value) })}
                        style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: "0.85rem", fontWeight: 600, outline: "none" }}
                      />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>About You (Bio)</label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        placeholder="Tell customers about your expertise and experience..."
                        style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: "0.85rem", outline: "none", fontFamily: "inherit", resize: "vertical" }}
                      />
                    </div>

                    <div style={{ marginBottom: "1.25rem" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4, display: "block" }}>Services & Prices</label>
                      <span style={{ fontSize: "0.65rem", color: "#64748b", display: "block", marginBottom: 6 }}>One service per line — Format: <em>Service Name:Price</em><br />Example: <em>Hair Cut:299</em></span>
                      <textarea
                        rows={5}
                        value={profileForm.priceListText}
                        onChange={(e) => setProfileForm({ ...profileForm, priceListText: e.target.value })}
                        placeholder={"Hair Cut:299\nBeard Trim:199\nHair Colour:599"}
                        style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: "0.85rem", outline: "none", fontFamily: "monospace", resize: "vertical" }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading || uploadingPhoto}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: 10, border: "none", background: (actionLoading || uploadingPhoto) ? "#cbd5e1" : "linear-gradient(135deg,#e11d48,#db2777)", color: "white", fontWeight: 800, fontSize: "0.85rem", cursor: (actionLoading || uploadingPhoto) ? "not-allowed" : "pointer" }}
                    >
                      {uploadingPhoto ? "Uploading Photo..." : actionLoading ? "Saving..." : "💾 Save Profile"}
                    </button>
                  </form>
                )}
              </section>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {chatBooking && user && (
        <BookingChat
          bookingId={chatBooking.id}
          userId={user.uid}
          userName={proProfile?.name || "Professional"}
          recipientName={chatBooking.customerName}
          onClose={() => setChatBooking(null)}
        />
      )}
      
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
