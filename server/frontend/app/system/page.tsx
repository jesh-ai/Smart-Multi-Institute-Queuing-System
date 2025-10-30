"use client";
import React, { useState } from "react";

//mock data for Connected Devices
const devices = [
  { id: 1, name: 'Counter Station 01', type: 'Counter', status: 'Online' },
  { id: 2, name: 'Counter Station 02', type: 'Counter', status: 'Online' },
  { id: 3, name: 'Counter Station 03', type: 'Counter', status: 'Idle' },
  { id: 4, name: 'Applicant Device - iPhone 14', type: 'Applicant', status: 'Online' },
  { id: 5, name: 'Applicant Device - Samsung Galaxy', type: 'Applicant', status: 'Online' },
  { id: 6, name: 'Applicant Device - iPad Pro', type: 'Applicant', status: 'Idle' },
  { id: 7, name: 'Counter Station 04', type: 'Counter', status: 'Idle' },
];

//mock data for Counter Sessions
const sessions = [
  { id: 1, counterName: 'Counter Station 01', sessionKey: 'CS-2025-001-A4F9', startedAt: 'Oct 24, 2025 08:30 AM', status: 'Online', endedAt: '-' },
  { id: 2, counterName: 'Counter Station 02', sessionKey: 'CS-2025-002-B7E2', startedAt: 'Oct 24, 2025 08:35 AM', status: 'Online', endedAt: '-' },
  { id: 3, counterName: 'Counter Station 03', sessionKey: 'CS-2025-003-C9D1', startedAt: 'Oct 24, 2025 09:00 AM', status: 'Online', endedAt: '-' },
  { id: 4, counterName: 'Counter Station 04', sessionKey: 'CS-2025-004-D2F8', startedAt: 'Oct 24, 2025 07:45 AM', status: 'Ended', endedAt: 'Oct 24, 2025 12:00 PM' },
  { id: 5, counterName: 'Counter Station 01', sessionKey: 'CS-2025-005-E6H3', startedAt: 'Oct 23, 2025 02:15 PM', status: 'Ended', endedAt: 'Oct 23, 2025 06:30 PM' },
  { id: 6, counterName: 'Counter Station 02', sessionKey: 'CS-2025-006-F1J7', startedAt: 'Oct 23, 2025 09:00 AM', status: 'Ended', endedAt: 'Oct 23, 2025 05:00 PM' },
];

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState('devices');

  return (
    <main className="system-page-container">
      <h1 className="page-title">System Management</h1>
      <p className="page-subtitle">
        Manage connected devices and counter sessions
      </p>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('devices')}
          className={`tab-button ${activeTab === 'devices' ? 'active' : ''}`}
        >
          Connected Devices
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`tab-button ${activeTab === 'sessions' ? 'active' : ''}`}
        >
          Counter Session Management
        </button>
      </div>

      {activeTab === 'devices' ? (
        
        // --- CONNECTED DEVICES ---//
        <div className="system-content-card">
          <div className="system-card-header">
            <h2 className="system-card-title">Connected Devices</h2>
            <p className="system-card-subtitle">
              View and manage all connected devices
            </p>
          </div>
          <div className="table-wrapper">
            <table className="devices-table">
              <thead>
                <tr>
                  <th>Device Name</th>
                  <th className="text-center">Type</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id}>
                    <td>
                      <div className="device-name-wrapper">
                        <img
                          src={device.type === 'Counter' ? "/icons/counter.svg" : "/icons/applicant device.svg"}
                          alt={device.type === 'Counter' ? "Counter Icon" : "Applicant Icon"}
                          className="device-icon"
                        />
                        <span>{device.name}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span
                        className={`type-badge type-${device.type.toLowerCase()}`}
                      >
                        {device.type}
                      </span>
                    </td>
                    <td className="text-center">
                      <div
                        className={`status-indicator status-${device.status.toLowerCase()}`}
                      >
                        <span className="status-dot"></span>
                        {device.status}
                      </div>
                    </td>
                    <td className="text-center">
                      <a href="#" className="action-disconnect">
                        Disconnect
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // --- COUNTER SESSION ---//
        <div className="system-content-card">
          <div className="system-card-header">
            <h2 className="system-card-title">Counter Session Management</h2>
            <p className="system-card-subtitle">
              Monitor and manage counter sessions
            </p>
          </div>
          <div className="table-wrapper">
            <table className="devices-table">
              <thead>
                <tr>
                  <th>Counter Name</th>
                  <th>Session Key</th>
                  <th>Started At</th>
                  <th>Status</th>
                  <th>Ended At</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.counterName}</td>
                    <td>
                      <div className="session-key-wrapper">
                        <img 
                          src="/icons/session key.svg" 
                          alt="Session Key" 
                          className="session-key-icon" 
                        />
                        <span>{session.sessionKey}</span>
                      </div>
                    </td>
                    <td>{session.startedAt}</td>
                    <td>
                      <div
                        className={`status-indicator status-${session.status.toLowerCase()}`}
                      >
                        <span className="status-dot"></span>
                        {session.status}
                      </div>
                    </td>
                    <td>{session.endedAt}</td>
                    <td className="text-center">
                      {session.status === 'Online' ? (
                        <a href="#" className="action-end-session">
                          End Session
                        </a>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} 
    </main>
  );
}