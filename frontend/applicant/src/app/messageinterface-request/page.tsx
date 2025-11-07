"use client";
import Image from "next/image";

export default function RequestPage() {
  const requests = Array(6).fill({
    title: "Request",
    desc: "Request a document lorem ipsum...",
  });

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
          <h1 className="text-xl font-semibold text-gray-800">
            Institute Name
          </h1>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mt-12 mb-8 text-center text-gray-900">
        What would you like to request?
      </h2>

      {/* Request Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-10">
        {requests.map((req, index) => (
          <div
            key={index}
            className="bg-[#2C3E50] text-white rounded-lg p-4 flex items-center gap-4 shadow-md hover:bg-[#34495E] transition-all cursor-pointer"
          >
            {/* The uploaded icon beside the text */}
            <Image
              src="/request-icon-blue.png"
              alt="Request Icon"
              width={45}
              height={45}
              className="object-contain"
            />

            <div>
              <h3 className="font-bold italic text-lg">{req.title}</h3>
              <p className="text-sm text-gray-300">{req.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
