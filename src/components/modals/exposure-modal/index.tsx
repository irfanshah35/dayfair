"use client";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

interface ExposureModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ExposureModal({ open, onClose }: ExposureModalProps) {
  const [show, setShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [exposerData, setExposerData] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (open) {
      fetchData({
        url: CONFIG.getExposureListURL,
        payload: { key: CONFIG.siteKey },
        setFn: setExposerData,
      });
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      document.body.style.overflow = "auto";
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleNavigation = (eventId: string, eventTypeId: string) => {
    // Close modal first
    onClose();
    // Then navigate
    router.push(`/market-details/${eventId}/${eventTypeId}`);
  };

  if (!show) return null;

  return (
    <div>
      <div className="fixed text-black inset-0 pt-2 md:pt-5.5 min-[992px]:pt-3.5 bg-black/50 flex items-baseline min-[992px]:items-start justify-center z-50">
        <div
          ref={modalRef}
          className={`
          bg-white mx-[7px] max-[768px]:w-[500px] md:w-[498px] max-h-screen [@media(min-width:992px)]:w-[71.5%] shadow-lg overflow-y-auto no-scrollbar
          transform transition-all duration-300 ease-out
          ${open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2.5 h-[49px] md:py-0! bg-[linear-gradient(180deg,#000000,#000000_42%,#000000)] text-white [@media(min-width:992px)]:h-[47px]">
            <h1 className="text-xl font-medium relative -top-px">
              My Market
            </h1>
            <button
              onClick={onClose}
              className="bg-transparent border-0 p-0 text-[35px] cursor-pointer [@media(min-width:992px)]:text-[33px]"
            >
              ×
            </button>
          </div>

          <div className="p-3">
            <table className="w-full border-collapse border border-black/12.5">
              <thead>
                <tr>
                  <th className="p-0.5 md:px-3 min-[992px]:py-[7px] h-[26px] min-[992px]:h-10 text-center text-black border border-black/12.5 text-sm min-[992px]:text-base">
                    Sport Name
                  </th>
                  <th className="p-0.5 md:px-3 min-[992px]:py-[7px] h-[26px] min-[992px]:h-10 text-center text-black border border-black/12.5 text-sm min-[992px]:text-base">
                    Event Name
                  </th>
                  <th className="p-0.5 md:px-3 min-[992px]:py-[7px] h-[26px] min-[992px]:h-10 text-center text-black border border-black/12.5 text-sm min-[992px]:text-base">
                    Market Name
                  </th>
                  <th className="p-0.5 md:px-3 min-[992px]:py-[7px] h-[26px] min-[992px]:h-10 text-center text-black border border-black/12.5 text-sm min-[992px]:text-base">
                    Trade
                  </th>
                </tr>
              </thead>

              <tbody>
                {exposerData?.length > 0 ? (
                  exposerData?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-2 py-1.5 md:px-3 md:py-[7px] h-10 text-center border text-black border-black/12.5 bg-transparent text-xs md:text-base">
                        {item?.eventType?.name}
                      </td>
                      <td
                        className="px-2 py-1.5 md:px-3 md:py-[7px] h-10 text-center border text-[#0d6efd] border-black/12.5 bg-transparent text-xs md:text-base cursor-pointer "
                        onClick={() => handleNavigation(item?.event?.id, item?.eventType?.id)}
                      >
                        {item?.event?.name}
                      </td>
                      <td 
                        className="px-2 py-1.5 md:px-3 md:py-[7px] h-10 text-center border text-[#0d6efd] border-black/12.5 bg-transparent text-xs md:text-base cursor-pointer "
                      >
                        {item?.market?.name }
                      </td>
                      <td className="px-2 py-1.5 md:px-3 md:py-[7px] h-10 text-center border text-black border-black/12.5 bg-transparent text-xs md:text-base">
                        {item?.betCounts}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-2 py-[2px] min-[992px]:py-1.5 md:px-3 min-[992px]:py-[7px] h-[23px] min-[992px]:h-10 text-center border text-black border-black/12.5 bg-transparent text-xs min-[992px]:text-base"
                    >
                      No real-time records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}