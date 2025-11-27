"use client";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import MFooter from "./components/m-view/m-footer";
import MMenuTabs from "./components/m-view/m-menu-tabs";
import MSportsTab from "./components/m-view/m-sports-tab";
import { useEffect, useState } from "react";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import DTopnav from "./components/d-view/d-topnav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export default function RootLayout({
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

  useEffect(() => {
    console.log("Current route:", pathname);
  }, [pathname]);

  // Routes where header and footer should be hidden
  const hideHeaderFooter = pathname === "/mlogin";

  // Routes where MMenuTabs and MSportsTab should be hidden
  const hideMenuAndSports = pathname === "/market-details" || pathname === "/mlogin";

  // Routes where only MSportsTab should be hidden
  const hideSportsTab = pathname === "/live-casino" || pathname === "/m-tipsreview";

  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${robotoCondensed.variable} 
          antialiased
        `}
      >
        {isMobile ? (
          // Mobile View Layout
          <>
            {!hideHeaderFooter && <Header />}

            {!hideMenuAndSports && (
              <>
                <MMenuTabs />
                {!hideSportsTab && <MSportsTab />}
              </>
            )}

            {children}

            {!hideHeaderFooter && <MFooter />}
          </>
        ) : (
          // Desktop View Layout
          <>
            {!hideHeaderFooter && <Header />}

              <>
                <DTopnav />
              </>
           

            <div className="flex">
              {/* Left Sidebar  */}
             
              <div className="w-[216px] min-h-screen bg-[#C3BDBD]">
                <Sidebar />
              </div>

              {/* Main Content */}
              <main className="flex-1 px-[9px] overflow-hidden">
                {children}
              </main>
            </div>

            {!hideHeaderFooter && <MFooter />}
          </>
        )}
      </body>
    </html>
  );
}