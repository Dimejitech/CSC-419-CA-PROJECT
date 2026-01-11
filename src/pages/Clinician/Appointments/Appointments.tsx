import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Appointments.css';

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  patientAvatar: string;
  appointmentType: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
}

const Appointments: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const upcomingAppointment: Appointment = {
    id: '1',
    date: 'Thursday, January 15, 2026',
    time: '10:00 A.M.',
    patientName: 'Anna John',
    patientAvatar: '/images/avatar.png',
    appointmentType: 'Physiotherapy Checkup',
    status: 'Completed',
  };

  const pastAppointments: Appointment[] = [
    {
      id: '2',
      date: 'Monday, April 15, 2025',
      time: '1:00 P.M.',
      patientName: 'Andrew Jacobs',
      patientAvatar: '/images/avatar.png',
      appointmentType: 'General Medicine',
      status: 'Completed',
    },
    {
      id: '3',
      date: 'Monday, April 15, 2025',
      time: '1:00 P.M.',
      patientName: 'Andrew Jacobs',
      patientAvatar: '/images/avatar.png',
      appointmentType: 'General Medicine',
      status: 'Completed',
    },
    {
      id: '4',
      date: 'Monday, April 15, 2025',
      time: '1:00 P.M.',
      patientName: 'Andrew Jacobs',
      patientAvatar: '/images/avatar.png',
      appointmentType: 'General Medicine',
      status: 'Completed',
    },
    {
      id: '5',
      date: 'Monday, April 15, 2025',
      time: '1:00 P.M.',
      patientName: 'Andrew Jacobs',
      patientAvatar: '/images/avatar.png',
      appointmentType: 'General Medicine',
      status: 'Completed',
    },
  ];

  return (
    <div className="labs-page">
      {/* Top bar */}
      <header className="labs-topbar">
        <div className="labs-brand">
          <img
            src="/images/citycare-logo-icon.png"
            alt="CityCare logo"
            className="labs-logoImage"
          />
          <span className="labs-brandName">CityCare</span>
        </div>

        <div className="labs-search">
          <span className="labs-searchIcon" aria-hidden="true">
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
          <input className="labs-searchInput" placeholder="Search..." />
        </div>

        <div className="labs-topRight">
          <button
            className="labs-iconBtn"
            type="button"
            aria-label="Notifications"
          >
            <img
              className="labs-bellImg"
              src="/images/notification-bell.png"
              alt="Notifications"
            />
            <span className="labs-dot" aria-hidden="true" />
          </button>

          <div className="labs-user">
            <div className="labs-avatar">
              <img
                className="labs-avatarImg"
                src="/images/justin.jpg"
                alt="Peter Parker"
              />
            </div>

            <div className="labs-userMeta">
              <div className="labs-userName">Peter Parker</div>
              <div className="labs-userRole">Clinician</div>
            </div>
          </div>
        </div>
      </header>

      <div className="labs-body">
        {/* Sidebar */}
        <aside className="labs-sidebar">
          <div className="labs-sidebarBox">
            <div className="labs-navHeader">
              <div className="labs-navHeaderPanel">
                <img
                  className="labs-navHeaderCollapse"
                  src="/images/sidebar-collapse.png"
                  alt="Collapse sidebar"
                />
                <span className="labs-navHeaderTitle">Navigation</span>
              </div>
            </div>

            <div className="labs-sectionTitle">Main</div>

            <nav className="labs-nav">
              <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/dashboard')}>
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/home.png" alt="" />
                </span>
                Home
              </button>

              <button className="labs-navItem labs-navItem--active" type="button">
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/appointments.png" alt="" />
                </span>
                Appointments
              </button>

              <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/patients')}>
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/patients.png" alt="" />
                </span>
                Patients
              </button>

              <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/labs')}>
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/labicon.svg" alt="" />
                </span>
                Labs
              </button>
            </nav>

            <div className="labs-sectionTitle labs-mt24">Secondary</div>

            <nav className="labs-nav">
              <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/profile')}>
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/profile.png" alt="" />
                </span>
                Profile
              </button>

              <button className="labs-navItem" type="button">
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/help-circle.png" alt="" />
                </span>
                Help / Support
              </button>
            </nav>

            <button className="labs-logout" type="button" onClick={() => handleNavigation('/clinician/signin')}>
              <span className="labs-logoutIcon">
                <img className="labs-logoutImg" src="/images/log-out.png" alt="" />
              </span>
              Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="labs-content">
          <h1 className="appointments-pageTitle">Appointments</h1>

          {/* Upcoming Appointments */}
          <section className="appointments-section">
            <div className="appointments-sectionHeader">
              <h2 className="appointments-sectionTitle">Upcoming Appointments</h2>
              <button className="appointments-bookBtn" type="button">
                Book Appointment
              </button>
            </div>

            <div className="upcoming-card">
              <div className="upcoming-dateTime">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="12" width="32" height="28" rx="4" fill="url(#calendarGradient)"/>
                  <path d="M8 20H40" stroke="white" strokeWidth="2"/>
                  <path d="M16 8V16M32 8V16" stroke="url(#calendarGradient)" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="34" cy="34" r="8" fill="white"/>
                  <path d="M30 34L33 37L38 32" stroke="url(#calendarGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="calendarGradient" x1="8" y1="12" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00BCD4"/>
                      <stop offset="1" stopColor="#4CAF50"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="upcoming-dateText">{upcomingAppointment.date} | {upcomingAppointment.time}</span>
              </div>

              <div className="upcoming-details">
                <img
                  src={upcomingAppointment.patientAvatar}
                  alt={upcomingAppointment.patientName}
                  className="upcoming-avatar"
                />
                <div className="upcoming-patientInfo">
                  <h3 className="upcoming-patientName">{upcomingAppointment.patientName}</h3>
                  <p className="upcoming-type">{upcomingAppointment.appointmentType}</p>
                </div>
                <span className="status-badge status-completed">
                  {upcomingAppointment.status}
                </span>
              </div>

              <div className="upcoming-actions">
                <button className="btn-viewDetails" type="button">
                  View Details
                </button>
                <button className="btn-reschedule" type="button">
                  Reschedule
                </button>
                <button className="btn-cancel" type="button">
                  Cancel
                </button>
              </div>
            </div>
          </section>

          {/* Past Appointments */}
          <section className="appointments-section">
            <div className="appointments-sectionHeader">
              <h2 className="appointments-sectionTitle">Past Appointments</h2>
              <button className="appointments-viewMoreBtn" type="button">
                View More
              </button>
            </div>

            <div className="past-grid">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="past-card">
                  <div className="past-header">
                    <img
                      src={appointment.patientAvatar}
                      alt={appointment.patientName}
                      className="past-avatar"
                    />
                    <div className="past-info">
                      <div className="past-topRow">
                        <div className="past-date">{appointment.date}</div>
                        <span className="status-badge-small status-completed">
                          {appointment.status}
                        </span>
                      </div>
                      <div className="past-time">{appointment.time}</div>
                      <div className="past-patientName">{appointment.patientName}</div>
                      <div className="past-bottomRow">
                        <div className="past-type">{appointment.appointmentType}</div>
                        <button className="btn-viewSummary" type="button">
                          View Summary
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Appointments;