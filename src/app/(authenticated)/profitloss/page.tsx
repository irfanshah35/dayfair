"use client";
import React, { useState, useEffect } from "react";
import CustomCalendar from "../../../components/common/custom-calendar";

interface StatementItem {
  sportName: string;
  Profit: number | null;
  Commission: number;
  totalPL: number;
}

export default function ProfitLoss() {
  const [statementList] = useState<StatementItem[]>([
    // {
    //   sportName: "Cricket",
    //   Profit: 2000,
    //   Commission: 200,
    //   totalPL: 1800,
    // },
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
    <div className="md:mx-[5px] md:my-[6px] ">
      <div className="relative flex flex-col min-w-0 wrap-break-word bg-white md:border border-black/12.5 rounded-[4px]">
        {/* Card Header */}
        <div className="px-4 py-1 md:py-0 h-[37.8px] md:rounded-t-[4px] bg-black/3 border-b btn-clr border-black/12.5">
          <h4 className="mb-0 text-base text-white md:text-[24px]">Profit Loss</h4>
        </div>

        {/* Card Body */}
        <div className="p-[5px] pb-2.5 pt-2.5 text-base">
          {/* Filter Row */}
          <div className="flex flex-wrap items-end mt-[7px] -mx-[5px]">
            {/* Start Date */}
            <div className="w-full md:w-1/6 pl-[5px] pr-[9px] mb-2 md:mb-0">
              <CustomCalendar
                selected={startDate}
                onChange={setStartDate}
                maxDate={new Date()}
                placeholderText="Select Date"
              />
            </div>

            {/* End Date */}
            <div className="w-full md:w-1/6 px-[9px] mb-2  md:mb-0">
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
            <div className="w-full md:w-1/6 px-[9px]">
              <button
                className=" w-full md:w-[76px] h-[38px] px-[9px] py-1.5 text-base font-normal text-black heading-clr  border border-black rounded cursor-pointer hover:opacity-90 bg-[#F4A500]"
                onClick={submitData}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Table */}
          {/* Table */}
          <div className="flex flex-wrap -mx-[5px] mt-[11px]">
            <div className="w-full px-[5px]">
              <table className="w-full border-collapse border border-black/12.5">
                <thead>
                  <tr className="grid grid-cols-4 w-full md:h-[43px]">
                    <th className="p-[2px] md:px-3 md:py-[9px] text-center text-black bg-[#e9ecef] border-r border-black/12.5 text-sm md:text-base">
                      Sport Name
                    </th>
                    <th className="p-[2px] md:px-3 md:py-[9px] text-center  text-black bg-[#e9ecef] border-r border-black/12.5 text-sm md:text-base">
                      Profit/Loss
                    </th>
                    <th className="p-[2px] md:px-3 md:py-[9px]md:py-[9px] text-center  text-black bg-[#e9ecef] border-r border-black/12.5 text-sm md:text-base">
                      Commission
                    </th>
                    <th className="p-[2px] md:px-3 md:py-[9px] text-center  text-black bg-[#e9ecef] border-black/12.5 text-sm md:text-base">
                      Total P&L
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {statementList.length > 0 ? (
                    statementList.map((statement, index) => (
                      <tr key={index} className="grid grid-cols-4 w-full max-h-[43px]">
                        <td className="px-2 py-1.5 md:px-3 md:py-[9px] text-center border-r text-black border-black/12.5 text-xs md:text-base">
                          {statement.sportName}
                        </td>
                        <td className="px-2 py-1.5 md:px-3 md:py-[9px] text-center border-r text-black border-black/12.5 text-xs md:text-base">
                          {statement.Profit}
                        </td>
                        <td className="px-2 py-1.5 md:px-3 md:py-[9px] text-center border-r text-black border-black/12.5 text-xs md:text-base">
                          <span className="font-bold text-red-600">
                            {statement.Commission}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 md:px-3 md:py-[9px] text-center text-black border-black/12.5 text-xs md:text-base">
                          <span className="font-bold">
                            {statement.totalPL}
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

          <div className="flex justify-center items-center gap-2 mt-3 text-[12px] text-black">
            <button
              className={`px-2.5 py-[4.5px] rounded-[14px] bg-transparent border-none cursor-pointer ${currentPage === 1 ? "opacity-65 pointer-events-none" : "hover:bg-[#f1f1f1]"
                }`}
              onClick={goToFirst}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className={`px-2.5 py-[4.5px] rounded-[14px] bg-transparent border-none cursor-pointer ${currentPage === 1 ? "opacity-65 pointer-events-none" : "hover:bg-[#f1f1f1]"
                }`}
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="inline-flex items-center justify-center border py-[4.5px] px-[9px] rounded-[4px] h-[29px] text-black bg-linear-to-b from-[#f4b501] to-[#f68700]">
              {currentPage}
            </span>

            <button
              className={`px-2.5 py-[4.5px] rounded-[14px] bg-transparent border-none cursor-pointer`}
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className={`px-2.5 py-[4.5px] rounded-[14px] bg-transparent border-none cursor-pointer`}
              onClick={goToLast}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
