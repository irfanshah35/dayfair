"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { marketsSingle } from "@/lib/projectData";
import MSportsTab from "../m-sports-tab";
import { useAppStore } from "@/lib/store/store";
import { formatDateStamp } from "@/lib/functions";
import DSportNav from "@/components/d-view/d-sports-nav";

const MSingleMarket = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("4");
  const [isMobile, setIsMobile] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  const { allEventsList } = useAppStore();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!allEventsList) return;

    const data = allEventsList?.[activeTab];

    setFilteredEvents(data || []);
  }, [allEventsList, activeTab]);

  const odds = [0, 2, 1];
  return (
    <>
      {isMobile ? (
        <MSportsTab activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        <DSportNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      <div className="lg:px-[9px]">
        <div className="lg:hidden overflow-y-auto no-scrollbar max-h-[265px]">
          {filteredEvents.length > 0 ? (
            filteredEvents?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => router.push(`/market-details/${item.event?.id}/${item.eventType?.id}`)}
                className="text-black block no-underline cursor-pointer hover:bg-[#e5eef3]"
              >
                <div className="bg-[#f1f5f8] border-b border-[#d6d8d7] px-3 pt-[5px] pb-[3px]">
                  <div className="flex items-center">
                    <div className="w-2/3 flex flex-col">
                      <p className="mb-0 text-[13px] font-bold leading-tight">
                        {item?.event?.name}
                      </p>
                      <p className="mb-0 text-[12px] leading-tight mt-[2.5px]">
                        {formatDateStamp(item?.marketStartTime)}
                      </p>
                    </div>
                    <div className="w-1/3 text-right">
                      {item?.inplay && (
                        <span className="inline-block">
                          <span className="font-bold text-[12px] relative right-px mr-1 align-top top-[-5px] animate-pulse">
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
                    {odds?.map((o) => (
                      <div key={o} className="w-1/3 flex justify-center">
                        <button className="w-1/2 bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-6 border-0 cursor-pointer">
                          {item?.runners[o]?.ex?.availableToBack[0]?.price ||
                            "-"}
                        </button>
                        <button className="w-1/2 bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-6 border-0 cursor-pointer">
                          {item?.runners[o]?.ex?.availableToLay[0]?.price ||
                            "-"}
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
                {filteredEvents?.length > 0 ? (
                  filteredEvents?.map((item: any, idx: number) => (
                    <tr
                      key={idx}
                      onClick={() => router.push(`/market-details/${item.event?.id}/${item.eventType?.id}`)}
                      className="cursor-pointer border-b border-[#d6d8d7]"
                    >
                      <td className="px-[15px] align-middle">
                        <div className="flex justify-between items-center">
                          <div className="game-name float-left text-left relative bottom-[3px]">
                            <a className="text-[#212529] hover:underline cursor-pointer text-[14px]">
                              {item?.event?.name}
                              {item?.marketStartTime && (
                                <span className="text-[#212529]">
                                  {" "}
                                  / {formatDateStamp(item?.marketStartTime)}
                                </span>
                              )}
                            </a>
                          </div>
                          <div className="game-icons float-right w-auto flex items-center space-x-1 -mt-px">
                            {item?.inplay ? (
                              <span
                                className="game-icon w-[25px] flex justify-center items-center
"
                              >
                                <span className="w-3 h-3 bg-[#28a745] rounded-full inline-block"></span>
                              </span>
                            ) : (
                              <span className="game-icon w-[25px] flex justify-center items-center">
                                <i
                                  className="fas fa-clock text-sm"
                                  style={{ color: "green" }}
                                ></i>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <button className="w-full bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                          {item?.runners[0]?.ex?.availableToBack[0]?.price ||
                            "-"}
                        </button>
                      </td>
                      <td>
                        <button className="w-full bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                          {item?.runners[0]?.ex?.availableToLay[0]?.price ||
                            "-"}
                        </button>
                      </td>

                      <td>
                        <button className="w-full bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                          {item?.runners[2]?.ex?.availableToBack[0]?.price ||
                            "-"}
                        </button>
                      </td>
                      <td>
                        <button className="w-full bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                          {item?.runners[2]?.ex?.availableToLay[0]?.price ||
                            "-"}
                        </button>
                      </td>

                      <td>
                        <button className="w-full bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                          {item?.runners[1]?.ex?.availableToBack[0]?.price ||
                            "-"}
                        </button>
                      </td>
                      <td>
                        <button className="w-full bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                          {item?.runners[1]?.ex?.availableToLay[0]?.price ||
                            "-"}
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
    </>
  );
};

export default MSingleMarket;
