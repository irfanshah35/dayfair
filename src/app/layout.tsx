"use client";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import MFooter from "./components/m-view/m-footer";
import MMenuTabs from "./components/m-view/m-menu-tabs";
import MSportsTab from "./components/m-view/m-sports-tab";
import Header from "./components/shared/Header";

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
  
  // Routes where header and footer should be hidden
  const hideHeaderFooter = pathname === "/mlogin";
  
  // Routes where MMenuTabs and MSportsTab should show
  const showMenuAndSports = pathname === "/" || pathname === "/inplay";
  
  // Routes where only MMenuTabs should show
  const showMenuOnly = pathname === "/live-casino" || pathname === "/m-tipsreview";

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
        
        {showMenuAndSports && (
          <>
            <MMenuTabs />
            <MSportsTab />
          </>
        )}
        
        {showMenuOnly && <MMenuTabs />}
        
        {children}
        
        {!hideHeaderFooter && <MFooter />}
      </body>
    </html>
  );
}