"use client";
import React, { useState, useEffect, useRef } from "react";
import { Minus, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store/store";
import { useToast } from "@/components/common/toast/toast-context";
import { useParams, useRouter } from "next/navigation";
import { CONFIG, STACK_VALUE } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import Loader from "@/components/common/loader";

interface MBetSlipProps {
  visible?: boolean;
  backLayClsModal?: string;
  extraBgClass?: string;
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
  onPreviewChange?: (data: { stake: number; price: number }) => void;
}

const MBetSlip: React.FC<MBetSlipProps> = ({
  visible = false,
  backLayClsModal = "slip-back",
  extraBgClass = "betbg--back",
  odds = 0,
  marketId = "",
  selectionId = 0,
  eventId: propEventId = "",
  sportId: propSportId = "",
  marketType = "MATCH_ODDS",
  runnerName = "",
  minStake = 1,
  maxStake = 99999999,
  onClose,
  onPlaced,
  onPreviewChange,
}) => {
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  
  // Logic State
  const [betAmount, setBetAmount] = useState("");
  const [matchMe, setMatchMe] = useState(false);
  const [priceInput, setPriceInput] = useState<string>(""); // Replaces stackValue for logic
  const [placing, setPlacing] = useState(false);
  
  const slipRef = useRef<HTMLDivElement>(null);
  const { stakeValue, setStakeValue} = useAppStore();
  const { userBalance, setUserBalance} = useAppStore();

  const eventId = propEventId || (params as any)?.eventId || "";
  const sportId = propSportId || (params as any)?.sportId || "";

  const [stakeButtons, setStakeButtons] = useState(
    STACK_VALUE.map((item) => item.stakeAmount)
  );

  // Initialize Price (Odds)
  useEffect(() => {
    if (visible) {
      setPriceInput(odds != null ? String(Number(odds).toFixed(2)) : "");
    }
  }, [visible, odds]);

  // Load Dynamic Stakes
  useEffect(() => {
    if (stakeValue && stakeValue.stake && stakeValue.stake.length > 0) {
      const dynamicStakes = stakeValue.stake.map((item: any) => item.stakeAmount);
      setStakeButtons(dynamicStakes);
    } else {
        const fallbackStakes = STACK_VALUE.map((item) => item.stakeAmount);
        setStakeButtons(fallbackStakes);
    }
  }, [stakeValue]);

  // Scroll behavior
  useEffect(() => {
    if (visible && slipRef.current) {
      setTimeout(() => {
        slipRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }, [visible]);

  // Preview change handler
  useEffect(() => {
    if (onPreviewChange) {
      onPreviewChange({
        stake: Number(betAmount) || 0,
        price: Number(priceInput) || 0,
      });
    }
  }, [betAmount, priceInput, onPreviewChange]);

  // --- ODDS CALCULATION LOGIC (Copied from DBetSlip) ---
  const lowerUpperArry = [{
    increment: 0.01, lowerBound: 1.01, upperBound: 2
  }, {
    increment: 0.02, lowerBound: 2, upperBound: 3
  }, {
    increment: 0.05, lowerBound: 3, upperBound: 4
  }, {
    increment: 0.1, lowerBound: 4, upperBound: 6
  }, {
    increment: 0.2, lowerBound: 6, upperBound: 10
  }, {
    increment: 0.5, lowerBound: 10, upperBound: 20
  }, {
    increment: 1, lowerBound: 20, upperBound: 30
  }, {
    increment: 2, lowerBound: 30, upperBound: 50
  }, {
    increment: 5, lowerBound: 50, upperBound: 100
  }, {
    increment: 10, lowerBound: 100, upperBound: 1000
  }];

  const incPrice = () => {
    if (marketType === 'FANCY' || marketType === 'BOOKMAKER') return;
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
    if (marketType === 'FANCY' || marketType === 'BOOKMAKER') return;
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

  const handleStackClick = (value: number) => {
    setBetAmount(value.toString());
  };

  const handleCancel = () => {
    setBetAmount("");
    setPriceInput("");
    setMatchMe(false);
    onClose?.();
  };

  // Determine Side
  const side: "BACK" | "LAY" = React.useMemo(() => {
    if (backLayClsModal === "slip-back") return "BACK";
    if (backLayClsModal === "slip-lay") return "LAY";
    if (backLayClsModal === "slip-Line-Yes") return "BACK";
    return "LAY";
  }, [backLayClsModal]);

  // Build Payload
  const buildPayload = () => {
    return {
      marketId,
      selectionId,
      stake: Number((parseFloat(betAmount) || 0).toFixed(2)),
      price: Number((parseFloat(priceInput) || 0).toFixed(2)),
      eventId,
      side,
      matchMe: matchMe,
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
    } catch { /* silent */ }
  };

  const refreshUserBalance = async () => {
    try {
      await fetchData({
        url: CONFIG.getUserBalance,
        payload: { key: CONFIG.siteKey },
        setFn: (res: any) => {
          setUserBalance(res);
        }
      });
    } catch (error) {
      console.error("Balance refresh error:", error);
    }
  };

  // --- MAIN BET PLACEMENT LOGIC ---
  const handlePlaceBet = async () => {
    const s = parseFloat(betAmount) || 0;
    const p = parseFloat(priceInput) || 0;

    const token = localStorage.getItem('token');
    if (!token) {
      showToast('error', 'Authentication Required', 'Please login first to place bet');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    if (s < minStake || s > maxStake) {
      showToast('error', 'Invalid Stake', `Stake must be between ${minStake} and ${maxStake}`);
      return;
    }
    if (p <= 1) {
      showToast('error', 'Invalid Odds', 'Odds must be greater than 1');
      return;
    }

    try {
      setPlacing(true);
      const payload = buildPayload();

      await fetchData({
        url: CONFIG.placeBetURL,
        payload: payload,
        setFn: async (res: any) => {
          // Parse message
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

          const ok = res?.meta?.status === true || res?.status === true || res?.success === true;

          if (ok) {
            await afterPlaceRefresh();
            onPlaced?.();
            handleCancel();
          }
        }
      });
    } catch (error: any) {
      console.error("Bet placement error:", error);
    } finally {
      setPlacing(false);
      await refreshUserBalance();
    }
  };

  if (!visible) return null;

  const gradient = "linear-gradient(-180deg,#f4b501_0%,#f68700_100%)";
  const btnBg = "linear-gradient(180deg,#030a12,#444647 42%,#58595a)";

  const getBgColor = () => {
    if (backLayClsModal === "slip-back") return "#beddf4";
    if (backLayClsModal === "slip-lay") return "#ffc0cb";
    if (backLayClsModal === "slip-Line-Yes") return "#d4f4dd";
    if (backLayClsModal === "slip-Line-No") return "#f4d4d4";
    return "#beddf4";
  };

  return (
    <div ref={slipRef} className="relative w-full">
      <div
        className="lg:px-[5px] pt-3 pb-[13px] md:pb-4 relative"
        style={{ 
          backgroundColor: getBgColor(),
          pointerEvents: placing ? 'none' : 'auto' // Disable interaction when placing
        }}
      >
        {/* LOADER OVERLAY */}
        {placing && (
          <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-white/50">
            <Loader />
          </div>
        )}

        <div className="w-[95.5%]" style={{ margin: "0 auto" }}>
          {/* HEADER */}
          <div className="flex justify-between items-center mb-1.5">
            <div className="px-1.5 md:px-[9px] flex-1">
              <span className="font-bold text-black text-[14px]">
                {runnerName}
              </span>
            </div>

            <div className="flex flex-1 items-center ml-1.5 md:ml-0 md:px-[9px] gap-[7px]">
              <span className="text-[14px] font-bold text-black">MatchMe</span>

              <label className="matchMe relative w-[55px] h-[25px] inline-block cursor-pointer">
                <input
                  type="checkbox"
                  checked={matchMe}
                  onChange={(e) => setMatchMe(e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`
                    slidernew absolute inset-0 rounded-[30px] overflow-hidden border-4 border-transparent
                    transition-all duration-300
                    ${matchMe
                      ? "shadow-[0_0_0_2px_#32cd32,0_0_2px_#32cd32]"
                      : "shadow-[0_0_0_2px_#777,0_0_4px_#777]"
                    }
                  `}
                ></span>
                <span
                  className={`
                    absolute top-1  left-1 w-[17px] h-[17px] rounded-full transition-all duration-300
                    ${matchMe
                      ? "bg-[#32cd32] translate-x-[30px]"
                      : "bg-[#777] translate-x-0"
                    }
                  `}
                ></span>
              </label>
            </div>
          </div>

          {/* INPUT ROW */}
          <div className="flex gap-0 mb-1.5">
            {/* Counter Buttons for ODDS */}
            <div className="flex-1 flex justify-end items-center pr-1.5">
              <button
                onClick={decPrice}
                className="h-[30px] w-7 flex items-center justify-center border border-white text-white cursor-pointer hover:opacity-90"
                style={{ background: btnBg }}
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                value={priceInput}
                readOnly
                className="h-[30px] w-[calc(100%-56px)] text-black text-center border-t border-b border-white bg-white text-base opacity-80 font-bold"
                style={{ fontSize: "16px" }}
              />

              <button
                onClick={incPrice}
                className="h-[30px] w-7 flex items-center justify-center border border-white text-white cursor-pointer hover:opacity-90"
                style={{ background: btnBg }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Bet Amount Input */}
            <div className="flex-1 pl-1.5">
              <input
                type="number"
                id="betAmountMobile"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="0"
                className="w-full h-[30px] text-black text-center border border-white bg-white text-base opacity-80 font-bold"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          {/* STAKE BUTTONS */}
          <div className="grid grid-cols-4 gap-x-[7px] gap-y-1.5 mb-1.5">
            {stakeButtons.map((value: any) => {
              const isSelected = betAmount === value.toString();

              return (
                <button
                  key={value}
                  onClick={() => handleStackClick(value)}
                  className={`
                    font-bold text-[14px] h-9 leading-9! rounded-none transition-colors border
                    ${isSelected ? "border-black" : "border-white"}
                  `}
                  style={{
                    fontSize: "14px",
                    background: isSelected ? gradient : btnBg,
                    color: isSelected ? "black" : "white",
                  }}
                >
                  {value}
                </button>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              disabled={placing}
              className="text-white font-bold leading-9 h-9 rounded-none transition-colors border border-white hover:bg-red-600"
              style={{
                fontSize: "14px",
                background: btnBg,
              }}
            >
              Cancel
            </button>

            {/* Place Bet Button */}
            <button
              onClick={handlePlaceBet}
              disabled={placing || !betAmount || parseFloat(priceInput) <= 1}
              className={`
                font-bold h-9 rounded-none transition-colors
                border ${betAmount && parseFloat(priceInput) > 1 ? "border-black" : "border-white"}
                disabled:cursor-not-allowed
              `}
              style={{
                fontSize: "16px",
                background: (betAmount && parseFloat(priceInput) > 1 && !placing) ? gradient : "#E5AD56",
                color: (betAmount && parseFloat(priceInput) > 1 && !placing) ? "black" : "white",
                opacity: (betAmount && parseFloat(priceInput) > 1 && !placing) ? 1 : 0.90,
              }}
            >
              {placing ? "Placing..." : "Place Bet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MBetSlip;