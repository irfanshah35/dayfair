"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";

// Lazy load the loading component
const Loading = dynamic(() => import("../../../../loading"));

interface EventType {
    id: string;
    name: string;
}

interface Event {
    id: string;
    name: string;
}

interface BetItem {
    eventType: EventType;
    event: Event;
    marketId: string;
    selectionName: string;
    bidType: string;
    betId: string;
    placeDate: string;
    averagePrice: number;
    matchedDate: string;
    settledDate: string;
    requestedPrice: number;
    totalSizeMatched: number;
    liability: number;
    profitLoss: number;
    lapsedDate: string | null;
    totalSizeLapsed: number;
}

interface ApiResponse {
    data: BetItem[];
    total: number;
    currentPage: number;
    totalPages: number;
    perPage: number;
    nextPage: number;
    prevPage: number;
    meta: {
        message: string;
        status_code: number;
        status: boolean;
    };
}

export default function UserBetHistory() {
    const params = useParams();
    const sportId = params?.sportId as string;
    const marketId = params?.marketId as string;

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(25);
    const [betData, setBetData] = useState<BetItem[]>([]);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (marketId) {
            fetchBetHistoryData();
            setMounted(true);
        }
    }, [marketId]);

    // Pagination fetch
    useEffect(() => {
        if (marketId && mounted) {
            fetchBetHistoryData();
        }
    }, [currentPage]);

    const fetchBetHistoryData = async () => {
        if (!marketId) {
            return;
        }

        setIsLoading(true);
        const payload = {
            page: currentPage,
            limit: limit,
            marketId: marketId,
            key: CONFIG.siteKey,
        };

        console.log("Fetching with payload:", payload);

        try {
            const result = await fetchData({
                url: CONFIG.profitLossHistory,
                payload: payload,
                setFn: (data: any) => {
                    console.log("Received data:", data);
                    if (data && data.data) {
                        setBetData(data.data);
                    } else if (Array.isArray(data)) {
                        setBetData(data);
                    }
                    setIsLoading(false);
                },
            });
        } catch (error) {
            console.error("Error fetching bet history data:", error);
            setIsLoading(false);
        }
    };

    const formatDateTime = (dateStr: string): string => {
        try {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
        } catch (error) {
            return dateStr;
        }
    };

    const formatPrice = (requested: number, average: number): string => {
        if (requested === average) {
            return requested.toFixed(2);
        }
        return `${requested.toFixed(2)} / ${average.toFixed(2)}`;
    };

    const formatAmount = (amount: number): string => {
        // Remove trailing zeros
        const formatted = amount.toFixed(2);
        if (formatted.endsWith('.00')) {
            return amount.toString();
        }
        return formatted.replace(/\.?0+$/, '');
    };

    const calculatePL = (bet: BetItem) => {
        const pl = bet.profitLoss;
        const liability = bet.liability;
        
        const primary = pl.toFixed(2);
        const secondary = liability > 0 ? `(${liability.toFixed(2)})` : null;
        
        return {
            primary,
            secondary,
            isNegative: pl < 0
        };
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="md:mx-1.25 md:my-1.5">
            <div className="relative flex flex-col min-w-0 wrap-break-word bg-white md:border border-black/12.5 rounded">
                {/* Card Header */}
                <div className="px-4 py-1 md:py-0 h-[37.8px] md:rounded-t-sm bg-black/3 border-b btn-clr border-black/12.5 flex items-center">
                    <h4 className="mb-0 text-[16.5px] md:text-[24px] text-white font-bold">
                        Profit Loss Markets
                    </h4>
                </div>

                {/* Card Body */}
                <div className="px-2 py-2.5 pb-2.5 md:py-4 text-base">

                    {/* Top Buttons (Back, Lay, Void) */}
                    <div className="flex justify-end gap-0.75">
                        <button className="bg-[#A7DAFD] border text-black p-1.25 transition-colors shadow-sm h-9 w-[47.14px] cursor-pointer">
                            Back
                        </button>
                        <button className="bg-[#F9C9D4] border text-black p-1.25 transition-colors shadow-sm h-9 w-[36.78px] cursor-pointer">
                            Lay
                        </button>
                        <button className="bg-white border text-black p-1.25 transition-colors shadow-sm h-9 w-[43.88px] cursor-pointer">
                            Void
                        </button>
                    </div>

                    {/* Cards Container */}
                    <div className="flex flex-wrap -mx-1.25 mt-3">
                        {betData.map((bet, index) => {
                            // Logic for Background Color inside map
                            const cardBg = bet.bidType === "BACK" ? "bg-[#A3D9FC]" : "bg-[#FBC0CB]";
                            const plCalc = calculatePL(bet);

                            return (
                                <div key={index} className="w-full md:w-1/2 px-2 mb-3 ">
                                    <div className={`${cardBg} p-3 rounded-xl text-[14px] leading-5.25 font-sans h-full shadow-[0_0_12px_-2px_#696969]`}>

                                        {/* Top Row: Event Name vs Stats */}
                                        <div className="grid grid-cols-12 mb-2">
                                            {/* Event Name */}
                                            <div className="col-span-6 pr-2.25">
                                                <div className="font-bold text-gray-900 w-full  leading-tight text-[]">
                                                    {bet.eventType?.name} - {bet.event?.name}
                                                </div>

                                                <div className="flex flex-col gap-0.5  text-gray-900">
                                                    <div className="">
                                                        <strong>Market Name:</strong> {'  '} {bet.marketId}
                                                    </div>
                                                    <div className="">
                                                        <strong>Runner:</strong> {'  '} {bet.selectionName}
                                                    </div>
                                                    <div className="">
                                                        <strong className="whitespace-nowrap">Place Date:</strong> {'  '} {formatDateTime(bet.placeDate)}
                                                    </div>
                                                    <div className="">
                                                        <strong>Matched Date:</strong> {'  '} {formatDateTime(bet.matchedDate)}
                                                    </div>
                                                    <div className="">
                                                        <strong>Bet ID:</strong> {'  '} {bet.betId}
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="flex flex-col col-span-2">
                                                <span className="font-bold text-gray-800">User Price</span>
                                                <span className="text-gray-900 font-medium">
                                                    {formatPrice(bet.requestedPrice, bet.averagePrice)}
                                                </span>
                                            </div>
                                            <div className="flex flex-col col-span-2">
                                                <span className="font-bold text-gray-800 ">Amount</span>
                                                <span className="text-gray-900 font-medium">
                                                    {formatAmount(bet.totalSizeMatched)}
                                                </span>
                                            </div>
                                            <div className="flex flex-col col-span-2">
                                                <span className="font-bold text-gray-800 ">P&L</span>
                                                <span className={`text-sm ${plCalc.isNegative ? "text-red-600" : "text-green-700"}`}>
                                                    {plCalc.primary}
                                                </span>
                                                {plCalc.secondary && (
                                                    <span className={`${plCalc.isNegative ? "text-green-700" : "text-gray-600"}`}>
                                                        {plCalc.secondary}
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