"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [scanned, setScanned] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full flex items-center gap-2 border-b p-4">
        <Image src="/institute.png" alt="Logo" width={25} height={25} />
        <h1 className="text-lg font-semibold text-gray-900">Institute Name</h1>
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
      {scanned && (
        <footer className="flex flex-col gap-2 border-t bg-gray-400 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Where..."
              className="flex-1 rounded-md bg-gray-300 px-3 py-2 text-sm text-black focus:outline-none"
            />
            <button className="rounded-full p-3">
              <Image src="/send.png" alt="Send" width={23} height={23} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input className="flex-1 rounded-md bg-gray-300 px-4 py-2 text-sm text-black" />
            <input className="flex-1 rounded-md bg-gray-300 px-4 py-2 text-sm text-black" />
          </div>
        </footer>
      )}
    </div>
  );
}
