"use client";
import React, { useState, useEffect, useRef } from "react";
import { Minus, Plus } from "lucide-react";

interface MBetSlipProps {
  visible?: boolean;
  backLayClsModal?: string;
  extraBgClass?: string;
  odds?: number;
  marketId?: string;
  selectionId?: number;
  eventId?: string;
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
  eventId = "",
  marketType = "",
  runnerName = "",
  minStake = 1,
  maxStake = 99999999,
  onClose,
  onPlaced,
  onPreviewChange,
}) => {
  const [betAmount, setBetAmount] = useState("");
  const [matchMe, setMatchMe] = useState(false);
  const [stackValue, setStackValue] = useState(0);
  const slipRef = useRef<HTMLDivElement>(null);

  const stackButtons = [
    1000, 5000, 10000, 25000, 50000, 100000, 200000, 500000,
  ];

  // Scroll behavior when betslip opens
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
        price: odds,
      });
    }
  }, [betAmount, odds, onPreviewChange]);

  const handleStackClick = (value: number) => {
    setBetAmount(value.toString());
  };

  const handleIncrement = () => {
    setStackValue((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setStackValue((prev) => Math.max(0, prev - 1));
  };

  const handleCancel = () => {
    setBetAmount("");
    setStackValue(0);
    setMatchMe(false);
    onClose?.();
  };

  const handlePlaceBet = () => {
    if (!betAmount) return;
    // Place bet logic here
    onPlaced?.();
    setBetAmount("");
    setStackValue(0);
    setMatchMe(false);
  };

  if (!visible) return null;

  const gradient = "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)";
  const btnBg = "linear-gradient(180deg,#030a12,#444647 42%,#58595a)";

  // Determine background color based on bet type
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
        className="px-[5px] pt-3 pb-4"
        style={{ backgroundColor: getBgColor() }}
      >
        <div className="w-[95%]" style={{ margin: "0 auto" }}>
          {/* HEADER */}
          <div className="flex justify-between items-center mb-1.5">
            <div className="px-[9px] flex-1">
              <span className="font-bold text-black text-[14px]">
                {runnerName}
              </span>
            </div>

            <div className="flex flex-1 items-center px-[9px] gap-2">
              <span className="text-[14px] font-bold text-black">MatchMe</span>

              <label className="matchMe relative w-[55px] h-[25px] inline-block cursor-pointer">
                <input
                  type="checkbox"
                  checked={matchMe}
                  onChange={(e) => setMatchMe(e.target.checked)}
                  className="sr-only"
                />

                {/* Outer track */}
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

                {/* Moving circle */}
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
            {/* Counter Buttons */}
            <div className="flex-1 flex justify-end items-center pr-1.5">
              <button
                onClick={handleDecrement}
                className="h-[30px] w-7 flex items-center justify-center border border-white text-white"
                style={{ background: btnBg }}
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                value={stackValue}
                readOnly
                className="h-[30px] w-[calc(100%-56px)] text-black text-center border-t border-b border-white bg-white text-base opacity-80"
                style={{ fontSize: "16px" }}
              />

              <button
                onClick={handleIncrement}
                className="h-[30px] w-7 flex items-center justify-center border border-white text-white"
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
                className="w-full h-[30px] text-black text-center border border-white bg-white text-base opacity-80"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          {/* STAKE BUTTONS */}
          <div className="grid grid-cols-4 gap-2 mb-1.5">
            {stackButtons.map((value) => {
              const isSelected = betAmount === value.toString();

              return (
                <button
                  key={value}
                  onClick={() => handleStackClick(value)}
                  className={`
                    font-bold text-[14px] h-9 rounded-none transition-colors border
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
              className="text-white font-bold h-9 rounded-none transition-colors border border-white"
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
              disabled={!betAmount}
              className={`
                font-bold h-9 rounded-none transition-colors
                border ${betAmount ? "border-black" : "border-white"}
                disabled:cursor-not-allowed
              `}
              style={{
                fontSize: "14px",
                background: betAmount ? gradient : "#E5AD56",
                color: betAmount ? "black" : "white",
              }}
            >
              Place Bet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MBetSlip;