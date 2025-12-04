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

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 -> 12

    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
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
          className={`w-full my-[9px] px-3.5 py-2.5 rounded-[30px] text-black text-[16px] font-semibold border cursor-pointer border-black ${activeTab === "activity"
            ? "bg-linear-to-b from-[#f4b501] to-[#f68700]"
            : ""
            }`}
        >
          Activity Log
        </button>

        <button
          onClick={switchTab("password")}
          className={`w-full my-[9px] px-3.5 py-2.5 border-0 rounded-[30px] text-black text-[16px] font-semibold cursor-pointer border-black ${activeTab === "password"
            ? "bg-linear-to-b from-[#f4b501] to-[#f68700]"
            : ""
            }`}
        >
          Password History
        </button>
      </div>

      <div className="mx-[5px] my-1">
        <div className="border border-gray-300 rounded-md text-white">
          {/* Header */}
          <div className="px-4 py-[0.218px] border-b border-[rgba(0,0,0,0.175)] rounded-t bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] h-[37.8px]">
            <span className="text-[24px] font-semibold font-roboto  ">
              {activeTab === "activity" ? "Activity Log" : "Password History"}
            </span>
          </div>

          {/* Table Wrapper */}
          <div className="py-3 md:py-5.5 px-[5px] md:px-[5px]">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-linear-to-b from-[#030a12] via-[#444647] to-[#58595a] md:[background:white]">

                    {activeTab === "activity" ? (
                      <>
                        <th className="font-roboto    py-[5px] text-center! text-[16px] text-white md:text-black border border-gray-200 whitespace-nowrap">
                          Login Date & Time
                        </th>
                        <th className="font-roboto    py-[5px] text-center! text-[16px] text-white md:text-black border border-gray-200 whitespace-nowrap">
                          Login Status
                        </th>
                        <th className="font-roboto   py-[5px] text-center! text-[16px] text-white md:text-black border border-gray-200 whitespace-nowrap">
                          IP Address
                        </th>
                        <th className="font-roboto   py-[5px] text-center! text-[16px] text-white md:text-black border border-gray-200 whitespace-nowrap">
                          ISP
                        </th>
                        <th className="font-roboto   py-[5px] text-center! text-[16px] text-white md:text-black border border-gray-200 whitespace-nowrap">
                          City/State/Country
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="max-w-48   py-[5px] text-center! text-[16px] text-white md:text-black border border-gray-200 whitespace-nowrap">
                          Date & Time
                        </th>
                        <th className="max-w-48   py-[5px] text-center! text-[16px] text-white md:text-black border border-gray-200 whitespace-nowrap">
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
                          <td className="font-roboto   py-[5px] text-[16px] font-medium text-gray-800 border border-gray-200 text-center ">
                            {fmtDate(row?.createdAt)}
                          </td>

                          <td className="font-roboto   py-[5px] text-[16px] border border-gray-200 whitespace-nowrap text-center">
                            <span
                              className={
                                row.logMessage === "Login Successful"
                                  ? " !text-[rgba(25,135,84,1)]"
                                  : "text-red-600"
                              }
                            >
                              {row.logMessage}
                            </span>
                          </td>

                          <td className="font-roboto   py-[5px] text-[16px] text-gray-800 border border-gray-200 text-center  whitespace-nowrap">
                            {row.ip}
                          </td>

                          <td className="font-roboto   py-[5px] text-[16px] text-gray-800 border border-gray-200 text-center  whitespace-nowrap">
                            {row.isp}
                          </td>

                          <td className="font-roboto   py-[5px] text-[16px] text-gray-800 border border-gray-200 text-center  whitespace-nowrap">
                            {[row.city, row.state, row.country]
                              .filter(Boolean)
                              .join("/")}
                          </td>
                        </tr>
                      )
                    )
                  ) : activeTab === "activity" ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="  py-[5px] text-[16px] text-center text-gray-800 border border-gray-200"
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
                          <td className="  py-[5px] text-[16px] text-gray-800 border border-gray-200 text-center ">
                            {fmtDate(row.createdAt)}
                          </td>
                          <td className="  py-[5px] text-[16px] text-gray-800 border border-gray-200 text-center ">
                            {row.remark}
                          </td>
                        </tr>
                      )
                    )
                  ) : activeTab === "password" ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="  py-[5px] text-[16px] text-center text-gray-800 border border-gray-200"
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
