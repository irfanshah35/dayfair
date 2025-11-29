"use client";
import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import DTopnav from "@/components/d-view/d-topnav";
import MFooter from "@/components/m-view/m-footer";
import MMenuTabs from "@/components/m-view/m-menu-tabs";
import MSportsTab from "@/components/m-view/m-sports-tab";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SecondLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Routes where MMenuTabs and MSportsTab should be hidden
  const hideMenuAndSports = pathname === "/market-details";

  // Routes where only MSportsTab should be hidden
  const hideSportsTab =
    pathname === "/live-casino" || pathname === "/m-tipsreview";
  return (
    <>
      <Header />
      {isMobile && !hideMenuAndSports && (
        <>
          <MMenuTabs />
          {!hideSportsTab && <MSportsTab />}
        </>
      )}
      {!isMobile && (
        <>
          <DTopnav />
        </>
      )}
      {isMobile ? (
        children
      ) : (
        <div className="flex lg:w-full">
          {/* Left Sidebar  */}

          <div className="min-w-[15%] min-h-screen bg-[#C3BDBD]">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 lg:min-w-[85%] overflow-hidden">
            {children}
          </main>
        </div>
      )}
      <MFooter />
    </>
  );
}
