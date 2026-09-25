"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Bot, User, ArrowRight, Check, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";
import { SERVICES } from "@/lib/data";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  recommendedService?: {
    id: string;
    name: string;
    price: number;
    duration: number;
    category: string;
  };
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m_init",
    sender: "bot",
    text: "Hi there! I'm BeautyGenie, your personal AI beauty consultant. ✨ Ask me for package recommendations, skin routines, or bridal combos (English, मराठी, हिंदी)!",
  },
];

const SUGGESTED_QUESTIONS = [
  "Bridal & Wedding packages 👰",
  "Best facial under ₹1500 ✨",
  "Oily skin routine advice 💧",
  "मराठीत सांगा 🚩",
  "Combo offers & discounts 🏷️",
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart, isItemInCart } = useCart();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (userText?: string) => {
    const query = (userText || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      let replyText = "";
      let recService: ChatMessage["recommendedService"] = undefined;

      if (lower.includes("मराठी") || lower.includes("marathi") || lower.includes("lagna") || lower.includes("namaskar")) {
        setLanguage("mr");
        if (lower.includes("lagna") || lower.includes("लग्न") || lower.includes("bridal")) {
          replyText = "नमस्कार! लग्नाच्या समारंभासाठी आमचे 'Royal Bridal Glow' आणि 'Bridal Mehendi Package' सर्वोत्तम आहेत. यात १००% सॅनिटाईझ्ड किट आणि ५-स्टार मेकअॅप आर्टिस्ट मिळतात. खालील पॅकेज थेट कार्टमध्ये जोडू शकता:";
          const bridal = SERVICES.find((s) => s.id === "s8") || SERVICES[7];
          recService = {
            id: bridal.id,
            name: bridal.name,
            price: bridal.price,
            duration: bridal.duration,
            category: bridal.category,
          };
        } else if (lower.includes("oily") || lower.includes("पिंपल") || lower.includes("skin") || lower.includes("त्वचा")) {
          replyText = "ऑइली आणि पिंपल-प्रोन त्वचेसाठी आमचा 'Hydra-Boost Glow Facial' सर्वोत्तम ठरतो. यामुळे अतिरिक्त ऑइल आणि ब्लॅकहेड्स दूर होतात.";
          const facial = SERVICES.find((s) => s.id === "s1") || SERVICES[0];
          recService = {
            id: facial.id,
            name: facial.name,
            price: facial.price,
            duration: facial.duration,
            category: facial.category,
          };
        } else {
          replyText = "नमस्कार! मी ब्युटीजिनी AI आहे. तुम्ही घरबसल्या फेशिअल, हेअर स्पा, वॅक्सिंग, किंवा लग्नाचे मेकअॅप पॅकेज बुक करू शकता. २ पेक्षा जास्त सर्व्हिसेस निवडल्यास तुम्हाला थेट १०% ते २०% बंडल डिस्काउंट मिळेल!";
        }
      } else if (lower.includes("bridal") || lower.includes("wedding") || lower.includes("marriage")) {
        replyText = "For wedding celebrations, we recommend our curated Bridal Makeover Suite. Includes pre-bridal skincare prep, HD bridal makeup, and traditional hair styling by verified senior artists.";
        const bridal = SERVICES.find((s) => s.id === "s8") || SERVICES[7];
        recService = {
          id: bridal.id,
          name: bridal.name,
          price: bridal.price,
          duration: bridal.duration,
          category: bridal.category,
        };
      } else if (lower.includes("1500") || lower.includes("cheap") || lower.includes("budget") || lower.includes("under")) {
        replyText = "Here is our top-rated express treatment under ₹1500! Comes with deep exfoliation, soothing face massage, and radiant finish:";
        const service = SERVICES.find((s) => s.price <= 1500) || SERVICES[0];
        recService = {
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          category: service.category,
        };
      } else if (lower.includes("oily") || lower.includes("acne") || lower.includes("pore")) {
        replyText = "For oily or acne-prone skin, dermatologists recommend gentle salicylic acid & deep pore clarifying treatment. Our Luxury Facial Treatment delivers immediate hydration balance:";
        const facial = SERVICES.find((s) => s.id === "s1") || SERVICES[0];
        recService = {
          id: facial.id,
          name: facial.name,
          price: facial.price,
          duration: facial.duration,
          category: facial.category,
        };
      } else if (lower.includes("offer") || lower.includes("discount") || lower.includes("combo") || lower.includes("bundle")) {
        replyText = "🎁 We have an active 'Make Your Own Combo' deal! Select any 2 services to get 10% OFF, or 3+ services to get 20% MEGA OFF automatically at checkout. Plus, you have ₹250 welcome credits in your wallet!";
      } else {
        replyText = "I'd love to help you with that! You can explore our 100+ doorstep beauty services, or take our 60-second AI Skin Scanner at /ai-analyzer for an accurate diagnostic report.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "b_" + Date.now(),
          sender: "bot",
          text: replyText,
          recommendedService: recService,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9000,
          background: "linear-gradient(135deg, #e11d48 0%, #db2777 50%, #9333ea 100%)",
          color: "white",
          border: "none",
          borderRadius: 999,
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 8px 30px rgba(225, 29, 72, 0.45)",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "0.9rem",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div style={{ position: "relative" }}>
          <Sparkles size={20} />
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              background: "#22c55e",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </div>
        <span>Ask BeautyGenie AI</span>
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 84,
            right: 24,
            width: "calc(100vw - 32px)",
            maxWidth: 390,
            height: 540,
            background: "#ffffff",
            borderRadius: 24,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9001,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)",
              color: "white",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #e11d48, #db2777)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(225, 29, 72, 0.4)",
                }}
              >
                <Bot size={22} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 6 }}>
                  BeautyGenie AI
                  <span style={{ fontSize: "0.65rem", background: "#22c55e", color: "white", padding: "1px 6px", borderRadius: 99 }}>
                    Online
                  </span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "#cbd5e1" }}>Smart Beauty & Package Consultant</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 99,
                width: 30,
                height: 30,
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

          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "#f8fafc",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "0.75rem 1rem",
                    borderRadius: 18,
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(135deg, #e11d48, #db2777)"
                        : "#ffffff",
                    color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                    boxShadow: msg.sender === "user" ? "0 4px 14px rgba(225, 29, 72, 0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
                    border: msg.sender === "user" ? "none" : "1px solid #e2e8f0",
                    borderBottomRightRadius: msg.sender === "user" ? 4 : 18,
                    borderBottomLeftRadius: msg.sender === "user" ? 18 : 4,
                  }}
                >
                  {msg.text}
                </div>

                {/* Direct recommendation card inside chat */}
                {msg.recommendedService && (
                  <div
                    style={{
                      marginTop: 8,
                      width: "100%",
                      maxWidth: 280,
                      background: "white",
                      border: "1px solid #fda4af",
                      borderRadius: 14,
                      padding: "0.75rem",
                      boxShadow: "0 4px 12px rgba(225, 29, 72, 0.08)",
                    }}
                  >
                    <div style={{ fontSize: "0.7rem", color: "#e11d48", fontWeight: 700, textTransform: "uppercase" }}>
                      Recommended For You
                    </div>
                    <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.85rem", margin: "2px 0 6px" }}>
                      {msg.recommendedService.name}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 900, color: "#0f172a", fontSize: "0.95rem" }}>
                        ₹{msg.recommendedService.price}
                      </div>
                      <button
                        onClick={() => {
                          if (msg.recommendedService) {
                            addToCart({
                              id: msg.recommendedService.id,
                              name: msg.recommendedService.name,
                              price: msg.recommendedService.price,
                              duration: msg.recommendedService.duration,
                              category: msg.recommendedService.category,
                            });
                          }
                        }}
                        style={{
                          background: isItemInCart(msg.recommendedService.id)
                            ? "#10b981"
                            : "linear-gradient(135deg, #e11d48, #db2777)",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          padding: "5px 10px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {isItemInCart(msg.recommendedService.id) ? (
                          <>
                            <Check size={12} /> In Cart
                          </>
                        ) : (
                          <>
                            <Plus size={12} /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "white",
                  padding: "8px 14px",
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                }}
              >
                Thinking & searching packages...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div
            style={{
              padding: "6px 12px",
              background: "#ffffff",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: 99,
                  padding: "4px 10px",
                  fontSize: "0.7rem",
                  color: "#475569",
                  cursor: "pointer",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "#ffffff",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              type="text"
              placeholder="Ask anything (उदा. फेशिअल, पॅकेज)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{
                flex: 1,
                border: "1px solid #cbd5e1",
                borderRadius: 12,
                padding: "8px 12px",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            <button
              onClick={() => handleSend()}
              style={{
                background: "linear-gradient(135deg, #e11d48, #db2777)",
                color: "white",
                border: "none",
                borderRadius: 12,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
