"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaHome, FaSearch, FaSearchPlus, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RulesModal from "@/components/modals/rules-modal";
import { useAuthStore } from "@/lib/store/authStore";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import ExposureModal from "@/components/modals/exposure-modal";

interface Match {
  sport: string;
  market: string;
  name: string;
  datetime: string;
}

const matches: Match[] = [
  {
    sport: "Cricket",
    market: "MATCH_ODDS",
    name: "New Zealand v West Indies",
    datetime: "3/12/2025 02:09 AM",
  },
  {
    sport: "Cricket",
    market: "MATCH_ODDS",
    name: "Australia v England",
    datetime: "3/12/2025 02:09 AM",
  },
  {
    sport: "Cricket",
    market: "MATCH_ODDS",
    name: "Australia v England",
    datetime: "3/12/2025 02:09 AM",
  },
  {
    sport: "Cricket",
    market: "MATCH_ODDS",
    name: "Australia v England",
    datetime: "3/12/2025 02:09 AM",
  },
  {
    sport: "Cricket",
    market: "MATCH_ODDS",
    name: "Australia v England",
    datetime: "3/12/2025 02:09 AM",
  },
  {
    sport: "Cricket",
    market: "MATCH_ODDS",
    name: "Australia v England",
    datetime: "3/12/2025 02:09 AM",
  },
  {
    sport: "Cricket",
    market: "MATCH_ODDS",
    name: "India v South Africa",
    datetime: "3/12/2025 02:09 AM",
  },
  {
    sport: "Soccer",
    market: "MATCH_ODDS",
    name: "Sporting Cristal v Alianza Lima",
    datetime: "3/12/2025 02:09 AM",
  },
  {
    sport: "Cricket",
    market: "MATCH_ODDS",
    name: "Nigeria v Zambia",
    datetime: "3/12/2025 02:09 AM",
  },
];

const Header = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [userBalance, setUserBalance] = useState<any>();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLLIElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isrulesopen, setRulesOpen] = useState(false);
  const [isaccountopen, setAccountOpen] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isexposureopen, setExposureOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);

  const goToLogin = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    } else {
      setAccountOpen(!isaccountopen);
    }
  };
  const closeAccountDropdown = () => {
    setAccountOpen(false);
  };

  React.useEffect(() => {
    if (searchActive && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [searchActive]);

  useEffect(() => {
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchData({
        url: CONFIG.getUserBalance,
        payload: { key: CONFIG.siteKey },
        setFn: setUserBalance,
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // filtering

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setFilteredMatches([]);
      return;
    }

    const filtered = matches.filter((m) =>
      m.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMatches(filtered);
  };

  const handleSelect = (match: Match) => {
    setQuery(match.name);
    setFilteredMatches([]);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setFilteredMatches([]);
      }
    };
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
        <div className="flex flex-col md:flex-row justify-end w-full md:h-[66px] flex-1">
          <div className="hidden md:flex md:ml-[17px] p-1 items-center justify-end flex-[0_0_auto] w-[83.33333333%] max-w-full">
            <ul className="hidden md:flex list-none mt-2.5 mb-3 items-center pl-8">
              <li
                ref={wrapperRef}
                className="mr-5 relative float-left flex items-start"
              >
                <input
                  type="text"
                  placeholder="All Events"
                  value={query}
                  onChange={handleInputChange}
                  className={`
          h-[38px] relative left-2 top-px border-0 p-0 outline-0 placeholder:text-black
          bg-[linear-gradient(180deg,#fff_0%,#fff_100%)] text-black
          transition-[width] duration-400 ease-linear
          ${open ? "w-[300px] px-2.5" : "w-0 px-0"}
        `}
                />

                <FaSearchPlus
                  className="text-white ml-[17px] mt-1.5 cursor-pointer relative left-px"
                  size={24}
                  onClick={() => setOpen(!open)}
                />

                {/* Dropdown */}
                {filteredMatches.length > 0 && open && (
                  <ul className="absolute top-8.5 left-0 right-0 bg-white border border-gray-300  mt-1  overflow-y-auto z-10 shadow-[1px_0_10px_#000] w-[500px] h-[450px] px-2.5 py-2.5">
                    {filteredMatches.map((match, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(match)}
                        className=" hover:bg-gray-100 text-black cursor-pointer border-b border-[#ccc] py-[5px] mb-[5px]"
                      >
                        <div className="flex flex-col leading-3.5">
                          <div className="flex">
                            <div className="font-bold pb-1.5 max-w-[232.5px] w-full">
                              {match.sport} | {match.market}
                            </div>
                            {/* <div className="">{match.name}</div> */}
                            <div className="">{match.datetime}</div>
                          </div>
                          <div className="">{match.name}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li className="mr-3 ml-[15px] float-left cursor-pointer hover:underline">
                <b className="text-[14px]" onClick={() => setRulesOpen(true)}>
                  Rules
                </b>
              </li>
            </ul>
          </div>

          {isLoggedIn && (
            <>
              <div className="absolute top-[9px] right-[3px] flex gap-0.5 justify-end md:hidden text-[13px]">
                {/* BALANCE */}
                <div className="">
                  <span className="text-white">
                    (BAL : <b className="userTotalBalance">{userBalance?.bankBalance?.toFixed(2) || " 0.00"}</b>)
                  </span>
                </div>

                {/* EXPOSURE */}
                <div className="" onClick={() => setExposureOpen(!isexposureopen)}>
                  <span className="text-white">
                    <button className="underline-offset-2">
                      (EXP : <b className="userTotalExposure">{userBalance?.exposure?.toFixed(2) || "0.00"}</b>)
                    </button>
                  </span>
                </div>
              </div>

              <div className="float-left text-[16px] mr-[17px] hidden md:flex flex-col justify-center">
                <div className="text-start leading-[23px]">
                  <span>
                    <b>BALANCE&nbsp;:&nbsp;</b>
                  </span>
                  <b>
                    <span className="userTotalBalance relative left-[3px]">
                      {userBalance?.bankBalance?.toFixed(2) || " 0.00"}
                    </span>
                  </b>
                </div>
                <div className="text-start leading-[23px]">
                  <button
                    onClick={() => setExposureOpen(!isexposureopen)}
                    type="button"
                    className="cursor-pointer"
                  >
                    <span>
                      <b>EXPOSURE&nbsp;:&nbsp;</b>
                    </span>
                    <b>
                      <span className="">
                        {userBalance?.exposure?.toFixed(2) || "0.00"}
                        {/* {userExposure?.toFixed(2) ?? "0.00"} */}
                      </span>
                    </b>
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="w-[110%] gap-1 flex items-center md:flex">
            <div className="flex-1 md:hidden"></div>
            <div
              className={`md:pe-3 md:p-[3px] md:flex-[0_0_auto]
              ${
                !isLoggedIn
                  ? "flex md:flex absolute right-[5px] md:relative md:right-0"
                  : "hidden md:flex"
              }`}
            >
              <button
                onClick={goToLogin}
                className="h-[30.5px] border w-[101.5px] border-black rounded-[3.875px] text-sm text-black cursor-pointer hover:opacity-90 transition-opacity max-[322px]:text-[10px] md:w-[99.91px]"
                style={{
                  background:
                    "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)",
                }}
                tabIndex={0}
              >
                {/* { isLoggedIn ? `Balance: $${userBalance.toFixed(2)}` : "Login" } */}
                {isLoggedIn ? `ACCOUNT` : "LOGIN"}
              </button>
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
          <div className="flex-[0_0_50%] max-w-[50%] text-left"></div>
        </div>
        {isLoggedIn && (
          <button
            onClick={goToLogin}
            className="cursor-pointer text-black border border-white text-sm md:text-base hover:opacity-90 transition-opacity rounded-[3.875px] absolute right-px -top-1  h-[31px] w-[67.92px]"
            style={{
              background: "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)",
            }}
          >
            ACCOUNT
          </button>
        )}
      </div>
      {isaccountopen && (
        <div ref={dropdownRef}>
          <AccountDropDown closeDropdown={closeAccountDropdown} />
        </div>
      )}
      <RulesModal open={isrulesopen} onClose={() => setRulesOpen(false)} />
      <ExposureModal
        open={isexposureopen}
        onClose={() => setExposureOpen(false)}

      />
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

const AccountDropDown = ({ closeDropdown }: any) => {
  const router = useRouter();
  const accountMenuItems = [
    {
      type: "link",
      label: "Account Statement",
      href: "/accountstatement",
    },
    {
      type: "link",
      label: "Profit Loss Report",
      href: "/profitloss",
    },
    {
      type: "link",
      label: "Bet History",
      href: "/bethistory",
    },
    {
      type: "link",
      label: "Activity Log",
      href: "/activity-log",
    },
    {
      type: "link",
      label: "Settings",
      href: "/settings",
    },
    {
      type: "link",
      label: "Change Password",
      href: "/changepassword",
    },
    {
      type: "link",
      label: "Password History",
      href: "/password-history",
    },
  ];

  const SignOut = () => {
    router.push("/login");
  };

  return (
    <>
      <ul
        id="collapseForAccount"
        className="absolute top-{100px} md:top-[82px] w-[172px] md:w-[170px] z-99999 text-[16px] md:text-[14px] right-0 overflow-hidden transition-all duration-300 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] rounded-sm"
      >
        <li className="md:hidden py-1.5 md:py-0 h-9 md:h-[25px] ">
          <Link
            href="/"
            onClick={closeDropdown}
            className="px-3 h-[25px] flex items-center hover:bg-gray-800 transition-colors"
          >
            Home
          </Link>
        </li>

        {accountMenuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              onClick={closeDropdown}
              className="block px-3 py-1.5 md:py-0 h-9 md:h-[25px] items-center hover:bg-gray-800 transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}

        {/* Balance Switch */}
        <li className="flex items-center py-1.5 md:py-0 h-9 md:h-[25px]  justify-between pl-3 pr-1 md:pr-[18px] cursor-pointer">
          <label htmlFor="checkBalance" className="cursor-pointer">
            Balance
          </label>

          <input
            id="checkBalance"
            type="checkbox"
            className="h-[13px] w-[13px] accent-[#4D4E4F] cursor-pointer bg-[#4D4E4F] relative -top-0.5"
          />
        </li>

        {/* Exposure Switch */}
        <li className="flex items-center justify-between pl-3 pr-1 md:pr-[18px] py-1.5 md:py-0 h-9 md:h-[25px] cursor-pointer">
          <label htmlFor="checkExposure" className="cursor-pointer">
            Exposure
          </label>

          <input
            id="checkExposure"
            type="checkbox"
            className="h-[13px] w-[13px] accent-[#4D4E4F] cursor-pointer bg-[#4D4E4F] relative -top-0.5"
          />
        </li>
        <li className="md:hidden">
          <Link
            href="/"
            className="px-3 py-1.5 md:py-0 md:h-[25px]  h-[25px] flex items-center hover:bg-gray-800 transition-colors"
          >
            Rules
          </Link>
        </li>

        <li>
          <hr className="border-t border-gray-700 mt-1" />
        </li>

        {/* Signout */}
        <li className="bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)] text-[16px] font-black">
          <button
            onClick={SignOut}
            className="w-full text-left px-3 py-2 cursor-pointer text-[#ff2828] transition rounded"
          >
            Signout <span className="opacity-80 text-white">()</span>
          </button>
        </li>
      </ul>
    </>
  );
};
