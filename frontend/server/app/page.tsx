// frontend/server/app/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/DashboardCard";
import "../styles/globals.css";
import { QrCode } from "lucide-react";

interface SessionData {
  usersInQueue: number;
  lastSession?: string;
}

interface SummaryData {
  requestsToday: number;
  avgWaitTime: number;
  totalUptime: number;
}

export default function DashboardPage() {
  const [queueData, setQueueData] = useState<SessionData>({ usersInQueue: 0, lastSession: "None" });
  const [activeUsers, setActiveUsers] = useState(0);
  const [connectedDevices, setConnectedDevices] = useState(0);
  const [activeCounters, setActiveCounters] = useState(0);
  const [summary, setSummary] = useState<SummaryData>({ requestsToday: 0, avgWaitTime: 0, totalUptime: 0 });

  const BASE_URL = "http://localhost:4000/api";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Current Queue Status
        const sessionRes = await fetch(`${BASE_URL}/server/dashboard/queue`, {
          credentials: 'include'
        });
        const sessionText = await sessionRes.text();
        const sessionData = sessionText ? JSON.parse(sessionText) : {};
        setQueueData({
          usersInQueue: sessionData.usersInQueue ?? 0,
          lastSession: sessionData.lastSession ?? "None",
        });

        // Active users
        const devicesRes = await fetch(`${BASE_URL}/server/dashboard/users`, {
          credentials: 'include'
        });
        const devicesText = await devicesRes.text();
        const devicesData = devicesText ? JSON.parse(devicesText) : 0;
        setActiveUsers(devicesData);

        // Connected devices
        const connectedRes = await fetch(`${BASE_URL}/session/all`, {
          credentials: 'include'
        });
        const connectedText = await connectedRes.text();
        const connectedData = connectedText ? JSON.parse(connectedText) : {};
        setConnectedDevices(Object.keys(connectedData).length);

        // Active counters
        const countersRes = await fetch(`${BASE_URL}/server/counters`, {
          credentials: 'include'
        });
        const countersText = await countersRes.text();
        const countersData = countersText ? JSON.parse(countersText) : [];
        setActiveCounters(
          Array.isArray(countersData)
            ? countersData.filter((c: { status: string }) => c.status?.toLowerCase() === "active").length
            : 0
        );

        // Summary Table
        const summaryRes = await fetch(`${BASE_URL}/server/dashboard/summary`, {
          credentials: 'include'
        });
        const summaryText = await summaryRes.text();
        const summaryData = summaryText ? JSON.parse(summaryText) : {};
        setSummary({
          requestsToday: summaryData.requestsToday ?? 0,
          avgWaitTime: summaryData.avgWaitTime ?? 0,
          totalUptime: summaryData.totalUptime ?? 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setQueueData({ usersInQueue: 0, lastSession: undefined });
        setActiveUsers(0);
        setConnectedDevices(0);
        setActiveCounters(0);
        setSummary({ requestsToday: 0, avgWaitTime: 0, totalUptime: 0 });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card-row">
        <DashboardCard
          title="Current Queue Status"
          subtitle="Users in Queue"
          value={`${queueData.usersInQueue} Users`}
          subtitle2="Last applicant entered"
          value2={`${queueData.lastSession ?? "None"}`}
          icon={<img src="/icons/currentQueueStatus.svg" alt="Users" className="dashboard-icon" />}
        />
        <DashboardCard
          title="Active Applicants"
          subtitle="Submitted Forms"
          value={`${activeUsers} Applicants`}
          icon={<img src="/icons/activeUsers.svg" alt="Users" className="dashboard-icon" />}
        />
        <DashboardCard
          title="Total Sessions"
          subtitle="All Active Sessions"
          value={`${connectedDevices} Sessions`}
          icon={<img src="/icons/activeUsers.svg" alt="Devices" className="dashboard-icon" />}
        />
        <DashboardCard
          title="Active Counters"
          subtitle="Currently Active"
          value={`${activeCounters} Counters`}
          icon={<img src="/icons/activeUsers.svg" alt="Counters" className="dashboard-icon" />}
        />
      </div>

      <div className="summary-bar">
        <div className="summary-item">
          <p className="summary-label">
            <img src="/icons/requestToday.svg" alt="Requests" className="inline w-4 h-4 mr-1 align-middle" />
            Requests Today
          </p>
          <p className="summary-value">{`${summary.requestsToday} Requests`}</p>
        </div>
        <div className="summary-item">
          <p className="summary-label">
            <img src="/icons/avgWaitTime.svg" alt="Requests" className="inline w-4 h-4 mr-1 align-middle" />
            Average Wait Time
          </p>
          <p className="summary-value">{`${summary.avgWaitTime} minutes`}</p>
        </div>
        <div className="summary-item">
          <p className="summary-label">
            <img src="/icons/totalUptime.svg" alt="Requests" className="inline w-4 h-4 mr-1 align-middle" />
            Total Uptime
          </p>
          <p className="summary-value">{`${summary.totalUptime} hours`}</p>
        </div>
      </div>

      {/*QR Code Placeholders */}
      <div className="dashboard-card-row" style={{ 
          marginTop: '60px', 
          marginBottom: '60px', 
          alignItems: 'flex-start',
          gap: '150px' 
        }}>
        
        {/* Placeholder 1 Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
           <h2 className="card-title" style={{ fontSize: '16px' }}></h2>
          {/* The Placeholder Box */}
          <div className="qr-placeholder">
             <QrCode className="qr-placeholder-icon" />
          </div>
        </div>

        {/* Placeholder 2 Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
           <h2 className="card-title" style={{ fontSize: '16px' }}></h2>
          {/* The Placeholder Box */}
          <div className="qr-placeholder">
             <QrCode className="qr-placeholder-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
