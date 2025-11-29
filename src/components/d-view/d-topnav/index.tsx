"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DTopnav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "HOME" },
    { href: "/inplay", label: "In-Play" },
    { href: "/cricket", label: "CRICKET" },
    { href: "/soccer", label: "SOCCER" },
    { href: "/tennis", label: "TENNIS" },
    { href: "/volleyball", label: "VOLLEYBALL" },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="hidden md:block">
      <div
        className="h-[39px] flex items-center"
        style={{
          background: "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)",
        }}
      >
        <div className="flex items-center h-full">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link px-[15px] uppercase tracking-[-0.1] py-0 h-text flex items-center text-black text-[14px] transition-opacity relative group font-bold"
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-[-3px] left-0 right-0 h-0.5 bg-black"></span>
              )}

              {!isActive(item.href) && (
                <span className="absolute bottom-[-3px] left-1/2 right-1/2 h-0.5 bg-white transition-all duration-500 ease-out group-hover:left-0 group-hover:right-0"></span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DTopnav;
