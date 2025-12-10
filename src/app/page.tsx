"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MSingleMarket = dynamic(
  () => import("@/components/m-view/m-single-market"),
  { loading: () => <></> }
);

const MLiveCasino = dynamic(
  () => import("@/components/m-view/m-live-casino"),
  { loading: () => <></> }
);

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
          <MSingleMarket />
          <MLiveCasino />
        </div>
      )}
    </>
  );
}
