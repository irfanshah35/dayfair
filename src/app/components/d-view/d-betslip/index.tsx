import React from "react";

const DBetSlip = () => {
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

      {/* Place Bet Section */}
      <div className="mb-2.5 py-1 px-4 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white rounded-tr-sm rounded-tl-sm flex justify-between items-center border-b border-[rgba(0,0,0,.175)]">
        <h6 className="mb-0 cursor-pointer text-[16px] text-white inline-block leading-[1.2] font-medium">
          Place Bet
        </h6>
      </div>

      {/* Match Odds Section */}
      <div className="mb-2.5 flex flex-col border border-[rgba(0,0,0,.175)] rounded-tr-sm rounded-tl-sm overflow-hidden">
        <div
          className="py-1 px-4 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white 
           flex justify-between items-center border-b border-[rgba(0,0,0,.175)]"
        >
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
              <div className="text-black font-bold leading-normal">Matched</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBetSlip;
