"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loading from "./loading";
import { fetchData } from "@/lib/functions";
import { CONFIG } from "@/lib/config";
import { useAppStore } from "../lib/store/store";
import { useAuthStore } from "@/lib/store/authStore";

// 🔥 Lazy Load Components Instead of Direct Import
const Header = dynamic(() => import("@/components/common/header"), {
  loading: () => <Loading />,
});

const Sidebar = dynamic(() => import("@/components/common/sidebar"), {
  loading: () => <Loading />,
});

const DTopnav = dynamic(() => import("@/components/d-view/d-topnav"), {
  loading: () => <Loading />,
  ssr: false,
});

const MFooter = dynamic(() => import("@/components/m-view/m-footer"), {
  loading: () => <Loading />,
});

const MMenuTabs = dynamic(() => import("@/components/m-view/m-menu-tabs"), {
  loading: () => <Loading />,
});

const MSportsTab = dynamic(() => import("@/components/m-view/m-sports-tab"), {
  loading: () => <Loading />,
});

export default function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const {
    setCasinoEvents,
    setAllEventsList,
    setExchangeTypeList,
    setMenuList,
    setExchangeNews,
    setUserBalance,
    setStakeValue,
  } = useAppStore();

  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { checkLogin, isLoggedIn } = useAuthStore();

  // device breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      setIsReady(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // API Calls
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

  // Prevent blank white page before DOM mount
  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-9999">
        <Loading />
      </div>
    );
  }

  const hideMenuAndSports =
    pathname?.includes("/market-details") ||
    [
      "/accountstatement",
      "/activity-log",
      "/bethistory",
      "/changepassword",
      "/password-history",
      "/profitloss",
      "/profitloss-event",
      "/profitloss-market",
      "/settings",
      "/userBetHistory",
    ].includes(pathname || "");

  if (pathname === "/login") return children;

  return (
    <>
      {/* ---------------- MOBILE VIEW ---------------- */}
      {isMobile ? (
        <div className="relative w-full h-screen overflow-y-auto">
          <div className="w-full bg-white shadow">
            <Header />
            {!hideMenuAndSports && <MMenuTabs />}
          </div>

          <div className="overflow-y-auto">
            {/* <div className={`${hideMenuAndSports ? "h-[100px]" : "h-[142px]"}`}></div> */}
            {children}

            <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow">
              <MFooter />
            </div>
          </div>
        </div>
      ) : (
        /* ---------------- DESKTOP VIEW ---------------- */
        <div className="relative w-full h-screen overflow-hidden">
          <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
            <Header />
            <DTopnav />
          </div>

          <div className="h-[118]"></div>
          <div className="flex h-full">
            <div className="fixed top-29.75 left-0 h-[calc(100vh-150px)] overflow-y-auto no-scrollbar w-[15%] bg-[#C3BDBD]">
              <Sidebar />
            </div>

            <main className="ml-[15%] w-[85%] h-[calc(100vh-110px)] overflow-y-auto pb-2 no-scrollbar">
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