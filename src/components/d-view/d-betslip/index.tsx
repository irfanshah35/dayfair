/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { FaAngleUp, FaAngleDown, FaTimes } from "react-icons/fa";

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
  runnerName = "West Indies U19",
  minStake = 1,
  maxStake = 99999999,
  onClose,
  onPlaced,
}) => {
  const [isPlaceBetOpen, setIsPlaceBetOpen] = useState<boolean>(true);
  const [stakeAmount, setStakeAmount] = useState<string>("");

  const gradient = "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)";

  const stakeButtons = [
    1000, 5000, 10000, 25000, 50000, 100000, 200000, 500000,
  ];

  useEffect(() => {
    if (visible) {
      setIsPlaceBetOpen(true);
    }
  }, [visible]);

  // If not visible (no selection yet) → hide whole sidebar content
  if (!visible) {
  }

  const handleStakeClick = (amount: number) => {
    setStakeAmount(amount.toString());
  };

  const handleMinStack = () => {
    // You can match this with minStake if needed
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
    // Place bet logic here
    onPlaced?.();
    setStakeAmount("");
    setIsPlaceBetOpen(false);
  };

  // Determine background color based on bet type
  const getBgColor = () => {
    if (backLayClsModal === "slip-back") return "#72bbef";
    if (backLayClsModal === "slip-lay") return "#faa9ba";
    return "#72bbef";
  };

  const shortNameFirstLine = runnerName
    ? runnerName.split(" ").slice(0, 2).join(" ")
    : "";
  const shortNameSecondLine = runnerName
    ? runnerName.split(" ").slice(2).join(" ")
    : "";

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
        {/* Place Bet Header (still clickable if you want collapse/open) */}
        <div
          className="py-[5px] mt-3 px-4 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white rounded-tr-sm rounded-tl-sm flex justify-between items-center border-b border-[rgba(0,0,0,.175)] cursor-pointer"
          onClick={() => setIsPlaceBetOpen((prev) => !prev)}
        >
          <h6 className="mb-0 text-[16px] text-white inline-block leading-[1.2] font-medium">
            Place Bet
          </h6>
        </div>

        {/* BetSlip Content */}
        {isPlaceBetOpen && (
          <div
            className="rounded-tr-sm rounded-tl-sm overflow-hidden"
            style={{ backgroundColor: getBgColor() }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#ccc]">
                  <th className="text-center text-[12px] font-bold p-[3px_15px_2px] text-[#303030] border-b border-[#dee2e6]"></th>
                  <th className="text-center text-[12px] font-bold p-[3px_0_2px] text-[#303030] border-b border-[#dee2e6]">
                    (Bet For)
                  </th>
                  <th className="text-center text-[12px] font-bold p-[3px_0_2px] text-[#303030] border-b border-[#dee2e6]">
                    Odds
                  </th>
                  <th className="text-center text-[12px] font-bold p-[3px_0_2px] text-[#303030] border-b border-[#dee2e6]">
                    Stake
                  </th>
                  <th className="text-end text-[12px] font-bold p-[3px_0_2px] pr-[5px] text-[#303030] border-b border-[#dee2e6]">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-transparent">
                  <td className="text-center p-1 align-middle text-[12px] font-bold">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-red-600 cursor-pointer text-[16px]"
                    >
                      <FaTimes />
                    </button>
                  </td>
                  <td className="px-2 py-0 align-middle text-[12px] font-bold">
                    <div className="text-[12px] font-bold text-black leading-tight py-1">
                      {shortNameFirstLine}
                      <br />
                      {shortNameSecondLine}
                    </div>
                  </td>
                  <td className="px-1 py-0 align-middle text-[12px] font-bold">
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
                          className="w-5 h-[11px] px-0 py-0 bg-[#CCCCCC] border border-gray-400 flex items-center justify-center hover:bg-gray-300"
                        >
                          <FaAngleUp className="text-[10px] text-black" />
                        </button>
                        <button
                          type="button"
                          className="w-5 h-[11px] px-0 py-0 bg-[#CCCCCC] border border-gray-400 flex items-center justify-center hover:bg-gray-300"
                        >
                          <FaAngleDown className="text-[10px] text-black" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-7 py-0 align-middle text-[12px] font-bold">
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

      <div className="mb-2.5 flex flex-col border border-[rgba(0,0,0,.175)] rounded-tr-sm rounded-tl-sm overflow-hidden">
        <div className="py-1 px-4 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white flex justify-between items-center border-b border-[rgba(0,0,0,.175)]">
          <h6 className="mb-0 cursor-pointer text-[16px] text-white inline-block leading-[1.2] font-medium">
            Match Odds
          </h6>
        </div>

        <div className="w-full">
          <div className="p-2 bg-white flex justify-between items-center border-b border-[#ebebeb] text-sm">
            <div className="flex items-center gap-2 text-black font-bold">
              <div className="inline-flex items-center justify-center min-w-7 h-6 px-1.5 rounded-xl text-white font-semibold text-[12px] bg-[rgb(220_53_69)]">
                00
              </div>
              <div className="text-black font-bold leading-normal">
                Unmatched
              </div>
            </div>
          </div>
          <hr className="h-1 text-[#dccceb] m-0 border-t border-solid opacity-25" />
          <div className="p-2 mt-1 bg-white flex justify-between items-center border-b border-[#ebebeb] text-sm">
            <div className="flex items-center gap-2 text-black font-bold">
              <div className="inline-flex items-center justify-center min-w-7 h-6 px-1.5 rounded-xl text-white font-semibold text-[12px] bg-[#50d0ae]">
                00
              </div>
              <div className="text-black font-bold leading-normal">
                Matched
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBetSlip;
