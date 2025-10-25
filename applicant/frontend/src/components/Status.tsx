import React from "react";

type QueueStatus = "IN LINE" | "PROCESSING" | "CLOSED";

interface Props {
  queueNumber?: string;
  status?: QueueStatus;
  counter?: number;
  waitTime?: string;
  message?: string;
}

export default function QueueChatUI({
  queueNumber = "0311",
  status = "IN LINE",
  counter = 4,
  waitTime = "Approx. 2 mins wait time",
  message = "Please proceed to Counter 4.",
}: Props) {
  const statusColor =
    status === "IN LINE"
      ? "text-yellow-600"
      : status === "PROCESSING"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";

  const bannerBg =
    status === "IN LINE"
      ? "bg-yellow-600"
      : status === "PROCESSING"
      ? "bg-green-600"
      : "bg-red-600";

  const headerText =
    status === "IN LINE"
      ? "You are now in line!"
      : status === "PROCESSING"
      ? "You are now in processing!"
      : "You have been processed.";

  const bottomText =
    status === "CLOSED"
      ? "You may now leave the counter."
      : `Please proceed to Counter ${counter}.`;

  // When keyboard opens on mobile, show only the small status pill (as requested)
  // Offset the status below the main header so it doesn't get covered.
  if (keyboardOpen) {
    return (
      // place below header (header uses top-0 and z-50)
      <div className="sticky top-16 z-40 bg-white py-2">
        <div className="text-sm text-white font-semibold bg-[#2b4059] p-2 rounded-lg w-[225px] mx-auto">
          Queue Status:{" "}
          <span className={`${statusColor} px-1 rounded`}>{status}</span>
        </div>
      </div>
    );
  }

  return (
    // offset from the top so header does not cover this sticky element
    <div className="sticky top-16 flex flex-col text-gray-900">
      {/* Main chat bubble */}
      <main className="flex-1 px-4 py-5 space-y-3">
        <div className="max-w-sm bg-gray-100 rounded-2xl shadow p-4 space-y-3 border border-gray-200">
          <div className="flex justify-between items-center bg-gray-200 p-3 rounded-lg">
            <div>
              <div className="text-sm text-white font-semibold bg-[#2b4059] p-2 rounded-lg w-[225px]">
                Queue Status:{" "}
                <span className={`${statusColor} px-1 rounded`}>{status}</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mt-1">
                {queueNumber}
              </div>
              <div className="text-sm text-gray-600">
                {status === "IN LINE" ? "1st in line" : "Now Processing"}
              </div>
              <div className="text-xs text-gray-500">{waitTime}</div>
            </div>
            <div className="bg-gray-800 text-white rounded-lg px-5 py-4 text-center -mt-5">
              <div className="text-sm">Counter</div>
              <div className="text-4xl font-bold">{counter}</div>
            </div>
          </div>

          <div className="bg-gray-200 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">{headerText}</p>
            <p>Queue Number: {queueNumber}</p>
            <p>
              Status:{" "}
              <span className={`${statusColor} font-bold px-1 rounded`}>
                {status}
              </span>
            </p>
            <p>Counter: {counter}</p>
          </div>

          <div className="bg-gray-200 p-3 rounded-lg text-sm font-medium">
            {bottomText}
          </div>
        </div>
      </main>
    </div>
  );
}
