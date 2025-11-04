import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Multi-Institute Queuing System",
  description: "Server Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {

      }
      <body className={`${inter.className} min-h-screen bg-[#f9f9f4] text-gray-900`}>
        <Navbar />
        {

        }
        <main>{children}</main>
      </body>
    </html>
  );
}
