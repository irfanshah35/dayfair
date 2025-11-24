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
  const items = [
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-mbl_teenpatti2020", name: "20-20 TEENPATTI" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "img-fluid", name: "VIMAAN" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "img-fluid", name: "BALLOON" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-Baccarat", name: "BACCARAT" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-2020dragonTiger", name: "20-20 DRAGON TIGER" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-lucky7A", name: "LUCKY 7 - A" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-AndarbaharA", name: "ANDAR BAHAR - A" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-32cardsA", name: "32 CARDS - A" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-ezugi", name: "EZUGI" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-2020pokerA", name: "20-20 POKER - A" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-BaccaratA", name: "BACCARAT - A" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-1day3patti", name: "1DAY TEEN PATTI" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-dragonTiger", name: "DRAGON TIGER" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-fastlucky7", name: "FAST LUCKY - 7" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-OnedayDragonTiger", name: "1 DAY DRAGON TIGER" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-muflisTeenPatti", name: "MUFLIS TEEN PATTI" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-DtlA", name: "DTL - A" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-fastDragonTiger", name: "FAST DRAGON TIGER" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-casinoWar", name: "CASINO WAR" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-casinoMeter", name: "CASINO METER" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-mbl_29cardBaccarat", name: "29 CARD BACCARAT" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-instantWorli", name: "INSTANT WORLI" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-pointTeenpatti", name: "POINT TEEN PATTI" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-jokerTeenpatti", name: "JOKER TEEN PATTI" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-headAndtails", name: "HEADS & TAILS" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-dreamcatcher", name: "DREAM CATCHER" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-lucky0to9", name: "LUCKY 0 TO 9" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-betgames", name: "BETGAMES CASINO" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-tvbet", name: "TVBET" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-AmarAkbarAnthny", name: "AMAR AKBAR ANTHONY" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-3cardJugdement", name: "3 CARD JUDGEMENT - A" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-1cardMeter", name: "1 CARD METER" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-1card2020", name: "1 CARD 20-20" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-trio", name: "TRIO" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-andarbaharC", name: "ANDAR BAHAR - C" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-lottery", name: "LOTTERY" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-2020pokerB", name: "20-20 POKER - B" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-dtlTeenpatti", name: "DTL TEENPATTI" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-inaMinaDika", name: "INA MINA DIKA" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-lucky7b", name: "LUCKY 7 - B" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-bollywoodCasino", name: "BOLLYWOOD CASINO" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-2020cardRace", name: "20-20 CARD RACE" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-baccaratC", name: "BACCARAT - C" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-32cardsB", name: "32 CARDS - B" },
    { img: "https://t20exchange.com/api/users/images/Balloon-01.png", class: "casino_sprite casino-kbc", name: "KBC" },
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
                className={`p-2 uppercase text-xs font-bold tracking-wide ${activeTab === tab
                  ? "bg-linear-to-b from-[#f4b501] to-[#f68700] text-black"
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
      <div className="container mx-auto p-1">
        <div className="grid grid-cols-3 md:grid-cols-6  mt-3">
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
      `}</style>
    </div>
  );
};

export default MLiveCasino;