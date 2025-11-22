"use client";
import React from "react";
import Image from "next/image";

const MHeader = () => {
  return (
    <header className="w-full bg-black text-white shadow-lg">
      <div className="h-[68px] w-full flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">

          <div className="flex items-center">
            <Image
              src="/assets/dayfair-logo.svg"
              width={120}
              height={65}
              alt="logo"
              className="h-[65px] w-auto"
            />
          </div>
        </div>

        <button className="bg-[#FFA500] hover:bg-[#ff9300] text-black font-bold px-6 py-2 rounded-sm text-sm">
          LOGIN
        </button>
      </div>

      <div className="md:hidden w-full bg-black border-t border-gray-700 px-4 py-[5px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="bg-transparent border-b border-white w-[150px] text-white text-sm outline-none"
            placeholder="Search"
          />
        </div>
      </div>
    </header>
  );
};

export default MHeader;
