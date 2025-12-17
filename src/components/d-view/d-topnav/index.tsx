"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store/store";

const DTopnav = () => {
  const pathname = usePathname();
  const { menuList } = useAppStore();
  
  const [navItems, setNavItems] = useState([
    { href: "/", label: "HOME" },
    { href: "/inplay", label: "In-Play" },
  ]);
  const navData = ["cricket", "soccer", "tennis"];

  useEffect(() => {
    const eventsType = menuList?.eventTypes;
    const staticItems = [
      { href: "/", label: "HOME" },
      { href: "/inplay", label: "In-Play" },
    ];

    if (!eventsType) {
        setNavItems(staticItems);
        return;
    }

    const newItems = eventsType
      .filter((item: any) =>
        navData?.includes(item?.eventType?.name?.toLowerCase())
      )
      .map((item: any) => ({
        href: `/game-list/${item?.eventType?.name}/${item?.eventType?.id}`,
        label: item?.eventType?.name?.toUpperCase(),
      }));

    setNavItems([...staticItems, ...newItems]);

  }, [menuList]);

  const isActive = useCallback((href: string) => {
    if (!href) return false;

    if (pathname === href) return true;

    if (href === '/' && pathname.includes('/market-detail')) {
      return true;
    }
    if (href !== '/' && pathname.startsWith(href)) {
      return true;
    }

    return false;
  }, [pathname]);

  return (
    <div className="hidden md:block">
      <div
        className="h-[39px] flex items-center"
        style={{
          background: "linear-gradient(-180deg, #f4b501 0%, #f68700 100%)",
        }}
      >
        <div className="flex items-center h-full">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="nav-link px-[15px] uppercase tracking-[-0.1] py-0 h-text flex items-center text-black text-[14px] transition-opacity relative group"
            >
              {item.label}
              
              {/* Active Indicator */}
              {isActive(item.href) && (
                <span className="absolute bottom-[-3px] left-0 right-0 h-0.5 bg-black"></span>
              )}

              {/* Hover Effect */}
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