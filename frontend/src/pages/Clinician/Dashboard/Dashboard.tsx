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

// Search result type
interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  path: string;
  icon: 'appointment' | 'patient' | 'lab' | 'notification';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState('Home');
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [recentVisits, setRecentVisits] = useState<Array<{ id: string; patientId: string; patientName: string; status: string; lastVisit: string }>>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Fetch clinician's schedule for next 7 days (upcoming)
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch past appointments for recent visits (last 30 days)
      const pastStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const pastEndDate = new Date().toISOString();

      const [scheduleData, pastScheduleData, labData, notificationsData] = await Promise.all([
        schedulingAPI.getClinicianSchedule(user.id, startDate, endDate).catch(() => []),
        schedulingAPI.getClinicianSchedule(user.id, pastStartDate, pastEndDate).catch(() => []),
        labAPI.getUnverifiedResults().catch(() => []),
        notificationAPI.getNotifications(10).catch(() => ({ notifications: [], unreadCount: 0 })),
      ]);

      setAppointments(scheduleData || []);

      // Transform past appointments to recent visits format
      const visits = (pastScheduleData || [])
        .filter((appt: Booking) => appt.patient && appt.status !== 'Cancelled')
        .slice(0, 10)
        .map((appt: Booking) => ({
          id: appt.id,
          patientId: appt.patient?.id || '',
          patientName: `${appt.patient?.first_name || ''} ${appt.patient?.last_name || ''}`.trim() || 'Unknown Patient',
          status: appt.status === 'Completed' ? 'Stable' : 'Pending',
          lastVisit: new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }));
      setRecentVisits(visits);

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

  // Global search function
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search appointments
    appointments.forEach(appt => {
      const patientName = `${appt.patient?.first_name || ''} ${appt.patient?.last_name || ''}`.toLowerCase();
      const reason = (appt.reasonForVisit || '').toLowerCase();
      if (patientName.includes(lowerQuery) || reason.includes(lowerQuery)) {
        // Format date safely
        let formattedDate = 'Scheduled';
        if (appt.startTime) {
          const date = new Date(appt.startTime);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
          }
        }
        results.push({
          id: appt.id,
          title: `${appt.patient?.first_name || ''} ${appt.patient?.last_name || ''}`.trim() || 'Patient',
          subtitle: formattedDate,
          category: 'Dashboard > Upcoming Appointments',
          path: '/clinician/appointments',
          icon: 'appointment',
        });
      }
    });

    // Search recent visits
    recentVisits.forEach(visit => {
      if (visit.patientName.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: visit.id,
          title: visit.patientName,
          subtitle: `Last visit: ${visit.lastVisit}`,
          category: 'Dashboard > Recent Patient Visits',
          path: `/clinician/patients?id=${visit.patientId}`,
          icon: 'patient',
        });
      }
    });

    // Search lab results
    labResults.forEach(lab => {
      const testName = (lab.testName || lab.testItem?.testName || '').toLowerCase();
      const patientName = lab.testItem?.labOrder?.encounter?.chart?.patient
        ? `${lab.testItem.labOrder.encounter.chart.patient.first_name} ${lab.testItem.labOrder.encounter.chart.patient.last_name}`.toLowerCase()
        : '';
      if (testName.includes(lowerQuery) || patientName.includes(lowerQuery)) {
        results.push({
          id: lab.id,
          title: lab.testName || lab.testItem?.testName || 'Lab Test',
          subtitle: patientName || 'Unknown Patient',
          category: 'Dashboard > Lab Results',
          path: '/clinician/labs',
          icon: 'lab',
        });
      }
    });

    // Search notifications
    notifications.forEach(notif => {
      if (notif.title.toLowerCase().includes(lowerQuery) || notif.message.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: notif.id,
          title: notif.title,
          subtitle: notif.message.slice(0, 50) + (notif.message.length > 50 ? '...' : ''),
          category: 'Dashboard > Notifications',
          path: '#',
          icon: 'notification',
        });
      }
    });

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setShowSearchResults(false);
    setSearchQuery('');
    if (result.path !== '#') {
      navigate(result.path);
    }
  };

  const formatNotificationTime = (dateStr: string | undefined | null) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Recently';
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

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return 'Date not set';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const formatTime = (dateStr: string | undefined | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
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
          <input
            className="dashboard-searchInput"
            placeholder="Search patients, appointments, labs..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery && setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />
          {showSearchResults && (
            <div className="dashboard-searchResults">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="dashboard-searchResultItem"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <div className={`dashboard-searchResultIcon dashboard-searchResultIcon--${result.icon}`}>
                      {result.icon === 'appointment' && <ScheduleIcon />}
                      {result.icon === 'patient' && <PatientsIcon />}
                      {result.icon === 'lab' && <LabOrderIcon />}
                      {result.icon === 'notification' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                      )}
                    </div>
                    <div className="dashboard-searchResultContent">
                      <div className="dashboard-searchResultTitle">{result.title}</div>
                      <div className="dashboard-searchResultSubtitle">{result.subtitle}</div>
                      <div className="dashboard-searchResultCategory">{result.category}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dashboard-searchNoResults">
                  <span>No results found for "{searchQuery}"</span>
                </div>
              )}
            </div>
          )}
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
                <img className="dashboard-navHeaderCollapse" src="/images/sidebar-collapse.png" alt="" />
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
            </nav>

            <button className="dashboard-logout" type="button" onClick={() => { logout(); navigate('/clinician/signin'); }}>
              <span className="dashboard-logoutIcon">
                <img className="dashboard-logoutImg" src="/images/log-out.png" alt="" />
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
                            {upcomingAppointment.patient
                              ? `${upcomingAppointment.patient.first_name || ''} ${upcomingAppointment.patient.last_name || ''}`.trim() || 'Patient'
                              : 'Patient'}
                          </div>
                          <div className="appointment-department">
                            {upcomingAppointment.reasonForVisit || 'General Consultation'}
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

                {/* Recent Patient Visits */}
                <section className="dashboard-card payment-history">
                  <h2 className="card-title-plain">Recent Patient Visits</h2>

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
                      {recentVisits.length > 0 ? (
                        recentVisits.slice(0, showAllPayments ? 10 : 3).map((visit) => (
                          <tr key={visit.id}>
                            <td>{visit.patientName}</td>
                            <td>
                              <span className={`status-badge status-${visit.status.toLowerCase()}`}>
                                {visit.status}
                              </span>
                            </td>
                            <td>{visit.lastVisit}</td>
                            <td>
                              <a href="#" className="action-link" onClick={(e) => { e.preventDefault(); navigate(`/clinician/patients?id=${visit.patientId}`); }}>
                                View Details
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                            No recent patient visits
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {recentVisits.length > 3 && (
                    <button className="view-all-link" onClick={() => setShowAllPayments(!showAllPayments)}>
                      {showAllPayments ? '← Show Less' : 'View All Visits >>'}
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
                          onClick={() => {
                            setSelectedNotification(notification);
                            if (!notification.is_read) handleMarkAsRead(notification.id);
                          }}
                          style={{ cursor: 'pointer' }}
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
                        <h3 className="lab-result-name">{result.testName || result.test_type || 'Lab Test'}</h3>
                        <p className="lab-result-patient">
                          Patient: {result.patient?.first_name || 'Unknown'} {result.patient?.last_name || ''}
                        </p>
                        <p className="lab-result-id">ID: {result.id?.slice(0, 5) || 'N/A'}</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '70%', backgroundColor: index === 0 ? '#03A5FF' : '#F59E0B' }} />
                        </div>
                        <a href="#" className="review-link" onClick={(e) => { e.preventDefault(); navigate('/clinician/labs'); }}>
                          Review Report
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state" style={{ padding: '30px', textAlign: 'center' }}>
                      <p className="empty-text">No recent lab results to review</p>
                      <button className="btn-outline" style={{ marginTop: '12px' }} onClick={() => navigate('/clinician/labs')}>
                        View All Labs
                      </button>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="notification-modal-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notification-modal-header">
              <div className="notification-modal-header-left">
                <div className="notification-modal-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <h3 className="notification-modal-title">{selectedNotification.title}</h3>
              </div>
              <button className="notification-modal-close" onClick={() => setSelectedNotification(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="notification-modal-body">
              <p className="notification-modal-message">{selectedNotification.message}</p>
              <div className="notification-modal-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                {formatNotificationTime(selectedNotification.created_at)}
              </div>
            </div>
            <div className="notification-modal-footer">
              <button className="notification-modal-btn" onClick={() => setSelectedNotification(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
