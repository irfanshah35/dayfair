"use client";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import MFooter from "./components/m-view/m-footer";
import MMenuTabs from "./components/m-view/m-menu-tabs";
import MSportsTab from "./components/m-view/m-sports-tab";
import Header from "./components/shared/Header";
import Sidebar from "./components/shared/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname === "/mlogin";
  const showMenuAndSports = pathname === "/" || pathname === "/inplay";
  const showMenuOnly =
    pathname === "/live-casino" || pathname === "/m-tipsreview";

  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${robotoCondensed.variable}
          antialiased
        `}
      >
        {!hideHeaderFooter && <Header />}

        <div className="flex">
          <div className="hidden md:block fixed left-0 top-[119px] h-full w-60">
            <Sidebar />
          </div>

          <div className={`${!hideHeaderFooter ? "md:ml-60" : ""} flex-1`}>
            {showMenuAndSports && (
              <>
                <MMenuTabs />
                <MSportsTab />
              </>
            )}

            {showMenuOnly && <MMenuTabs />}

            {children}
          </div>
        </div>

        {!hideHeaderFooter && <MFooter />}
      </body>
    </html>
  );
}
