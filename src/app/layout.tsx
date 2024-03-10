import "@/styles/globals.css";

import { Roboto } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "@vercel/analytics/react";
import dayjs from "dayjs";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";
import UserProvider from "./components/UserProvider";
import { Toaster } from "./components/ui/sonner";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
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
  dayjs.locale("pt-br");

  return (
    <html lang="en">
      <body
        className={`font-roboto bg-gray-100 dark:bg-background ${roboto.variable}`}
      >
        <>
          <TRPCReactProvider>
            <ThemeProvider attribute="class" enableSystem>
              <Navbar />
              <Toaster />
              <UserProvider>{children}</UserProvider>
            </ThemeProvider>
          </TRPCReactProvider>
          <Analytics />
        </>
      </body>
    </html>
  );
}
