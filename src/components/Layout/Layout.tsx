import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import LogoutModal from '../Modals/LogoutModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    setShowLogoutModal(false);
    // Redirect to login page or clear user session
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="flex max-w-[1280px] mx-auto mt-7">
        <Sidebar onLogoutClick={handleLogoutClick} />
        
        <main className="flex-1">
          {children}
        </main>
      </div>

      {showLogoutModal && (
        <LogoutModal 
          onClose={handleCloseModal}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}