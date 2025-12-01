import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import ResponsiveLayout from "./responsive-layout";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { ToastProvider } from "@/components/common/toast/toast-context";

const ToastContainer = dynamic(
  () => import("@/components/common/toast/toast-container")
);

export const metadata: Metadata = {
  title: "Dayfair",
  description: "Explore Dayfair",
};

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
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${robotoCondensed.variable} 
          antialiased
        `}
        cz-shortcut-listen="true"
      >
        <ToastProvider>
          <ResponsiveLayout>{children}</ResponsiveLayout>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
