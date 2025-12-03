"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/store";

const DGameList = ({
  sportId,
  sportName,
}: {
  sportId: string;
  sportName: string;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { allEventsList } = useAppStore();
  const [selectedSport, setSelectedSport] = useState<any>();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);

      // If mobile, redirect
      if (mobile) {
        router.push("/");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  useEffect(() => {
    if (allEventsList) {
      const sports = allEventsList[Number(sportId)];
      setSelectedSport(sports);
    }
  }, [allEventsList]);

  return (
    <div className="lg:px-[9px]">
      {/* Desktop View - With Sport Headers, All Sports */}
      <div className="hidden lg:block">
        <div>
          {/* Sport Header */}
          <div className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] text-white mt-1 px-4 h-8 flex items-center font-medium text-[16px] leading-[19px]">
            <h4 className="relative top-[0.1px] font-medium">{sportName}</h4>
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
                  {selectedSport?.length > 0 ? (
                    selectedSport?.map((item: any, idx: number) => (
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
                              {item.inplay ? (
                                <span className="game-icon w-[25px] flex justify-center items-center">
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
      </div>
    </div>
  );
};

export default DGameList;
