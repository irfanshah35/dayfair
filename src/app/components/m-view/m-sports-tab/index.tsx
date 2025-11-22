"use client";
import React from "react";

const MSportsTab = () => {
    return (
       <div className="w-full">
      <ul className="flex list-none bg-black mb-0 pl-0 overflow-x-scroll">

        {/* ACTIVE TAB */}
        <li>
          <a id="4" className="no-underline">
            <div
              className="flex flex-col text-center text-[12px] p-[8px] pb-[3px] min-w-max relative text-white"
              style={{
                background: "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)",
              }}
            >
              <div>
                <div className="flex justify-center mb-[5px]">
                  <img
                    src="/assets/transparent-login.gif"
                    className="w-[20px] h-[20px] sprite icon-cricket-white"
                  />
                </div>
                <div className="text-[12px] font-semibold uppercase">
                  Cricket
                </div>
              </div>
            </div>
          </a>
        </li>

        {/* INACTIVE TABS */}
        {[
          { id: 1, text: "Soccer", icon: "icon-soccer-white" },
          { id: 2, text: "Tennis", icon: "icon-tennis-white" },
          { id: 998917, text: "Volleyball", icon: "icon-VolleyBall-white" },
        ].map((item) => (
          <li key={item.id}>
            <a  id={`${item.id}`} className="no-underline">
              <div
                className="flex flex-col text-center text-[12px] p-[8px] pb-[3px] min-w-max relative bg-black text-white"
              >
                <div>
                  <div className="flex justify-center mb-[5px]">
                    <img
                      src="/assets/transparent-login.gif"
                      className={`w-[20px] h-[20px] sprite ${item.icon}`}
                    />
                  </div>
                  <div className="text-[12px] font-semibold uppercase">
                    {item.text}
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}

      </ul>
    </div>
    );
};

export default MSportsTab;
