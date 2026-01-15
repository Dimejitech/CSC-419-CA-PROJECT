import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard/Dashboard.css';
import './LabOrders.css';

interface Order {
  id: string;
  timeReceived: string;
  orderId: string;
  patientName: string;
  testType: string;
  priority: 'Urgent' | 'Routine' | 'Stat';
  status: string;
  date: string;
  action: string;
}

const LabOrders: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [dateRange, setDateRange] = useState('Oct 24 - Oct 25, 2025');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock user data
  const user = {
    name: 'Peter Parker',
    role: 'Lab Technician',
    avatar: '/images/avatar.png',
  };

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
      date: 'Oct 25',
      action: 'Update',
    },
    {
      id: '2',
      timeReceived: '09:15 AM',
      orderId: '#LAB-2901',
      patientName: 'John Doe',
      testType: 'Complete Blood Count',
      priority: 'Urgent',
      status: 'In Progress',
      date: 'Oct 25',
      action: 'Collect',
    },
    {
      id: '3',
      timeReceived: '09:15 AM',
      orderId: '#LAB-2901',
      patientName: 'John Doe',
      testType: 'Complete Blood Count',
      priority: 'Urgent',
      status: 'In Progress',
      date: 'Oct 25',
      action: 'Process',
    },
    {
      id: '4',
      timeReceived: '09:15 AM',
      orderId: '#LAB-2901',
      patientName: 'John Doe',
      testType: 'Complete Blood Count',
      priority: 'Urgent',
      status: 'In Progress',
      date: 'Oct 25',
      action: 'Update',
    },
    {
      id: '5',
      timeReceived: '09:15 AM',
      orderId: '#LAB-2901',
      patientName: 'John Doe',
      testType: 'Complete Blood Count',
      priority: 'Urgent',
      status: 'In Progress',
      date: 'Oct 25',
      action: 'View',
    },
    {
      id: '6',
      timeReceived: '09:15 AM',
      orderId: '#LAB-2901',
      patientName: 'John Doe',
      testType: 'Complete Blood Count',
      priority: 'Urgent',
      status: 'In Progress',
      date: 'Oct 25',
      action: 'Update',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/technician/signin');
  };

  const resetFilters = () => {
    setStatusFilter('All Statuses');
    setPriorityFilter('All Priorities');
    setDateRange('Oct 24 - Oct 25, 2025');
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
        <aside className="tech-sidebar">
          <div className="tech-sidebar-header">
            <h3 className="tech-nav-title">Navigation</h3>
          </div>

          <nav className="tech-nav">
            <div className="tech-nav-section">
              <h4 className="tech-nav-section-title">Main</h4>
              <button className="tech-nav-item" onClick={() => navigate('/technician/dashboard')}>
                <span className="tech-nav-icon">🏠</span>
                <span className="tech-nav-label">Home</span>
              </button>
              <button className="tech-nav-item active" onClick={() => navigate('/technician/lab-orders')}>
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
              <button className="tech-nav-item" >
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
              <h1 className="tech-page-title">Lab Orders</h1>
              <p className="tech-page-subtitle">
                Manage and track all incoming laboratory diagnostic requests.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="lab-filters-section">
            <div className="lab-filter-group">
              <label className="lab-filter-label">Status</label>
              <select
                className="lab-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div className="lab-filter-group">
              <label className="lab-filter-label">Priority</label>
              <select
                className="lab-filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option>All Priorities</option>
                <option>Urgent</option>
                <option>Routine</option>
                <option>Stat</option>
              </select>
            </div>

            <div className="lab-filter-group">
              <label className="lab-filter-label">Date Range</label>
              <div className="lab-date-picker">
                <span className="lab-calendar-icon">📅</span>
                <input
                  type="text"
                  className="lab-date-input"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <button className="lab-reset-btn" onClick={resetFilters}>
              🔄 Reset Filters
            </button>
          </div>

          {/* Orders Table */}
          <div className="tech-orders-section">
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
                    <th>Date</th>
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
                      <td>{order.date}</td>
                      <td>
                        <button className="tech-action-btn">{order.action}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="lab-pagination">
              <button
                className="lab-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <button
                className="lab-pagination-btn primary"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LabOrders;
