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
  const [showConsent, setShowConsent] = useState(true); // show consent first
  const [isChecked, setIsChecked] = useState(false);
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
    <div className="relative flex flex-col flex-1 min-h-0 bg-white">
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

      {/* Footer - Input Area */}
      <div className="sticky bottom-0 z-10 border-t bg-[#34495E] p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={showConsent} // disable input until consent given
            className="flex-1 rounded-2xl bg-gray-300 px-4 py-2 text-sm text-black placeholder:text-[#34495E] focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={showConsent}
            className="rounded-full p-3 disabled:opacity-50"
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
              disabled={showConsent}
              className="px-4 py-1.5 rounded-full text-sm bg-gray-300 text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Consent Modal */}
      {showConsent && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-lg flex flex-col
                          w-[90%] max-w-sm h-[60%] 
                          sm:w-[80%] sm:max-w-md sm:h-[65%]
                          md:w-96 md:h-[500px]">
            {/* Header */}
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-center">Data Privacy Consent</h3>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 overflow-y-auto text-xs sm:text-sm md:text-base text-gray-700 flex-1">
              <p className="mb-2">
                We value your privacy. This consent explains how we collect,
                process, and protect your personal data.
              </p>
              <p className="mb-2">
                By proceeding, you acknowledge that you have read and understood
                our privacy practices, and you consent to the collection and
                processing of your data in accordance with applicable laws.
              </p>
              <p className="mb-2">
                Your data will only be used for the purpose of this system and
                will not be shared with third parties without your permission.
              </p>
              <p className="mb-2">
                If you do not agree, you may choose to cancel and discontinue
                using this service.
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-4 h-4"
                />
                I agree to the Data Privacy Policy.
              </label>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConsent(false)} // decline just closes modal
                  className="px-4 py-2 rounded-lg border border-[#132437] text-[#132437] bg-transparent hover:bg-[#132437]/5"
                >
                  I Decline
                </button>
                <button
                  onClick={() => {
                    if (isChecked) setShowConsent(false);
                  }}
                  disabled={!isChecked}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isChecked
                      ? "bg-[#132437]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [scanned, setScanned] = useState(false);

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
      ) : (
        <ChatInterface />
      )}
    </div>
  );
}
