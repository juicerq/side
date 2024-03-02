import "@/styles/globals.css";

import { Roboto } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import UserProvider from "./components/UserProvider";
import dayjs from "dayjs";

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
      <body className={`font-roboto ${roboto.variable}`}>
        <>
          <TRPCReactProvider>
            <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
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
