"use client";
import React, { useState } from "react";

const MMenuTabs = () => {
  const [activeTab, setActiveTab] = useState(10);

  const tabs = [
    { id: 10, label: "INPLAY", hasHeartbeat: true },
    { id: 11, label: "EXCHANGE", hasHeartbeat: false },
    { id: 16, label: "LIVE CASINO", hasHeartbeat: true },
    { id: 98, label: "TIPS & PREVIEWS", hasHeartbeat: false },
  ];

  return (
    <>
      <ul className="flex overflow-x-auto overflow-y-hidden bg-[#4B4E4F] relative shadow-[0_-5px_5px_-5px_rgba(0,0,0,0.5)] scrollbar-none">
        {tabs.map((tab, index) => (
          <li
            key={tab.id}
            className={`flex-1 text-center mb-0 pt-[9px] pb-[9px] ${
              activeTab === tab.id ? "border-t-2 border-white" : ""
            }`}
          >
            <a
              className={`inline-block text-white ${
                index < tabs.length - 1 ? "border-r border-white" : ""
              } px-3 py-0 font-bold whitespace-nowrap no-underline cursor-pointer text-[12px]`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={tab.hasHeartbeat ? "heartbeat-anim" : ""}>
                {tab.label}
              </div>
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        @keyframes zoomInZoomOut {
          0% {
            transform: scale(0.86);
            color: rgb(255, 56, 0);
          }
          50% {
            transform: scale(1.1);
            color: rgb(255, 252, 0);
          }
          100% {
            transform: scale(0.86);
            color: rgb(255, 56, 0);
          }
        }

        .heartbeat-anim {
          transition: 0.3s ease-in;
          animation: zoomInZoomOut 1s ease infinite;
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