"use client";
import { sportsData } from "@/lib/projectData";
import Link from "next/link";
import React, { useState } from "react";
import { FaChevronDown, FaCaretRight } from "react-icons/fa";
import { FaRegSquarePlus, FaRegSquareMinus } from "react-icons/fa6";



export default function Sidebar() {
  const [isOthersOpen, setIsOthersOpen] = useState(true);
  const [isAllSportsOpen, setIsAllSportsOpen] = useState(true);

  // const [open, setOpen] = useState<Record<string, boolean>>({});

  const [open, setOpen] = useState<{
    sport: string | null;
    tournament: string | null;
  }>({
    sport: null,
    tournament: null,
  });

  const toggleSport = (key: string) => {
    setOpen((prev) => ({
      sport: prev.sport === key ? null : key,  // open one, close others
      tournament: null, // close all tournaments when switching sport
    }));
  };

  const toggleTournament = (key: string) => {
    setOpen((prev) => ({
      ...prev,
      tournament: prev.tournament === key ? null : key,
    }));
  };


  // const toggle = (key: string) => {
  //   setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  // };

  return (
    <div
      className="p-0 min-h-screen h-full hidden md:block"
      style={{
        background: "linear-gradient(-180deg, #b8b3b3 0%, #dad6d6 100%)",
        fontFamily: "'Roboto Condensed', sans-serif",
        fontSize: "16px",
        lineHeight: "15px",
      }}
    >
      {/* Others */}
      <div>
        <div
          className="cursor-pointer ps-1.5 pe-2 py-[7px] min-h-[29.59px] mb-0 btn-clr text-white mt-px"
          onClick={() => setIsOthersOpen(!isOthersOpen)}
        >
          <h5 className="inline-block w-full text-[18px] mb-0">
            Others
            <FaChevronDown
              className={`float-right transition-transform ${isOthersOpen ? "" : "-rotate-90"
                }`}
              size={14}
            />
          </h5>
        </div>

        {isOthersOpen && (
          <nav className="bg-[#C3BDBD]">
            <ul className="py-[5] px-3 ml-[-9]">
              <li className="list-none text-white ml-2.5">
                <Link href={'/live-casino'}>Casino</Link>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* All Sports */}
      <div>
        <div
          className="cursor-pointer pe-2 ps-1.5 py-[7px] mb-0 mt-px btn-clr text-white"
          onClick={() => setIsAllSportsOpen(!isAllSportsOpen)}
        >
          <h5 className="inline-block w-full text-[18px] mb-0">
            All Sports
            <FaChevronDown
              className={`float-right transition-transform ${isAllSportsOpen ? "" : "-rotate-90"
                }`}
              size={14}
            />
          </h5>
        </div>

        {isAllSportsOpen && (
          <nav className="bg-[#C3BDBD] py-[3px] text-white">
            {sportsData.map((sportObj) => (
              <ul key={sportObj.key} className="mt-1 mb-0">
                <li className="list-none  pt-0.5 pl-2.5 pr-0">
                  {/* Sport name */}
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleSport(sportObj.key)}
                  >
                    <span className="relative bottom-0.5">
                      {open.sport === sportObj.key ? (
                        <FaRegSquareMinus className="inline-block w-3.5 h-[19px]" />
                      ) : (
                        <FaRegSquarePlus className="inline-block w-3.5 h-[19px]" />
                      )}
                    </span>

                    <span className="pl-1.5">{sportObj.sport}</span>
                  </div>

                  {/* Tournament list */}
                  {open.sport === sportObj.key && (
                    <ul className="mb-0 ml-0 pl-0">
                      {sportObj.tournaments.map((tour) => (
                        <li key={tour.key} className="list-none py-1 pl-5 pr-0">
                          {/* Tournament */}
                          <div
                            className="cursor-pointer"
                            onClick={() => toggleTournament(tour.key)}
                          >
                            <span>
                              {open.tournament === tour.key ? (
                                <FaRegSquareMinus
                                  className="inline-block align-middle"
                                  size={16}
                                />
                              ) : (
                                <FaRegSquarePlus
                                  className="inline-block align-middle"
                                  size={16}
                                />
                              )}
                            </span>
                            <span className="pl-1">{tour.title}</span>
                          </div>

                          {/* Matches */}
                          {open.tournament === tour.key && (
                            <ul className="mb-0 ml-0 pl-0">
                              {tour.matches.map((match, idx) => (
                                <li
                                  key={idx}
                                  className="list-none py-1 pl-4 pr-0"
                                >
                                  <div className="cursor-pointer flex items-start">
                                    <FaCaretRight
                                      className="inline-block mt-0.5"
                                      size={17}
                                    />
                                    <span>{match}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
