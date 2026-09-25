"use client";

import { useState } from "react";
import { X, CheckCircle, ShieldCheck, QrCode, CreditCard, Smartphone, Wallet, Lock, Download, Sparkles } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title?: string;
  onSuccess: (paymentId: string) => void;
}

export default function PaymentModal({ isOpen, onClose, amount, title = "Order & Booking Checkout", onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [upiApp, setUpiApp] = useState<"gpay" | "phonepe" | "paytm">("gpay");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [txnId, setTxnId] = useState("");

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  if (!isOpen) return null;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      const generatedTxn = "PAY-" + Math.floor(100000 + Math.random() * 900000);
      setTxnId(generatedTxn);
      setLoading(false);
      setCompleted(true);
      onSuccess(generatedTxn);
    }, 1800);
  };

  const appOwnerCommission = Math.round(amount * 0.15); // 15% App Owner Commission
  const vendorPayout = Math.round(amount * 0.85); // 85% Vendor & Pro Payout

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(15,23,42,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          maxWidth: 520,
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          border: "1px solid #e2e8f0",
          animation: "scaleUp 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", padding: "1.5rem", color: "white", position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              borderRadius: 99,
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
          <span style={{ background: "rgba(34,197,94,0.2)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.4)", padding: "0.2rem 0.6rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase" }}>
            🔒 256-Bit SSL Secured Payment
          </span>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 900, marginTop: 8 }}>{title}</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12 }}>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Total Payable Amount:</span>
            <span style={{ fontSize: "2rem", fontWeight: 900, color: "#4ade80" }}>₹{amount}</span>
          </div>
        </div>

        {/* Content */}
        {!completed ? (
          <div style={{ padding: "1.5rem" }}>
            {/* Payment Method Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.5rem" }}>
              {[
                { id: "upi", label: "Instant UPI (GPay/PhonePe)", icon: QrCode },
                { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                { id: "netbanking", label: "NetBanking", icon: Smartphone },
                { id: "wallet", label: "GlowNXT Wallet", icon: Wallet },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  style={{
                    padding: "0.75rem",
                    borderRadius: 14,
                    border: method === m.id ? "2px solid #e11d48" : "1px solid #e2e8f0",
                    background: method === m.id ? "#fff1f2" : "#f8fafc",
                    color: method === m.id ? "#e11d48" : "#475569",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    textAlign: "left",
                  }}
                >
                  <m.icon size={16} /> {m.label}
                </button>
              ))}
            </div>

            {/* Method Details */}
            {method === "upi" && (
              <div style={{ background: "#f8fafc", borderRadius: 16, padding: "1.25rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                  Scan UPI QR Code or Select UPI App:
                </p>
                <div style={{ background: "white", padding: 12, borderRadius: 16, border: "1px solid #cbd5e1", display: "inline-block", marginBottom: 12 }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=glownxt@upi&pn=GlowNXT&am=${amount}&cu=INR`}
                    alt="UPI QR Code"
                    width={140}
                    height={140}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  {[
                    { id: "gpay", label: "Google Pay 🟢" },
                    { id: "phonepe", label: "PhonePe 🟣" },
                    { id: "paytm", label: "Paytm 🔵" },
                  ].map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setUpiApp(app.id as any)}
                      style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: 8,
                        border: upiApp === app.id ? "2px solid #0f172a" : "1px solid #cbd5e1",
                        background: upiApp === app.id ? "#0f172a" : "white",
                        color: upiApp === app.id ? "white" : "#334155",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {method === "card" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
                <input
                  type="text"
                  placeholder="Card Number (4532 XXXX XXXX 8921)"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: "0.875rem", outline: "none" }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: "0.875rem", outline: "none" }}
                  />
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="CVV (***)"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: "0.875rem", outline: "none" }}
                  />
                </div>
              </div>
            )}

            {/* Hyperlocal Commission Breakdown Note */}
            <div style={{ background: "#ecfdf5", borderRadius: 12, padding: "0.75rem", border: "1px solid #a7f3d0", marginBottom: "1.5rem", fontSize: "0.75rem", color: "#065f46" }}>
              💡 <strong>Swiggy/Zomato Model Transparency:</strong>
              <div>• App Owner Platform Fee (15%): <strong>₹{appOwnerCommission}</strong></div>
              <div>• Local Vendor & Beautician Payout (85%): <strong>₹{vendorPayout}</strong></div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                border: "none",
                padding: "1rem",
                borderRadius: 14,
                fontWeight: 900,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(16,185,129,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? "Processing Secure Payment..." : `Pay ₹${amount} Now`}
            </button>
          </div>
        ) : (
          /* Payment Completed Success View */
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.4rem", marginBottom: 4 }}>
              Payment Successful! 🎉
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Transaction ID: <strong style={{ color: "#0f172a" }}>{txnId}</strong>
            </p>

            <div style={{ background: "#f8fafc", borderRadius: 16, padding: "1rem", border: "1px solid #e2e8f0", textAlign: "left", marginBottom: "1.5rem", fontSize: "0.8rem", color: "#334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>Paid Amount:</span>
                <strong>₹{amount}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>Payment Mode:</span>
                <strong style={{ textTransform: "uppercase" }}>{method}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Status:</span>
                <strong style={{ color: "#16a34a" }}>CONFIRMED ✅</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                background: "#0f172a",
                color: "white",
                border: "none",
                padding: "0.875rem",
                borderRadius: 12,
                fontWeight: 800,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Close & View Booking Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
