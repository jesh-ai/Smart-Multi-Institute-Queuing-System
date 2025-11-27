// Queue Management - @FE - Jana
"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface QueueItem {
  id: number;
  name: string;
  request: string;
  counter: string;
  status: string;
}

export default function QueuePage() {
  const [queueData, setQueueData] = useState<QueueItem[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = ['All', 'Processing', 'Waiting', 'Ended'];

  // Fetch queue data from API
  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/queue/all', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setQueueData(Array.isArray(data) ? data : []);
        } else {
          setQueueData([]);
        }
      } catch (error) {
        setQueueData([]);
      }
    };

    fetchQueueData();
    
    // Refresh every 5 seconds
    const interval = setInterval(fetchQueueData, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const filteredData = queueData.filter(item => {
    const matchesStatus = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.request.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.counter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(item.id).includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const QueueStatusBadge = ({ status }: { status: string }) => {
    return (
      <span className={`queue-status-badge status-${status.toLowerCase()}`}>
        {status}
      </span>
    );
  };

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

