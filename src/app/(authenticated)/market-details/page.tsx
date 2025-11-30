import dynamic from "next/dynamic";

const MMarketDetailsPage = dynamic(
  () => import("@/components/m-view/m-market-details-page")
);

const MarketDetailsPage = () => {
  return (
    <div>
      <MMarketDetailsPage />
    </div>
  );
};

export default MarketDetailsPage;
