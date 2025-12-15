"use client";
const MFooter = () => {
  return (
    <footer className="w-full bg-transparent">
      <div className="w-full h-8 min-[992]:h-[38px] bg-black text-white px-2.5 py-1.5"
      style={{ fontFamily: "var(--font-roboto)" }}>
        <p className="max-[992]:text-[12px] text-base text-center"
        >
          © Copyright 2024. All Rights Reserved. Powered by EXCHANGE
        </p>
      </div>
    </footer>
  );
};
export default MFooter;
