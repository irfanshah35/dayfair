import React from "react";

const DSportNav = () => {
  const sports = ["Cricket", "Tennis", "Soccer", "Horse Racing"];

  return (
    <div className="w-full px-[9px]">
      <ul
        className="
        flex 
        overflow-x-scroll 
        list-none 
        mt-0.5 
        mb-0 
        ml-0.5 
        pl-0 
        pt-0
        [scrollbar-width:none]
        bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]
      "
      >
        {sports.map((sport, index) => (
          <li
            key={index}
            className={`
              px-[15px] py-1
              cursor-pointer
              border-r border-white
              min-w-max
              text-[16px]
              ${
                sport === "Cricket"
                  ? "text-black bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]"
                  : "text-white"
              }
            `}
          >
            <a>{sport}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DSportNav;
