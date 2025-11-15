"use client";
import Image from 'next/image';
import { useState } from 'react';


interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [sessionKey, setSessionKey] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  // --- MOCK AUTHENTICATION LOGIC ---
    if (sessionKey === '1234') { 
      console.log('Login successful!');
      onLoginSuccess(); 
    } else {
      setError('Invalid session key. Please try again.');
    }
  };
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F6E9] p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-sm relative">
            <Image 
              src="/admin access.png" 
              alt="Admin Access Key" 
              width={40} 
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-2">Counter Admin Access</h1>
        <p className="text-sm text-gray-500 mb-8 px-2 leading-relaxed">
          Enter your session key to access the <br/> counter management system
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="password" 
              value={sessionKey} 
              onChange={(e) => setSessionKey(e.target.value)} 
              placeholder="Enter session key" 
              required 
              className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all" 
            />
          </div>

          {error && (<p className="text-xs text-red-500 mt-2">{error}</p>)}

          <button
            type="submit"
            className="w-full bg-[#FFC847] text-gray-900 py-3 rounded-lg hover:bg-[#fdb828] transition duration-150 font-medium shadow-sm mt-2"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}