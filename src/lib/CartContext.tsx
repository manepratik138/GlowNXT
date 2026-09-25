"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (service: { id: string; name: string; category?: string; price: number; duration?: number; image?: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isItemInCart: (id: string) => boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  // Computed values
  subtotal: number;
  totalDuration: number;
  itemCount: number;
  bundleDiscountPercent: number;
  bundleDiscount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "beautycafe_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, hydrated]);

  const addToCart = (service: {
    id: string;
    name: string;
    category?: string;
    price: number;
    duration?: number;
    image?: string;
  }) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: service.id,
          name: service.name,
          category: service.category || "Beauty Service",
          price: service.price,
          duration: service.duration || 45,
          image: service.image || "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80",
          quantity: 1,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isItemInCart = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  // Computations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDuration = items.reduce((sum, item) => sum + item.duration * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Bundle & Save Discount:
  // 1 item: 0%
  // 2 items: 10%
  // 3+ items: 20%
  let bundleDiscountPercent = 0;
  if (itemCount === 2) {
    bundleDiscountPercent = 10;
  } else if (itemCount >= 3) {
    bundleDiscountPercent = 20;
  }

  const bundleDiscount = Math.round(subtotal * (bundleDiscountPercent / 100));
  const total = Math.max(0, subtotal - bundleDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isItemInCart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        subtotal,
        totalDuration,
        itemCount,
        bundleDiscountPercent,
        bundleDiscount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
