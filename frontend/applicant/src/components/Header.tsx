"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [isDesktop, setIsDesktop] = useState(false);
  const [instituteName, setInstituteName] = useState("Institute Name");

  useEffect(() => {
    // Fetch institute name from backend
    const fetchInstituteName = async () => {
      try {
        const response = await fetch(`${API_URL}/api/institute/info`);
        if (response.ok) {
          const data = await response.json();
          setInstituteName(data.name || "Institute Name");
        }
      } catch (error) {
        console.error("Error fetching institute name:", error);
      }
    };
    fetchInstituteName();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener?.("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (isDesktop) {
    // Desktop header (from FeedbackFormPage design)
    return (
      <header
        style={{ minHeight: "var(--header-height)" }}
        className="w-full flex items-center border-b-8 border-[#1F3243] px-6 py-3"
      >
        <Image src="/institute.png" alt="Logo" width={30} height={30} />
        <h1 className="ml-2 text-2xl font-semibold text-[#1F3243]">
          {instituteName}
        </h1>
      </header>
    );
  }

  // Mobile / default header (sticky)
  return (
    <header
      style={{ minHeight: "var(--header-height)" }}
      className="w-full flex items-center gap-2 border-b-2 border-[#34495E] p-4 sticky top-0 z-50 bg-white"
    >
      <Image src="/institute.png" alt="Logo" width={25} height={25} />
      <h1 className="text-lg font-semibold text-[#34495E]">{instituteName}</h1>
    </header>
  );
}
