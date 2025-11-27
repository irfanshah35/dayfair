import React, { useState, useEffect } from "react";

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
];

const CATEGORIES = ["Popular", "Match Odds", "Bookmaker", "Tied Match", "All Market"];

export default function DMarketDetailsPage() {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [activeTab, setActiveTab] = useState("odds");
  const [betslipTab, setBetslipTab] = useState("unmatched");
  const [selectedBet, setSelectedBet] = useState(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handlePriceClick = (market, runner, price, type) => {
    if (runner.status === "SUSPENDED" || market.status === "SUSPENDED") return;
    
    setSelectedBet({
      marketId: market.marketId,
      selectionId: runner.selectionId,
      runnerName: runner.runnerName,
      price: Number(price.toFixed(2)),
      type,
      min: market.min,
      max: market.max,
    });
  };

  return (
    <div className="grid grid-cols-10 mt-1 bg-gray-100 min-h-screen">
      {/* Main Content - 8 columns */}
      <div className="col-span-10 lg:col-span-7">
    

    
          <>
            {/* Game Header */}
            <div className="flex justify-between items-center bg-gradient-to-b from-[#030a12] via-[#444647] to-[#58595a] py-[3.5px] pl-2 pr-[8px] text-white">
              <span className="text-sm font-medium">Titans W v South Western Districts W</span>
              <span className="text-xs py-1 rounded-full font-bold inline-block heartbeat-anim">INPLAY</span>
            </div>

            {/* Game Status Banner */}
<div
  className="p-0 mb-[3px] bg-cover bg-no-repeat mt-1 bg-center w-full"
  style={{
    backgroundImage:
      "linear-gradient(0deg, #0000001a, #00000073), url('/market/market.jpg')",
    backgroundSize: "100% 100%",
  }}
>
              <div className="flex flex-col justify-between items-center px-3 pt-1.5 h-[90px]">
                <div className="flex justify-between w-full">
                  <div className="text-white text-[12px] font-bold [text-shadow:#fc0_1px_0_10px]">SUSPENDED</div>
                  <div className="text-white text-[12px] tracking-[-0.2px] font-bold [text-shadow:#fc0_1px_0_10px]">
                    <span className="text-[#ffff55]">Game time</span> 23-11-2025 01:00:00 PM
                  </div>
                </div>
                <div className="flex justify-center items-center flex-col [text-shadow:#fc0_1px_0_10px]">
                  <span className="relative -top-0.5 left-[5px] font-bold text-[12px] heartbeat-anim2">Bet Started</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="md:hidden">
              <ul className="flex overflow-x-auto no-scrollbar p-[5px] bg-black text-white">
                {CATEGORIES.map((category) => (
                  <li
                    key={category}
                    className={`px-2.5 py-[5px] whitespace-nowrap rounded-full ml-[5px] text-[12px] font-medium border border-white cursor-pointer ${
                      activeCategory === category ? "bg-gradient-to-b from-[#f4b501] to-[#f68700] text-black" : "hover:bg-gray-100 bg-transparent text-white"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category.toUpperCase()}
                  </li>
                ))}
              </ul>
            </div>

            {/* Markets */}
            {MARKETS_DATA.map((market) => (
              <div key={market.marketId} className="bg-gradient-to-b from-black to-[#ccc1c1]">
                <div className="mt-0 py-1 pl-2 pr-[6px] flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-white text-[13px] lg:text-[14px]">{market.marketName}</span>
                    <div className="ml-3 flex items-center">
                      <span className="flex items-center relative top-[1px] text-white text-[13px] lg:text-[14px] font-bold">
                        <span className="relative w-[18px] h-[18px] mr-[5px] bg-yellow-500 rounded-xs">
                          <span className="w-[12px] h-[12px] bg-black rounded-full mr-[6px] absolute z-20 top-0.5 left-[3px]"></span>
                        </span>
                        Cash Out
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setIsRulesOpen(true)} className="text-white">
                    <svg className="w-[16px] h-[15px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path>
                    </svg>
                  </button>
                </div>

                {/* Mobile Header */}
                <div className="text-[12px] border-b border-[#aaa] lg:hidden">
                  <div className="flex bg-gray-100">
                    <div className="py-0.5 px-[5px] flex justify-between items-center border-b border-[#aaa] w-[60%] font-semibold">
                      <span>Min: {market.min} Max: {market.max}</span>
                      <span className="ml-2">M:{(market.totalMatched / 1000).toFixed(2)}K</span>
                    </div>
                    <div className="w-[40%] flex">
                      <div className="flex justify-center items-center text-center w-[50%] text-[12px] font-semibold bg-[#72bbef]">BACK</div>
                      <div className="flex justify-center items-center text-center w-[50%] text-[12px] font-semibold bg-[#faa9ba]">LAY</div>
                    </div>
                  </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:block text-[12px] border-b border-[#aaa] lg:border-none bg-white">
                  <div className="border-b border-white flex">
                    <div className="p-[5px] leading-[15px] w-[40%]">
                      <b className="text-[14px] text-[#0dcaf0]">
                        <span>Min: {market.min} Max: {market.max}</span>
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

                {/* Runners */}
                {market.runners.map((runner) => {
                  const isSuspended = runner.status === "SUSPENDED" || market.status === "SUSPENDED";

                  return (
                    <div key={runner.selectionId} className="flex border-b border-[#aaa] lg:border-white bg-gray-50 h-[41px] lg:h-10 lg:bg-[#f2f2f2]">
                      <div className="py-0.5 px-[5px] lg:border-l lg:border-white w-[60%] lg:w-[40%]">
                        <div className="flex">
                          <div className="w-full">
                            <span className="flex justify-between">
                              <b className="font-semibold text-[12px] lg:text-[14px] text-gray-800">{runner.runnerName}</b>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`relative w-[40%] lg:text-black lg:w-[60%] flex ${isSuspended ? "after:content-['SUSPENDED'] after:absolute after:inset-0 after:bg-black/60 after:text-[#ff3c3c] after:flex after:items-center after:justify-center after:uppercase after:font-extralight after:text-[15px] after:cursor-not-allowed" : ""}`}>
                        {/* Back Odds */}
                        {runner.backOdds.slice(0, 3).map((odd, i) => (
                          <div
                            key={i}
                            className={`text-center flex-col lg:border-l lg:border-white justify-center items-center ${i === 0 ? "flex w-[50%]" : "hidden lg:flex w-[50%]"} bg-[#72bbef] ${!isSuspended ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={() => !isSuspended && handlePriceClick(market, runner, odd.price, "BACK")}
                          >
                            <span className="odd block font-bold leading-[1.1]">{odd.price}</span>
                            <span className="block text-xs lg:text-[10px]">{(odd.size / 1000).toFixed(2)}</span>
                          </div>
                        ))}

                        {/* Lay Odds */}
                        {runner.layOdds.slice(0, 3).map((odd, i) => (
                          <div
                            key={i}
                            className={`text-center lg:border-l lg:border-white flex flex-col justify-center items-center ${i === 0 ? "w-[50%]" : "hidden lg:flex w-[50%]"} ${i === 2 ? "border-r" : ""} bg-[#faa9ba] ${!isSuspended ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={() => !isSuspended && handlePriceClick(market, runner, odd.price, "LAY")}
                          >
                            <span className="odd block font-bold leading-[1.1]">{odd.price}</span>
                            <span className="block text-xs lg:text-[10px]">{(odd.size / 1000).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </>
      </div>

      {/* Sidebar - 4 columns */}
      <div className="col-span-10 lg:col-span-3 bg-gray-800 text-white">
        {/* Live Match Header */}
        <div className="bg-gradient-to-b from-orange-500 to-orange-600 p-3">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 4.00087C2 3.44811 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44463 22 4.00087V17.9991C22 18.5519 21.5447 19 21.0082 19H2.9918C2.44405 19 2 18.5554 2 17.9991V4.00087ZM4 5V17H20V5H4ZM5 20H19V22H5V20Z"></path>
            </svg>
            <span className="font-semibold text-sm">Live Match</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
            <span>live stream started</span>
          </div>
        </div>

        {/* Place Bet Section */}
        <div className="bg-gray-700 p-3 border-b border-gray-600">
          <h3 className="font-semibold text-sm mb-2">Place Bet</h3>
          {selectedBet ? (
            <div className={`p-3 rounded ${selectedBet.type === "BACK" ? "bg-[#72bbef]" : "bg-[#faa9ba]"} text-black`}>
              <div className="text-xs mb-2">{selectedBet.runnerName}</div>
              <div className="text-sm font-bold mb-3">Odds: {selectedBet.price}</div>
              <input
                type="number"
                placeholder="Stake"
                className="w-full px-2 py-1.5 rounded text-sm mb-2"
                min={selectedBet.min}
                max={selectedBet.max}
              />
              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 text-white py-1.5 rounded text-xs font-semibold hover:bg-green-700">
                  Place Bet
                </button>
                <button
                  onClick={() => setSelectedBet(null)}
                  className="flex-1 bg-red-600 text-white py-1.5 rounded text-xs font-semibold hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400 text-center py-4">
              Click on odds to place bet
            </div>
          )}
        </div>

        {/* Match Odds Section */}
        <div className="p-3">
          <h3 className="font-semibold text-sm mb-3 pb-2 border-b border-gray-600">Match Odds</h3>
          
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setBetslipTab("unmatched")}
              className={`flex-1 py-1.5 rounded text-xs font-semibold ${betslipTab === "unmatched" ? "bg-red-600" : "bg-gray-600"}`}
            >
              <div className="flex items-center justify-center gap-1">
                <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[10px]">00</div>
                Unmatched
              </div>
            </button>
            <button
              onClick={() => setBetslipTab("matched")}
              className={`flex-1 py-1.5 rounded text-xs font-semibold ${betslipTab === "matched" ? "bg-green-600" : "bg-gray-600"}`}
            >
              <div className="flex items-center justify-center gap-1">
                <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-[10px]">00</div>
                Matched
              </div>
            </button>
          </div>

          <div className="text-center py-8 text-gray-400 text-xs">
            No bets placed yet
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {isRulesOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsRulesOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Market Rules</h2>
              <button onClick={() => setIsRulesOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-gray-700">
              <p className="mb-2">Market rules and regulations will be displayed here.</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes zoomInZoomOut {
          0%, 100% { transform: scale(0.865); color: rgb(255, 56, 0); }
          50% { transform: scale(1.097); color: rgb(255, 252, 0); }
        }
        @keyframes sec {
          0%, 100% { transform: scale(0.865); color: rgb(255, 255, 255); }
          50% { transform: scale(1.097); color: rgb(255, 252, 0); }
        }
        .heartbeat-anim { animation: zoomInZoomOut 1s ease infinite; display: inline-block; }
        .heartbeat-anim2 { animation: sec 1s ease infinite; display: inline-block; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}