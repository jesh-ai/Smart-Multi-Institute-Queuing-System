"use client";
import Image from "next/image";
import { useState } from "react";

export default function MessagingInterface() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { sender: "user", text: "Other" }, // "Other" now appears first (on top)
    { sender: "bot", text: "What would you like to inquire about?" },
  ]);

  // Function to handle sending messages
  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user's message
    setChat((prev) => [...prev, { sender: "user", text }]);
    setMessage("");

    // Simulate bot reply
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: `You selected: ${text}` },
      ]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="w-full border-b-10 border-[#34495E] bg-gray-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="/Insitute.png"
            alt="Institute Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-xl font-semibold text-gray-800">
            Institute Name
          </h1>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 w-full px-6 py-8 overflow-y-auto bg-white">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg shadow-sm max-w-xs ${
                msg.sender === "user"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="w-250 bg-[#34495E] m-auto mb-10 rounded-2xl border-t border-gray-200 flex items-center px-4 py-3">
        {/* Mic Button */}
        <button className="p-2 text-gray-600 hover:text-gray-800 text-lg">
           <img src="/Microphone.png" alt="Microphone" className="w-6 h-6" />
        </button>

        {/* Input */}
        <input

          type="text"
          placeholder="Message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(message)}
          className="flex-1 px-4 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 mx-1 text-black"
        />

        {/* Send Button */}
        <button
          onClick={() => sendMessage(message)}
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
    </div>
  );
}
