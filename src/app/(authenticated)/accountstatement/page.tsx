"use client";
import React, { useState, useEffect } from "react";
// import CustomCalendar from "../../../components/common/custom-calendar";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";

import dynamic from "next/dynamic";

const CustomCalendar = dynamic(() => import("../../../components/common/custom-calendar"), {
  loading: () => <></>,
  ssr: false,
});

interface StatementItem {
  createdAt: string;
  deposit: number | null;
  withdraw: number | null;
  bankBalance: number;
  remark: string | null;
}

interface ApiResponse {
  data: StatementItem[];
  total: number;
  currentPage: number;
  meta: {
    message: string;
    status_code: number;
    status: boolean;
  };
}

export default function AccountStatement() {
  const [statementList, setStatementList] = useState<StatementItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [jumptoPage, setJumptoPage] = useState<number | string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  const startIndex = totalRecords > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endIndex = Math.min(currentPage * limit, totalRecords);
  const [mounted,setMounted]=useState(false);

  useEffect(()=>{
    fetchAccountStatement()
    setMounted(true);
  },[mounted])

  useEffect(() => {
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);

    setStartDate(tenDaysAgo);
    setEndDate(today);
  }, []);

  const [accountStatement, setAccountStatement] = useState<any>();

  const fetchAccountStatement = async () => {
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
        url: CONFIG.statement,
        payload: payload,
        setFn: setAccountStatement,
      });
    } catch (error) {
      console.error("Error fetching statement:", error);
    }
  };

  const submitData = () => {
    setCurrentPage(1);
    if (startDate && endDate) {
      fetchAccountStatement();
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
      fetchAccountStatement();
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
    <div className="min-[992px]:mx-[5px] min-[992px]:my-1.5">
      <div className="relative flex flex-col min-w-0 wrap-break-word bg-white min-[992px]:border border-black/12.5 rounded">
        {/* Card Header */}
        <div className="px-4 py-1 min-[992px]:py-0 min-[992px]:h-[37.8px] min-[992px]:rounded-t-sm bg-black/3 border-b btn-clr border-black/12.5">
          <h4 className="mb-0 text-base text-white! md:text-[17.604px] min-[992px]:text-[24px]">
            Account Statement
          </h4>
        </div>

        {/* Card Body */}
        <div className="p-[5px] pb-2.5 pt-2.5 text-base">
          {/* Filter Row */}
          <div className="flex flex-wrap items-center mt-[7px] -mx-[5px]">
            {/* Start Date */}
            <div className="w-full md:w-1/6 px-[5px] md:pl-[5px] md:pr-[9px] mb-[6px] md:mb-0">
              <CustomCalendar
                selected={startDate}
                onChange={setStartDate}
                maxDate={new Date()}
                placeholderText="Select Date"
              />
            </div>

            {/* End Date */}
            <div className="w-full md:w-1/6 px-[5px] md:px-[9px] mb-[11px]  md:mb-0">
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
            <div className="w-full md:w-[16.5%] px-[5px] md:px-[7px] pr-[9px] relative md:bottom-px">
              <button
                className="w-full h-[38px] px-[9px] py-1.5 text-base font-normal text-black heading-clr  border border-black rounded cursor-pointer hover:opacity-90"
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
                  <tr>
                    <th className="p-0.5 min-[992px]:px-3 min-[992px]:py-2 text-center h-[26px] min-[992px]:h-auto text-black bg-[#e9ecef] border-x border-black/12.5 text-sm min-[992px]:text-base">
                      Date / Time
                    </th>
                    <th className="p-0.5 min-[992px]:px-3 min-[992px]:py-2 text-center h-[26px] min-[992px]:h-auto text-black bg-[#e9ecef] border-x border-black/12.5 text-sm min-[992px]:text-base">
                      Credit
                    </th>
                    <th className="p-0.5 min-[992px]:px-3 min-[992px]:py-2 text-center h-[26px] min-[992px]:h-auto text-black bg-[#e9ecef] border-x border-black/12.5 text-sm min-[992px]:text-base">
                      Debit
                    </th>
                    <th className="p-0.5 min-[992px]:px-3 min-[992px]:py-2 text-center h-[26px] min-[992px]:h-auto text-black bg-[#e9ecef] border-x border-black/12.5 font-bold text-sm min-[992px]:text-base">
                      Balance
                    </th>
                    <th className="p-0.5 min-[992px]:px-3 min-[992px]:py-2 text-center h-[26px] min-[992px]:h-auto text-black bg-[#e9ecef] border-x border-black/12.5 text-sm min-[992px]:text-base">
                      Remark
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {accountStatement?.length > 0 ? (
                    accountStatement?.map((statement:any, index:number) => (
                      <tr key={index}>
                        <td className="px-2 py-1.5 min-[992px]:px-3 min-[992px]:p-[9px] text-center border text-black border-black/12.5 text-xs min-[992px]:text-base">
                          {formatDateTime(statement.createdAt)}
                        </td>
                        <td className="px-2 py-1.5 min-[992px]:px-3 min-[992px]:p-[9px] text-center border text-black border-black/12.5 text-xs min-[992px]:text-base">
                          {statement.deposit || "0"}
                        </td>
                        <td className="px-2 py-1.5 min-[992px]:px-3 min-[992px]:p-[9px] text-center border text-black border-black/12.5 text-xs min-[992px]:text-base">
                          <span className="font-bold text-red-600">
                            {statement.withdraw || "0"}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 min-[992px]:px-3 min-[992px]:p-[9px] text-center border text-black border-black/12.5 text-xs min-[992px]:text-base">
                          <span className="font-bold">
                            {statement.bankBalance}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 min-[992px]:px-3 min-[992px]:p-[9px] text-center border text-black border-black/12.5 text-xs min-[992px]:text-base">
                          {statement.remark || "NA"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-[2px] min-[992px]:px-3 min-[992px]:py-[9px] text-center border text-black border-black/12.5 bg-transparent min-[992px]:text-base"
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
          <div className="flex md:hidden justify-between items-center gap-2 mt-[6px] md:mt-2">
            <button
              className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                currentPage === 1
                  ? "opacity-40 pointer-events-none"
                  : "hover:bg-[#f1f1f1]"
              }`}
              onClick={goToFirst}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                currentPage === 1
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
              className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
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
              className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
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
          <div className="flex md:flex-row justify-between items-center mt-3 gap-2 md:gap-3 text-sm">
            {/* Left: Showing text */}
            <div className="text-[10px] text-black md:text-sm">
              <span>
                Showing {startIndex} to -{endIndex} of {accountStatement?.length||0} entries
              </span>
            </div>

            {/* Center */}
            <div className="hidden md:flex items-center gap-2">
              <button
                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                  currentPage === 1
                    ? "opacity-40 pointer-events-none"
                    : "hover:bg-[#f1f1f1]"
                }`}
                onClick={goToFirst}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
                  currentPage === 1
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
                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-[14px] font-semibold text-[#999] bg-transparent border-none cursor-pointer ${
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

            {/* Jump to page */}
            <div className="flex items-center gap-2 text-[10px] md:text-sm">
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
