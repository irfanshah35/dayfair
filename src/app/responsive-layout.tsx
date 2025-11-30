"use client";
import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import DTopnav from "@/components/d-view/d-topnav";
import MFooter from "@/components/m-view/m-footer";
import MMenuTabs from "@/components/m-view/m-menu-tabs";
import MSportsTab from "@/components/m-view/m-sports-tab";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";



export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      setIsReady(true); // hydration complete
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const hideMenuAndSports = pathname === "/market-details";
  const hideSportsTab =
    pathname === "/live-casino" || pathname === "/m-tipsreview";

  if (pathname === "/login") {
    return children;
  }
  return (
    <>
      {!isReady ? (
        <Loading />
      ) : isMobile ? (
        <div className="relative w-full h-screen overflow-hidden">
          {/* FIXED TOP AREA */}
          <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
            <Header />
            {!hideMenuAndSports && (
              <>
                <MMenuTabs />
                {!hideSportsTab && <MSportsTab />}
              </>
            )}
          </div>

          {/* MAIN SCROLL CONTAINER */}
          <div className={`overflow-y-auto h-full`}>
            <div
              className={`${
                hideMenuAndSports
                  ? "h-[100px]"
                  : hideSportsTab
                  ? "h-[142.6px]"
                  : "h-[196.6px]"
              }`}
            ></div>
            {children}
            <MFooter />
          </div>
        </div>
      ) : (
        <div className="relative w-full h-screen overflow-hidden">
          {/* FIXED TOP */}
          <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
            <Header />
            <DTopnav />
          </div>

          <div className="h-[118]"></div>
          <div className="flex h-full">
            {/* FIXED SIDEBAR */}
            <div className="fixed top-[119px] left-0 h-[calc(100vh-110px)] overflow-y-auto no-scrollbar w-[15%] bg-[#C3BDBD]">
              <Sidebar />
            </div>

            {/* SCROLLABLE CONTENT ONLY */}
            <main className="ml-[15%] w-[85%] h-[calc(100vh-110px)] overflow-y-auto  pb-2">
              {children}
              <MFooter />
            </main>
          </div>
        </div>
      )}
    </>
  );
}
