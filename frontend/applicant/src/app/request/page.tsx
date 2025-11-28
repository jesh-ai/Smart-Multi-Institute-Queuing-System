"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RequestChoice {
  title: string;
  desc: string;
}

export default function RequestPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const router = useRouter();
  const [requests, setRequests] = useState<RequestChoice[]>([]);

  useEffect(() => {
    // Fetch the services from the backend
    fetch(`${API_URL}/api/institute/services`)
      .then((res) => res.json())
      .then((services) => {
        const requestList: RequestChoice[] = services.map(
          (service: { name: string; requirements: string[] }) => ({
            title: service.name,
            desc: `Request for ${service.name}`,
          })
        );
        // Add "Other" option at the end
        requestList.push({
          title: "Other",
          desc: "Request for Other",
        });
        setRequests(requestList);
      })
      .catch((err) => {
        console.error("Failed to load services", err);
        // Fallback to hardcoded values
        setRequests([
          {
            title: "DFA - New Passport Application",
            desc: "Request for DFA - New Passport Application",
          },
          {
            title: "DFA - Passport Renewal",
            desc: "Request for DFA - Passport Renewal",
          },
          {
            title: "PhilHealth - Member Registration",
            desc: "Request for PhilHealth - Member Registration",
          },
          {
            title: "PhilHealth - Member Data Record Update",
            desc: "Request for PhilHealth - Member Data Record Update",
          },
          { title: "Other", desc: "Request for Other" },
        ]);
      });
  }, []);

  const handleRequestClick = async (request: RequestChoice) => {
    // If "Other" is selected, send message to chat and navigate to chat
    if (request.title.toLowerCase() === "other") {
      try {
        // Save the interaction
        await fetch("/api/save-interaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMessage: "Other",
            botResponse:
              "Please describe your concern, and we'll assist you shortly.",
            interactionType: "closed",
          }),
        });
      } catch (error) {
        console.error("Failed to save interaction:", error);
      }

      // Navigate to chat page with the message
      router.push("/chat?message=Other");
    } else {
      // For other requests, navigate to requirements page with form parameter
      router.push(`/requirements?form=${encodeURIComponent(request.title)}`);
    }
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
