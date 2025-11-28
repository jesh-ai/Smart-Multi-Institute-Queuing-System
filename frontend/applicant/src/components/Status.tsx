"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type QueueStatus =
  | "IN LINE"
  | "PROCESSING"
  | "CLOSED"
  | "In Line"
  | "Processing"
  | "Closed";

interface Props {
  queueNumber?: string;
  status?: QueueStatus;
  counter?: number;
  waitTime?: string;
  message?: string;
  onShowFeedback?: () => void;
}

interface ApplicantInfo {
  sessionId: string;
  status: string;
  counterName: string;
  nthInLine: number;
}

export default function QueueChatUI({
  queueNumber = "0311",
  status = "IN LINE",
  counter = 4,
  waitTime = "Approx. 2 mins wait time",
  message = "Please proceed to Counter 4.",
  onShowFeedback,
}: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<QueueStatus>(status);
  const [applicantInfo, setApplicantInfo] = useState<ApplicantInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const initialViewportHeight = useRef<number | null>(null);
  const router = useRouter();

  // Fetch applicant info
  useEffect(() => {
    const fetchApplicantInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/api/applicant/info`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch applicant info");
        }

        const result = await res.json();
        if (result.success && result.data) {
          setApplicantInfo(result.data);
          // Map status from API to component status
          const apiStatus = result.data.status;
          if (apiStatus === "In Line") {
            setCurrentStatus("IN LINE");
          } else if (apiStatus === "Processing") {
            setCurrentStatus("PROCESSING");
          } else if (apiStatus === "Closed") {
            setCurrentStatus("CLOSED");
          }
        }
      } catch (error) {
        console.error("Error fetching applicant info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantInfo();

    // Poll every 5 seconds for status updates
    const interval = setInterval(fetchApplicantInfo, 5000);
    return () => clearInterval(interval);
  }, [API_URL]);

  // Navigate to feedback after 3 seconds when status is CLOSED
  useEffect(() => {
    if (currentStatus === "CLOSED") {
      const timer = setTimeout(() => {
        router.push("/feedback");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStatus, router]);

  // Cycle through statuses on click (for testing)
  const handleStatusClick = () => {
    setCurrentStatus((prev) => {
      if (prev === "IN LINE" || prev === "In Line") return "PROCESSING";
      if (prev === "PROCESSING" || prev === "Processing") return "CLOSED";
      return "IN LINE";
    });
  };

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

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const getHeight = () =>
      window.visualViewport ? window.visualViewport.height : window.innerHeight;

    // store initial height
    initialViewportHeight.current = getHeight();

    const threshold = 150; // px reduction to treat as keyboard open

    const onResize = () => {
      const h = getHeight();
      const initial = initialViewportHeight.current ?? window.innerHeight;
      // if viewport height reduced significantly, keyboard likely opened
      if (initial - h > threshold) {
        setKeyboardOpen(true);
      } else {
        setKeyboardOpen(false);
      }
    };

    // visualViewport provides better events on mobile
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize);
    } else {
      window.addEventListener("resize", onResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onResize);
      } else {
        window.removeEventListener("resize", onResize);
      }
    };
  }, []);

  const statusColor =
    currentStatus === "IN LINE" || currentStatus === "In Line"
      ? "text-[#E1AD01]"
      : currentStatus === "PROCESSING" || currentStatus === "Processing"
      ? "text-[#0BA71D]"
      : "text-[#E13737]";

  const headerText =
    currentStatus === "IN LINE" || currentStatus === "In Line"
      ? "You are now in line!"
      : currentStatus === "PROCESSING" || currentStatus === "Processing"
      ? "You are now in processing!"
      : "You have been processed.";

  const bottomText =
    currentStatus === "CLOSED" || currentStatus === "Closed"
      ? "You may now leave the counter."
      : `Please proceed to ${
          applicantInfo?.counterName || `Counter ${counter}`
        }.`;

  // Display queue number and counter from applicant info if available
  const displayQueueNumber =
    applicantInfo?.nthInLine?.toString() || queueNumber;
  const displayStatus = applicantInfo?.status || currentStatus;
  const displayCounter = applicantInfo?.counterName || `Counter ${counter}`;

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading queue status...</div>
      </div>
    );
  }

  // Desktop: Show full-page queue status
  if (isDesktop) {
    return (
      <div
        className="h-full flex flex-col items-center justify-between bg-white pt-8 cursor-pointer"
        onClick={handleStatusClick}
      >
        {/* Queue Info */}
        <div className="flex flex-col items-center flex-grow justify-center">
          <h1 className="text-6xl font-bold text-[#1F3243]">
            {displayQueueNumber}
          </h1>
          <p className="text-2xl text-[#1F3243] mt-2">
            You have joined the queue
          </p>
          <p className="italic text-[#1F3243] text-lg">
            Queue Status:{" "}
            <span className={`${statusColor} font-bold`}>{displayStatus}</span>
          </p>

          <div className="bg-[#AEB8B8] rounded-lg justify-center p-10 mt-12 flex items-center gap-10 shadow-md">
            <div className="text-[#1F3243] text-3xl">
              <p>Please proceed to</p>
              <p>
                <strong>{displayCounter}</strong> when{" "}
              </p>
              <strong>{displayQueueNumber}</strong> is called
            </div>
            <div className="bg-[#1F3243] text-white text-center p-8 rounded-lg min-w-[200px]">
              <p className="text-3xl font-semibold text-[#D5DBDB]">Counter</p>
              <p className="text-8xl pt-6 font-bold text-[#D5DBDB]">
                {displayCounter}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // When keyboard opens on mobile, show only the small status pill (as requested)
  if (keyboardOpen) {
    return (
      <div
        className="sticky top-12 z-20 bg-white py-2"
        onClick={handleStatusClick}
      >
        <div className="text-sm text-white font-semibold bg-[#2b4059] p-2 rounded-lg w-[205px] mx-auto cursor-pointer">
          Queue Status:{" "}
          <span className={`${statusColor} font-bold`}>{displayStatus}</span>
        </div>
      </div>
    );
  }

  return (
    // offset slightly so header (sticky top-0 z-50) remains visible above this
    <div
      className="sticky top-16 z-40 flex flex-col text-gray-900"
      onClick={handleStatusClick}
    >
      {/* Main chat bubble */}
      <main className="flex-1 px-4 py-5 space-y-3">
        <div className="max-w-sm bg-gray-100 rounded-2xl shadow p-4 space-y-3 border border-gray-200 cursor-pointer">
          <div className="flex justify-between items-center bg-gray-200 p-3 rounded-lg">
            <div>
              <div className="text-sm text-white font-semibold bg-[#2b4059] p-2 rounded-lg w-[205px]">
                Queue Status:{" "}
                <span className={`${statusColor} font-bold`}>
                  {displayStatus}
                </span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mt-1">
                {displayQueueNumber}
              </div>
              <div className="text-sm text-gray-600">
                {currentStatus === "IN LINE" || currentStatus === "In Line"
                  ? `${displayQueueNumber} in line`
                  : "Now Processing"}
              </div>
              <div className="text-xs text-gray-500">{waitTime}</div>
            </div>
            <div className="bg-gray-800 text-white rounded-lg px-5 py-4 text-center -mt-5">
              <div className="text-sm">Counter</div>
              <div className="text-4xl font-bold">{displayCounter}</div>
            </div>
          </div>

          <div className="bg-gray-200 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">{headerText}</p>
            <p>Queue Number: {displayQueueNumber}</p>
            <p>
              Status:{" "}
              <span className={`${statusColor} font-bold`}>
                {displayStatus}
              </span>
            </p>
            <p>Counter: {displayCounter}</p>
          </div>

          <div className="bg-gray-200 p-3 rounded-lg text-sm font-medium">
            {bottomText}
          </div>
        </div>
      </main>
    </div>
  );
}
