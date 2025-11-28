"use client";
import React from "react";
import Image from "next/image";

interface NeedHelpProps {
  message?: string;
}

export function NeedHelp({ message = "Need Help?" }: NeedHelpProps) {
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(new Event("openHelpChat"));
  };

  return (
    <div className="mb-6 relative">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-opacity hover:opacity-80"
        type="button"
      >
        <Image 
          src="/ALVin1.png" 
          alt="Alvin" 
          width={32} 
          height={32} 
        />
        <span className="text-sm italic font-medium">{message}</span>
      </button>
    </div>
  );
} 