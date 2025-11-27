"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Status from "../../components/Status";

function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Detect if desktop (1024px+)
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // local menu visibility (desktop only).
  const [showMenu, setShowMenu] = useState<boolean>(false);
  // MenuScreen moved here for desktop
  const MenuScreen = () => (
    <div className="h-full bg-white flex flex-col">
      {/* Use Header component */}
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
          <p className="text-gray-600 italic">Get started</p>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-8">
          What would you like to do?
        </h3>

        <div className="space-y-4 w-full max-w-md">
          <button
            onClick={() => {
              // send the same inquiry message used by mobile/initial fetch and switch to chat view
              handleSend("I would like to inquire", "closed");
              setShowMenu(false);
            }}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg p-6 flex items-center gap-4 transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl">
                👤
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-700 font-bold text-lg">
                ?
              </div>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-bold">Inquire</h4>
              <p className="text-sm text-gray-300">
                {/* message */}
                <br />
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/request")}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg p-6 flex items-center gap-4 transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl">
                📄
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-bold">Request</h4>
              <p className="text-sm text-gray-300">{/* message */}</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string }>
  >([{ sender: "bot", text: "I am AlVin how may I help you!" }]);
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Inquire",
    "Request",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [sessionId] = useState(() => {
    // Generate or retrieve session ID
    if (typeof window !== "undefined") {
      let id = sessionStorage.getItem("chatSessionId");
      if (!id) {
        id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("chatSessionId", id);
      }
      return id;
    }
    return `session_${Date.now()}`;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track viewport height changes (keyboard open/close)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateHeight = () => {
      const height = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      setViewportHeight(height);
    };

    updateHeight();

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateHeight);
      return () =>
        window.visualViewport?.removeEventListener("resize", updateHeight);
    } else {
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial quick replies are set in state above

  // Handle incoming message from URL parameter (e.g., from "Other" request)
  useEffect(() => {
    const message = searchParams.get("message");
    const formCompleted = searchParams.get("formCompleted");

    if (formCompleted === "true") {
      setShowStatus(true);
    } else if (message) {
      // Hide menu and send the message
      setShowMenu(false);
      handleSend(message, "closed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSend = async (
    text: string,
    messageType: "closed" | "open" = "open"
  ) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setIsLoading(true);

    try {
      // Fetch response from backend AI
      const apiResponse = await fetch(
        `http://localhost:4000/api/sendMessage/${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        }
      );

      if (!apiResponse.ok) throw new Error("Failed to fetch response");
      const response = await apiResponse.json();

      if (!response.success) {
        // Handle error
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Sorry, there was an error processing your request.",
          },
        ]);
      } else {
        const botResponse = response.botResponse;

        // Add bot response
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: botResponse.Message },
        ]);

        // Update quick replies dynamically based on bot response
        if (botResponse.Choices) {
          const choices: string[] = [];
          // Extract choices from the Choices object
          Object.keys(botResponse.Choices).forEach((key) => {
            if (botResponse.Choices[key]) {
              choices.push(botResponse.Choices[key]);
            }
          });

          if (choices.length > 0) {
            setQuickReplies(choices);
          } else {
            setQuickReplies([]);
          }
        } else {
          setQuickReplies([]);
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm having trouble processing your message.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend(input, "open"); // Typed message = open type
    }
  };

  // Show menu on initial load for desktop only (but not if formCompleted or message param present)
  useEffect(() => {
    if (
      isDesktop &&
      !searchParams.get("message") &&
      !searchParams.get("formCompleted")
    ) {
      setShowMenu(true);
    }
  }, [isDesktop, searchParams]);

  // If desktop menu mode requested and still showing menu, show the menu screen instead of chat
  if (isDesktop && showMenu) return <MenuScreen />;

  return (
    <div
      className="flex flex-col bg-white fixed inset-0"
      style={{
        height: viewportHeight > 0 ? `${viewportHeight}px` : "100vh",
        maxHeight: viewportHeight > 0 ? `${viewportHeight}px` : "100vh",
      }}
    >
      {/* Custom Header */}
      <div className="bg-[#34495E] text-white px-6 py-4 shadow-lg flex items-center gap-4 sticky top-0 z-50">
        <button
          onClick={() => setShowMenu(true)}
          className="text-2xl hover:opacity-80 transition-opacity"
        >
          &lt;
        </button>
        <Image
          src="/ALVin.png"
          alt="ALVin Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold">ALVin</h1>
      </div>

      {/* Status Component - shown as sticky chat bubble */}
      {showStatus && <Status />}

      {/* Message Area - hide on desktop when form is completed */}
      {!(isDesktop && showStatus) && (
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Show AlVin profile picture only for the latest bot message */}
              {msg.sender === "bot" && idx === messages.length - 1 && (
                <Image
                  src="/ALVin.png"
                  alt="ALVin"
                  width={isDesktop ? 48 : 32}
                  height={isDesktop ? 48 : 32}
                  className="rounded-full flex-shrink-0"
                />
              )}
              {/* Add invisible spacer for older bot messages to maintain alignment */}
              {msg.sender === "bot" && idx !== messages.length - 1 && (
                <div
                  className={isDesktop ? "w-12" : "w-8"}
                  style={{ flexShrink: 0 }}
                />
              )}
              <div
                className={`px-4 py-2 rounded-2xl ${
                  isDesktop
                    ? "max-w-[60%] text-xl leading-relaxed"
                    : "max-w-[70%] text-sm leading-snug"
                } ${
                  msg.sender === "user"
                    ? "bg-[#34495E] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Quick Replies */}
          {(!isInputFocused || isDesktop) && (
            <div className="flex gap-2 flex-wrap mt-2">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(reply, "closed")}
                  className={`px-4 py-1.5 rounded-full ${
                    isDesktop ? "text-lg" : "text-sm"
                  } bg-white text-black border-2 border-[#34495E] hover:bg-gray-100`}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Scroll anchor - minimal spacing */}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      )}

      {/* Input Section - positioned at bottom with consistent spacing */}
      {!(isDesktop && showStatus) && (
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-white py-4 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="w-full bg-[#34495E] rounded-2xl border-t border-gray-200 flex items-center px-4 py-3">
              {/* Mic Button */}
              <button className="p-2 text-gray-600 hover:text-gray-800 text-lg">
                <Image
                  src="/Microphone.png"
                  alt="Microphone"
                  width={24}
                  height={24}
                />
              </button>

              {/* Input */}
              <input
                type="text"
                placeholder="Message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 100)}
                className="flex-1 px-4 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 mx-1 text-black"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSend(input, "open")}
                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-lg"
              >
                <Image
                  src="/Send (1).png"
                  alt="Send Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </button>
            </div>

            {/* Quick Replies and Form Button - Mobile only */}
            {!isDesktop && (
              <div className="flex gap-2 overflow-x-auto mt-2 pb-1 scrollbar-hide">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply, "closed")}
                    className="px-4 py-1.5 rounded-full text-sm bg-gray-300 text-black hover:bg-gray-200 whitespace-nowrap flex-shrink-0"
                  >
                    {reply}
                  </button>
                ))}
                <button
                  onClick={() => router.push("/form")}
                  className="px-4 py-1.5 rounded-full text-sm bg-white text-[#34495E] font-semibold hover:bg-gray-100 border-2 border-[#34495E] whitespace-nowrap flex-shrink-0"
                >
                  📋 Fill Form
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatInterface />
    </Suspense>
  );
}
