"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RequestChoice {
  title: string;
  desc: string;
}

export default function RequestPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestChoice[]>([]);

  useEffect(() => {
    // Fetch the choices from responses.json
    fetch("/responses.json")
      .then((res) => res.json())
      .then((data) => {
        const choices = data.inquiry?.Choices || {};
        const requestList: RequestChoice[] = Object.values(choices).map(
          (value) => ({
            title: value as string,
            desc: `Request for ${value}`,
          })
        );
        setRequests(requestList);
      })
      .catch((err) => {
        console.error("Failed to load responses.json", err);
        // Fallback to hardcoded values
        setRequests([
          {
            title: "Passport Application Form",
            desc: "Request for Passport Application Form",
          },
          {
            title: "Passport Record Certification Request Form",
            desc: "Request for Passport Record Certification Request Form",
          },
          { title: "Clearance", desc: "Request for Clearance" },
          { title: "Other", desc: "Request for Other" },
        ]);
      });
  }, []);

  const handleRequestClick = (request: RequestChoice) => {
    // Navigate to requirements page or handle the request
    console.log("Selected request:", request.title);
    // You can navigate to a requirements page or show requirements modal
    // For now, let's navigate to a requirements check page
    router.push("/requirements");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div>
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back
        </button>
      </div>

      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-8">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
          What would you like to request?
        </h2>

        {/* Request Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-10 max-w-6xl w-full">
          {requests.map((req, index) => (
            <div
              key={index}
              onClick={() => handleRequestClick(req)}
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

              <div className="text-left">
                <h3 className="font-bold italic text-lg">{req.title}</h3>
                <p className="text-sm text-gray-300">{req.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
