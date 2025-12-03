"use client";
import { useState, useEffect } from "react";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";

interface ProfitLossItem {
    id: string;
    sportName: string;
    eventName: string;
    profitLoss: number;
    commission: number;
    totalPL: number;
    eventDate?: string;
}

interface ApiResponse {
    data: ProfitLossItem[];
    total: number;
    currentPage: number;
    meta: {
        message: string;
        status_code: number;
        status: boolean;
    };
}

export default function ProfitLossEvent() {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(25);
    const [totalRecords, setTotalRecords] = useState(0);
    const [jumptoPage, setJumptoPage] = useState<number | string>("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = totalRecords > 0 ? (currentPage - 1) * limit + 1 : 0;
    const endIndex = Math.min(currentPage * limit, totalRecords);
    const [mounted, setMounted] = useState(false);

    const sampleProfitLossData: ProfitLossItem[] = [
        { id: "1", sportName: "Cricket", eventName: "IND vs AUS - 1st ODI", profitLoss: 1500.50, commission: 150.05, totalPL: 1350.45 },
        { id: "2", sportName: "Football", eventName: "Manchester United vs Chelsea", profitLoss: -500.75, commission: 0, totalPL: -500.75 },
        { id: "3", sportName: "Tennis", eventName: "Wimbledon Final", profitLoss: 2500.00, commission: 250.00, totalPL: 2250.00 },
        { id: "4", sportName: "Basketball", eventName: "NBA: Lakers vs Celtics", profitLoss: 800.25, commission: 80.03, totalPL: 720.22 },
        { id: "5", sportName: "Cricket", eventName: "IPL: MI vs CSK", profitLoss: -1200.00, commission: 0, totalPL: -1200.00 },
        { id: "6", sportName: "Football", eventName: "UEFA Champions League Final", profitLoss: 3000.00, commission: 300.00, totalPL: 2700.00 },
        { id: "7", sportName: "Cricket", eventName: "PAK vs ENG - Test Match", profitLoss: 1750.80, commission: 175.08, totalPL: 1575.72 },
        { id: "8", sportName: "Tennis", eventName: "US Open Semi-Final", profitLoss: 950.40, commission: 95.04, totalPL: 855.36 },
        { id: "9", sportName: "Football", eventName: "La Liga: Barcelona vs Real Madrid", profitLoss: -750.30, commission: 0, totalPL: -750.30 },
        { id: "10", sportName: "Basketball", eventName: "NBA Finals Game 7", profitLoss: 2200.00, commission: 220.00, totalPL: 1980.00 },
        { id: "11", sportName: "Cricket", eventName: "T20 World Cup Final", profitLoss: 4200.50, commission: 420.05, totalPL: 3780.45 },
        { id: "12", sportName: "Football", eventName: "Premier League: Arsenal vs Liverpool", profitLoss: 1250.75, commission: 125.08, totalPL: 1125.67 },
        { id: "13", sportName: "Tennis", eventName: "Australian Open Quarter Final", profitLoss: -300.25, commission: 0, totalPL: -300.25 },
        { id: "14", sportName: "Cricket", eventName: "Bangladesh vs Sri Lanka ODI", profitLoss: 680.90, commission: 68.09, totalPL: 612.81 },
        { id: "15", sportName: "Football", eventName: "Serie A: Juventus vs AC Milan", profitLoss: 1550.00, commission: 155.00, totalPL: 1395.00 },
    ];
    // const [profitLossData, setProfitLossData] = useState<ProfitLossItem[]>([]);

    const [profitLossData, setProfitLossData] = useState<ProfitLossItem[]>(sampleProfitLossData);

    useEffect(() => {
        const today = new Date();
        const tenDaysAgo = new Date(today);
        tenDaysAgo.setDate(today.getDate() - 10);

        setStartDate(tenDaysAgo);
        setEndDate(today);
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            fetchProfitLossData();
            setMounted(true);
        }
    }, [startDate, endDate]);

    const fetchProfitLossData = async () => {
        if (!startDate || !endDate) {
            return;
        }

        const payload = {
            page: currentPage,
            limit: limit,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            key: CONFIG.siteKey,
        };

        try {
            await fetchData({
                url: CONFIG.profitLoss, // You need to add this to your CONFIG
                payload: payload,
                setFn: setProfitLossData,
            });
        } catch (error) {
            console.error("Error fetching profit/loss data:", error);
        }
    };

    const submitData = () => {
        setCurrentPage(1);
        if (startDate && endDate) {
            fetchProfitLossData();
        }
    };

    const goToFirst = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    };

    // Pagination fetch
    useEffect(() => {
        if (startDate && endDate) {
            fetchProfitLossData();
        }
    }, [currentPage]);

    const goToPrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToLast = () => {
        if (currentPage !== totalPages) {
            setCurrentPage(totalPages);
        }
    };

    const jumpPage = () => {
        const page = Number(jumptoPage);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const getProfitLossClass = (amount: number): string => {
        if (amount > 0) return "font-bold text-[#198754]";
        if (amount < 0) return "font-bold text-[#DC3545]";
        return "font-bold text-gray-600";
    };

    return (
        <div className="md:mx-[5px] md:my-[6px]">
            <div className="relative flex flex-col min-w-0 wrap-break-word bg-white md:border border-black/12.5 rounded">
                {/* Card Header */}
                <div className="px-4 py-1 md:py-0 h-[37.8px] md:rounded-t-sm bg-black/3 border-b btn-clr border-black/12.5 flex items-center">
                    <h4 className="mb-0 text-[16.5px] md:text-[24px] text-white! md:text-[24px]">
                        Profit Loss Event
                    </h4>
                </div>

                {/* Card Body */}
                <div className="p-[5px] pb-2.5 pt-2.5 text-base">
                    <div className="flex flex-wrap -mx-[5px] mt-3">
                        <div className="w-full px-[5px] mr-[16px] overflow-x-auto">
                            <table className="w-full border-collapse border border-black/12.5">
                                <thead>
                                    <tr>
                                        <th className="py-0.5 px-[6px] whitespace-nowrap md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-x border-black/12.5 text-sm md:text-base">
                                            Sport Name
                                        </th>
                                        <th className="py-0.5 px-[6px] whitespace-nowrap md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-x border-black/12.5 text-sm md:text-base">
                                            Event Name
                                        </th>
                                        <th className="py-0.5 px-[6px] whitespace-nowrap md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-x border-black/12.5 text-sm md:text-base">
                                            Profit/Loss
                                        </th>
                                        <th className="py-0.5 px-[6px] whitespace-nowrap md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-x border-black/12.5 text-sm md:text-base">
                                            Commission
                                        </th>
                                        <th className="py-0.5 px-[6px] whitespace-nowrap md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-x border-black/12.5 text-sm md:text-base">
                                            Total P&L
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {profitLossData && profitLossData.length > 0 ? (
                                        profitLossData.map((item, index) => (
                                            <tr key={item.id || index}>
                                                <td className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-black border-black/12.5 md:text-base whitespace-nowrap">
                                                    {item.sportName || "N/A"}
                                                </td>
                                                <td className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-[#0D6EFD] border-black/12.5 md:text-base whitespace-nowrap">
                                                    {item.eventName || "N/A"}
                                                </td>
                                                <td className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-black border-black/12.5 md:text-base whitespace-nowrap">
                                                    <span className={getProfitLossClass(item.profitLoss)}>
                                                        {formatCurrency(item.profitLoss)}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-black border-black/12.5 md:text-base whitespace-nowrap">
                                                    <span className="font-bold">
                                                        {formatCurrency(item.commission)}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-black border-black/12.5 md:text-base whitespace-nowrap">
                                                    <span className={getProfitLossClass(item.totalPL)}>
                                                        {formatCurrency(item.totalPL)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-2 py-1.5 md:px-3 md:py-[9px] text-center border text-black border-black/12.5 bg-transparent text-xs md:text-base"
                                            >
                                                No data available in table
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Pagination */}
                    <div className="flex md:hidden justify-between items-center gap-2 mt-2">
                        <button
                            className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === 1
                                    ? "opacity-40 pointer-events-none"
                                    : "hover:bg-[#f1f1f1]"
                                }`}
                            onClick={goToFirst}
                            disabled={currentPage === 1}
                        >
                            First
                        </button>
                        <button
                            className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === 1
                                    ? "opacity-40 pointer-events-none"
                                    : "hover:bg-[#f1f1f1]"
                                }`}
                            onClick={goToPrevious}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <span className="inline-flex items-center justify-center min-w-8 px-2.5 py-1 rounded-2xl font-bold text-black bg-linear-to-b from-[#f4b501] to-[#f68700]">
                            {currentPage}
                        </span>

                        <button
                            className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer `}
                            onClick={goToNext}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                        <button
                            className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer `}
                            onClick={goToLast}
                            disabled={currentPage === totalPages}
                        >
                            Last
                        </button>
                    </div>

                    {/* Desktop Pagination */}
                    <div className="flex md:flex-row justify-between items-center mt-3 gap-2 md:gap-3 text-[16px]">
                        {/* Left: Showing text */}
                        <div className="text-xs text-[#212529] md:text-[16px]">
                            <span>
                                Showing {startIndex} to {endIndex} of {totalRecords} entries
                            </span>
                        </div>

                        {/* Center */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === 1
                                        ? "opacity-40 pointer-events-none"
                                        : "hover:bg-[#f1f1f1]"
                                    }`}
                                onClick={goToFirst}
                                disabled={currentPage === 1}
                            >
                                First
                            </button>
                            <button
                                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === 1
                                        ? "opacity-40 pointer-events-none"
                                        : "hover:bg-[#f1f1f1]"
                                    }`}
                                onClick={goToPrevious}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            <span className="inline-flex items-center justify-center min-w-8 px-2.5 py-1 rounded-2xl font-bold text-black bg-linear-to-b from-[#f4b501] to-[#f68700]">
                                {currentPage}
                            </span>

                            <button
                                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer`}
                                onClick={goToNext}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                            <button
                                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer `}
                                onClick={goToLast}
                                disabled={currentPage === totalPages}
                            >
                                Last
                            </button>
                        </div>

                        {/* Jump to page */}
                        <div className="flex items-center gap-2 text-xs md:text-[16px]">
                            <span className="whitespace-nowrap text-black mr-1">
                                Jump to page
                            </span>
                            <input
                                className="w-[90px] h-[38px] px-2 py-1 text-sm border border-[#dee2e6] rounded"
                                type="number"
                                min="1"
                                max={totalPages}
                                value={jumptoPage}
                                onChange={(e) => setJumptoPage(e.target.value)}
                            />
                            <button
                                className="flex justify-center items-center w-[43.13px] h-7 rounded-xl font-bold text-black heading-clr border border-black cursor-pointer hover:opacity-90"
                                onClick={jumpPage}
                            >
                                Go
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}