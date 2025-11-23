"use client";
import React, { useState } from "react";

const MLiveCasino = () => {
  const [activeTab, setActiveTab] = useState("Popular");

  const tabs = [
    "Popular",
    "Teen Patti",
    "Lucky 7",
    "Dragon Tiger",
    "Baccarat",
    "Andar Bahar",
    "Poker",
    "Bollywood",
    "Region",
    "Other",
    "Virtual",
  ];

  return (
    <div>
      <ul className="flex overflow-x-auto overflow-y-hidden scrollbar-none m-0 p-0 list-none whitespace-nowrap">
        {tabs.map((tab) => (
          <li key={tab} className="inline-block">
            <a
              onClick={() => setActiveTab(tab)}
              className="cursor-pointer"
            >
              <div
                className={`p-2 uppercase text-xs font-bold tracking-wide ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-[#f4b501] to-[#f68700] text-black"
                    : "bg-[#58595a] text-white"
                }`}
                style={{ 
                  padding: "8px",
                  fontFamily: '"Roboto Condensed", sans-serif'
                }}
              >
                <div className="text-center">{tab}</div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MLiveCasino;