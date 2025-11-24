/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const MMenuTabs = () => {
  const [activeTab, setActiveTab] = useState(10);
  const router = useRouter();

  const tabs = [
    { id: 10, label: "INPLAY", hasHeartbeat: true, },
    { id: 11, label: "EXCHANGE", hasHeartbeat: false, },
    { id: 16, label: "LIVE CASINO", hasHeartbeat: true, },
    { id: 98, label: "TIPS & PREVIEWS", hasHeartbeat: false, },
  ];


  const goToLogin = (tab: any) => {
    setActiveTab(tab.id)
    if (tab.id === 10) {
      router.push("");
    } else if (tab.id === 11) {
      router.push("");
    } else if (tab.id === 16) {
      router.push("");
    } else if (tab.id === 98) {
      router.push("/m-tipsreview");
    }
  };

  return (
    <>
      <ul className="flex overflow-x-auto overflow-y-hidden relative  shadow-[0_-5px_5px_-5px_rgba(0,0,0,0.5)] scrollbar-none border-0 rounded-none m-0 p-0 flex-nowrap" style={{ background: 'linear-gradient(180deg, #030a12, #444647 42%, #58595a)' }}>
        {tabs.map((tab, index) => (
          <li
            key={tab.id}
            className={`flex-[1_1_auto] text-center mb-0 py-2.5 relative ${activeTab === tab.id ? "border-t-2 border-white" : "border-t-2 border-transparent"
              }`}
            style={{ display: 'table-cell' }}
          >
            <a
              className={`mb-[3px] ml-0.5 relative block text-white font-bold whitespace-nowrap no-underline cursor-pointer text-[12px]  pt-0 pb-0 ${index < tabs.length - 1 ? "border-r border-white" : ""
                }`}
              style={{
                textDecoration: 'none',
                borderRadius: 0,
              }}
              onClick={() => goToLogin(tab)}
            >
              <div
                className={`
    ${tab.hasHeartbeat ? "heartbeat-anim" : ""}
       ${tab.label === "EXCHANGE" ? "relative top-0.5" : ""}
  `} >
                {tab.label}
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