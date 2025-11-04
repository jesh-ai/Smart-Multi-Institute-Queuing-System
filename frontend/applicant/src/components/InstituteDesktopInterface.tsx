"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";

export default function InstituteDesktopInterface() {
  const [screen, setScreen] = useState<"start" | "consent" | "menu">("start");

  const StartScreen = () => (
    <div className="min-h-screen bg-[#243344] flex items-center justify-center p-8">
      <div
        className="bg-[#e7edf4] border-[16px] border-[#3d5063] w-full max-w-6xl aspect-[16/9] flex flex-col items-center justify-center cursor-pointer shadow-xl"
        onClick={() => setScreen("consent")}
      >
        <div className="mb-8">
          <Image
            src="/Insitute.png"
            alt="Institute Logo"
            width={192}
            height={192}
          />
        </div>
        <p className="text-4xl font-semibold text-gray-700 italic">
          Press anywhere to start
        </p>
      </div>
    </div>
  );

  const ConsentScreen = () => (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="bg-gray-400 rounded-lg p-12 w-full max-w-md relative shadow-lg">
          <div className="absolute top-0 right-0 w-2 h-full bg-gray-600 rounded-r-lg"></div>

          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Data Privacy <br /> Consent
          </h2>

          <div className="space-y-4 mb-16">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="h-px bg-gray-500 flex-1"></div>
            </div>
          </div>

          <button
            onClick={() => setScreen("menu")}
            className="bg-gray-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Accept
          </button>
        </div>
      </main>
    </div>
  );

  const MenuScreen = () => (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
          <p className="text-gray-600 italic">Get started</p>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-8">
          What would you like to do?
        </h3>

        <div className="space-y-4 w-full max-w-md">
          {/* Inquire Button */}
          <button className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg p-6 flex items-center gap-4 transition-colors">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl">
                👤
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-700 font-bold text-lg">
                ?
              </div>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-bold">Inquire</h4>
              <p className="text-sm text-gray-300">
                Ask about lorem <br /> ipsum...
              </p>
            </div>
          </button>

          {/* Request Button */}
          <button className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg p-6 flex items-center gap-4 transition-colors">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl">
                📄
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-bold">Request</h4>
              <p className="text-sm text-gray-300">
                Request a document <br /> lorem ipsum...
              </p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <div>
      {screen === "start" && <StartScreen />}
      {screen === "consent" && <ConsentScreen />}
      {screen === "menu" && <MenuScreen />}
    </div>
  );
}
