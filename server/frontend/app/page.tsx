// Dashboard - @FE - Jerome 

"use client";
import React from "react";
import DashboardCard from "@/components/DashboardCard";
import "../styles/globals.css";


export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      {/* Top row of cards */}
      <div className="dashboard-card-row">
        <DashboardCard
          title="Current Queue Status"
          subtitle="Users in Queue"
          value="23 Users"

          subtitle2="Next in Line"
          value2="Queue No. 46"

          icon={<img src="/icons/currentQueueStatus.svg" alt="Users" className="dashboard-icon" />}
        />

        <DashboardCard
          title="Active Users"
          subtitle="Currently Active"
          value="127 Users"
          icon={<img src="/icons/activeUsers.svg" alt="Users" className="dashboard-icon" />}
        />

        <DashboardCard
          title="Connected Devices"
          subtitle="Currently Active"
          value="80 Devices"
          icon={<img src="/icons/activeUsers.svg" alt="Devices" className="dashboard-icon" />}
        />

        <DashboardCard
          title="Active Counters"
          subtitle="Currently Active"
          value="4 Counters"
          icon={<img src="/icons/activeUsers.svg" alt="Counters" className="dashboard-icon" />}
        />
      </div>

      {/* Bottom summary bar */}
      <div className="summary-bar">
        <div className="summary-item">
          <p className="summary-label">
            <img src="/icons/requestToday.svg" alt="Requests" className="inline w-4 h-4 mr-1 align-middle" />
            Requests Today
          </p>
          <p className="summary-value">342 Requests</p>
        </div>
        <div className="summary-item">
          <p className="summary-label">
            <img src="/icons/avgWaitTime.svg" alt="Requests" className="inline w-4 h-4 mr-1 align-middle" />
            Average Wait Time
          </p>
          <p className="summary-value">12 minutes</p>
        </div>
        <div className="summary-item">
          <p className="summary-label">
            <img src="/icons/totalUptime.svg" alt="Requests" className="inline w-4 h-4 mr-1 align-middle" />
            Total Uptime
          </p>
          <p className="summary-value">156.5 hours</p>
        </div>
      </div>
    </div>
  );
}

