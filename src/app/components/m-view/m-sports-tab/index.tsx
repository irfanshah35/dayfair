"use client";
import React, { useState } from "react";

const MSportsTab = () => {
    const [activeTab, setActiveTab] = useState(4);

    const items = [
        { id: 4, text: "Cricket", icon: "icon-cricket-white" },
        { id: 1, text: "Soccer", icon: "icon-soccer-white" },
        { id: 2, text: "Tennis", icon: "icon-tennis-white" },
        { id: 998917, text: "Volleyball", icon: "icon-VolleyBall-white" },
    ];

    return (
        <div className="w-full">
            <ul className="flex list-none bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)] mb-0 pl-0 overflow-x-scroll">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            id={`${item.id}`}
                            className="no-underline cursor-pointer"
                            onClick={() => setActiveTab(item.id)}>
                            <div
                                className={`flex flex-col text-center text-[12px] p-2 pb-[3px] min-w-max relative text-white
                                    ${activeTab === item.id
                                        ? "bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]"
                                        : "bg-transparent"}
                                `}>
                                <div>
                                    <div className="flex justify-center mb-[5px]">
                                        <img
                                            src="/assets/transparent-login.gif"
                                            className={`w-5 h-5 sprite ${item.icon}`}
                                        />
                                    </div>
                                    <div className="text-[12px] font-semibold uppercase tracking-[-0.1px]">
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
