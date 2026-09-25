"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Sparkles } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed)
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isInStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Check if previously dismissed recently
    const dismissedAt = localStorage.getItem("glownxt_pwa_dismissed");
    if (dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 24 * 60 * 60 * 1000) {
      return;
    }

    // Check if iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If iOS and not installed, show helper prompt after 4 seconds
    let iosTimer: NodeJS.Timeout | null = null;
    if (isIosDevice && !isInStandaloneMode) {
      iosTimer = setTimeout(() => setShowPrompt(true), 4000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("glownxt_pwa_dismissed", Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 20,
        right: 20,
        maxWidth: 420,
        margin: "0 auto",
        zIndex: 9999,
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          borderRadius: 20,
          padding: "16px 18px",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* GlowNXT Mini Icon */}
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "linear-gradient(135deg, #e11d48, #db2777)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(225,29,72,0.45)",
          }}
        >
          <Sparkles size={24} color="white" />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
              Glow<span style={{ color: "#fb7185" }}>NXT</span> App
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                background: "rgba(225,29,72,0.25)",
                color: "#fda4af",
                padding: "2px 6px",
                borderRadius: 999,
                fontWeight: 700,
                border: "1px solid rgba(225,29,72,0.35)",
              }}
            >
              FREE
            </span>
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginTop: 2,
              lineHeight: 1.3,
            }}
          >
            {isIOS
              ? "Tap Share (⬆️) and choose 'Add to Home Screen'"
              : "Install for 1-tap fast doorstep salon booking"}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              style={{
                background: "linear-gradient(135deg, #e11d48, #be123c)",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "8px 14px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                boxShadow: "0 4px 12px rgba(225,29,72,0.4)",
              }}
            >
              <Download size={14} /> Install
            </button>
          ) : isIOS ? (
            <span style={{ fontSize: "1rem" }}>📲</span>
          ) : null}

          <button
            onClick={handleDismiss}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
