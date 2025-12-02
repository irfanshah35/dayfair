"use client";
import React, { useState, useEffect } from "react";
import CustomCalendar from "../../../components/common/custom-calendar";

interface StatementItem {
  createdAt: string;
  deposit: number | null;
  withdraw: number | null;
  bankBalance: number;
  remark: string | null;
}

export default function AccountStatement() {
  const [statementList] = useState<StatementItem[]>([
    {
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      deposit: 2000,
      withdraw: null,
      bankBalance: 1000,
      remark: " Opening Balance (Master)",
    },
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
    <div className="m-[5px] ">
      <div className="relative flex flex-col min-w-0 break-words bg-white border border-black/[0.125] rounded">
        {/* Card Header */}
        <div className="px-4 rounded-xs bg-black/[0.03] border-b btn-clr border-black/[0.125]">
          <h4 className="mb-0 text-base md:text-[24px] ">Account Statement</h4>
        </div>

        {/* Card Body */}
        <div className="p-[5px] pb-[10px] pt-[10px] text-base  lg:overflow-y-auto lg:overflow-x-hidden">
          {/* Filter Row */}
          <div className="flex flex-wrap items-end mt-2 -mx-[5px]">
            {/* Start Date */}
            <div className="w-full md:w-1/6 px-[5px] mb-2 md:mb-0">
              <CustomCalendar
                selected={startDate}
                onChange={setStartDate}
                maxDate={new Date()}
                placeholderText="Select Date"
              />
            </div>

            {/* End Date */}
            <div className="w-full md:w-1/6 px-[5px] mb-2 md:mb-0">
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
            <div className="w-full md:w-1/6 px-[5px]">
              <button
                className="w-full h-[38px] px-[9px] py-[6px] text-base font-normal text-black heading-clr  border border-black rounded cursor-pointer hover:opacity-90"
                onClick={submitData}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex flex-wrap -mx-[5px] mt-3">
            <div className="w-full px-[5px] overflow-x-auto">
              <table className="w-full border-collapse border border-black/[0.125]">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-center text-black bg-[#e9ecef] border border-black/[0.125]">
                      Date / Time
                    </th>
                    <th className="px-3 py-3 text-center  text-black bg-[#e9ecef] border border-black/[0.125]">
                      Credit
                    </th>
                    <th className="px-3 py-3 text-center  text-black bg-[#e9ecef] border border-black/[0.125]">
                      Debit
                    </th>
                    <th className="px-3 py-3 text-center  text-black bg-[#e9ecef] border border-black/[0.125] font-bold">
                      Balance
                    </th>
                    <th className="px-3 py-3 text-center  text-black bg-[#e9ecef] border border-black/[0.125]">
                      Remark
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {statementList.length > 0 ? (
                    statementList.map((statement, index) => (
                      <tr key={index}>
                        <td className="px-3 py-3 text-center border  text-black border-black/[0.125]">
                          {formatDateTime(statement.createdAt)}
                        </td>
                        <td className="px-3 py-3 text-center border  text-black border-black/[0.125]">
                          {statement.deposit || "0"}
                        </td>
                        <td className="px-3 py-3 text-center border  text-black border-black/[0.125]">
                          <span className="font-bold text-red-600">
                            {statement.withdraw || "0"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center border  text-black border-black/[0.125]">
                          <span className="font-bold">
                            {statement.bankBalance}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center border  text-black border-black/[0.125]">
                          {statement.remark || "NA"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-3 text-center border  text-black border-black/[0.125] bg-transparent"
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
              className={`px-[10px] py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:bg-[#f1f1f1]"
              }`}
              onClick={goToFirst}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className={`px-[10px] py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:bg-[#f1f1f1]"
              }`}
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="inline-flex items-center justify-center min-w-[32px] px-[10px] py-1 rounded-[16px] font-bold text-black bg-gradient-to-b from-[#f4b501] to-[#f68700]">
              {currentPage}
            </span>

            <button
              className={`px-[10px] py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                currentPage === totalPages
                  ? "opacity-40 pointer-events-none"
                  : "hover:bg-[#f1f1f1]"
              }`}
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className={`px-[10px] py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                currentPage === totalPages
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
          <div className="flex flex-col md:flex-row justify-between items-center mt-3 gap-2 md:gap-3 text-sm">
            {/* Left: Showing text */}
            <div className="text-xs text-black md:text-sm">
              <span>
                Showing {startIndex} to {endIndex} of {totalRecords} entries
              </span>
            </div>

            {/* Center: Pagination buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                className={`px-[10px] py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                  currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:bg-[#f1f1f1]"
                }`}
                onClick={goToFirst}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className={`px-[10px] py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                  currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:bg-[#f1f1f1]"
                }`}
                onClick={goToPrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="inline-flex items-center justify-center min-w-[32px] px-[10px] py-1 rounded-[16px] font-bold text-black bg-gradient-to-b from-[#f4b501] to-[#f68700]">
                {currentPage}
              </span>

              <button
                className={`px-[10px] py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                  currentPage === totalPages
                    ? "opacity-40 pointer-events-none"
                    : "hover:bg-[#f1f1f1]"
                }`}
                onClick={goToNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                className={`px-[10px] py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                  currentPage === totalPages
                    ? "opacity-40 pointer-events-none"
                    : "hover:bg-[#f1f1f1]"
                }`}
                onClick={goToLast}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>

            {/* Right: Jump to page */}
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
          </div>
        </div>
      </div>
    </div>
  );
}