import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  department: string;
}

interface Payment {
  id: string;
  patientName: string;
  status: 'Stable' | 'Pending' | 'Critical';
  lastVisit: string;
}

interface FullPayment {
  paymentId: string;
  method: string;
  amount: string;
}

interface LabResult {
  id: string;
  testName: string;
  patientName: string;
  patientId: string;
  progress: number;
  color: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState('Home');
  const [showAllPayments, setShowAllPayments] = useState(false);

  const upcomingAppointment: Appointment = {
    id: '1',
    date: 'Thursday, January 15, 2026',
    time: '10:00 A.M.',
    patientName: 'John Doe',
    department: 'Cardiology Department',
  };

  const payments: Payment[] = [
    { id: '1', patientName: 'Anna Lee', status: 'Stable', lastVisit: 'Jan 12, 2024' },
    { id: '2', patientName: 'Anna Lee', status: 'Stable', lastVisit: 'Jan 12, 2024' },
  ];

  const allPayments: FullPayment[] = [
    { paymentId: '#00258', method: 'Credit Card', amount: '₦50,000' },
    { paymentId: '#00258', method: 'Credit Card', amount: '₦50,000' },
    { paymentId: '#00258', method: 'Online Payment', amount: '₦50,000' },
    { paymentId: '#00258', method: 'Credit Card', amount: '₦50,000' },
    { paymentId: '#00258', method: 'Credit Card', amount: '₦50,000' },
  ];

  const labResults: LabResult[] = [
    { id: '22022', testName: 'Cholesterol Test', patientName: 'John Doe', patientId: '22022', progress: 75, color: '#00a8e8' },
    { id: '22031', testName: 'Lipid Test', patientName: 'Jack White', patientId: '22031', progress: 45, color: '#fb923c' },
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
    <div className="labs-page">
      {/* Top bar */}
      <header className="labs-topbar">
        <div className="labs-brand">
          <img 
            src="/images/citycare-logo-icon.png" 
            alt="CityCare Logo" 
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
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
              <button
                className={`labs-navItem ${activeNavItem === 'Home' ? 'labs-navItem--active' : ''}`}
                onClick={() => handleNavigation('Home')}
                type="button"
              >
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/home.png" alt="" />
                </span>
                Home
              </button>

              <button
                className={`labs-navItem ${activeNavItem === 'Appointments' ? 'labs-navItem--active' : ''}`}
                onClick={() => handleNavigation('Appointments')}
                type="button"
              >
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/appointments.png" alt="" />
                </span>
                Appointments
              </button>

              <button
                className={`labs-navItem ${activeNavItem === 'Patients' ? 'labs-navItem--active' : ''}`}
                onClick={() => handleNavigation('Patients')}
                type="button"
              >
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/patients.png" alt="" />
                </span>
                Patients
              </button>

              <button
                className={`labs-navItem ${activeNavItem === 'Labs' ? 'labs-navItem--active' : ''}`}
                onClick={() => handleNavigation('Labs')}
                type="button"
              >
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/labicon.svg" alt="" />
                </span>
                Labs
              </button>
            </nav>

            <div className="labs-sectionTitle labs-mt24">Secondary</div>

            <nav className="labs-nav">
              <button
                className={`labs-navItem ${activeNavItem === 'Profile' ? 'labs-navItem--active' : ''}`}
                onClick={() => handleNavigation('Profile')}
                type="button"
              >
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/profile.png" alt="" />
                </span>
                Profile
              </button>

              <button
                className={`labs-navItem ${activeNavItem === 'Help' ? 'labs-navItem--active' : ''}`}
                onClick={() => handleNavigation('Help')}
                type="button"
              >
                <span className="labs-navItemIcon">
                  <img className="labs-navImg" src="/images/help-circle.png" alt="" />
                </span>
                Help / Support
              </button>
            </nav>

            <button className="labs-logout" type="button">
              <span className="labs-logoutIcon">
                <img className="labs-logoutImg" src="/images/log-out.png" alt="" />
              </span>
              Logout
            </button>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="labs-content">
          <div className="dashboard-content-wrapper">
            <div className="page-header">
              <h1 className="page-title">Home</h1>
              <p className="page-subtitle">Welcome, Peter 👋🏾</p>
            </div>

            <div className="dashboard-grid">
              {/* Left Column */}
              <div className="left-column">
                {/* Upcoming Appointment */}
                <section className="card upcoming-appointment">
                  <div className="card-header">
                  <img 
                    src="/images/calendar-plus.png" 
                    alt="Calendar" 
                    className="appointment-icon-img"
                  />
                    <h2 className="card-title">Upcoming Appointment</h2>
                  </div>
                  <div className="appointment-details">
                    <div className="appointment-info">
                      <div className="appointment-date-time">
                        <span className="appointment-date">{upcomingAppointment.date}</span>
                        <span className="appointment-separator"> | </span>
                        <span className="appointment-time">{upcomingAppointment.time}</span>
                      </div>
                      <div className="appointment-patient">{upcomingAppointment.patientName}</div>
                      <div className="appointment-department">{upcomingAppointment.department}</div>
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <button className="btn-primary">View Details</button>
                    <button className="btn-secondary">Reschedule</button>
                  </div>
                </section>

                {/* Quick Actions */}
                <section className="quick-actions">
                  <div className="action-card">
                    <div className="action-icon">
                      <img src="/images/calendar-icon.png" alt="Schedule Appointment" />
                    </div>
                    <h3 className="action-title">Schedule Appointment</h3>
                    <p className="action-description">Schedule a visit with your patient.</p>
                    <button className="action-button">Schedule Now</button>
                  </div>

                  <div className="action-card">
                    <div className="action-icon">
                      <img src="/images/patients-icon.png" alt="View Patients" />
                    </div>
                    <h3 className="action-title">View Patients</h3>
                    <p className="action-description">See an overview of all your patients.</p>
                    <button className="action-button-secondary">See Now</button>
                  </div>

                  <div className="action-card">
                    <div className="action-icon">
                      <img src="/images/lab-icon.png" alt="Order Lab" />
                    </div>
                    <h3 className="action-title">Order Lab</h3>
                    <p className="action-description">Request a result or report from the lab.</p>
                    <button className="action-button-secondary">Send Order</button>
                  </div>
                </section>

                {/* Payment History */}
                <section className="card payment-history">
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
                                <span className={`status-badge ${payment.status.toLowerCase()}`}>
                                  {payment.status}
                                </span>
                              </td>
                              <td>{payment.lastVisit}</td>
                              <td>
                                <a href="#" className="action-link" onClick={(e) => e.preventDefault()}>
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
                    <>
                      <table className="payment-table">
                        <thead>
                          <tr>
                            <th>Payment ID</th>
                            <th>Method</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allPayments.map((p, idx) => (
                            <tr key={idx}>
                              <td>{p.paymentId}</td>
                              <td>{p.method}</td>
                              <td style={{ textAlign: 'right' }}>{p.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <button className="view-all-link" onClick={() => setShowAllPayments(false)}>
                        ← Back
                      </button>
                    </>
                  )}
                </section>
              </div>

              {/* Right Column */}
              <div className="right-column">
                {/* Notifications */}
                <section className="card notifications">
                  <h2 className="card-title">Notifications</h2>
                  <div className="empty-state">
                    <svg className="empty-bell-svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p className="empty-text">You have no notifications</p>
                  </div>
                </section>

                {/* Recent Lab Results */}
                <section className="card lab-results">
                  <h2 className="card-title">Recent Lab Results</h2>
                  {labResults.map((result) => (
                    <div key={result.id} className="lab-result-item">
                      <div className="lab-result-card">
                        <div className="lab-result-info">
                          <h3 className="lab-result-name">{result.testName}</h3>
                          <p className="lab-result-patient">Patient: {result.patientName}</p>
                          <p className="lab-result-id">ID: {result.patientId}</p>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${result.progress}%`, backgroundColor: result.color }} />
                        </div>
                        <a href="#" className="review-report-link" onClick={(e) => e.preventDefault()}>
                          Review Report
                        </a>
                      </div>
                    </div>
                  ))}
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