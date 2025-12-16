import dynamic from "next/dynamic";
import React from "react";

interface GameListRoute {
  params: Promise<{ sportId: string; sportName: string }>;
}

const DGameList = dynamic(() => import("@/components/d-view/d-gamelist"), {
  loading: () => <></>,
});

const GameList = async ({ params }: GameListRoute) => {
  const { sportId, sportName } = await params;

  return <DGameList sportId={sportId} sportName={sportName} />;
};

export default GameList;
