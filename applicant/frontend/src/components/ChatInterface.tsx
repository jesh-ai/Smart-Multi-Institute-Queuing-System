import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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

  // Initialize quick replies from the initial bot response
  useEffect(() => {
    const fetchInitialResponse = async () => {
      try {
        const apiResponse = await fetch(
          `/api/get-response?message=${encodeURIComponent(
            "I would like to inquire"
          )}`
        );
        const response = await apiResponse.json();
        if (response.choices && response.choices.length > 0) {
          setQuickReplies(response.choices);
        }
      } catch (error) {
        console.error("Error fetching initial response:", error);
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
      // Fetch response from API
      const apiResponse = await fetch(
        `/api/get-response?message=${encodeURIComponent(text)}`
      );

      if (!apiResponse.ok) {
        throw new Error("Failed to fetch response");
      }

      const response = await apiResponse.json();

      if (response.error) {
        // Handle error
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Sorry, there was an error processing your request.",
          },
        ]);
      } else {
        // Add bot response
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response.message },
        ]);

        // Update quick replies dynamically based on bot response
        if (response.choices && response.choices.length > 0) {
          // Show quick replies if bot has choices available
          setQuickReplies(response.choices);
        } else {
          // Clear quick replies if no choices in response
          setQuickReplies([]);
        }

        // Save interaction to JSON file via POST request
        try {
          await fetch("/api/save-interaction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userMessage: text,
              botResponse: {
                Message: response.message,
                Choices: response.choices.reduce(
                  (
                    acc: Record<string, string>,
                    choice: string,
                    idx: number
                  ) => {
                    acc[`Choice${idx + 1}`] = choice;
                    return acc;
                  },
                  {}
                ),
                Errors: response.error,
              },
              messageType,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (saveError) {
          console.error("Error saving interaction:", saveError);
          // Don't disrupt user experience if save fails
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

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
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

      {/* Input Area */}
      <div className="sticky bottom-0 z-10 border-t bg-[#34495E] p-4">
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
  );
}
