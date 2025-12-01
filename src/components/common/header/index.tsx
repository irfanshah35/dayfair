"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaHome, FaSearch, FaSearchPlus, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RulesModal from "@/components/modals/rules-modal";
import { useAuthStore } from "@/lib/store/authStore";
import { useAppStore } from "@/lib/store/store";

const Header = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLLIElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isrulesopen, setRulesOpen] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const {userBalance} = useAppStore();

  const goToLogin = () => {
    router.push("/login");
  };

  React.useEffect(() => {
    if (searchActive && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [searchActive]);

  useEffect(() => {
    console.log(userBalance)
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        wrapperRef.current &&
        target &&
        !wrapperRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative min-h-[65px] md:min-h-20 overflow-x-clip bg-black text-white px-[5px]">
      {/* Top Row */}
      <div className="flex items-center">
        {/* Logo Section */}
        <div className="flex items-center md:h-[66px] flex-1 pl-1.5 md:flex-[0_0_auto] md:w-1/4">
          <Link href={"/"} className="flex items-center gap-1.5">
            <FaHome
              className="text-white relative bottom-px cursor-pointer mt-0.5 md:hidden"
              size={26}
              tabIndex={0}
            />
            <Image
              src="/dayfair-logo.svg"
              alt="Logo"
              width={100}
              height={65}
              className="h-[65px] w-[100px] md:h-20 md:w-40 md:pt-2"
              tabIndex={0}
            />
          </Link>
        </div>

        {/* Login Button */}
        <div className="flex justify-end w-full md:h-[66px] flex-1">
          <div className="hidden md:flex md:ml-[17px] p-1 items-center justify-end flex-[0_0_auto] w-[83.33333333%] max-w-full">
            <ul className="hidden md:flex list-none mt-2.5 mb-3 items-center pl-8">
              <li
                ref={wrapperRef}
                className="mr-5 relative float-left flex items-start"
              >
                <input
                  type="text"
                  placeholder="All Events"
                  className={`
          h-[38px] border-0 p-0 outline-0 placeholder:text-black
          bg-[linear-gradient(180deg,#fff_0%,#fff_100%)] text-black
          transition-[width] duration-400 ease-linear
          ${open ? "w-[300px] px-2.5" : "w-0 px-0"}
        `}
                />

                <FaSearchPlus
                  className="text-white ml-2.5 mt-[5px] cursor-pointer"
                  size={24}
                  onClick={() => setOpen(!open)}
                />
              </li>
              <li className="mr-[17px] ml-[15px] float-left cursor-pointer hover:underline">
                <b className="text-[16px]" onClick={() => setRulesOpen(true)}>
                  Rules
                </b>
              </li>
            </ul>
          </div>
<div className="w-[110%] gap-1 flex items-center">
  <div className="flex-1 md:hidden">
    {/* Mobile balance (ignore for now as requested) */}
  </div>

  <div className="hidden md:flex items-center justify-end gap-6 pr-4">

  {/* {isLoggedIn && (
  <div className="flex flex-col text-[13px] font-bold text-white leading-[14px]">
    <span>
      BALANCE : <span className="userTotalBalance">{0}</span>
    </span>
    <span>
      EXPOSURE : <span className="userTotalExposure">{0}</span>
    </span>
  </div>
)} */}



    {/* BUTTON SECTION */}
    <div className="flex">
      {!isLoggedIn ? (
        // LOGIN BUTTON
        <button
          onClick={goToLogin}
          className="h-[30px] border w-[89.5px] border-black rounded-[3.875px] text-sm font-semibold text-black cursor-pointer hover:opacity-90 transition-opacity max-[322px]:text-[10px] md:w-[108px] md:font-bold"
          style={{
            background:
              "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)",
          }}
          tabIndex={0}
        >
          LOGIN
        </button>
      ) : (
        <button
          onClick={() => router.push("/account")}
          className="h-[30px] border w-[110px] border-black rounded-[3.875px] text-sm font-semibold text-black cursor-pointer hover:opacity-90 transition-opacity md:w-[108px] md:font-bold"
          style={{
            background:
              "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)",
          }}
        >
          ACCOUNT
        </button>
      )}
    </div>
  </div>
</div>

        </div>
      </div>

      <div className="relative flex min-h-[35px]  ml-1 pb-2 md:hidden">
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
            ${
              searchActive
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

      <RulesModal open={isrulesopen} onClose={() => setRulesOpen(false)} />
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

export default Header;
