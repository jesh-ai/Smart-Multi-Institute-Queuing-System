"use client";
import { useState } from "react";
import Image from "next/image";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DataPrivacyModal({ isChecked, setIsChecked, onProceed }: any) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow-lg flex flex-col
                    w-[90%] max-w-sm h-[60%]
                    sm:w-[80%] sm:max-w-md sm:h-[65%]
                    md:w-96 md:h-[500px]"
      >
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-center text-[#34495E]">
            Data Privacy Consent
          </h3>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto text-xs sm:text-sm md:text-base text-[#34495E] flex-1">
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
            Your data will only be used for the purpose of this system and will
            not be shared with third parties without your permission.
          </p>
          <p className="mb-2">
            If you do not agree, you may choose to cancel and discontinue using
            this service.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm text-[#34495E]">
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
              onClick={() => window.close()}
              className="px-4 py-2 rounded-lg border border-[#132437] text-[#132437] bg-transparent hover:bg-[#132437]/5"
            >
              I Decline
            </button>
            <button
              onClick={onProceed}
              disabled={!isChecked}
              className={`px-4 py-2 rounded-lg text-white ${
                isChecked
                  ? "bg-[#132437] hover:bg-[#0f1a29]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
              onClick={() => handleSend(reply)}
              className="px-4 py-1.5 rounded-full text-sm bg-white text-black border-2 border-[#34495E] hover:bg-gray-100"
            >
              {reply}
            </button>
          ))}
        </div>
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
    <button onClick={() => handleSend(input)} className="rounded-full p-3">
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
  const [consented, setConsented] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      {/* Data Privacy Modal (shown first) */}
      {!consented && (
        <DataPrivacyModal
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          onProceed={() => setConsented(true)}
        />
      )}

      {/* Header */}
      <header className="w-full flex items-center gap-2 border-b-2 border-[#34495E] p-4">
        <Image src="/institute.png" alt="Logo" width={25} height={25} />
        <h1 className="text-lg font-semibold text-[#34495E]">
          Institute Name
        </h1>
      </header>

      {/* Main Content */}
      {showChat ? (
        <ChatInterface />
      ) : (
        <main className="flex flex-col items-center justify-center flex-1 px-6">
          <div className="h-20 w-20 rounded-full bg-[#34495E] mb-4" />
          <h2 className="text-xl font-bold text-black">Welcome!</h2>
          <p className="italic text-black mb-8">Let’s get started</p>

          <div className="w-full max-w-sm space-y-4">
            <div className="h-20 w-full rounded-lg bg-[#34495E]" />
            <div className="h-20 w-full rounded-lg bg-[#34495E]" />
          </div>
        </main>
      )}

      {/* Footer */}
      {consented && !showChat && (
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
