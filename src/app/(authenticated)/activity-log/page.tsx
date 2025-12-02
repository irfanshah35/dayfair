"use client";

import { useRouter } from "next/navigation";
import React, { useState, } from "react";

export default function ActivityLog() {
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
  const [activeTab, setActiveTab] = useState("activity");
  const router = useRouter();

  // 🔹 STATIC TABLE DATA
  const staticData = [
    {
      createdAt: "2025-01-15T10:25:30Z",
      logMessage: "Login Successful",
      ip: "192.168.10.15",
      isp: "PTCL",
      city: "Karachi",
      state: "Sindh",
      country: "Pakistan",
    },
    {
      createdAt: "2025-01-14T09:11:22Z",
      logMessage: "Login Failed",
      ip: "192.168.42.10",
      isp: "StormFiber",
      city: "Islamabad",
      state: "ICT",
      country: "Pakistan",
    },
  ];
  const switchTab = (tab: string) => () => {
    if (tab == 'activity') {
      setActiveTab('activity');
      router.push('/activity-log');
    } else if (tab == 'password') {
      setActiveTab('password');
      router.push('/password-history');
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 mx-2">
        <button
          onClick={switchTab('activity')}
          className={`w-full my-[9px] px-[14px] py-[10px] border-0 rounded-[30px] text-black text-[16px] font-semibold border-[1px] cursor-pointer border-black ${activeTab === 'activity' ? 'bg-linear-to-b from-[#f4b501] to-[#f68700]' : ''}`}>
          Activity Log
        </button>

        <button
          onClick={switchTab('password')}
          className={`w-full  my-[9px] px-[14px] py-[10px] border-0 rounded-[30px] text-black text-[16px] font-semibold border-[1px] cursor-pointer border-black` + (activeTab === 'password' ? ' bg-linear-to-b from-[#f4b501] to-[#f68700]' : '')}>
          Password History
        </button>
      </div>

      <div className="mx-1 my-1">
        <div className="border border-gray-200 rounded-md text-white">
          {/* Header */}
          <div
            className="px-4 py-[0.218px] border-b border-[rgba(0,0,0,0.175)]  rounded-t  bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] h-[37.8px]">
            <span className="text-[24px] font-semibold font-roboto ">Activity Log</span>
          </div>

          {/* Table Wrapper */}
          <div className="py-3 md:py-5.5 px-2 md:px-2">
            <div className="overflow-x-auto">
              {/* <table className="w-full border border-[#C8CED3]">
                <thead>
                  <tr className="bg-gradient-to-b from-[#030a12] via-[#444647] to-[#58595a] md:[background:white]">
                    <th className=" min-w-40 p-[9px] text-left! text-[16px] font-semibold text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                      Login Date & Time
                    </th>
                    <th className="p-[9px] text-left! text-[16px] font-semibold text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                      Login Status
                    </th>
                    <th className="p-[9px] text-left! text-[16px] font-semibold text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                      IP Address
                    </th>
                    <th className="p-[9px] text-left! text-[16px] font-semibold text-white md:text-black border border-[#C8CED3] w-[100px] whitespace-nowrap">
                      ISP
                    </th>
                    <th className="p-[9px] text-left! text-[16px] font-semibold text-white md:text-black border border-[#C8CED3] whitespace-nowrap">
                      City/State/Country
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {staticData.map((row, idx) => (
                    <tr key={idx} className="odd:bg-white">
                      <td className="py-2 px-3 text-sm text-gray-800 border border-[#C8CED3]">
                        {fmtDate(row.createdAt)}
                      </td>

                      <td className="py-2 px-3 text-sm border border-[#C8CED3]">
                        <span
                          className={
                            row.logMessage === "Login Successful"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {row.logMessage}
                        </span>
                      </td>

                      <td className="py-2 px-3 text-sm text-gray-800 border border-[#C8CED3]">
                        {row.ip}
                      </td>

                      <td className="py-2 px-3 text-sm text-gray-800 border border-[#C8CED3]">
                        {row.isp}
                      </td>

                      <td className="py-2 px-3 text-sm text-gray-800 border border-[#C8CED3]">
                        {[row.city, row.state, row.country].filter(Boolean).join(" / ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}

              <table className="w-full border border-[#C8CED3]">
                <thead>
                  <tr className="bg-gradient-to-b from-[#030a12] via-[#444647] to-[#58595a] md:[background:white]">
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
                  </tr>
                </thead>

                <tbody>
                  {staticData.map((row, idx) => (
                    <tr key={idx} className="odd:bg-white">
                      <td className="p-[9px] text-[16px] text-gray-800 border border-[#C8CED3] whitespace-nowrap">
                        {fmtDate(row.createdAt)}
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
                        {[row.city, row.state, row.country].filter(Boolean).join(" / ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
