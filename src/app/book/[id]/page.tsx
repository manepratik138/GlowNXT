"use client";

import { use, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  CheckCircle, Calendar, Clock, MapPin, CreditCard, Sparkles, User,
  Shield, Check, ArrowRight, ArrowLeft, Users, Home, Locate, Smartphone,
  ShoppingBag, Wallet, MessageCircle, Percent, AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useWallet } from "@/lib/WalletContext";
import { doc, getDoc, getDocs, collection, query, where, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { localDb } from "@/lib/localStore";
import { PROFESSIONALS, SERVICES } from "@/lib/data";

interface FirestoreService {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  image: string;
}

interface FirestorePro {
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
  available: boolean;
  bio: string;
  availableSlots?: string[];
  priceList?: { service: string; price: number }[];
}

function BookingWizardContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const proId = resolvedParams.id;
  const searchParams = useSearchParams();
  const fromCart = searchParams.get("fromCart") === "true";

  const { user, userProfile } = useAuth();
  const { items: cartItems, bundleDiscount: cartBundleDiscount, bundleDiscountPercent: cartBundlePercent, clearCart } = useCart();
  const { balance, deductCredits } = useWallet();

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pro, setPro] = useState<FirestorePro | null>(null);
  const [availableServices, setAvailableServices] = useState<FirestoreService[]>([]);

  // Wizard state: 1: Service, 2: Date & Slot, 3: Address & Family, 4: Summary, 5: Payment, 6: Success
  const [step, setStep] = useState(1);

  // Selected values
  const [selectedService, setSelectedService] = useState<FirestoreService | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-08-25");
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [address, setAddress] = useState("Flat 402, Sunshine Heights, Bandra West, Mumbai");
  const [bookingFor, setBookingFor] = useState("Self");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [useWalletCredits, setUseWalletCredits] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState("");
  const [startOtp, setStartOtp] = useState("4829");
  const [endOtp, setEndOtp] = useState("7193");

  const stepsList = [
    { num: 1, label: fromCart ? "Services (Cart)" : "Service" },
    { num: 2, label: "Date & Time" },
    { num: 3, label: "Address & Family" },
    { num: 4, label: "Summary" },
    { num: 5, label: "Payment" },
  ];

  // Load Pro and Services on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const firestore = db;
        let proData: FirestorePro | null = null;
        let servicesList: FirestoreService[] = [];

        if (firestore) {
          try {
            const proDocRef = doc(firestore, "professionals", proId);
            const proDoc = await getDoc(proDocRef);
            if (proDoc.exists()) {
              proData = { id: proDoc.id, ...proDoc.data() } as FirestorePro;
            }
          } catch (e) {
            console.warn("Firestore pro fetch fallback", e);
          }

          try {
            const servicesSnapshot = await getDocs(collection(firestore, "services"));
            servicesList = servicesSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreService));
          } catch (e) {
            console.warn("Firestore services fetch fallback", e);
          }
        }

        // Fallback to localDb or static data
        if (!proData) {
          const fallbackPro = PROFESSIONALS.find(p => p.id === proId) || PROFESSIONALS[0];
          proData = fallbackPro as unknown as FirestorePro;
        }
        if (servicesList.length === 0) {
          servicesList = SERVICES as unknown as FirestoreService[];
        }

        setPro(proData);
        setAvailableServices(servicesList);

        if (servicesList.length > 0) {
          setSelectedService(servicesList[0]);
        }
        if (proData.availableSlots && proData.availableSlots.length > 0) {
          setSelectedSlot(proData.availableSlots[0]);
        }
      } catch (err) {
        console.error("Error loading booking details:", err);
        const fallbackPro = PROFESSIONALS[0] as unknown as FirestorePro;
        setPro(fallbackPro);
        setAvailableServices(SERVICES as unknown as FirestoreService[]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [proId]);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "BEAUTY200") {
      setDiscount(200);
    } else {
      alert("Invalid coupon code. Try BEAUTY200 for ₹200 off!");
    }
  };

  const isCartMode = fromCart && cartItems.length > 0;
  const basePrice = isCartMode
    ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : (selectedService ? selectedService.price : 0);

  const comboDiscount = isCartMode ? cartBundleDiscount : 0;
  const walletDeduction = useWalletCredits ? Math.min(balance, 150) : 0;
  const finalPrice = Math.max(0, basePrice - comboDiscount - discount - walletDeduction);
  const totalMinutes = isCartMode
    ? cartItems.reduce((acc, item) => acc + item.duration * item.quantity, 0)
    : (selectedService ? selectedService.duration : 60);

  const handleConfirmBooking = async () => {
    if (!user) {
      setError("Please log in to complete your booking.");
      return;
    }
    if (!pro) {
      setError("Professional details missing.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const generatedStart = Math.floor(1000 + Math.random() * 9000).toString();
      const generatedEnd = Math.floor(1000 + Math.random() * 9000).toString();
      setStartOtp(generatedStart);
      setEndOtp(generatedEnd);

      const bookingServiceName = isCartMode
        ? cartItems.map(i => `${i.name} (x${i.quantity})`).join(", ")
        : (selectedService ? selectedService.name : "Beauty Service");

      const newBooking = {
        serviceId: isCartMode ? "multi_cart" : (selectedService?.id || "s1"),
        serviceName: bookingServiceName,
        professionalId: pro.id,
        professionalName: pro.name,
        professionalAvatar: pro.avatar,
        customerId: user.uid,
        customerName: userProfile?.name || user.email || "Customer",
        date: selectedDate,
        timeSlot: selectedSlot,
        address: address,
        familyMember: bookingFor,
        price: finalPrice,
        duration: totalMinutes,
        status: "confirmed" as const,
        paymentMethod: paymentMethod,
        startOtp: generatedStart,
        endOtp: generatedEnd,
        createdAt: new Date().toISOString(),
      };

      const firestore = db;
      let newId = "bk_" + Date.now();
      if (firestore) {
        try {
          const docRef = await addDoc(collection(firestore, "bookings"), newBooking);
          newId = docRef.id;
        } catch (e) {
          console.warn("Writing to localDb fallback", e);
          localDb.setDoc("bookings", newId, newBooking);
        }
      } else {
        localDb.setDoc("bookings", newId, newBooking);
      }

      if (useWalletCredits && walletDeduction > 0) {
        deductCredits(walletDeduction, `Booking #${newId.slice(-6).toUpperCase()}`);
      }

      if (isCartMode) {
        clearCart();
      }

      setConfirmedBookingId(newId);
      setStep(6);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "4px solid #f3f3f3", borderTop: "4px solid #e11d48", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}></div>
            <p style={{ color: "#64748b", fontWeight: 600 }}>Loading booking options...</p>
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

  if (error && !pro) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "120px 2rem" }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: 20, border: "1px solid #fee2e2", textAlign: "center", maxWidth: 400 }}>
            <span style={{ fontSize: "3rem" }}>⚠️</span>
            <h3 style={{ color: "#991b1b", fontWeight: 800, marginTop: "1rem" }}>Error</h3>
            <p style={{ color: "#ef4444", margin: "0.5rem 0 1.5rem" }}>{error}</p>
            <Link href="/professionals" style={{ background: "#0f172a", color: "white", padding: "0.5rem 1.5rem", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>
              Go Back
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
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Top Wizard Bar */}
          {step <= 5 && (
            <div style={{ background: "white", borderRadius: 20, padding: "1.25rem 1.5rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                {stepsList.map((s) => (
                  <div key={s.num} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: step >= s.num ? "linear-gradient(135deg, #e11d48, #db2777)" : "#f1f5f9",
                        color: step >= s.num ? "white" : "#94a3b8",
                        fontWeight: 800,
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: step >= s.num ? "0 4px 14px rgba(225,29,72,0.3)" : "none",
                        transition: "all 0.3s",
                      }}
                    >
                      {step > s.num ? <Check size={18} /> : s.num}
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: step === s.num ? 800 : 600, color: step === s.num ? "#0f172a" : "#94a3b8" }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", padding: "0.75rem 1rem", borderRadius: 12, marginBottom: "1.5rem", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          {/* STEP 1: Select Service */}
          {step === 1 && pro && (
            <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
              {/* Pro Info Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "1rem", background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9", marginBottom: "1.75rem" }}>
                <div style={{ position: "relative", width: 52, height: 52 }}>
                  <Image src={pro.avatar} alt={pro.name} fill style={{ borderRadius: "50%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Selected Professional</div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>{pro.name}</div>
                  <div style={{ color: "#e11d48", fontSize: "0.75rem", fontWeight: 700 }}>{pro.title} • ⭐ {pro.rating}</div>
                </div>
              </div>

              <h2 style={{ fontSize: "1.375rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.25rem" }}>
                {isCartMode ? `Step 1: Review Selected Cart Services (${cartItems.length})` : "Step 1: Choose Your Service"}
              </h2>

              {isCartMode ? (
                <div style={{ marginBottom: "2rem" }}>
                  {/* Combo Savings Banner */}
                  {cartBundlePercent > 0 && (
                    <div
                      style={{
                        background: "linear-gradient(135deg, #fdf2f8 0%, #fff1f2 100%)",
                        border: "1px solid #fbcfe8",
                        borderRadius: 14,
                        padding: "0.875rem 1.25rem",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#be185d", fontWeight: 800, fontSize: "0.9rem" }}>
                        <Sparkles size={18} />
                        <span>{cartBundlePercent}% Mega Combo Discount Applied!</span>
                      </div>
                      <span style={{ fontWeight: 900, color: "#be185d" }}>Save ₹{cartBundleDiscount}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "1rem 1.25rem",
                          borderRadius: 16,
                          border: "1px solid #e2e8f0",
                          background: "#ffffff",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ position: "relative", width: 48, height: 48, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                            <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                              {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ""}
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.75rem" }}>⏱ {item.duration * item.quantity} mins</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.05rem" }}>
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                  {availableServices
                    .filter((s) => pro.services.some(ps => s.name.toLowerCase().includes(ps.toLowerCase()) || ps.toLowerCase().includes(s.name.toLowerCase())))
                    .map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "1.25rem",
                          borderRadius: 16,
                          border: selectedService?.id === service.id ? "2px solid #e11d48" : "1px solid #e2e8f0",
                          background: selectedService?.id === service.id ? "#fce7f315" : "white",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ position: "relative", width: 56, height: 56, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                            <Image src={service.image} alt={service.name} fill style={{ objectFit: "cover" }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem", marginBottom: 2 }}>{service.name}</div>
                            <div style={{ color: "#64748b", fontSize: "0.8rem" }}>⏱ {service.duration} mins treatment</div>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 900, color: "#e11d48", fontSize: "1.2rem" }}>₹{service.price}</div>
                          {selectedService?.id === service.id && (
                            <span style={{ color: "#e11d48", fontSize: "0.75rem", fontWeight: 800 }}>✓ Selected</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!isCartMode && !selectedService}
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: 14,
                  border: "none",
                  background: (!isCartMode && !selectedService) ? "#cbd5e1" : "linear-gradient(135deg, #e11d48, #db2777)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: (!isCartMode && !selectedService) ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: (!isCartMode && !selectedService) ? "none" : "0 8px 24px rgba(225,29,72,0.35)",
                }}
              >
                Continue to Date & Time ({totalMinutes} mins) <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: Choose Date & Time Slot */}
          {step === 2 && pro && (
            <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={20} color="#e11d48" /> Step 2: Select Date & Time Slot
              </h2>

              {/* Date Selector */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem", display: "block", marginBottom: "0.75rem" }}>
                  Select Appointment Date
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
                  {[
                    { day: "Tue", date: "Aug 25", val: "2026-08-25" },
                    { day: "Wed", date: "Aug 26", val: "2026-08-26" },
                    { day: "Thu", date: "Aug 27", val: "2026-08-27" },
                    { day: "Fri", date: "Aug 28", val: "2026-08-28" },
                    { day: "Sat", date: "Aug 29", val: "2026-08-29" },
                  ].map((item) => (
                    <div
                      key={item.val}
                      onClick={() => setSelectedDate(item.val)}
                      style={{
                        padding: "0.875rem",
                        textAlign: "center",
                        borderRadius: 14,
                        border: selectedDate === item.val ? "2px solid #e11d48" : "1px solid #e2e8f0",
                        background: selectedDate === item.val ? "#fce7f3" : "#f8fafc",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>{item.day}</div>
                      <div style={{ fontWeight: 900, color: selectedDate === item.val ? "#9d174d" : "#0f172a", fontSize: "1rem" }}>{item.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem", display: "block", marginBottom: "0.75rem" }}>
                  Select Time Slot
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
                  {(pro.availableSlots || ["9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"]).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: 12,
                        border: selectedSlot === slot ? "2px solid #e11d48" : "1px solid #e2e8f0",
                        background: selectedSlot === slot ? "linear-gradient(135deg, #e11d48, #db2777)" : "white",
                        color: selectedSlot === slot ? "white" : "#0f172a",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: "0.875rem", borderRadius: 14, border: "2px solid #e2e8f0", background: "white", color: "#0f172a", fontWeight: 700 }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedSlot}
                  style={{ flex: 2, padding: "0.875rem", borderRadius: 14, border: "none", background: !selectedSlot ? "#cbd5e1" : "linear-gradient(135deg, #e11d48, #db2777)", color: "white", fontWeight: 800, fontSize: "0.95rem", cursor: !selectedSlot ? "not-allowed" : "pointer" }}
                >
                  Next: Address & Family
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Address & Family Account */}
          {step === 3 && (
            <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={20} color="#e11d48" /> Step 3: Service Address & Family Member
              </h2>

              {/* Address Input */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>
                  Delivery Address (GPS enabled)
                </label>
                <div style={{ position: "relative" }}>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: "100%", padding: "0.875rem", borderRadius: 14, border: "2px solid #e2e8f0", outline: "none", fontSize: "0.9rem", fontFamily: "inherit" }}
                  />
                  <button
                    onClick={() => setAddress("Current Location: Bandra West, Mumbai (Detected by GPS)")}
                    style={{ position: "absolute", bottom: 12, right: 12, background: "#fce7f3", color: "#9d174d", border: "none", borderRadius: 8, padding: "0.3rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Locate size={12} /> Auto-Detect GPS
                  </button>
                </div>
              </div>

              {/* Booking For (Family Account Option) */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem", display: "block", marginBottom: "0.75rem" }}>
                  Who is this service for? (Family Account)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                  {[
                    { label: "Self", icon: "👤" },
                    { label: "Mother", icon: "👵" },
                    { label: "Father", icon: "👴" },
                    { label: "Spouse", icon: "💑" },
                    { label: "Child", icon: "👶" },
                    { label: "Grandparents", icon: "🧓" },
                    { label: "Group / Friend", icon: "👯‍♀️" },
                  ].map((member) => (
                    <button
                      key={member.label}
                      type="button"
                      onClick={() => setBookingFor(member.label)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: 12,
                        border: bookingFor === member.label ? "2px solid #e11d48" : "1px solid #e2e8f0",
                        background: bookingFor === member.label ? "#fce7f3" : "#f8fafc",
                        color: bookingFor === member.label ? "#9d174d" : "#0f172a",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        justifyContent: "center",
                      }}
                    >
                      <span>{member.icon}</span> {member.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: "0.875rem", borderRadius: 14, border: "2px solid #e2e8f0", background: "white", color: "#0f172a", fontWeight: 700 }}>
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  style={{ flex: 2, padding: "0.875rem", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #e11d48, #db2777)", color: "white", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}
                >
                  Review Summary
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Booking Summary */}
          {step === 4 && pro && (
            <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.5rem" }}>
                Step 4: Booking Summary
              </h2>

              <div style={{ background: "#f8fafc", borderRadius: 18, padding: "1.5rem", border: "1px solid #f1f5f9", marginBottom: "1.5rem" }}>
                {isCartMode ? (
                  <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: 8 }}>
                      Package Services ({cartItems.length}):
                    </div>
                    {cartItems.map((it) => (
                      <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#475569", marginBottom: 4 }}>
                        <span>• {it.name} (x{it.quantity})</span>
                        <span style={{ fontWeight: 700 }}>₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                    <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 8 }}>
                      Assigned Professional: <strong>{pro.name}</strong>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>{selectedService?.name}</div>
                      <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Professional: {pro.name}</div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "1.25rem", color: "#0f172a" }}>₹{selectedService?.price}</div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.875rem", color: "#475569", marginBottom: "1rem" }}>
                  <div>📅 <strong>Date:</strong> {selectedDate}</div>
                  <div>⏰ <strong>Time:</strong> {selectedSlot}</div>
                  <div>⏱ <strong>Duration:</strong> {totalMinutes} Minutes</div>
                  <div>👤 <strong>Recipient:</strong> {bookingFor}</div>
                  <div style={{ gridColumn: "span 2" }}>📍 <strong>Address:</strong> {address}</div>
                </div>
              </div>

              {/* Wallet Credits Toggle */}
              {balance > 0 && (
                <div
                  style={{
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    borderRadius: 14,
                    padding: "1rem 1.25rem",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                      <Wallet size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: "#065f46", fontSize: "0.9rem" }}>
                        Use GlowNXT Wallet Credits
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#047857" }}>
                        Available balance: ₹{balance} (Max ₹150 off per booking)
                      </div>
                    </div>
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700, color: "#065f46", fontSize: "0.85rem" }}>
                    <input
                      type="checkbox"
                      checked={useWalletCredits}
                      onChange={(e) => setUseWalletCredits(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: "#059669", cursor: "pointer" }}
                    />
                    <span>Apply (-₹{Math.min(balance, 150)})</span>
                  </label>
                </div>
              )}

              {/* Promo Code */}
              <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter Promo Code (Try BEAUTY200)"
                  style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: 12, border: "2px solid #e2e8f0", outline: "none", fontSize: "0.875rem" }}
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  style={{ background: "#0f172a", color: "white", padding: "0.75rem 1.25rem", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Apply
                </button>
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 6, fontSize: "0.9rem" }}>
                  <span>Base Total</span>
                  <span>₹{basePrice}</span>
                </div>

                {comboDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#be185d", marginBottom: 6, fontSize: "0.9rem", fontWeight: 700 }}>
                    <span>Mega Combo Discount ({cartBundlePercent}%)</span>
                    <span>-₹{comboDiscount}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a", marginBottom: 6, fontSize: "0.9rem", fontWeight: 700 }}>
                    <span>Promo Coupon (BEAUTY200)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                {walletDeduction > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#059669", marginBottom: 6, fontSize: "0.9rem", fontWeight: 700 }}>
                    <span>Wallet Credits Deducted</span>
                    <span>-₹{walletDeduction}</span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 12, fontSize: "0.9rem" }}>
                  <span>Single-use Sealed Kit & Sanitization</span>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>FREE</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#0f172a", fontWeight: 900, fontSize: "1.25rem", paddingTop: 10, borderTop: "2px dashed #e2e8f0" }}>
                  <span>Final Amount Payable</span>
                  <span style={{ color: "#e11d48" }}>₹{finalPrice}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: "0.875rem", borderRadius: 14, border: "2px solid #e2e8f0", background: "white", color: "#0f172a", fontWeight: 700 }}>
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  style={{ flex: 2, padding: "0.875rem", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #e11d48, #db2777)", color: "white", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Payment */}
          {step === 5 && (
            <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 900, color: "#0f172a", marginBottom: "1.5rem" }}>
                Step 5: Select Payment Method
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { id: "upi", title: "UPI (Google Pay / PhonePe / Paytm)", desc: "Instant payment with zero transaction fees", icon: "⚡" },
                  { id: "card", title: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay cards accepted", icon: "💳" },
                  { id: "cash", title: "Pay After Service (Cash / UPI QR)", desc: "Inspect single-use seals and pay after appointment", icon: "💵" },
                ].map((pay) => (
                  <div
                    key={pay.id}
                    onClick={() => setPaymentMethod(pay.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "1.25rem",
                      borderRadius: 16,
                      border: paymentMethod === pay.id ? "2px solid #e11d48" : "1px solid #e2e8f0",
                      background: paymentMethod === pay.id ? "#fce7f315" : "white",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "1.75rem" }}>{pay.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>{pay.title}</div>
                      <div style={{ color: "#64748b", fontSize: "0.78rem" }}>{pay.desc}</div>
                    </div>
                    {paymentMethod === pay.id && <span style={{ color: "#e11d48", fontWeight: 800 }}>✓ Selected</span>}
                  </div>
                ))}
              </div>

              {!user && (
                <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", color: "#92400e", padding: "1rem", borderRadius: 14, marginBottom: "1.5rem", fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>You must be logged in to confirm bookings.</div>
                  <Link href="/auth/login" style={{ background: "#92400e", color: "white", padding: "0.5rem 1rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, alignSelf: "flex-start" }}>
                    Log In Now
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={submitting || !user}
                style={{
                  width: "100%",
                  padding: "1.125rem",
                  borderRadius: 14,
                  border: "none",
                  background: submitting || !user ? "#cbd5e1" : "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  cursor: submitting || !user ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: submitting || !user ? "none" : "0 8px 24px rgba(16,185,129,0.35)",
                }}
              >
                {submitting ? "Booking appointment..." : (
                  <>
                    <Sparkles size={20} /> Pay & Confirm Booking (₹{finalPrice})
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 6: Confirmation Screen */}
          {step === 6 && pro && (
            <div style={{ background: "white", borderRadius: 24, padding: "3rem 2rem", textAlign: "center", border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background: "#dcfce7",
                  color: "#166534",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  fontSize: "2.25rem",
                }}
              >
                🎉
              </div>

              <span style={{ background: "#dcfce7", color: "#166534", fontWeight: 800, fontSize: "0.75rem", padding: "0.3rem 1rem", borderRadius: 99, display: "inline-block", marginBottom: "0.75rem" }}>
                BOOKING CONFIRMED!
              </span>

              <h1 style={{ fontSize: "2.25rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.75rem" }}>
                You're All Set!
              </h1>
              <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 480, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
                Your appointment with <strong style={{ color: "#0f172a" }}>{pro.name}</strong> is confirmed. A background-verified expert is scheduled to arrive at your doorstep.
              </p>

              {/* SECURITY OTP HIGHLIGHT */}
              <div
                style={{
                  background: "linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%)",
                  border: "2px dashed #f43f5e",
                  borderRadius: 18,
                  padding: "1.5rem",
                  maxWidth: 480,
                  margin: "0 auto 1.5rem auto",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#be123c", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Your Doorstep Start OTP
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#e11d48", letterSpacing: "0.2em", margin: "6px 0" }}>
                  {startOtp}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#475569" }}>
                  Give this code to <strong>{pro.name}</strong> only after inspecting single-use product seal kits.
                </div>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: 20, padding: "1.25rem 1.5rem", maxWidth: 480, margin: "0 auto 1.75rem", textAlign: "left", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>Booking ID:</span>
                  <strong style={{ color: "#0f172a" }}>#{confirmedBookingId.substring(0, 8).toUpperCase()}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>Date & Time:</span>
                  <strong style={{ color: "#0f172a" }}>{selectedDate} at {selectedSlot}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>Recipient:</span>
                  <strong style={{ color: "#0f172a" }}>{bookingFor}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>Amount:</span>
                  <span style={{ color: "#10b981", fontWeight: 800 }}>₹{finalPrice} ({paymentMethod.toUpperCase()})</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hey! I just booked my at-home beauty service with GlowNXT. Booking ID: #${confirmedBookingId.substring(0, 8).toUpperCase()} on ${selectedDate} at ${selectedSlot}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    background: "#22c55e",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    padding: "0.85rem 1.5rem",
                    borderRadius: 99,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                  }}
                >
                  <MessageCircle size={18} /> Share on WhatsApp
                </a>

                <Link
                  href="/dashboard/customer"
                  style={{
                    textDecoration: "none",
                    background: "linear-gradient(135deg, #e11d48, #db2777)",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    padding: "0.85rem 1.75rem",
                    borderRadius: 99,
                    boxShadow: "0 6px 20px rgba(225,29,72,0.35)",
                  }}
                >
                  Track in Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingWizardPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#94a3b8", fontWeight: 700 }}>
          Loading Booking Details...
        </div>
      }
    >
      <BookingWizardContent params={params} />
    </Suspense>
  );
}
