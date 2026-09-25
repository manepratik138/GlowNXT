"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    const steps = [
      { target: 30, delay: 200 },
      { target: 65, delay: 600 },
      { target: 90, delay: 1100 },
      { target: 100, delay: 1800 },
    ];
    steps.forEach(({ target, delay }) => {
      setTimeout(() => setProgress(target), delay);
    });
    setTimeout(() => setPhase("done"), 2200);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="loading-screen"
      style={{ animation: (phase as string) === "done" ? "fadeIn 0.4s ease reverse forwards" : undefined }}
    >
      {/* Ambient blobs */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(219,39,119,0.3), transparent 70%)",
          top: "10%",
          left: "20%",
          filter: "blur(60px)",
          animation: "float 5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)",
          bottom: "15%",
          right: "15%",
          filter: "blur(50px)",
          animation: "float 6s ease-in-out infinite reverse",
        }}
      />

      {/* Logo */}
      <div className="animate-scale-in" style={{ textAlign: "center", zIndex: 1 }}>
        <div
          className="pulse-ring"
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e11d48, #db2777)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 0 60px rgba(225,29,72,0.5)",
          }}
        >
          <Sparkles size={44} color="white" />
        </div>

        <h1
          style={{
            fontSize: "2.75rem",
            fontWeight: 900,
            color: "white",
            letterSpacing: "-0.02em",
            marginBottom: "0.25rem",
          }}
        >
          Glow<span style={{ color: "#fb7185" }}>NXT</span>
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: 400,
            color: "rgba(255,255,255,0.8)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Salon &amp; Spa At Home
        </p>
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.08em",
          }}
        >
          India&apos;s Premium Beauty Marketplace
        </p>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: 280,
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <div
          style={{
            height: 4,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 99,
            overflow: "hidden",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #e11d48, #f59e0b)",
              borderRadius: 99,
              transition: "width 0.6s ease",
              boxShadow: "0 0 12px rgba(225,29,72,0.8)",
            }}
          />
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
          {progress < 40 ? "Loading services..." : progress < 80 ? "Connecting professionals..." : "Almost ready..."}
        </p>
      </div>

      {/* Bottom tagline */}
      <p
        className="animate-fade-in delay-500"
        style={{
          position: "absolute",
          bottom: "2rem",
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        ✨ Luxury beauty, delivered to your door
      </p>
    </div>
  );
}
