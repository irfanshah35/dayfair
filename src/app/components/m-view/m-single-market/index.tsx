"use client";
import React from "react";

const MSingleMarket = () => {
     return (
          <div className="overflow-y-auto" id="gameContainer">
               <div
                    className="text-black firstElement block no-underline cursor-pointer"
                    id="market0"
               >
                    <div className="bg-[#f1f5f8] border-b border-[#d6d8d7] px-3 py-1">
                         <div className="flex items-center">
                              <div className="w-2/3 flex flex-col">
                                   <p className="mb-0 text-[13px] font-bold leading-tight">
                                        New South Wales Blues v Tasmania Tigers
                                   </p>
                                   <p className="mb-0 text-[12px] leading-tight">
                                        23/11/2025 04:00 AM
                                   </p>
                              </div>
                              <div className="w-1/3 text-right">
                                   <span className="inline-block">
                                        <span className="inplay-animation font-bold text-[12px] mr-1 align-top">
                                             INPLAY
                                        </span>
                                   </span>
                              </div>
                         </div>
                         <div className="flex mt-1">
                              <div className="w-1/3 text-center font-bold">1</div>
                              <div className="w-1/3 text-center font-bold">X</div>
                              <div className="w-1/3 text-center font-bold">2</div>
                         </div>
                         <div className="flex mt-1">
                              <div className="w-1/3 flex justify-center">
                                   <button className="btn-back">1.37</button>
                                   <button className="btn-lay">980</button>
                              </div>
                              <div className="w-1/3 flex justify-center">
                                   <button className="btn-back">0</button>
                                   <button className="btn-lay">0</button>
                              </div>
                              <div className="w-1/3 flex justify-center">
                                   <button className="btn-back">1.88</button>
                                   <button className="btn-lay">970</button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default MSingleMarket;
