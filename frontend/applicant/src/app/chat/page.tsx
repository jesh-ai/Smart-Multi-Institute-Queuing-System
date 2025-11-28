"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Status from "../../components/Status";

type QueueStatus = "IN LINE" | "PROCESSING" | "CLOSED";

interface ApplicantInfo {
  queueNumber?: string;
  status?: QueueStatus;
  counter?: number;
  waitTime?: string;
  message?: string;
}

function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  
  // --- RESTORED MISSING STATES ---
  const [showMenu, setShowMenu] = useState(false); // Used in logic
  const [applicantInfo, setApplicantInfo] = useState<ApplicantInfo | null>(null); // Used for Status
  // ------------------------------

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const themeColor = "#17293C";

  const LandingScreen = () => (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <header
        className="py-4 px-6 flex items-center shadow-md"
        style={{ backgroundColor: themeColor }}
      >
        <div className="flex items-center">
          <Image
            src="/institute-1.png"
            alt="Institute Logo"
            width={50}
            height={50}
            className="w-10 h-10 mr-3 object-contain"
          />
          <span className="text-2xl font-extrabold text-white">
            DFA/PHILHEALTH
          </span>
        </div>
      </header>

      <main className="grow flex flex-col items-center justify-start pt-12 p-6">
        {/* Welcome Section */}
        <div className="flex flex-row items-center justify-center mb-10 gap-4">
          <div
            className="w-25 h-25 rounded-full flex items-center justify-center overflow-hidden drop-shadow-lg"
            style={{ backgroundColor: themeColor }}
          >
            <Image
              src="/ALVin1.png"
              alt="Welcome"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col items-start">
            <h2
              className="text-4xl font-bold leading-none"
              style={{ color: themeColor }}
            >
              Welcome!
            </h2>
            <p className="italic" style={{ color: themeColor }}>
              Let&apos;s get started
            </p>
          </div>
        </div>

        <h3
          className="text-2xl font-extrabold mb-10 text-center"
          style={{ color: themeColor }}
        >
          What would you like to do?
        </h3>

        {/* Action Buttons Column */}
        <div className="flex flex-col space-y-5 w-full max-w-[340px]">
          {/* Inquire Button */}
          <button
            onClick={() => {
              handleSend("I would like to inquire", "closed");
              setShowLanding(false);
            }}
            className="rounded-xl p-5 flex items-center shadow-sm hover:opacity-95 transition-opacity"
            style={{ backgroundColor: themeColor }}
          >
            <div className="mr-5 shrink-0">
              <Image
                src="/inquire.png"
                alt="Inquire Icon"
                width={56}
                height={56}
                className="w-14 h-14 object-contain"
              />
            </div>
            <div className="flex flex-col items-start text-white">
              <span className="text-2xl font-bold italic leading-tight">
                Inquire
              </span>
              <span className="text-sm font-medium opacity-90">
                Click here to ask AIvin
              </span>
            </div>
          </button>

          {/* Request Button */}
          <button
            onClick={() => router.push("/request")}
            className="rounded-xl p-5 flex items-center shadow-sm hover:opacity-95 transition-opacity"
            style={{ backgroundColor: themeColor }}
          >
            <div className="mr-5 shrink-0">
              <Image
                src="/request.png"
                alt="Request Icon"
                width={56}
                height={56}
                className="w-14 h-14 object-contain"
              />
            </div>
            <div className="flex flex-col items-start text-white">
              <span className="text-2xl font-bold italic leading-tight">
                Request
              </span>
              <span className="text-sm font-medium opacity-90">
                Click here to request a document
              </span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );

  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string }>
  >([{ sender: "bot", text: "I am AIVin, how may I help you!" }]);
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Inquire",
    "Request",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const formFlagToServiceId = (formFlag: string): string => {
    const mapping: Record<string, string> = {
      DFA_Passport_New: "0",
      DFA_Passport_Renewal: "1",
      PhilHealth_Registration: "2",
      PhilHealth_MDR_Update: "3",
    };
    return mapping[formFlag] || formFlag;
  };

  const checkFormFlags = async (sessionId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/messages/${sessionId}`);
      if (!response.ok) return;
      const data = await response.json();
      const messages = data.messages || [];
      for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg.botResponse?.form_flag) {
          const formFlags = msg.botResponse.form_flag;
          for (const [formId, value] of Object.entries(formFlags)) {
            if (value === 1) {
              setActiveFormId(formFlagToServiceId(formId));
              return;
            }
          }
        }
      }
      setActiveFormId(null);
    } catch (error) {
      console.error("Error checking form flags:", error);
      setActiveFormId(null);
    }
  };

  const getSessionIdFromCookie = (): string | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const connectSidCookie = cookies.find((cookie) =>
      cookie.startsWith("connect.sid=")
    );
    if (!connectSidCookie) return null;
    const cookieValue = connectSidCookie.split("=")[1];
    const decodedValue = decodeURIComponent(cookieValue);
    const match = decodedValue.match(/^s(?:%3A|:)([^.]+)\./);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const cookieSessionId = getSessionIdFromCookie();
    if (cookieSessionId) {
      setSessionId(cookieSessionId);
      checkFormFlags(cookieSessionId);
    } else {
      let id = sessionStorage.getItem("chatSessionId");
      if (!id) {
        id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("chatSessionId", id);
      }
      setSessionId(id);
      checkFormFlags(id);
    }
  }, []);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FIXED LOGIC HERE ---
  useEffect(() => {
    const message = searchParams.get("message");
    const formCompleted = searchParams.get("formCompleted");
    
    // Define urlSessionId properly
    const urlSessionId = searchParams.get("sessionId");

    if (formCompleted === "true") {
      setShowStatus(true);
      setShowLanding(false); // Ensure landing is hidden if returning from form

      if (urlSessionId) {
        fetch(`${API_URL}/api/applicant/info/${urlSessionId}`)
          .then((res) => res.json())
          .then((data) => {
            setApplicantInfo(data); // Now defined!
          })
          .catch((err) => {
            console.error("Failed to fetch applicant info:", err);
          });
      }
    } else if (message) {
      setShowMenu(false); // Now defined!
      setShowLanding(false);
      handleSend(message, "closed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSend = async (
    text: string,
    _messageType: "closed" | "open" = "open"
  ) => {
    if (!text.trim() || isLoading) return;

    if (!sessionId) {
      console.error("No session ID available");
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Please wait while we initialize your session...",
        },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setIsLoading(true);

    try {
      const apiResponse = await fetch(
        `${API_URL}/api/sendMessage/${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message: text }),
        }
      );

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(
          "API Response not OK:",
          apiResponse.status,
          apiResponse.statusText,
          errorText
        );
        throw new Error(
          `Server returned ${apiResponse.status}: ${apiResponse.statusText}`
        );
      }

      const response = await apiResponse.json();
      console.log("API Response:", response);

      if (!response.success) {
        console.error("Error response:", response);
        const errorMsg =
          response.botResponse?.Message ||
          response.error ||
          "Sorry, there was an error processing your request.";
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: errorMsg,
          },
        ]);
      } else {
        const botResponse = response.botResponse;
        const cleanMessage = botResponse.Message.replace(
          /^\[.*?\]\s*/g,
          ""
        ).trim();

        setMessages((prev) => [...prev, { sender: "bot", text: cleanMessage }]);

        if (botResponse.form_flag) {
          for (const [formId, value] of Object.entries(botResponse.form_flag)) {
            if (value === 1) {
              setActiveFormId(formFlagToServiceId(formId));
              break;
            }
          }
        }

        if (botResponse.Choices) {
          const choices: string[] = [];
          Object.keys(botResponse.Choices).forEach((key) => {
            if (botResponse.Choices[key]) {
              choices.push(botResponse.Choices[key]);
            }
          });
          setQuickReplies(choices.length > 0 ? choices : []);
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
      handleSend(input, "open");
    }
  };

  useEffect(() => {
    if (
      isDesktop &&
      !searchParams.get("message") &&
      !searchParams.get("formCompleted")
    ) {
      // logic preserved
    }
  }, [isDesktop, searchParams]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (showLanding) {
    return <LandingScreen />;
  }

  const LoadingIndicator = () => (
    <div className="flex items-end gap-2">
      <Image
        src="/ALVin3.png"
        alt="ALVin"
        width={isDesktop ? 48 : 32}
        height={isDesktop ? 48 : 32}
        className="rounded-full shrink-0"
      />
      <div
        className={`px-4 py-2 rounded-2xl bg-gray-200 ${
          isDesktop ? "max-w-[60%] text-xl" : "max-w-[70%] text-sm"
        }`}
      >
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col bg-white fixed inset-0"
      style={{
        height: viewportHeight > 0 ? `${viewportHeight}px` : "100vh",
        maxHeight: viewportHeight > 0 ? `${viewportHeight}px` : "100vh",
      }}
    >
      <div className="bg-[#17293C] text-white px-6 py-4 shadow-lg flex items-center gap-4 sticky top-0 z-50">
        <button
          onClick={() => setShowLanding(true)}
          className="hover:opacity-80 transition-opacity flex items-center justify-center"
        >
          <Image
            src="/arrow.png"
            alt="Back"
            width={16}
            height={16}
            className="object-contain w-6 h-6"
          />
        </button>
        <Image
          src="/ALVin1.png"
          alt="ALVin Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold">AIVin</h1>
      </div>

      {/* FIXED: Passing props to Status correctly */}
      {showStatus && applicantInfo && (
        <Status
          queueNumber={applicantInfo.queueNumber}
          status={applicantInfo.status}
          counter={applicantInfo.counter}
          waitTime={applicantInfo.waitTime}
          message={applicantInfo.message}
        />
      )}

      {!(isDesktop && showStatus) && (
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.sender === "bot" && idx === messages.length - 1 && (
                <Image
                  src="/ALVin2.png"
                  alt="ALVin"
                  width={isDesktop ? 48 : 32}
                  height={isDesktop ? 48 : 32}
                  className="rounded-full shrink-0"
                />
              )}
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
                    ? "bg-[#17293C] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && <LoadingIndicator />}

          {(!isInputFocused || isDesktop) && (
            <div className="flex gap-2 flex-wrap mt-2 ml-10 md:ml-14 max-w-[70%] md:max-w-[60%]">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(reply, "closed")}
                  className={`px-3 py-1 rounded-full ${
                    isDesktop ? "text-lg" : "text-sm"
                  } bg-white text-[#34495E] border border-[#34495E] hover:bg-gray-200`}
                >
                  {reply}
                </button>
              ))}
              {isDesktop && activeFormId && (
                <button
                  onClick={() => router.push(`/form?serviceId=${activeFormId}`)}
                  className="px-4 py-1.5 rounded-full text-lg bg-white text-[#34495E] font-semibold hover:bg-gray-100 border-2 border-[#34495E] whitespace-nowrap shrink-0"
                >
                  📋 Fill Form
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      )}

      {!(isDesktop && showStatus) && (
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-white py-4 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="w-full bg-[#34495E] rounded-2xl border-t border-gray-200 flex items-center px-4 py-3">
              <button className="p-2 text-gray-600 hover:text-gray-800 text-lg">
                <Image
                  src="/Microphone.png"
                  alt="Microphone"
                  width={24}
                  height={24}
                />
              </button>

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

            {!isDesktop && (
              <div className="flex gap-2 overflow-x-auto mt-2 pb-1 scrollbar-hide">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply, "closed")}
                    className="px-4 py-1.5 rounded-full text-sm bg-gray-300 text-black hover:bg-gray-200 whitespace-nowrap shrink-0"
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