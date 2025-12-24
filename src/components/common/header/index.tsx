"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaHome, FaSearch, FaSearchPlus, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import RulesModal from "@/components/modals/rules-modal";
import { useAuthStore } from "@/lib/store/authStore";
import { CONFIG } from "@/lib/config";
import { fetchData, formatDateStamp } from "@/lib/functions";
// import ExposureModal from "@/components/modals/exposure-modal";
import { useAppStore } from "@/lib/store/store";
import dynamic from "next/dynamic";

const RulesModal = dynamic(() => import("../../modals/rules-modal"), {
  loading: () => <></>,
  ssr: false,
})

const ExposureModal = dynamic(() => import("../../modals/exposure-modal"), {
  loading: () => <></>,
  ssr: false,
})

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
    name: "India v South Africa",
    datetime: " 6/12/2025 01:10 PM ",
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
  const { userBalance, setUserBalance } = useAppStore();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLLIElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const [isrulesopen, setRulesOpen] = useState(false);
  const [isaccountopen, setAccountOpen] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isexposureopen, setExposureOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const { allEventsList } = useAppStore();
  const [results, setResults] = useState<any[]>([]);
  const [mobileResults, setMobileResults] = useState<any[]>([]);
  
  // New state for checkbox toggles - default true
  const [showBalance, setShowBalance] = useState(true);
  const [showExposure, setShowExposure] = useState(true);

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
    if (searchActive && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  }, [searchActive]);

  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

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
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        mobileSearchRef.current &&
        target &&
        !mobileSearchRef.current.contains(target)
      ) {
        setSearchActive(false);
        setMobileQuery("");
        setQuery("");
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
        setFn: setUserBalance, // This now updates the global store
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
    setQuery(e.target.value);
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileQuery(e.target.value);
  };

  const mkText = (it: any) => {
    const parts: string[] = [
      it?.event?.name,
      it?.competition?.name,
      it?.eventType?.name,
      it?.eventName,
      it?.competitionName,
      it?.sportName,
      it?.marketType,
    ];
    if (Array.isArray(it?.runnersName)) {
      parts.push(...it.runnersName.map((r: any) => r?.runnerName));
    }
    return parts.filter(Boolean).join(" ").toLowerCase();
  };

  const normalizeData = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") return Object.values(data).flat();
    return [];
  };

  const isToday = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  // Desktop filtering
  useEffect(() => {
    const src = normalizeData(allEventsList);
    const q = query.trim().toLowerCase();

    if (!q) {
      setResults([]);
      return;
    }

    if (q.length < 3) {
      setResults([]);
      return;
    }

    // Filtering: search + only today's events
    const filtered = src.filter((it) => {
      const textMatch = mkText(it).includes(q);
      const todayMatch = isToday(it?.marketStartTime);
      return textMatch && todayMatch;
    });
    setResults(filtered);
  }, [query, allEventsList]);

  // Mobile filtering
  useEffect(() => {
    const src = normalizeData(allEventsList);
    const q = mobileQuery.trim().toLowerCase();

    if (!q) {
      setMobileResults([]);
      return;
    }

    if (q.length < 3) {
      setMobileResults([]);
      return;
    }

    const filtered = src.filter((it) => {
      const textMatch = mkText(it).includes(q);
      const todayMatch = isToday(it?.marketStartTime);
      return textMatch && todayMatch;
    });

    setMobileResults(filtered);
  }, [mobileQuery, allEventsList]);

  const handleSelect = (match: any) => {
    setQuery("");
    router.push(`/market-details/${match?.event?.id}/${match?.eventType?.id}`);
    setOpen(false);
  };

  const handleMobileSelect = (match: any) => {
    setMobileQuery("");
    router.push(`/market-details/${match?.event?.id}/${match?.eventType?.id}`);
    setSearchActive(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setFilteredMatches([]);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative min-h-16.25 min-[992px]:min-h-20 overflow-x-clip bg-black text-white px-1.25">
      {/* Top Row */}
      <div className="flex min-[345px]:items-center flex-col flex-wrap min-[345px]:flex-nowrap min-[345px]:flex-row">
        {/* Logo Section */}
        <div className="flex items-center min-[992px]:h-16.5 flex-1 pl-1.5 min-[992px]:flex-[0_0_auto] min-[992px]:w-1/4">
          <Link href={"/"} className="flex items-center gap-1.5 min-[992px]:mt-0.5">
            <FaHome
              className="text-white relative bottom-px cursor-pointer mt-0.5 min-[992px]:hidden"
              size={26}
              tabIndex={0}
            />
            <Image
              src="/dayfair-logo.svg"
              alt="Logo"
              width={100}
              height={65}
              className="h-16.25 w-22.5 min-[345px]:w-25 min-[992px]:h-20 min-[992px]:w-40 min-[992px]:pt-2"
              tabIndex={0}
            />
          </Link>
        </div>

        {/* Login Button */}
        <div className="flex flex-col min-[992px]:flex-row justify-end w-full min-[992px]:h-16.5 flex-1">
          <div className="hidden min-[345px]:flex min-[992px]:ml-4.25 p-1 items-center justify-end flex-[0_0_auto] w-[83.33333333%] max-w-full">
            <ul className="hidden min-[992px]:flex list-none mt-2.5 mb-3 items-center pl-8">
              <li
                ref={wrapperRef}
                className="mr-5.25 relative float-left flex items-start"
              >
                <input
                  type="text"
                  placeholder="All Events"
                  value={query}
                  onChange={handleInputChange}
                  ref={inputRef}
                  className={`
          h-9.5 relative left-2 top-px border-0 p-0 outline-0 placeholder:text-black
          bg-[linear-gradient(180deg,#fff_0%,#fff_100%)] text-black
          transition-[width] duration-400 ease-linear
          ${open ? "w-75 px-2.5" : "w-0 px-0"}
        `}
                />

                <FaSearchPlus
                  className="text-white ml-4.25 mt-1.5 cursor-pointer relative left-px"
                  size={24}
                  onClick={() => setOpen(!open)}
                />

                {/* Dropdown */}
                {open && query && (
                  <ul className="absolute top-8.5 text-black left-2 right-0 bg-white border border-gray-300  mt-1  overflow-y-auto z-10 shadow-[1px_0_10px_#000] w-125 max-h-112.5 px-2.5 py-2.5">
                    {results?.length > 0 ? (
                      results?.map((match, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelect(match)}
                          className=" hover:bg-gray-100 text-black cursor-pointer  border-[#ccc] py-1.25 mb-1.25"
                        >
                          <div className="flex flex-col leading-3.5">
                            <div className="flex">
                              <div className="font-bold pb-1.5 max-w-[232.5px] w-full">
                                {match?.eventType?.name} | {match?.marketType}
                              </div>
                              <div className="">
                                {formatDateStamp(match?.marketStartTime)}
                              </div>
                            </div>
                            <div className="">{match?.event?.name}</div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-black cursor-pointer py-1.25 mb-1.25">
                        No real-time records found
                      </li>
                    )}
                  </ul>
                )}
              </li >
              <li className="mr-[13.5px] ml-3.75 float-left cursor-pointer hover:underline font-light">
                <b className="text-[14px]" onClick={() => setRulesOpen(true)}>
                  Rules
                </b>
              </li>
            </ul>
          </div>

          {isLoggedIn && (
            <>
              <div className=" relative min-[345px]:absolute mb-4.5 ml-8.5 min-[345px]:mb-0 top-2.25 right-0.75 flex gap-0.75 min-[992px]:gap-0. min-[345px]:justify-end min-[992px]:hidden text-[13px] tracking-[-0.15px]">
                {/* BALANCE - Mobile */}
                {showBalance && (
                  <div className="">
                    <span className="text-white font-bold min-[992px]:font-normal">
                      (BAL :{" "}
                      <b className="userTotalBalance">
                        {((userBalance?.bankBalance || 0) - (userBalance?.exposure || 0)).toFixed(2)}
                      </b>
                      )
                    </span>
                  </div>
                )}

                {/* EXPOSURE - Mobile */}
                {showExposure && (
                  <div
                    className=""
                    onClick={() => setExposureOpen(!isexposureopen)}
                  >
                    <span className="text-white">
                      <button className="underline-offset-2 font-bold min-[992px]:font-normal">
                        (EXP :{" "}
                        <b className="userTotalExposure">
                          {userBalance?.exposure?.toFixed(2) || "0.00"}
                        </b>
                        )
                      </button>
                    </span>
                  </div>
                )}
              </div>

              <div className="float-left text-[16px] mr-4 hidden min-[992px]:flex flex-col justify-center font-light">
                {/* BALANCE - Desktop */}
                {showBalance && (
                  <div className="text-start leading-5.75">
                    <span>
                      <b>BALANCE&nbsp;:&nbsp;</b>
                    </span>
                    <b>
                      <span className="userTotalBalance relative left-0.75">
                        {((userBalance?.bankBalance || 0) - (userBalance?.exposure || 0)).toFixed(2)}
                      </span>
                    </b>
                  </div>
                )}
                
                {/* EXPOSURE - Desktop */}
                {showExposure && (
                  <div className="text-start leading-5.75">
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
                        </span>
                      </b>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="w-[110%] gap-1 flex items-center min-[992px]:flex">
            <div className="flex-1 min-[992px]:hidden"></div>
            <div
              className={`min-[992px]:pe-3 min-[992px]:p-0.75 min-[992px]:flex-[0_0_auto]
              ${!isLoggedIn
                  ? "flex min-[992px]:flex absolute right-1.25 min-[992px]:relative min-[992px]:right-0"
                  : "hidden min-[992px]:flex"
                }`}
            >
              <button
                onClick={goToLogin}
                className="h-[32.5px] border w-[101.5px] border-black rounded-[5.875px] text-sm text-black cursor-pointer hover:opacity-90 transition-opacity max-[322px]:text-[10px] min-[992px]:w-[101.91px]"
                style={{
                  background:
                    "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)",
                }}
                tabIndex={0}
              >
                {isLoggedIn ? `ACCOUNT` : "LOGIN"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-8.75 ml-1 pb-2 min-[992px]:hidden">
        {/* LEFT SIDE (50%) */}
        <div className="relative" ref={mobileSearchRef}>
          <div className="absolute left-0 top-1.25 z-10 w-46">
            <div
              className={`
          bg-white rounded-full flex items-center 
          transition-all duration-500 ease-linear
          ${searchActive ? "w-full" : "w-6.25"}
        `}
            >
              {/* SEARCH INPUT */}
              <input
                ref={mobileInputRef}
                id="searchEventmobile"
                type="text"
                autoComplete="off"
                value={mobileQuery}
                onChange={handleMobileInputChange}
                className={`
            bg-transparent text-black border-0 outline-0 h-6.25
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
                className="flex items-center justify-center h-6.25 w-6.25 shrink-0"
              >
                {searchActive ? (
                  <FaTimes className="text-black ml-0.5" size={13} />
                ) : (
                  <FaSearch className="text-black ml-0.5" size={13} />
                )}
              </button>
            </div>

            {/* Mobile Dropdown */}
            {searchActive && mobileQuery && (
              <ul className="absolute top-9 min-[992px]:top-7.5 max-h-47.5 left-0 w-[214.5%] min-[992px]:w-[150%] bg-white border border-gray-300 mt-1  overflow-y-auto z-9999 shadow-[1px_0_10px_#000]">
                {mobileResults?.length > 0 ? (
                  mobileResults?.map((match, index) => (
                    <li
                      key={index}
                      onClick={() => handleMobileSelect(match)}
                      className="hover:bg-gray-100 text-black cursor-pointer border-b border-[#ccc] px-2 py-1.5"
                    >
                      <div className="flex flex-col text-[12px] leading-3.5">
                        <div className="flex justify-between items-center w-full">
                          <div className="font-bold pb-1">
                            {match?.eventType?.name} | {match?.marketType}
                          </div>

                          <div className="text-[12px] pb-0.5">
                            {formatDateStamp(match?.marketStartTime)}
                          </div>
                        </div>

                        <div className="">{match?.event?.name}</div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-black px-1 py-[7px] min-[992px]:px-2 min-[992px]:py-1.5 text-[12px]">
                    No real-time records found
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="flex-[0_0_50%] max-w-[50%] text-left"></div>
        </div>
        {isLoggedIn && (
          <button
            onClick={goToLogin}
            className="cursor-pointer text-black border border-white text-[10px] min-[345px]:text-sm min-[992px]:text-base hover:opacity-90 transition-opacity rounded-[3.875px] absolute right-px -top-px min-[345px]:-top-1 w-[49.94px] h-6.75 min-[345px]:h-7.75 min-[345px]:w-[67.92px]"
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
          <AccountDropDown 
            closeDropdown={closeAccountDropdown}
            showBalance={showBalance}
            setShowBalance={setShowBalance}
            showExposure={showExposure}
            setShowExposure={setShowExposure}
          />
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

const AccountDropDown = ({ 
  closeDropdown, 
  showBalance, 
  setShowBalance, 
  showExposure, 
  setShowExposure 
}: any) => {
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
        className="absolute top-{100px} min-[992px]:top-20.5 w-43 min-[992px]:w-42.5 z-99999 text-[16px] min-[992px]:text-[14px] right-0 overflow-hidden transition-all duration-300 bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] min-[992px]:rounded-sm"
      >
        <li className="min-[992px]:hidden py-1.5 min-[992px]:py-0 h-9 min-[992px]:h-6.25 ">
          <Link
            href="/"
            onClick={closeDropdown}
            className="px-3 h-6.25 py-1.5 flex items-center hover:bg-gray-800 transition-colors relative top-[-1px]"
          >
            Home
          </Link>
        </li>

        {accountMenuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              onClick={closeDropdown}
              className="block px-3 py-1.5 min-[992px]:py-0 h-9 min-[992px]:h-6.25 items-center hover:bg-gray-800 transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}

        {/* Balance Switch */}
        <li className="flex items-center py-1.5 min-[992px]:py-0 h-9 min-[992px]:h-6.25 justify-between pl-3 pr-1 min-[992px]:pr-4.5 cursor-pointer">
          <label htmlFor="checkBalance" className="cursor-pointer">
            Balance
          </label>
          <input
            id="checkBalance"
            type="checkbox"
            checked={showBalance}
            onChange={(e) => setShowBalance(e.target.checked)}
            className="h-3.25 w-3.25 cursor-pointer relative -top-0.5"
          />
        </li>

        {/* Exposure Switch */}
        <li className="flex items-center justify-between pl-3 pr-1 min-[992px]:pr-4.5 py-1.5 min-[992px]:py-0 h-9 min-[992px]:h-6.25 cursor-pointer">
          <label htmlFor="checkExposure" className="cursor-pointer">
            Exposure
          </label>
          <input
            id="checkExposure"
            type="checkbox"
            checked={showExposure}
            onChange={(e) => setShowExposure(e.target.checked)}
            className="h-3.25 w-3.25 cursor-pointer  relative -top-0.5"
          />
        </li>
        <li className="min-[992px]:hidden h-[36px] flex items-center max-[992px]:mb-[5px]">
          <Link
            href="/rules"
            className="px-3 py-1.5 min-[992px]:py-0 min-[992px]:h-6.25  h-6.25 flex items-center hover:bg-gray-800 transition-colors"
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
            className="w-full text-left px-3 py-1.5 cursor-pointer text-[#ff2828] transition rounded flex gap-[1px]"
          >
            Signout<span className="opacity-80 text-white">()</span>
          </button>
        </li>
      </ul>
    </>
  );
};