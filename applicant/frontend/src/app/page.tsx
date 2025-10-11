"use client";
import { useState } from "react";
import Image from "next/image";

// Component to display a simple modal message, replacing alert()
const MessageModal = ({ message, onClose }: { message: string; onClose: () => void; }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
        <p className="text-lg text-center text-black">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md font-semibold text-white bg-gray-800 hover:bg-gray-900"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Main Chat Interface component, now self-contained
function ChatInterface() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([]);
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full flex items-center gap-2 border-b-2 border-[#34495E] p-4">
        <Image src="/institute.png" alt="Logo" width={25} height={25} />
        <h1 className="text-lg font-semibold text-[#34495E]">Institute Name</h1>
      </header>

      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        {/* Welcome Message, shown only when there are no messages */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 px-6">
            <div className="h-20 w-20 rounded-full bg-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-black">Welcome!</h2>
            <p className="italic text-black mb-8">Let’s get started</p>
            <div className="w-full max-w-sm space-y-4">
              <div className="h-20 w-full rounded-lg bg-[#17293C]" />
              <div className="h-20 w-full rounded-lg bg-[#17293C]" />
            </div>
          </div>
        )}

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
          {messages.length > 0 && (
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
          )}
        </div>

        {/* Footer - Input Area */}
        <div className="sticky bottom-0 z-10 border-t bg-[#34495E] p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-2xl bg-gray-300 px-4 py-2 text-sm text-black placeholder:text-[#34495E] focus:outline-none"
            />
            <button
              onClick={() => handleSend(input)}
              className="rounded-full p-3"
            >
              <Image src="/send.png" alt="send" width={25} height={25} />
            </button>
          </div>
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
    </div>
  );
}

// Feedback Survey
function Feedback() {
  const [experience, setExperience] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [modalMessage, setModalMessage] = useState("");
  const buttonOptions = ["Excellent", "Good", "Average", "Poor", "Fine", "Terrible"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ experience, comments });
    setModalMessage("Feedback submitted! Thank you.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white px-6 py-8">
      {/* Header */}
      <header className="w-full flex items-center gap-2 border-b-2 pb-2" style={{ borderColor: '#34495E' }}>
              <Image src="/institute.png" alt="Logo" width={25} height={25}/>
        <h1 className="text-lg font-semibold" style={{ color: '#34495E' }}>Institute Name</h1>
      </header>
      {/* Feedback Survey Box */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 p-6 rounded-lg shadow-md w-full max-w-sm"
        style={{ backgroundColor: '#AAB7B8' }}
      > 
        <h2 className="text-xl font-bold mb-4" style={{ color: '#34495E' }}>Feedback Survey</h2>
        {/* Experience Buttons */}
        <label className="block font-semibold mb-2" style={{ color: '#34495E' }}>
          How was your experience?
        </label>
        <div className="flex flex-wrap gap-2 mb-6">
          {buttonOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setExperience(option)}
              className={`flex-1 py-2 px-4 rounded-full font-semibold whitespace-nowrap transition-colors duration-200
                ${experience === option
                  ? "bg-gray-800 text-white border-2 border-gray-800"
                  : "text-gray-800"
                }`}
              style={{ backgroundColor: experience !== option ? '#F8FDFF' : undefined }}
            >
              {option}
            </button>
          ))}
        </div>
        {/* Comments Textarea */}
        <label htmlFor="comments" className="block font-semibold mb-2"style={{ color: '#34495E' }}>Comments</label>
        <textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Write your comments here..."
          rows={4}
          className="w-full p-3 rounded-lg border border-gray-500 bg-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={!experience}
            className={`py-2 px-6 rounded-md font-semibold text-white transition-opacity duration-200
              ${experience ? "bg-gray-800 hover:bg-gray-900 cursor-pointer" : "bg-gray-600 cursor-not-allowed opacity-50"}`}
          >
            Submit
          </button>
        </div>
      </form>
      <div></div>
      <MessageModal
        message={modalMessage}
        onClose={() => setModalMessage("")}
      />
    </div>
  );
}

// Main App component that handles conditional rendering
export default function App() {
  const [currentPage, setCurrentPage] = useState("scan");
  const [isAgreed, setIsAgreed] = useState(false);

  const handleDecline = () => {
    setCurrentPage("feedback");
  };

  const handleProceed = () => {
    setCurrentPage("chat");
  };

  const handleScan = () => {
    setCurrentPage("consent");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {currentPage === "scan" && (
        <main className="flex flex-col items-center justify-center flex-1 px-6">
          <h2 className="text-lg font-semibold text-black mb-4">Scan to Begin</h2>
          <div className="border-8 border-gray-400 rounded-lg p-20 mb-2" />
          <p className="text-sm text-gray-800 mb-6">
            Scan the QR Code to connect to host server
          </p>
          <button
            className="p-5 rounded-full bg-[#17293C] hover:bg-gray-700 mb-16"
            onClick={handleScan}
          >
            <Image src="/camera.png" alt="Camera" width={25} height={25} />
          </button>
          <div className="absolute bottom-6 left-6">
            <button className="p-4 rounded-full bg-[#17293C] hover:bg-gray-700">
              <Image src="/Flash Light.png" alt="Flash Light" width={25} height={25} />
            </button>
          </div>
          <div className="absolute bottom-6 right-6">
            <button className="p-4 rounded-full bg-[#17293C] hover:bg-gray-700">
              <Image src="/Rotate Camera.png" alt="Rot Camera" width={25} height={25} />
            </button>
          </div>
        </main>
      )}

      {currentPage === "consent" && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-lg flex flex-col w-[90%] max-w-sm h-[60%] sm:w-[80%] sm:max-w-md sm:h-[65%] md:w-96 md:h-[500px]">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-black text-center">Data Privacy Consent</h3>
            </div>
            <div className="p-4 overflow-y-auto text-xs sm:text-sm md:text-base text-gray-700 flex-1">
              <p className="mb-2">We value your privacy. This consent explains how we collect, process, and protect your personal data.</p>
              <p className="mb-2">By proceeding, you acknowledge that you have read and understood our privacy practices, and you consent to the collection and processing of your data in accordance with applicable laws.</p>
              <p className="mb-2">Your data will only be used for the purpose of this system and will not be shared with third parties without your permission.</p>
              <p className="mb-2">If you do not agree, you may choose to cancel and discontinue using this service.</p>
            </div>
            <div className="p-4 border-t flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="w-4 h-4"
                />
                I agree to the Data Privacy Policy.
              </label>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 rounded-lg border border-[#132437] text-[#132437] bg-transparent hover:bg-[#132437]/5"
                >
                  I Decline
                </button>
                <button
                  onClick={handleProceed}
                  disabled={!isAgreed}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isAgreed ? "bg-[#132437]" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentPage === "chat" && (
        <ChatInterface />
      )}
      
      {currentPage === "feedback" && (
        <Feedback />
      )}
    </div>
  );
}