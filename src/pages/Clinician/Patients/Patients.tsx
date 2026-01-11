import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Patients.css';

interface Appointment {
  id: string;
  name: string;
  nextAppt: string;
  status: 'Complete' | 'Processing';
}

interface VitalSigns {
  bp: string;
  heartRate: string;
  weight: string;
  temperature: string;
}

const Patients: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const appointments: Appointment[] = [
    { id: '22017', name: 'Anna John', nextAppt: 'Jan 15. 10:00am', status: 'Complete' },
    { id: '22017', name: 'Anna John', nextAppt: 'Jan 15. 10:00am', status: 'Processing' },
    { id: '22017', name: 'Anna John', nextAppt: 'Jan 15. 10:00am', status: 'Complete' },
    { id: '22017', name: 'Anna John', nextAppt: 'Jan 15. 10:00am', status: 'Complete' },
    { id: '22017', name: 'Anna John', nextAppt: 'Jan 15. 10:00am', status: 'Complete' },
  ];

  const vitals: VitalSigns = {
    bp: '120/80',
    heartRate: '72',
    weight: '72',
    temperature: '36.6'
  };

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

              <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/appointments')}>
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/appointments.png" alt="" />
                </span>
                Appointments
              </button>

              <button className="labs-navItem labs-navItem--active" type="button">
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
          <div className="patients-wrapper">
            {/* Left Column - Patients List */}
            <div className="patients-left">
              <h1 className="patients-pageTitle">Patients</h1>
              
              <div className="patients-list-section">
                <div className="patients-search">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm6.2-1.1 4.3 4.3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input type="text" placeholder="Search..." />
                </div>

                <div className="appointments-list">
                  {appointments.map((appointment, index) => (
                    <div 
                      key={index} 
                      className={`appointment-card ${appointment.status === 'Processing' ? 'processing' : ''} ${index === 0 ? 'first' : ''}`}
                    >
                      <img src="/images/avatar.png" alt={appointment.name} className="patient-avatar" />
                      
                      <div className="appointment-info">
                        <h3>{appointment.name}</h3>
                        <p className="patient-id">ID: {appointment.id}</p>
                        <p className="next-appt">Next Appt:</p>
                        <p className="appt-date">{appointment.nextAppt}</p>
                      </div>

                      <div className="appointment-status">
                        <p className="status-label">Labs:</p>
                        <span className={`status-text-${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Patient Details */}
            <div className="patient-details-wrapper">
              <div className="patient-details-topbar">
                <button className="schedule-appointment-btn" type="button">
                  Schedule Appointment
                </button>
              </div>
              
              <div className="patient-details-section">
                <div className="patient-header">
                  <img src="/images/avatar.png" alt="Anna John" className="patient-avatar-large" />
                  <div className="patient-header-info">
                    <h2>Anna John</h2>
                    <p className="patient-meta">32 years · Female · ID: 22017</p>
                    <div className="patient-tags">
                      <span className="tag tag-purple">Physiotherapy</span>
                      <span className="tag tag-green">Chronic Pain</span>
                    </div>
                  </div>
                  <div className="patient-actions">
                    <button className="icon-btn">
                      <img src="/images/edit-icon.png" alt="Edit" className="action-icon" />
                    </button>
                    <button className="icon-btn">
                      <img src="/images/more-icon.png" alt="More" className="action-icon" />
                    </button>
                  </div>
                </div>

              <div className="patient-info-grid">
                {/* Upcoming Appointments */}
                <div className="info-card upcoming-card">
                  <div className="card-header">
                    <div className="card-title">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="4" width="14" height="13" rx="2" stroke="#00B8D4" strokeWidth="1.5"/>
                        <path d="M3 8H17M7 1V4M13 1V4" stroke="#00B8D4" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span>Upcoming Appointments</span>
                    </div>
                    <button className="history-link">History</button>
                  </div>

                  <div className="appointment-detail-card">
                    <h4>Physiotherapy Checkup</h4>
                    <div className="appointment-datetime">
                      <span className="date-badge">Jan 15</span>
                      <span className="time-text">10:00am - 10:45am</span>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn-primary">Start</button>
                      <button className="btn-secondary">Reschedule</button>
                    </div>
                  </div>
                </div>

                {/* Last Vitals */}
                <div className="info-card vitals-card">
                  <div className="card-header">
                    <span className="card-title-text">Last Vitals</span>
                    <span className="recorded-text">Recorded Yesterday</span>
                  </div>

                  <div className="vitals-grid">
                    <div className="vital-item">
                      <div className="vital-label">BP</div>
                      <div className="vital-value">{vitals.bp}</div>
                      <div className="vital-unit">mmHg</div>
                    </div>
                    <div className="vital-item">
                      <div className="vital-label">Heart Rate</div>
                      <div className="vital-value">{vitals.heartRate}</div>
                      <div className="vital-unit">bpm</div>
                    </div>
                    <div className="vital-item">
                      <div className="vital-label">Weight</div>
                      <div className="vital-value">{vitals.weight}</div>
                      <div className="vital-unit">kg</div>
                    </div>
                    <div className="vital-item">
                      <div className="vital-label">Temperature</div>
                      <div className="vital-value">{vitals.temperature}</div>
                      <div className="vital-unit">°C</div>
                    </div>
                  </div>
                </div>

                {/* Active Prescriptions */}
                <div className="info-card prescriptions-card">
                  <div className="card-header">
                    <span className="card-title-text">Active Prescriptions</span>
                    <button className="add-new-link">+ Add New</button>
                  </div>

                  <table className="prescriptions-table">
                    <thead>
                      <tr>
                        <th>Medication</th>
                        <th>Status</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Ibuprofen</td>
                        <td><span className="status-badge-small active">Active</span></td>
                        <td>Twice daily</td>
                        <td>400mg</td>
                      </tr>
                    </tbody>
                  </table>

                  <button className="view-all-link">View All</button>
                </div>

                {/* Recent Lab Requests */}
                <div className="info-card lab-requests-card">
                  <h3 className="card-title-cyan">Recent Lab Requests</h3>

                  <div className="lab-request-item">
                    <div className="lab-request-info">
                      <h4>Blood Chemistry Panel</h4>
                      <p className="lab-request-date">Requested: Dec 16, 2025</p>
                    </div>
                    <span className="status-badge-small complete">Complete</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Patients;