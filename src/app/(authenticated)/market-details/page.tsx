"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/common/loader";

const MMarketDetailsPage = dynamic(
  () =>
    new Promise<typeof import("@/components/m-view/m-market-details-page")>(
      (resolve) => {
        setTimeout(() => {
          resolve(import("@/components/m-view/m-market-details-page"));
        }, 1500); // artificial delay for loader
      }
    ),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const MarketDetailsPage: React.FC = () => {
  return (
    <div>
      <MMarketDetailsPage />
    </div>
  );
};

export default MarketDetailsPage;
