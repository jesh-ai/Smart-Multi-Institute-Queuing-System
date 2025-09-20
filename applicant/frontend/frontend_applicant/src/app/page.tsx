"use client";
import { useState } from "react";
import Image from "next/image";

function ChatInterface() {
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string }>
  >([
    { sender: "user", text: "I would like to inquire" },
    { sender: "bot", text: "What would you like to inquire about?" },
  ]);
  const [input, setInput] = useState("");
  const quickReplies = ["Clearance", "Other"];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thank you for your inquiry. Please choose:" },
      ]);
    }, 500);
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {/* Message Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-2xl max-w-[65%] text-sm leading-snug ${
              msg.sender === "user"
                ? "bg-[#34495E] text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Quick Replies under bot message */}
        <div className="flex gap-2 flex-wrap mt-2">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(reply)}
              className="px-4 py-1.5 rounded-full text-sm bg-white text-black border-2 border-[#34495E] hover:bg-gray-100"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Footer - Input Area (matches existing footer styles) */}
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
            onClick={() => handleSend(input)}
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
              onClick={() => handleSend(reply)}
              className="px-4 py-1.5 rounded-full text-sm bg-gray-300 text-black hover:bg-gray-200"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [scanned, setScanned] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full flex items-center gap-2 border-b-2 border-[#34495E] p-4">
        <Image src="/institute.png" alt="Logo" width={25} height={25} />
        <h1 className="text-lg font-semibold text-[#34495E]">Institute Name</h1>
      </header>

      {/* Main Content */}
      {!scanned ? (
        <main className="flex flex-col items-center justify-center flex-1 px-6">
          <h2 className="text-lg font-semibold mb-4">Scan to Begin</h2>
          <div className="border-8 border-gray-400 rounded-lg p-20 mb-2" />
          <p className="text-sm text-gray-800 mb-6">
            Scan the QR Code to connect to host server
          </p>
          <button
            className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md"
            onClick={() => setScanned(true)}
          >
            Start
          </button>
        </main>
      ) : showChat ? (
        <ChatInterface />
      ) : (
        <main className="flex flex-col items-center justify-center flex-1 px-6">
          <div className="h-20 w-20 rounded-full bg-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-black">Welcome!</h2>
          <p className="italic text-black mb-8">Let’s get started</p>

          <div className="w-full max-w-sm space-y-4">
            <div className="h-20 w-full rounded-lg bg-gray-200" />
            <div className="h-20 w-full rounded-lg bg-gray-200" />
          </div>
        </main>
      )}

      {/* Footer (only after pressing Start) */}
      {scanned && !showChat && (
        <footer className="sticky bottom-0 z-10 flex flex-col gap-2 border-t bg-[#34495E] p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Where..."
              className="flex-1 rounded-2xl bg-gray-300 px-4 py-2 text-sm text-black placeholder:text-[#34495E] focus:outline-none"
            />
            <button className="rounded-full p-3">
              <Image src="/send.png" alt="Send" width={23} height={23} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex-1 rounded-full bg-gray-300 px-4 py-1.5 text-sm text-black hover:bg-gray-200"
              onClick={() => setShowChat(true)}
            >
              I would like to inquire.
            </button>
            <button
              type="button"
              className="flex-1 rounded-full bg-gray-300 px-4 py-1.5 text-sm text-black hover:bg-gray-200"
            >
              Button
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
