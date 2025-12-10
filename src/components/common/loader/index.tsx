import React from "react";

const Loader = () => {
  return (
    <div className="flex absolute z-9999999 loderrr inset-0 items-center justify-center min-h-screen bg-white/10">
      <div className="relative w-20 h-20  animate-spin">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute w-[6.5px] h-[6.5px] bg-black rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${index * 45}deg) translate(0, -18px)`,
              transformOrigin: "0 0",
              opacity: index === 0 ? 0 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
