"use client";
import { useAppStore } from "@/lib/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown, FaCaretRight } from "react-icons/fa";
import { FaRegSquarePlus, FaRegSquareMinus } from "react-icons/fa6";
import dynamic from "next/dynamic";

const lazyLoadCasino = dynamic(() => import("@/components/m-view/m-live-casino"), {
  ssr: false,
  loading: () => <></>,
});

const adaptEventsMap = (raw: any): Record<string, any[]> => {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, any[]> = {};

  Object.keys(raw).forEach((sportId) => {
    const arr = raw[sportId] || [];
    out[sportId] = arr.map((it: any) => ({
      sportId: String(sportId),
      tournamentId: String(it?.competition?.id ?? ""),
      tournamentName: it?.competition?.name ?? "",
      totalMatched: it?.oddsData?.totalMatched ?? it?.totalMatched ?? 0,
      eventId: String(it?.event?.id ?? it?.id ?? ""),
      eventTypeId: String(it?.eventType?.id ?? ""),
      __raw: it,
    }));
  });

  return out;
};

const buildTournamentsForSport = (
  sportId: string,
  eventsMap: Record<string, any[]>
) => {
  const arr = eventsMap[sportId] || [];
  const seen = new Set<string>();
  const unique: any[] = [];

  for (const ev of arr) {
    if (ev.tournamentId && !seen.has(ev.tournamentId)) {
      seen.add(ev.tournamentId);
      unique.push({
        tournamentId: ev.tournamentId,
        tournamentName: ev.tournamentName,
      });
    }
  }
  unique.sort((a, b) => a.tournamentName.localeCompare(b.tournamentName));
  return unique;
};

export default function Sidebar() {
  const [isOthersOpen, setIsOthersOpen] = useState(true);
  const [isAllSportsOpen, setIsAllSportsOpen] = useState(true);
  const [eventList, setEventList] = useState<any>();
  const [popularSportsList, setPopularSportList] = useState<any>();
  const [tournamentList, setTournamentList] = useState<any>();
  const router = useRouter();
  const { menuList, allEventsList } = useAppStore();

  useEffect(() => {
    const events = adaptEventsMap(allEventsList);
    const adapted = adaptSports(menuList?.eventTypes || []);
    const popularSports = adapted.filter((s: any) => {
      const list = events?.[String(s.sportId)];
      return Array.isArray(list) && list.length > 0;
    });
    setPopularSportList(popularSports);
  }, [menuList, allEventsList]);

  const priorityOrder: Record<string, number> = {
    Cricket: 1,
    Soccer: 2,
    Tennis: 3,
  };

  const adaptSports = (list: any[]): any[] => {
    return (list || [])
      .map((x: any) => ({
        sportId: String(x?.eventType?.id ?? ""),
        sportName: x?.eventType?.name ?? "",
        sequence: priorityOrder[x?.eventType?.name] ?? 999,
        marketCount: x?.marketCount ?? 0,
        isOpen: false,
      }))
      .filter((s) => s.sportId !== "66103")
      .sort((a, b) => a.sequence - b.sequence);
  };

  const [open, setOpen] = useState<{
    sport: string;
    tournament: string | null;
  }>({ sport: "0", tournament: null });

  const pathName = usePathname();

  const toggleSport = (key: string) => {
    setOpen((prev) => ({
      sport: prev.sport === key ? "0" : key,
      tournament: null,
    }));
    const events = adaptEventsMap(allEventsList);
    const tournament = buildTournamentsForSport(key, events || {});
    setTournamentList(tournament);
  };

  const toggleTournament = (key: string) => {
    if (pathName?.includes("/market-details") && open.tournament !== key) {
      router.push("/");
    }
    setOpen((prev) => ({
      ...prev,
      tournament: prev.tournament === key ? "0" : key,
    }));
    const events = adaptEventsMap(allEventsList);
    const eventData = events[open.sport];
    const filteredEvents = eventData.filter(
      (e: any) => e.tournamentId === String(key)
    );
    const sortedEvents = filteredEvents?.sort(
      (a: any, b: any) => b.totalMatched - a.totalMatched
    );
    setEventList(sortedEvents);
  };

  const handleCasinoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    lazyLoadCasino; // triggers lazy load
    router.push("/live-casino");
  };

  const handleMarketDetailsClick = (event: any) => {
    router.push(`/market-details/${event?.eventId}/${event?.sportId}`);
  };

  return (
    <div
      className="p-0 h-full hidden md:block"
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
          className="cursor-pointer ps-1.5 pe-2 py-[7px]  min-h-[29.59px] mb-0 btn-clr text-white mt-px"
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
          <nav className="bg-[#C3BDBD]  border-b border-[#9e9e9e]">
            <ul className="py-[5] px-3 ml-[-9] h-[24.5px]">
              <li className="list-none text-white ml-2.5">
                <a href="#" onClick={handleCasinoClick}>
                  Casino
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* All Sports */}
      <div>
        <div
          className="cursor-pointer pe-2 ps-1.5 py-[7px] mb-0 mt-[0.8px] btn-clr text-white h-[30px]"
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
            {popularSportsList?.map((item: any, idx: number) => (
              <ul
                key={idx}
                className={`mb-0 ${idx === 0 ? "mt-[6.2px]" : "mt-[5.2px]"
                  }`}
              >
                <li className="list-none pl-2.5 pr-0">
                  {/* Sport name */}
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleSport(item?.sportId)}
                  >
                    <span className="relative bottom-[1.7px]">
                      {open.sport === item?.sportId ? (
                        <FaRegSquareMinus className="inline-block w-3.5 h-[19px]" />
                      ) : (
                        <FaRegSquarePlus className="inline-block w-3.5 h-[19px]" />
                      )}
                    </span>

                    <span className="pl-1.5">{item?.sportName}</span>
                  </div>

                  {/* Tournament list */}
                  {open.sport === item?.sportId && (
                    <ul className="mb-0 ml-0 pl-0 relative bottom-0.5">
                      {tournamentList?.map((tour: any) => (
                        <li
                          key={tour?.tournamentId}
                          className="list-none py-1 pl-[19px] pr-0 leading-2.5"
                        >
                          {/* Tournament */}
                          <div
                            className="cursor-pointer "
                            onClick={() => toggleTournament(tour?.tournamentId)}
                          >
                            <span className="relative bottom-0.5">
                              {open.tournament === tour?.tournamentId ? (
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
                            <span className="pl-[3px]">
                              {tour?.tournamentName}
                            </span>
                          </div>

                          {/* Matches */}
                          {open.tournament === tour?.tournamentId && (
                            <ul className="mb-0 ml-0 pl-0 ">
                              {eventList?.map((event: any, idx: number) => (
                                <li
                                  key={idx}
                                  className="list-none py-1 pl-4 pr-0"
                                  onClick={() =>
                                    handleMarketDetailsClick(event)
                                  }
                                >
                                  <div className="cursor-pointer flex items-start">
                                    <FaCaretRight
                                      className="inline-block mt-0.5"
                                      size={17}
                                    />
                                    <span>
                                      {event?.__raw?.event?.name ||
                                        event?.__raw?.name ||
                                        "Event " + event?.eventId}
                                    </span>
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