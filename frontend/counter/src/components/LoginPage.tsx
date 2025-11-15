'use client';

import React from 'react';
import { KeyRound } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50 p-4">
      
      {/* Login Card */}
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg md:p-12">
        
        <div className="mb-6 inline-flex rounded-full bg-blue-600 p-4 text-white">
          <KeyRound size={40} />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Counter Admin Access
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          Enter your session key to access the
          <br />
          counter management system
        </p>
        
        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter session key"
            className="w-full rounded-lg border border-gray-200 bg-gray-100 p-3 text-center text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={onLogin}
            className="w-full rounded-lg bg-yellow-500 p-3 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          >
            Log-In
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;