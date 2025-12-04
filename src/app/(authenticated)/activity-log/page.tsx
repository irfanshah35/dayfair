"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";

interface ActivityLogItem {
  createdAt: string;
  logMessage: string;
  ip: string;
  isp: string;
  city: string;
  state: string;
  country: string;
}

interface PasswordHistoryItem {
  remark: string;
  createdAt: string;
}

export default function ActivityLog() {
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

  const [activeTab, setActiveTab] = useState("activity");
  const [activityData, setActivityData] = useState<any>();
  const [passwordData, setPasswordData] = useState<any>();

  const router = useRouter();

  // default load activity logs
  useEffect(() => {
    loadActivityLogs();
  }, []);

  const loadActivityLogs = () => {
    fetchData({
      url: CONFIG.activityList,
      payload: { type: "ACTIVITY_LOGS", key: CONFIG.siteKey },
      setFn: setActivityData,
    });
  };

  const loadPasswordHistory = () => {
    fetchData({
      url: CONFIG.activityList,
      payload: { type: "PASSWORD_HISTORY_LOGS", key: CONFIG.siteKey },
      setFn: setPasswordData,
    });
  };

  const switchTab = (tab: string) => () => {
    if (tab === "activity") {
      setActiveTab("activity");
      router.push("/activity-log");
      loadActivityLogs();
    } else {
      setActiveTab("password");
      router.push("/password-history");
      loadPasswordHistory();
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mx-2">
        <button
          onClick={switchTab("activity")}
          className={`w-full my-[9px] px-3.5 py-2.5 rounded-[30px] text-black text-[16px] font-semibold border cursor-pointer border-black ${
            activeTab === "activity"
              ? "bg-linear-to-b from-[#f4b501] to-[#f68700]"
              : ""
          }`}
        >
          Activity Log
        </button>

        <button
          onClick={switchTab("password")}
          className={`w-full my-[9px] px-3.5 py-2.5 border-0 rounded-[30px] text-black text-[16px] font-semibold cursor-pointer border-black ${
            activeTab === "password"
              ? "bg-linear-to-b from-[#f4b501] to-[#f68700]"
              : ""
          }`}
        >
          Password History
        </button>
      </div>

      <div className="mx-1 my-1">
        <div className="border border-gray-200 rounded-md text-white">
          {/* Header */}
          <div className="px-4 py-[0.218px] border-b border-[rgba(0,0,0,0.175)] rounded-t bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] h-[37.8px]">
            <span className="text-[24px] font-semibold font-roboto ">
              {activeTab === "activity" ? "Activity Log" : "Password History"}
            </span>
          </div>

          {/* Table Wrapper */}
          <div className="py-3 md:py-5.5 px-2 md:px-2">
            <div className="overflow-x-auto">
              <table className="w-full border border-[#C8CED3]">
                <thead>
                  <tr className="bg-linear-to-b from-[#030a12] via-[#444647] to-[#58595a] md:[background:white]">

                    {activeTab === "activity" ? (
                      <>
                        <th className="max-w-48 p-[9px] text-left! text-[16px] text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                          Login Date & Time
                        </th>
                        <th className="max-w-32 p-[9px] text-left! text-[16px] text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                          Login Status
                        </th>
                        <th className="max-w-32 p-[9px] text-left! text-[16px] text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                          IP Address
                        </th>
                        <th className="min-w-48 p-[9px] text-left! text-[16px] text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                          ISP
                        </th>
                        <th className="min-w-56 p-[9px] text-left! text-[16px] text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                          City/State/Country
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="max-w-48 p-[9px] text-left text-[16px] text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                          Date & Time
                        </th>
                        <th className="max-w-48 p-[9px] text-left text-[16px] text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                          Remark
                        </th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {/* ACTIVITY LOG TABLE */}
                  {activeTab === "activity" &&
                  activityData?.activityLogs?.length > 0 ? (
                    activityData.activityLogs.map(
                      (row: ActivityLogItem, idx: number) => (
                        <tr key={idx} className="odd:bg-white">
                          <td className="p-[9px] text-[16px] text-gray-800 border border-[#C8CED3]">
                            {fmtDate(row?.createdAt)}
                          </td>

                          <td className="p-[9px] text-[16px] border border-[#C8CED3] whitespace-nowrap">
                            <span
                              className={
                                row.logMessage === "Login Successful"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {row.logMessage}
                            </span>
                          </td>

                          <td className="p-[9px] text-[16px] text-gray-800 border border-[#C8CED3] whitespace-nowrap">
                            {row.ip}
                          </td>

                          <td className="p-[9px] text-[16px] text-gray-800 border border-[#C8CED3] whitespace-nowrap">
                            {row.isp}
                          </td>

                          <td className="p-[9px] text-[16px] text-gray-800 border border-[#C8CED3] whitespace-nowrap">
                            {[row.city, row.state, row.country]
                              .filter(Boolean)
                              .join(" / ")}
                          </td>
                        </tr>
                      )
                    )
                  ) : activeTab === "activity" ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-[9px] text-[16px] text-center text-gray-800 border border-[#C8CED3]"
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : null}

                  {/* PASSWORD HISTORY TABLE */}
                  {activeTab === "password" &&
                  passwordData?.passwordHistoryLogs?.length > 0 ? (
                    passwordData.passwordHistoryLogs.map(
                      (row: PasswordHistoryItem, idx: number) => (
                        <tr key={idx} className="odd:bg-white">
                          <td className="p-[9px] text-[16px] text-gray-800 border border-[#C8CED3]">
                            {fmtDate(row.createdAt)}
                          </td>
                          <td className="p-[9px] text-[16px] text-gray-800 border border-[#C8CED3]">
                            {row.remark}
                          </td>
                        </tr>
                      )
                    )
                  ) : activeTab === "password" ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="p-[9px] text-[16px] text-center text-gray-800 border border-[#C8CED3]"
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
