'use client'
import RulesModal from '@/app/modals/rules-modal';
import React, { useState } from 'react'

export default function DMarketDetailsPage() {
    const [isrulesopen, setRulesOpen] = useState(false);
    const amounts = [
        1000, 5000, 10000, 25000, 50000, 100000, 200000, 500000,
    ];
    return (
        <div>
            <div className="flex flex-col md:flex-row m-[5px]">
                {/* Left Section */}
                <div className="flex-1">
                    {/* Heading */}
                    <div className="flex justify-between items-center mb-[3px] px-2.5 h-8 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]">
                        <span className="font-semibold text-white">Sri Lanka v Zimbabwe</span>
                        <span className="heartbeat-anim">INPLAY</span>
                    </div>

                    {/* Game Time Box */}
                    <div
                        className=" p-0 mb-[3px] bg-cover "
                        style={{
                            backgroundImage:
                                "linear-gradient(0deg, #0000001a, #00000073), url('/market/market.jpg')",
                        }}
                    >
                        <div className="">
                            <div className="flex flex-col justify-between items-center px-3 pt-1.5 h-[100px]">
                                <div className="flex justify-between w-full">
                                    <div className=" text-white text-[12px] font-bold [text-shadow:#fc0_1px_0_10px]">
                                        OPEN
                                    </div>
                                    <div className=" text-white text-[12px] tracking-[-0.2px] font-bold [text-shadow:#fc0_1px_0_10px]">
                                        <span className=" text-[#ffff55]">Game time</span>{" "}
                                        23-11-2025 01:00:00 PM
                                    </div>
                                </div>
                                <div className="flex justify-center items-center flex-col [text-shadow:#fc0_1px_0_10px]">
                                    <span
                                        className={`relative -top-0.5 left-[5px] font-bold text-[12px]
                        heartbeat-anim2`}
                                    >
                                        Bet Started
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Title Row */}
                    <div className="flex justify-between mt-[3px] py-[3px] px-2 items-center bg-[linear-gradient(180deg,#000000,#000000_42%,#000000b3)]">
                        <h3 className="text-white text-sm font-semibold">1st Innings Runs Line</h3>
                        <button onClick={() => setRulesOpen(true)} className="text-white">
                            <svg
                                className="w-4 h-[15px] relative "
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Rates Header */}
                    <div className="hidden md:flex text-sm text-white h-[25px] border-b border-white">
                        <div className="flex w-[40%] text-[#0dcaf0] p-[5px]">
                            <b>Min: 5 Max: 10000</b>
                        </div>
                        <div className="w-[10%] flex justify-center items-center"></div>
                        <div className="w-[10%] flex justify-center items-center"></div>
                        <div className="w-[10%] flex justify-center items-center bg-[#4baca7] font-bold text-[16px]">NO</div>
                        <div className="w-[10%] flex justify-center items-center bg-[#50d0a3] font-bold text-[16px]">YES</div>
                        <div className="w-[20%] flex justify-center items-center text-black font-bold">Matched: 0</div>
                    </div>

                    {/* Rate Row */}
                    <div className=" text-sm bg-[#f2f2f2] font-bold">
                        <div className="flex justify-between h-[39px]">
                            <div className="flex w-[40%] p-[5px]">
                                <b>Total Runs</b>
                            </div>

                            <div className="text-center w-[10%] flex flex-col justify-center items-center border-l border-white">
                                <span className="block text-[16px] leading-none">0</span>
                                <span className="block text-[10px]">0</span>
                            </div>
                            <div className="text-center w-[10%] flex flex-col justify-center items-center border-l border-white">
                                <span className="block text-[16px] leading-none">133</span>
                                <span className="block text-[10px]">14.19</span>
                            </div>

                            <div className="text-center w-[10%] flex flex-col justify-center items-center text-white bg-[#4baca7] font-bold border-l border-white">
                                <span className="block text-[16px] leading-none">147</span>
                                <span className="block text-[10px]">223.59</span>
                            </div>

                            <div className="text-center w-[10%] flex flex-col justify-center items-center text-white bg-[#50d0a3] font-bold border-l border-white">
                                <span className="block text-[16px] leading-none">155</span>
                                <span className="block text-[10px]">223.03</span>
                            </div>
                            <div className="text-center w-[10%] flex flex-col justify-center items-center border-l border-white">
                                <span className="block text-[16px] leading-none">173</span>
                                <span className="block text-[10px]">27.95</span>
                            </div>
                            <div className="text-center w-[10%] flex flex-col justify-center items-center border-l border-white">
                                <span className="block text-[16px] leading-none">0</span>
                                <span className="block text-[10px]">0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-full md:w-80 mt-6 md:mt-0 md:ml-4">
                    <div className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] px-4 py-1 rounded-t mb-2.5 flex justify-between items-center border-b">
                        <h3 className="font-medium text-white">Live Match</h3>
                        <p className="text-white font-medium">
                            <i className="fas fa-tv"></i> live stream started
                        </p>
                    </div>

                    <div className='mb-2.5'>
                        <div className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] px-4 py-1 rounded-t border-b">
                            <h3 className="font-medium text-white">Place Bet</h3>
                        </div>

                        
                    </div>

                    <div className="rounded">
                        <div className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] px-4 py-1 rounded-t border-b">
                            <h3 className="font-medium text-white">Match Odds</h3>
                        </div>

                        <div className="border-x border-[#ebebeb] rounded-b">
                            <div className="flex items-center p-2 gap-2 border-b border-[#ebebeb]">
                                <span className="bg-[#dc3545] text-white px-2 py-1 rounded-full text-xs">
                                    <span className='relative top-px'>00</span>
                                </span>
                                <span className="text-black font-bold">Unmatched</span>
                            </div>

                            <hr className="h-1  text-[#dccceb]" />

                            <div className="flex items-center p-2 gap-2 mt-[3px] border-b border-[#ebebeb]">
                                <span className="bg-[#50d0ae] text-white px-2 py-1 rounded-full text-xs">
                                    <span className='relative top-px'>00</span>
                                </span>
                                <span className="text-black font-bold">Matched</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RulesModal open={isrulesopen} onClose={() => setRulesOpen(false)} />

            <style jsx>{`
        @keyframes zoomInZoomOut {
          0% {
            transform: scale(0.865);
            color: rgb(255, 252, 0);
          }
          50% {
            transform: scale(1.097);
            color: rgb(255, 56, 0);
          }
          100% {
            transform: scale(0.865);
            color: rgb(255, 252, 0);
          }
        }
        .heartbeat-anim {
          transition: 0.3s ease-in;
          animation: zoomInZoomOut 1s ease infinite;
          display: inline-block;
        }

        @keyframes sec {
          0% {
            transform: scale(0.865);
            color: rgb(255, 255, 255);
          }
          50% {
            transform: scale(1.097);
            color: rgb(255, 252, 0);
          }
          100% {
            transform: scale(0.865);
            color: rgb(255, 255, 255);
          }
        }

        .heartbeat-anim2 {
          transition: 0.3s ease-in;
          animation: sec 1s ease infinite;
          display: inline-block;
        }
      `}</style>
        </div>
    )
}
