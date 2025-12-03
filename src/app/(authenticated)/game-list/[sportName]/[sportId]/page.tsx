import DGameList from "@/components/d-view/d-gamelist";
import React from "react";

interface GameListRoute {
  params: Promise<{ sportId: string; sportName: string }>;
}

const GameList = async ({ params }: GameListRoute) => {
  const { sportId, sportName } = await params;
  return <DGameList sportId={sportId} sportName={sportName} />;
};

export default GameList;
