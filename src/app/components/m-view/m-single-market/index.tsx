"use client";
import React from "react";
import { useRouter } from "next/navigation";

const MSingleMarket = () => {
     const router = useRouter();

     const markets = [
          {
               match: "India v South Africa",
               time: "23/11/2025 04:00 AM",
               inplay: true,
               odds: [
                    { back: 1.37, lay: 980 },
                    { back: 0, lay: 0 },
                    { back: 1.88, lay: 970 },
               ],
          },
          {
               match: "India v South Africa",
               time: "23/11/2025 04:00 AM",
               inplay: true,
               odds: [
                    { back: 1.37, lay: 980 },
                    { back: 0, lay: 0 },
                    { back: 1.88, lay: 970 },
               ],
          },
          {
               match: "India v South Africa",
               time: "23/11/2025 04:00 AM",
               inplay: true,
               odds: [
                    { back: 1.37, lay: 980 },
                    { back: 0, lay: 0 },
                    { back: 1.88, lay: 970 },
               ],
          },
          {
               match: "India v South Africa",
               time: "23/11/2025 04:00 AM",
               inplay: true,
               odds: [
                    { back: 1.37, lay: 980 },
                    { back: 0, lay: 0 },
                    { back: 1.88, lay: 970 },
               ],
          },
          {
               match: "India v Australia",
               time: "25/11/2025 07:00 PM",
               inplay: true,
               odds: [
                    { back: 1.55, lay: 900 },
                    { back: 0, lay: 0 },
                    { back: 2.10, lay: 950 },
               ],
          },
          {
               match: "England v Pakistan",
               time: "01/12/2025 03:00 PM",
               inplay: false,
               odds: [
                    { back: 1.90, lay: 800 },
                    { back: 0, lay: 0 },
                    { back: 2.40, lay: 780 },
               ],
          },
     ];

     return (
          <div className="overflow-y-auto max-h-[265px]">

               {markets.length > 0 ? (
                    markets.map((item, idx) => (
                         <div
                              key={idx}
                              onClick={() => router.push("/market-details")}
                              className="text-black block no-underline cursor-pointer hover:bg-[#e5eef3]"
                         >
                              <div className="bg-[#f1f5f8] border-b border-[#d6d8d7] px-3 py-1">

                                   {/* Header */}
                                   <div className="flex items-center">
                                        <div className="w-2/3 flex flex-col">
                                             <p className="mb-0 text-[13px] font-bold leading-tight">{item.match}</p>
                                             <p className="mb-0 text-[12px] leading-tight mt-[3px]">{item.time}</p>
                                        </div>

                                        <div className="w-1/3 text-right">
                                             {item.inplay && (
                                                  <span className="inline-block">
                                                       <span className="inplay-animation font-bold text-[12px] mr-1 align-top relative top-[-5px]">
                                                            INPLAY
                                                       </span>
                                                  </span>
                                             )}
                                        </div>
                                   </div>

                                   {/* Labels Row */}
                                   <div className="flex mt-0.5">
                                        <div className="w-1/3 text-center text-[12px] font-semibold">1</div>
                                        <div className="w-1/3 text-center text-[12px] font-semibold">X</div>
                                        <div className="w-1/3 text-center text-[12px] font-semibold">2</div>
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
                    ))
               ) : (
                    <div className="text-center bg-[#ccc] pt-2 pb-[9px] px-[15px] mb-[25px] text-[12px] text-[#21252a]">
                         No Real time record is available
                    </div>
               )}

          </div>
     );
};

export default MSingleMarket;
