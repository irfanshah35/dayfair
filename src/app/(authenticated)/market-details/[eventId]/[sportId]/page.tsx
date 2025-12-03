import { getServerSideData } from "@/lib/server-action";
import { CONFIG } from "@/lib/config";
import MMarketDetailsPage from "@/components/m-view/m-market-details-page";


interface MarketDetailsProps {
  params: Promise<{ sportId: string; eventId: string }>;
}

const MarketDetailsPage = async ({ params }: MarketDetailsProps) => {
  const { sportId, eventId } = await params;
  const marketDetailData = await getServerSideData(CONFIG.marketList, {
    sportId,
    eventId,
    key: CONFIG.siteKey,
  });

  return (
    <div>
      <MMarketDetailsPage apiData={marketDetailData}/>
    </div>
  );
};

export default MarketDetailsPage;
