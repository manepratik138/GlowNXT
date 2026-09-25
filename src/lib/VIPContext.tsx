"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface VIPContextType {
  isVIP: boolean;
  vipTier: "monthly" | "yearly" | null;
  expiryDate: string | null;
  subscribeVIP: (tier: "monthly" | "yearly") => void;
  cancelVIP: () => void;
  vipDiscountPercent: number;
}

const VIPContext = createContext<VIPContextType | undefined>(undefined);

const STORAGE_KEY = "glownxt_vip_status";

export function VIPProvider({ children }: { children: React.ReactNode }) {
  const [isVIP, setIsVIP] = useState<boolean>(false);
  const [vipTier, setVipTier] = useState<"monthly" | "yearly" | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("beautycare_vip_status");
      if (stored) {
        const parsed = JSON.parse(stored);
        setIsVIP(parsed.isVIP);
        setVipTier(parsed.vipTier);
        setExpiryDate(parsed.expiryDate);
      }
    } catch (e) {
      console.error("Error reading VIP storage:", e);
    }
  }, []);

  const saveVIPState = (vipState: { isVIP: boolean; vipTier: "monthly" | "yearly" | null; expiryDate: string | null }) => {
    setIsVIP(vipState.isVIP);
    setVipTier(vipState.vipTier);
    setExpiryDate(vipState.expiryDate);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vipState));
    } catch (e) {
      console.error("Error saving VIP state:", e);
    }
  };

  const subscribeVIP = (tier: "monthly" | "yearly") => {
    const nextMonth = new Date();
    if (tier === "yearly") {
      nextMonth.setFullYear(nextMonth.getFullYear() + 1);
    } else {
      nextMonth.setMonth(nextMonth.getMonth() + 1);
    }

    saveVIPState({
      isVIP: true,
      vipTier: tier,
      expiryDate: nextMonth.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    });
  };

  const cancelVIP = () => {
    saveVIPState({ isVIP: false, vipTier: null, expiryDate: null });
  };

  return (
    <VIPContext.Provider
      value={{
        isVIP,
        vipTier,
        expiryDate,
        subscribeVIP,
        cancelVIP,
        vipDiscountPercent: isVIP ? 20 : 0,
      }}
    >
      {children}
    </VIPContext.Provider>
  );
}

export function useVIP() {
  const context = useContext(VIPContext);
  if (!context) {
    throw new Error("useVIP must be used within a VIPProvider");
  }
  return context;
}
