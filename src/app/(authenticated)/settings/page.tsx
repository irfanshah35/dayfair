"use client";
import React from "react";

export default function Settings() {
  return (
    <div className="md:mx-[5px] md:my-[6px]">
      <div className="bg-white shadow rounded ">
        {/* opacity-40 */}
        <div className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]
                        text-white h-[33px] flex items-center px-3.5 rounded-t">
          <h4 className="text-[20px] font-bold font-roboto bottom-0.5">Update Stake</h4>
        </div>
        <div className="px-1 py-4">
          <div className="mb-[9px] pl-1">
            <p className="text-[14px] -ml-0.5">
              <b className="text-[16px]">Stake Amount</b>
            </p>
          </div>
          <div className="grid grid-cols-4 gap-x-2 md:gap-x-[10px] md:gap-y-[6px] w-full md:w-1/2 pl-1">
            {[...Array(8)].map((_, i) => (
              <input
                key={i}
                type="text"
                placeholder="1000"
                maxLength={9}
                className="border border-[#f4b501] shadow-[0_0_2px] md:shadow-none md:border-[#dee2e6] rounded text-[black] text-center h-[38px] text-[16px]"
              />
            ))}
          </div>
          <div className="mt-3 pl-1">
            <button
              className="w-full md:w-[221.5px] md:w-1/4 h-[38px] text-[16px] 
                         bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]
                         text-black rounded-[1px]
"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
