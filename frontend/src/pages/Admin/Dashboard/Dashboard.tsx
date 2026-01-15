import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  icon: string; // ✅ now stores image path
  bgColor: string;
  changeColor: string;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
}

interface VerificationItem {
  id: number;
  name: string;
  department: string;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // ✅ UPDATED: emojis -> image icons
  const stats: StatCard[] = [
    {
      title: 'Total Users',
      value: '2,840',
      change: '+2.4%',
      icon: '/images/paste-clipboard.png',
      bgColor: '#dbeafe',
      changeColor: '#10b981',
    },
    {
      title: 'Active Clinicians',
      value: '452',
      change: '+1.2%',
      icon: '/images/healthcare.png',
      bgColor: '#fed7aa',
      changeColor: '#10b981',
    },
    {
      title: 'Active Patients',
      value: '1,920',
      change: '+4.8%',
      icon: '/images/walking.png',
      bgColor: '#e9d5ff',
      changeColor: '#10b981',
    },
    {
      title: 'Pending Verifications',
      value: '11',
      change: '!',
      icon: '/images/warning-square.png',
      bgColor: '#fee2e2',
      changeColor: '#ef4444',
    },
  ];

  const activities: Activity[] = [
    {
      id: 1,
      title: 'Role Updated: Nurse for Sarah Smith',
      description: 'Admin John Doe modified system permissions and access levels',
      time: '2 MINS AGO',
    },
    {
      id: 2,
      title: 'New Clinician Registration: Dr. House',
      description: 'Awaiting credentials verification from HR department',
      time: '1 HOUR AGO',
    },
    {
      id: 3,
      title: 'System Backup Completed',
      description: 'Weekly scheduled database snapshot successfully pushed to cloud storage',
      time: '3 HOURS AGO',
    },
  ];

  const verificationQueue: VerificationItem[] = [
    { id: 1, name: 'Dr. Aris Thorne', department: 'Cardiology Dept.', color: '#0ea5e9' },
    { id: 2, name: 'Nurse Sam Millier', department: 'Cardiology Dept.', color: '#10b981' },
  ];

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
              <button className="nav-item active">
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

            <button className="logout" onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              sessionStorage.clear();
              navigate('/admin/signin');
            }}>
              <img src="/images/log-out.png" alt="" className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          <div className="dashboard-inner">
            <div className="page-header">
              <h1>Dashboard</h1>
              <p>
                Welcome back, Peter. You have <span className="highlight">12 urgent tasks</span> today.
              </p>
            </div>

                        {/* STATS GRID - BACK AT TOP */}
            {/* STATS GRID */}
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div key={i} className="stat-card">

                  {/* TOP ROW */}
                  <div className="stat-header">
                    <small>{s.title}</small>
                    <span
                      className="stat-change"
                      style={{ color: s.changeColor }}
                    >
                      {s.change}
                    </span>
                  </div>

                  {/* BOTTOM ROW */}
                  <div className="stat-body">
                    <div
                      className="stat-icon"
                      style={{ background: s.bgColor }}
                    >
                      <img
                        src={s.icon}
                        alt={s.title}
                        className="stat-icon-img"
                      />
                    </div>

                    <h2>{s.value}</h2>
                  </div>

                </div>
              ))}
            </div>


            {/* CONTENT GRID - Activity and Verification BELOW */}
            <div className="content-grid">
              <section className="activity-section">
                <div className="section-header">
                  <h2>Recent System Activity</h2>
                  <a href="#" className="view-all-link">
                    View All Audit Logs
                  </a>
                </div>

                <div className="activity-list">
                  {activities.map((a) => (
                <div key={a.id} className="activity-item">
                  <div className="activity-content">
                    <strong>{a.title}</strong>
                    <p>{a.description}</p>
                  </div>
                  <span className="activity-time">{a.time}</span>
                </div>

                  ))}
                                {/* Empty row */}
                <div className="activity-spacer" />
                </div>
              </section>

              <section className="verification-section">
                <h2>Verification Queue</h2>

                <div className="verification-list">
                  {verificationQueue.map((v) => (
                    <div key={v.id} className="verify-row">
                      <div className="verify-info">
                        <span className="avatar" style={{ background: v.color }}>
                          {v.name.charAt(0)}
                        </span>
                        <div>
                          <strong>{v.name}</strong>
                          <small>{v.department}</small>
                        </div>
                      </div>
                      <button className="verify-btn">Verify</button>
                    </div>
                  ))}
                </div>

                <button className="primary-btn">View Full Queue</button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;