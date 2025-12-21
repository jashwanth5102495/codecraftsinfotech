import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CertificateChoice = 'with' | 'without';

export interface CartItem {
  slug: string;
  title: string;
  image: string;
  tech: string[];
  price: number; // unit price after certificate adjustment
  certificate: CertificateChoice;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (slug: string, certificate?: CertificateChoice) => void;
  clearCart: () => void;
  setQuantity: (slug: string, qty: number) => void;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'cc_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, qty: number = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.slug === item.slug && i.certificate === item.certificate);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + qty };
        return next;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeFromCart = (slug: string, certificate?: CertificateChoice) => {
    setItems(prev => prev.filter(i => {
      if (i.slug !== slug) return true;
      if (!certificate) return false; // remove all items with slug when certificate not provided
      return i.certificate !== certificate; // keep items where certificate does not match
    }));
  };

  const clearCart = () => setItems([]);
  const setQuantity = (slug: string, qty: number) => setItems(prev => prev.map(i => i.slug === slug ? { ...i, quantity: Math.max(1, qty) } : i));

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value: CartContextValue = { items, addToCart, removeFromCart, clearCart, setQuantity, subtotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};