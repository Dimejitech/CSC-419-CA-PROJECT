import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import { Header, Sidebar } from '../../components';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.layout}>
      <Header onMenuClick={toggleSidebar} />
      <div className={styles.main}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={closeSidebar} />
        )}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
