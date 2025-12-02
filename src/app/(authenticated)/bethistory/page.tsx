"use client";
import React, { useState, useEffect } from "react";
import CustomCalendar from "../../../components/common/custom-calendar";

interface StatementItem {
  description: string;
  bidType: number | null;
  oddsReq: number | null;
  stake: number;
  avgOdds: string | null;
  profitLoss: number;

}

export default function BetHistory() {
  const [statementList] = useState<StatementItem[]>([

  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const totalRecords = 1;
  const totalPages = 1;
  const startIndex = 1;
  const endIndex = 1;
  const [jumptoPage, setJumptoPage] = useState<number | string>("");

  // Date states
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sportType, setSportType] = useState("Exchange");
  const [betType, setBetType] = useState("UNMATCHED");


  useEffect(() => {
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);

    setStartDate(tenDaysAgo);
    setEndDate(today);
  }, []);

  const submitData = () => {
    console.log("Submit clicked", { startDate, endDate });
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

  return (
    <div className="md:mx-[5px] md:my-[6px] ">
      <div className="relative flex flex-col min-w-0 wrap-break-word bg-white md:border border-black/12.5 rounded">
        {/* Card Header */}
        <div className="px-4 py-1 md:py-0 h-[37.8px] md:rounded-t-[4px] bg-black/3 border-b btn-clr border-black/12.5">
          <h4 className="mb-0 text-base !text-white md:text-[24px]">Bet History</h4>
        </div>

        {/* Card Body */}
        <div className="p-[5px] pb-2.5 pt-2.5 text-base">
          {/* Filter Row */}
          <div className="flex flex-wrap items-end mt-[7px] -mx-[5px]">
            {/* Dropdowns Container - Flex row on mobile */}
            <div className="w-full flex gap-2 pl-[5px] pr-[9px] mb-2 md:w-1/3 md:gap-0 md:mb-0">
              {/* Exchange Dropdown */}
              <div className="flex-1 md:w-1/2 md:pr-[9px]">
                <select
                  className="w-full h-[38px] px-3 py-1.5 text-base text-[#555] bg-white border border-[#ced4da] rounded appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "8px 10px",
                  }}
                  value={sportType}
                  onChange={(e) => setSportType(e.target.value)}
                >
                  <option value="Exchange">Exchange</option>
                  <option value="Sport Type">Sport Type</option>
                  <option value="Casino">Casino</option>
                </select>
              </div>

              {/* UNMATCHED Dropdown */}
              <div className="flex-1 md:w-1/2 md:pl-[9px]">
                <select
                  className="w-full h-[38px] px-3 py-1.5 text-base text-[#555] bg-white border border-[#ced4da] rounded appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "8px 10px",
                  }}
                  value={betType}
                  onChange={(e) => setBetType(e.target.value)}
                >
                  <option value="UNMATCHED">UNMATCHED</option>
                  <option value="MATCHED">MATCHED</option>
                  <option value="SETTLED">SETTLED</option>
                  <option value="VOID">VOID</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="VOIDED - OPEN MARKETS">VOIDED - OPEN MARKETS</option>
                  <option value="VOIDED - CLOSED MARKETS">VOIDED - CLOSED MARKETS</option>
                  <option value="LAPSED">LAPSED</option>
                  <option value="SP PLACED">SP PLACED</option>
                </select>
              </div>
            </div>

            {/* Start Date */}
            <div className="w-full flex min-[375px]:flex-col md:flex-row gap-2 pl-[5px] pr-[9px] mb-2 md:w-1/3 md:gap-0 md:mb-0">
              <div className="flex-1 md:w-1/2 md:pr-[9px]">
                <CustomCalendar
                  selected={startDate}
                  onChange={setStartDate}
                  maxDate={new Date()}
                  placeholderText="Select Date"
                />
              </div>

              {/* End Date */}
              <div className="flex-1 md:w-1/2 md:pl-[9px]">
                <CustomCalendar
                  selected={endDate}
                  onChange={setEndDate}
                  startDate={startDate}
                  selectsEnd={true}
                  maxDate={new Date()}
                  placeholderText="Select Date"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full md:w-1/6 pl-[5px] md:!pl-[9px] px-[9px]">
              <button
                className=" w-full md:w-[76px] h-[38px] px-[9px] py-1.5 text-base font-normal text-black heading-clr  border border-black rounded cursor-pointer hover:opacity-90 bg-[#F4A500]"
                onClick={submitData}
              >
                Submit
              </button>
            </div>
          </div>



          {/* Table */}
          <div className="flex flex-wrap -mx-[5px] mt-3">
            <div className="w-full px-[5px] overflow-x-auto">
              <table className="w-full border-collapse border border-black/12.5">
                <thead>
                  <tr className="md:h-[43px]">
                    <th className="px-[2px] py-1 md:px-3 md:py-2 text-left  text-black bg-[#e9ecef] border border-black/12.5 text-sm md:text-base">
                      Description
                    </th>
                    <th className="px-[2px] py-1 md:px-3 md:py-2 text-left  text-black bg-[#e9ecef] border border-black/12.5 text-sm md:text-base">
                      Bid Type
                    </th>
                    <th className="px-[2px] py-1 md:px-3 md:py-2 text-left  text-black bg-[#e9ecef] border border-black/12.5 text-sm md:text-base">
                      Odds Req
                    </th>
                    <th className="px-[2px] py-1 md:px-3 md:py-2 text-left text-black bg-[#e9ecef] border border-black/12.5 font-bold text-sm md:text-base">
                      Stake
                    </th>
                    <th className="px-[2px] py-1 md:px-3 md:py-2 text-left text-black bg-[#e9ecef] border border-black/12.5 text-sm md:text-base">
                      Avg Odds
                    </th>
                    <th className="px-[2px] py-1 md:px-3 md:py-2 text-left text-black bg-[#e9ecef] border border-black/12.5 text-sm md:text-base">
                      P&L
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {statementList.length > 0 ? (
                    statementList.map((statement, index) => (
                      <tr key={index}>
                        <td className="px-[2px] py-1.5 md:px-3 md:py-3 text-center border text-black border-black/12.5 text-xs md:text-base">
                          {formatDateTime(statement.description)}
                        </td>
                        <td className="px-[2px] py-1.5 md:px-3 md:py-3 text-center border text-black border-black/12.5 text-xs md:text-base">
                          {statement.bidType || "0"}
                        </td>
                        <td className="px-[2px] py-1.5 md:px-3 md:py-3 text-center border text-black border-black/12.5 text-xs md:text-base">
                          <span className="font-bold text-red-600">
                            {statement.oddsReq || "0"}
                          </span>
                        </td>
                        <td className="px-[2px] py-1.5 md:px-3 md:py-3 text-center border text-black border-black/12.5 text-xs md:text-base">
                          <span className="font-bold">
                            {statement.stake}
                          </span>
                        </td>
                        <td className="px-[2px] py-1.5 md:px-3 md:py-3 text-center border text-black border-black/12.5 text-xs md:text-base">
                          {statement.avgOdds || "NA"}
                        </td>
                        <td className="px-[2px] py-1.5 md:px-3 md:py-3 text-center border text-black border-black/12.5 text-xs md:text-base">
                          {statement.profitLoss || "NA"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
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
          {/* <div className="flex md:hidden justify-between items-center gap-2 mt-2">
            <button
              className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:bg-[#f1f1f1]"
                }`}
              onClick={goToFirst}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:bg-[#f1f1f1]"
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
          </div> */}

          {/* Desktop Pagination */}
          {/* <div className="flex flex-col md:flex-row justify-between items-center mt-3 gap-2 md:gap-3 text-sm">
            <div className="text-xs text-black md:text-sm">
              <span>
                Showing {startIndex} to {endIndex} of {totalRecords} entries
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:bg-[#f1f1f1]"
                  }`}
                onClick={goToFirst}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:bg-[#f1f1f1]"
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
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span className="whitespace-nowrap text-black mr-1">Jump to page</span>
              <input
                className="w-[90px] px-2 py-1 text-sm border border-[#ced4da] rounded"
                type="number"
                min="1"
                max={totalPages}
                value={jumptoPage}
                onChange={(e) => setJumptoPage(e.target.value)}
              />
              <button
                className="px-3.5 py-1 rounded-xl font-bold text-black heading-clr border border-black  cursor-pointer hover:opacity-90"
                onClick={jumpPage}
              >
                Go
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}