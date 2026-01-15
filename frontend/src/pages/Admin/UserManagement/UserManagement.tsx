import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css';

interface User {
  id: number;
  name: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastActivity: string;
}

type TabType = 'all' | 'active' | 'suspended';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allUsers: User[] = [
    {
      id: 1,
      name: 'Dr Sarah Smith',
      department: 'Surgery',
      role: 'Head of Surgery',
      status: 'Active',
      lastActivity: 'Today, 09:15 AM',
    },
    {
      id: 2,
      name: 'James Wilson',
      department: 'IT Operations',
      role: 'IT Operations',
      status: 'Active',
      lastActivity: 'Oct 23, 04:45 PM',
    },
    {
      id: 3,
      name: 'Nurse Maria Garcia',
      department: 'Emergency Care',
      role: 'Emergency Care',
      status: 'Inactive',
      lastActivity: 'Today, 07:30 AM',
    },
    {
      id: 4,
      name: 'Robert Chen',
      department: 'Cardiology',
      role: 'Cardiology',
      status: 'Suspended',
      lastActivity: 'Sep 12, 11:00AM',
    },
  ];

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'active') return matchesSearch && user.status === 'Active';
    if (activeTab === 'suspended') return matchesSearch && user.status === 'Suspended';
    return matchesSearch;
  });

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="logo">
          <img
            src="/images/citycare-logo-icon.png"
            alt="CityCare"
            className="logo-image"
          />
          <span className="logo-text logo-gradient">CityCare</span>
        </div>

        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="2" />
            <path
              d="M13.5 13.5L17 17"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input placeholder="Search..." />
        </div>

        <div className="header-right">
          <button className="notification-btn">
            <img
              src="/images/notification-bell.png"
              alt="Notifications"
              className="notification-icon"
            />
            <span className="notification-dot"></span>
          </button>

          <div className="header-profile">
            <img src="/images/justin.jpg" alt="Peter Parker" />
            <div className="profile-info">
              <strong>Peter Parker</strong>
              <span>Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-box">
            <div className="sidebar-header">
              <div className="sidebar-header-panel">
                <img
                  src="/images/sidebar-collapse.png"
                  alt=""
                  className="sidebar-collapse"
                />
                <h3 className="sidebar-title">Navigation</h3>
              </div>
            </div>

            <div className="nav-section">
              <span className="section-label">Main</span>
              <button className="nav-item" onClick={() => navigate('/admin/dashboard')}>
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Dashboard</span>
              </button>
              <button className="nav-item active">
                <img src="/images/group.png" alt="" className="nav-icon" />
                <span>User Management</span>
              </button>
              <button className="nav-item" onClick={() => navigate('/admin/roles-permissions')}>
                <img src="/images/user-badge-check.png" alt="" className="nav-icon" />
                <span>Roles and Permissions</span>
              </button>
              <button className="nav-item" onClick={() => navigate('/admin/audit-logs')}>
                <img src="/images/clock-rotate-right.png" alt="" className="nav-icon" />
                <span>Audit Logs</span>
              </button>
            </div>

            <div className="nav-section">
              <span className="section-label">Secondary</span>
              <button className="nav-item" onClick={() => navigate('/admin/profile')}>
                <img src="/images/profile.png" alt="" className="nav-icon" />
                <span>Profile</span>
              </button>
              <button className="nav-item">
                <img src="/images/help-circle.png" alt="" className="nav-icon" />
                <span>Help / Support</span>
              </button>
            </div>

            <button className="logout" onClick={() => navigate('/admin/signin')}>
              <img src="/images/log-out.png" alt="" className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <div className="user-management-inner">
            {/* PAGE HEADER */}
            <div className="um-page-header">
              <div className="um-header-text">
                <h1>User Management</h1>
                <p>Manage hospital staff accounts, roles, and system access levels.</p>
              </div>
              <button className="create-user-btn">Create New User</button>
            </div>

            {/* TABS */}
            <div className="um-tabs">
              <button
                className={`um-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Staff
              </button>
              <button
                className={`um-tab ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active
              </button>
              <button
                className={`um-tab ${activeTab === 'suspended' ? 'active' : ''}`}
                onClick={() => setActiveTab('suspended')}
              >
                Suspended
              </button>
            </div>

            {/* USER TABLE */}
            <div className="um-table-container">
              <div className="um-table-header">
                <h2>All Staff</h2>
                <div className="um-search">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="2" />
                    <path
                      d="M13.5 13.5L17 17"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="um-table">
                <div className="um-table-head">
                  <div className="um-th user-details-col">User Details</div>
                  <div className="um-th department-col">Department/Role</div>
                  <div className="um-th status-col">Status</div>
                  <div className="um-th activity-col">Time of Last Activity</div>
                </div>

                <div className="um-table-body">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className={`um-table-row ${user.status.toLowerCase()}`}>
                      <div className="um-td user-details-col">
                        <span className="user-name">{user.name}</span>
                      </div>
                      <div className="um-td department-col">
                        <span className="department-text">{user.role}</span>
                      </div>
                      <div className="um-td status-col">
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="um-td activity-col">
                        <span className="activity-text">{user.lastActivity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="um-table-footer">
                <button className="view-more-btn">View More</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;