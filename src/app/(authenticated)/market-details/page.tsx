"use client";
import Loader from "@/components/common/loader";
import MMarketDetailsPage from "@/components/m-view/m-market-details-page";
import React, { useEffect, useState } from "react";

const MarketDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
          <MMarketDetailsPage />
        </>
      ) : (
        <>
          <MMarketDetailsPage />
        </>
      )}
    </div>
  );
};

export default MarketDetailsPage;
