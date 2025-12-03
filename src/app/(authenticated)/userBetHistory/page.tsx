"use client";
import { useState } from "react";

export default function UserBetHistory() {
    const [limit] = useState(25);

    const betData = [
        {
            id: "410319177502",
            type: "back", // Blue
            eventName: "Cricket - Otago Volts V Canterbury Kings",
            marketName: "Tied Match",
            runner: "Yes",
            placeDate: "2025-11-27 1:04:10 PM",
            matchedDate: "2025-11-27 1:04:15 PM",
            userPrice: "1.01 / 24.77",
            amount: "5",
            pl: "-5.00",
            plSecondary: "(5.00)",
            isPlNegative: true,
        },
        {
            id: "410264698502",
            type: "lay", // Pink
            eventName: "Cricket - Otago Volts V Canterbury Kings",
            marketName: "Tied Match",
            runner: "No",
            placeDate: "2025-11-26 10:14:29 PM",
            matchedDate: "2025-11-26 10:14:29 PM",
            userPrice: "1.02",
            amount: "9.9",
            pl: "-0.20",
            plSecondary: "(0.00)",
            isPlNegative: true,
        },
        {
            id: "410264687227",
            type: "back", // Blue
            eventName: "Cricket - Otago Volts V Canterbury Kings",
            marketName: "Tied Match",
            runner: "No",
            placeDate: "2025-11-26 10:14:22 PM",
            matchedDate: "2025-11-26 10:14:22 PM",
            userPrice: "1.01",
            amount: "10",
            pl: "0.10",
            plSecondary: "(10.00)",
            isPlNegative: false,
        },
    ];

    return (
        <div className="md:mx-[5px] md:my-[6px]">
            <div className="relative flex flex-col min-w-0 wrap-break-word bg-white md:border border-black/12.5 rounded">
                {/* Card Header */}
                <div className="px-4 py-1 md:py-0 h-[37.8px] md:rounded-t-sm bg-black/3 border-b btn-clr border-black/12.5 flex items-center bg-gray-600">
                    <h4 className="mb-0 text-[16.5px] md:text-[24px] text-white font-bold">
                        Profit Loss Markets
                    </h4>
                </div>

                {/* Card Body */}
                <div className="px-[8px] py-[10px] pb-2.5 md:py-[16px] text-base">

                    {/* Top Buttons (Back, Lay, Void) */}
                    <div className="flex justify-end gap-[3px]">
                        <button className="bg-[#A7DAFD] border text-black p-[5px] transition-colors shadow-sm h-[36px] w-[47.14px] cursor-pointer">
                            Back
                        </button>
                        <button className="bg-[#F9C9D4] border text-black p-[5px] transition-colors shadow-sm h-[36px] w-[36.78px] cursor-pointer">
                            Lay
                        </button>
                        <button className="bg-white border text-black p-[5px] transition-colors shadow-sm h-[36px] w-[43.88px] cursor-pointer">
                            Void
                        </button>
                    </div>

                    {/* Cards Container */}
                    <div className="flex flex-wrap -mx-[5px] mt-3">
                        {betData.map((bet, index) => {
                            // Logic for Background Color inside map
                            const cardBg = bet.type === "back" ? "bg-[#A3D9FC]" : "bg-[#FBC0CB]";

                            return (
                                <div key={index} className="w-full md:w-1/2 px-[8px] mb-3 ">
                                    <div className={`${cardBg} p-3 rounded-[12px] text-[14px] leading-[21px] font-sans h-full shadow-[0_0_12px_-2px_#696969]`}>

                                        {/* Top Row: Event Name vs Stats */}
                                        <div className="grid grid-cols-12 mb-2">
                                            {/* Event Name */}
                                            <div className="col-span-6 pr-[9px]">
                                                <div className="font-bold text-gray-900 w-full  leading-tight w-full text-[]">
                                                    {bet.eventName}
                                                </div>

                                                <div className="flex flex-col gap-[2px]  text-gray-900">
                                                    <div className="">
                                                        <strong>Market Name:</strong> {'  '} {bet.marketName}
                                                    </div>
                                                    <div className="">
                                                        <strong>Runner:</strong> {'  '} {bet.runner}
                                                    </div>
                                                    <div className="">
                                                        <strong className="whitespace-nowrap">Place Date:</strong> {'  '} {bet.placeDate}
                                                    </div>
                                                    <div className="">
                                                        <strong>Matched Date:</strong> {'  '} {bet.matchedDate}
                                                    </div>
                                                    <div className="">
                                                        <strong>Bet ID:</strong> {'  '} {bet.id}
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="flex flex-col col-span-2">
                                                <span className="font-bold text-gray-800">User Price</span>
                                                <span className="text-gray-900 font-medium">{bet.userPrice}</span>
                                            </div>
                                            <div className="flex flex-col col-span-2">
                                                <span className="font-bold text-gray-800 ">Amount</span>
                                                <span className="text-gray-900 font-medium">{bet.amount}</span>
                                            </div>
                                            <div className="flex flex-col col-span-2">
                                                <span className="font-bold text-gray-800 ">P&L</span>
                                                <span className={`text-sm ${bet.isPlNegative ? "text-red-600" : "text-green-700"}`}>
                                                    {bet.pl}
                                                </span>
                                                {bet.plSecondary && (
                                                    <span className={`${bet.isPlNegative ? "text-green-700" : "text-gray-600"}`}>
                                                        {bet.plSecondary}
                                                    </span>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}