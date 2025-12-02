"use client";
import React from "react";

export default function Settings() {
  return (
    <div className="m-1.5">
      <div className="bg-white shadow border rounded ">
        {/* opacity-40 */}
        <div className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]
                        text-white h-[33px] flex items-center px-3.5">
          <h4 className="text-[20px] font-bold font-roboto bottom-0.5">Update Stake</h4>
        </div>
        <div className="px-1 py-4">
          <div className="mb-1 pl-1">
            <p className="text-[14px] -ml-0.5">
              <b className="text-[16px]">Stake Amount</b>
            </p>
          </div>
          <div className="grid grid-cols-4 gap-x-2 gap-y-2 w-full md:w-1/2 pl-1">
            {[...Array(8)].map((_, i) => (
              <input
                key={i}
                type="text"
                placeholder="1000"
                maxLength={9}
                className="w-full border rounded text-center h-[38px] text-[16px]"
              />
            ))}
          </div>
          <div className="mt-3 pl-1">
            <button
              className="w-full md:w-1/4 h-[38px] text-[16px] 
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
