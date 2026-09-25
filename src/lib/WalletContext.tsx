"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WalletTransaction {
  id: string;
  title: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
}

interface WalletContextType {
  balance: number;
  referralCode: string;
  transactions: WalletTransaction[];
  deductCredits: (amount: number, description?: string) => boolean;
  addCredits: (amount: number, title: string) => void;
  applyReferralCode: (code: string) => { success: boolean; message: string };
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY = "beautycafe_wallet";

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "tx_1",
    title: "Welcome Bonus Credits",
    amount: 250,
    type: "credit",
    date: "Just now",
  },
];

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(250);
  const [referralCode] = useState<string>("BEAUTY2026");
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.balance === "number") setBalance(parsed.balance);
        if (Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
      }
    } catch (e) {
      console.error("Failed to load wallet data", e);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ balance, transactions })
      );
    } catch (e) {
      console.error("Failed to save wallet data", e);
    }
  }, [balance, transactions, hydrated]);

  const deductCredits = (amount: number, description = "Booking Discount Used"): boolean => {
    if (balance < amount) return false;
    const newBal = balance - amount;
    setBalance(newBal);
    setTransactions((prev) => [
      {
        id: "tx_" + Date.now(),
        title: description,
        amount,
        type: "debit",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      },
      ...prev,
    ]);
    return true;
  };

  const addCredits = (amount: number, title: string) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: "tx_" + Date.now(),
        title,
        amount,
        type: "credit",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      },
      ...prev,
    ]);
  };

  const applyReferralCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === referralCode) {
      return { success: false, message: "You cannot use your own referral code!" };
    }
    if (clean.startsWith("BEAUTY") || clean.startsWith("FRIEND")) {
      addCredits(150, `Referral Code ${clean} Applied`);
      return { success: true, message: "₹150 Referral credits added to your wallet!" };
    }
    return { success: false, message: "Invalid or expired referral code." };
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        referralCode,
        transactions,
        deductCredits,
        addCredits,
        applyReferralCode,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
