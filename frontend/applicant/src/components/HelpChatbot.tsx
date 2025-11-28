"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface HelpChatbotProps {
  onClose?: () => void;
}

export default function HelpChatbot({ onClose }: HelpChatbotProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [messages, setMessages] = useState<Message[]>([
    { sender: "user", text: "I need help with filling the form" },
    { sender: "bot", text: "What would you like to inquire about?" },
  ]);
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [sessionId] = useState(() => {
    // Generate or retrieve session ID
    if (typeof window !== "undefined") {
      let id = sessionStorage.getItem("helpChatSessionId");
      if (!id) {
        id = `help_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("helpChatSessionId", id);
      }
      return id;
    }
    return `help_${Date.now()}`;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize quick replies from the initial bot response
  useEffect(() => {
    const fetchInitialResponse = async () => {
      try {
        const apiResponse = await fetch(
          `${API_URL}/api/sendMessage/${sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: "I need help with filling the form",
            }),
          }
        );
        const response = await apiResponse.json();

        if (response.success) {
          // Update the bot's response message
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 1 && updated[1].sender === "bot") {
              updated[1].text = response.botResponse.Message;
            }
            return updated;
          });

          // Set quick replies if available
          if (response.botResponse.Choices) {
            const choices: string[] = [];
            Object.keys(response.botResponse.Choices).forEach((key) => {
              if (response.botResponse.Choices[key]) {
                choices.push(response.botResponse.Choices[key]);
              }
            });
            setQuickReplies(choices);
          }
        }
      } catch (error) {
        console.error("Error fetching initial response:", error);
      }
    };
    fetchInitialResponse();
  }, [sessionId, API_URL]);

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
        `${API_URL}/api/sendMessage/${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        }
      );

      if (!apiResponse.ok) {
        console.error(
          "API Response not OK:",
          apiResponse.status,
          apiResponse.statusText
        );
        throw new Error(
          `Server returned ${apiResponse.status}: ${apiResponse.statusText}`
        );
      }

      const response = await apiResponse.json();
      console.log("HelpChatbot API Response:", response); // Debug log

      if (!response.success) {
        // Handle error
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Sorry, something went wrong.",
          },
        ]);
      } else {
        const botResponse = response.botResponse;

        // Add bot response
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: botResponse.Message || "No response." },
        ]);

        // Update quick replies if available
        if (botResponse.Choices) {
          const choices: string[] = [];
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
      console.error("Error sending message:", error);
      console.error("API_URL being used:", API_URL); // Debug log
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Sorry, I'm having trouble connecting. ${errorMessage}`,
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

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Chat Popup Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#34495E] text-white p-4 flex justify-between items-center">
            <h2 className="font-bold text-lg">Need Help?</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors text-2xl"
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-2xl ${
                  isDesktop
                    ? "max-w-[60%] text-xl leading-relaxed"
                    : "max-w-[70%] text-sm leading-snug"
                } ${
                  msg.sender === "user"
                    ? "bg-[#34495E] text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div
                className={`px-4 py-2 rounded-2xl ${
                  isDesktop
                    ? "max-w-[60%] text-xl leading-relaxed"
                    : "max-w-[70%] text-sm leading-snug"
                } bg-gray-200 text-black`}
              >
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {quickReplies.length > 0 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(reply, "closed")}
                    className={`px-4 py-1.5 rounded-full ${
                      isDesktop ? "text-lg" : "text-sm"
                    } bg-white text-black border-2 border-[#34495E] hover:bg-gray-100`}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="w-full bg-[#34495E] rounded-2xl flex items-center px-4 py-3">
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
                className="flex-1 px-4 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 mx-1 text-black"
                disabled={isLoading}
              />

              {/* Send Button */}
              <button
                onClick={() => handleSend(input, "open")}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-lg disabled:opacity-50"
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
          </div>
        </div>
      </div>
    </>
  );
}
