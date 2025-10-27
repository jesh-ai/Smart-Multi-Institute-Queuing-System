// Settings - @FE - Jana
"use client";
import React from "react";
import { Power } from "lucide-react";

export default function SettingsPage() {
  
  const handleShutdown = () => {
    console.log("Shutdown requested");
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