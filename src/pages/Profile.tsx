import React, { useState } from 'react';

// Temporary image URL - will expire in 7 days
const imgAvatar = "https://www.figma.com/api/mcp/asset/fd719a6a-668f-4796-86a1-ba0014c84366";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-xs text-gray-600 mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 w-[609px]">
        {/* Header with Edit Profile Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Profile Information</h2>
          <button 
            className="bg-[#03a5ff] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
            onClick={() => setIsEditing(!isEditing)}
          >
            Edit Profile
          </button>
        </div>
        
        {/* Avatar with Edit Icon */}
        <div className="relative w-20 h-20">
          <img 
            src={imgAvatar} 
            alt="Profile" 
            className="w-20 h-20 rounded-full object-cover"
          />
          <button 
            className="absolute bottom-0 right-0 bg-[#03a5ff] p-1 rounded-full hover:bg-blue-600 transition-colors"
            onClick={() => setIsEditing(!isEditing)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.333 2L14 4.667L5 13.667H2.333V11L11.333 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}