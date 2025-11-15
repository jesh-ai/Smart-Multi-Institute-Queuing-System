"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header"; // adjust if your header path differs

export default function ConditionalHeader() {
  const pathname = usePathname() ?? "";
  // hide header on /chat and any subpaths
  if (pathname.startsWith("/chat")) return null;
  return <Header />;
}