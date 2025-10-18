"use client";

interface DashboardViewProps {
    onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardViewProps) {
    // --- MOCK DATA ---
    const queueStatus = { inProgress: '0311', nextInLine: '0312', inQueue: '0200', };
    const applicant = { name: 'Juana Del Rosario', queue: '0311', request: 'Marriage Certificate', };
    const counterStatus = { status: 'BUSY', queue: '0311', };
    const darkCardBg = 'bg-[#34495E]';

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
                        <p className="text-5xl font-extrabold mt-1">{queueStatus.inProgress}</p>
                    </div>

                    {/* Next in Line Card (Gray) */}
                    <div className="p-6 rounded-lg bg-gray-500 shadow-xl text-white">
                        <p className="text-sm opacity-80">Next in Line:</p>
                        <p className="text-5xl font-extrabold mt-1">{queueStatus.nextInLine}</p>
                    </div>

                    {/* In Queue Card (Light Gray) */}
                    <div className="p-6 rounded-lg bg-gray-400 shadow-xl text-white">
                        <p className="text-sm opacity-80">In Queue:</p>
                        <p className="text-5xl font-extrabold mt-1">{queueStatus.inQueue}</p>
                    </div>
                </div>

                {/* Applicant Info Block */}
                <h2 className="text-lg font-bold text-gray-700 pt-4">Applicant Details:</h2>
                <div className={`p-6 rounded-lg ${darkCardBg} shadow-xl text-white`}>
                    <h3 className="text-lg font-bold mb-3">Applicant Info:</h3>
                    <div className="space-y-2 text-sm">
                        <p>Name: <span className="font-semibold">{applicant.name}</span></p>
                        <p>Queue: <span className="font-semibold">{applicant.queue}</span></p>
                        <p>Request: <span className="font-semibold">{applicant.request}</span></p>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-6 justify-center pt-2">
                    <button className="py-3 px-8 text-white font-bold rounded-full bg-green-600 hover:bg-green-700 transition duration-150 shadow-md">
                        Process
                    </button>
                    <button className={`py-3 px-8 text-white font-bold rounded-full ${darkCardBg} hover:bg-gray-700 transition duration-150 shadow-md`}>
                        Missing
                    </button>
                    <button className="py-3 px-8 text-white font-bold rounded-full bg-red-600 hover:bg-red-700 transition duration-150 shadow-md">
                        Closed
                    </button>
                </div>

                {/* Counter Current Status */}
                <div className="mt-8 pt-4">
                    <h2 className="text-lg font-bold text-gray-700">Counter Current Status:</h2>
                    <div className="mt-2 p-4 rounded-lg bg-gray-200 border border-gray-300">
                        <p className="text-sm font-bold text-gray-700">
                            Status : <span className={`font-bold ${counterStatus.status === 'BUSY' ? 'text-red-500' : 'text-green-500'}`}>{counterStatus.status}</span>
                        </p>
                        <p className="text-sm font-bold text-green-600">Queue : <span className="font-bold text-green-600">{counterStatus.queue}</span></p>
                    </div>
                </div>
            </main>
        </div>
    );
}