"use client";
import DSportNav from "@/components/d-view/d-sports-nav";
import MLiveCasino from "@/components/m-view/m-live-casino";
import MSingleMarket from "@/components/m-view/m-single-market";
import { useEffect, useState } from "react";
// import MHeader from "./components/m-view/m-header";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ================= MOBILE VIEW ================= */}
      {isMobile && (
        <>
          <MSingleMarket />
          <MLiveCasino />
        </>
      )}

      {/* ================= DESKTOP VIEW ================= */}
      {!isMobile && (
        <div>
          <DSportNav />
          <MSingleMarket />
          <MLiveCasino />
        </div>
      )}
    </>
  );
}
