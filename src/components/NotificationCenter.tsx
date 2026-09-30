"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { localDb } from "@/lib/localStore";

interface NotificationCenterProps {
  userId: string;
}

interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export function createLocalNotification(userId: string, title: string, body: string): void {
  localDb.setDoc("notifications", `notification_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, {
    userId,
    title,
    body,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = () => {
    const items = localDb.getDocs("notifications", (notification) => notification.userId === userId) as unknown as AppNotification[];
    setNotifications(items.sort((first, second) => second.createdAt.localeCompare(first.createdAt)));
  };

  useEffect(() => {
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 3000);
    return () => window.clearInterval(timer);
  }, [userId]);

  const markRead = (notification: AppNotification) => {
    localDb.updateDoc("notifications", notification.id, { read: true });
    loadNotifications();
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div style={{ position: "fixed", top: 92, right: 20, zIndex: 8500 }}>
      <button onClick={() => setOpen((current) => !current)} aria-label="Open notifications" style={{ position: "relative", width: 42, height: 42, borderRadius: "50%", border: "1px solid #e2e8f0", background: "white", color: "#334155", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "0 6px 20px rgba(15,23,42,0.12)" }}>
        <Bell size={18} />
        {unreadCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 99, background: "#e11d48", color: "white", fontSize: "0.65rem", fontWeight: 900, display: "grid", placeItems: "center", padding: "0 4px" }}>{unreadCount}</span>}
      </button>
      {open && <div style={{ position: "absolute", right: 0, top: 50, width: "min(330px, calc(100vw - 40px))", background: "white", border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 18px 50px rgba(15,23,42,0.18)", overflow: "hidden" }}>
        <div style={{ padding: "0.8rem 1rem", borderBottom: "1px solid #f1f5f9", fontWeight: 900, color: "#0f172a" }}>Notifications</div>
        <div style={{ maxHeight: 280, overflowY: "auto" }}>
          {notifications.length === 0 && <p style={{ padding: "1.25rem", color: "#64748b", fontSize: "0.8rem", textAlign: "center" }}>No notifications yet.</p>}
          {notifications.map((notification) => <button key={notification.id} onClick={() => markRead(notification)} style={{ width: "100%", textAlign: "left", border: "none", borderBottom: "1px solid #f1f5f9", background: notification.read ? "white" : "#fff7f8", padding: "0.75rem 1rem", cursor: "pointer" }}><div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><div style={{ flex: 1 }}><strong style={{ color: "#0f172a", fontSize: "0.8rem" }}>{notification.title}</strong><div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: 3 }}>{notification.body}</div><small style={{ color: "#94a3b8", fontSize: "0.65rem" }}>{new Date(notification.createdAt).toLocaleString()}</small></div>{!notification.read && <Check size={14} color="#e11d48" />}</div></button>)}
        </div>
      </div>}
    </div>
  );
}