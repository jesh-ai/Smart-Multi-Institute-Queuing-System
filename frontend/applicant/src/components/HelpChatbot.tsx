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
  
  // Initialize Session ID
  const [sessionId] = useState(() => {
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

  // Detect desktop view
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial bot fetch
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
            credentials: "include",
            body: JSON.stringify({
              message: "I need help with filling the form",
            }),
          }
        );
        const response = await apiResponse.json();

        if (response.success) {
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 1 && updated[1].sender === "bot") {
              updated[1].text = response.botResponse.Message;
            }
            return updated;
          });

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

      if (!apiResponse.ok) throw new Error(`Server error: ${apiResponse.status}`);

      const response = await apiResponse.json();

      if (!response.success) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, something went wrong." },
        ]);
      } else {
        const botResponse = response.botResponse;

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: botResponse.Message || "No response." },
        ]);

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
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I'm having trouble connecting." },
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
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

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
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* --- CHAT HEAD (Only for Bot) --- */}
                {msg.sender === "bot" && (
                  <div className="shrink-0 w-10 h-10 mt-1">
                    <Image
                      src="/ALVin1.png"
                      alt="Alvin"
                      width={40}
                      height={40}
                      className="rounded-full border border-gray-300 bg-white object-contain"
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                    isDesktop ? "text-lg leading-relaxed" : "text-sm leading-snug"
                  } ${
                    msg.sender === "user"
                      ? "bg-[#34495E] text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                 {/* Loading Chat Head */}
                 <div className="shrink-0 w-10 h-10 mt-1">
                    <Image
                      src="/ALVin1.png"
                      alt="Alvin"
                      width={40}
                      height={40}
                      className="rounded-full border border-gray-300 bg-white object-contain"
                    />
                  </div>
                  <div className="bg-gray-200 text-black px-4 py-3 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
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
              <input
                type="text"
                placeholder="Message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 mx-1 text-black"
                disabled={isLoading}
              />
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