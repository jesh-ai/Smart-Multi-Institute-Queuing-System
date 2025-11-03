"use client";
import { useState } from "react";

export default function FeedbackPage({ onBack }: { onBack: () => void }) {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const ratings = ["Very Poor", "Fair", "Good", "Excellent"];

  const handleSubmit = () => {
    if (!selectedRating && !feedback.trim()) {
      alert("Please select a rating or provide feedback.");
      return;
    }
    alert(
      `Feedback submitted:\nRating: ${
        selectedRating || "N/A"
      }\nComment: ${feedback}`
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* Feedback Card */}
      <div className="bg-[#B7C3C7] rounded-lg shadow-md w-[90%] max-w-sm mt-10 p-5 flex flex-col gap-4">
        {/* Title */}
        <h2 className="text-lg font-bold text-[#34495E]">Feedback Survey</h2>

        {/* Experience Question */}
        <div>
          <p className="text-sm text-[#34495E] mb-2">
            How was your experience?
          </p>
          <div className="flex flex-wrap gap-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className={`px-4 py-1.5 rounded-full text-sm transition ${
                  selectedRating === rating
                    ? "bg-[#34495E] text-white"
                    : "bg-white text-[#34495E]"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <p className="text-sm text-[#34495E] mb-1">Comments</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder=""
            className="w-full rounded-md p-2 text-sm text-[#34495E] bg-white"
            rows={2}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-2">
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-full border border-[#34495E] text-[#34495E] bg-white"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-full bg-[#132437] text-white hover:bg-[#0f1a29]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
