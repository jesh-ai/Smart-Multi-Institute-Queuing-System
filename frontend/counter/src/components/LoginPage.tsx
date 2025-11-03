"use client";

import Image from "next/image";
import { useState } from 'react';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const inputClass = "w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- MOCK AUTHENTICATION LOGIC ---
    if (staffId === 'C001' && password === '1234') {
      console.log('Login successful!');
      onLoginSuccess(); // Call the prop function to switch the view in page.tsx
    } else {
      setError('Invalid Staff ID or Password. Please try again.');
    }
  };
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        
        <div className="flex flex-col items-center mb-6">
          <Image src="/next.svg" alt="Counter Logo" width={50} height={50} className="mb-3" />
          <h1 className="text-2xl font-bold text-[#34495E]">Counter Staff Login</h1>
          <p className="text-sm text-gray-500">Enter your credentials to manage queues</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
            <input type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="e.g., C001" required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required className={inputClass} />
          </div>
          
          {error && (<p className="text-sm text-red-600 font-medium text-center">{error}</p>)}

          <button
            type="submit"
            className="w-full bg-[#34495E] text-white py-2 rounded-md hover:bg-[#2e4054] transition duration-150 font-semibold"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}