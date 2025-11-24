'use client'
import React, { useEffect, useState } from 'react'

export default function MMarketDetailsPage() {
  const [activeTab, setActiveTab] = useState('odds');
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [active, setActive] = useState(false);

  const isSuspended = true;


  const categories = ["Popular", "Match Odds", "Tied Match", "All Market"];


  useEffect(() => {
    // Toggle active after 1s for demo
    const timer = setInterval(() => {
      setActive((prev) => !prev);
    }, 800);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className='md:hidden'>
      <div className="relative flex justify-between items-center bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]">
        {/* Tabs */}
        <div className="flex items-center text-black font-semibold">
          <div className="flex pt-[13px] pb-3">
            <a
              onClick={() => setActiveTab('odds')}
              className={`relative block text-[12px] text-center border-r px-4 ${activeTab === 'odds'
                ? "after:content-[''] after:absolute after:-top-3 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : ''
                }`}
            >
              ODDS
            </a>
          </div>

          <div className="flex">
            <a
              onClick={() => setActiveTab('betList')}
              className={`relative block text-[12px] text-center px-4 ${activeTab === 'betList'
                ? "after:content-[''] after:absolute after:-top-3 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : ''
                }`}
            >
              BET LIST (0)
            </a>
          </div>
        </div>


        <div>
          {/* Speaker Icon */}
          <div className="absolute top-3 right-10">
            <button className="flex items-center gap-1 text-black">
              <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.88889 16.0001H2C1.44772 16.0001 1 15.5524 1 15.0001V9.00007C1 8.44778 1.44772 8.00007 2 8.00007H5.88889L11.1834 3.66821C11.3971 3.49335 11.7121 3.52485 11.887 3.73857C11.9601 3.8279 12 3.93977 12 4.05519V19.9449C12 20.2211 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16.0001ZM20.4142 12.0001L23.9497 15.5356L22.5355 16.9498L19 13.4143L15.4645 16.9498L14.0503 15.5356L17.5858 12.0001L14.0503 8.46454L15.4645 7.05032L19 10.5859L22.5355 7.05032L23.9497 8.46454L20.4142 12.0001Z"></path></svg>
            </button>
          </div>

          {/* TV Icon */}
          <div className="absolute top-2 right-2">
            <p className="mb-0 text-black">
              <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4.00087C2 3.44811 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44463 22 4.00087V17.9991C22 18.5519 21.5447 19 21.0082 19H2.9918C2.44405 19 2 18.5554 2 17.9991V4.00087ZM4 5V17H20V5H4ZM5 20H19V22H5V20Z"></path></svg>
            </p>
          </div>
        </div>
      </div>


      {
        activeTab === 'betList' ? (
          <div className="block">
            <div className="flex justify-center items-center h-[30vh] text-[21px] mt-4">
              You Have No Open Bets.
            </div>
          </div>
        ) : (
          <div className='flex'>
            <div className="left-part overflow-y-auto w-full">
              {/* Game Header */}
              <div className=" flex justify-between items-center bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] py-1 px-2 text-white">
                <span className="text-sm font-medium">
                  Titans W v South Western Districts W
                </span>
                <span className=" game-iconinplay">
                  <span
                    className={`
        text-xs py-1 rounded-full font-bold inline-block transition-all duration-300
        ${active ? "text-red-500 scale-125" : "text-yellow-500 scale-100"}
      `}
                  >
                    INPLAY
                  </span>
                </span>
              </div>

              {/* Game Status Banner */}
              <div className=" p-0 mb-[3px] bg-cover"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, #0000001a, #00000073), url('/market/market.jpg')",
                  backgroundSize: "408px 90px",
                }}>
                <div className="">
                  <div className="flex flex-col justify-between items-center px-3 pt-1.5 h-[90px]">
                    <div className="flex justify-between w-full">
                      <div className=" text-white text-[12px] font-bold [text-shadow:#fc0_1px_0_10px]">
                        SUSPENDED
                      </div>
                      <div className=" text-white text-[12px] font-bold [text-shadow:#fc0_1px_0_10px]">
                        <span className=" text-[#ffff55]">Game time</span> 23-11-2025 01:00:00 PM
                      </div>
                    </div>
                    <div className="flex justify-center items-center flex-col [text-shadow:#fc0_1px_0_10px]">
                      <span className={`relative -top-0.5 font-bold text-[12px]
                        ${active ? "text-[#ffff55] scale-125" : "text-white scale-100"}`}>
                        Bet Started
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Categories */}
              <div>
                <ul className="flex overflow-x-auto no-scrollbar p-[5px] bg-[linear-gradient(180deg,#000000,#000000_42%,#000000)] text-white">
                  {categories.map((category) => (
                    <li
                      key={category}
                      className={`px-2.5 py-[5px] whitespace-nowrap rounded-full ml-[5px] text-[12px] font-medium border border-white cursor-pointer ${activeCategory === category
                        ? "bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)] text-black"
                        : "hover:bg-gray-100 bg-transparent text-white"
                        }`}
                    >
                      <button onClick={() => setActiveCategory(category)}>
                        {category.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Match Odds Market */}
              <div className="bg-[linear-gradient(180deg,#000000,#000000_42%,#000000b3)]">
                <div className=" mt-0 py-1 px-2 flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-white text-[13px]">Match Odds</span>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="flex items-center text-white text-[13px] font-bold">
                          <span className='relative w-[18px] h-[18px] mr-1 bg-yellow-500 rounded-xs'>
                            <span className="w-[13px] h-3.5 bg-black rounded-full mr-1 absolute z-20 top-0.5 left-0.5"></span>
                          </span>
                          Cash Out
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-white">
                    <svg className='w-4 h-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path></svg>
                  </button>
                </div>

                {/* Mobile Header */}
                <div className="text-[12px] border-b border-[#aaa]">
                  <div className="flex bg-gray-100">
                    <div className="py-0.5 px-[5px] flex justify-between items-center border-b border-[#aaa] w-[60%] font-semibold">
                      <span>Min: 5 Max: 10000</span>
                      <span className=" ml-2">M:2.70K</span>
                    </div>
                    <div className='w-[40%] flex'>
                      <div className="back text-center w-[50%] text-[12px] font-semibold bg-[#72bbef]">BACK</div>
                      <div className="lay text-center w-[50%] text-[12px] font-semibold bg-[#faa9ba]">LAY</div>
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className=" flex border-b border-[#aaa] bg-gray-50">
                    <div className="col-span-3 py-0.5 px-[5px] md:col-span-1 w-[60%]">
                      <div className="flex">
                        <div className="w-full">
                          <span className=" flex justify-between">
                            <b className="font-semibold text-[12px] text-gray-800">Titans W</b>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='w-[40%] flex'>
                      <div className="text-center w-[50%] bg-[#72bbef]">
                        <span className="odd block font-bold">1.06</span>
                        <span className="block text-xs">5.99</span>
                      </div>

                      {/* Lay Odds */}
                      <div className="text-center w-[50%] bg-[#faa9ba]">
                        <span className="odd block font-bold">1.19</span>
                        <span className="block text-xs">4.21</span>
                      </div>
                    </div>
                  </div>


                  <div className="odd-row flex border-b border-[#aaa] bg-gray-50">
                    <div className="col-span-3 py-0.5 px-[5px] md:col-span-1 w-[60%]">
                      <div className="flex">
                        <div className="w-full">
                          <span className="flex justify-between">
                            <b className="font-semibold text-[12px] text-gray-800">South Western Districts W</b>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`relative w-[40%] flex 
                      ${isSuspended
                        ? "after:content-['SUSPENDED'] after:absolute after:inset-0 after:bg-black/60 after:text-[#ff3c3c] after:flex after:items-center after:justify-center after:uppercase after:font-extralight after:text-[15px] after:cursor-not-allowed"
                        : ""
                      }`}>
                      <div className="text-center w-[50%] bg-[#72bbef]">
                        <span className="odd block font-bold">1.06</span>
                        <span className="block text-xs">5.99</span>
                      </div>

                      {/* Lay Odds */}
                      <div className="text-center w-[50%] bg-[#faa9ba]">
                        <span className="odd block font-bold">1.19</span>
                        <span className="block text-xs">4.21</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
