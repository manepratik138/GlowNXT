"use client";

import React from "react";
import { AlertTriangle, X, Phone, ShieldAlert, Share2, MapPin } from "lucide-react";
import { localDb } from "@/lib/localStore";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  bookingId?: string;
}

export default function SOSModal({ isOpen, onClose, userId, bookingId }: SOSModalProps) {
  if (!isOpen) return null;

  const recordSafetyReport = () => {
    localDb.setDoc("safetyReports", `safety_${Date.now()}`, {
      reporterId: userId || "anonymous",
      bookingId: bookingId || null,
      category: "emergency",
      severity: "high",
      status: "open",
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(6px)",
        }}
      />

      <div
        style={{
          position: "relative",
          background: "#ffffff",
          borderRadius: 24,
          maxWidth: 440,
          width: "100%",
          padding: "2rem",
          boxShadow: "0 25px 60px rgba(225, 29, 72, 0.3)",
          border: "2px solid #f43f5e",
          zIndex: 100000,
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#f1f5f9",
            border: "none",
            borderRadius: 99,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <X size={16} />
        </button>

        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fee2e2",
            color: "#dc2626",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <AlertTriangle size={36} />
        </div>

        <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "#991b1b", marginBottom: 6 }}>
          Emergency Safety Assistance
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5, marginBottom: "1.5rem" }}>
          For any safety concerns during an ongoing service, tap immediately to connect with authorities or our 24x7 Safety Response Team.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
          {/* Emergency 112 */}
          <a
            href="tel:112"
            onClick={recordSafetyReport}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#dc2626",
              color: "white",
              padding: "0.9rem",
              borderRadius: 14,
              fontWeight: 800,
              fontSize: "1rem",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.4)",
            }}
          >
            <Phone size={18} /> Call National Emergency (112)
          </a>

          {/* Women Helpline */}
          <a
            href="tel:1091"
            onClick={recordSafetyReport}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#ea580c",
              color: "white",
              padding: "0.85rem",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            <ShieldAlert size={18} /> Women Helpline (1091)
          </a>

          {/* 24x7 Platform Helpline */}
          <a
            href="tel:18002008888"
            onClick={recordSafetyReport}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#0f172a",
              color: "white",
              padding: "0.85rem",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            <Phone size={16} /> GlowNXT 24x7 Safety Team
          </a>
        </div>

        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
          Your emergency action is recorded locally for support follow-up. For immediate danger, call 112.
        </div>
      </div>
    </div>
  );
}
