import React, { createContext, useContext, useState, useMemo } from 'react';
import { MenuItem } from '../data/menuData';

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  studentDiscount: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem, quantity: number = 1, specialInstructions?: string) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions,
        };
        return updated;
      }
      return [...prevItems, { item, quantity, specialInstructions }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((ci) => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((ci) =>
        ci.item.id === itemId ? { ...ci, quantity: newQuantity } : ci
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, ci) => sum + ci.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  }, [items]);

  // University student discount: 10% on canteen orders above Rs. 400
  const studentDiscount = useMemo(() => {
    return subtotal >= 400 ? Math.round(subtotal * 0.10) : 0;
  }, [subtotal]);

  // University canteen eco-friendly parcel fee: flat Rs. 15
  const tax = useMemo(() => {
    return items.length > 0 ? 15 : 0;
  }, [items]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - studentDiscount + tax);
  }, [subtotal, studentDiscount, tax]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        studentDiscount,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
