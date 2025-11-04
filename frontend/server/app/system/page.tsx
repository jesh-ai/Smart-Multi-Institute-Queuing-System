"use client";
import React, { useState, useEffect } from "react";

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface Session {
  id: number;
  counterName: string;
  sessionKey: string;
  startedAt: string;
  status: string;
  endedAt: string;
}

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState('devices');
  const [devices, setDevices] = useState<Device[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Fetch devices data from API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/templates/devices');
        if (response.ok) {
          const data = await response.json();
          setDevices(data);
        } else {
          console.log('Missing API for /api/templates/devices - using fallback data');
          setDevices([]);
        }
      } catch (error) {
        console.log('Missing API for /api/templates/devices - fetch failed:', error);
        setDevices([]);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/templates/sessions');
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        } else {
          console.log('Missing API for /api/templates/sessions - using fallback data');
          setSessions([]);
        }
      } catch (error) {
        console.log('Missing API for /api/templates/sessions - fetch failed:', error);
        setSessions([]);
      }
    };

    fetchDevices();
    fetchSessions();
  }, []);

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