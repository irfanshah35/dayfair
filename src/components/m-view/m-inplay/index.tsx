"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/store";
import MSportsTab from "../m-sports-tab";

interface MInplayProps {
  activeTab?: string;
}

const MInplay = () => {
  const { allEventsList } = useAppStore();
  const [activeTab, setActiveTab] = useState("4");
  const router = useRouter();
  const [inPlayEvents, setInPlayEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!allEventsList) {
      setInPlayEvents([]);
      return;
    }

    const filtered = Object.values(allEventsList)
      .flat()
      .filter((ev: any) => ev?.inplay === true);

    console.log("🔥 In-Play Events:", filtered);
    setInPlayEvents(filtered);
  }, [allEventsList]);

  // Group events by sport using useMemo
  const groupedBySport = useMemo(() => {
    return inPlayEvents.reduce((acc, ev) => {
      const sport = ev.eventType?.name || "Other";
      const sportId = ev.eventType?.id;
      if (!acc[sport]) acc[sport] = { events: [], sportId };
      acc[sport].events.push(ev);
      return acc;
    }, {} as Record<string, { events: any[]; sportId: number }>);
  }, [inPlayEvents]);

  // Define sport order
  const sortedSports = useMemo(() => {
    const sportOrder = ["Cricket", "Tennis", "Soccer"];
    return Object.keys(groupedBySport).sort((a, b) => {
      const indexA = sportOrder.indexOf(a);
      const indexB = sportOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [groupedBySport]);

  // Calculate mobile events based on active tab
  const mobileEvents = useMemo(() => {
    if (!activeTab) {
      return sortedSports.flatMap((sport) => groupedBySport[sport].events);
    }

    // Filter only events that match the active tab ID
    const filtered = inPlayEvents.filter(
      (ev: any) => ev.eventType?.id === activeTab
    );

    return filtered;
  }, [activeTab, inPlayEvents, sortedSports, groupedBySport]);

  const renderEventCard = (item: any, idx: number) => (
    <div
      key={idx}
      onClick={() =>
        router.push(`/market-details/${item.eventType?.id}/${item.event?.id}`)
      }
      className="text-black block no-underline cursor-pointer hover:bg-[#e5eef3]"
    >
      <div className="bg-[#f1f5f8] border-b border-[#d6d8d7] px-3 pt-[5px] pb-[3px]">
        <div className="flex items-center">
          <div className="w-2/3 flex flex-col">
            <p className="mb-0 text-[13px] font-bold leading-tight">
              {item.runnersName?.[0]?.runnerName} v{" "}
              {item.runnersName?.[1]?.runnerName}
            </p>
          </div>
          <div className="w-1/3 text-right">
            {item.inplay && (
              <span className="inline-block">
                <span className="font-bold text-[12px] relative right-px mr-1 align-top top-[-5px] animate-pulse">
                  INPLAY
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex mt-0.5">
          <div className="w-1/3 text-center text-[12px] font-semibold">1</div>
          <div className="w-1/3 text-center text-[12px] font-semibold">X</div>
          <div className="w-1/3 text-center text-[12px] font-semibold">2</div>
        </div>

        <div className="flex">
          {/* Runner 1 odds */}
          <div className="w-1/3 flex justify-center">
            <button className="w-1/2 bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-6 border-0 cursor-pointer">
              {item.runners?.[0]?.ex?.availableToBack?.[0]?.price || "-"}
            </button>
            <button className="w-1/2 bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-6 border-0 cursor-pointer">
              {item.runners?.[0]?.ex?.availableToLay?.[0]?.price || "-"}
            </button>
          </div>

          {/* Draw/X odds (Runner 3 if exists, or show "-") */}
          <div className="w-1/3 flex justify-center">
            <button className="w-1/2 bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-6 border-0 cursor-pointer">
              {item.runners?.[2]?.ex?.availableToBack?.[0]?.price || "-"}
            </button>
            <button className="w-1/2 bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-6 border-0 cursor-pointer">
              {item.runners?.[2]?.ex?.availableToLay?.[0]?.price || "-"}
            </button>
          </div>

          {/* Runner 2 odds */}
          <div className="w-1/3 flex justify-center">
            <button className="w-1/2 bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-6 border-0 cursor-pointer">
              {item.runners?.[1]?.ex?.availableToBack?.[0]?.price || "-"}
            </button>
            <button className="w-1/2 bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-6 border-0 cursor-pointer">
              {item.runners?.[1]?.ex?.availableToLay?.[0]?.price || "-"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:px-[9px]">
      {/* Mobile View - No Sport Headers, Filtered by Active Tab */}
      <div className="lg:hidden">
        <MSportsTab activeTab={activeTab} setActiveTab={setActiveTab} />
        {mobileEvents.length > 0 ? (
          <div className="overflow-y-auto no-scrollbar max-h-[265px]">
            {mobileEvents.map((item: any, idx: number) => {
              console.log(mobileEvents);
              return renderEventCard(item, idx);
            })}
          </div>
        ) : (
          <div className="text-center bg-[#ccc] pt-2 pb-[9px] px-[15px] mb-[25px] text-[12px] text-[#21252a]">
            No real-time records available for this tab
          </div>
        )}
      </div>

      {/* Desktop View - With Sport Headers, All Sports */}
      <div className="hidden lg:block">
        {sortedSports.map((sport) => {
          const events = groupedBySport[sport].events;

          return (
            <div key={sport}>
              {/* Sport Header */}
              <div className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white mt-1 px-4 h-8 flex items-center font-medium text-[16px] leading-[19px]">
                <h4 className="relative top-[0.1px] font-medium">{sport}</h4>
              </div>

              {/* Desktop Table */}
              <div className="w-full">
                <div className="bg-white">
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
                      {events.length > 0 ? (
                        events.map((item: any, idx: number) => (
                          <tr
                            key={idx}
                            onClick={() =>
                              router.push(
                                `/market-details/${item.eventType?.id}/${item.event?.id}`
                              )
                            }
                            className="cursor-pointer border-b border-[#d6d8d7]"
                          >
                            <td className="px-[15px] align-middle">
                              <div className="flex justify-between items-center">
                                <div className="game-name float-left text-left relative bottom-[3px]">
                                  <a className="text-[#212529] hover:underline cursor-pointer text-[14px]">
                                    {item.runnersName?.[0]?.runnerName} v{" "}
                                    {item.runnersName?.[1]?.runnerName}
                                  </a>
                                </div>
                                <div className="game-icons float-right w-auto flex items-center space-x-1 -mt-px">
                                  {item.inplay && (
                                    <span className="game-icon w-[25px] flex justify-center items-center">
                                      <span className="w-3 h-3 bg-[#28a745] rounded-full inline-block"></span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Runner 1 odds */}
                            <td>
                              <button className="w-full bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                                {item.runners?.[0]?.ex?.availableToBack?.[0]
                                  ?.price || "-"}
                              </button>
                            </td>
                            <td>
                              <button className="w-full bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                                {item.runners?.[0]?.ex?.availableToLay?.[0]
                                  ?.price || "-"}
                              </button>
                            </td>

                            {/* Draw/X odds (Runner 3 if exists) */}
                            <td>
                              <button className="w-full bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                                {item.runners?.[2]?.ex?.availableToBack?.[0]
                                  ?.price || "-"}
                              </button>
                            </td>
                            <td>
                              <button className="w-full bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                                {item.runners?.[2]?.ex?.availableToLay?.[0]
                                  ?.price || "-"}
                              </button>
                            </td>

                            {/* Runner 2 odds */}
                            <td>
                              <button className="w-full bg-[#72bbef] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                                {item.runners?.[1]?.ex?.availableToBack?.[0]
                                  ?.price || "-"}
                              </button>
                            </td>
                            <td>
                              <button className="w-full bg-[#faa9ba] text-[#273a47] text-[14px] font-bold h-[25px] border-0 cursor-pointer min-w-10">
                                {item.runners?.[1]?.ex?.availableToLay?.[0]
                                  ?.price || "-"}
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
        })}
      </div>
    </div>
  );
};

export default MInplay;
