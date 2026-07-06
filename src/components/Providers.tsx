"use client";

import { useCallback, useState } from "react";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";
import FloatingNav from "./FloatingNav";
import Footer from "./Footer";
import SplashScreen from "./SplashScreen";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [appReady, setAppReady] = useState(false);
  const handleSplashComplete = useCallback(() => setAppReady(true), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <CartProvider>
        <SplashScreen onComplete={handleSplashComplete} />
        {children}
        {appReady && (
          <>
            <Footer />
            <FloatingNav />
          </>
        )}
      </CartProvider>
    </ThemeProvider>
  );
}
