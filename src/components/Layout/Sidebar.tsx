import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogoutClick?: () => void;
}

export default function Sidebar({ onLogoutClick }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-80 bg-white border border-gray-200 rounded-lg h-fit mr-6">
      {/* Navigation Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7H21" stroke="#4a4a4a" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3 12H21" stroke="#4a4a4a" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3 17H21" stroke="#4a4a4a" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-lg font-semibold bg-gradient-to-r from-[#03a5ff] to-[#1fc16b] bg-clip-text text-transparent">
            Navigation
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-7">
        {/* Main Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Main</h3>
          <ul className="space-y-2">
            {/* Home */}
            <li>
              <Link
                to="/"
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer ${
                  isActive('/') 
                    ? 'bg-[#57bdff] text-white shadow-md' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 7.5L10 2.5L17.5 7.5V16.25C17.5 16.5815 17.3683 16.8995 17.1339 17.1339C16.8995 17.3683 16.5815 17.5 16.25 17.5H3.75C3.41848 17.5 3.10054 17.3683 2.86612 17.1339C2.6317 16.8995 2.5 16.5815 2.5 16.25V7.5Z" stroke={isActive('/') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 17.5V10H12.5V17.5" stroke={isActive('/') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Home</span>
              </Link>
            </li>

            {/* Appointments */}
            <li>
              <Link
                to="/appointments"
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer ${
                  isActive('/appointments') 
                    ? 'bg-[#57bdff] text-white shadow-md' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3.33334" y="4.16666" width="13.3333" height="13.3333" rx="2" stroke={isActive('/appointments') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.3333 2.5V5.83333" stroke={isActive('/appointments') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.66666 2.5V5.83333" stroke={isActive('/appointments') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.33334 9.16666H16.6667" stroke={isActive('/appointments') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Appointments</span>
              </Link>
            </li>

            {/* Medical Records */}
            <li>
              <Link
                to="/medical-records"
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer ${
                  isActive('/medical-records') 
                    ? 'bg-[#57bdff] text-white shadow-md' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 1.66666H5C4.55797 1.66666 4.13405 1.84225 3.82149 2.15481C3.50893 2.46737 3.33334 2.89129 3.33334 3.33332V16.6667C3.33334 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66666L12.5 1.66666Z" stroke={isActive('/medical-records') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.5 1.66666V6.66666H16.6667" stroke={isActive('/medical-records') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Medical Records</span>
              </Link>
            </li>

            {/* Prescriptions */}
            <li>
              <Link
                to="/prescriptions"
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer ${
                  isActive('/prescriptions') 
                    ? 'bg-[#57bdff] text-white shadow-md' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.6667 1.66666H5C4.55797 1.66666 4.13405 1.84225 3.82149 2.15481C3.50893 2.46737 3.33334 2.89129 3.33334 3.33332V16.6667C3.33334 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66666L11.6667 1.66666Z" stroke={isActive('/prescriptions') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.6667 1.66666V6.66666H16.6667" stroke={isActive('/prescriptions') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.3333 10.8333H6.66666" stroke={isActive('/prescriptions') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.3333 14.1667H6.66666" stroke={isActive('/prescriptions') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.33334 7.5H7.5H6.66666" stroke={isActive('/prescriptions') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Prescriptions</span>
              </Link>
            </li>

            {/* Lab Results */}
            <li>
              <Link
                to="/lab-results"
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer ${
                  isActive('/lab-results') 
                    ? 'bg-[#57bdff] text-white shadow-md' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 1.66666H5C4.55797 1.66666 4.13405 1.84225 3.82149 2.15481C3.50893 2.46737 3.33334 2.89129 3.33334 3.33332V16.6667C3.33334 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66666L12.5 1.66666Z" stroke={isActive('/lab-results') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.5 1.66666V6.66666H16.6667" stroke={isActive('/lab-results') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 10.8333H6.66666" stroke={isActive('/lab-results') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14.1667H6.66666" stroke={isActive('/lab-results') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Lab Results</span>
              </Link>
            </li>

            {/* Billing */}
            <li>
              <Link
                to="/billing"
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer ${
                  isActive('/billing') 
                    ? 'bg-[#57bdff] text-white shadow-md' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.66666" y="4.16666" width="16.6667" height="11.6667" rx="2" stroke={isActive('/billing') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.66666 8.33334H18.3333" stroke={isActive('/billing') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Billing</span>
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Secondary Section */}
        <div className="mb-32">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Secondary</h3>
          <ul className="space-y-2">
            {/* Profile */}
            <li>
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer ${
                  isActive('/profile') 
                    ? 'bg-[#57bdff] text-white shadow-md' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66668C5.78262 12.5 4.93478 12.8512 4.30965 13.4763C3.68453 14.1014 3.33334 14.9493 3.33334 15.8333V17.5" stroke={isActive('/profile') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15906 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15906 9.16667 10 9.16667Z" stroke={isActive('/profile') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Profile</span>
              </Link>
            </li>

            {/* Help */}
            <li>
              <Link
                to="/help"
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer ${
                  isActive('/help') 
                    ? 'bg-[#57bdff] text-white shadow-md' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8.33333" stroke={isActive('/help') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.57501 7.49999C7.77093 6.94304 8.15767 6.47341 8.66658 6.17426C9.17549 5.8751 9.77403 5.76577 10.3559 5.86558C10.9378 5.96539 11.4656 6.26792 11.8458 6.71959C12.2261 7.17126 12.4342 7.74292 12.4333 8.33332C12.4333 9.99999 9.93334 10.8333 9.93334 10.8333" stroke={isActive('/help') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14.1667H10.0083" stroke={isActive('/help') ? 'white' : '#4a4a4a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Help / Support</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout */}
        <div 
          onClick={onLogoutClick}
          className="flex items-center gap-2 text-sm text-red-500 cursor-pointer hover:text-red-600"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="#fb3748" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.3333 14.1667L17.5 10L13.3333 5.83334" stroke="#fb3748" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.5 10H7.5" stroke="#fb3748" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Logout</span>
        </div>
      </nav>
    </aside>
  );
}