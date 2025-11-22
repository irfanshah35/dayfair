"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaHome, FaSearch, FaTimes } from "react-icons/fa";

const MHeader = () => {
  const [searchActive, setSearchActive] = useState(false);
    const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (searchActive && inputRef.current) {
      // Small delay to ensure the input is fully visible before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [searchActive]);

  return (
    <header className="relative overflow-x-clip bg-[#000] text-white px-[5px]">
      {/* Top Row */}
      <div className="flex items-center min-h-[65px]">
        {/* Logo Section */}
        <div className="flex items-center flex-1 pl-[6px]">
          <a className="flex items-center gap-[6px]">
            <FaHome 
              className="text-white cursor-pointer"
              size={26}
              tabIndex={0}
            />
            <Image
              src="/dayfair-logo.svg"
              alt="Logo"
              width={100}
              height={65}
              className="h-[65px] w-[100px]"
              tabIndex={0}
            />
          </a>
        </div>

        {/* Login Button */}
        <div className="flex-1 flex justify-end">
          <button 
            className="h-[30px] w-[80px] rounded-[3.875px] text-sm font-bold text-black border-0 cursor-pointer hover:opacity-90 transition-opacity max-[322px]:text-[10px]"
            style={{
              background: 'linear-gradient(-180deg, #f4b501 0%, #f68700 100%)'
            }}
            tabIndex={0}
          >
            LOGIN
          </button>
        </div>
      </div>

      {/* Search Bar Row */}
        <div className="relative min-h-[35px] px-[5px] ml-1 pb-2">
        <div className="absolute left-0 top-[5px] z-10 max-[322px]:w-[77%]">
          <div 
            className={`bg-white rounded-full flex items-center transition-all duration-700 ease-in-out ${
              searchActive ? 'w-[185px]' : 'w-[25px]'
            }`}
          >
            <input
              ref={inputRef}
              id="searchEventmobile"
              type="text"
              autoComplete="off"
              className={`bg-transparent text-black border-0 outline-0 h-[25px] transition-all duration-700 ease-in-out placeholder:text-gray-400 ${
                searchActive ? 'w-full pl-3 pr-1 opacity-100' : 'w-0 opacity-0 pl-0 pr-0'
              }`}
            />
            <button 
              className="flex items-center justify-center h-[22px] w-[25px] rounded-full cursor-pointer shrink-0 bg-white hover:bg-gray-100 transition-colors"
              onClick={() => setSearchActive(!searchActive)}
              aria-label={searchActive ? "Close search" : "Open search"}
            >
              <div className="transition-transform duration-500 ease-in-out">
                {searchActive ? (
                  <FaTimes className="text-black animate-[fadeIn_0.3s_ease-in-out]" size={14} />
                ) : (
                  <FaSearch className="text-black animate-[fadeIn_0.3s_ease-in-out]" size={14} />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </header>
  );
};

export default MHeader;