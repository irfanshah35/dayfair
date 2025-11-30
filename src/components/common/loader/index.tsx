import React from "react";

const Loader = () => {
  return (
    <div className="flex absolute z-9999999 inset-0 items-center justify-center min-h-screen bg-white/50">
      <div className="relative w-12 h-12  animate-spin">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute w-1.5 h-1.5 bg-black rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${index * 45}deg) translate(0, -16px)`,
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
