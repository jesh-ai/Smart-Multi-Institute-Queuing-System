"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RequirementsPage() {
  const router = useRouter();

  const handleYes = () => {
    // Navigate to form filling page
    router.push("/form");
  };

  const handleNo = () => {
    // Navigate back or show message
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
        {/* Question */}
        <h1 className="text-3xl font-bold text-black mb-20 text-center">
          Do you have all the requirements needed?
        </h1>

        {/* Larger Requirements Box */}
        <div className="w-full max-w-5xl bg-[#AEB6BF] rounded-2xl p-6 mb-20 h-64 overflow-y-auto shadow-inner flex flex-col items-center">
          <p className="font-semibold text-[#34495E] mb-3 text-lg">
            Requirements:
          </p>
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
          <button
            onClick={handleYes}
            className="bg-[#1B2631] text-white font-semibold px-10 py-3 rounded-full hover:bg-[#2C3E50] transition text-base"
          >
            YES
          </button>
          <button
            onClick={() => router.back()}
            className="bg-[#1B2631] text-white font-semibold px-10 py-3 rounded-full hover:bg-[#2C3E50] transition text-base"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
