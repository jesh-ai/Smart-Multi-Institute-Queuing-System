"use client";
import React, { useEffect, useState } from "react";

interface DashboardViewProps {
    onLogout: () => void;
}

interface QueueStatus {
    inProgress: string;
    nextInLine: string;
    inQueue: string;
}

interface Applicant {
    name: string;
    queue: string;
    request: string;
}

interface CounterStatus {
    status: string;
    queue: string;
}

interface DashboardData {
    queueStatus: QueueStatus;
    applicant: Applicant;
    counterStatus: CounterStatus;
}

export default function Dashboard({ onLogout }: DashboardViewProps) {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const darkCardBg = 'bg-[#34495E]';

    // Fetch dashboard data from API
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/templates/counter-dashboard');
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                } else {
                    console.log('Missing API for /api/templates/counter-dashboard - using fallback data');
                    // Fallback data
                    setDashboardData({
                        queueStatus: { inProgress: '0311', nextInLine: '0312', inQueue: '0200' },
                        applicant: { name: 'Juana Del Rosario', queue: '0311', request: 'Marriage Certificate' },
                        counterStatus: { status: 'BUSY', queue: '0311' }
                    });
                }
            } catch (error) {
                console.log('Missing API for /api/templates/counter-dashboard - fetch failed:', error);
                // Fallback data
                setDashboardData({
                    queueStatus: { inProgress: '0311', nextInLine: '0312', inQueue: '0200' },
                    applicant: { name: 'Juana Del Rosario', queue: '0311', request: 'Marriage Certificate' },
                    counterStatus: { status: 'BUSY', queue: '0311' }
                });
            }
        };

        fetchDashboardData();
    }, []);

    const handleProcess = () => {
        console.log('Missing API for process action');
    };

    const handleMissing = () => {
        console.log('Missing API for missing action');
    };

    const handleClosed = () => {
        console.log('Missing API for closed action');
    };

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            
            {/* 1. Left Sidebar Navigation */}
            <aside className="w-64 bg-[#34495E] shadow-lg p-4 flex flex-col pt-24 items-center">
                <div className="h-54 w-54 bg-gray-200 rounded-lg mb-32"></div> 
                
                {/* Navigation Links Group - Centered Buttons */}
                <div className="w-full flex flex-col items-center space-y-4 mb-6">
                    <button className="py-3 px-8 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 transition duration-150 w-5/6">
                        Dashboard
                    </button>
                    <button className="py-3 px-8 rounded-lg bg-[#859295] text-white font-medium transition duration-150 w-5/6">
                        Applicant
                    </button>
                </div>

                {/* Log Out button pushed to the very bottom */}
                <button 
                    onClick={onLogout} // Call the prop function to switch view
                    className="w-5/6 text-center py-3 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition duration-150 mt-auto mx-auto"
                >
                    Log Out
                </button>
            </aside>

            {/* 2. Main Content Area */}
            <main className="flex-1 p-8 space-y-6">
                
                {/* Top Search Bar (Mock) */}
                <div className="flex justify-end">
                    <input
                        type="search"
                        placeholder="Q"
                        className="w-80 h-10 px-4 rounded-lg border border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
                    />
                </div>

                {/* Queue Status Cards */}
                <h2 className="text-lg font-bold text-gray-700">Queue Status:</h2>
                <div className="grid grid-cols-3 gap-6">
                    
                    {/* In Progress Card (Dark Blue) */}
                    <div className={`p-6 rounded-lg ${darkCardBg} shadow-xl text-white`}>
                        <p className="text-sm opacity-80">In Progress:</p>
                        <p className="text-5xl font-extrabold mt-1">{dashboardData.queueStatus.inProgress}</p>
                    </div>

                    {/* Next in Line Card (Gray) */}
                    <div className="p-6 rounded-lg bg-gray-500 shadow-xl text-white">
                        <p className="text-sm opacity-80">Next in Line:</p>
                        <p className="text-5xl font-extrabold mt-1">{dashboardData.queueStatus.nextInLine}</p>
                    </div>

                    {/* In Queue Card (Light Gray) */}
                    <div className="p-6 rounded-lg bg-gray-400 shadow-xl text-white">
                        <p className="text-sm opacity-80">In Queue:</p>
                        <p className="text-5xl font-extrabold mt-1">{dashboardData.queueStatus.inQueue}</p>
                    </div>
                </div>

                {/* Applicant Info Block */}
                <h2 className="text-lg font-bold text-gray-700 pt-4">Applicant Details:</h2>
                <div className={`p-6 rounded-lg ${darkCardBg} shadow-xl text-white`}>
                    <h3 className="text-lg font-bold mb-3">Applicant Info:</h3>
                    <div className="space-y-2 text-sm">
                        <p>Name: <span className="font-semibold">{dashboardData.applicant.name}</span></p>
                        <p>Queue: <span className="font-semibold">{dashboardData.applicant.queue}</span></p>
                        <p>Request: <span className="font-semibold">{dashboardData.applicant.request}</span></p>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-6 justify-center pt-2">
                    <button 
                        onClick={handleProcess}
                        className="py-3 px-8 text-white font-bold rounded-full bg-green-600 hover:bg-green-700 transition duration-150 shadow-md">
                        Process
                    </button>
                    <button 
                        onClick={handleMissing}
                        className={`py-3 px-8 text-white font-bold rounded-full ${darkCardBg} hover:bg-gray-700 transition duration-150 shadow-md`}>
                        Missing
                    </button>
                    <button 
                        onClick={handleClosed}
                        className="py-3 px-8 text-white font-bold rounded-full bg-red-600 hover:bg-red-700 transition duration-150 shadow-md">
                        Closed
                    </button>
                </div>

                {/* Counter Current Status */}
                <div className="mt-8 pt-4">
                    <h2 className="text-lg font-bold text-gray-700">Counter Current Status:</h2>
                    <div className="mt-2 p-4 rounded-lg bg-gray-200 border border-gray-300">
                        <p className="text-sm font-bold text-gray-700">
                            Status : <span className={`font-bold ${dashboardData.counterStatus.status === 'BUSY' ? 'text-red-500' : 'text-green-500'}`}>{dashboardData.counterStatus.status}</span>
                        </p>
                        <p className="text-sm font-bold text-green-600">Queue : <span className="font-bold text-green-600">{dashboardData.counterStatus.queue}</span></p>
                    </div>
                </div>
            </main>
        </div>
    );
}