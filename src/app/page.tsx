"use client";
import { useEffect, useState } from "react";
// import MHeader from "./components/m-view/m-header";
import MCasino from "./components/m-view/m-live-casino";
import MSingleMarket from "./components/m-view/m-single-market";
import Loader from "./components/common/loader";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

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