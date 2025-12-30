import React from 'react';

interface LogoutModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ onClose, onConfirm }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#03a5ff] mb-4 text-center">
          Logout of your account?
        </h2>
        
        <p className="text-gray-600 text-center mb-8">
          You'll be signed out of your account and will need to log in again to access your health information.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#fb3748] text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Log out
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Stay logged in
          </button>
        </div>
      </div>
    </div>
  );
}