'use client';

import React, { useState } from 'react';
import { 
  FaCheck, 
  FaExclamationTriangle, 
  FaTimes, 
  FaClock, 
  FaUserFriends, 
  FaUsers 
} from 'react-icons/fa';
import PopUp from '@/components/PopUp';

const Applicant = () => {
  const inProgress = 'A001';
  const nextInLine = 'A002';
  const inQueue = 4;
  const currentApplicant = {
    name: 'John Smith',
    queueNo: 'A001',
    request: 'Document Request',
  };

  const [isProcessPopUpOpen, setIsProcessPopUpOpen] = useState(false);
  const [isMissingPopUpOpen, setIsMissingPopUpOpen] = useState(false);
  const [isClosePopUpOpen, setIsClosePopUpOpen] = useState(false);
  
  // runs when click "Yes, Process"
  const handleProcessConfirm = () => {
    console.log('Processing applicant:', currentApplicant.name);
    setIsProcessPopUpOpen(false);
  };

  const handleMissingConfirm = () => {
    console.log('Marking as missing:', currentApplicant.name);
    setIsMissingPopUpOpen(false);
  };

  const handleCloseConfirm = () => {
    console.log('Closing request for:', currentApplicant.name);
    setIsClosePopUpOpen(false);
  };

  return (
    // Main container with the light cream/yellow background
    <div className="bg-amber-50 p-6 md:p-10 min-h-screen">
      
      {/* Top Row: 3 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Card 1: In Progress */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaClock className="text-gray-400 text-3xl" />
          <div>
            <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
            <p className="text-4xl font-semibold text-blue-600">{inProgress}</p>
          </div>
        </div>
        
        {/* Card 2: Next in Line */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaUserFriends className="text-gray-400 text-3xl" />
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Next in Line</h3>
            <p className="text-4xl font-semibold text-green-600">{nextInLine}</p>
          </div>
        </div>
        
        {/* Card 3: In Queue */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaUsers className="text-gray-400 text-3xl" />
          <div>
            <h3 className="text-gray-500 text-sm font-medium">In Queue</h3>
            <p className="text-4xl font-semibold text-gray-800">{inQueue}</p>
          </div>
        </div>
      </div>

      {/* Current Applicant Details */}
      <div className="bg-white p-10 rounded-lg shadow-md text-center mb-6">
        <h2 className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-4">
          Current Applicant
        </h2>
        
        <p className="text-5xl font-bold text-gray-900 mb-10">
          {currentApplicant.name}
        </p>

        {/* Applicant sub-details */}
        <div className="flex flex-col md:flex-row justify-center md:justify-around items-center gap-8">
          <div className="text-center">
            <h4 className="text-gray-500 text-sm font-medium mb-1">Queue No.</h4>
            <p className="text-3xl font-semibold text-blue-600">
              {currentApplicant.queueNo}
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-gray-500 text-sm font-medium mb-1">Request</h4>
            <p className="text-3xl font-semibold text-gray-800">
              {currentApplicant.request}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        
        <button onClick={() => setIsProcessPopUpOpen(true)}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-7 py-3 rounded-lg font-medium shadow-sm hover:bg-white hover:text-green-500 hover:border-1 hover:border-green-600 transition-colors">
          <FaCheck />
          <span>Process</span>
        </button>
        
        <button onClick={() => setIsMissingPopUpOpen(true)} 
                className="flex items-center justify-center gap-2 bg-orange-500 text-white px-7 py-3 rounded-lg font-medium shadow-sm hover:bg-white hover:text-orange-500 hover:border-1 hover:border-orange-500 transition-colors">
          <FaExclamationTriangle />
          <span>Missing</span>
        </button>

        <button onClick={() => setIsClosePopUpOpen(true)}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-7 py-3 rounded-lg font-medium shadow-sm hover:bg-white hover:text-red-700 hover:border-1 hover:border-red-700 transition-colors">
          <FaTimes />
          <span>Close</span>
        </button>
      </div>

        <PopUp
        isOpen={isProcessPopUpOpen}
        onClose={() => setIsProcessPopUpOpen(false)}
        onConfirm={handleProcessConfirm}
        applicantName={currentApplicant.name}
        applicantQueueNo={currentApplicant.queueNo}
        title="Start Processing?"
        message={`"You are about to mark this applicant as currently being processed."`}
        confirmText="Confirm"
        cancelText="Cancel"
        borderColor="border-green-500"
        />

        <PopUp
        isOpen={isMissingPopUpOpen}
        onClose={() => setIsMissingPopUpOpen(false)}
        onConfirm={handleMissingConfirm}
        applicantName={currentApplicant.name}
        applicantQueueNo={currentApplicant.queueNo}
        title="Mark Applicant as Missing?"
        message={`"This applicant did not respond. Do you want to mark ${currentApplicant.queueNo} as missing?"`}
        confirmText="Confirm"
        cancelText="Cancel"
        borderColor="border-orange-500"
        />

        <PopUp
        isOpen={isClosePopUpOpen}
        onClose={() => setIsClosePopUpOpen(false)}
        onConfirm={handleCloseConfirm}
        applicantName={currentApplicant.name}
        applicantQueueNo={currentApplicant.queueNo}
        title="Close Request?"
        message={`"This will close the request of ${currentApplicant.queueNo}. This action cannot be undone."`}
        confirmText="Confirm"
        cancelText="Cancel"
        borderColor="border-red-600" // <-- Red border
      />
    </div>
  );
};

export default Applicant;