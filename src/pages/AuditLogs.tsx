import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuditLogs.css';

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  affectedResource: string;
  actionType: 'Record Edit' | 'Failed Login' | 'Vitals Entry';
}

const AuditLogs: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('all');
  const [actionType, setActionType] = useState('all');
  const [dateRange, setDateRange] = useState('Oct 24 - Oct 31, 2025');
  const [searchQuery, setSearchQuery] = useState('');

  const allLogs: AuditLog[] = [
    {
      id: 1,
      timestamp: '2025-10-31 14:22:45',
      user: 'Dr Sarah Jenkins',
      action: 'Record Edit',
      affectedResource: 'Patient Record #PT-9921',
      actionType: 'Record Edit',
    },
    {
      id: 2,
      timestamp: '2025-10-31 14:22:45',
      user: 'Mark Thompson',
      action: 'Failed Login',
      affectedResource: 'System Gateway',
      actionType: 'Failed Login',
    },
    {
      id: 3,
      timestamp: '2025-10-31 14:22:45',
      user: 'Alice Wong',
      action: 'Vitals Entry',
      affectedResource: 'Patient Record #PT-4410',
      actionType: 'Vitals Entry',
    },
    {
      id: 4,
      timestamp: '2025-10-31 14:22:45',
      user: 'Dr Sarah Jenkins',
      action: 'Record Edit',
      affectedResource: 'Patient Record #PT-9921',
      actionType: 'Record Edit',
    },
  ];

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.affectedResource.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionType === 'all' || log.actionType === actionType;
    
    return matchesSearch && matchesAction;
  });

  const resetFilters = () => {
    setUserRole('all');
    setActionType('all');
    setDateRange('Oct 24 - Oct 31, 2025');
    setSearchQuery('');
  };

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
              <button className="nav-item" onClick={() => navigate('/dashboard')}>
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Dashboard</span>
              </button>

              <button className="nav-item" onClick={() => navigate('/user-management')}>
                <img src="/images/group.png" alt="" className="nav-icon" />
                <span>User Management</span>
              </button>
              <button className="nav-item" onClick={() => navigate('/roles-permissions')}>
                <img src="/images/user-badge-check.png" alt="" className="nav-icon" />
                <span>Roles and Permissions</span>
              </button>
              <button className="nav-item active">
                <img src="/images/clock-rotate-right.png" alt="" className="nav-icon" />
                <span>Audit Logs</span>
              </button>
            </div>

            <div className="nav-section">
              <span className="section-label">Secondary</span>
              <button className="nav-item" onClick={() => navigate('/profile')}>
                <img src="/images/profile.png" alt="" className="nav-icon" />
                <span>Profile</span>
              </button>
              <button className="nav-item">
                <img src="/images/help-circle.png" alt="" className="nav-icon" />
                <span>Help / Support</span>
              </button>
            </div>

            <button className="logout" onClick={() => navigate('/signin')}>
              <img src="/images/log-out.png" alt="" className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <div className="audit-logs-inner">
            {/* PAGE HEADER */}
            <div className="al-page-header">
              <div className="al-header-text">
                <h1>Audit Logs</h1>
                <p>Review comprehensive system activity and security logs for compliance and monitoring.</p>
              </div>
              <button className="export-logs-btn">Export Logs</button>
            </div>

            {/* FILTERS */}
            <div className="al-filters">
              <div className="filter-group">
                <label className="filter-label">User Role</label>
                <div className="filter-select-wrapper">
                  <select 
                    className="filter-select"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="admin">Admin</option>
                  </select>
                  <svg className="select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Action Type</label>
                <div className="filter-select-wrapper">
                  <select 
                    className="filter-select"
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="Record Edit">Record Edit</option>
                    <option value="Failed Login">Failed Login</option>
                    <option value="Vitals Entry">Vitals Entry</option>
                  </select>
                  <svg className="select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Date Range</label>
                <div className="filter-select-wrapper date-select">
                  <svg className="calendar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#6b7280" strokeWidth="1.5"/>
                    <path d="M2 6h12M5 1v3M11 1v3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input 
                    type="text" 
                    className="filter-select date-input"
                    value={dateRange}
                    readOnly
                  />
                  <svg className="select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <button className="reset-filters-btn" onClick={resetFilters}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 2V0M8 2L6 4M8 2l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Reset Filters
              </button>
            </div>

            {/* TABLE CONTAINER */}
            <div className="al-table-container">
              <div className="al-table-header">
                <h2>All Staff</h2>
                <div className="al-search">
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

              <div className="al-table">
                <div className="al-table-head">
                  <div className="al-th timestamp-col-head">Timestamp</div>
                  <div className="al-th user-col-head">User</div>
                  <div className="al-th action-col-head">Action Performed</div>
                  <div className="al-th resource-col-head">Affected Resource</div>
                </div>

                <div className="al-table-body">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="al-table-row">
                      <div className="al-td timestamp-col">
                        <span className="timestamp-text">{log.timestamp}</span>
                      </div>
                      <div className="al-td user-col">
                        <span className="user-text">{log.user}</span>
                      </div>
                      <div className="al-td action-col">
                        <span className={`action-badge ${log.actionType.toLowerCase().replace(' ', '-')}`}>
                          {log.action}
                        </span>
                      </div>
                      <div className="al-td resource-col">
                        <span className="resource-text">{log.affectedResource}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="al-table-footer">
                <button className="view-more-btn">View More</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLogs;