"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import QueueChatUI from "./Status";

export default function ChatInterface({
  onShowForm,
}: {
  onShowForm: () => void;
}) {
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string }>
  >([
    { sender: "user", text: "I would like to inquire" },
    { sender: "bot", text: "What would you like to inquire about?" },
  ]);
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize quick replies from the initial response
  useEffect(() => {
    const fetchInitialResponse = async () => {
      try {
        // Try to get responses from backend template
        const response = await fetch('http://localhost:4000/api/templates/responses');
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.inquiry && responseData.inquiry.Choices) {
            const choices = Object.values(responseData.inquiry.Choices);
            setQuickReplies(choices);
          }
        } else {
          console.log('Missing API for /api/templates/responses - using fallback');
          setQuickReplies(['Passport Application Form', 'Clearance', 'Other']);
        }
      } catch (error) {
        console.log('Missing API for /api/templates/responses - fetch failed:', error);
        setQuickReplies(['Passport Application Form', 'Clearance', 'Other']);
      }
    };
    fetchInitialResponse();
  }, []);

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
      // Since AI API calls should be ignored, use template responses
      const response = await fetch('http://localhost:4000/api/templates/responses');
      let botMessage = "I'm here to help. Could you please clarify your request?";
      let choices: string[] = [];

      if (response.ok) {
        const responseData = await response.json();
        
        // Simple response logic based on keywords
        if (text.toLowerCase().includes('clearance')) {
          botMessage = responseData.clearance?.Message || botMessage;
        } else if (text.toLowerCase().includes('experience')) {
          botMessage = responseData.experience?.Message || botMessage;
          choices = Object.values(responseData.experience?.Choices || {});
        } else if (text.toLowerCase().includes('inquire')) {
          botMessage = responseData.inquiry?.Message || botMessage;
          choices = Object.values(responseData.inquiry?.Choices || {});
        } else if (text.toLowerCase().includes('assist')) {
          botMessage = responseData.assistToday?.Message || botMessage;
          choices = Object.values(responseData.assistToday?.Choices || {});
        } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
          botMessage = responseData.greetings?.Message || botMessage;
        } else if (text.toLowerCase().includes('other')) {
          botMessage = responseData.other?.Message || botMessage;
        }
      } else {
        console.log('Missing API for /api/templates/responses - using default response');
      }

      // Add bot response
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botMessage },
      ]);

      // Update quick replies
      if (choices.length > 0) {
        setQuickReplies(choices);
      } else {
        setQuickReplies([]);
      }

      // Log that we would save interaction (simulating missing API)
      console.log('Missing API for /api/save-interaction - would save:', {
        userMessage: text,
        botResponse: botMessage,
        messageType,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.log('Missing API for chat processing - fetch failed:', error);
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

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {/* Message Area */}
      {/* Add bottom padding so messages aren't covered by the fixed input area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 pb-44">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm leading-snug ${
              msg.sender === "user"
                ? "bg-[#34495E] text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Quick Replies */}
        <div className="flex gap-2 flex-wrap mt-2">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(reply, "closed")}
              className="px-4 py-1.5 rounded-full text-sm bg-white text-black border-2 border-[#34495E] hover:bg-gray-100"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - fixed to viewport bottom so it remains visible */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-[#34495E] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-2xl bg-gray-300 px-4 py-2 text-sm text-black placeholder:text-[#34495E] focus:outline-none"
            />
            <button
              onClick={() => handleSend(input, "open")}
              className="rounded-full p-3"
            >
              <Image src="/send.png" alt="Send" width={23} height={23} />
            </button>
          </div>

          {/* Quick Replies under input */}
          <div className="flex gap-2 flex-wrap mt-2">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(reply, "closed")}
                className="px-4 py-1.5 rounded-full text-sm bg-gray-300 text-black hover:bg-gray-200"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Form Filling Button */}
          <div className="mt-2">
            <button
              onClick={onShowForm}
              className="w-full py-2 rounded-full text-sm bg-white text-[#34495E] font-semibold hover:bg-gray-100 transition-all"
            >
              📋 Fill Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
