"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store/store";

const MLiveCasino = () => {
  const [activeIndex, setActiveIndex] = useState("1");
  const { casinoEvents } = useAppStore();
  const pathname = usePathname();
  useEffect(() => {
    console.log("casinoEvents", casinoEvents);
  }, [casinoEvents]);

  const filteredItems = React.useMemo(() => {
    if (!casinoEvents?.lobby?.length) return [];
    if (activeIndex === "1") {
      return casinoEvents.lobby.filter((item: any) => item.popular);
    }
    return casinoEvents.lobby.filter((item: any) => item.menuId === activeIndex);
  }, [casinoEvents, activeIndex]);
  return (
    <div
      className={`lg:bg-white ${pathname === "/live-casino" ? "lg:pt-1" : "lg:pt-8"
        } lg:px-3`}
    >
      <div className="relative shadow-[0_8px_8px_-7px_rgb(33,37,41)] flex items-center md-mt-[1px] min-[992px]:mt-0.75 justify-between bg-linear-to-b from-[#030a12] via-[#444647] to-[#58595a] overflow-hidden lg:mb-3 h-8 min-[992px]:h-8.25">
        {/* Menu Items */}
        <ul className="flex overflow-x-auto no-scrollbar">
          {casinoEvents?.menu?.map((item: any, index: number) => (
            <li key={index}>
              <a href="#" className="block">
                <div
                  onClick={() => setActiveIndex(item?.menuId)}
                  className={`font-semibold text-center px-[15] whitespace-nowrap h-8.25 py-1 tracking-[-0.10px] border-r border-white transition cursor-pointer ${activeIndex === item?.menuId
                    ? "bg-linear-to-b from-[#f4b501] to-[#f68700] text-black"
                    : item.gradient
                      ? "bg-none text-white"
                      : "text-white"
                    }`}
                >
                  {item?.menuName}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/*  */}
      <div className="container mx-auto p-1 lg:pt-3">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-0.5 lg:gap-y-3.75 mt-3">
          {filteredItems?.map((item: any, index: number) => (
            <div key={index} className="text-center px-1 min-[992px]:px-2">
              <div className="casino-box">
                <a>
                  <img
                    alt=""
                    src={item?.url}
                    className={`w-full ${item.class}`}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="casino-bottom">{item?.eventName}</div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MLiveCasino;
