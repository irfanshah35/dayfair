"use client";

import React from "react";

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

  return (
    <div className="mx-1 my-1.5">
      <div className="border border-gray-200 rounded-md text-white">
        {/* Header */}
        <div
          className="
    px-4   py-[0.218px]
    border-b border-[rgba(0,0,0,0.175)] 
    rounded-t 
    bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]
  "
        >
          <span className="text-[24px] font-semibold font-roboto ">Activity Log</span>
        </div>

        {/* Table Wrapper */}
        <div className="py-3 md:py-5.5 px-2 md:px-2">
          <div className="overflow-x-auto">
            <table className="w-full border border-[#C8CED3]">
              <thead>
                <tr>
                  <th className=" min-w-40 py-2 px-3 text-left! text-sm font-semibold text-gray-700 border border-[#C8CED3]">
                    Login Date & Time
                  </th>
                  <th className="py-2 px-3 text-left! text-sm font-semibold text-gray-700 border border-[#C8CED3]">
                    Login Status
                  </th>
                  <th className="py-2 px-3 text-left! text-sm font-semibold text-gray-700 border border-[#C8CED3]">
                    IP Address
                  </th>
                  <th className="py-2 px-3 text-left! text-sm font-semibold text-gray-700 border border-[#C8CED3] w-[100px]">
                    ISP
                  </th>
                  <th className="py-2 px-3 text-left! text-sm font-semibold text-gray-700 border border-[#C8CED3]">
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
            </table>

          </div>
        </div>
      </div>
    </div>
  );
}
