"use client"
import React, { useEffect, useState } from 'react'
import MMarketDetailsPage from '../components/m-view/m-market-details-page'
import Loader from '../components/common/loader';


const MarketDetailsPage = () => {
    const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
        <MMarketDetailsPage/>
      
    </div>
  )
}

export default MarketDetailsPage
