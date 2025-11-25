'use client'
import React, { useState } from 'react'

export default function MTipsPreview() {
  const [opendetails, setOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);


  const newsData = [
    {
      id: 1,
      title:
        "PAK vs SL, Tri-Series 2025: Sahibzada Farhan smashes career-best score as Pakistan trumps Sri Lanka",
      desc: `Sahibzada  
Sahibzada Farhan bludgeoned a career-best unbeaten 80 off 45 balls as Pakistan routed struggling Sri Lanka by seven wickets in the T20 Tri-series on Saturday.

Sri Lanka, which lost its opening game against Zimbabwe by 67 runs after getting bowled out for 95, was limited to 128 for seven after captain Dasun Shanaka won the toss and elected to bat.

Farhan’s blistering knock that featured five sixes and six boundaries sealed a second successive win for Pakistan in just 15.3 overs as the home team cruised to 131-3.

Sri Lanka’s white-ball tour to Pakistan saw it losing the ODI series 3-0 against the hosts, and its batters continued to struggle in the T20 format in the first two games of the tri-series.

“It was a complete game, we were very good with both bat and ball,” Pakistan captain Salman Ali Agha said. “We always wanted to start well, and he’s (Farhan) someone who if he bats for three to four overs, he can take the game away from any opposition.”

Kamil Mishara (22) got Sri Lanka going in the first three overs against the pace of Mohammad Wasim after Shaheen Shah Afridi was ruled out from Saturday’s game due to a foot injury.

But, Sri Lanka lost its way inside the power play when Mishara was deceived by a slower ball from Faheem Ashraf and holed out at mid-on and Kusal Mendis was run-out while going for a needless second run.

Left-arm spinner Mohammad Nawaz (3-16) and leg-spinner Abrar Ahmed (1-28) then squeezed Sri Lanka in the middle overs and picked up wickets with regular intervals as they slipped to 80-5 in 12 overs.

Nawaz struck off successive deliveries when he clean bowled Kusal Perera with a sharp turning delivery that spun back into the left-hander and then Shanaka couldn’t read another turning ball as his leg stump was knocked back by the left-armer.

Wasim picked up a smart juggling catch of Kamindu Mendis on the edge of the boundary at mid-wicket in Nawaz’s final over and Sri Lanka tailenders struggled to accelerate in the death overs against the pace.

Wasim and Mirza bowled to tight lengths and allowed Sri Lanka to score only 37 runs off the final five overs with Janith Liyanage showing some resistance by scoring unbeaten 41 off 38 balls.

RELATED | PAK vs SL Tri-series Match 3 Highlights

Farhan showed aggressive intent from the onset in the run chase and provided Pakistan a brisk start of 47 runs in five overs before Shanaka had Saim Ayub (20) stumped.

But Farhan didn’t hold back and dominated a 69-run stand off 52 balls with Babar Azam (16) by playing attractive shots on both sides of the wickets and raised his half century off 33 balls.

Fast bowler Dushmantha Chameera (2-29) got two late wickets when he uprooted the off stump of Babar and then had captain Salman Ali Agha trapped leg before wicket of a ball that caught the batter on the backfoot.

Farhan then finished off the game with a straight six of Malinga and also surpassed his previous best T20 score of 74.

“We aren’t a team that should perform like this, we’re better than this,” Shanaka said. “We feel very bad today ... since we arrived here we have struggled to find rhythm batting in these pitches. We need to work on that a bit, but I’m sure we’re a better team than this.”

Pakistan, which has won both its league games, next plays against Zimbabwe on Sunday. `,
      img: "http://market.mgmopr.com/api/trader/tips/images/82e77d3a-5468-474e-a667-6553151d6f6d.jpg",
    },
    {
      id: 2,
      title:
        "Premier League 2025-26: Barnes strikes twice as Newcastle edges Man City 2-1",
      desc: `Harvey Barnes scored two goals in seven minutes as his side snatched a thrilling 2-1 win over Manchester City.`,
      img: "http://market.mgmopr.com/api/trader/tips/images/82e77d3a-5468-474e-a667-6553151d6f6d.jpg",
    },
    {
      id: 3,
      title:
        "Davis Cup 2025: Spain beats Germany to set up final against Italy",
      desc: `Spain defeated Germany to qualify for the Davis Cup finals in an exciting match.`,
      img: "http://market.mgmopr.com/api/trader/tips/images/82e77d3a-5468-474e-a667-6553151d6f6d.jpg",
    },
  ];

  const goToDetail = (item: any) => {
    setSelectedItem(item);
    setOpenDetails(true);
  };

  return (
    <>
      {opendetails ? (
        <TipsDetails item={selectedItem} goBack={() => setOpenDetails(false)} />
      ) : (
        <div className='px-3 py-2'>
          <div className="border border-[#0000002d] rounded-lg bg-white shadow-sm w-full">
            <h2 className="text-xl font-bold py-2 px-4">NEWS</h2>

            <div className="flex flex-col overflow-y-auto">
              {newsData.map((item) => (
                <div onClick={() => goToDetail(item)}
                  key={item.id}
                  className="flex border-b border-[#edeef0] p-2 last:border-none"
                >
                  {/* IMAGE */}
                  <div className='w-1/3 max-w-1/3 min-w-1/3'>
                    <img
                      src={item.img}
                      alt="news"
                      className="w-full h-[90px] md:h-[130px] max-w-[285px] rounded-md object-cover"
                    />
                  </div>

                  {/* TEXT */}
                  <div className="flex flex-col w-2/3 max-w-2/3 min-w-2/3 ml-[1%]">
                    <h3 className="font-semibold text-[15px] leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-tight mt-1 line-clamp-5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}


const TipsDetails = ({ item, goBack }: { item: any; goBack: () => void }) => {
  return (
    <>
      <div className="container mx-auto p-3 text-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-2">
          <button onClick={goBack} className="text-white text-xl bg-black rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path></svg>
          </button>
          <div className="flex items-center gap-1 space-x-1 text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-days-icon lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            <span>24-11-2025</span>
          </div>
        </div>

        {/* Image & Title */}
        <div className="relative mt-2">
          <img
            src={item.img}
            alt="News Image"
            className="w-full h-auto rounded-lg object-cover"
          />
          <div className="absolute bottom-0 text-white font-bold w-full bg-black/85 px-2 py-1">
            {item.title}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 space-y-2 text-gray-800">
          {item.desc.split("\n\n").map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="h-20 border-t border-[#0000004D] mt-4"></div>
      </div>
    </>
  )
}
