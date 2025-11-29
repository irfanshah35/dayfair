"use client";
import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import DTopnav from "@/components/d-view/d-topnav";
import MFooter from "@/components/m-view/m-footer";
import MMenuTabs from "@/components/m-view/m-menu-tabs";
import MSportsTab from "@/components/m-view/m-sports-tab";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";

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

  const hideMenuAndSports = pathname === "/market-details";
  const hideSportsTab =
    pathname === "/live-casino" || pathname === "/m-tipsreview";
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${robotoCondensed.variable} 
          antialiased
        `}
        cz-shortcut-listen="true"
      >
        <>
          {/* ================= MOBILE VIEW ================= */}
          {pathname === "/m-login"
            ? children
            : isMobile && (
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
              )}

          {/* ================= DESKTOP VIEW ================= */}
          {!isMobile && (
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
      </body>
    </html>
  );
}
