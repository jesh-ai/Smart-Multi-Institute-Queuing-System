"use client";

import { useState } from 'react';
import Dashboard from "@/components/Dashboard";
import LoginPage from '@/components/LoginPage';
import Header from "@/components/Header"; // Import Header here

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main>
      {!isLoggedIn ? (
        //Not Logged In
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        //Logged In
        <>
          <Header />
          <Dashboard />
        </>
      )}
    </main>
  );
}