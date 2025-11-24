"use client";
import { useEffect, useState } from "react";
import MHeader from "./components/m-view/m-header";
import MFooter from "./components/m-view/m-footer";
import MCasino from "./components/m-view/m-live-casino";
import MMenuTabs from "./components/m-view/m-menu-tabs";
import MSingleMarket from "./components/m-view/m-single-market";
import MSportsTab from "./components/m-view/m-sports-tab";
import MBetSlip from "./components/m-view/m-betslip";


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
          <MHeader />
          <MMenuTabs />
          <MSportsTab />
          <MBetSlip/>
          <MSingleMarket />
          <MCasino />
          <MFooter />
        </>
      ) : (
        <>
        </>
      )}
    </div>
  );
}
