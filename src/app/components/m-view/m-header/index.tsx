"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaHome, FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MHeader = () => {
  const [searchActive, setSearchActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const goToLogin = () => {
    router.push("/mlogin");
  };

  React.useEffect(() => {
    if (searchActive && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [searchActive]);

  return (
    <header className="relative overflow-x-clip bg-black text-white px-[5px]">
      {/* Top Row */}
      <div className="flex items-center min-h-[65px]">
        {/* Logo Section */}
        <div className="flex items-center flex-1 pl-1.5">
          <Link href={'/'} className="flex items-center gap-1.5">
            <FaHome
              className="text-white relative bottom-px cursor-pointer mt-0.5"
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
          </Link>
        </div>

        {/* Login Button */}
        <div className="flex justify-end w-full  flex-1">
          <div className="w-[110%] gap-1 flex">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={goToLogin}
                className="h-[30px] w-full border border-black rounded-[3.875px] text-sm font-semibold text-black cursor-pointer hover:opacity-90 transition-opacity max-[322px]:text-[10px]"
                style={{
                  background:
                    "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)",
                }}
                tabIndex={0}
              >
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Row */}
      <div className="relative flex min-h-[35px]  ml-1 pb-2">
        {/* LEFT SIDE (50%) */}
        <div className="relative ">
          <div className="absolute left-0 top-[5px] z-10 w-[184px]">
            <div
              className={`
          bg-white rounded-full flex items-center 
          transition-all duration-500 ease-linear
          ${searchActive ? "w-full" : "w-[25px]"}
        `}
            >
              {/* SEARCH INPUT */}
              <input
                ref={inputRef}
                id="searchEventmobile"
                type="text"
                autoComplete="off"
                className={`
            bg-transparent text-black border-0 outline-0 h-[25px]
            transition-all duration-500 ease-linear text-[12px]  
            ${searchActive
                    ? "w-[calc(100%-25px)] pl-2.5 pr-2 opacity-100"
                    : "w-0 opacity-0 pl-0 pr-0"
                  }
          `}
              />

              {/* SEARCH / CROSS ICON (INSIDE!) */}
              <button
                onClick={() => setSearchActive(!searchActive)}
                className="flex items-center justify-center h-[25px] w-[25px] shrink-0"
              >
                {searchActive ? (
                  <FaTimes className="text-black ml-0.5" size={13} />
                ) : (
                  <FaSearch className="text-black ml-0.5" size={13} />
                )}
              </button>
            </div>
          </div>
          <div className="flex-[0_0_50%] max-w-[50%] text-right"></div>
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
