"use client";
import { createContext, useState, useContext,  ReactNode, Children } from "react";

 interface sidebarContextInterface {
    isOpen: boolean;
    toggleSidebar: () => void;
    closeOpen: () => void;
}

const sidebarContext = createContext<sidebarContextInterface | undefined>(undefined);

export const SidebarProvider = ({children}: {children: ReactNode}) => {
    const [isOpen, setIsOpen] = useState(false); 
    const toggleSidebar = () => setIsOpen((prev) => !prev);       
  return (
    <sidebarContext.Provider value={{isOpen, toggleSidebar, closeOpen: () => setIsOpen(false)}}>
      {children}
    </sidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const ctx = useContext(sidebarContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
