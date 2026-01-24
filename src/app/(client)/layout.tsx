

import Header from "@/files/Header";
import Footer from "@/files/Footer";
import MainButton from "@/files/MainButton";
import { CartProvider } from "@/files/context/CartContext";
import CartDrawer from "@/files/cart/CartDrawer";
import { AuthProvider } from "@/files/context/AurhContext";
import { SidebarProvider } from "@/files/context/SidebarContext";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   

<div className="relative min-h-screen flex flex-col">
        <header className="top-0 z-20 w-full fixed flex">
          <Header/>               
        </header>

          <CartDrawer/>

        
        <main className="min-h-screen mt-10 z-10">

        {children}
        </main>
        <div className="bottom-5 mb-2 flex justify-center self-center w-11/12 sm:hidden sticky z-10">
          <MainButton/>
        </div>
        <footer className="bg-black relative z-10 w-full bottom-0">
          <Footer/>
        </footer>

</div>    
  );
}
