"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";

interface PasswordHistoryItem {
  createdAt: string;
  remark: string;
}


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
  const [passwordData, setPasswordData] = useState<PasswordHistoryItem[]>([]);
  const router = useRouter();

  

  const fetchPasswordHistory = () => {
    fetchData({
      url: CONFIG.activityList,
      payload: {
        type: "PASSWORD_HISTORY_LOGS",
        key: CONFIG.siteKey,
      },
      setFn: (res: { passwordHistoryLogs: PasswordHistoryItem[] }) => {
        setPasswordData(res?.passwordHistoryLogs ?? []);
      },
    });
  };

  // 🔥 API CALL on page load
  useEffect(() => {
    fetchPasswordHistory();
  }, []);

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
      <div className="flex items-center gap-1.5 mx-1.5 min-[992px]:gap-2 min-[992px]:mx-2">
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
        <div className="min-[992px]:border border-gray-200 min-[992px]:rounded-min-[992px]: text-white">
          {/* Header */}
          <div className="px-4 py-[4px] min-[400px]:py-[3.5px] min-[992px]:py-[0.218px] border-b border-[rgba(0,0,0,0.175)] min-[992px]:rounded-t bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] min-[992px]:h-[37.8px] flex items-center">
            <span className="mb-0 text-[16.26px] min-[400px]:text-[16.575px] text-white! min-[992px]:text-[24px] relative min-[400px]:top-[-1px] min-[992px]:top-0">
              Password History
            </span>
          </div>

          {/* Table Wrapper */}
          <div className="py-4 px-[5px] min-[992px]:px-[5px]">
            <div className="overflow-x-auto md:mt-1 min-[992px]:mt-0">
              <table className="w-full border border-[#C8CED3]">
                <thead>
                  <tr>
                    <th className="p-0.5 max-[992px]:leading-[21px] h-[26px] min-[992px]:h-auto w-[36.4%] min-[992px]:px-3 min-[992px]:py-[9px] text-center text-black bg-[#e9ecef] border border-black/12.5 font-bold text-sm min-[992px]:text-base">
                      Date
                    </th>
                    <th className="p-0.5 max-[992px]:leading-[21px] h-[26px] min-[992px]:h-auto min-[992px]:px-3 min-[992px]:py-[9px] text-center text-black bg-[#e9ecef] border border-black/12.5 font-bold text-sm min-[992px]:text-base">
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {passwordData?.length > 0 ? (
                    passwordData.map((row: PasswordHistoryItem, idx: number) => (
                      <tr key={idx} className="odd:bg-white">
                        <td className="px-0.5 py-0.5 h-[23px] min-[992px]:h-auto min-[992px]:py-1.5 min-[992px]:px-3 min-[992px]:p-[9px] text-center border text-black border-black/12.5 text-xs min-[992px]:text-base">
                          {fmtDate(row.createdAt)}
                        </td>
                        <td className="px-0.5 py-0.5 h-[23px] min-[992px]:h-auto min-[992px]:py-1.5 min-[992px]:px-3 min-[992px]:p-[9px] text-center border text-black border-black/12.5 text-xs min-[992px]:text-base">
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
