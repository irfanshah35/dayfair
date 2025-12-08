import React, { useState, useEffect } from "react";
import { FaAngleUp, FaAngleDown, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import { useToast } from "@/components/common/toast/toast-context";
import { useAppStore } from "@/lib/store/store";

interface DBetSlipProps {
  visible?: boolean;
  backLayClsModal?: string;
  odds?: number;
  marketId?: string;
  selectionId?: number;
  eventId?: string;
  sportId?: string;
  marketType?: string;
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
  eventId: propEventId = "",
  sportId: propSportId = "",
  marketType = "MATCH_ODDS",
  runnerName = "West Indies",
  minStake = 1,
  maxStake = 99999999,
  onClose,
  onPlaced,
}) => {
  const { showToast } = useToast();
  const [isPlaceBetOpen, setIsPlaceBetOpen] = useState<boolean>(true);
  const [priceInput, setPriceInput] = useState<string>("");
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [placing, setPlacing] = useState(false);
  const [matchedBets, setMatchedBets] = useState<any[]>([]);
  const [unmatchedBets, setUnmatchedBets] = useState<any[]>([]);
  const [showMatched, setShowMatched] = useState<boolean>(true);
  const [showUnmatched, setShowUnmatched] = useState<boolean>(true);
  const [expandedBets, setExpandedBets] = useState<Set<string>>(new Set());
  const { stakeValue, setStakeValue } = useAppStore();
  const [isChecked, setIsChecked] = useState(false);



  const params = useParams();
  const eventId = propEventId || (params as any)?.eventId || "";
  const sportId = propSportId || (params as any)?.sportId || "";

  const gradient = "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)";

  const [stakeButtons, setStakeButtons] = useState([]);

  useEffect(() => {
    if (stakeValue && stakeValue.stake) {
      const dynamicStakes = stakeValue.stake.map((item: any) => item.stakeAmount);
      setStakeButtons(dynamicStakes);
    }
  }, [stakeValue]);

  const lowerUpperArry = [{
    increment: 0.01,
    lowerBound: 1.01,
    upperBound: 2
  }, {
    increment: 0.02,
    lowerBound: 2,
    upperBound: 3
  }, {
    increment: 0.05,
    lowerBound: 3,
    upperBound: 4
  }, {
    increment: 0.1,
    lowerBound: 4,
    upperBound: 6
  }, {
    increment: 0.2,
    lowerBound: 6,
    upperBound: 10
  }, {
    increment: 0.5,
    lowerBound: 10,
    upperBound: 20
  }, {
    increment: 1,
    lowerBound: 20,
    upperBound: 30
  }, {
    increment: 2,
    lowerBound: 30,
    upperBound: 50
  }, {
    increment: 5,
    lowerBound: 50,
    upperBound: 100
  }, {
    increment: 10,
    lowerBound: 100,
    upperBound: 1000
  }];

  // Seed price when opened / odds change
  useEffect(() => {
    if (visible) {
      setPriceInput(odds != null ? String(Number(odds).toFixed(2)) : "");
    }
  }, [visible, odds]);

  useEffect(() => {
    if (visible) {
      setIsPlaceBetOpen(true);
    }
  }, [visible]);

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

  useEffect(() => {
    fetchBets();
  }, [eventId, sportId]);

  // Determine side (BACK or LAY)
  const side: "BACK" | "LAY" = React.useMemo(() => {
    if (backLayClsModal === "slip-back") return "BACK";
    if (backLayClsModal === "slip-lay") return "LAY";
    if (backLayClsModal === "slip-Line-Yes") return "BACK";
    return "LAY";
  }, [backLayClsModal]);

  const incPrice = () => {
    if (marketType === 'FANCY' || marketType === 'BOOKMAKER') {
      return;
    }

    const c = parseFloat(priceInput);
    if (!c) return;

    let increment = 0;

    if (c >= lowerUpperArry[9].upperBound) {
      increment = lowerUpperArry[9].increment;
    }

    for (let b = 0; b < lowerUpperArry.length; b++) {
      if ((c >= lowerUpperArry[b].lowerBound) && (c < lowerUpperArry[b].upperBound)) {
        increment = lowerUpperArry[b].increment;
      }
    }

    const newVal = c + increment;
    setPriceInput(newVal.toFixed(2));
  };

  const decPrice = () => {
    if (marketType === 'FANCY' || marketType === 'BOOKMAKER') {
      return;
    }

    const c = parseFloat(priceInput);
    if (!c) return;

    let increment: any;

    if (c >= lowerUpperArry[9].upperBound) {
      increment = lowerUpperArry[9].increment;
    }

    for (let b = 0; b < lowerUpperArry.length; b++) {
      if ((c > lowerUpperArry[b].lowerBound) && (c <= lowerUpperArry[b].upperBound)) {
        increment = lowerUpperArry[b].increment;
      }
    }

    if (c <= 1.01) {
      setPriceInput(priceInput);
    } else {
      const newVal = c - increment;
      setPriceInput(newVal.toFixed(2));
    }
  };

  const handleStakeClick = (amount: number) => {
    setStakeAmount(amount.toString());
    if (!priceInput) {
      setPriceInput(odds != null ? String(Number(odds).toFixed(2)) : "");
    }
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
    setPriceInput("");
    setIsPlaceBetOpen(false);
    onClose?.();
  };

  const handleClose = () => {
    setStakeAmount("");
    setPriceInput("");
    setIsPlaceBetOpen(false);
    onClose?.();
  };

  // Build payload exactly like the previous project
  const buildPayload = () => {
    console.log("Building payload with:", { marketId, selectionId, eventId, sportId, marketType });
    return {
      marketId,
      selectionId,
      stake: Number((parseFloat(stakeAmount) || 0).toFixed(2)),
      price: Number((parseFloat(priceInput) || 0).toFixed(2)),
      eventId,
      side,
      matchMe: false,
      type: marketType || "MATCH_ODDS",
    };
  };

  const afterPlaceRefresh = async () => {
    try {
      await fetchData({
        url: CONFIG.getAllMarketplURL,
        payload: { eventId },
        setFn: () => { }
      });
      // Refresh balance if needed - you can add balance refresh logic here
    } catch {
      /* silent */
    }
  };

  const handlePlaceBet = async () => {
    const s = parseFloat(stakeAmount) || 0;
    const p = parseFloat(priceInput) || 0;

    if (s < minStake || s > maxStake) {
      return;
    }
    if (p <= 1) {
      return;
    }

    try {
      setPlacing(true);
      const payload = buildPayload();

      // Use fetchData for consistency with your existing code
      await fetchData({
        url: CONFIG.placeBetURL,
        payload: payload,
        setFn: async (res: any) => {
          console.log("Place bet response:", res);

          // Parse message like in ChangePassword
          let parts = [];
          if (res?.meta?.message) {
            parts = res.meta.message
              .split(/',\s*'/)
              .map((p: any) => p?.replace(/^'+|'+$/g, "").trim());
          }

          const msg = {
            status: parts?.[0] || "",
            title: parts?.[1] || "",
            desc: parts?.[2] || "",
          };

          showToast(msg.status, msg.title, msg.desc);

          const ok =
            res?.meta?.status === true ||
            res?.status === true ||
            res?.success === true;

          if (ok) {
            await afterPlaceRefresh();
            await fetchBets();
            onPlaced?.();
            setStakeAmount("");
            setPriceInput("");
            setIsPlaceBetOpen(false);
            onClose?.();
          }
        }
      });
    } catch (error) {
      console.error("Bet placement error:", error);
    } finally {
      setPlacing(false);
      fetchBets();


    }
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
            className=" overflow-hidden"
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
                  <td className="px-1  align-middle text-[12px] font-bold">
                    <div className="text-[12px] font-bold text-black leading-tight py-1">
                      {runnerName}
                    </div>
                  </td>
                  <td className="px-0 py-0 relative left-3.5 align-middle text-[12px] font-bold">
                    <div className="whitespace-nowrap inline-flex items-center">
                      <input
                        type="text"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        maxLength={4}
                        className="w-[45px] h-[22px] align-middle text-black bg-white px-0.5 text-center border border-gray-300 text-[12px] font-normal"
                      />
                      <div className="inline-flex flex-col">
                        <button
                          type="button"
                          onClick={incPrice}
                          className="w-5 h-[11px] px-0 py-0 bg-[#CCCCCC] flex items-center justify-center hover:bg-gray-300"
                        >
                          <FaAngleUp className="text-[10px] text-black" />
                        </button>
                        <button
                          type="button"
                          onClick={decPrice}
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
                disabled={placing}
                className="px-2 py-1 text-[14px] bg-[#F41B35] text-white rounded-xs border-0 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlaceBet}
                disabled={placing || !stakeAmount || parseFloat(priceInput) <= 1}
                style={{
                  background: gradient,
                  opacity: (stakeAmount && parseFloat(priceInput) > 1 && !placing) ? 1 : 0.65,
                  border: (stakeAmount && parseFloat(priceInput) > 1 && !placing) ? "1px solid black" : "none",
                  color: (stakeAmount && parseFloat(priceInput) > 1 && !placing) ? "black" : "white",
                }}
                className="px-2 py-1 text-[14px] rounded-xs font-medium transition-all"
              >
                {placing ? "Placing..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MATCH ODDS SUMMARY + MATCHED/UNMATCHED LIST */}
      <div className="mb-2.5 border border-[rgba(0,0,0,.175)] rounded-tr-sm rounded-tl-sm overflow-hidden">
        {/* Match Odds Header */}
        <div className="py-1 px-4 h-[29.58px] bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white flex justify-between items-center border-b border-[rgba(0,0,0,.175)]">
          <div className="mb-0 text-[16px] font-medium text-white leading-[19px]">Match Odds</div>
        </div>

        {/* UNMATCHED SUMMARY ROW */}
        <div
          className="w-full bg-white border-b border-[#ebebeb] flex items-center justify-between px-2 py-2 cursor-pointer"
          onClick={() => setShowUnmatched((p) => !p)}
        >
          <div className="flex items-center gap-2">
            <div className="min-w-7 h-6 px-2 flex items-center justify-center rounded-xl text-white font-bold text-[12px] bg-[rgb(220,53,69)]">
              {String(unmatchedBets.length).padStart(2, "0")}
            </div>
            <span className="font-bold text-black text-[14px]">Unmatched</span>
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

            {/* <span className="text-[16px] font-bold">
              {showUnmatched ? "▾" : "▸"}
            </span> */}
          </div>
        </div>

        {/* UNMATCHED BETS LIST */}
        {unmatchedBets.length > 0 && showUnmatched && (
          <div className="w-full bg-white border-b border-[#ebebeb]">
            <div className="py-1 px-3 bg-[linear-gradient(180deg,#030a12,#444647_42%)] text-white font-bold text-[14px]">
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
                    <span className="text-[10px] font-bold text-black shrink-0">
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
        <hr className="text-[#dccceb] h-1"/>

        {/* MATCHED SUMMARY ROW */}
        <div
          className="w-full bg-white border-b mt-[3px] border-[#ebebeb] flex items-center justify-between px-2 py-2 cursor-pointer"
          onClick={() => setShowMatched((p) => !p)}
        >
          <div className="flex items-center gap-2">
            <div className="min-w-7 h-6 px-2 flex items-center justify-center rounded-xl text-white font-bold text-[12px] bg-[#00c4a1]">
              {String(matchedBets.length).padStart(2, "0")}
            </div>
            <span className="font-bold text-black text-[14px]">Matched</span>
          </div>

          <div className="flex items-center gap-2">
            {matchedBets.length > 0 && (
              <>
                <span className="text-[14px]">Average Odds</span>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    <div className="w-11 h-6 rounded-full peer border border-gray-300 transition-colors duration-300 peer-checked:bg-[#4cb04f] peer-checked:shadow-[0_0_0_0.25rem_#0d6efd40] peer-focus:outline-none peer-focus:shadow-[0_0_0_0.25rem_#0d6efd40] peer-focus:border-[#86b7fe]"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-gray-300 rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-300"></div>
                  </label>
                </div>

              </>
            )}

            {/* <span className="text-[16px] font-bold">
              {showMatched ? "▾" : "▸"}
            </span> */}
          </div>
        </div>

        {/* MATCHED BETS LIST */}
        {matchedBets.length > 0 && showMatched && (
          <div className="w-full bg-white border-b border-[#ebebeb]">
            <div className="px-2.5 h-[30px] flex items-center bg-[linear-gradient(180deg,#030a12,#444647_42%)] text-white font-bold text-[12px]">
              Match Odds
            </div>

            {matchedBets.map((bet) => {
              const isExpanded = expandedBets.has(bet.betId);
              const isLay = bet.side === "LAY";

              return (
                <div key={bet.betId} className={`border-b p-2 border-[#ebebeb] ${isLay ? 'border-l-[3px] border-l-[#f18883]' : 'border-l-[3px] border-l-[#72bbef]'}`}>
                  <div
                    className="w-full bg-white cursor-pointer flex items-center gap-2"
                    onClick={() => toggleBetExpansion(bet.betId)}
                  >
                    {!isChecked && (
                      <span className={`text-[10px] font-bold text-black shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        {/* {isExpanded ? <FaChevronDown /> : <FaChevronUp />} */}
                        <FaChevronDown />
                      </span>
                    )
                    }
                    <div className="flex-1 leading-3.5">
                      <div className={`text-[12px] font-bold ${isLay ? 'text-[#f56a6a]' : 'text-[#2a9df4]'}`}>
                        {bet.side} {bet.selectionName}
                      </div>
                      <div className="text-[12px] text-black">
                        for <span className="font-semibold">${bet.requestedSize}</span> @ <span className="font-semibold">{bet.requestedPrice}</span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && !isChecked && (
                    <div className="mt-3 bg-white text-[12px] text-gray-600">
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