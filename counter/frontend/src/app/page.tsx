"use client";

import {useState} from 'react';
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import LoginPage from "@/components/LoginPage"; 
import Dashboard from "@/components/Dashboard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    // Conditional Rendering Logic
    if (isLoggedIn) {
        return <Dashboard onLogout={handleLogout} />;
    } else {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
}