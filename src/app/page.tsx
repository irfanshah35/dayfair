"use client";
import { useEffect, useState } from "react";
import MHeader from "./components/m-view/m-header";


export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {isMobile ? (
        <>
        <MHeader/>
        </>
      ) : (
        <>
        
        </>
      )}
    </div>
  );
}
