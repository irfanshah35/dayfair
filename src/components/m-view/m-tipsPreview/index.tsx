"use client";
import { newsData } from "@/lib/projectData";
import React, { useState } from "react";

export default function MTipsPreview() {
  const [opendetails, setOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const goToDetail = (item: any) => {
    setSelectedItem(item);
    setOpenDetails(true);
  };

  return (
    <>
      {opendetails ? (
        <TipsDetails item={selectedItem} goBack={() => setOpenDetails(false)} />
      ) : (
        <div className="px-3 py-2">
          <div className="border border-[#0000002d] rounded-lg bg-white shadow-sm w-full">
            <h2 className="text-xl font-bold py-2 px-4">NEWS</h2>

            <div className="flex flex-col overflow-y-auto">
              {newsData.map((item) => (
                <div
                  onClick={() => goToDetail(item)}
                  key={item.id}
                  className="flex border-b border-[#edeef0] p-2 last:border-none"
                >
                  {/* IMAGE */}
                  <div className="w-1/3 max-w-1/3 min-w-1/3">
                    <img
                      src={item.img}
                      alt="news"
                      className="w-full h-[90px] md:h-[130px] max-w-[285px] rounded-md object-cover"
                    />
                  </div>

                  {/* TEXT */}
                  <div className="flex flex-col w-2/3 max-w-2/3 min-w-2/3 ml-[1%]">
                    <h3 className="font-semibold text-[15px] leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-tight mt-1 line-clamp-5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const TipsDetails = ({ item, goBack }: { item: any; goBack: () => void }) => {
  return (
    <>
      <div className="container mx-auto p-3 text-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-2">
          <button
            onClick={goBack}
            className="text-white text-xl bg-black rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
            </svg>
          </button>
          <div className="flex items-center gap-1 space-x-1 text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar-days-icon lucide-calendar-days"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
            <span>24-11-2025</span>
          </div>
        </div>

        {/* Image & Title */}
        <div className="relative mt-2">
          <img
            src={item.img}
            alt="News Image"
            className="w-full h-auto rounded-lg object-cover"
          />
          <div className="absolute bottom-0 text-white font-bold w-full bg-black/85 px-2 py-1">
            {item.title}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 space-y-2 text-gray-800">
          {item.desc.split("\n\n").map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="h-20 border-t border-[#0000004D] mt-4"></div>
      </div>
    </>
  );
};
