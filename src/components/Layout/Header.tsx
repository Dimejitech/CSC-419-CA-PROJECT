import React from 'react';

// Temporary image URLs - replace with your assets
const imgVector1 = "https://www.figma.com/api/mcp/asset/4cc035a5-5e9b-4f65-a477-4be54ad75cad";
const imgFigrIconSearch = "https://www.figma.com/api/mcp/asset/1722424e-6eb5-4daf-a717-67884e1726e3";
const imgAvatar = "https://www.figma.com/api/mcp/asset/bb105714-b1d5-43ce-8f14-7a4319efaaac";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-[1280px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <img src={imgVector1} alt="CityCare Logo" className="w-full h-full" />
          </div>
          <span className="text-lg font-semibold text-[#03a5ff]">CityCare</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <img 
              src={imgFigrIconSearch} 
              alt="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-6">
          {/* Notification Icon */}
          <div className="relative cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.44V9.77" stroke="#4a4a4a" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
              <path d="M12.02 2C8.34 2 5.36 4.98 5.36 8.66V10.76C5.36 11.44 5.08 12.46 4.73 13.04L3.46 15.16C2.68 16.47 3.22 17.93 4.66 18.41C9.44 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z" stroke="#4a4a4a" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
              <path d="M15.33 18.82C15.33 20.65 13.84 22.14 12.01 22.14C11.09 22.14 10.25 21.77 9.65 21.17C9.05 20.57 8.68 19.73 8.68 18.82" stroke="#4a4a4a" strokeWidth="1.5" strokeMiterlimit="10"/>
              <circle cx="18" cy="6" r="3" fill="#fb3748"/>
            </svg>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <img src={imgAvatar} alt="User" className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-sm font-semibold text-gray-800">John Doe</p>
              <p className="text-xs bg-gradient-to-r from-[#03a5ff] to-[#1fc16b] bg-clip-text text-transparent">
                Patient
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}