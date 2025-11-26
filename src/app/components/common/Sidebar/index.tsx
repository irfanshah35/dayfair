"use client";
import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaCaretRight } from 'react-icons/fa';
import { FaRegSquarePlus, FaRegSquareMinus } from 'react-icons/fa6';

const Sidebar = () => {
  const [isOthersOpen, setIsOthersOpen] = useState(true);
  const [isAllSportsOpen, setIsAllSportsOpen] = useState(true);
  const [isCricketOpen, setIsCricketOpen] = useState(false);
  const [isSoccerOpen, setIsSoccerOpen] = useState(false);
  const [isTennisOpen, setIsTennisOpen] = useState(false);
  const [isVolleyballOpen, setIsVolleyballOpen] = useState(false);
  
  // Tournament states
  const [isAbuDhabiOpen, setIsAbuDhabiOpen] = useState(false);
  const [isFalconsOpen, setIsFalconsOpen] = useState(false);
  const [isIntTwenty20Open, setIsIntTwenty20Open] = useState(false);
  const [isNepalPLOpen, setIsNepalPLOpen] = useState(false);
  const [isT10LeagueOpen, setIsT10LeagueOpen] = useState(false);
  const [isPlunketOpen, setIsPlunketOpen] = useState(false);
  const [isSAT20Open, setIsSAT20Open] = useState(false);

  return (
    <div 
      className="p-0 min-h-screen  h-full hidden md:block"
      style={{
        background: 'linear-gradient(-180deg, #b8b3b3 0%, #dad6d6 100%)',
        fontFamily: "'Roboto Condensed', sans-serif",
        fontSize: '16px',
        lineHeight: '15px'
      }}
    >
      {/* Others Section */}
      <div>
        <div 
          className="cursor-pointer px-2 py-1.5 mb-0  btn-clr text-white"
          onClick={() => setIsOthersOpen(!isOthersOpen)}
        >
          <h5 className="inline-block w-full text-[18px] mb-0 relative">
            Others
            <FaChevronDown 
              className={`float-right  transition-transform ${isOthersOpen ? '' : '-rotate-90'}`} 
              size={14} 
            />
          </h5>
        </div>

        {isOthersOpen && (
          <nav className="bg-[#C3BDBD]">
            <ul className="mt-0 mb-0 -ml-3.5">
              {/* Empty for now - Others content goes here */}
            </ul>
          </nav>
        )}
      </div>

      {/* All Sports Section */}
      <div>
        <div 
          className="cursor-pointer px-2 py-1.5 mb-0 mt-px  btn-clr text-white"
          onClick={() => setIsAllSportsOpen(!isAllSportsOpen)}
        >
          <h5 className="inline-block w-full text-[18px] mb-0 relative">
            All Sports
            <FaChevronDown 
              className={`float-right transition-transform ${isAllSportsOpen ? '' : '-rotate-90'}`} 
              size={14} 
            />
          </h5>
        </div>

        {isAllSportsOpen && (
          <nav className="bg-[#C3BDBD] py-[3px] text-white">
            {/* Cricket */}
            <ul className="mt-1 mb-0 ">
              <li className="list-none py-1 pl-2.5 pr-0 relative">
                <div 
                  className="cursor-pointer"
                  onClick={() => setIsCricketOpen(!isCricketOpen)}
                >
                  <span>
                    {isCricketOpen ? (
                      <FaRegSquareMinus className="inline-block align-middle" size={16} />
                    ) : (
                      <FaRegSquarePlus className="inline-block align-middle" size={16} />
                    )}
                  </span>
                  <span className="pl-1">Cricket</span>
                </div>
                
                {isCricketOpen && (
                  <ul className=" mb-0 ml-0 pl-0">
                    {/* Abu Dhabi T10 */}
                    <li className="list-none py-1 pl-5 pr-0">
                      <div 
                        className="cursor-pointer"
                        onClick={() => setIsAbuDhabiOpen(!isAbuDhabiOpen)}
                      >
                        <span>
                          {isAbuDhabiOpen ? (
                            <FaRegSquareMinus className="inline-block align-middle" size={16} />
                          ) : (
                            <FaRegSquarePlus className="inline-block align-middle" size={16} />
                          )}
                        </span>
                        <span className="pl-1">Abu Dhabi T10</span>
                      </div>
                      
                    {isAbuDhabiOpen && (
                        <ul className="mb-0 ml-0 pl-0">
                          <li className="list-none py-1 pl-4 pr-0">
                            <div className="cursor-pointer flex items-start">
                              <FaCaretRight className="inline-block mt-0.5 " size={17} />
                              <span>UAE Bulls v Northern Warriors</span>
                            </div>
                          </li>
                          <li className="list-none py-1 pl-4 pr-0">
                            <div className="cursor-pointer flex items-start">
                              <FaCaretRight className="inline-block mt-0.5 " size={17} />
                              <span>Deccan Gladiators v Ajman Titans</span>
                            </div>
                          </li>
                          <li className="list-none py-1 pl-4 pr-0">
                            <div className="cursor-pointer flex items-start">
                              <FaCaretRight className="inline-block mt-0.5 " size={17} />
                              <span>Royal Champs v Aspin Stallions</span>
                            </div>
                          </li>
                          <li className="list-none py-1 pl-4 pr-0">
                            <div className="cursor-pointer flex items-start">
                              <FaCaretRight className="inline-block mt-0.5 " size={17} />
                              <span>Vista Riders v Quetta Cavalry</span>
                            </div>
                          </li>
                        </ul>
                      )}

                    </li>

                    {/* Falcons Champions Trophy */}
                    <li className="list-none py-1 pl-5 pr-0">
                      <div className="cursor-pointer">
                        <span>
                          <FaRegSquarePlus className="inline-block align-middle" size={16} />
                        </span>
                        <span className="pl-1">Falcons Champions Trophy</span>
                      </div>
                    </li>

                    {/* International Twenty20 Matches */}
                    <li className="list-none py-1 pl-5 pr-0">
                      <div className="cursor-pointer">
                        <span>
                          <FaRegSquarePlus className="inline-block align-middle" size={16} />
                        </span>
                        <span className="pl-1">International Twenty20 Matches</span>
                      </div>
                    </li>

                    {/* Nepal Premier League */}
                    <li className="list-none py-1 pl-5 pr-0">
                      <div className="cursor-pointer">
                        <span>
                          <FaRegSquarePlus className="inline-block align-middle" size={16} />
                        </span>
                        <span className="pl-1">Nepal Premier League</span>
                      </div>
                    </li>

                    {/* T10 League Internationals */}
                    <li className="list-none py-1 pl-5 pr-0">
                      <div className="cursor-pointer">
                        <span>
                          <FaRegSquarePlus className="inline-block align-middle" size={16} />
                        </span>
                        <span className="pl-1">T10 League Internationals</span>
                      </div>
                    </li>

                    {/* Plunket Shield */}
                    <li className="list-none py-1 pl-5 pr-0">
                      <div className="cursor-pointer">
                        <span>
                          <FaRegSquarePlus className="inline-block align-middle" size={16} />
                        </span>
                        <span className="pl-1">Plunket Shield</span>
                      </div>
                    </li>

                    {/* South Africa T20 Challenge */}
                    <li className="list-none py-1 pl-5 pr-0">
                      <div className="cursor-pointer">
                        <span>
                          <FaRegSquarePlus className="inline-block align-middle" size={16} />
                        </span>
                        <span className="pl-1">South Africa T20 Challenge</span>
                      </div>
                    </li>
                  </ul>
                )}
              </li>
            </ul>

            {/* Soccer */}
            <ul className="mt-0 mb-0 ">
              <li className="list-none py-1 pl-2.5 pr-0 relative">
                <div 
                  className="cursor-pointer"
                  onClick={() => setIsSoccerOpen(!isSoccerOpen)}
                >
                  <span>
                    {isSoccerOpen ? (
                      <FaRegSquareMinus className="inline-block align-middle" size={16} />
                    ) : (
                      <FaRegSquarePlus className="inline-block align-middle" size={16} />
                    )}
                  </span>
                  <span className="pl-1">Soccer</span>
                </div>
              </li>
            </ul>

            {/* Tennis */}
            <ul className="mt-0 mb-0 ">
              <li className="list-none py-1 pl-2.5 pr-0 relative">
                <div 
                  className="cursor-pointer"
                  onClick={() => setIsTennisOpen(!isTennisOpen)}
                >
                  <span>
                    {isTennisOpen ? (
                      <FaRegSquareMinus className="inline-block align-middle" size={16} />
                    ) : (
                      <FaRegSquarePlus className="inline-block align-middle" size={16} />
                    )}
                  </span>
                  <span className="pl-1">Tennis</span>
                </div>
              </li>
            </ul>

            {/* Volleyball */}
            <ul className="mt-0 mb-0 ">
              <li className="list-none py-1 pl-2.5 pr-0 relative">
                <div 
                  className="cursor-pointer"
                  onClick={() => setIsVolleyballOpen(!isVolleyballOpen)}
                >
                  <span>
                    {isVolleyballOpen ? (
                      <FaRegSquareMinus className="inline-block align-middle" size={16} />
                    ) : (
                      <FaRegSquarePlus className="inline-block align-middle" size={16} />
                    )}
                  </span>
                  <span className="pl-1">Volleyball</span>
                </div>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Sidebar;