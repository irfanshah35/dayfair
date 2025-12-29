"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import CustomCalendar from "../../../components/common/custom-calendar";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import dynamic from "next/dynamic";

const CustomCalendar = dynamic(() => import("../../../components/common/custom-calendar"), {
  loading: () => <></>,
  ssr: false,
});

interface StatementItem {
  pl: number;
  commission: number;
  eventType: {
    id: string;
    name: string;
  };
}

interface ApiResponse {
  data: StatementItem[];
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

export default function ProfitLoss() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalRecords);
  const [jumptoPage, setJumptoPage] = useState<number | string>("");

  // Date states
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [profitLossData, setProfitLossData] = useState<StatementItem[]>([]);



  useEffect(() => {
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);

    setStartDate(tenDaysAgo);
    setEndDate(today);
  }, []);

  const fetchProfitLoss = async () => {
    if (!startDate || !endDate) {
      return;
    }

    const payload = {
      page: currentPage,
      limit: pageSize,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      key: CONFIG.siteKey,
    };

    try {
      await fetchData({
        url: CONFIG.profitLoss,
        payload: payload,
        // setFn: setProfitLossData,
        setFn: (res) => {
          console.log("🔥 Profit & Loss API Response:", res);
          setProfitLossData(res);
        },
      });
    } catch (error) {
      console.error("Error fetching profit loss:", error);
    }
  };

  useEffect(() => {
    fetchProfitLoss();
    setMounted(true);
  }, [mounted]);

  const submitData = () => {
    setCurrentPage(1);
    if (startDate && endDate) {
      fetchProfitLoss();
    }
  };

  // Pagination fetch
  useEffect(() => {
    if (startDate && endDate) {
      fetchProfitLoss();
    }
  }, [currentPage]);

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

  const formatDateTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const calculateTotalPL = (pl: number, commission: number) => {
    return pl - commission;
  };

  const handleSportClick = (sportId: string) => {
    if (!startDate || !endDate) return;

    const formattedStartDate = new Date(startDate);
    formattedStartDate.setHours(0, 0, 0, 0);

    const formattedEndDate = new Date(endDate);
    formattedEndDate.setHours(23, 59, 0, 0);

    const startDateISO = encodeURIComponent(formattedStartDate.toISOString());
    const endDateISO = encodeURIComponent(formattedEndDate.toISOString());

    router.push(`/profitloss-event/${sportId}/${startDateISO}/${endDateISO}`);
  };

  return (
    <div className="md:mx-[5px] md:my-1.5 ">
      <div className="relative flex flex-col min-w-0 wrap-break-word bg-white md:border border-black/12.5 rounded-sm">
        {/* Card Header */}
        <div className="px-4 py-1 md:py-0 md:h-[37.8px] md:rounded-t-sm bg-black/3 border-b btn-clr border-black/12.5">
          <h4 className="mb-0 text-base text-white md:text-[24px]">Profit Loss</h4>
        </div>

        {/* Card Body */}
        <div className="p-[5px] pb-2.5 pt-2.5 text-base">
          {/* Filter Row */}
          <div className="flex flex-wrap items-end mt-[7px] -mx-[5px]">
            {/* Start Date */}
            <div className="w-full md:w-1/6 px-1.5  md:pr-[9px] mb-2 md:mb-0">
              <CustomCalendar
                selected={startDate}
                onChange={setStartDate}
                maxDate={new Date()}
                placeholderText="Select Date"
              />
            </div>

            {/* End Date */}
            <div className="w-full md:w-1/6 px-1.5 md:px-[9px] mb-1.5  md:mb-0">
              <CustomCalendar
                selected={endDate}
                onChange={setEndDate}
                startDate={startDate}
                selectsEnd={true}
                maxDate={new Date()}
                placeholderText="Select Date"
              />
            </div>

            {/* Submit Button */}
            <div className="w-full md:w-1/6 px-[5px] min-[992px]:px-[9px] max-[992px]:mt-[1px]">
              <button
                className=" w-full md:w-[76px] h-[38px] px-1.5 md:px-[9px] py-1.5 text-base font-normal text-black heading-clr  border border-black rounded cursor-pointer hover:opacity-90 bg-[#F4A500]"
                onClick={submitData}
              >
                Submit
              </button>
            </div>
          </div>

          <div className="flex flex-wrap -mx-[5px] mt-[11px]">
            <div className="w-full px-[5px] overflow-x-auto mr-4">
              <table className="w-full border-collapse border border-black/12.5">
                <thead>
                  <tr className="flex w-full md:h-[43px] max-[992px]:h-[26px]">
                    <th className="w-full min-[992px]:w-[309.03px] p-0.5 md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-r border-black/12.5 text-sm md:text-base">
                      Sport Name
                    </th>
                    <th className="w-full min-[992px]:w-[293.76px] p-0.5 md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-r border-black/12.5 text-sm md:text-base">
                      Profit/Loss
                    </th>
                    <th className="w-full min-[992px]:w-[321.85px] p-0.5 md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-r border-black/12.5 text-sm md:text-base">
                      Commission
                    </th>
                    <th className="w-full min-[992px]:w-[261.36px] p-0.5 md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-black/12.5 text-sm md:text-base">
                      Total P&L
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {profitLossData?.length > 0 ? (
                    profitLossData?.map((statement: StatementItem, index: number) => (
                      <tr key={index} className="flex w-full max-h-[43px]">
                        <td
                          className="w-full min-[992px]:w-[309.03px] cursor-pointer px-2 py-1.5 md:px-3 md:py-[9px] text-center border-r border-black/12.5 text-xs md:text-base text-[rgb(13,110,253)] hover:text-[rgb(10,88,202)] hover:underline"
                          onClick={() => handleSportClick(statement.eventType.id)}
                        >
                          {statement.eventType.name}
                        </td>

                        <td
                          className={`w-full min-[992px]:w-[293.76px] px-2 py-1.5 md:px-3 md:py-[9px] text-center border-r border-black/12.5 text-xs md:text-base
              ${statement.pl < 0 ? 'text-red-500' : 'text-green-500'}
            `}
                        >
                          {statement.pl.toFixed(2)}
                        </td>

                        <td className="w-full min-[992px]:w-[321.85px] px-2 py-1.5 md:px-3 md:py-[9px] text-center border-r text-black border-black/12.5 text-xs md:text-base">
                          <span className="text-black">{statement.commission.toFixed(2)}</span>
                        </td>

                        <td className="w-full min-[992px]:w-[261.36px] px-2 py-1.5 md:px-3 md:py-[9px] text-center border-black/12.5 text-xs md:text-base">
                          <span
                            className={`font-bold ${calculateTotalPL(statement.pl, statement.commission) < 0
                              ? 'text-red-500'
                              : 'text-green-500'
                              }`}
                          >
                            {calculateTotalPL(statement.pl, statement.commission).toFixed(2)}
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

          <div className="flex justify-between md:justify-center items-center gap-2 mt-1.5 md:text-[12px] text-black md:hidden">
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

            <span className="inline-flex items-center justify-center min-w-8 px-2.5 py-1 rounded-full font-bold text-black bg-linear-to-b from-[#f4b501] to-[#f68700]">
              {currentPage}
            </span>

            <button
              className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === totalPages
                ? "opacity-40 pointer-events-none"
                : "hover:bg-[#f1f1f1]"
                }`}
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === totalPages
                ? "opacity-40 pointer-events-none"
                : "hover:bg-[#f1f1f1]"
                }`}
              onClick={goToLast}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>


          {/* Desktop Pagination */}
          <div className="flex md:flex-row justify-between items-center mt-3 gap-2 md:gap-3 text-sm">
            {/* Left: Showing text */}
            <div className="text-[10px] text-black md:text-sm">
              <span>
                Showing 1 to 0 of 0 entries
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
                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === totalPages
                  ? "opacity-40 pointer-events-none"
                  : "hover:bg-[#f1f1f1]"
                  }`}
                onClick={goToNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === totalPages
                  ? "opacity-40 pointer-events-none"
                  : "hover:bg-[#f1f1f1]"
                  }`}
                onClick={goToLast}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>

            {/* Jump to page */}
            <div className="flex items-center gap-2 text-[10px] md:text-sm">
              <span className="whitespace-nowrap text-black mr-1">
                Jump to page
              </span>
              <input
                className="w-22.5 h-9.5 px-2 py-1 text-sm border border-[#dee2e6] rounded"
                type="number"
                min="1"
                max={totalPages}
                value={jumptoPage}
                onChange={(e) => setJumptoPage(e.target.value)}
              />
              <button
                className="flex justify-center items-center w-[43.13px] h-7 rounded-xl font-bold text-black heading-clr border border-black  cursor-pointer hover:opacity-90"
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