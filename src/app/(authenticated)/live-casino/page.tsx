import dynamic from "next/dynamic";
import React from "react";

// Dynamic import with loading
const MLiveCasino = dynamic(() => import("@/components/m-view/m-live-casino"), {
  loading: () => < ></>,
});

const LiveCasino = () => {
  return (
    <div>
      <MLiveCasino />
    </div>
  );
};

export default LiveCasino;
