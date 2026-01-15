import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RolesPermissions.css';

interface Role {
  id: number;
  name: string;
  description: string;
  activeUsers: number;
  lastModified: string;
}

const RolesPermission: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const roles: Role[] = [
    {
      id: 1,
      name: 'Clinician',
      description: 'Access to self and assigned patient files',
      activeUsers: 4,
      lastModified: 'Today, 09:15 AM',
    },
    {
      id: 2,
      name: 'Patient',
      description: 'Access to self files',
      activeUsers: 4,
      lastModified: 'Oct 23, 04:45 PM',
    },
    {
      id: 3,
      name: 'Lab Technician',
      description: 'Lab access',
      activeUsers: 4,
      lastModified: 'Today, 07:30 AM',
    },
    {
      id: 4,
      name: 'Administrator',
      description: 'Full system access and user management',
      activeUsers: 4,
      lastModified: 'Oct 23, 04:45 PM',
    },
  ];

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <button className="nav-item" onClick={() => navigate('/admin/user-management')}>
                <img src="/images/group.png" alt="" className="nav-icon" />
                <span>User Management</span>
              </button>
              <button className="nav-item active">
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
          <div className="roles-permission-inner">
            {/* PAGE HEADER */}
            <div className="rp-page-header">
              <div className="rp-header-text">
                <h1>Roles and Permissions</h1>
                <p>Manage hospital staff accounts, roles, and system access levels.</p>
              </div>
              <button className="create-user-btn">Create New User</button>
            </div>

            {/* STATS CARDS - MOVED TO TOP */}
            <div className="rp-stats-grid">
              <div className="rp-stat-card blue-card">
                <div className="stat-icon-wrapper">
                  <img src="/images/paste-clipboard.png" alt="Total Roles" className="stat-icon-img" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Roles</div>
                  <div className="stat-value">04</div>
                  <div className="stat-detail">209 registered users</div>
                </div>
              </div>

              <div className="rp-stat-card orange-card">
                <div className="stat-icon-wrapper">
                  <img src="/images/healthcare.png" alt="Restricted Roles" className="stat-icon-img" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Restricted Roles</div>
                  <div className="stat-value">02</div>
                  <div className="stat-detail">High level clearance needed</div>
                </div>
              </div>

              <div className="rp-stat-card purple-card">
                <div className="stat-icon-wrapper">
                  <img src="/images/walking.png" alt="Recent Changes" className="stat-icon-img" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Recent Changes</div>
                  <div className="stat-value">01</div>
                  <div className="stat-detail">Updated 2 hours ago</div>
                </div>
              </div>
            </div>

            {/* ROLES TABLE */}
            <div className="rp-table-container">
              <div className="rp-table-header">
                <h2>All Roles</h2>
                <div className="rp-search">
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

              <div className="rp-table">
                <div className="rp-table-head">
                  <div className="rp-th role-name-col">Role Name</div>
                  <div className="rp-th description-col">Description</div>
                  <div className="rp-th active-users-col">Active Users</div>
                  <div className="rp-th last-modified-col">Last Modified</div>
                  <div className="rp-th actions-col">Actions</div>
                </div>

                <div className="rp-table-body">
                  {filteredRoles.map((role) => (
                    <div key={role.id} className="rp-table-row">
                      <div className="rp-td role-name-col">
                        <span className="role-name">{role.name}</span>
                      </div>
                      <div className="rp-td description-col">
                        <span className="role-description">{role.description}</span>
                      </div>
                      <div className="rp-td active-users-col">
                        <span className="active-users-badge">0{role.activeUsers}</span>
                      </div>
                      <div className="rp-td last-modified-col">
                        <span className="last-modified-text">{role.lastModified}</span>
                      </div>
                      <div className="rp-td actions-col">
                        <button className="edit-permissions-btn">Edit Permissions</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rp-table-footer">
                <button className="view-more-btn">View More</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RolesPermission;