import React, { useState } from "react";

const Sidebar = () => {
  // State for dropdowns
  const [othersExpanded, setOthersExpanded] = useState(true);
  const [allSportsExpanded, setAllSportsExpanded] = useState(true);
  const [expandedSports, setExpandedSports] = useState<Set<number>>(new Set());
  const [expandedTournaments, setExpandedTournaments] = useState<Set<number>>(
    new Set()
  );

  // Static data
  const popularSportList = [
    { sportId: 1, sportName: "Football", others: false, highlight: false },
    { sportId: 2, sportName: "Basketball", others: false, highlight: true },
    { sportId: 3, sportName: "Tennis", others: true, highlight: false },
    { sportId: 4, sportName: "Cricket", others: false, highlight: false },
  ];

  const tournamentsList = [
    { tournamentId: 1, tournamentName: "Premier League", sportId: 1 },
    { tournamentId: 2, tournamentName: "Champions League", sportId: 1 },
    { tournamentId: 3, tournamentName: "NBA", sportId: 2 },
    { tournamentId: 4, tournamentName: "Wimbledon", sportId: 3 },
  ];

  const eventListData = [
    { eventId: 1, name: "Man United vs Liverpool", tournamentId: 1 },
    { eventId: 2, name: "Real Madrid vs Barcelona", tournamentId: 1 },
    { eventId: 3, name: "Lakers vs Warriors", tournamentId: 3 },
    { eventId: 4, name: "Federer vs Nadal", tournamentId: 4 },
  ];

  // Toggle functions
  const toggleOthers = () => setOthersExpanded(!othersExpanded);
  const toggleAllSports = () => setAllSportsExpanded(!allSportsExpanded);

  const toggleSport = (sportId: number) => {
    setExpandedSports((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sportId)) {
        newSet.delete(sportId);
      } else {
        newSet.add(sportId);
      }
      return newSet;
    });
  };

  const toggleTournament = (tournamentId: number) => {
    setExpandedTournaments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tournamentId)) {
        newSet.delete(tournamentId);
      } else {
        newSet.add(tournamentId);
      }
      return newSet;
    });
  };

  // Filter tournaments and events based on sport
  const getTournamentsForSport = (sportId: number) => {
    return tournamentsList.filter(
      (tournament) => tournament.sportId === sportId
    );
  };

  const getEventsForTournament = (tournamentId: number) => {
    return eventListData.filter((event) => event.tournamentId === tournamentId);
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen w-full p-0 font-sans">
      {/* Others Section */}
      <div
        className="bg-gray-700 p-3 cursor-pointer hover:bg-gray-600 transition-colors"
        onClick={toggleOthers}
      >
        <h5 className="text-lg font-bold flex justify-between items-center">
          Others
          <span
            className={`transform transition-transform ${
              othersExpanded ? "rotate-0" : "-rotate-90"
            }`}
          >
            ▼
          </span>
        </h5>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          othersExpanded ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="bg-gray-800">
          {popularSportList.map(
            (item) =>
              item.others && (
                <div
                  key={item.sportId}
                  className="border-b border-gray-600 p-3 text-sm hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  {item.sportName}
                </div>
              )
          )}
        </nav>
      </div>

      {/* All Sports Section */}
      <div
        className="bg-gray-700 p-3 cursor-pointer hover:bg-gray-600 transition-colors"
        onClick={toggleAllSports}
      >
        <h5 className="text-lg font-bold flex justify-between items-center">
          All Sports
          <span
            className={`transform transition-transform ${
              allSportsExpanded ? "rotate-0" : "-rotate-90"
            }`}
          >
            ▼
          </span>
        </h5>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          allSportsExpanded ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <nav className="bg-gray-800 p-2">
          {popularSportList.map(
            (item) =>
              !item.others && (
                <div key={item.sportId} className="mb-1">
                  {/* Sport Item */}
                  <div
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded transition-colors font-semibold"
                    onClick={() => toggleSport(item.sportId)}
                  >
                    <span className="mr-2 w-4 text-center">
                      {expandedSports.has(item.sportId) ? "−" : "+"}
                    </span>
                    <span className={item.highlight ? "text-yellow-400" : ""}>
                      {item.sportName}
                    </span>
                  </div>

                  {/* Tournaments Dropdown */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ml-4 ${
                      expandedSports.has(item.sportId) ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {getTournamentsForSport(item.sportId).map((tournament) => (
                      <div
                        key={tournament.tournamentId}
                        className="ml-4 pl-4 border-l border-gray-600"
                      >
                        {/* Tournament Item */}
                        <div
                          className="flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded transition-colors text-sm"
                          onClick={() =>
                            toggleTournament(tournament.tournamentId)
                          }
                        >
                          <span className="mr-2 w-4 text-center">
                            {expandedTournaments.has(tournament.tournamentId)
                              ? "−"
                              : "+"}
                          </span>
                          {tournament.tournamentName}
                        </div>

                        {/* Events Dropdown */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ml-4 ${
                            expandedTournaments.has(tournament.tournamentId)
                              ? "max-h-96"
                              : "max-h-0"
                          }`}
                        >
                          {getEventsForTournament(tournament.tournamentId).map(
                            (event) => (
                              <div
                                key={event.eventId}
                                className="ml-4 pl-4 border-l border-gray-600"
                              >
                                <div className="flex items-center p-2 text-xs text-gray-300 hover:bg-gray-700 rounded cursor-pointer transition-colors">
                                  <span className="mr-2">▶</span>
                                  {event.name}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
