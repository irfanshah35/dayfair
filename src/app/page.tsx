"use client";
import { useEffect, useState } from "react";
// import MHeader from "./components/m-view/m-header";
import MCasino from "./components/m-view/m-live-casino";
import MSingleMarket from "./components/m-view/m-single-market";



export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {isMobile ? (
        <>
          {/* <MBetSlip/> */}
          <MSingleMarket />
          <MCasino />
        </>
      ) : (
        <>
        </>
      )}
    </div>
  );
}