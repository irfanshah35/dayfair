/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppStore } from "@/lib/store/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const MMenuTabs = () => {
  const router = useRouter();
  const pathname = usePathname();

  const exchangeTypeList = useAppStore((state) => state.exchangeTypeList);

  useEffect(() => {
    console.log("exchangeTypeList", exchangeTypeList);
  }, [exchangeTypeList]);

  //  Dynamic active tab based on URL
  const activeTab =
    pathname === "/inplay"
      ? "10"
      : pathname === "/"
      ? "11"
      : pathname === "/live-casino"
      ? "16"
      : pathname === "/m-tipsreview"
      ? "98"
      : "11";

  // Dynamic navigation by exchangeId
  const navigateById = (id: string) => {
    if (id === "10") router.push("/inplay");
    else if (id === "11") router.push("/");
    else if (id === "16") router.push("/live-casino");
    else if (id === "98") router.push("/m-tipsreview");
  };

  return (
    <>
      <ul
        className="flex overflow-x-auto overflow-y-hidden relative shadow-[0_-5px_5px_-5px_rgba(0,0,0,0.5)] scrollbar-none border-0 rounded-none m-0 p-0 flex-nowrap"
        style={{
          background: "linear-gradient(180deg, #030a12, #444647 42%, #58595a)",
        }}
      >
        {exchangeTypeList?.map((tab: any, index: number) => (
          <li
            key={tab.exchangeId}
            className={`flex-[1_1_auto] text-center mb-0 py-2.5 relative ${
              activeTab === tab.exchangeId
                ? "border-t-2 border-white"
                : "border-t-2 border-transparent"
            }`}
            style={{ display: "table-cell" }}
          >
            <a
              className={`mb-[3px] ml-0.5 relative block tracking-[-0.1px] text-white font-bold whitespace-nowrap no-underline cursor-pointer text-[12px] pt-0 pb-0 ${
                index < exchangeTypeList.length - 1 ? "border-r border-white" : ""
              }`}
              onClick={() => navigateById(tab.exchangeId)}
            >
              <div
                className={`
                  ${tab.highlight ? "heartbeat-anim" : ""}
                  ${activeTab === tab.exchangeId ? "relative top-0.5" : ""}
                `}
              >
                {tab.exchangeName}
              </div>
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        @keyframes zoomInZoomOut {
          0% {
            transform: scale(0.865);
            color: rgb(255, 56, 0);
          }
          50% {
            transform: scale(1.097);
            color: rgb(255, 252, 0);
          }
          100% {
            transform: scale(0.865);
            color: rgb(255, 56, 0);
          }
        }

        .heartbeat-anim {
          transition: 0.3s ease-in;
          animation: zoomInZoomOut 1s ease infinite;
          display: inline-block;
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default MMenuTabs;
