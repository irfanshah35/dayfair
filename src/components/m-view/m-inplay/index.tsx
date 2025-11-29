"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { markets } from "@/lib/projectData";

const MInplay = () => {
  const router = useRouter();

  return (
    <div className="overflow-y-auto no-scrollbar max-h-[265px] ">
      {markets.map((item, idx) => (
        <div
          key={idx}
          onClick={() => router.push("/market-details")}
          className="text-black block no-underline cursor-pointer hover:bg-[#e5eef3]"
        >
          <div className="bg-[#f1f5f8] border-b border-[#d6d8d7] px-3 pt-[5px] pb-[3px]">
            {/* Header */}
            <div className="flex items-center">
              <div className="w-2/3 flex flex-col">
                <p className="mb-0 text-[13px] font-bold leading-tight">
                  {item.match}
                </p>
                <p className="mb-0 text-[12px] leading-tight mt-[2.5px]">
                  {item.time}
                </p>
              </div>

              <div className="w-1/3 text-right  ">
                {item.inplay && (
                  <span className="inline-block">
                    <span className="inplay-animation font-bold text-[12px] mr-1 align-top relative right-px top-[-5px]">
                      INPLAY
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Labels Row */}
            <div className="flex mt-0.5">
              <div className="w-1/3 text-center text-[12px] font-semibold">
                1
              </div>
              <div className="w-1/3 text-center text-[12px] font-semibold">
                X
              </div>
              <div className="w-1/3 text-center text-[12px] font-semibold">
                2
              </div>
            </div>

            {/* Odds Row */}
            <div className="flex">
              {item.odds.map((o, i) => (
                <div key={i} className="w-1/3 flex justify-center">
                  <button className="btn-back">{o.back}</button>
                  <button className="btn-lay">{o.lay}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MInplay;
