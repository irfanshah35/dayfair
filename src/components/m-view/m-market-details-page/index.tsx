/* eslint-disable @typescript-eslint/no-explicit-any */
//new prokject on which i am working
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import MBetSlip from "../m-betslip";
import DBetSlip from "@/components/d-view/d-betslip";
// import RulesModal from "@/components/modals/rules-modal";
import { formatDateStamp } from "@/lib/functions";
import { formatDateDetail } from "@/lib/functions";
import { FaChevronDown } from "react-icons/fa";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import { useToast } from "@/components/common/toast/toast-context";
import { useAppStore } from "@/lib/store/store";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { webSocketService } from "@/lib/websocket.service";


const RulesModal = dynamic(() => import("../../modals/rules-modal"), {
  loading: () => <></>,
  ssr: false,
});

export default function MMarketDetailsPage({ apiData }: { apiData: any }) {
  const [activeTab, setActiveTab] = useState("odds");
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [filteredMarketData, setFilteredMarketData] = useState<any[]>([]);
  const betslipRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // INLINE (mobile) slip open or not
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [isbetlimits, setIsBetLimits] = useState(false);
  const [selectedMarketRules, setSelectedMarketRules] = useState<string | null>(
    null
  );
  const { userBalance, setUserBalance } = useAppStore();

  // 👇 State for Real Data
  const [matchedBets, setMatchedBets] = useState<any[]>([]);
  const [unmatchedBets, setUnmatchedBets] = useState<any[]>([]);
  const [marketPL, setMarketPL] = useState<
    Record<string, Record<number, number>>
  >({});
  const [slipPreview, setSlipPreview] = useState({ stake: 0, price: 0 });
  const socketCleanupRef = useRef<(() => void) | null>(null);
// Add these with your other state declarations
const [allMarkets, setAllMarkets] = useState<Market[]>([]);
const activeSocketIdsRef = useRef<string[]>([]);
const initialFilterAppliedRef = useRef(false);
  const params = useParams();
  const eventId = (params as any)?.eventId || "";
  const sportId = (params as any)?.sportId || "";

  // Track which row is open (mobile)
  const [openSlip, setOpenSlip] = useState<{
    marketId: string;
    selectionId: number;
    side: "BACK" | "LAY";
  } | null>(null);

//socket code  starts


  useEffect(() => {
    return () => {
      socketCleanupRef.current?.();
    };
  }, []);

const areIdsSame = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  for (const id of b) {
    if (!setA.has(id)) return false;
  }
  return true;
};

// 🔹 Helper: Subscribe to markets
const subscribeForMarkets = (marketIds: string[]) => {
  // Normalize and deduplicate
  const cleaned = Array.from(
    new Set(
      (marketIds || [])
        .filter((id) => !!id)
        .map((id) => String(id))
    )
  );

  // ⚠️ If same IDs, skip re-subscribe
  if (areIdsSame(cleaned, activeSocketIdsRef.current)) {
    return;
  }

  // UNSUBSCRIBE old subscriptions
  if (activeSocketIdsRef.current.length > 0) {
    webSocketService.unsubscribeMarket(activeSocketIdsRef.current);
  }

  // SAVE + SUBSCRIBE new
  activeSocketIdsRef.current = cleaned;
  if (cleaned.length > 0) {
    webSocketService.subscribeMarket(cleaned, "market-details");
  }
};

    const mergeSide = (prevSide: any[], incoming: any): any[] => {
              const base: any[] = Array.isArray(prevSide) ? [...prevSide] : [];

              const write = (idx: number, val: any) => {
                base[idx] = {
                  price: val?.price ?? 0,
                  size: val?.size ?? 0,
                };
              };

              if (Array.isArray(incoming)) {
                incoming.forEach((val, idx) => {
                  if (val) write(idx, val);
                });
              } else if (incoming && typeof incoming === "object") {
                Object.keys(incoming).forEach((k) => {
                  const idx = Number(k);
                  if (Number.isNaN(idx)) return;
                  write(idx, incoming[k]);
                });
              }

              for (let i = 0; i < 3; i++) {
                if (!base[i]) base[i] = { price: 0, size: 0 };
              }
              return base;
            };



const [matchOddsData, setMatchOddsData] = useState<any[]>([]);


useEffect(() => {
  if (apiData?.matchOddsData?.length > 0) {
    console.log("🔄 Initializing matchOddsData from apiData");
    setMatchOddsData(apiData.matchOddsData);
  }
}, [apiData?.matchOddsData]);

useEffect(() => {
  if (!matchOddsData || matchOddsData.length === 0) {
    return;
  }

  try {
    const marketIds: string[] = matchOddsData
      .map((m: any) => m?.exMarketId || m?.marketId)
      .filter(
        (id: any): id is string =>
          typeof id === "string" && id.length > 0
      );

    if (marketIds.length === 0) return;

    // 1) Connect
    webSocketService.connect();

    // 2) Subscribe
    webSocketService.subscribeMarket(marketIds, "market-details");

    // 3) Listen for updates
    const offOdds = webSocketService.onEvent<any>("odds", (raw) => {
      try {
        let payload: any = raw;
        if (typeof raw === "string") {
          payload = JSON.parse(raw);
        } else if (Array.isArray(raw) && raw.length >= 2) {
          const maybe = raw[1];
          payload = typeof maybe === "string" ? JSON.parse(maybe) : maybe;
        }

        const marketId = payload?.marketId;
        if (!marketId) return;

        const exMap: Record<string, any> = payload.ex || {};

        console.log("📊 Socket update for market:", marketId);

        // 🔥 UPDATE matchOddsData
        setMatchOddsData((prev: any[]) => {
          return prev.map((m) => {
            const id = m.exMarketId || m.marketId;
            if (String(id) !== String(marketId)) return m;

            const runners = (m.runners || []).map((r: any) => {
              const key = String(r.selectionId);
              let exEntry = exMap[key] ?? exMap[r.selectionId];

              if (!exEntry) {
                for (const k in exMap) {
                  const val = exMap[k];
                  if (val && String(val.selectionId) === key) {
                    exEntry = val;
                    break;
                  }
                }
              }

              if (!exEntry) return r;

              const prevEx = r.ex || {};
              const newEx = {
                ...prevEx,
                availableToBack: mergeSide(
                  prevEx.availableToBack,
                  exEntry.availableToBack
                ),
                availableToLay: mergeSide(
                  prevEx.availableToLay,
                  exEntry.availableToLay
                ),
              };

              return { 
                ...r, 
                ex: newEx,
                _updateKey: Date.now()
              };
            });

            return { 
              ...m, 
              runners,
              _updateKey: Date.now()
            };
          });
        });
      } catch (e) {
        console.error("❌ Socket update failed:", e);
      }
    });

    // 4) Cleanup
    socketCleanupRef.current = () => {
      webSocketService.unsubscribeMarket(marketIds);
      offOdds();
    };

    return () => {
      socketCleanupRef.current?.();
    };
  } catch (e) {
    console.warn("Socket setup failed:", e);
  }
}, [matchOddsData]); // ✅ Dependency on matchOddsData

// ========================================
// 4️⃣ UPDATE setMarketType TO USE matchOddsData
// ========================================
const setMarketType = (type: string, ...args: any[]) => {
  const marketid: string = String(args[3] ?? args[args.length - 1] ?? "");

  const isDesktop =
    typeof window !== "undefined" && (window.innerWidth ?? 0) >= 1024;

  if (isDesktop) {
    type = "ALL";
  }

  setActiveCategory(type);

  let filtered: any[] = [];

  if (type === "Popular") {
    filtered = (matchOddsData || []) // ✅ Use matchOddsData
      .filter((m: any) => m.popular && m.status !== "CLOSED")
      .sort((a: any, b: any) => a.sequence - b.sequence);

    const ids = filtered.map((m) => m.exMarketId || m.marketId);

    if (!isDesktop) {
      subscribeForMarkets(ids);
    }
  } else if (type === "ALL" || type === "All Market") {
    filtered = [...(matchOddsData || [])].sort( // ✅ Use matchOddsData
      (a: any, b: any) => a.sequence - b.sequence
    );

    const ids = filtered.map((m) => m.exMarketId || m.marketId);

    if (!isDesktop) {
      subscribeForMarkets(ids);
    }
  } else {
    filtered = (matchOddsData || []) // ✅ Use matchOddsData
      .filter(
        (market: any) =>
          market.marketId === marketid && market.status !== "CLOSED"
      )
      .sort((a: any, b: any) => a.sequence - b.sequence);

    const ids = filtered.map((m) => m.exMarketId || m.marketId);

    if (!isDesktop) {
      subscribeForMarkets(ids);
    }
  }

  setFilteredMarketData(filtered);
};

// ========================================
// 5️⃣ UPDATE YOUR INITIAL FILTER EFFECT
// ========================================
useEffect(() => {
  if (matchOddsData?.length > 0 && !initialFilterAppliedRef.current) {
    initialFilterAppliedRef.current = true;
    setMarketType("Popular", "", "Popular", 1, "");
  }
}, [matchOddsData]); // ✅ Changed from apiData.matchOddsData
//socket code end
  // Shared betslip data (used by both mobile + desktop)
  const [isMobile, setIsMobile] = useState(false);
  const [isvolume, setIsVolume] = useState(false);
  const [iswatchlive, setIsWatchLive] = useState(false);
  const [betSlipData, setBetSlipData] = useState<{
    marketId: string;
    selectionId: number;
    runnerName: string;
    odds: number;
    slipCls: "slip-back" | "slip-lay";
    slipBgClass: string;
    min: number;
    max: number;
    side: "BACK" | "LAY";
  } | null>(null);

  const [isrulesopen, setRulesOpen] = useState(false);

  const dynamicCategories = [
    ...new Set(apiData?.matchOddsData?.map((item: any) => item.marketName)),
  ];

  const categories = ["Popular", ...dynamicCategories, "All Market"];

  // 👇 Accordion toggle state
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: any) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 👇 Format date helper
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const refreshUserBalance = async () => {
    try {
      await fetchData({
        url: CONFIG.getUserBalance,
        payload: { key: CONFIG.siteKey },
        setFn: (res: any) => {
          console.log("Balance refreshed:", res);
          // Update global store so Header shows new balance immediately
          setUserBalance(res);
        }
      });
    } catch (error) {
      console.error("Balance refresh error:", error);
    }
  };
  // 👇 Fetch Bets API
  const fetchBets = async () => {
    if (!eventId || !sportId) return;

    await fetchData({
      url: CONFIG.unmatchedBets,
      payload: {
        eventId: String(eventId),
        sportId: String(sportId),
      },
      setFn: (res: any) => {
        console.log("Bets response:", res);
        const matched = res?.matchedBets || [];
        const unmatched = res?.unmatchedBets || [];
        setMatchedBets(matched);
        setUnmatchedBets(unmatched);
      },
    });
  };

  // 👇 Fetch Profit/Loss API
  const fetchMarketPL = useCallback(async () => {
    if (!eventId || !sportId) return;

    try {
      await fetchData({
        cachedKey: `market_pl_${eventId}_${sportId}`,
        url: CONFIG.getAllMarketplURL,
        payload: {
          eventId: String(eventId),
          sportId: String(sportId),
        },
        setFn: (res: any) => {
          console.log("📦 Full PL response:", res);
          if (res?.pl) {
            setMarketPL(res.pl);
          }
        },
        forceApiCall: true,
      });
    } catch (error) {
      console.error("❌ Error fetching PL:", error);
    }
  }, [eventId, sportId]);

  // 👇 Fetch all data on mount
  useEffect(() => {
    fetchBets();
    fetchMarketPL();
  }, [eventId, sportId, fetchMarketPL]);

  // Helper function to get PL for a specific runner
  // Helper function to get PL for a specific runner
  const getRunnerPL = (marketId: string, selectionId: number) => {
    if (!marketPL || Object.keys(marketPL).length === 0) return null;

    // 🔹 STRICT: Only exact string match
    const marketData = marketPL[String(marketId)];

    if (!marketData) return null;

    const selectionKey = String(selectionId);

    if (selectionKey in marketData) {
      return marketData[selectionKey];
    }

    return null;
  };

  // 👇 Calculate preview PL for other runners when betslip is open
  const calculatePreviewPL = (
    side: "BACK" | "LAY",
    price: number,
    stake: number,
    currentSelectionId: number,
    targetSelectionId: number
  ): number => {
    if (currentSelectionId === targetSelectionId) {
      if (side === "BACK") {
        return stake * (price - 1);
      } else {
        return stake;
      }
    } else {
      if (side === "BACK") {
        return -stake;
      } else {
        return -(stake * (price - 1));
      }
    }
  };

  // Handle slip preview from betslip
  const handleSlipPreview = useCallback(
    ({ stake, price }: { stake: number; price: number }) => {
      setSlipPreview({ stake, price });
    },
    []
  );

  useEffect(() => {
    if (isSlipOpen && betslipRef.current) {
      setTimeout(() => {
        betslipRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 100);
    }
  }, [isSlipOpen, openSlip]);
  // 🔹 NEW: Cashout code start here

  // --- CASHOUT STATES ---
  const [cashoutValues, setCashoutValues] = useState<
    Record<string, number | string>
  >({});
  const [showCashoutValue, setShowCashoutValue] = useState<
    Record<string, boolean>
  >({});
  const [cashOutAPIData, setCashOutAPIData] = useState<any>(null);
  const [cashoutLoader, setCashoutLoader] = useState(false);
  const [confirmCashout, setConfirmCashout] = useState<Record<string, boolean>>(
    {}
  );

  const cashoutIntervalRef = useRef<Record<string, any>>({});

  const omit = (obj: any, key: any) => {
    const copy = { ...obj };
    delete copy[key];
    return copy;
  };

  const values = (obj: any) => Object.values(obj);
  const keys = (obj: any) => Object.keys(obj);

  const hasProfitAndLoss = (marketId: string) => {
    const marketKey =
      Object.keys(marketPL).find(
        (key) => Math.abs(parseFloat(key) - parseFloat(marketId)) < 0.0001
      ) || marketId;

    const plData = marketPL[marketKey];
    if (!plData) return false;

    return Object.values(plData).some((v: any) => Math.abs(Number(v)) > 0);
  };
  const startCashout = (market: any) => {
    const marketId = market.marketId;

    if (!hasProfitAndLoss(marketId)) return;

    if (cashoutIntervalRef.current[marketId]) {
      clearInterval(cashoutIntervalRef.current[marketId]);
    }

    cashoutIntervalRef.current[marketId] = setInterval(() => {
      calculateCashOut(market);
    }, 1000);
  };
  const calculateCashOut = (market: any) => {
    const marketId = market.marketId;

    const marketKey =
      Object.keys(marketPL).find(
        (key) => Math.abs(parseFloat(key) - parseFloat(marketId)) < 0.0001
      ) || marketId;

    const userProfitLoss = marketPL[marketKey];
    if (!userProfitLoss) return;

    const runners = market.runners || [];

    const oddsArr = runners.map((r: any) => ({
      selectionId: r.selectionId,
      backOdds: r?.ex?.availableToBack?.[0]?.price || 0,
      layOdds: r?.ex?.availableToLay?.[0]?.price || 0,
    }));

    const fav = oddsArr.reduce((min, curr) =>
      curr.backOdds < min.backOdds ? curr : min
    );

    if (!fav.backOdds || !fav.layOdds) {
      stopCashout(marketId);
      return;
    }

    const favPL = userProfitLoss[fav.selectionId] || 0;
    const negativePLs = values(userProfitLoss).filter(
      (v: any) => Number(v) < 0
    );

    let stake = 0;
    let price = 0;
    let side: "BACK" | "LAY" = "BACK";

    if (negativePLs.length === 2 || negativePLs.length === 0) {
      const other = omit(userProfitLoss, fav.selectionId);
      const otherSel = Number(keys(other)[0]);
      const diff = Math.abs(
        Number(userProfitLoss[fav.selectionId]) -
        Number(userProfitLoss[otherSel])
      );

      if (favPL > userProfitLoss[otherSel]) {
        stake = +(diff / fav.layOdds).toFixed(2);
        price = fav.layOdds;
        side = "LAY";
      } else {
        stake = +(diff / fav.backOdds).toFixed(2);
        price = fav.backOdds;
        side = "BACK";
      }
    } else {
      const total = values(userProfitLoss)
        .map((v: any) => Math.abs(Number(v)))
        .reduce((a, b) => a + b, 0);

      if (favPL > 0) {
        stake = +(total / fav.layOdds).toFixed(2);
        price = fav.layOdds;
        side = "LAY";
      } else {
        stake = +(total / fav.backOdds).toFixed(2);
        price = fav.backOdds;
        side = "BACK";
      }
    }

    const cal = price * 100 - 100;
    const totalProfit = Math.ceil((cal / 100) * stake);

    const finalValue =
      side === "BACK"
        ? (favPL + totalProfit).toFixed(2)
        : (favPL - totalProfit).toFixed(2);

    setCashoutValues((p) => ({ ...p, [marketId]: finalValue }));
    setShowCashoutValue((p) => ({ ...p, [marketId]: true }));

    setCashOutAPIData({
      eventId,
      sportId,
      marketId,
      selectionId: fav.selectionId,
      price,
      side,
      stake,
      type: market.marketType || market.oddsType,
      matchMe: false,
    });
  };
  const stopCashout = (marketId: string) => {
    if (cashoutIntervalRef.current[marketId]) {
      clearInterval(cashoutIntervalRef.current[marketId]);
      delete cashoutIntervalRef.current[marketId];
    }

    setShowCashoutValue((p) => ({ ...p, [marketId]: false }));
    setCashoutValues((p) => ({ ...p, [marketId]: "Cash Out" }));
  };
  const onCashOutConfirm = async () => {
    if (!cashOutAPIData?.stake) {
      return;
    }

    try {
      setCashoutLoader(true);

      const res = await fetchData({
        url: CONFIG.placeBetURL,
        payload: cashOutAPIData,
      });

      if (res?.meta?.status === false) {
        throw new Error(res?.meta?.message || "Cashout Failed");
      }

      // Clear cashout states
      setCashoutValues({});
      setShowCashoutValue({});
      setCashOutAPIData(null);

      // Refresh data
      fetchMarketPL();
      fetchBets();
      refreshUserBalance();

      // Show success toast
      showToast("success", "Cashout Successful", "Your bet has been cashed out successfully");

    } catch (err: any) {
      // Show error toast
      showToast("error", "Cashout Failed", err?.message || "Failed to process cashout. Please try again");
    } finally {
      setCashoutLoader(false);
    }
  };
  useEffect(() => {
    return () => {
      Object.values(cashoutIntervalRef.current).forEach((i) =>
        clearInterval(i)
      );
    };
  }, []);

  const toggleCashout = (market: any) => {
    const marketId = market.marketId;

    if (!hasProfitAndLoss(marketId)) return;

    // 🔹 IF value already shown & confirm not yet
    if (showCashoutValue[marketId] && !confirmCashout[marketId]) {
      setConfirmCashout((p) => ({ ...p, [marketId]: true }));
      return;
    }

    // 🔹 IF confirm true → API CALL
    if (confirmCashout[marketId]) {
      onCashOutConfirm();
      setConfirmCashout((p) => ({ ...p, [marketId]: false }));
      return;
    }

    // 🔹 FIRST CLICK → calculate cashout
    startCashout(market);
  };

  // cashout code end here

  // Handle price click (BACK / LAY)
  const onPriceClick = ({
    marketId,
    min,
    max,
    selectionId,
    runnerName,
    price,
    column,
  }: {
    marketId: string;
    min?: number;
    max?: number;
    selectionId: number;
    runnerName?: string;
    price: number;
    column: "BACK" | "LAY";
  }) => {
    // Check market status first to prevent clicks on SUSPENDED/CLOSED markets
    const currentMarket = (
      isMobile ? filteredMarketData : apiData?.matchOddsData
    )?.find((m: any) => m.marketId === marketId);
    const marketStatus = currentMarket?.status?.toUpperCase();
    if (marketStatus === "SUSPENDED" || marketStatus === "CLOSED") {
      return; // Block the click
    }

    const raw = Number(price || 0);

    if (!Number.isFinite(raw) || raw <= 0) {
      return;
    }

    const finalPrice = Number(raw.toFixed(2));

    const cls: "slip-back" | "slip-lay" =
      column === "BACK" ? "slip-back" : "slip-lay";

    const bg = cls === "slip-back" ? "betbg--back" : "betbg--lay";

    const minStake = Number.isFinite(min as number) ? (min as number) : 1;
    const maxStake = Number.isFinite(max as number)
      ? (max as number)
      : 99999999;

    setBetSlipData({
      marketId: marketId || "",
      selectionId: selectionId || 0,
      runnerName: runnerName || String(selectionId),
      odds: finalPrice,
      slipCls: cls,
      slipBgClass: bg,
      min: minStake,
      max: maxStake,
      side: column,
    });

    setIsSlipOpen(true);
    setOpenSlip({ marketId, selectionId, side: column });
  };



  // Close inline slip (mobile only)
  const closeInlineSlip = () => {
    setIsSlipOpen(false);
    setOpenSlip(null);
    fetchBets();
    fetchMarketPL();
  };

  // Check if this runner row has an open mobile slip
  const isRowSlipOpen = (marketId: string, selectionId: number) => {
    return (
      !!openSlip &&
      openSlip.marketId === marketId &&
      openSlip.selectionId === selectionId
    );
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

useEffect(() => {
  if (!apiData?.matchOddsData || filteredMarketData.length > 0) return;
  
  const allMarkets = apiData.matchOddsData || [];
  let filterdData = [];
  
  if (activeCategory === "Popular") {
    filterdData = allMarkets.filter((market: any) => market?.popular);
  } else if (activeCategory === "All Market") {
    filterdData = allMarkets;
  } else {
    filterdData = allMarkets.filter(
      (market: any) => market?.marketName === activeCategory
    );
  }
  
  setFilteredMarketData(filterdData);
}, [apiData?.matchOddsData]); // ✅ Only depend on initial data load

  // Format PL value with + or -
  const formatPLValue = (value: number | null) => {
    if (value === null || value === undefined) return null;

    const isPositive = value > 0; // Only positive if greater than 0
    const formatted = Math.abs(value)
      .toFixed(2)
      .replace(/\.?0+$/, ""); // Remove trailing zeros

    return (
      <span
        className={`gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {value === 0 ? formatted : isPositive ? formatted : `-${formatted}`}
      </span>
    );
  };

  const getCombinedPL = (marketId: string, selectionId: number) => {
    const actualPL = getRunnerPL(marketId, selectionId);

    // 🔹 NEW: If actualPL is null (no PL data exists), don't show anything
    if (actualPL === null) return null;

    if (
      openSlip &&
      betSlipData &&
      openSlip.marketId === marketId &&
      slipPreview.stake > 0
    ) {
      const previewPL = calculatePreviewPL(
        openSlip.side,
        slipPreview.price,
        slipPreview.stake,
        openSlip.selectionId,
        selectionId
      );

      if (openSlip.selectionId === selectionId) {
        return actualPL + previewPL;
      } else {
        return actualPL + previewPL;
      }
    }

    return actualPL;
  };

  return (
    <div className="lg:m-[5px] lg:mt-1.5">
      {/* MOBILE TOP TAB BAR */}
      <div className="relative flex lg:hidden justify-between items-center bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]">
        <div className="flex items-center text-black font-semibold">
          <div className="flex pt-[13px] pb-3">
            <a
              onClick={() => setActiveTab("odds")}
              className={`relative block text-[12px] text-center border-r px-4 ${activeTab === "odds"
                  ? "after:content-[''] after:absolute after:-top-3 after:left-0 after:w-full after:h-0.5 after:bg-black"
                  : ""
                }`}
            >
              ODDS
            </a>
          </div>

          <div className="flex">
            <a
              onClick={() => setActiveTab("betList")}
              className={`relative block text-[12px] text-center px-4 ${activeTab === "betList"
                  ? "after:content-[''] after:absolute after:-top-3 after:left-0 after:w-full after:h-0.5 after:bg-black"
                  : ""
                }`}
            >
              BET LIST ( {matchedBets.length} )
            </a>
          </div>
        </div>

        <div>
          <div className="absolute top-3 right-11">
            <button className="flex items-center gap-1 text-black" onClick={()=> setIsVolume(!isvolume)}>

              {isvolume ? (
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M533.6 96.5C523.3 88.1 508.2 89.7 499.8 100C491.4 110.3 493 125.4 503.3 133.8C557.5 177.8 592 244.8 592 320C592 395.2 557.5 462.2 503.3 506.3C493 514.7 491.5 529.8 499.8 540.1C508.1 550.4 523.3 551.9 533.6 543.6C598.5 490.7 640 410.2 640 320C640 229.8 598.5 149.2 533.6 96.5zM473.1 171C462.8 162.6 447.7 164.2 439.3 174.5C430.9 184.8 432.5 199.9 442.8 208.3C475.3 234.7 496 274.9 496 320C496 365.1 475.3 405.3 442.8 431.8C432.5 440.2 431 455.3 439.3 465.6C447.6 475.9 462.8 477.4 473.1 469.1C516.3 433.9 544 380.2 544 320.1C544 260 516.3 206.3 473.1 171.1zM412.6 245.5C402.3 237.1 387.2 238.7 378.8 249C370.4 259.3 372 274.4 382.3 282.8C393.1 291.6 400 305 400 320C400 335 393.1 348.4 382.3 357.3C372 365.7 370.5 380.8 378.8 391.1C387.1 401.4 402.3 402.9 412.6 394.6C434.1 376.9 448 350.1 448 320C448 289.9 434.1 263.1 412.6 245.5zM80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416z"/></svg>
              ):(
                <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5.88889 16.0001H2C1.44772 16.0001 1 15.5524 1 15.0001V9.00007C1 8.44778 1.44772 8.00007 2 8.00007H5.88889L11.1834 3.66821C11.3971 3.49335 11.7121 3.52485 11.887 3.73857C11.9601 3.8279 12 3.93977 12 4.05519V19.9449C12 20.2211 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16.0001ZM20.4142 12.0001L23.9497 15.5356L22.5355 16.9498L19 13.4143L15.4645 16.9498L14.0503 15.5356L17.5858 12.0001L14.0503 8.46454L15.4645 7.05032L19 10.5859L22.5355 7.05032L23.9497 8.46454L20.4142 12.0001Z"></path>
              </svg>
              )}
            </button>
          </div>

          <div className="absolute top-2.5 right-2">
            <p className="mb-0 text-black" onClick={()=> setIsWatchLive(!iswatchlive)}>
              <svg
                className="w-6 h-[22px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 4.00087C2 3.44811 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44463 22 4.00087V17.9991C22 18.5519 21.5447 19 21.0082 19H2.9918C2.44405 19 2 18.5554 2 17.9991V4.00087ZM4 5V17H20V5H4ZM5 20H19V22H5V20Z"></path>
              </svg>
            </p>
          </div>
        </div>
      </div>

      {activeTab === "betList" ? (
        <div className="block">
          {matchedBets.length === 0 ? (
            <div className="flex justify-center items-center h-[30vh] text-[21px] mt-4">
              You Have No Open Bets.
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto bg-white shadow-sm">
              <div className="flex justify-between items-center h-[29.5px] m-[3px]">
                <div className="flex items-center gap-2">
                  <span className="bg-[#00B59B] text-white px-2 py-0.5 rounded text-[13px] font-bold">
                    {matchedBets.length}
                  </span>
                  <span className="font-bold text-gray-800 text-[12px]">
                    Matched
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    className="text-[12px] font-bold text-gray-700 cursor-pointer relative -top-px"
                    htmlFor="avg-toggle"
                  >
                    Avg Odds
                  </label>
                  <div className="flex items-center mb-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-[35px] h-5 rounded-full peer border border-gray-300 transition-colors duration-300 peer-checked:bg-[#0d6dfc] peer-checked:shadow-[0_0_0_0.25rem_#0d6efd40] peer-focus:outline-none peer-focus:shadow-[0_0_0_3px_#0d6efd40] peer-focus:border-[#86b7fe]"></div>
                      <div className="absolute left-[3px] top-[3px] w-[13px] h-[13px] bg-[#bfbfbf] rounded-full shadow-md transform peer-checked:translate-x-4 transition-transform duration-300"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black/12.5">
                  <thead>
                    <tr className="bg-white h-[26px] text-gray-700 text-sm border-b border-gray-300">
                      <th className="text-left p-0.5 font-normal w-[60%]">
                        Description
                      </th>
                      <th className="text-center p-0.5 font-normal border-l border-gray-300">
                        Odds
                      </th>
                      <th className="text-center p-0.5 font-normal w-[20%] border-l border-gray-300">
                        Stake
                      </th>
                    </tr>
                  </thead>
                  <tbody className="border-black">
                    {matchedBets.map((bet) => (
                      <React.Fragment key={bet.betId}>
                        <tr
                          onClick={() => toggleRow(bet.betId)}
                          className={`border-b border-gray-400 h-[41px] cursor-pointer ${bet.side === "LAY" ? "bg-[#faa9ba]" : "bg-[#73bcf0]"
                            }`}
                        >
                          <td className="p-0.5 border-r border-gray-400">
                            <div className="flex items-center gap-2">
                              <div
                                className={`${expandedRows[bet.betId] ? "rotate-180" : ""
                                  }`}
                              >
                                <FaChevronDown className="w-3 h-3" />
                              </div>
                              <div className="leading-tight text-[12px]">
                                <div className="text-gray-900">
                                  Match Odds -{" "}
                                  {bet.selectionName || bet.marketName}
                                </div>
                                <div className=" text-gray-800 mt-0.5">
                                  <span className="">Bet Id</span> {bet.betId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center p-0.5 text-base text-black border-r border-gray-400">
                            {bet.requestedPrice}
                          </td>
                          <td className="text-center p-0.5 text-base text-black">
                            {bet.requestedSize}
                          </td>
                        </tr>
                        {expandedRows[bet.betId] && (
                          <tr className="bg-white border-b border-gray-400 h-[41px]">
                            <td
                              colSpan={3}
                              className="text-xs text-gray-800 leading-snug p-0.5"
                            >
                              <div>
                                <span className="font-medium">Placed: </span>{" "}
                                {formatDateTime(bet.placedDate)}
                              </div>
                              <div>
                                <span className="font-medium">Matched: </span>{" "}
                                {formatDateTime(bet.matchedDate)}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex w-full mb-[45px]">
          <div className="left-part overflow-y-auto w-full lg:w-[70%]">
            <div className=" flex justify-between items-center bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] py-[4px] px-[8px] min-[992px]:py-[3.5px] min-[992px]:px-2.5 lg:mb-[3px] h-8 text-white">
              <span className="text-sm lg:text-[15px] lg:uppercase font-medium lg:leading-normal relative top-[1px] min-[992px]:top-[0px]">
                {apiData?.matchOddsData[0]?.event?.name || "Team A vs Team B"}
              </span>
              {apiData?.matchOddsData[0]?.inplay ? (
                <span className=" game-iconinplay">
                  <span className="text-xs min-[992px]:text-[16px] py-1 rounded-full font-medium inline-block transition-all duration-300 heartbeat-anim">
                    INPLAY
                  </span>
                </span>
              ) : (
                <span className="text-sm py-1 rounded-full md:font-normal inline-block">
                  {formatDateStamp(apiData?.matchOddsData[0]?.marketStartTime)}
                </span>
              )}
            </div>

            {iswatchlive ? (
              <div className="w-full min-w-50 py-[9px] px-2.5 text-xs h-9 bg-[linear-gradient(360deg,#030a12,#444647_60%,#58595a)] flex justify-center items-center text-white"> Watch Live </div>
            ): (
            <div
              className="p-0 mb-[3px] bg-no-repeat bg-cover bg-center w-full h-[90px]"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, #0000001a, #00000073), url('/market/market.jpg')",
              }}
            >
              <div className="">
                <div className="flex flex-col justify-between items-center px-3 pt-1.5 h-[90px]">
                  <div className="flex justify-between w-full">
                    <div className=" text-white text-[12px] font-bold md:font-normal [text-shadow:#fc0_1px_0_10px]">
                      {apiData?.matchOddsData[0]?.status}
                    </div>
                    <div className=" text-white text-[12px] tracking-[-0.2px] font-bold md:font-normal  [text-shadow:#fc0_1px_0_10px]">
                      <span className=" text-[#ffff55]">Game time</span>{" "}
                      {formatDateDetail(
                        apiData?.matchOddsData[0]?.marketStartTime
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center items-center flex-col [text-shadow:#fc0_1px_0_10px]">
                    <span className="relative -top-0.5 left-[5px] font-bold text-[12px] heartbeat-anim2">
                      Bet Started
                    </span>
                  </div>
                </div>
              </div>
            </div> 
            )}
            <div className="min-[992px]:hidden">
              <ul className="flex overflow-x-auto no-scrollbar p-[5px] bg-[linear-gradient(180deg,#000000,#000000_42%,#000000)] text-white">
                {categories?.map((category: any, idx: number) => (
                  <li
                    key={idx}
                    className={`px-2.5 py-[5px] whitespace-nowrap rounded-full ml-[5px] text-[12px] font-medium border border-white cursor-pointer ${activeCategory === category
                        ? "bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)] text-black"
                        : "hover:bg-gray-100 bg-transparent text-white"
                      }`}
                  >
                    <button onClick={() => setActiveCategory(category)}>
                      {category.toUpperCase()}
                    </button>
                  </li>
                ))}
              </ul>
            </div>



{(isMobile ? filteredMarketData : matchOddsData)?.map(  
  (market: any) => {
    const hasPL = hasProfitAndLoss(market.marketId);
    const isActive = hasPL && showCashoutValue[market.marketId];

    return (
      <div
        key={market?.marketId}
        className="bg-[linear-gradient(180deg,#000000,#ccc1c1)]"
      >
        <div
          className={`mt-0 pl-2 pr-1.5 flex justify-between items-center
${hasPL ? "h-9 py-1 lg:py-[3px]" : "h-[27.56px] min-[992px]:h-[26px] py-1"}
`}
        >
          <div className="flex gap-2 items-center">
            <span className="font-bold md:font-normal text-white text-[13px] lg:text-[14px]">
              {market?.marketName}
            </span>

            {/* 🔹 NEW: Cashout Toggle */}
            {/* 🔹 CASHOUT TOGGLE WITH CONFIRM */}
            {market?.runners?.length < 3 && (
              <div className="ml-1 h-[26px] relative top-[-2px]">
                <div
                  onClick={() => {
                    if (hasPL) {
                      if (showCashoutValue[market.marketId]) {
                        // Directly call the cashout API when clicking on the calculated value
                        onCashOutConfirm(market.marketId);
                      } else {
                        // Show the cashout value on first click
                        toggleCashout(market);
                      }
                    }
                  }}
                  className={`
rounded-[4px] py-[3px] px-[10px] my-[2px] leading-[18px]
inline-flex items-center gap-1 select-none
${hasPL ? "bg-[#ccc] cursor-pointer" : "cursor-default"}
`}
                >
                  {/* Icon */}
                  <span className="w-[18px] h-[18px] rounded-[2px] border-2 border-[#ffb900] flex items-center justify-center bg-[#ffb900]">
                    {showCashoutValue[market.marketId] && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[13px] h-[13px] text-black"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}

                    {!showCashoutValue[market.marketId] && (
                      <span className="w-[13px] h-[13px] bg-black rounded-full"></span>
                    )}
                  </span>

                  {/* Text */}
                  <span
                    className={`text-sm ${showCashoutValue[market.marketId]
                        ? Number(cashoutValues[market.marketId]) < 0
                          ? "font-bold text-[#ff0000]"
                          : "font-bold text-[#008000]"
                        : hasPL
                          ? "text-black"
                          : "text-white"
                      }`}
                  >
                    {showCashoutValue[market.marketId]
                      ? cashoutValues[market.marketId]
                      : "Cash Out"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedMarketRules(
                market?.description?.rules || null
              );
              setRulesOpen(true);
            }}
            className="text-white mr-px mb-px"
          >
            <svg
              className="w-4 h-4 relative"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path>
            </svg>
          </button>
        </div>

        {/* MOBILE HEADER */}
        <div className="text-[12px] border-b border-[#aaa] md:hidden">
          <div className="flex bg-gray-100">
            <div className="py-0.5 text-black px-[5px] flex justify-between items-center border-b border-[#aaa] w-[60%] md:font-normal">
              <span>
                Min: {market?.min} Max: {market?.max}
              </span>
              <span className=" ml-2">
                M:
                {market?.totalMatched >= 1000
                  ? `${(market?.totalMatched / 1000).toFixed(2)}K`
                  : market?.totalMatched?.toFixed(2) || "0"}
              </span>
            </div>
            <div className="w-[40%] flex">
              <div className="back flex justify-center items-center text-center w-[50%]  text-[#212529] text-[12px] bg-[#72bbef]">
                BACK
              </div>
              <div className="lay flex justify-center items-center text-center w-[50%]  text-[#212529] text-[12px] bg-[#faa9ba]">
                LAY
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP HEADER */}
        <div className="hidden md:block text-[12px] border-b border-[#aaa] md:border-none bg-white">
          <div className="border-b border-white flex">
            <div className="ps-1.5 pe-[5px] py-[2px] min-[992px]:py-[5px] leading-[15px] w-[40%] h-[22px] min-[992px]:h-auto">
              <b className="text-[12px] min-[992px]:text-[14px] text-[#0dcaf0] md:font-normal">
                <span>
                  Min: {market?.min} Max: {market?.max}
                </span>
              </b>
            </div>

            <div className="leading-[15px] py-[2px] min-[992px]:py-[5px] text-[12px] min-[992px]:text-[16px] w-[10%]"></div>
            <div className="leading-[15px] py-[2px] min-[992px]:py-[5px] text-[12px] min-[992px]:text-[16px] w-[10%]"></div>
            <div className="leading-[15px] py-[2px] min-[992px]:py-[5px] text-[12px] min-[992px]:text-[16px] w-[10%] cursor-pointer bg-[#72bbef] text-center text-[#212529] h-[22px] flex items-center justify-center min-[992px]:h-auto">
              <b className="md:font-normal">BACK</b>
            </div>
            <div className="leading-[15px] py-[2px] min-[992px]:py-[5px] text-[12px] min-[992px]:text-[16px] w-[10%] cursor-pointer bg-[#faa9ba] text-center text-[#212529] md:border-l md:border-white h-[22px] flex items-center justify-center min-[992px]:h-auto">
              <b className="md:font-normal">LAY</b>
            </div>
            <div className="leading-[15px] py-[2px] min-[992px]:py-[5px] pr-[5px] text-[#212529] text-center font-bold text-[12px] min-[992px]:text-[14px] border-r border-white w-[20%] md:font-normal h-[22px] flex items-center justify-center min-[992px]:h-auto">
              Matched:&nbsp;
              {market?.totalMatched >= 1000
                ? `${(market?.totalMatched / 1000).toFixed(2)}K`
                : market?.totalMatched?.toFixed(2) || "0"}
            </div>
          </div>
        </div>

        {/* RUNNERS */}
        <div className="lg:mb-0.5">
          {market?.runners?.map((runner: any) => {
            const isSuspended =
              runner?.status === "SUSPENDED" ||
              market?.status === "SUSPENDED";
            const isClosed =
              runner?.status === "CLOSED" ||
              market?.status === "CLOSED";
            const statusText = isClosed
              ? "CLOSED"
              : isSuspended
                ? "SUSPENDED"
                : "";
            const runnerName = market?.runnersName?.find(
              (item: any) =>
                item?.selectionId === runner?.selectionId
            )?.runnerName;

            const runnerPL = getCombinedPL(
              market.marketId,
              runner.selectionId
            );
            const displayPL = formatPLValue(runnerPL);

            return (
              <React.Fragment key={runner?.selectionId}>
                <div className="flex border-b border-[#aaa] md:border-white bg-gray-50 h-[41px] md:h-10 md:bg-[#f2f2f2]">
                  {/* RUNNER NAME + PL */}
                  <div className="col-span-3 py-0.5 px-[5px] md:border-l md:border-white md:col-span-1 w-[60%] md:w-[40%] h-[41px] md:h-auto">
                    <div className="flex justify-between items-center">
                      <div className="w-full flex justify-between gap-1 md:gap-0 flex-col">
                        <span className="font-normal text-[12px] lg:text-[14px] text-[#212529]">
                          {runnerName}
                        </span>
                        {displayPL && (
                          <div className="-m-1 ml-1 text-[12px]  ">
                            {displayPL}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ODDS BUTTONS */}
                  <div
                    className={`relative w-[40%] md:text-[#212529] md:w-[60%] flex 
${isSuspended || isClosed
                        ? `after:content-['${statusText}'] after:absolute after:inset-0 after:bg-black/60 after:text-[#ff3c3c] after:flex after:items-center after:justify-center after:uppercase after:font-extralight after:text-[15px] after:cursor-not-allowed`
                        : ""
                      }`}
                  >
                    {/* ========== MOBILE BACK (Shows [0] only) ========== */}
                    <div
                      className={`text-center flex-col md:hidden text-[#212529] justify-center items-center w-[50%] bg-[#72bbef] flex ${!(isSuspended || isClosed)
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                        }`}
                      onClick={() =>
                        !(isSuspended || isClosed) &&
                        onPriceClick({
                          marketId: market?.marketId,
                          min: market?.min,
                          max: market?.max,
                          selectionId: runner?.selectionId,
                          runnerName: runnerName,
                          price:
                            runner?.ex?.availableToBack[0]?.price ||
                            0,
                          column: "BACK",
                        })
                      }
                    >
                      <span className="odd block md:font-normal  leading-[1.1]">
                        {runner?.ex?.availableToBack[0]?.price ||
                          "0"}
                      </span>
                      <span className="block text-xs lg:text-[10px] md:font-normal">
                        {(
                          (runner?.ex?.availableToBack[0]?.size ||
                            0) / 1000
                        )?.toFixed(2)}
                      </span>
                    </div>

                    {/* ========== DESKTOP BACK 3 (Weakest - Shows [2]) ========== */}
                    <div
                      className={`text-center md:border-l md:border-white hidden md:flex flex-col justify-center items-center w-[50%]  bg-[#72bbef] ${!(isSuspended || isClosed)
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                        }`}
                      onClick={() =>
                        !(isSuspended || isClosed) &&
                        onPriceClick({
                          marketId: market?.marketId,
                          min: market?.min,
                          max: market?.max,
                          selectionId: runner?.selectionId,
                          runnerName: runnerName,
                          price:
                            runner?.ex?.availableToBack[2]?.price ||
                            0,
                          column: "BACK",
                        })
                      }
                    >
                      <span className="odd block font-bold md:font-normal leading-[1.1]">
                        {runner?.ex?.availableToBack[2]?.price ||
                          "0"}
                      </span>
                      <span className="block text-xs lg:text-[10px]">
                        {(
                          (runner?.ex?.availableToBack[2]?.size ||
                            0) / 1000
                        )?.toFixed(2)}
                      </span>
                    </div>

                    {/* ========== DESKTOP BACK 2 (Medium - Shows [1]) ========== */}
                    <div
                      className={`text-center md:border-l md:border-white hidden md:flex flex-col justify-center items-center w-[50%] bg-[#72bbef] ${!(isSuspended || isClosed)
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                        }`}
                      onClick={() =>
                        !(isSuspended || isClosed) &&
                        onPriceClick({
                          marketId: market?.marketId,
                          min: market?.min,
                          max: market?.max,
                          selectionId: runner?.selectionId,
                          runnerName: runnerName,
                          price:
                            runner?.ex?.availableToBack[1]?.price ||
                            0,
                          column: "BACK",
                        })
                      }
                    >
                      <span className="odd block font-bold md:font-normal leading-[1.1]">
                        {runner?.ex?.availableToBack[1]?.price ||
                          "0"}
                      </span>
                      <span className="block text-xs lg:text-[10px]">
                        {(
                          (runner?.ex?.availableToBack[1]?.size ||
                            0) / 1000
                        )?.toFixed(2)}
                      </span>
                    </div>

                    {/* ========== DESKTOP BACK 1 (Strongest - Shows [0]) ========== */}
                    <div
                      className={`text-center md:border-l md:border-white hidden md:flex flex-col justify-center items-center w-[50%] bg-[#72bbef] ${!(isSuspended || isClosed)
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                        }`}
                      onClick={() =>
                        !(isSuspended || isClosed) &&
                        onPriceClick({
                          marketId: market?.marketId,
                          min: market?.min,
                          max: market?.max,
                          selectionId: runner?.selectionId,
                          runnerName: runnerName,
                          price:
                            runner?.ex?.availableToBack[0]?.price ||
                            0,
                          column: "BACK",
                        })
                      }
                    >
                      <span className="odd block font-bold md:font-normal leading-[1.1]">
                        {runner?.ex?.availableToBack[0]?.price ||
                          "0"}
                      </span>
                      <span className="block text-xs lg:text-[10px]">
                        {(
                          (runner?.ex?.availableToBack[0]?.size ||
                            0) / 1000
                        )?.toFixed(2)}
                      </span>
                    </div>

                    {/* ========== DESKTOP LAY 1 (Strongest - Shows [0]) ========== */}
                    <div
                      className={`text-center md:border-l md:border-white hidden md:flex flex-col justify-center items-center  text-[#212529] w-[50%] bg-[#faa9ba] ${!(isSuspended || isClosed)
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                        }`}
                      onClick={() =>
                        !(isSuspended || isClosed) &&
                        onPriceClick({
                          marketId: market?.marketId,
                          min: market?.min,
                          max: market?.max,
                          selectionId: runner?.selectionId,
                          runnerName: runnerName,
                          price:
                            runner?.ex?.availableToLay[0]?.price ||
                            0,
                          column: "LAY",
                        })
                      }
                    >
                      <span className="odd block md:font-normal leading-[1.1]">
                        {runner?.ex?.availableToLay[0]?.price ||
                          "0"}
                      </span>
                      <span className="block text-xs lg:text-[10px]">
                        {(
                          (runner?.ex?.availableToLay[0]?.size ||
                            0) / 1000
                        )?.toFixed(2)}
                      </span>
                    </div>

                    {/* ========== MOBILE LAY (Shows [2]) ========== */}
                    <div
                      className={`text-center flex-col md:hidden justify-center items-center w-[50%] bg-[#faa9ba]  text-[#212529] flex ${!(isSuspended || isClosed)
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                        }`}
                      onClick={() =>
                        !(isSuspended || isClosed) &&
                        onPriceClick({
                          marketId: market?.marketId,
                          min: market?.min,
                          max: market?.max,
                          selectionId: runner?.selectionId,
                          runnerName: runnerName,
                          price:
                            runner?.ex?.availableToLay[2]?.price ||
                            0,
                          column: "LAY",
                        })
                      }
                    >
                      <span className="odd block  md:font-normal  leading-[1.1]">
                        {runner?.ex?.availableToLay[2]?.price ||
                          "0"}
                      </span>
                      <span className="block text-xs lg:text-[10px]">
                        {(
                          (runner?.ex?.availableToLay[2]?.size ||
                            0) / 1000
                        )?.toFixed(2)}
                      </span>
                    </div>

                    {/* ========== DESKTOP LAY 2 (Medium - Shows [1]) ========== */}
                    <div
                      className={`text-center md:border-l md:border-white hidden md:flex flex-col justify-center items-center w-[50%] bg-[#faa9ba] ${!(isSuspended || isClosed)
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                        }`}
                      onClick={() =>
                        !(isSuspended || isClosed) &&
                        onPriceClick({
                          marketId: market?.marketId,
                          min: market?.min,
                          max: market?.max,
                          selectionId: runner?.selectionId,
                          runnerName: runnerName,
                          price:
                            runner?.ex?.availableToLay[1]?.price ||
                            0,
                          column: "LAY",
                        })
                      }
                    >
                      <span className="odd block font-bold md:font-normal leading-[1.1]">
                        {runner?.ex?.availableToLay[1]?.price ||
                          "0"}
                      </span>
                      <span className="block text-xs lg:text-[10px]">
                        {(
                          (runner?.ex?.availableToLay[1]?.size ||
                            0) / 1000
                        )?.toFixed(2)}
                      </span>
                    </div>

                    {/* ========== DESKTOP LAY 3 (Weakest - Shows [2]) ========== */}
                    <div
                      className={`text-center md:border-l md:border-white hidden md:flex flex-col justify-center items-center w-[50%] bg-[#faa9ba] ${!(isSuspended || isClosed)
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                        }`}
                      onClick={() =>
                        !(isSuspended || isClosed) &&
                        onPriceClick({
                          marketId: market?.marketId,
                          min: market?.min,
                          max: market?.max,
                          selectionId: runner?.selectionId,
                          runnerName: runnerName,
                          price:
                            runner?.ex?.availableToLay[2]?.price ||
                            0,
                          column: "LAY",
                        })
                      }
                    >
                      <span className="odd block font-bold md:font-normal leading-[1.1]">
                        {runner?.ex?.availableToLay[2]?.price ||
                          "0"}
                      </span>
                      <span className="block text-xs lg:text-[10px]">
                        {(
                          (runner?.ex?.availableToLay[2]?.size ||
                            0) / 1000
                        )?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* INLINE BETSLIP (Mobile only) */}
                {isRowSlipOpen(
                  market?.marketId,
                  runner?.selectionId
                ) && (
                    <div ref={betslipRef} className="lg:hidden">
                      {betSlipData && (
                        <MBetSlip
                          visible={isSlipOpen}
                          backLayClsModal={betSlipData?.slipCls}
                          extraBgClass={betSlipData?.slipBgClass}
                          odds={betSlipData?.odds}
                          marketId={betSlipData?.marketId}
                          selectionId={betSlipData?.selectionId}
                          eventId={eventId}
                          sportId={sportId}
                          marketType={market?.marketType}
                          runnerName={betSlipData?.runnerName}
                          minStake={betSlipData?.min}
                          maxStake={betSlipData?.max}
                          onClose={closeInlineSlip}
                          onPlaced={() => {
                            closeInlineSlip();
                            fetchMarketPL();
                          }}
                          onPreviewChange={handleSlipPreview}
                        />
                      )}
                    </div>
                  )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
)}
          </div>

          <div className="right-part hidden lg:block lg:w-[30%] ml-[5px]">
            <DBetSlip
              visible={!!betSlipData}
              odds={betSlipData?.odds}
              marketId={betSlipData?.marketId}
              selectionId={betSlipData?.selectionId}
              eventId={eventId}
              sportId={sportId}
              runnerName={betSlipData?.runnerName}
              minStake={betSlipData?.min}
              maxStake={betSlipData?.max}
              backLayClsModal={betSlipData?.slipCls}
              onClose={() => setBetSlipData(null)}
              onPlaced={() => {
                fetchBets();
                fetchMarketPL();
              }}
              onPreviewChange={handleSlipPreview}
            />
          </div>
        </div>
      )}

      <RulesModal
        open={isrulesopen}
        onClose={() => {
          setRulesOpen(false);
          setSelectedMarketRules(null);
        }}
        rules={selectedMarketRules}
      />

      <style jsx>{`
        @keyframes zoomInZoomOut {
          0% {
            transform: scale(0.865);
            color: rgb(255, 56, 0);
          }
          50% {
            transform: scale(1.097);
            color: rgb(255, 252, 0);
          }
          100% {
            transform: scale(0.865);
            color: rgb(255, 56, 0);
          }
        }
        @keyframes sec {
          0% {
            transform: scale(0.865);
            color: rgb(255, 255, 255);
          }
          50% {
            transform: scale(1.097);
            color: rgb(255, 252, 0);
          }
          100% {
            transform: scale(0.865);
            color: rgb(255, 255, 255);
          }
        }

        .heartbeat-anim2 {
          transition: 0.3s ease-in;
          animation: sec 1s ease infinite;
          display: inline-block;
        }
        .heartbeat-anim {
          transition: 0.3s ease-in;
          animation: zoomInZoomOut 1s ease infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
