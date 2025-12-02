"use client";
import { useAppStore } from "@/lib/store/store";
import { useEffect } from "react";

const MSportsTab = ({
  setActiveTab,
  activeTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) => {
  const menuList = useAppStore((state) => state.menuList);
  const eventTypes = menuList?.eventTypes || [];

  useEffect(() => {
    console.log("menuList", menuList);
    console.log("eventTypes", eventTypes);
  }, [menuList]);

  return (
    <div className="w-full">
      <ul className="flex list-none bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] mb-0 pl-0 overflow-x-scroll">
        {eventTypes.map((item: any) => (
          <li key={item.eventType.id}>
            <a
              id={`${item.eventType.id}`}
              className="no-underline cursor-pointer"
              onClick={() => setActiveTab(item.eventType.id)}
            >
              <div
                className={`flex flex-col text-center text-[12px] p-2 pb-[3px] min-w-max relative text-white
                  ${
                    activeTab === item.eventType.id
                      ? "bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]"
                      : "bg-transparent"
                  }
                `}
              >
                <div>
                  <div className="flex justify-center mb-[5px]">
                    <img
                      src="/assets/transparent-login.gif"
                      className={`w-5 h-5 sprite ${item.icon}`}
                      alt={item.eventType.name}
                    />
                  </div>
                  <div className="text-[12px] font-semibold uppercase tracking-[-0.1px]">
                    {item.eventType.name}
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* Pass activeTab to MInplay component */}
      {/* <MInplay activeTabId={activeTab} /> */}
    </div>
  );
};

export default MSportsTab;
