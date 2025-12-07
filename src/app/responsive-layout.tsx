"use client";
import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import DTopnav from "@/components/d-view/d-topnav";
import MFooter from "@/components/m-view/m-footer";
import MMenuTabs from "@/components/m-view/m-menu-tabs";
import MSportsTab from "@/components/m-view/m-sports-tab";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { fetchData } from "@/lib/functions";
import { CONFIG } from "@/lib/config";
import { useAppStore } from "../lib/store/store";
import { useAuthStore } from "@/lib/store/authStore";

export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    setCasinoEvents,
    setAllEventsList,
    setExchangeTypeList,
    setMenuList,
    setExchangeNews,
    setUserBalance,
    setStakeValue
  } = useAppStore();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { checkLogin, isLoggedIn } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      setIsReady(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkLogin(token || "");
    fetchData({
      url: CONFIG.getAllEventsList,
      payload: { key: CONFIG.siteKey },
      cachedKey: "allEventsList",
      setFn: setAllEventsList,
      expireIn: CONFIG.getAllEventsListTime,
    });
    fetchData({
      url: CONFIG.getTopCasinoGame,
      payload: { key: CONFIG.siteKey },
      cachedKey: "casinoEvents",
      setFn: setCasinoEvents,
      expireIn: CONFIG.getTopCasinoGameTime,
    });
    fetchData({
      url: CONFIG.menuList,
      payload: { key: CONFIG.siteKey },
      cachedKey: "menuList",
      setFn: setMenuList,
      expireIn: CONFIG.menuListTime,
    });
    fetchData({
      url: CONFIG.getExchangeTypeList,
      payload: { key: CONFIG.siteKey },
      cachedKey: "exchangeTypeList",
      setFn: setExchangeTypeList,
      expireIn: CONFIG.getExchangeTypeListTime,
    });
    fetchData({
      url: CONFIG.getExchangeNews,
      payload: { key: CONFIG.siteKey },
      cachedKey: "exchangeNews",
      setFn: setExchangeNews,
      expireIn: CONFIG.getExchangeNewsTime,
    });
    fetchData({
      url: CONFIG.getUserBetStake,
      payload: { key: CONFIG.siteKey },
      cachedKey: "betStake",
      setFn: setStakeValue,
      expireIn: CONFIG.getUserBetStakeTime,
    });

  }, []);

  // 🔥 FIX: No empty white screen + no footer/header flicker
  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-9999">
        <Loading />
      </div>
    );
  }

  const hideMenuAndSports =
    pathname?.includes("/market-details") ||
    pathname === "/accountstatement" ||
    pathname === "/activity-log" ||
    pathname === "/bethistory" ||
    pathname === "/changepassword" ||
    pathname === "/password-history" ||
    pathname === "/profitloss" ||
    pathname === "/profitloss-event" ||
    pathname === "/profitloss-market" ||
    pathname === "/settings" ||
    pathname === "/userBetHistory";

  if (pathname === "/login") {
    return children;
  }

  return (
    <>
      {isMobile ? (
        <div className="relative w-full h-screen overflow-hidden">
          <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
            <Header />
            {!hideMenuAndSports && (
              <>
                <MMenuTabs />
              </>
            )}
          </div>

          <div className="overflow-y-auto h-full">
            <div
              className={`${hideMenuAndSports ? "h-[100px]" : "h-[142px]"}`}
            ></div>
            {children}
            <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow">
            <MFooter />
          </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-screen overflow-hidden">
          <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
            <Header />
            <DTopnav />
          </div>

          <div className="h-[118]"></div>
          <div className="flex h-full">
            <div className="fixed top-[119px] left-0 h-[calc(100vh-150px)] overflow-y-auto no-scrollbar w-[15%] bg-[#C3BDBD]">
              <Sidebar />
            </div>

            <main className="ml-[15%] w-[85%] h-[calc(100vh-110px)] overflow-y-auto pb-2">
              {children}
              <div className="h-[30]"></div>
            </main>
          </div>
          <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow">
            <MFooter />
          </div>
        </div>
      )}
    </>
  );
}
