"use client";

import { useState } from 'react';
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import Applicant from "@/components/Applicant";
import LoginPage from '@/components/LoginPage';

type View = 'dashboard' | 'applicant';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentView, setCurrentView] = useState<View>('dashboard');

const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main>
      <Header
        currentView = {currentView}
        onViewChange = {(view: View) => setCurrentView(view)}
      />

      {/* Conditionally render the correct component */}
      {currentView === 'dashboard' ? <Dashboard /> : <Applicant />}
    </main>
  );
}