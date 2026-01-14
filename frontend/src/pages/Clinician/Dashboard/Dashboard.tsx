import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { useAuth } from '../../../context';
import { schedulingAPI, labAPI, notificationAPI } from '../../../services/api';
import cityCareLogoColored from '../../../assets/cityCarelogoColored.png';

interface Booking {
  id: string;
  patientId: string;
  startTime: string;
  endTime: string;
  status: string;
  reasonForVisit?: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface LabResult {
  id: string;
  testName?: string;
  test_type?: string;
  resultValue?: string;
  status?: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  testItem?: {
    testName: string;
    labOrder?: {
      encounter?: {
        chart?: {
          patient?: {
            first_name: string;
            last_name: string;
          };
        };
      };
    };
  };
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  reference_id?: string;
  reference_type?: string;
}

// Calendar icon component
const CalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="24" height="22" rx="3" fill="url(#calGrad)" fillOpacity="0.15"/>
    <rect x="4" y="6" width="24" height="22" rx="3" stroke="url(#calGrad)" strokeWidth="2"/>
    <path d="M4 12H28" stroke="url(#calGrad)" strokeWidth="2"/>
    <path d="M10 4V8" stroke="url(#calGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 4V8" stroke="url(#calGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 18L15 23L12 20" stroke="url(#calGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="calGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#03A5FF"/>
        <stop offset="1" stopColor="#1FC16B"/>
      </linearGradient>
    </defs>
  </svg>
);

// Schedule icon (calendar) - white on blue background
const ScheduleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#fff" strokeWidth="2"/>
    <path d="M3 9H21" stroke="#fff" strokeWidth="2"/>
    <path d="M8 2V6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 2V6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Patients icon (clipboard) - white on green background
const PatientsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="#fff" strokeWidth="2"/>
    <path d="M9 3V5C9 5.55228 9.44772 6 10 6H14C14.5523 6 15 5.55228 15 5V3" stroke="#fff" strokeWidth="2"/>
    <path d="M9 11H15" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 15H13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Lab icon (person/user) - white on orange background
const LabOrderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2"/>
    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Bell icon for empty notifications
const EmptyBellIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState('Home');
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Fetch clinician's schedule for next 7 days
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const [scheduleData, labData, notificationsData] = await Promise.all([
        schedulingAPI.getClinicianSchedule(user.id, startDate, endDate).catch(() => []),
        labAPI.getUnverifiedResults().catch(() => []),
        notificationAPI.getNotifications(10).catch(() => ({ notifications: [], unreadCount: 0 })),
      ]);

      console.log('[ClinicianDashboard] Fetched schedule:', scheduleData);
      setAppointments(scheduleData || []);
      setLabResults(labData || []);
      setNotifications(notificationsData?.notifications || []);
      setUnreadCount(notificationsData?.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch data on mount and when navigating to this page
  useEffect(() => {
    fetchData();
  }, [fetchData, location.key]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatNotificationTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
  };

  const upcomingAppointment = appointments.find(a =>
    a.patient && new Date(a.startTime) > new Date() && a.status !== 'Cancelled'
  );

  // Sample payment data (can be replaced with real API data)
  const payments = [
    { id: '1', patientName: 'Anna Lee', status: 'Stable', lastVisit: 'Jan 12, 2024' },
    { id: '2', patientName: 'Anna Lee', status: 'Stable', lastVisit: 'Jan 12, 2024' },
  ];

  const handleNavigation = (item: string) => {
    setActiveNavItem(item);
    const routes: { [key: string]: string } = {
      Home: '/clinician/dashboard',
      Appointments: '/clinician/appointments',
      Patients: '/clinician/patients',
      Labs: '/clinician/labs',
      Profile: '/clinician/profile',
    };
    if (routes[item]) navigate(routes[item]);
  };

  return (
    <div className="dashboard-page">
      {/* Top bar */}
      <header className="dashboard-topbar">
        <div className="dashboard-brand">
          <img src={cityCareLogoColored} alt="CityCare" width="32" height="32" />
          <span className="dashboard-brandName">CityCare</span>
        </div>

        <div className="dashboard-search">
          <span className="dashboard-searchIcon">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm6.2-1.1 4.3 4.3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input className="dashboard-searchInput" placeholder="Search..." />
        </div>

        <div className="dashboard-topRight">
          <button className="dashboard-iconBtn" type="button" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>

          <div className="dashboard-user">
            <div className="dashboard-avatar">
              <img
                className="dashboard-avatarImg"
                src="/images/justin.jpg"
                alt={`${user?.first_name} ${user?.last_name}`}
              />
            </div>
            <div className="dashboard-userMeta">
              <div className="dashboard-userName">{user?.first_name} {user?.last_name}</div>
              <div className="dashboard-userRole">Clinician</div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebarBox">
            <div className="dashboard-navHeader">
              <div className="dashboard-navHeaderPanel">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span className="dashboard-navHeaderTitle">Navigation</span>
              </div>
            </div>

            <div className="dashboard-sectionTitle">Main</div>

            <nav className="dashboard-nav">
              <button
                className={`dashboard-navItem ${activeNavItem === 'Home' ? 'dashboard-navItem--active' : ''}`}
                onClick={() => handleNavigation('Home')}
                type="button"
              >
                <span className="dashboard-navItemIcon">
                  <img className="dashboard-navImg" src="/images/home.png" alt="" />
                </span>
                Home
              </button>

              <button
                className={`dashboard-navItem ${activeNavItem === 'Appointments' ? 'dashboard-navItem--active' : ''}`}
                onClick={() => handleNavigation('Appointments')}
                type="button"
              >
                <span className="dashboard-navItemIcon">
                  <img className="dashboard-navImg" src="/images/appointments.png" alt="" />
                </span>
                Appointments
              </button>

              <button
                className={`dashboard-navItem ${activeNavItem === 'Patients' ? 'dashboard-navItem--active' : ''}`}
                onClick={() => handleNavigation('Patients')}
                type="button"
              >
                <span className="dashboard-navItemIcon">
                  <img className="dashboard-navImg" src="/images/patients.png" alt="" />
                </span>
                Patients
              </button>

              <button
                className={`dashboard-navItem ${activeNavItem === 'Labs' ? 'dashboard-navItem--active' : ''}`}
                onClick={() => handleNavigation('Labs')}
                type="button"
              >
                <span className="dashboard-navItemIcon">
                  <img className="dashboard-navImg" src="/images/labs.png" alt="" />
                </span>
                Labs
              </button>
            </nav>

            <div className="dashboard-sectionTitle dashboard-mt24">Secondary</div>

            <nav className="dashboard-nav">
              <button
                className={`dashboard-navItem ${activeNavItem === 'Profile' ? 'dashboard-navItem--active' : ''}`}
                onClick={() => handleNavigation('Profile')}
                type="button"
              >
                <span className="dashboard-navItemIcon">
                  <img className="dashboard-navImg" src="/images/profile.png" alt="" />
                </span>
                Profile
              </button>

              <button className="dashboard-navItem" type="button">
                <span className="dashboard-navItemIcon">
                  <img className="dashboard-navImg" src="/images/help-circle.png" alt="" />
                </span>
                Help / Support
              </button>
            </nav>

            <button className="dashboard-logout" type="button" onClick={() => { logout(); navigate('/clinician/signin'); }}>
              <span className="dashboard-logoutIcon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              Logout
            </button>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="dashboard-content">
          <div className="dashboard-content-wrapper">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Home</h1>
              <p className="dashboard-subtitle">Welcome, {user?.first_name || 'Doctor'} 👋</p>
            </div>

            <div className="dashboard-grid">
              {/* Left Column */}
              <div className="dashboard-left">
                {/* Upcoming Appointment */}
                <section className="dashboard-card upcoming-appointment">
                  <div className="card-header">
                    <CalendarIcon />
                    <h2 className="card-title-gradient">Upcoming Appointment</h2>
                  </div>
                  {loading ? (
                    <div className="appointment-details">
                      <p className="loading-text">Loading...</p>
                    </div>
                  ) : upcomingAppointment ? (
                    <>
                      <div className="appointment-details">
                        <div className="appointment-info">
                          <div className="appointment-datetime">
                            <span className="appointment-date">{formatDate(upcomingAppointment.startTime)}</span>
                            <span className="appointment-separator"> | </span>
                            <span className="appointment-time">{formatTime(upcomingAppointment.startTime)}</span>
                          </div>
                          <div className="appointment-patient">
                            {upcomingAppointment.patient?.first_name} {upcomingAppointment.patient?.last_name}
                          </div>
                          <div className="appointment-department">
                            {upcomingAppointment.reasonForVisit || 'Cardiology Department'}
                          </div>
                        </div>
                      </div>
                      <div className="appointment-actions">
                        <button className="btn-primary" onClick={() => navigate('/clinician/appointments')}>View Details</button>
                        <button className="btn-outline" onClick={() => navigate('/clinician/appointments')}>Reschedule</button>
                      </div>
                    </>
                  ) : (
                    <div className="appointment-details">
                      <p className="empty-text">No upcoming appointments</p>
                    </div>
                  )}
                </section>

                {/* Quick Actions */}
                <section className="quick-actions">
                  <div className="action-card">
                    <div className="action-icon action-icon-blue">
                      <ScheduleIcon />
                    </div>
                    <h3 className="action-title">Schedule Appointment</h3>
                    <p className="action-description">Schedule a visit with your patient.</p>
                    <button className="btn-primary-full" onClick={() => navigate('/clinician/appointments')}>Schedule Now</button>
                  </div>

                  <div className="action-card">
                    <div className="action-icon action-icon-teal">
                      <PatientsIcon />
                    </div>
                    <h3 className="action-title">View Patients</h3>
                    <p className="action-description">See an overview of all your patients.</p>
                    <button className="btn-outline-full" onClick={() => navigate('/clinician/patients')}>See Now</button>
                  </div>

                  <div className="action-card">
                    <div className="action-icon action-icon-orange">
                      <LabOrderIcon />
                    </div>
                    <h3 className="action-title">Order Lab</h3>
                    <p className="action-description">Request a result or report from the lab.</p>
                    <button className="btn-outline-full" onClick={() => navigate('/clinician/labs')}>Send Order</button>
                  </div>
                </section>

                {/* Payment History */}
                <section className="dashboard-card payment-history">
                  <h2 className="card-title-plain">Payment History</h2>

                  {!showAllPayments ? (
                    <>
                      <table className="payment-table">
                        <thead>
                          <tr>
                            <th>Patient Name</th>
                            <th>Status</th>
                            <th>Last Visit</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment.id}>
                              <td>{payment.patientName}</td>
                              <td>
                                <span className="status-badge status-stable">
                                  {payment.status}
                                </span>
                              </td>
                              <td>{payment.lastVisit}</td>
                              <td>
                                <a href="#" className="action-link" onClick={(e) => { e.preventDefault(); navigate('/clinician/patients'); }}>
                                  Review Report
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <button className="view-all-link" onClick={() => setShowAllPayments(true)}>
                        View All Payments &gt;&gt;
                      </button>
                    </>
                  ) : (
                    <button className="view-all-link" onClick={() => setShowAllPayments(false)}>
                      ← Back
                    </button>
                  )}
                </section>
              </div>

              {/* Right Column */}
              <div className="dashboard-right">
                {/* Notifications */}
                <section className="dashboard-card notifications-card">
                  <div className="notifications-header-row">
                    <h2 className="card-title-gradient">
                      Notifications
                      {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                    </h2>
                    {notifications.length > 0 && unreadCount > 0 && (
                      <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="empty-state">
                      <EmptyBellIcon />
                      <p className="empty-text">You have no notifications</p>
                    </div>
                  ) : (
                    <div className="notifications-list">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                          onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                        >
                          <div className="notification-content">
                            <p className="notification-title">{notification.title}</p>
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-time">
                              {formatNotificationTime(notification.created_at)}
                            </span>
                          </div>
                          {!notification.is_read && <span className="unread-dot" />}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Recent Lab Results */}
                <section className="dashboard-card lab-results-card">
                  <h2 className="card-title-gradient">Recent Lab Results</h2>

                  {labResults.length > 0 ? (
                    labResults.slice(0, 2).map((result, index) => (
                      <div key={result.id || index} className="lab-result-item">
                        <h3 className="lab-result-name">{result.testItem?.testName || result.testName || 'Lab Test'}</h3>
                        <p className="lab-result-patient">
                          Patient: {result.testItem?.labOrder?.encounter?.chart?.patient?.first_name || 'Unknown'} {result.testItem?.labOrder?.encounter?.chart?.patient?.last_name || ''}
                        </p>
                        <p className="lab-result-id">ID: {result.id?.slice(0, 5) || '22022'}</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '70%', backgroundColor: index === 0 ? '#03A5FF' : '#F59E0B' }} />
                        </div>
                        <a href="#" className="review-link" onClick={(e) => { e.preventDefault(); navigate('/clinician/labs'); }}>
                          Review Report
                        </a>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="lab-result-item">
                        <h3 className="lab-result-name">Cholesterol Test</h3>
                        <p className="lab-result-patient">Patient: John Doe</p>
                        <p className="lab-result-id">ID: 22022</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '85%', backgroundColor: '#03A5FF' }} />
                        </div>
                        <a href="#" className="review-link" onClick={(e) => { e.preventDefault(); navigate('/clinician/labs'); }}>
                          Review Report
                        </a>
                      </div>

                      <div className="lab-result-item">
                        <h3 className="lab-result-name">Lipid Test</h3>
                        <p className="lab-result-patient">Patient: Jack White</p>
                        <p className="lab-result-id">ID: 22031</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '45%', backgroundColor: '#F59E0B' }} />
                        </div>
                        <a href="#" className="review-link" onClick={(e) => { e.preventDefault(); navigate('/clinician/labs'); }}>
                          Review Report
                        </a>
                      </div>
                    </>
                  )}
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
