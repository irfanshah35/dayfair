/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { items, menuItems, tabs } from "@/lib/projectData";

const MLiveCasino = () => {
  const [activeTab, setActiveTab] = useState("Popular");
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();

  return (
    <div
      className={`lg:bg-white  ${
        pathname === "/live-casino" ? "lg:pt-0 px-[9px]" : "lg:pt-10"
      }`}
    >
      {pathname === "/live-casino" && (
        <div className="relative flex items-center md:mt-[3px] justify-between bg-linear-to-b from-[#030a12] via-[#444647] to-[#58595a] overflow-hidden lg:mb-3 h-[33px]">
          {/* Menu Items */}
          <ul className="flex text-[12px] md:text-[14px] h-[33px] overflow-x-auto scrollbar-none ">
            {menuItems.map((item: any, index: number) => (
              <li key={index}>
                <a href="#" className="block">
                  <div
                    onClick={() => setActiveIndex(index)}
                    className={`text-center px-2 whitespace-nowrap h-[33px] py-[7px] tracking-[-0.10px] border-r border-white font-semibold transition cursor-pointer ${
                      activeIndex === index
                        ? "bg-linear-to-b from-[#f4b501] to-[#f68700] text-black"
                        : item.gradient
                        ? "bg-none text-white"
                        : "text-white"
                    }`}
                  >
                    {item.label.includes("CASINO") ? (
                      <span
                        className={
                          item.label.includes("OUR") ||
                          item.label.includes("VIRTUAL")
                            ? "heartbeat-anim"
                            : ""
                        }
                      >
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* Search Button & Input */}
          <div className=" absolute right-1 top-px">
            <div
              className="w-[30px] absolute right-0 h-[30px] flex justify-center items-center bg-linear-to-b from-[#f4b501] to-[#f68700] text-black cursor-pointer z-30 rounded-full border border-black"
              onClick={() => setSearchActive(!searchActive)}
            >
              {searchActive ? (
                <FaTimes className="text-black relative -top-0.5" size={17} />
              ) : (
                <FaSearch className="text-black relative -top-0.5" size={17} />
              )}
            </div>

            {/* Dropdown Input */}
            <div
              className={`absolute right-1 top-0  h-[30px] z-10 transition-all duration-300 ease-linear overflow-hidden ${
                searchActive ? "w-[200px] opacity-100" : "w-0 opacity-0"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className="w-full h-[30px] px-2 pb-0.5 outline-none rounded-full border border-gray-300 bg-white"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      )}

      {pathname !== "/live-casino" && (
        <div className="min-[992px]:px-2.5 w-full overflow-x-hidden">
          <ul className="flex  bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] no-scrollbar overflow-x-auto overflow-y-hidden scrollbar-none m-0 p-0 list-none whitespace-nowrap">
            {tabs.map((tab) => (
              <li key={tab} className="inline-block border-r  border-white">
                <a onClick={() => setActiveTab(tab)} className="cursor-pointer">
                  <div
                    className={`p-2  text-xs min-[992px]:text-[16px] min-[992px]:font-normal min-[992px]:py-1! min-[992px]:px-[15px]! font-bold tracking-wide ${
                      activeTab === tab
                        ? "bg-linear-to-b from-[#f4b501] to-[#f68700] text-black"
                        : "text-white bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]!"
                    }`}
                    style={{
                      padding: "8px",
                      fontFamily: '"Roboto Condensed", sans-serif',
                    }}
                  >
                    <div className="text-center  tracking-[-0.1px]">{tab}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/*  */}
      <div className="container mx-auto p-1 lg:pt-3">
        <div className="grid grid-cols-3 md:grid-cols-6 lg:gap-y-[15px] mt-3">
          {items.map((item, index) => (
            <div key={index} className="text-center px-2">
              <div className="casino-box">
                <a>
                  <img src={item.img} className={`w-full ${item.class}`} />
                  <div className="casino-bottom">{item.name}</div>
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
