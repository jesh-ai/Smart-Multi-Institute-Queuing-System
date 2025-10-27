"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";


const queueData = [
  { id: 45, name: 'John Doe', request: 'Document Renewal', counter: 'Counter Station 01', status: 'Processing' },
  { id: 46, name: 'Jane Smith', request: 'New Application', counter: 'Counter Station 02', status: 'Processing' },
  { id: 47, name: 'Robert Johnson', request: 'Document Update', counter: '-', status: 'Waiting' },
  { id: 48, name: 'Maria Garcia', request: 'Renewal', counter: '-', status: 'Waiting' },
  { id: 49, name: 'David Wilson', request: 'Update Request', counter: '-', status: 'Waiting' },
  { id: 44, name: 'Michael Brown', request: 'New Application', counter: 'Counter Station 01', status: 'Ended' },
  { id: 43, name: 'Emily Davis', request: 'Document Renewal', counter: 'Counter Station 03', status: 'Ended' },
  { id: 42, name: 'Sarah Martinez', request: 'New Application', counter: 'Counter Station 02', status: 'Ended' },
];


const QueueStatusBadge = ({ status }: { status: string }) => {
  return (
    <span className={`queue-status-badge status-${status.toLowerCase()}`}>
      {status}
    </span>
  );
};

export default function QueuePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = ['All', 'Processing', 'Waiting', 'Ended'];

  
  const filteredData = queueData.filter(item => {
    const matchesStatus = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.request.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.counter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(item.id).includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    
    <main className="system-page-container">
      <h1 className="page-title">Queue Management</h1>
      <p className="page-subtitle">
        Monitor and manage the queue system
      </p>

      {

      }
      <div className="system-content-card" style={{ marginTop: '24px' }}>
        <div className="system-card-header queue-card-header">
          <div>
            <h2 className="system-card-title">Active Queue</h2>
          </div>
          {

          }
          <div className="queue-controls">
            {/* Search Bar */}
            <div className="queue-search-wrapper">
              <Search className="queue-search-icon" size={18} />
              <input
                type="text"
                placeholder="Search queue..."
                className="queue-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Tabs */}
            <div className="tabs-container" style={{ margin: 0 }}>
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveTab(filter)}
                  className={`tab-button ${activeTab === filter ? 'active' : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {

        }
        <div className="table-wrapper">
          <table className="devices-table">
            <thead>
              <tr>
                <th>Queue No.</th>
                <th>Name</th>
                <th>Request</th>
                <th>Assigned Counter</th>
                {/* --- THIS LINE IS UPDATED --- */}
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.request}</td>
                  <td>{item.counter}</td>
                  {/* --- THIS LINE IS UPDATED --- */}
                  <td className="text-center">
                    <QueueStatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

