/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useRef } from "react";
import MBetSlip from "../m-betslip";
import DBetSlip from "@/components/d-view/d-betslip";
import RulesModal from "@/components/modals/rules-modal";
import { formatDateStamp } from "@/lib/functions";
import { formatDateDetail } from "@/lib/functions";
import { FaChevronDown } from "react-icons/fa";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import { useToast } from "@/components/common/toast/toast-context";
import { useAppStore } from "@/lib/store/store";
import { useParams } from "next/navigation"; // 👈 Added this for params

export default function MMarketDetailsPage({ apiData }: { apiData: any }) {
  const [activeTab, setActiveTab] = useState("odds");
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [filteredMarketData, setFilteredMarketData] = useState<any[]>([]);
  const betslipRef = useRef<HTMLDivElement>(null);

  // INLINE (mobile) slip open or not
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [selectedMarketRules, setSelectedMarketRules] = useState<string | null>(null);

  // 👇 State for Real Data
  const [matchedBets, setMatchedBets] = useState<any[]>([]);
  const [unmatchedBets, setUnmatchedBets] = useState<any[]>([]);

  const params = useParams();
  // Event ID aur Sport ID nikal rahe hain API call ke liye
  const eventId = (params as any)?.eventId || "";
  const sportId = (params as any)?.sportId || "";

  // Track which row is open (mobile)
  const [openSlip, setOpenSlip] = useState<{
    marketId: string;
    selectionId: number;
    side: "BACK" | "LAY";
  } | null>(null);

  // Shared betslip data (used by both mobile + desktop)
  const [isMobile, setIsMobile] = useState(false);
  const [betSlipData, setBetSlipData] = useState<{
    marketId: string;
    selectionId: number;
    runnerName: string;
    odds: number;
    slipCls: "slip-back" | "slip-lay";
    slipBgClass: string;
    min: number;
    max: number;
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

  // 👇 Helper function to format date inside Accordion
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

  // 👇 API Fetch Logic (Same as DBetSlip)
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

  // 👇 Fetch data on mount or when eventId changes
  useEffect(() => {
    fetchBets();
    // Optional: Auto refresh every few seconds
    // const interval = setInterval(fetchBets, 5000);
    // return () => clearInterval(interval);
  }, [eventId, sportId]);


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
    const raw = Number(price || 0);

    // Block click if 0 or invalid
    if (!Number.isFinite(raw) || raw <= 0) {
      return;
    }

    const finalPrice = Number(raw.toFixed(2));

    // slip class
    const cls: "slip-back" | "slip-lay" =
      column === "BACK" ? "slip-back" : "slip-lay";

    // bg theme (for mobile slip extra class, if needed)
    const bg = cls === "slip-back" ? "betbg--back" : "betbg--lay";

    const minStake = Number.isFinite(min as number) ? (min as number) : 1;
    const maxStake = Number.isFinite(max as number)
      ? (max as number)
      : 99999999;

    // Shared betslip data (mobile + desktop)
    setBetSlipData({
      marketId: marketId || "",
      selectionId: selectionId || 0,
      runnerName: runnerName || String(selectionId),
      odds: finalPrice,
      slipCls: cls,
      slipBgClass: bg,
      min: minStake,
      max: maxStake,
    });

    // For mobile inline betslip
    setIsSlipOpen(true);
    setOpenSlip({ marketId, selectionId, side: column });
  };

  // Close inline slip (mobile only)
  const closeInlineSlip = () => {
    setIsSlipOpen(false);
    setOpenSlip(null);
    fetchBets(); // Refresh bets when slip closes (after placement)
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
    const allMarkets = apiData?.matchOddsData || [];
    let filterdData = [];

    // Popular
    if (activeCategory === "Popular") {
      filterdData = allMarkets?.filter((market: any) => market?.popular);
    } else if (activeCategory === "All Market") {
      filterdData = allMarkets;
    } else {
      filterdData = allMarkets?.filter(
        (market: any) => market?.marketName === activeCategory
      );
    }

    setFilteredMarketData(filterdData);
  }, [activeCategory]);

  return (
    <div className="lg:m-[5px] lg:mt-1.5">
      {/* MOBILE TOP TAB BAR */}
      <div className="relative flex lg:hidden justify-between items-center bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]">
        {/* Tabs */}
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
              {/* Count update kiya hai */}
              BET LIST ( {matchedBets.length} )
            </a>
          </div>
        </div>

        {/* Speaker + TV Icons */}
        <div>
          {/* Speaker Icon */}
          <div className="absolute top-3 right-11">
            <button className="flex items-center gap-1 text-black">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5.88889 16.0001H2C1.44772 16.0001 1 15.5524 1 15.0001V9.00007C1 8.44778 1.44772 8.00007 2 8.00007H5.88889L11.1834 3.66821C11.3971 3.49335 11.7121 3.52485 11.887 3.73857C11.9601 3.8279 12 3.93977 12 4.05519V19.9449C12 20.2211 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16.0001ZM20.4142 12.0001L23.9497 15.5356L22.5355 16.9498L19 13.4143L15.4645 16.9498L14.0503 15.5356L17.5858 12.0001L14.0503 8.46454L15.4645 7.05032L19 10.5859L22.5355 7.05032L23.9497 8.46454L20.4142 12.0001Z"></path>
              </svg>
            </button>
          </div>

          {/* TV Icon */}
          <div className="absolute top-2.5 right-2">
            <p className="mb-0 text-black">
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
              {/* Header Section */}
              <div className="flex justify-between items-center h-[29.5px] m-[3px]">
                <div className="flex items-center gap-2">
                  <span className="bg-[#00B59B] text-white px-2 py-0.5 rounded text-[13px] font-bold">
                    {matchedBets.length}
                  </span>
                  <span className="font-bold text-gray-800 text-[12px]">Matched</span>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center gap-2">
                  <label className="text-[12px] font-bold text-gray-700 cursor-pointer relative -top-px" htmlFor="avg-toggle">Avg Odds</label>
                  <div className="flex items-center mb-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer"
                      />
                      <div className="w-[35px] h-5 rounded-full peer border border-gray-300 transition-colors duration-300 peer-checked:bg-[#0d6dfc] peer-checked:shadow-[0_0_0_0.25rem_#0d6efd40] peer-focus:outline-none peer-focus:shadow-[0_0_0_3px_#0d6efd40] peer-focus:border-[#86b7fe]"></div>
                      <div className="absolute left-[3px] top-[3px] w-[13px] h-[13px] bg-[#bfbfbf] rounded-full shadow-md transform peer-checked:translate-x-4 transition-transform duration-300"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black/12.5">
                  <thead>
                    <tr className="bg-white h-[26px] text-gray-700 text-sm border-b border-gray-300">
                      <th className="text-left p-0.5 font-normal w-[60%]">Description</th>
                      <th className="text-center p-0.5 font-normal border-l border-gray-300">Odds</th>
                      <th className="text-center p-0.5 font-normal w-[20%] border-l border-gray-300">Stake</th>
                    </tr>
                  </thead>
                  <tbody className="border-black">
                    {matchedBets.map((bet) => (
                      <React.Fragment key={bet.betId}>
                        {/* --- MAIN ROW --- */}
                        <tr
                          onClick={() => toggleRow(bet.betId)}
                          className={`border-b border-gray-400 h-[41px] cursor-pointer ${bet.side === "LAY" ? "bg-[#faa9ba]" : "bg-[#73bcf0]"
                            }`}
                        >
                          <td className="p-0.5 border-r border-gray-400">
                            <div className="flex items-center gap-2">
                              <div className={`${expandedRows[bet.betId] ? 'rotate-180' : ''}`}>
                                <FaChevronDown className="w-3 h-3" />
                              </div>
                              <div className="leading-tight text-[12px]">
                                <div className="text-gray-900">Match Odds - {bet.selectionName || bet.marketName}</div>

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
                            <td colSpan={3} className="text-xs text-gray-800 leading-snug p-0.5">
                              <div>
                                <span className="font-medium">Placed: </span> {formatDateTime(bet.placedDate)}
                              </div>
                              <div>
                                <span className="font-medium">Matched: </span> {formatDateTime(bet.matchedDate)}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {matchedBets.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">No bets found.</div>
                )}
              </div>
            </div>
          )}


        </div>
      ) : (
        <div className="flex w-full">
          {/* LEFT PART: MARKETS & ODDS */}
          <div className="left-part overflow-y-auto w-full lg:w-[70%]">
            {/* Game Header */}
            <div className=" flex justify-between items-center bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] py-[3.5px] px-2.5 lg:mb-[3px] lg:h-8 text-white">
              <span className="text-sm lg:text-[15px] lg:uppercase font-medium lg:leading-normal">
                {apiData?.matchOddsData[0]?.event?.name || "Team A vs Team B"}
              </span>
              {apiData?.matchOddsData[0]?.inplay ? (
                <span className=" game-iconinplay">
                  <span
                    className={`
                   text-[16px] py-1 rounded-full font-medium inline-block transition-all duration-300
                    heartbeat-anim
                  `}
                  >
                    INPLAY
                  </span>
                </span>
              ) : (
                <span
                  className={`
                    text-xs py-1 rounded-full font-bold md:font-normal  inline-block
                  `}
                >
                  {formatDateStamp(apiData?.matchOddsData[0]?.marketStartTime)}
                </span>
              )}
            </div>

            {/* Game Status Banner */}
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
                    <span
                      className={`relative -top-0.5 left-[5px] font-bold text-[12px]
                        heartbeat-anim2`}
                    >
                      Bet Started
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Categories (MOBILE) */}
            <div className="md:hidden">
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

            {/* Dynamic Markets */}
            {(isMobile ? filteredMarketData : apiData?.matchOddsData)?.map(
              (market: any) => (
                <div
                  key={market?.marketId}
                  className="bg-[linear-gradient(180deg,#000000,#ccc1c1)]"
                >
                  {/* Market Title Row */}
                  <div className=" mt-0 py-1 pl-2 pr-1.5 lg:py-[3px] flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span className="font-bold md:font-normal text-white text-[13px] lg:text-[14px]">
                        {market?.marketName}
                      </span>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <span className="flex items-center relative top-px text-white text-[13px] lg:text-[14px] font-bold md:font-normal">
                            <span className="relative w-[18px] h-[18px] mr-[5px] bg-yellow-500 rounded-xs">
                              <span className="w-[13px] h-[13px] bg-black rounded-full mr-1.5 absolute z-20 top-0.5 left-0.5"></span>
                            </span>
                            Cash Out
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMarketRules(market?.description?.rules || null);
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

                  {/* Mobile Header */}
                  <div className="text-[12px] border-b border-[#aaa] lg:hidden">
                    <div className="flex bg-gray-100">
                      <div className="py-0.5 text-black px-[5px] flex justify-between items-center border-b border-[#aaa] w-[60%] md:font-normal">
                        <span>
                          Min: {market?.min} Max: {market?.max}
                        </span>
                        <span className=" ml-2">
                          M:{(market?.totalMatched / 1000).toFixed(2)}K
                        </span>
                      </div>
                      <div className="w-[40%] flex">
                        <div className="back flex justify-center items-center text-center w-[50%] text-[12px] font-semibold bg-[#72bbef]">
                          BACK
                        </div>
                        <div className="lay flex justify-center items-center text-center w-[50%] text-[12px] font-semibold bg-[#faa9ba]">
                          LAY
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Header */}
                  <div className="hidden lg:block text-[12px] border-b border-[#aaa] lg:border-none bg-white">
                    <div className="border-b border-white flex">
                      <div className="ps-1.5 pe-[5px] py-[5px] leading-[15px] w-[40%]">
                        <b className="text-[14px] text-[#0dcaf0] md:font-normal">
                          <span>
                            Min: {market?.min} Max: {market?.max}
                          </span>
                        </b>
                      </div>

                      <div className="leading-[15px] py-[5px] text-[16px] w-[10%]"></div>
                      <div className="leading-[15px] py-[5px] text-[16px] w-[10%]"></div>
                      <div className="leading-[15px] py-[5px] text-[16px] w-[10%] cursor-pointer bg-[#72bbef] text-center text-[#212529]">
                        <b className="md:font-normal">BACK</b>
                      </div>
                      <div className="leading-[15px] py-[5px] text-[16px] w-[10%] cursor-pointer bg-[#faa9ba] text-center text-[#212529]">
                        <b className="md:font-normal">LAY</b>
                      </div>
                      <div className="leading-[15px] py-[5px] pr-[5px] text-[#212529] text-center font-bold text-[14px] border-r border-white w-[20%] md:font-normal">
                        Matched:&nbsp;{(market?.totalMatched / 1000)?.toFixed(2)}K
                      </div>
                    </div>
                  </div>

                  {/* RUNNERS */}
                  <div className="lg:mb-0.5">
                    {market?.runners?.map((runner: any) => {
                      const isSuspended =
                        runner?.status === "SUSPENDED" ||
                        market?.status === "SUSPENDED";
                      const runnerName = market?.runnersName?.find(
                        (item: any) => item?.selectionId === runner?.selectionId
                      )?.runnerName;

                      return (
                        <React.Fragment key={runner?.selectionId}>
                          {/* Runner Row */}
                          <div className="flex border-b border-[#aaa] lg:border-white bg-gray-50 h-[41px] lg:h-10 lg:bg-[#f2f2f2]">
                            <div className="col-span-3 py-0.5 px-[5px] lg:border-l lg:border-white md:col-span-1 w-[60%] lg:w-[40%]">
                              <div className="flex">
                                <div className="w-full">
                                  <span className="flex justify-between">
                                    <b className="font-semibold md:font-normal text-[12px] lg:text-[14px] text-[#212529]">
                                      {runnerName}
                                    </b>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Odds Cells */}
                            <div
                              className={`relative w-[40%] lg:text-[#212529] lg:w-[60%] flex 
                              ${isSuspended
                                  ? "after:content-['SUSPENDED'] after:absolute after:inset-0 after:bg-black/60 after:text-[#ff3c3c] after:flex after:items-center after:justify-center after:uppercase after:font-extralight after:text-[15px] after:cursor-not-allowed"
                                  : ""
                                }`}
                            >
                              {/* BACK (mobile visible, desktop: first cell) */}
                              <div
                                className={`text-center flex-col lg:border-l lg:border-white justify-center items-center w-[50%] bg-[#72bbef] flex ${!isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                                  }`}
                                onClick={() =>
                                  !isSuspended &&
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
                                <span className="odd block font-bold md:font-normal  leading-[1.1]">
                                  {runner?.ex?.availableToBack[0]?.price || "0"}
                                </span>
                                <span className="block text-xs lg:text-[10px] md:font-normal">
                                  {(
                                    (runner?.ex?.availableToBack[0]?.size ||
                                      0) / 1000
                                  )?.toFixed(2)}
                                </span>
                              </div>

                              {/* Extra BACK cells for desktop layout (hidden on mobile) */}
                              <div
                                className={`text-center lg:border-l lg:border-white hidden lg:flex flex-col justify-center items-center w-[50%] bg-[#72bbef] ${!isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                                  }`}
                                onClick={() =>
                                  !isSuspended &&
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
                                  {runner?.ex?.availableToBack[2]?.price || "0"}
                                </span>
                                <span className="block text-xs lg:text-[10px]">
                                  {(
                                    (runner?.ex?.availableToBack[2]?.size ||
                                      0) / 1000
                                  )?.toFixed(2)}
                                </span>
                              </div>
                              <div
                                className={`text-center lg:border-l lg:border-white hidden lg:flex flex-col justify-center items-center w-[50%] bg-[#72bbef] ${!isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                                  }`}
                                onClick={() =>
                                  !isSuspended &&
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
                                  {runner?.ex?.availableToBack[1]?.price || "0"}
                                </span>
                                <span className="block text-xs lg:text-[10px]">
                                  {(
                                    (runner?.ex?.availableToBack[1]?.size ||
                                      0) / 1000
                                  )?.toFixed(2)}
                                </span>
                              </div>

                              {/* LAY */}
                              <div
                                className={`text-center lg:border-l lg:border-white flex flex-col justify-center items-center w-[50%] bg-[#faa9ba] ${!isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                                  }`}
                                onClick={() =>
                                  !isSuspended &&
                                  onPriceClick({
                                    marketId: market?.marketId,
                                    min: market?.min,
                                    max: market?.max,
                                    selectionId: runner?.selectionId,
                                    runnerName: runnerName,
                                    price:
                                      runner?.ex?.availableToLay[0]?.price || 0,
                                    column: "LAY",
                                  })
                                }
                              >
                                <span className="odd block font-bold md:font-normal leading-[1.1]">
                                  {runner?.ex?.availableToLay[0]?.price || "0"}
                                </span>
                                <span className="block text-xs lg:text-[10px]">
                                  {(
                                    (runner?.ex?.availableToLay[0]?.size || 0) /
                                    1000
                                  )?.toFixed(2)}
                                </span>
                              </div>
                              <div
                                className={`text-center lg:border-l lg:border-white hidden lg:flex flex-col justify-center items-center w-[50%] bg-[#faa9ba] ${!isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                                  }`}
                                onClick={() =>
                                  !isSuspended &&
                                  onPriceClick({
                                    marketId: market?.marketId,
                                    min: market?.min,
                                    max: market?.max,
                                    selectionId: runner?.selectionId,
                                    runnerName: runnerName,
                                    price:
                                      runner?.ex?.availableToLay[2]?.price || 0,
                                    column: "LAY",
                                  })
                                }
                              >
                                <span className="odd block font-bold md:font-normal leading-[1.1]">
                                  {runner?.ex?.availableToLay[2]?.price || "0"}
                                </span>
                                <span className="block text-xs lg:text-[10px]">
                                  {(
                                    (runner?.ex?.availableToLay[2]?.size || 0) /
                                    1000
                                  )?.toFixed(2)}
                                </span>
                              </div>
                              <div
                                className={`text-center lg:border-l lg:border-white border-r hidden lg:flex flex-col justify-center items-center w-[50%] bg-[#faa9ba] ${!isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                                  }`}
                                onClick={() =>
                                  !isSuspended &&
                                  onPriceClick({
                                    marketId: market?.marketId,
                                    min: market?.min,
                                    max: market?.max,
                                    selectionId: runner?.selectionId,
                                    runnerName: runnerName,
                                    price:
                                      runner?.ex?.availableToLay[1]?.price || 0,
                                    column: "LAY",
                                  })
                                }
                              >
                                <span className="odd block font-bold md:font-normal leading-[1.1]">
                                  {runner?.ex?.availableToLay[1]?.price || "0"}
                                </span>
                                <span className="block text-xs lg:text-[10px]">
                                  {(
                                    (runner?.ex?.availableToLay[1]?.size || 0) /
                                    1000
                                  )?.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* INLINE MOBILE BETSLIP UNDER ROW */}
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
                                    eventId="event123"
                                    marketType={market?.marketType}
                                    runnerName={betSlipData?.runnerName}
                                    minStake={betSlipData?.min}
                                    maxStake={betSlipData?.max}
                                    onClose={closeInlineSlip}
                                    onPlaced={closeInlineSlip}
                                  />
                                )}
                              </div>
                            )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="right-part hidden lg:block lg:w-[30%] ml-[5px]">
            <DBetSlip
              visible={!!betSlipData}
              odds={betSlipData?.odds}
              marketId={betSlipData?.marketId}
              selectionId={betSlipData?.selectionId}
              runnerName={betSlipData?.runnerName}
              minStake={betSlipData?.min}
              maxStake={betSlipData?.max}
              backLayClsModal={betSlipData?.slipCls}
              onClose={() => setBetSlipData(null)}
              // 👇 Refresh bets when DBetSlip places a bet
              onPlaced={() => fetchBets()}
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