"use client";
import React from "react";
import { useRouter } from "next/navigation";

const MSingleMarket = () => {
  const router = useRouter();

  const markets = [
    {
      match: "Otago Volts v Canterbury Kings ",
      time: "23/11/2025 04:00 AM",
      inplay: true,
      odds: [
        { back: 1.37, lay: 1.42 },
        { back: 3.25, lay: 3.3 },
        { back: 1.88, lay: 1.92 },
      ],
    },
    {
      match: "India v Australia",
      time: "25/11/2025 07:00 PM",
      inplay: false,
      odds: [
        { back: 1.55, lay: 1.6 },
        { back: 3.45, lay: 3.5 },
        { back: 2.1, lay: 2.15 },
      ],
    },
    {
      match: "England v Pakistan",
      time: "01/12/2025 03:00 PM",
      inplay: true,
      odds: [
        { back: 1.9, lay: 1.95 },
        { back: 3.1, lay: 3.15 },
        { back: 2.4, lay: 2.45 },
      ],
    },
    {
      match: "India v South Africa",
      time: "23/11/2025 04:00 AM",
      inplay: true,
      odds: [
        { back: 1.37, lay: 1.42 },
        { back: 3.25, lay: 3.3 },
        { back: 1.88, lay: 1.92 },
      ],
    },
    {
      match: "India v Australia",
      time: "25/11/2025 07:00 PM",
      inplay: false,
      odds: [
        { back: 1.55, lay: 1.6 },
        { back: 3.45, lay: 3.5 },
        { back: 2.1, lay: 2.15 },
      ],
    },
    {
      match: "England v Pakistan",
      time: "01/12/2025 03:00 PM",
      inplay: true,
      odds: [
        { back: 1.9, lay: 1.95 },
        { back: 3.1, lay: 3.15 },
        { back: 2.4, lay: 2.45 },
      ],
    },
    {
      match: "India v South Africa",
      time: "23/11/2025 04:00 AM",
      inplay: true,
      odds: [
        { back: 1.37, lay: 1.42 },
        { back: 3.25, lay: 3.3 },
        { back: 1.88, lay: 1.92 },
      ],
    },
    {
      match: "India v Australia",
      time: "25/11/2025 07:00 PM",
      inplay: false,
      odds: [
        { back: 1.55, lay: 1.6 },
        { back: 3.45, lay: 3.5 },
        { back: 2.1, lay: 2.15 },
      ],
    },
    {
      match: "England v Pakistan",
      time: "01/12/2025 03:00 PM",
      inplay: true,
      odds: [
        { back: 1.9, lay: 1.95 },
        { back: 3.1, lay: 3.15 },
        { back: 2.4, lay: 2.45 },
      ],
    },
    {
      match: "India v South Africa",
      time: "23/11/2025 04:00 AM",
      inplay: true,
      odds: [
        { back: 1.37, lay: 1.42 },
        { back: 3.25, lay: 3.3 },
        { back: 1.88, lay: 1.92 },
      ],
    },
    {
      match: "India v Australia",
      time: "25/11/2025 07:00 PM",
      inplay: false,
      odds: [
        { back: 1.55, lay: 1.6 },
        { back: 3.45, lay: 3.5 },
        { back: 2.1, lay: 2.15 },
      ],
    },
    {
      match: "England v Pakistan",
      time: "01/12/2025 03:00 PM",
      inplay: true,
      odds: [
        { back: 1.9, lay: 1.95 },
        { back: 3.1, lay: 3.15 },
        { back: 2.4, lay: 2.45 },
      ],
    },
  ];

  return (
    <div>
      <div className="lg:hidden overflow-y-auto max-h-[265px]">
        {markets.length > 0 ? (
          markets.map((item, idx) => (
            <div
              key={idx}
              onClick={() => router.push("/market-details")}
              className="text-black block no-underline cursor-pointer hover:bg-[#e5eef3]"
            >
              <div className="bg-[#f1f5f8] border-b border-[#d6d8d7] px-3 pt-[5px] pb-[3px]">
                <div className="flex items-center">
                  <div className="w-2/3 flex flex-col">
                    <p className="mb-0 text-[13px] font-bold leading-tight">
                      {item.match}
                    </p>
                    <p className="mb-0 text-[12px] leading-tight mt-[2.5px]">
                      {item.time}
                    </p>
                  </div>
                  <div className="w-1/3 text-right">
                    {item.inplay && (
                      <span className="inline-block">
                        <span className="font-bold text-[12px] relative right-[1px] mr-1 align-top relative top-[-5px] animate-pulse">
                          INPLAY
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex mt-0.5">
                  <div className="w-1/3 text-center text-[12px] font-semibold">
                    1
                  </div>
                  <div className="w-1/3 text-center text-[12px] font-semibold">
                    X
                  </div>
                  <div className="w-1/3 text-center text-[12px] font-semibold">
                    2
                  </div>
                </div>

                <div className="flex">
                  {item.odds.map((o, i) => (
                    <div key={i} className="w-1/3 flex justify-center">
                      <button className="w-1/2 bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[24px] border-0 cursor-pointer">
                        {o.back}
                      </button>
                      <button className="w-1/2 bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[24px] border-0 cursor-pointer">
                        {o.lay}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center bg-[#ccc] pt-2 pb-[9px] px-[15px] mb-[25px] text-[12px] text-[#21252a]">
            No Real time record is available
          </div>
        )}
      </div>

      <div className="hidden lg:block w-full">
        <div className="bg-white px-[9px]">
          <table className="w-full coupon-table">
            <thead>
              <tr className="bg-white border-b-2 border-[#dee2e6]">
                <th className="w-[63%] text-left pt-1 pb-[5px] px-[15px] text-[12px] text-[#303030]">
                  Game
                </th>
                <th
                  colSpan={2}
                  className="text-center pt-1 pb-[5px] px-[15px] text-[12px] font-bold text-[#303030]"
                >
                  1
                </th>
                <th
                  colSpan={2}
                  className="text-center pt-1 pb-[5px] px-[15px] text-[12px] font-bold text-[#303030]"
                >
                  X
                </th>
                <th
                  colSpan={2}
                  className="text-center pt-1 pb-[5px] px-[15px] text-[12px] font-bold text-[#303030]"
                >
                  2
                </th>
              </tr>
            </thead>
            <tbody>
              {markets.length > 0 ? (
                markets.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => router.push("/market-details")}
                    className="cursor-pointer border-b border-[#d6d8d7]"
                  >
                    <td className="px-[15px] align-middle">
                      <div className="flex justify-between items-center">
                        <div className="game-name float-left text-left relative bottom-[3px]">
                          <a className="text-[#212529] hover:underline cursor-pointer text-[14px]">
                            {item.match}
                            {item.time && (
                              <span className="text-[#212529]">
                                {" "}
                                / {item.time}
                              </span>
                            )}
                          </a>
                        </div>
                        <div className="game-icons float-right w-auto flex items-center space-x-1">
                          {item.inplay && (
                            <span className="game-icon w-[25px] flex justify-center items-center
">
                              <span className="w-3 h-3 bg-[#28a745] rounded-full inline-block"></span>
                            </span>
                          )}

                          {!item.inplay && (
                            <span className="game-icon">
                              <i className="fas fa-clock text-green-600 text-sm"></i>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <button className="w-full bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                        {item.odds[0].back}
                      </button>
                    </td>
                    <td>
                      <button className="w-full bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                        {item.odds[0].lay}
                      </button>
                    </td>

                    <td>
                      <button className="w-full bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                        {item.odds[1].back || "0"}
                      </button>
                    </td>
                    <td>
                      <button className="w-full bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                        {item.odds[1].lay || "0"}
                      </button>
                    </td>

                    <td>
                      <button className="w-full bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                        {item.odds[2].back}
                      </button>
                    </td>
                    <td>
                      <button className="w-full bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                        {item.odds[2].lay}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center bg-[#ccc] py-2 px-4 text-[16px] text-[#21252a]"
                  >
                    No real-time records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MSingleMarket;
