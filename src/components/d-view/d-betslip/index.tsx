/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect } from "react";
import { FaAngleUp, FaAngleDown, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";

interface DBetSlipProps {
  visible?: boolean;
  backLayClsModal?: string;
  odds?: number;
  marketId?: string;
  selectionId?: number;
  runnerName?: string;
  minStake?: number;
  maxStake?: number;
  onClose?: () => void;
  onPlaced?: () => void;
}

const DBetSlip: React.FC<DBetSlipProps> = ({
  visible = false,
  backLayClsModal = "slip-back",
  odds = 2.26,
  marketId = "",
  selectionId = 0,
  runnerName = "West Indies",
  minStake = 1,
  maxStake = 99999999,
  onClose,
  onPlaced,
}) => {
  const [isPlaceBetOpen, setIsPlaceBetOpen] = useState<boolean>(true);
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [matchedBets, setMatchedBets] = useState<any[]>([]);
  const [unmatchedBets, setUnmatchedBets] = useState<any[]>([]);
  const [showMatched, setShowMatched] = useState<boolean>(true);
  const [showUnmatched, setShowUnmatched] = useState<boolean>(true);
  const [expandedBets, setExpandedBets] = useState<Set<string>>(new Set());

  const params = useParams();
  const eventId = (params as any)?.eventId;
  const sportId = (params as any)?.sportId;

  const gradient = "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)";

  const stakeButtons = [
    1000, 5000, 10000, 25000, 50000, 100000, 200000, 500000,
  ];

  useEffect(() => {
    if (visible) {
      setIsPlaceBetOpen(true);
    }
  }, [visible]);

  useEffect(() => {
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

          // FIX: API RETURNS matchedBets AT ROOT, NOT UNDER res.data
          const matched = res?.matchedBets || [];
          const unmatched = res?.unmatchedBets || [];

          console.log("Setting Matched:", matched.length, "Unmatched:", unmatched.length);

          setMatchedBets(matched);
          setUnmatchedBets(unmatched);
        },
      });
    };

    fetchBets();
  }, [eventId, sportId]);

  const handleStakeClick = (amount: number) => {
    setStakeAmount(amount.toString());
  };

  const toggleBetExpansion = (betId: string) => {
    setExpandedBets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(betId)) {
        newSet.delete(betId);
      } else {
        newSet.add(betId);
      }
      return newSet;
    });
  };

  const handleMinStack = () => {
    setStakeAmount(String(minStake || 100));
  };

  const handleMaxStack = () => {
    setStakeAmount(String(maxStake || 1000000));
  };

  const handleCancel = () => {
    setStakeAmount("");
    setIsPlaceBetOpen(false);
    onClose?.();
  };

  const handleClose = () => {
    setStakeAmount("");
    setIsPlaceBetOpen(false);
    onClose?.();
  };

  const handlePlaceBet = () => {
    if (!stakeAmount) return;
    onPlaced?.();
    setStakeAmount("");
    setIsPlaceBetOpen(false);
  };

  const getBgColor = () => {
    if (backLayClsModal === "slip-back") return "#72bbef";
    if (backLayClsModal === "slip-lay") return "#faa9ba";
    return "#72bbef";
  };

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

  console.log("Current state - Matched:", matchedBets.length, "Unmatched:", unmatchedBets.length);

  return (
    <div className="w-full">
      {/* Live Match Header */}
      <div className="mb-2.5 py-1 px-4 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white rounded-tr-sm rounded-tl-sm flex justify-between items-center border-b border-[rgba(0,0,0,.175)]">
        <h6 className="mb-0 cursor-pointer text-[16px] text-white inline-block leading-[1.2] font-medium">
          Live Match
        </h6>
        <div className="flex">
          <h6 className="mb-0 flex items-center gap-px cursor-pointer text-[16px] text-white leading-[1.2] font-medium">
            <svg
              className="w-5 h-4 inline"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2 4.00087C2 3.44811 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44463 22 4.00087V17.9991C22 18.5519 21.5447 19 21.0082 19H2.9918C2.44405 19 2 18.5554 2 17.9991V4.00087ZM4 5V17H20V5H4ZM5 20H19V22H5V20Z"></path>
            </svg>
            live stream started
          </h6>
        </div>
      </div>

      <div className="mb-2.5">
        {/* Place Bet Header */}
        <div
          className="py-[5px] mt-3 px-4 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white rounded-tr-sm rounded-tl-sm flex justify-between items-center border-b border-[rgba(0,0,0,.175)] cursor-pointer"
          onClick={() => setIsPlaceBetOpen((prev) => !prev)}
        >
          <h6 className="mb-0 text-[16px] text-white inline-block leading-[1.2] font-medium">
            Place Bet
          </h6>
        </div>

        {/* BetSlip Content */}
        {isPlaceBetOpen && visible && (
          <div
            className="rounded-tr-sm rounded-tl-sm overflow-hidden"
            style={{ backgroundColor: getBgColor() }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#ccc]">
                  <th className="text-center text-[12px] font-bold p-[5px_8px_2px] text-[#303030] border-b border-[#dee2e6]"></th>
                  <th className="text-center text-[12px] font-bold p-[3px_0_2px] text-[#303030] border-b border-[#dee2e6]">
                    (Bet For)
                  </th>
                  <th className="text-center text-[12px] pr-4.5 font-bold p-[3px_0_2px] text-[#303030] border-b border-[#dee2e6]">
                    Odds
                  </th>
                  <th className="text-center text-[12px] pr-15 font-bold p-[3px_0_2px] text-[#303030] border-b border-[#dee2e6]">
                    Stake
                  </th>
                  <th className="text-end text-[12px] font-bold p-[3px_0_2px] pr-[5px] text-[#303030] border-b border-[#dee2e6]">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-transparent">
                  <td className="p-1 align-middle text-[12px] font-bold">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-red-600 cursor-pointer pl-2 text-[12px]"
                    >
                      <FaTimes />
                    </button>
                  </td>
                  <td className="px-1 py-0 align-middle text-[12px] font-bold">
                    <div className="text-[12px] font-bold text-black leading-tight py-1">
                      {runnerName}
                    </div>
                  </td>
                  <td className="px-0 py-0 relative left-3.5 align-middle text-[12px] font-bold">
                    <div className="whitespace-nowrap inline-flex items-center">
                      <input
                        type="text"
                        defaultValue={odds.toFixed(2)}
                        maxLength={4}
                        className="w-[45px] h-[22px] align-middle text-black bg-white px-0.5 text-center border border-gray-300 text-[12px] font-normal"
                      />
                      <div className="inline-flex flex-col">
                        <button
                          type="button"
                          className="w-5 h-[11px] px-0 py-0 bg-[#CCCCCC] flex items-center justify-center hover:bg-gray-300"
                        >
                          <FaAngleUp className="text-[10px] text-black" />
                        </button>
                        <button
                          type="button"
                          className="w-5 h-[11px] px-0 py-0 bg-[#CCCCCC] flex items-center justify-center hover:bg-gray-300"
                        >
                          <FaAngleDown className="text-[10px] text-black" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-7 pl-10 pr-11 py-0 align-middle text-[12px] font-bold">
                    <input
                      type="number"
                      maxLength={10}
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="w-full h-[22px] px-0.5 text-center text-black bg-white border border-gray-300 text-[12px]"
                    />
                  </td>
                  <td className="text-end px-1 py-0 align-middle text-[12px] font-bold"></td>
                </tr>
                <tr>
                  <td colSpan={5} className="p-[5px] border-t border-b">
                    {stakeButtons.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleStakeClick(amount)}
                        className="w-auto border-0 min-w-[18.9%] btn-clr font-normal h-[25px] mr-[3px] mb-[3px] text-center inline-block p-0 text-white rounded text-[14px] hover:border hover:border-black transition-all"
                        style={{
                          background:
                            "linear-gradient(180deg, #030a12, #444647 42%, #58595a)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = gradient;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(180deg, #030a12, #444647 42%, #58595a)";
                        }}
                      >
                        {amount}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleMinStack}
                      style={{ background: gradient }}
                      className="w-auto border-0 min-w-[18.9%] font-bold h-[25px] mr-[3px] mb-[3px] text-center inline-block p-0 text-white rounded text-[12px] hover:border hover:border-black transition-all"
                    >
                      Min Stack
                    </button>
                    <button
                      type="button"
                      onClick={handleMaxStack}
                      className="w-auto border-0 min-w-[18.9%] bg-[#2A4679] font-bold h-[25px] mr-[3px] mb-[3px] text-center inline-block p-0 text-white rounded text-[12px]"
                    >
                      Max Stack
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between p-2.5">
              <button
                type="button"
                onClick={handleCancel}
                className="px-2 py-1 text-[14px] bg-[#F41B35] text-white rounded-xs border-0 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlaceBet}
                disabled={!stakeAmount}
                style={{
                  background: gradient,
                  opacity: stakeAmount ? 1 : 0.65,
                  border: stakeAmount ? "1px solid black" : "none",
                  color: stakeAmount ? "black" : "white",
                }}
                className="px-2 py-1 text-[14px] rounded-xs font-medium transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MATCH ODDS SUMMARY + MATCHED/UNMATCHED LIST */}
      <div className="mb-2.5 border border-[rgba(0,0,0,.175)] rounded-tr-sm rounded-tl-sm overflow-hidden">
        {/* Match Odds Header */}
        <div className="py-1 px-4 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white flex justify-between items-center border-b border-[rgba(0,0,0,.175)]">
          <h6 className="mb-0 text-[16px] font-medium text-white">Match Odds</h6>
        </div>

        {/* UNMATCHED SUMMARY ROW */}
        <div
          className="w-full bg-white border-b border-[#ebebeb] flex items-center justify-between px-3 py-2 cursor-pointer"
          onClick={() => setShowUnmatched((p) => !p)}
        >
          <div className="flex items-center gap-2">
            <div className="min-w-7 h-6 px-2 flex items-center justify-center rounded-xl text-white font-bold text-[12px] bg-[rgb(220,53,69)]">
              {String(unmatchedBets.length).padStart(2, "0")}
            </div>
            <span className="font-bold text-black text-[13px]">Unmatched</span>
          </div>

          <div className="flex items-center gap-2">
            {unmatchedBets.length > 0 && (
              <>
                <span className="text-[12px] text-[#555] font-semibold">Average Odds</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-4 bg-gray-300 rounded-full peer"></div>
                </label>
              </>
            )}

            {/* Arrow */}
            <span className="text-[16px] font-bold">
              {showUnmatched ? "▾" : "▸"}
            </span>
          </div>
        </div>

        {/* UNMATCHED BETS LIST */}
        {unmatchedBets.length > 0 && showUnmatched && (
          <div className="w-full bg-white border-b border-[#ebebeb]">
            <div className="py-1 px-3 bg-[linear-gradient(180deg,#030a12,#444647_42%)] text-white font-bold text-[13px]">
              Unmatched Bets
            </div>

            {unmatchedBets.map((bet) => {
              const isExpanded = expandedBets.has(bet.betId);
              const isLay = bet.side === "LAY";
              
              return (
                <div key={bet.betId} className={`border-b border-[#ebebeb] ${isLay ? 'border-l-[3px] border-l-[#f18883]' : 'border-l-[3px] border-l-[#72bbef]'}`}>
                  <div
                    className="w-full bg-white px-2 py-1 cursor-pointer flex items-center gap-1"
                    onClick={() => toggleBetExpansion(bet.betId)}
                  >
                    <span className="text-[10px] font-bold text-black flex-shrink-0">
                      {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
                    </span>
                    <div className="flex-1">
                      <div className={`text-[10px] font-bold ${isLay ? 'text-[#f56a6a]' : 'text-[#2a9df4]'}`}>
                        {bet.side} {bet.selectionName}
                      </div>
                      <div className="text-[10px] text-black">
                        for <span className="font-semibold">${bet.requestedSize}</span> @ <span className="font-semibold">{bet.requestedPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-2 py-1 bg-white text-[12px] text-gray-600">
                      <div>Placed: <span>{formatDateTime(bet.placedDate)}</span></div>
                      <div>Ref: <span>{bet.betId}</span></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MATCHED SUMMARY ROW */}
        <div
          className="w-full bg-white border-b border-[#ebebeb] flex items-center justify-between px-3 py-2 cursor-pointer"
          onClick={() => setShowMatched((p) => !p)}
        >
          <div className="flex items-center gap-2">
            <div className="min-w-7 h-6 px-2 flex items-center justify-center rounded-xl text-white font-bold text-[12px] bg-[#00c4a1]">
              {String(matchedBets.length).padStart(2, "0")}
            </div>
            <span className="font-bold text-black text-[13px]">Matched</span>
          </div>

          <div className="flex items-center gap-2">
            {matchedBets.length > 0 && (
              <>
                <span className="text-[12px] text-[#555] font-semibold">Average Odds</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-4 bg-gray-300 rounded-full peer"></div>
                </label>
              </>
            )}

            {/* Arrow */}
            <span className="text-[16px] font-bold">
              {showMatched ? "▾" : "▸"}
            </span>
          </div>
        </div>

        {/* MATCHED BETS LIST */}
        {matchedBets.length > 0 && showMatched && (
          <div className="w-full bg-white border-b border-[#ebebeb]">
            <div className="py-1 px-3 bg-[linear-gradient(180deg,#030a12,#444647_42%)] text-white font-bold text-[13px]">
              Match Odds
            </div>

            {matchedBets.map((bet) => {
              const isExpanded = expandedBets.has(bet.betId);
              const isLay = bet.side === "LAY";
              
              return (
                <div key={bet.betId} className={`border-b border-[#ebebeb] ${isLay ? 'border-l-[3px] border-l-[#f18883]' : 'border-l-[3px] border-l-[#72bbef]'}`}>
                  <div
                    className="w-full bg-white px-2 py-1 cursor-pointer flex items-center gap-1"
                    onClick={() => toggleBetExpansion(bet.betId)}
                  >
                    <span className="text-[10px] font-bold text-black flex-shrink-0">
                      {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
                    </span>
                    <div className="flex-1">
                      <div className={`text-[10px] font-bold ${isLay ? 'text-[#f56a6a]' : 'text-[#2a9df4]'}`}>
                        {bet.side} {bet.selectionName}
                      </div>
                      <div className="text-[10px] text-black">
                        for <span className="font-semibold">${bet.requestedSize}</span> @ <span className="font-semibold">{bet.requestedPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-2 py-1 bg-white text-[12px] text-gray-600">
                      <div>Placed: <span>{formatDateTime(bet.placedDate)}</span></div>
                      <div>Matched: <span>{formatDateTime(bet.matchedDate)}</span></div>
                      <div>Ref: <span>{bet.betId}</span></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DBetSlip;