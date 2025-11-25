"use client";

import { useState } from 'react';
import Dashboard from "@/components/Dashboard";
import Applicant from "@/components/Applicant";
import LoginPage from '@/components/LoginPage';
import Header from "@/components/Header"; // Import Header here

type View = 'dashboard' | 'applicant';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleLogin = (key: string) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard'); // Reset to dashboard view on logout
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main>
      <Header
        currentView={currentView}
        onViewChange={(view: View) => setCurrentView(view)}
        onLogout={handleLogout}
      />

      {/* Conditionally render the correct component */}
      {currentView === 'dashboard' ? <Dashboard /> : <Applicant />}
    </main>
  );
}