"use client";
import React, { useRef, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";

const MLiveCasino = () => {
  const [activeTab, setActiveTab] = useState("Popular");
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
  const items = [
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-mbl_teenpatti2020",
      name: "20-20 TEENPATTI",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "img-fluid",
      name: "VIMAAN",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "img-fluid",
      name: "BALLOON",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-Baccarat",
      name: "BACCARAT",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-2020dragonTiger",
      name: "20-20 DRAGON TIGER",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-lucky7A",
      name: "LUCKY 7 - A",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-AndarbaharA",
      name: "ANDAR BAHAR - A",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-32cardsA",
      name: "32 CARDS - A",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-ezugi",
      name: "EZUGI",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-2020pokerA",
      name: "20-20 POKER - A",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-BaccaratA",
      name: "BACCARAT - A",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-1day3patti",
      name: "1DAY TEEN PATTI",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-dragonTiger",
      name: "DRAGON TIGER",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-fastlucky7",
      name: "FAST LUCKY - 7",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-OnedayDragonTiger",
      name: "1 DAY DRAGON TIGER",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-muflisTeenPatti",
      name: "MUFLIS TEEN PATTI",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-DtlA",
      name: "DTL - A",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-fastDragonTiger",
      name: "FAST DRAGON TIGER",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-casinoWar",
      name: "CASINO WAR",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-casinoMeter",
      name: "CASINO METER",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-mbl_29cardBaccarat",
      name: "29 CARD BACCARAT",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-instantWorli",
      name: "INSTANT WORLI",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-pointTeenpatti",
      name: "POINT TEEN PATTI",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-jokerTeenpatti",
      name: "JOKER TEEN PATTI",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-headAndtails",
      name: "HEADS & TAILS",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-dreamcatcher",
      name: "DREAM CATCHER",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-lucky0to9",
      name: "LUCKY 0 TO 9",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-betgames",
      name: "BETGAMES CASINO",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-tvbet",
      name: "TVBET",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-AmarAkbarAnthny",
      name: "AMAR AKBAR ANTHONY",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-3cardJugdement",
      name: "3 CARD JUDGEMENT - A",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-1cardMeter",
      name: "1 CARD METER",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-1card2020",
      name: "1 CARD 20-20",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-trio",
      name: "TRIO",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-andarbaharC",
      name: "ANDAR BAHAR - C",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-lottery",
      name: "LOTTERY",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-2020pokerB",
      name: "20-20 POKER - B",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-dtlTeenpatti",
      name: "DTL TEENPATTI",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-inaMinaDika",
      name: "INA MINA DIKA",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-lucky7b",
      name: "LUCKY 7 - B",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-bollywoodCasino",
      name: "BOLLYWOOD CASINO",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-2020cardRace",
      name: "20-20 CARD RACE",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-baccaratC",
      name: "BACCARAT - C",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-32cardsB",
      name: "32 CARDS - B",
    },
    {
      img: "https://t20exchange.com/api/users/images/Balloon-01.png",
      class: "casino_sprite casino-kbc",
      name: "KBC",
    },
  ];

  const menuItems = [
    { label: "ALL", gradient: true },
    { label: "OUR CASINO" },
    { label: "INTERNATIONAL CASINO" },
    { label: "VIRTUAL CASINO" },
  ];
  const pathname = usePathname();

  return (
    <div
      className={`lg:bg-white  ${
        pathname === "/live-casino" ? "lg:pt-0" : "lg:pt-10"
      }`}
    >
      {pathname === "/live-casino" && (
        <div className="relative flex items-center md:mt-[3px] justify-between bg-linear-to-b from-[#030a12] via-[#444647] to-[#58595a] overflow-hidden lg:mb-3 h-[33px]">
          {/* Menu Items */}
          <ul className="flex text-[12px] md:text-[14px] h-[33px] overflow-x-auto scrollbar-none">
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
        <div className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] lg:mb-3 w-full overflow-x-hidden">
          <ul className="flex overflow-x-auto overflow-y-hidden scrollbar-none m-0 p-0 list-none whitespace-nowrap">
            {tabs.map((tab) => (
              <li key={tab} className="inline-block border-r border-white">
                <a onClick={() => setActiveTab(tab)} className="cursor-pointer">
                  <div
                    className={`p-2 uppercase text-xs min-[992px]:text-[16px] min-[992px]:font-[400] min-[992px]:!py-1 min-[992px]:!px-[15px] font-bold tracking-wide ${
                      activeTab === tab
                        ? "bg-linear-to-b from-[#f4b501] to-[#f68700] text-black"
                        : "text-white !bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]"
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
      <div className="container mx-auto lg:pt-3">
        <div className="grid grid-cols-3 md:grid-cols-6 lg:gap-y-[15px] mt-1.5">
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

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

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
    </div>
  );
};

export default MLiveCasino;
