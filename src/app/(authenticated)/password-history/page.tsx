"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";

export default function PasswordHistory() {
  // just for date display
  const fmtDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const dd = d
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");
    const time = d
      .toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/^0/, "");
    return `${dd} ${time}`;
  };

  const [activeTab, setActiveTab] = useState("password");
  const [passwordData, setPasswordData] = useState<any>([]);
  const router = useRouter();

  // 🔥 API CALL on page load
  useEffect(() => {
    fetchPasswordHistory();
  }, []);

  const fetchPasswordHistory = () => {
    fetchData({
      url: CONFIG.activityList,
      payload: {
        type: "PASSWORD_HISTORY_LOGS",
        key: CONFIG.siteKey,
      },
      setFn: (res: any) => {
        setPasswordData(res?.passwordHistoryLogs ?? []);
      },
    });
  };

  const switchTab = (tab: string) => () => {
    if (tab === "activity") {
      setActiveTab("activity");
      router.push("/activity-log");
    } else if (tab === "password") {
      setActiveTab("password");
      router.push("/password-history");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mx-2">
        <button
          onClick={switchTab("activity")}
          className={`w-full my-2 min-[992px]:my-[9px] py-1 px-2 min-[992px]:px-3.5 min-[992px]:py-2.5 border rounded-[30px] text-black text-[16px] font-semibold cursor-pointer border-black ${activeTab === "activity"
              ? "bg-linear-to-b from-[#f4b501] to-[#f68700]"
              : ""
            }`}
        >
          Activity Log
        </button>

        <button
          onClick={switchTab("password")}
          className={
            `w-full my-2 min-[992px]:my-[9px] py-1 px-2 min-[992px]:px-3.5 min-[992px]:py-2.5 border rounded-[30px] text-black text-[16px] font-semibold cursor-pointer border-black` +
            (activeTab === "password"
              ? " bg-linear-to-b from-[#f4b501] to-[#f68700]"
              : "")
          }
        >
          Password History
        </button>
      </div>

      <div className="min-[992px]:mx-1 min-[992px]:my-1">
        <div className="border border-gray-200 min-[992px]:rounded-min-[992px]: text-white">
          {/* Header */}
          <div className="px-4 py-[4px] min-[992px]:py-[0.218px] border-b border-[rgba(0,0,0,0.175)] min-[992px]:rounded-t bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] min-[992px]:h-[37.8px] flex items-center">
            <span className="mb-0 text-base text-white! min-[992px]:text-[24px]">
              Password History
            </span>
          </div>

          {/* Table Wrapper */}
          <div className="py-3 min-[992px]:py-4 px-2 min-[992px]:px-[5px]">
            <div className="overflow-x-auto md:mt-[4px] min-[992px]:mt-0">
              <table className="w-full border border-[#C8CED3]">
                <thead>
                  <tr>
                    <th className="p-0.5 h-[26px] min-[992px]:h-auto w-[36.4%] min-[992px]:px-3 min-[992px]:py-[9px] text-center text-black bg-[#e9ecef] border border-black/12.5 font-bold text-sm min-[992px]:text-base">
                      Date
                    </th>
                    <th className="p-0.5 h-[26px] min-[992px]:h-auto min-[992px]:px-3 min-[992px]:py-[9px] text-center text-black bg-[#e9ecef] border border-black/12.5 font-bold text-sm min-[992px]:text-base">
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {passwordData?.length > 0 ? (
                    passwordData.map((row: any, idx: number) => (
                      <tr key={idx} className="odd:bg-white">
                        <td className="px-2 py-0.5 h-[23px] min-[992px]:h-auto min-[992px]:py-1.5 min-[992px]:px-3 min-[992px]:p-[9px] text-center border text-black border-black/12.5 text-xs min-[992px]:text-base">
                          {fmtDate(row.createdAt)}
                        </td>
                        <td className="px-2 py-0.5 h-[23px] min-[992px]:h-auto min-[992px]:py-1.5 min-[992px]:px-3 min-[992px]:p-[9px] text-center border text-black border-black/12.5 text-xs min-[992px]:text-base">
                          {row.remark}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="p-[9px] text-center border text-black border-black/12.5"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
