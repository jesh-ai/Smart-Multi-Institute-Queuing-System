"use client";
import Image from "next/image";

export default function RequirementsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="w-full border-b-8 border-[#34495E] bg-gray-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="/Insitute.png"
            alt="Institute Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-xl font-semibold text-gray-800">Institute Name</h1>
        </div>
      </div>

      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
        {/* Question */}
       <h1 className="text-3xl font-bold text-black mb-20 text-center">
  Do you have all the requirements needed?
</h1>

        {/* Larger Requirements Box */}
        <div className="w-full max-w-5xl bg-[#AEB6BF] rounded-2xl p-6 mb-20 h-64 overflow-y-auto shadow-inner flex flex-col items-center">
          <p className="font-semibold text-[#34495E] mb-3 text-lg">Requirements:</p>
          <ul className="list-disc list-inside text-base text-[#1B2631] space-y-2 text-left w-full px-6">
            <li>High School Diploma</li>
            <li>Certificate of Good Moral Character</li>
            <li>Birth Certificate (PSA)</li>
            <li>2x2 ID Picture (2 copies)</li>
            <li>Medical Clearance</li>
            <li>Entrance Exam Result</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-8">
          <button className="bg-[#1B2631] text-white font-semibold px-10 py-3 rounded-full hover:bg-[#2C3E50] transition text-base">
            YES
          </button>
          <button className="bg-[#1B2631] text-white font-semibold px-10 py-3 rounded-full hover:bg-[#2C3E50] transition text-base">
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
