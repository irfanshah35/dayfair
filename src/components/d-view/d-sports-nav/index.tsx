"use client";
import { useAppStore } from "@/lib/store/store";
import React, { useEffect, useState } from "react";

const DSportNav = ({
  setActiveTab,
  activeTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) => {
  const menuList = useAppStore((state) => state.menuList);
  const [eventTypes, setEventTypes] = useState<any[]>([]);

  useEffect(() => {
    const types = menuList?.eventTypes || [];
    setEventTypes(types);
  }, [menuList]);

  return (
    <div className="w-full px-[9px]">
      <ul
        className="
        flex 
        overflow-x-scroll 
        list-none 
        mt-[3px]
        mb-0 
        ml-0.5 
        pl-0 
        pt-0
        [scrollbar-width:none]
        bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]
        no-scrollbar
      "
      >
        {eventTypes?.map((sport: any) => (
          <li
            key={sport?.eventType?.id}
            onClick={() => setActiveTab(sport?.eventType?.id)}
            className={`
              px-[15px] py-1
              cursor-pointer
              border-r border-white
              min-w-max
              text-[16px]
              select-none
              ${
                activeTab === sport?.eventType?.id
                  ? "text-black bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]"
                  : "text-white"
              }
            `}
          >
            <a>{sport?.eventType?.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DSportNav;
