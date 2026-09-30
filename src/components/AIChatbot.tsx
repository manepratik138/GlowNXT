"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Bot, Check, Plus, Camera, ImagePlus } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";
import { SERVICES } from "@/lib/data";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  imageUrl?: string;
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

type PhotoConcern = "pimples" | "dryness" | "oiliness" | "pigmentation";

const PHOTO_CONCERNS: Array<{ id: PhotoConcern; en: string; mr: string }> = [
  { id: "pimples", en: "Pimples / acne", mr: "पिंपल्स / अॅक्ने" },
  { id: "dryness", en: "Dryness / flaking", mr: "कोरडेपणा / त्वचा निघणे" },
  { id: "oiliness", en: "Oiliness / open pores", mr: "ऑइली त्वचा / ओपन पोअर्स" },
  { id: "pigmentation", en: "Dark spots / tanning", mr: "डार्क स्पॉट्स / टॅनिंग" },
];

const photoAdvice: Record<PhotoConcern, { en: string; mr: string; serviceId: string }> = {
  pimples: {
    en: "The photo suggests areas that may be acne-prone. Use a gentle cleanser, avoid squeezing spots, and choose non-comedogenic products. A professional can confirm the right treatment.",
    mr: "फोटोमध्ये अॅक्ने-प्रोन भाग दिसत आहेत. सौम्य क्लेन्सर वापरा, पिंपल्स दाबू नका आणि non-comedogenic प्रॉडक्ट्स निवडा. योग्य ट्रीटमेंटसाठी तज्ज्ञांचा सल्ला घ्या.",
    serviceId: "s1",
  },
  dryness: {
    en: "The photo suggests possible dryness or a weakened moisture barrier. Use a fragrance-free moisturiser, avoid hot water, and apply sunscreen during the day.",
    mr: "फोटोमध्ये कोरडेपणा किंवा moisture barrier कमकुवत असल्याची शक्यता दिसते. fragrance-free मॉइश्चरायझर वापरा, गरम पाणी टाळा आणि दिवसा सनस्क्रीन लावा.",
    serviceId: "s1",
  },
  oiliness: {
    en: "The photo suggests visible shine around the T-zone. Use a gentle cleanser twice daily, avoid harsh scrubbing, and choose a light gel moisturiser.",
    mr: "फोटोमध्ये T-zone भागात जास्त shine दिसत आहे. दिवसातून दोनदा सौम्य क्लेन्सर वापरा, जोरात स्क्रब करू नका आणि हलका gel मॉइश्चरायझर वापरा.",
    serviceId: "s1",
  },
  pigmentation: {
    en: "The photo suggests uneven tone or dark spots. Daily broad-spectrum sunscreen is the most important step; a dermatologist can assess the cause before active treatments.",
    mr: "फोटोमध्ये skin tone uneven किंवा डार्क स्पॉट्स दिसत आहेत. रोज broad-spectrum सनस्क्रीन लावणे सर्वात महत्त्वाचे आहे; active treatment आधी dermatologist कडून कारण तपासून घ्या.",
    serviceId: "s1",
  },
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoConcern, setPhotoConcern] = useState<PhotoConcern>("pimples");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const messageIdRef = useRef(0);
  const { addToCart, isItemInCart } = useCart();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const nextMessageId = (prefix: string) => `${prefix}_${messageIdRef.current++}`;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const photoUrl = URL.createObjectURL(file);
    setSelectedPhoto((previousPhoto) => {
      if (previousPhoto) URL.revokeObjectURL(previousPhoto);
      return photoUrl;
    });
    setMessages((previous) => [
      ...previous,
      {
        id: nextMessageId("u_photo"),
        sender: "user",
        text: language === "mr" ? "माझ्या चेहऱ्याचा फोटो तपासा." : "Please check my face photo.",
        imageUrl: photoUrl,
      },
    ]);
    setIsTyping(false);
    event.target.value = "";
  };

  const analyzePhoto = () => {
    if (!selectedPhoto) return;

    const advice = photoAdvice[photoConcern];
    const service = SERVICES.find((item) => item.id === advice.serviceId) || SERVICES[0];
    setIsTyping(true);
    window.setTimeout(() => {
      const text = language === "mr"
        ? `${advice.mr}\n\nही visual guidance आहे, medical diagnosis नाही. त्रास वाढत असेल तर dermatologist ला भेटा.`
        : `${advice.en}\n\nThis is visual guidance, not a medical diagnosis. Please see a dermatologist if the concern persists or worsens.`;
      setMessages((previous) => [
        ...previous,
        {
          id: nextMessageId("b_photo"),
          sender: "bot",
          text,
          recommendedService: {
            id: service.id,
            name: service.name,
            price: service.price,
            duration: service.duration,
            category: service.category,
          },
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleSend = (userText?: string) => {
    const query = (userText || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: nextMessageId("u"),
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
          id: nextMessageId("b"),
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
        className="beautygenie-trigger"
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
          className="beautygenie-window"
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

            <div style={{ display: "flex", gap: 4, marginLeft: "auto", marginRight: 8 }}>
              {(["en", "mr"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setLanguage(option)}
                  aria-label={option === "en" ? "Use English" : "मराठी वापरा"}
                  style={{
                    border: language === option ? "1px solid white" : "1px solid rgba(255,255,255,0.3)",
                    background: language === option ? "white" : "transparent",
                    color: language === option ? "#0f172a" : "white",
                    borderRadius: 6,
                    padding: "3px 7px",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {option === "en" ? "EN" : "मराठी"}
                </button>
              ))}
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

                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt={language === "mr" ? "अपलोड केलेला चेहऱ्याचा फोटो" : "Uploaded face photo"}
                    width={150}
                    height={150}
                    style={{ marginTop: 8, width: 150, height: 150, objectFit: "cover", borderRadius: 14, border: "2px solid #fda4af" }}
                  />
                )}

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

          {/* Photo analysis controls */}
          <div style={{ padding: "8px 12px", background: "#fff7f8", borderTop: "1px solid #fce7f3" }}>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button
                onClick={() => photoInputRef.current?.click()}
                title={language === "mr" ? "चेहऱ्याचा फोटो अपलोड करा" : "Upload a face photo"}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, border: "1px solid #fda4af", background: "white", color: "#be123c", borderRadius: 8, padding: "6px 9px", fontSize: "0.7rem", fontWeight: 800, cursor: "pointer" }}
              >
                <ImagePlus size={14} /> {language === "mr" ? "फोटो" : "Photo"}
              </button>
              {selectedPhoto && (
                <>
                  <select
                    value={photoConcern}
                    onChange={(event) => setPhotoConcern(event.target.value as PhotoConcern)}
                    aria-label={language === "mr" ? "त्वचेची समस्या निवडा" : "Choose skin concern"}
                    style={{ flex: 1, minWidth: 0, border: "1px solid #fecdd3", borderRadius: 8, padding: "6px", color: "#334155", fontSize: "0.7rem", background: "white" }}
                  >
                    {PHOTO_CONCERNS.map((concern) => <option key={concern.id} value={concern.id}>{language === "mr" ? concern.mr : concern.en}</option>)}
                  </select>
                  <button
                    onClick={analyzePhoto}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, border: "none", background: "#e11d48", color: "white", borderRadius: 8, padding: "7px 9px", fontSize: "0.7rem", fontWeight: 800, cursor: "pointer" }}
                  >
                    <Camera size={13} /> {language === "mr" ? "तपासा" : "Analyze"}
                  </button>
                </>
              )}
            </div>
            {selectedPhoto && <div style={{ color: "#9f1239", fontSize: "0.65rem", marginTop: 5 }}>{language === "mr" ? "फोटो निवडला आहे. समस्या निवडून तपासा." : "Photo ready. Choose a concern and analyze."}</div>}
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
