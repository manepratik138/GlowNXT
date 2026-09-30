"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { localDb } from "@/lib/localStore";

interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  read: boolean;
}

interface BookingChatProps {
  bookingId: string;
  userId: string;
  userName: string;
  recipientName: string;
  onClose: () => void;
}

export default function BookingChat({ bookingId, userId, userName, recipientName, onClose }: BookingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  const loadMessages = () => {
    const next = localDb
      .getDocs("messages", (message) => message.bookingId === bookingId)
      .map((message) => message as unknown as ChatMessage)
      .sort((first, second) => first.createdAt.localeCompare(second.createdAt));
    setMessages(next);
  };

  useEffect(() => {
    loadMessages();
    const timer = window.setInterval(loadMessages, 2000);
    return () => window.clearInterval(timer);
  }, [bookingId]);

  const sendMessage = () => {
    const cleanText = text.trim();
    if (!cleanText) return;
    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    localDb.setDoc("messages", id, {
      bookingId,
      senderId: userId,
      senderName: userName,
      recipientName,
      text: cleanText,
      createdAt: new Date().toISOString(),
      read: false,
    });
    setText("");
    loadMessages();
  };

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9500, width: "min(360px, calc(100vw - 32px))", background: "white", border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 18px 50px rgba(15,23,42,0.2)", overflow: "hidden" }}>
      <div style={{ background: "#0f172a", color: "white", padding: "0.8rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: "0.85rem" }}><MessageCircle size={16} /> Chat with {recipientName}</div>
        <button onClick={onClose} aria-label="Close chat" style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}><X size={16} /></button>
      </div>
      <div style={{ height: 220, overflowY: "auto", padding: "0.75rem", background: "#f8fafc", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && <p style={{ color: "#64748b", fontSize: "0.78rem", textAlign: "center", margin: "auto" }}>Start a conversation about this booking.</p>}
        {messages.map((message) => (
          <div key={message.id} style={{ alignSelf: message.senderId === userId ? "flex-end" : "flex-start", maxWidth: "82%", background: message.senderId === userId ? "#e11d48" : "white", color: message.senderId === userId ? "white" : "#334155", borderRadius: 12, padding: "0.5rem 0.7rem", fontSize: "0.78rem", border: message.senderId === userId ? "none" : "1px solid #e2e8f0" }}>
            <div>{message.text}</div>
            <small style={{ opacity: 0.7, display: "block", marginTop: 3 }}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{message.senderId === userId && (message.read ? " · Read" : " · Sent")}</small>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, padding: "0.65rem", borderTop: "1px solid #e2e8f0" }}>
        <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} placeholder="Type a message..." style={{ flex: 1, minWidth: 0, border: "1px solid #cbd5e1", borderRadius: 9, padding: "0.55rem 0.65rem", fontSize: "0.78rem", outline: "none" }} />
        <button onClick={sendMessage} aria-label="Send message" style={{ width: 36, border: "none", borderRadius: 9, background: "#e11d48", color: "white", cursor: "pointer" }}><Send size={15} /></button>
      </div>
    </div>
  );
}