import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Side",
  description: "Generated by create-t3-app for Side",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <>
          <TRPCReactProvider>
            <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
              <Navbar />
              <Toaster />
              {children}
            </ThemeProvider>
          </TRPCReactProvider>
          <Analytics />
        </>
      </body>
    </html>
  );
}
