// src/app/components/PopUp.tsx

import React from 'react';

interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applicantName: string;
  applicantQueueNo: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  borderColor?: string;
}

const PopUp: React.FC<PopUpProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicantName,
  applicantQueueNo,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClass = `
    px-8 py-2 rounded-lg text-white font-semibold shadow-md
    bg-green-600 hover:bg-green-700
    transition-colors
  `;
  
  const cancelButtonClass = `
    px-8 py-2 rounded-lg text-white font-semibold shadow-md
    bg-red-600 hover:bg-red-700
    transition-colors
  `;

  return (
    // Full-screen overlay
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 p-4">
      
      {/* Main Card Wrapper */}
      <div 
        className={`
          w-full max-w-4xl
          rounded-xl bg-white
          shadow-3xl overflow-hidden
        `}
      >

        {/* Applicant Info */}
        <div className="p-6 shadow-md">
          <h4 className="mb-4 text-center text-sm uppercase tracking-wider text-gray-500">
            Current Applicant
          </h4>
          <div className="flex justify-between">
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-3xl font-bold text-gray-900">
                {applicantName}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-500">Queue No.</p>
              <p className="text-3xl font-semibold text-blue-600">
                {applicantQueueNo}
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation */}
        <div 
          className={`
            p-8 text-center
            rounded-b-xl
          `}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-500 text-sm mb-8">
            {message}
          </p>
          <div className="flex justify-center gap-6">
            <button onClick={onConfirm} className={confirmButtonClass}>
              {confirmText}
            </button>
            <button onClick={onClose} className={cancelButtonClass}>
              {cancelText}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default PopUp;