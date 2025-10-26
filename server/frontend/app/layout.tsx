import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/NavBar";

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
      <body className="min-h-screen bg-[#f9f9f4] text-gray-900">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
