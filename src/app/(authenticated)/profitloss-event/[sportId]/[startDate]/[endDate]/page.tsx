"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";

interface EventItem {
    pl: number;
    commission: number;
    eventType: {
        id: string;
        name: string;
    };
    event: {
        id: string;
        name: string;
    };
}

interface ApiResponse {
    data: EventItem[];
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

export default function ProfitLossEvent() {
    const router = useRouter();
    const params = useParams();
    const sportId = params?.sportId as string;
    const startDateParam = params?.startDate as string;
    const endDateParam = params?.endDate as string;

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
    const [profitLossEventData, setProfitLossEventData] = useState<EventItem[]>([]);

    // Parse dates from URL params on component mount
    useEffect(() => {
        if (startDateParam && endDateParam) {
            try {
                const decodedStartDate = decodeURIComponent(startDateParam);
                const decodedEndDate = decodeURIComponent(endDateParam);
                
                setStartDate(new Date(decodedStartDate));
                setEndDate(new Date(decodedEndDate));
            } catch (error) {
                console.error("Error parsing dates from URL:", error);
                const today = new Date();
                const tenDaysAgo = new Date(today);
                tenDaysAgo.setDate(today.getDate() - 10);
                setStartDate(tenDaysAgo);
                setEndDate(today);
            }
        } else {
            const today = new Date();
            const tenDaysAgo = new Date(today);
            tenDaysAgo.setDate(today.getDate() - 10);
            setStartDate(tenDaysAgo);
            setEndDate(today);
        }
    }, [startDateParam, endDateParam]);

    useEffect(() => {
        if (startDate && endDate && sportId) {
            fetchProfitLossEventData();
            setMounted(true);
        }
    }, [startDate, endDate, sportId]);

    // Pagination fetch
    useEffect(() => {
        if (startDate && endDate && sportId && mounted) {
            fetchProfitLossEventData();
        }
    }, [currentPage]);

    const fetchProfitLossEventData = async () => {
        if (!startDate || !endDate || !sportId) {
            return;
        }

        const payload = {
            page: currentPage,
            limit: limit,
            eventTypeId: sportId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            key: CONFIG.siteKey,
        };

        console.log("Fetching with payload:", payload);

        try {
            const result = await fetchData({
                url: CONFIG.profitLossEvents,
                payload: payload,
                setFn: (data: any) => {
                    console.log("Received data:", data);
                    if (data && data.data) {
                        setProfitLossEventData(data.data);
                        setTotalRecords(data.total || 0);
                    } else if (Array.isArray(data)) {
                        setProfitLossEventData(data);
                        setTotalRecords(data.length);
                    }
                },
            });
        } catch (error) {
            console.error("Error fetching profit/loss event data:", error);
        }
    };

    const goToFirst = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    };

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

    // Calculate total P&L
    const calculateTotalPL = (pl: number, commission: number) => {
        return pl - commission;
    };

    // Handle event name click - navigate to profitloss-market with event ID, sportId, and dates
    const handleEventClick = (eventId: string) => {
        if (!startDate || !endDate) return;

        // Encode dates for URL
        const startDateISO = encodeURIComponent(startDate.toISOString());
        const endDateISO = encodeURIComponent(endDate.toISOString());

        // Navigate with sportId, eventId, and date range
        router.push(`/profitloss-market/${sportId}/${eventId}/${startDateISO}/${endDateISO}`);
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
                                    {profitLossEventData && profitLossEventData.length > 0 ? (
                                        profitLossEventData.map((item, index) => (
                                            <tr key={item.event?.id || index}>
                                                <td className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-black border-black/12.5 md:text-base whitespace-nowrap">
                                                    {item.eventType?.name || "N/A"}
                                                </td>
                                                <td 
                                                    className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-[#0D6EFD] border-black/12.5 md:text-base whitespace-nowrap cursor-pointer hover:underline"
                                                    onClick={() => item.event?.id && handleEventClick(item.event.id)}
                                                >
                                                    {item.event?.name || "N/A"}
                                                </td>
                                                <td className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-black border-black/12.5 md:text-base whitespace-nowrap">
                                                    <span className={getProfitLossClass(item.pl)}>
                                                        {formatCurrency(item.pl)}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-black border-black/12.5 md:text-base whitespace-nowrap">
                                                    <span className="font-bold">
                                                        {formatCurrency(item.commission)}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-1.5 md:px-3 md:p-[9px] text-center border text-black border-black/12.5 md:text-base whitespace-nowrap">
                                                    <span className={getProfitLossClass(calculateTotalPL(item.pl, item.commission))}>
                                                        {formatCurrency(calculateTotalPL(item.pl, item.commission))}
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
                            className="px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer"
                            onClick={goToNext}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                        <button
                            className="px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer"
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
                                className="px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer"
                                onClick={goToNext}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                            <button
                                className="px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer"
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