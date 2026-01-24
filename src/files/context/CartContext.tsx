"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from "react";



export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // 🧠 Load from localStorage when the component mounts
  useEffect(() => {
    const saved = localStorage.getItem("cart-items");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        console.error("Error parsing cart from localStorage");
      }
    }
  }, []);

  // 💾 Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem, update?: boolean) => {
    
     if(item.orderPrice === 0){
      alert('please provide amount')
     throw new Error("must provide order price")
    }

    if (update) {
      setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: item.quantity ? item.quantity : i.quantity, comment: item.comment ? item.comment : i.comment, orderPrice: item.quantity ? item.quantity * i.price : i.orderPrice} : i
        );
      }
      return [...prev, item];
    })
    return
    }
   
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const toggleCart = () => setIsOpen((prev) => !prev);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        isOpen,
        toggleCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};