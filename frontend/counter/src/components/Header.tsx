"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full flex items-center gap-2 border-b-2 border-[#34495E] p-4">
      <Image src="/institute.png" alt="Logo" width={25} height={25} />
      <h1 className="text-lg font-semibold text-[#34495E]">Institute Name</h1>
    </header>
  );
}