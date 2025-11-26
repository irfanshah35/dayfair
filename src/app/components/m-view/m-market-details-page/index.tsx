/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useEffect, useState, useRef } from "react";
import MBetSlip from "../m-betslip";
import RulesModal from "@/app/modals/rules-modal";

// JSON Data for Markets
const MARKETS_DATA = [
  {
    marketId: "1.12345",
    marketName: "Match Odds",
    marketType: "MATCH_ODDS",
    status: "OPEN",
    min: 100,
    max: 50000,
    totalMatched: 2700,
    runners: [
      {
        selectionId: 111,
        runnerName: "Titans W",
        status: "ACTIVE",
        backOdds: [
          { price: 1.06, size: 5990 },
          { price: 1.05, size: 4500 },
          { price: 1.04, size: 3200 },
        ],
        layOdds: [
          { price: 1.19, size: 4210 },
          { price: 1.2, size: 3800 },
          { price: 1.21, size: 2900 },
        ],
      },
      {
        selectionId: 222,
        runnerName: "South Western Districts W",
        status: "SUSPENDED",
        backOdds: [
          { price: 4.5, size: 3200 },
          { price: 4.4, size: 2800 },
          { price: 4.3, size: 2100 },
        ],
        layOdds: [
          { price: 4.8, size: 2900 },
          { price: 4.9, size: 2400 },
          { price: 5.0, size: 1800 },
        ],
      },
    ],
  },
  {
    marketId: "1.23456",
    marketName: "Bookmaker",
    marketType: "BOOKMAKER",
    status: "OPEN",
    min: 100,
    max: 25000,
    totalMatched: 1800,
    runners: [
      {
        selectionId: 333,
        runnerName: "Titans W",
        status: "ACTIVE",
        backOdds: [
          { price: 1.08, size: 4500 },
          { price: 1.07, size: 3800 },
          { price: 1.06, size: 2900 },
        ],
        layOdds: [
          { price: 1.22, size: 3900 },
          { price: 1.23, size: 3200 },
          { price: 1.24, size: 2600 },
        ],
      },
      {
        selectionId: 444,
        runnerName: "South Western Districts W",
        status: "ACTIVE",
        backOdds: [
          { price: 4.2, size: 2800 },
          { price: 4.1, size: 2300 },
          { price: 4.0, size: 1900 },
        ],
        layOdds: [
          { price: 4.6, size: 2500 },
          { price: 4.7, size: 2100 },
          { price: 4.8, size: 1700 },
        ],
      },
    ],
  },
  {
    marketId: "1.34567",
    marketName: "Tied Match",
    marketType: "TIED_MATCH",
    status: "OPEN",
    min: 50,
    max: 10000,
    totalMatched: 850,
    runners: [
      {
        selectionId: 555,
        runnerName: "Yes",
        status: "ACTIVE",
        backOdds: [
          { price: 15.0, size: 1200 },
          { price: 14.5, size: 950 },
          { price: 14.0, size: 800 },
        ],
        layOdds: [
          { price: 16.0, size: 1100 },
          { price: 16.5, size: 900 },
          { price: 17.0, size: 750 },
        ],
      },
      {
        selectionId: 666,
        runnerName: "No",
        status: "ACTIVE",
        backOdds: [
          { price: 1.01, size: 8500 },
          { price: 1.005, size: 7200 },
          { price: 1.003, size: 6100 },
        ],
        layOdds: [
          { price: 1.02, size: 7800 },
          { price: 1.025, size: 6500 },
          { price: 1.03, size: 5400 },
        ],
      },
    ],
  },
  {
    marketId: "1.45678",
    marketName: "Total Runs",
    marketType: "TOTAL_RUNS",
    status: "OPEN",
    min: 100,
    max: 20000,
    totalMatched: 1450,
    runners: [
      {
        selectionId: 777,
        runnerName: "Over 285.5",
        status: "ACTIVE",
        backOdds: [
          { price: 1.9, size: 3200 },
          { price: 1.88, size: 2800 },
          { price: 1.86, size: 2400 },
        ],
        layOdds: [
          { price: 1.95, size: 2900 },
          { price: 1.97, size: 2500 },
          { price: 1.99, size: 2100 },
        ],
      },
      {
        selectionId: 888,
        runnerName: "Under 285.5",
        status: "ACTIVE",
        backOdds: [
          { price: 2.1, size: 2800 },
          { price: 2.08, size: 2400 },
          { price: 2.06, size: 2000 },
        ],
        layOdds: [
          { price: 2.15, size: 2500 },
          { price: 2.17, size: 2100 },
          { price: 2.19, size: 1800 },
        ],
      },
    ],
  },
  {
    marketId: "1.56789",
    marketName: "Top Batsman",
    marketType: "TOP_BATSMAN",
    status: "OPEN",
    min: 50,
    max: 5000,
    totalMatched: 620,
    runners: [
      {
        selectionId: 999,
        runnerName: "Player A",
        status: "ACTIVE",
        backOdds: [
          { price: 5.5, size: 1800 },
          { price: 5.4, size: 1500 },
          { price: 5.3, size: 1200 },
        ],
        layOdds: [
          { price: 5.8, size: 1600 },
          { price: 5.9, size: 1300 },
          { price: 6.0, size: 1100 },
        ],
      },
      {
        selectionId: 1010,
        runnerName: "Player B",
        status: "ACTIVE",
        backOdds: [
          { price: 6.5, size: 1500 },
          { price: 6.4, size: 1200 },
          { price: 6.3, size: 1000 },
        ],
        layOdds: [
          { price: 6.8, size: 1400 },
          { price: 6.9, size: 1100 },
          { price: 7.0, size: 900 },
        ],
      },
      {
        selectionId: 1111,
        runnerName: "Player C",
        status: "ACTIVE",
        backOdds: [
          { price: 7.0, size: 1300 },
          { price: 6.9, size: 1100 },
          { price: 6.8, size: 900 },
        ],
        layOdds: [
          { price: 7.3, size: 1200 },
          { price: 7.4, size: 1000 },
          { price: 7.5, size: 800 },
        ],
      },
    ],
  },
  {
    marketId: "1.67890",
    marketName: "Innings Runs",
    marketType: "INNINGS_RUNS",
    status: "OPEN",
    min: 100,
    max: 15000,
    totalMatched: 980,
    runners: [
      {
        selectionId: 1212,
        runnerName: "150-175",
        status: "ACTIVE",
        backOdds: [
          { price: 3.2, size: 2200 },
          { price: 3.15, size: 1900 },
          { price: 3.1, size: 1600 },
        ],
        layOdds: [
          { price: 3.3, size: 2000 },
          { price: 3.35, size: 1700 },
          { price: 3.4, size: 1400 },
        ],
      },
      {
        selectionId: 1313,
        runnerName: "175-200",
        status: "ACTIVE",
        backOdds: [
          { price: 2.8, size: 2400 },
          { price: 2.75, size: 2100 },
          { price: 2.7, size: 1800 },
        ],
        layOdds: [
          { price: 2.9, size: 2200 },
          { price: 2.95, size: 1900 },
          { price: 3.0, size: 1600 },
        ],
      },
    ],
  },
  {
    marketId: "1.78901",
    marketName: "Most Sixes",
    marketType: "MOST_SIXES",
    status: "OPEN",
    min: 50,
    max: 8000,
    totalMatched: 540,
    runners: [
      {
        selectionId: 1414,
        runnerName: "Titans W",
        status: "ACTIVE",
        backOdds: [
          { price: 1.85, size: 2800 },
          { price: 1.83, size: 2400 },
          { price: 1.81, size: 2000 },
        ],
        layOdds: [
          { price: 1.9, size: 2500 },
          { price: 1.92, size: 2100 },
          { price: 1.94, size: 1800 },
        ],
      },
      {
        selectionId: 1515,
        runnerName: "South Western Districts W",
        status: "ACTIVE",
        backOdds: [
          { price: 2.15, size: 2400 },
          { price: 2.13, size: 2000 },
          { price: 2.11, size: 1700 },
        ],
        layOdds: [
          { price: 2.2, size: 2200 },
          { price: 2.22, size: 1800 },
          { price: 2.24, size: 1500 },
        ],
      },
    ],
  },
  {
    marketId: "1.89012",
    marketName: "First Over Runs",
    marketType: "FIRST_OVER_RUNS",
    status: "SUSPENDED",
    min: 50,
    max: 5000,
    totalMatched: 320,
    runners: [
      {
        selectionId: 1616,
        runnerName: "0-5 Runs",
        status: "SUSPENDED",
        backOdds: [
          { price: 3.5, size: 1100 },
          { price: 3.45, size: 950 },
          { price: 3.4, size: 800 },
        ],
        layOdds: [
          { price: 3.65, size: 1000 },
          { price: 3.7, size: 850 },
          { price: 3.75, size: 700 },
        ],
      },
      {
        selectionId: 1717,
        runnerName: "6-10 Runs",
        status: "SUSPENDED",
        backOdds: [
          { price: 2.8, size: 1300 },
          { price: 2.75, size: 1100 },
          { price: 2.7, size: 950 },
        ],
        layOdds: [
          { price: 2.9, size: 1200 },
          { price: 2.95, size: 1000 },
          { price: 3.0, size: 850 },
        ],
      },
    ],
  },
];

export default function MMarketDetailsPage() {
  const [activeTab, setActiveTab] = useState("odds");
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [active, setActive] = useState(false);
  const betslipRef = useRef<HTMLDivElement>(null);

  // Betslip state
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [slipCls, setSlipCls] = useState<
    "slip-back" | "slip-lay" | "slip-Line-Yes" | "slip-Line-No"
  >("slip-back");
  const [slipBgClass, setSlipBgClass] = useState<string>("");
  const [slipOdds, setSlipOdds] = useState<number>(0);
  const [slipMarketId, setSlipMarketId] = useState<string>("");
  const [slipSelectionId, setSlipSelectionId] = useState<number>(0);
  const [slipRunnerName, setSlipRunnerName] = useState<string>("");
  const [slipMin, setSlipMin] = useState<number>(1);
  const [slipMax, setSlipMax] = useState<number>(99999999);
  const [isrulesopen, setRulesOpen] = useState(false);

  // Track which row is open
  const [openSlip, setOpenSlip] = useState<{
    marketId: string;
    selectionId: number;
    side: "BACK" | "LAY";
  } | null>(null);

  const categories = [
    "Popular",
    "Match Odds",
    "Bookmaker",
    "Tied Match",
    "All Market",
  ];

  useEffect(() => {
    // Toggle active after 1s for demo
    const timer = setInterval(() => {
      setActive((prev) => !prev);
    }, 800);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (isSlipOpen && betslipRef.current) {
      // Wait for DOM to update
      setTimeout(() => {
        betslipRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 100);
    }
  }, [isSlipOpen, openSlip]);

  // Handle price click
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
    const cls = column === "BACK" ? "slip-back" : "slip-lay";

    // bg theme
    const bg = cls === "slip-back" ? "betbg--back" : "betbg--lay";

    setSlipCls(cls as any);
    setSlipOdds(finalPrice);
    setSlipMarketId(marketId || "");
    setSlipSelectionId(selectionId || 0);
    setSlipRunnerName(runnerName || String(selectionId));
    setSlipBgClass(bg);
    setSlipMin(Number.isFinite(min as number) ? (min as number) : 1);
    setSlipMax(Number.isFinite(max as number) ? (max as number) : 99999999);

    setIsSlipOpen(true);
    setOpenSlip({ marketId, selectionId, side: column });
  };

  // Close slip
  const closeInlineSlip = () => {
    setIsSlipOpen(false);
    setOpenSlip(null);
  };

  // Check if this row has slip open
  const isRowSlipOpen = (marketId: string, selectionId: number) => {
    return (
      !!openSlip &&
      openSlip.marketId === marketId &&
      openSlip.selectionId === selectionId
    );
  };

  return (
    <div>
      <div className="relative flex justify-between items-center bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]">
        {/* Tabs */}
        <div className="flex items-center text-black font-semibold">
          <div className="flex pt-[13px] pb-3">
            <a
              onClick={() => setActiveTab("odds")}
              className={`relative block text-[12px] text-center border-r px-4 ${
                activeTab === "odds"
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
              className={`relative block text-[12px] text-center px-4 ${
                activeTab === "betList"
                  ? "after:content-[''] after:absolute after:-top-3 after:left-0 after:w-full after:h-0.5 after:bg-black"
                  : ""
              }`}
            >
              BET LIST (0)
            </a>
          </div>
        </div>

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
          <div className="absolute top-[10px] right-2">
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
          <div className="flex justify-center items-center h-[30vh] text-[21px] mt-4">
            You Have No Open Bets.
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="left-part overflow-y-auto w-full">
            {/* Game Header */}
            <div className=" flex justify-between items-center bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] py-[3.5px] pl-2 pr-[8px] text-white">
              <span className="text-sm font-medium">
                Titans W v South Western Districts W
              </span>
              <span className=" game-iconinplay">
                <span
                  className={`
        text-xs py-1 rounded-full font-bold inline-block transition-all duration-300
        heartbeat-anim
      `}
                >
                  INPLAY
                </span>
              </span>
            </div>

            {/* Game Status Banner */}
            <div
              className=" p-0 mb-[3px] bg-cover"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, #0000001a, #00000073), url('/market/market.jpg')",
                backgroundSize: "408px 90px",
              }}
            >
              <div className="">
                <div className="flex flex-col justify-between items-center px-3 pt-1.5 h-[90px]">
                  <div className="flex justify-between w-full">
                    <div className=" text-white text-[12px] font-bold [text-shadow:#fc0_1px_0_10px]">
                      SUSPENDED
                    </div>
                    <div className=" text-white text-[12px] tracking-[-0.2px] font-bold [text-shadow:#fc0_1px_0_10px]">
                      <span className=" text-[#ffff55]">Game time</span>{" "}
                      23-11-2025 01:00:00 PM
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

            {/* Market Categories */}
            <div className="md:hidden">
              <ul className="flex overflow-x-auto no-scrollbar p-[5px] bg-[linear-gradient(180deg,#000000,#000000_42%,#000000)] text-white">
                {categories.map((category) => (
                  <li
                    key={category}
                    className={`px-2.5 py-[5px] whitespace-nowrap rounded-full ml-[5px] text-[12px] font-medium border border-white cursor-pointer ${
                      activeCategory === category
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
            {MARKETS_DATA.map((market) => (
              <div
                key={market.marketId}
                className="bg-[linear-gradient(180deg,#000000,#ccc1c1)]"
              >
                <div className=" mt-0 py-1 pl-2 pr-[6px] flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-white text-[13px] lg:text-[14px]">
                      {market.marketName}
                    </span>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="flex items-center relative top-[1px] text-white text-[13px] lg:text-[14px] font-bold">
                          <span className="relative w-[18px] h-[18px] mr-[5px] bg-yellow-500 rounded-xs">
                            <span className="w-[12px] h-[12px] bg-black rounded-full mr-[6px] absolute z-20 top-0.5 left-[3px]"></span>
                          </span>
                          Cash Out
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setRulesOpen(true)}
                    className="text-white"
                  >
                    <svg
                      className="w-[16px] h-[15px] relative "
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
                    <div className="py-0.5 px-[5px] flex justify-between items-center border-b border-[#aaa] w-[60%] font-semibold">
                      <span>
                        Min: {market.min} Max: {market.max}
                      </span>
                      <span className=" ml-2">
                        M:{(market.totalMatched / 1000).toFixed(2)}K
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

                <div className="hidden lg:block text-[12px] border-b border-[#aaa] lg:border-none bg-white">
                  <div className="border-b border-white flex">
                    <div className="p-[5px] leading-[15px] w-[40%]">
                      <b className="text-[14px] text-[#0dcaf0]">
                        <span>
                          Min: {market.min} Max: {market.max}
                        </span>
                      </b>
                    </div>

                    <div className="leading-[15px] py-[5px] text-[16px] w-[10%]"></div>
                    <div className="leading-[15px] py-[5px] text-[16px] w-[10%]"></div>
                    <div className="leading-[15px] py-[5px] text-[16px] w-[10%] cursor-pointer bg-[#72bbef] text-center text-black">
                      <b>BACK</b>
                    </div>
                    <div className="leading-[15px] py-[5px] text-[16px] w-[10%] cursor-pointer bg-[#faa9ba] text-center text-black">
                      <b>LAY</b>
                    </div>
                    <div className="leading-[15px] py-[5px] pr-[5px] text-black text-center font-bold text-[14px] border-r border-white w-[20%]">
                      Matched:{(market.totalMatched / 1000).toFixed(2)}K
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* Dynamic Runners */}
                  {market.runners.map((runner) => {
                    const isSuspended =
                      runner.status === "SUSPENDED" ||
                      market.status === "SUSPENDED";

                    return (
                      <React.Fragment key={runner.selectionId}>
                        <div className="flex border-b border-[#aaa] lg:border-white bg-gray-50 h-[41px] lg:h-10 lg:bg-[#f2f2f2]">
                          <div className="col-span-3 py-0.5 px-[5px] lg:border-l lg:border-white md:col-span-1 w-[60%] lg:w-[40%]">
                            <div className="flex">
                              <div className="w-full">
                                <span className="flex justify-between">
                                  <b className="font-semibold text-[12px] lg:text-[14px] text-gray-800">
                                    {runner.runnerName}
                                  </b>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`relative w-[40%] lg:text-black lg:w-[60%] flex 
                              ${
                                isSuspended
                                  ? "after:content-['SUSPENDED'] after:absolute after:inset-0 after:bg-black/60 after:text-[#ff3c3c] after:flex after:items-center after:justify-center after:uppercase after:font-extralight after:text-[15px] after:cursor-not-allowed"
                                  : ""
                              }`}
                          >
                            <div
                              className={`text-center flex-col lg:border-l lg:border-white justify-center items-center w-[50%] bg-[#72bbef] flex ${
                                !isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                              }`}
                              onClick={() =>
                                !isSuspended &&
                                onPriceClick({
                                  marketId: market.marketId,
                                  min: market.min,
                                  max: market.max,
                                  selectionId: runner.selectionId,
                                  runnerName: runner.runnerName,
                                  price: runner.backOdds[0].price,
                                  column: "BACK",
                                })
                              }
                            >
                              <span className="odd block font-bold leading-[1.1]">
                                {runner.backOdds[0].price}
                              </span>
                              <span className="block text-xs lg:text-[10px]">
                                {(runner.backOdds[0].size / 1000).toFixed(2)}
                              </span>
                            </div>
                            <div
                              className={`text-center lg:border-l lg:border-white hidden lg:flex flex-col justify-center items-center w-[50%] bg-[#72bbef] ${
                                !isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                              }`}
                              onClick={() =>
                                !isSuspended &&
                                onPriceClick({
                                  marketId: market.marketId,
                                  min: market.min,
                                  max: market.max,
                                  selectionId: runner.selectionId,
                                  runnerName: runner.runnerName,
                                  price: runner.backOdds[0].price,
                                  column: "BACK",
                                })
                              }
                            >
                              <span className="odd block font-bold leading-[1.1]">
                                {runner.backOdds[0].price}
                              </span>
                              <span className="block text-xs lg:text-[10px]">
                                {(runner.backOdds[0].size / 1000).toFixed(2)}
                              </span>
                            </div>
                            <div
                              className={`text-center lg:border-l lg:border-white hidden lg:flex flex-col justify-center items-center w-[50%] bg-[#72bbef] ${
                                !isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                              }`}
                              onClick={() =>
                                !isSuspended &&
                                onPriceClick({
                                  marketId: market.marketId,
                                  min: market.min,
                                  max: market.max,
                                  selectionId: runner.selectionId,
                                  runnerName: runner.runnerName,
                                  price: runner.backOdds[0].price,
                                  column: "BACK",
                                })
                              }
                            >
                              <span className="odd block font-bold leading-[1.1]">
                                {runner.backOdds[0].price}
                              </span>
                              <span className="block text-xs lg:text-[10px]">
                                {(runner.backOdds[0].size / 1000).toFixed(2)}
                              </span>
                            </div>

                            {/* Lay Odds */}
                            <div
                              className={`text-center lg:border-l lg:border-white flex flex-col justify-center items-center w-[50%] bg-[#faa9ba] ${
                                !isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                              }`}
                              onClick={() =>
                                !isSuspended &&
                                onPriceClick({
                                  marketId: market.marketId,
                                  min: market.min,
                                  max: market.max,
                                  selectionId: runner.selectionId,
                                  runnerName: runner.runnerName,
                                  price: runner.layOdds[0].price,
                                  column: "LAY",
                                })
                              }
                            >
                              <span className="odd block font-bold leading-[1.1]">
                                {runner.layOdds[0].price}
                              </span>
                              <span className="block text-xs lg:text-[10px]">
                                {(runner.layOdds[0].size / 1000).toFixed(2)}
                              </span>
                            </div>
                            <div
                              className={`text-center lg:border-l lg:border-white hidden lg:flex flex-col justify-center items-center w-[50%] bg-[#faa9ba] ${
                                !isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                              }`}
                              onClick={() =>
                                !isSuspended &&
                                onPriceClick({
                                  marketId: market.marketId,
                                  min: market.min,
                                  max: market.max,
                                  selectionId: runner.selectionId,
                                  runnerName: runner.runnerName,
                                  price: runner.layOdds[0].price,
                                  column: "LAY",
                                })
                              }
                            >
                              <span className="odd block font-bold leading-[1.1]">
                                {runner.layOdds[0].price}
                              </span>
                              <span className="block text-xs lg:text-[10px]">
                                {(runner.layOdds[0].size / 1000).toFixed(2)}
                              </span>
                            </div>
                            <div
                              className={`text-center lg:border-l lg:border-white border-r hidden lg:flex flex-col justify-center items-center w-[50%] bg-[#faa9ba] ${
                                !isSuspended
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                              }`}
                              onClick={() =>
                                !isSuspended &&
                                onPriceClick({
                                  marketId: market.marketId,
                                  min: market.min,
                                  max: market.max,
                                  selectionId: runner.selectionId,
                                  runnerName: runner.runnerName,
                                  price: runner.layOdds[0].price,
                                  column: "LAY",
                                })
                              }
                            >
                              <span className="odd block font-bold leading-[1.1]">
                                {runner.layOdds[0].price}
                              </span>
                              <span className="block text-xs lg:text-[10px]">
                                {(runner.layOdds[0].size / 1000).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Betslip for each runner */}
                        {/* Betslip for each runner */}
                        {isRowSlipOpen(market.marketId, runner.selectionId) && (
                          <div ref={betslipRef}>
                            <MBetSlip
                              visible={isSlipOpen}
                              backLayClsModal={slipCls}
                              extraBgClass={slipBgClass}
                              odds={slipOdds}
                              marketId={slipMarketId}
                              selectionId={slipSelectionId}
                              eventId="event123"
                              marketType={market.marketType}
                              runnerName={slipRunnerName}
                              minStake={slipMin}
                              maxStake={slipMax}
                              onClose={closeInlineSlip}
                              onPlaced={closeInlineSlip}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RulesModal open={isrulesopen} onClose={() => setRulesOpen(false)} />

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
