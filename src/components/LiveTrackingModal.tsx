"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, MapPin, Phone, MessageCircle, ShieldCheck, Clock, Navigation, CheckCircle2 } from "lucide-react";

interface LiveTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    serviceName: string;
    professionalName: string;
    professionalAvatar?: string;
    address: string;
    date: string;
    timeSlot: string;
    startOtp?: string;
  };
}

export default function LiveTrackingModal({ isOpen, onClose, booking }: LiveTrackingModalProps) {
  const [etaMinutes, setEtaMinutes] = useState(14);
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setEtaMinutes((prev) => (prev > 2 ? prev - 1 : 2));
      setProgress((prev) => (prev < 90 ? prev + 5 : 92));
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate deterministic 4-digit OTP if not provided
  const otp = booking.startOtp || "4829";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: "relative",
          background: "#ffffff",
          borderRadius: 24,
          maxWidth: 500,
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
          zIndex: 10000,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
              }}
            >
              <Navigation size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0 }}>Live Pro Tracking</h3>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Order #{booking.id.slice(-6).toUpperCase()}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 99,
              width: 32,
              height: 32,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Live GPS Map Simulation Graphic */}
        <div
          style={{
            position: "relative",
            height: 180,
            background: "#e0f2fe",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Simulated Map Roads */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }}>
            <line x1="0" y1="50" x2="500" y2="50" stroke="#0284c7" strokeWidth="8" />
            <line x1="0" y1="130" x2="500" y2="130" stroke="#0284c7" strokeWidth="12" />
            <line x1="120" y1="0" x2="120" y2="200" stroke="#0284c7" strokeWidth="10" />
            <line x1="380" y1="0" x2="380" y2="200" stroke="#0284c7" strokeWidth="8" />
            {/* Route track */}
            <path
              d="M 60 130 Q 220 80 420 70"
              stroke="#e11d48"
              strokeWidth="4"
              strokeDasharray="6 6"
              fill="none"
            />
          </svg>

          {/* Customer Destination Marker */}
          <div
            style={{
              position: "absolute",
              top: 45,
              right: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <div
              style={{
                background: "#0f172a",
                color: "white",
                padding: "3px 8px",
                borderRadius: 6,
                fontSize: "0.65rem",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              Your Home
            </div>
            <MapPin size={28} color="#0f172a" fill="#38bdf8" />
          </div>

          {/* Moving Professional Marker */}
          <div
            style={{
              position: "absolute",
              top: 85,
              left: `${progress}%`,
              transform: "translateX(-50%)",
              transition: "left 1s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 3,
            }}
          >
            <div
              style={{
                background: "#e11d48",
                color: "white",
                padding: "4px 10px",
                borderRadius: 99,
                fontSize: "0.7rem",
                fontWeight: 800,
                boxShadow: "0 4px 12px rgba(225,29,72,0.4)",
                marginBottom: 4,
                whiteSpace: "nowrap",
              }}
            >
              🛵 {etaMinutes} mins away
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "white",
                border: "3px solid #e11d48",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <span style={{ fontSize: "1rem" }}>👩‍🦰</span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div style={{ padding: "1.5rem" }}>
          {/* Pro info card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              background: "#f8fafc",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  position: "relative",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#fda4af",
                }}
              >
                {booking.professionalAvatar ? (
                  <Image src={booking.professionalAvatar} alt={booking.professionalName} fill style={{ objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#e11d48" }}>
                    {booking.professionalName[0]}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                  {booking.professionalName}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                  <ShieldCheck size={14} /> Police Verified Pro • Honda Activa
                </div>
              </div>
            </div>

            {/* Quick Contact buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <a
                href="tel:9876543210"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f172a",
                  textDecoration: "none",
                }}
                title="Call Pro"
              >
                <Phone size={16} />
              </a>
              <a
                href={`https://wa.me/919876543210?text=Hi%20${encodeURIComponent(booking.professionalName)},%20I%20am%20tracking%20my%20booking%20for%20${encodeURIComponent(booking.serviceName)}.`}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#22c55e",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textDecoration: "none",
                }}
                title="WhatsApp Pro"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* START OTP SECURITY BANNER */}
          <div
            style={{
              background: "linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)",
              border: "2px dashed #f43f5e",
              borderRadius: 16,
              padding: "1.25rem",
              textAlign: "center",
              marginBottom: "1.25rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#be123c", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Doorstep Security Verification
            </span>
            <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: 4 }}>
              Share this Start OTP only after verifying kit seals:
            </div>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: 900,
                letterSpacing: "0.25em",
                color: "#e11d48",
                margin: "8px 0",
              }}
            >
              {otp}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#9f1239", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <CheckCircle2 size={14} /> Service will not start without this OTP
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.8rem", color: "#64748b" }}>
            <MapPin size={16} color="#e11d48" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>Delivering to: <strong style={{ color: "#0f172a" }}>{booking.address}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
