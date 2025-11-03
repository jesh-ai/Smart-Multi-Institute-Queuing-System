// Settings - @FE - Jana
"use client";
import React from "react";
import { Power } from "lucide-react";

export default function SettingsPage() {
  
  const handleShutdown = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/shutdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log("Server shutdown initiated successfully");
        alert("Server shutdown initiated. The page will become unavailable shortly.");
      } else {
        console.log('Missing API for /api/shutdown - shutdown button clicked');
        alert("Shutdown API not available");
      }
    } catch (error) {
      console.log('Missing API for /api/shutdown - fetch failed:', error);
      alert("Failed to contact shutdown API");
    }
  };

  return (
    <main className="system-page-container">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">
        System configuration and controls
      </p>

      {

      }
      <div className="system-content-card" style={{ marginTop: '24px' }}>
        <div className="system-card-header">
          <h2 className="settings-section-title">Server Controls</h2>
          <button 
            className="settings-danger-button"
            onClick={handleShutdown}
          >
            <Power size={18} />
            <span>Shut Down Server</span>
          </button>
        </div>
      </div>
    </main>
  );
}