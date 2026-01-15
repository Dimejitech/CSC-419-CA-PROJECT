import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
}

interface Order {
  id: string;
  timeReceived: string;
  orderId: string;
  patientName: string;
  testType: string;
  priority: 'Urgent' | 'Routine' | 'Stat';
  status: string;
  action: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock user data - replace with actual user context
  const user = {
    name: 'Peter Parker',
    role: 'Lab Technician',
    avatar: '/images/avatar.png',
  };

  // Stats data
  const stats: StatCard[] = [
    {
      title: 'Total Orders Today',
      value: 24,
      icon: '📋',
      color: '#00A8E8',
      bgColor: '#E6F7FF',
    },
    {
      title: 'Pending',
      value: 8,
      icon: '⏳',
      color: '#FFA500',
      bgColor: '#FFF4E6',
    },
    {
      title: 'In Progress',
      value: 5,
      icon: '🔄',
      color: '#9333EA',
      bgColor: '#F3E8FF',
    },
    {
      title: 'Completed',
      value: 11,
      icon: '✅',
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
  ];

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      timeReceived: '09:15 AM',
      orderId: '#LAB-2901',
      patientName: 'John Doe',
      testType: 'Complete Blood Count',
      priority: 'Urgent',
      status: 'In Progress',
      action: 'Start Test',
    },
    {
      id: '2',
      timeReceived: '09:15 AM',
      orderId: '#LAB-2901',
      patientName: 'John Doe',
      testType: 'Complete Blood Count',
      priority: 'Urgent',
      status: 'In Progress',
      action: 'Collect',
    },
  ];

  const urgentTasksCount = 12;

  const handleLogout = () => {
    // Clear tokens and redirect to signin
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/technician/signin');
  };

  return (
    <div className="tech-dashboard-container">
      {/* Header */}
      <header className="tech-header">
        <div className="tech-header-left">
          <img src="/images/citycare-logo-icon.png" alt="CityCare" className="tech-logo-icon" />
          <span className="tech-logo-text">CityCare</span>
        </div>

        <div className="tech-header-center">
          <div className="tech-search-bar">
            <span className="tech-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="tech-header-right">
          <button className="tech-notification-btn">
            <span className="tech-bell-icon">🔔</span>
            <span className="tech-notification-badge">2</span>
          </button>
          <div className="tech-user-profile">
            <img src={user.avatar} alt={user.name} className="tech-user-avatar" />
            <div className="tech-user-info">
              <span className="tech-user-name">{user.name}</span>
              <span className="tech-user-role">{user.role}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="tech-layout">
        {/* Sidebar */}
        <aside className={`tech-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button
            className="tech-sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            ☰
          </button>

          <div className="tech-sidebar-header">
            <h3 className="tech-nav-title">Navigation</h3>
          </div>

          <nav className="tech-nav">
            <div className="tech-nav-section">
              <h4 className="tech-nav-section-title">Main</h4>
              <button className="tech-nav-item active" onClick={() => navigate('/technician/dashboard')}>
                <span className="tech-nav-icon">🏠</span>
                <span className="tech-nav-label">Dashboard</span>
              </button>
              <button className="tech-nav-item" onClick={() => navigate('/technician/lab-orders')}>
                <span className="tech-nav-icon">📋</span>
                <span className="tech-nav-label">Lab Orders</span>
              </button>
              <button className="tech-nav-item" onClick={() => navigate('/technician/results')}>
                <span className="tech-nav-icon">📊</span>
                <span className="tech-nav-label">Results</span>
              </button>
            </div>

            <div className="tech-nav-section">
              <h4 className="tech-nav-section-title">Secondary</h4>
              <button className="tech-nav-item" onClick={() => navigate('/technician/profile')}>
                <span className="tech-nav-icon">👤</span>
                <span className="tech-nav-label">Profile</span>
              </button>
              <button className="tech-nav-item">
                <span className="tech-nav-icon">❓</span>
                <span className="tech-nav-label">Help / Support</span>
              </button>
            </div>
          </nav>

          <button className="tech-logout-btn" onClick={handleLogout}>
            <span className="tech-logout-icon">🚪</span>
            <span className="tech-logout-label">Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="tech-main-content">
          <div className="tech-content-header">
            <div>
              <h1 className="tech-page-title">Dashboard</h1>
              <p className="tech-page-subtitle">
                Welcome back, {user.name.split(' ')[0]}. You have{' '}
                <span className="tech-urgent-count">{urgentTasksCount} urgent tasks</span> today.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="tech-stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="tech-stat-card"
                style={{ backgroundColor: stat.bgColor }}
              >
                <div className="tech-stat-header">
                  <span className="tech-stat-title">{stat.title}</span>
                </div>
                <div className="tech-stat-content">
                  <div
                    className="tech-stat-icon"
                    style={{ backgroundColor: stat.color + '20' }}
                  >
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                  </div>
                  <span className="tech-stat-value" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Abnormal Results Alert */}
          <div className="tech-alert-banner">
            <div className="tech-alert-content">
              <div className="tech-alert-icon">⚠️</div>
              <div className="tech-alert-text">
                <h3 className="tech-alert-title">Abnormal Results Alert</h3>
                <p className="tech-alert-description">
                  There are three critical results that require immediate validation and flagging to
                  clinician staff.
                </p>
              </div>
            </div>
            <button className="tech-alert-btn" onClick={() => navigate('/technician/results')}>
              Review Alerts
            </button>
          </div>

          {/* Orders Queue */}
          <div className="tech-orders-section">
            <div className="tech-section-header">
              <h2 className="tech-section-title">Orders Queue</h2>
              <div className="tech-search-box">
                <span className="tech-search-icon-small">🔍</span>
                <input type="text" placeholder="Search" />
              </div>
            </div>

            <div className="tech-table-container">
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Time Received</th>
                    <th>Order ID</th>
                    <th>Patient Name</th>
                    <th>Test Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.timeReceived}</td>
                      <td>{order.orderId}</td>
                      <td>{order.patientName}</td>
                      <td>{order.testType}</td>
                      <td>
                        <span className="tech-priority-badge urgent">{order.priority}</span>
                      </td>
                      <td>{order.status}</td>
                      <td>
                        <button className="tech-action-btn">{order.action}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="tech-view-more-btn" onClick={() => navigate('/technician/lab-orders')}>
              View More
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
