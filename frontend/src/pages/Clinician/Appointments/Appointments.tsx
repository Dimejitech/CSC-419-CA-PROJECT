import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Appointments.css';
import { useAuth } from '../../../context';
import { schedulingAPI } from '../../../services/api';
import cityCareLogoColored from '../../../assets/cityCarelogoColored.png';

interface ScheduleItem {
  id: string;
  slotId: string;
  clinicianId: string;
  startTime: string;
  endTime: string;
  status: string;
  slotStatus: string;
  reasonForVisit?: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  } | null;
}

// Calendar icon component
const CalendarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="24" height="22" rx="3" fill="url(#calGradAppt)" fillOpacity="0.15"/>
    <rect x="4" y="6" width="24" height="22" rx="3" stroke="url(#calGradAppt)" strokeWidth="2"/>
    <path d="M4 12H28" stroke="url(#calGradAppt)" strokeWidth="2"/>
    <path d="M10 4V8" stroke="url(#calGradAppt)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 4V8" stroke="url(#calGradAppt)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 18L15 23L12 20" stroke="url(#calGradAppt)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="calGradAppt" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#03A5FF"/>
        <stop offset="1" stopColor="#1FC16B"/>
      </linearGradient>
    </defs>
  </svg>
);

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState('Appointments');
  const [rescheduleModal, setRescheduleModal] = useState<{ open: boolean; appointmentId: string | null }>({ open: false, appointmentId: null });
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSchedule = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const scheduleData = await schedulingAPI.getClinicianSchedule(
        user.id,
        startDate.toISOString(),
        endDate.toISOString()
      ).catch(() => []);

      setSchedule(scheduleData || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch data on mount and when navigating to this page
  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule, location.key]);

  const handleCancelAppointment = async (bookingId: string) => {
    try {
      await schedulingAPI.cancelBooking(bookingId);
      setFeedbackMessage({ type: 'success', text: 'Appointment cancelled successfully' });
      fetchSchedule();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setFeedbackMessage({ type: 'error', text: 'Failed to cancel appointment' });
    }
  };

  const handleAcceptAppointment = async (bookingId: string) => {
    try {
      await schedulingAPI.updateBooking(bookingId, { status: 'Confirmed' });
      setFeedbackMessage({ type: 'success', text: 'Appointment confirmed successfully' });
      fetchSchedule();
    } catch (error) {
      console.error('Error accepting appointment:', error);
      setFeedbackMessage({ type: 'error', text: 'Failed to accept appointment' });
    }
  };

  const handleDeclineAppointment = async (bookingId: string) => {
    try {
      await schedulingAPI.cancelBooking(bookingId);
      setFeedbackMessage({ type: 'success', text: 'Appointment declined' });
      fetchSchedule();
    } catch (error) {
      console.error('Error declining appointment:', error);
      setFeedbackMessage({ type: 'error', text: 'Failed to decline appointment' });
    }
  };

  const handleOpenReschedule = (appointmentId: string) => {
    setRescheduleModal({ open: true, appointmentId });
    setRescheduleDate('');
    setRescheduleTime('');
  };

  const handleReschedule = async () => {
    if (!rescheduleModal.appointmentId || !rescheduleDate || !rescheduleTime) {
      setFeedbackMessage({ type: 'error', text: 'Please select a date and time' });
      return;
    }

    setRescheduleLoading(true);
    try {
      // Create a new slot for the rescheduled time
      const newDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);
      const endDateTime = new Date(newDateTime.getTime() + 30 * 60 * 1000); // 30 min appointment

      // Create slot and reschedule
      const newSlot = await schedulingAPI.createSlot({
        clinicianId: user!.id,
        startTime: newDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });

      await schedulingAPI.rescheduleBooking(rescheduleModal.appointmentId, { newSlotId: newSlot.id });

      setRescheduleModal({ open: false, appointmentId: null });
      setFeedbackMessage({ type: 'success', text: 'Appointment rescheduled successfully' });
      fetchSchedule();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setFeedbackMessage({ type: 'error', text: 'Failed to reschedule appointment. Please try again.' });
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleNavigation = (item: string, path: string) => {
    setActiveNavItem(item);
    navigate(path);
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

  const now = new Date();

  // Pending requests (need clinician approval)
  const pendingRequests = schedule.filter(item =>
    item.patient && item.status === 'Pending' && new Date(item.startTime) >= now
  );

  // Upcoming appointments (confirmed only, future)
  const upcomingAppointments = schedule.filter(item =>
    item.patient && item.status === 'Confirmed' && new Date(item.startTime) >= now
  );

  // Past appointments
  const pastAppointments = schedule.filter(item =>
    item.patient && (new Date(item.startTime) < now || item.status === 'Completed')
  );

  // Filter function for search
  const filterBySearch = (item: ScheduleItem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const patientName = `${item.patient?.first_name || ''} ${item.patient?.last_name || ''}`.toLowerCase();
    const reason = (item.reasonForVisit || '').toLowerCase();
    return patientName.includes(query) || reason.includes(query);
  };

  // Filtered lists
  const filteredPendingRequests = pendingRequests.filter(filterBySearch);
  const filteredUpcomingAppointments = upcomingAppointments.filter(filterBySearch);
  const filteredPastAppointments = pastAppointments.filter(filterBySearch);

  return (
    <div className="appt-page">
      {/* Top bar */}
      <header className="appt-topbar">
        <div className="appt-brand">
          <img src={cityCareLogoColored} alt="CityCare" width="32" height="32" />
          <span className="appt-brandName">CityCare</span>
        </div>

        <div className="appt-search">
          <span className="appt-searchIcon">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm6.2-1.1 4.3 4.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            className="appt-searchInput"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="appt-topRight">
          <button className="appt-iconBtn" type="button" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>

          <div className="appt-user">
            <div className="appt-avatar">
              <img className="appt-avatarImg" src="/images/justin.jpg" alt={`${user?.first_name} ${user?.last_name}`} />
            </div>
            <div className="appt-userMeta">
              <div className="appt-userName">{user?.first_name} {user?.last_name}</div>
              <div className="appt-userRole">Clinician</div>
            </div>
          </div>
        </div>
      </header>

      <div className="appt-body">
        {/* Sidebar */}
        <aside className="appt-sidebar">
          <div className="appt-sidebarBox">
            <div className="appt-navHeader">
              <div className="appt-navHeaderPanel">
                <img className="appt-navHeaderCollapse" src="/images/sidebar-collapse.png" alt="" />
                <span className="appt-navHeaderTitle">Navigation</span>
              </div>
            </div>

            <div className="appt-sectionTitle">Main</div>

            <nav className="appt-nav">
              <button className={`appt-navItem ${activeNavItem === 'Home' ? 'appt-navItem--active' : ''}`} onClick={() => handleNavigation('Home', '/clinician/dashboard')} type="button">
                <span className="appt-navItemIcon">
                  <img className="appt-navImg" src="/images/home.png" alt="" />
                </span>
                Home
              </button>

              <button className={`appt-navItem ${activeNavItem === 'Appointments' ? 'appt-navItem--active' : ''}`} type="button">
                <span className="appt-navItemIcon">
                  <img className="appt-navImg" src="/images/appointments.png" alt="" />
                </span>
                Appointments
              </button>

              <button className={`appt-navItem ${activeNavItem === 'Patients' ? 'appt-navItem--active' : ''}`} onClick={() => handleNavigation('Patients', '/clinician/patients')} type="button">
                <span className="appt-navItemIcon">
                  <img className="appt-navImg" src="/images/patients.png" alt="" />
                </span>
                Patients
              </button>

              <button className={`appt-navItem ${activeNavItem === 'Labs' ? 'appt-navItem--active' : ''}`} onClick={() => handleNavigation('Labs', '/clinician/labs')} type="button">
                <span className="appt-navItemIcon">
                  <img className="appt-navImg" src="/images/labs.png" alt="" />
                </span>
                Labs
              </button>
            </nav>

            <div className="appt-sectionTitle appt-mt24">Secondary</div>

            <nav className="appt-nav">
              <button className={`appt-navItem ${activeNavItem === 'Profile' ? 'appt-navItem--active' : ''}`} onClick={() => handleNavigation('Profile', '/clinician/profile')} type="button">
                <span className="appt-navItemIcon">
                  <img className="appt-navImg" src="/images/profile.png" alt="" />
                </span>
                Profile
              </button>
            </nav>

            <button className="appt-logout" type="button" onClick={() => { logout(); navigate('/clinician/signin'); }}>
              <span className="appt-logoutIcon">
                <img className="appt-logoutImg" src="/images/log-out.png" alt="" />
              </span>
              Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="appt-content">
          <h1 className="appt-pageTitle">Appointments</h1>

          {/* Feedback Message */}
          {feedbackMessage && (
            <div
              style={{
                padding: '12px 16px',
                marginBottom: '16px',
                borderRadius: '8px',
                backgroundColor: feedbackMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: feedbackMessage.type === 'success' ? '#065f46' : '#991b1b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{feedbackMessage.text}</span>
              <button
                onClick={() => setFeedbackMessage(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
              >
                ×
              </button>
            </div>
          )}

          {loading ? (
            <div className="appt-loading">Loading schedule...</div>
          ) : (
            <>
              {/* Pending Requests Banner */}
              {filteredPendingRequests.length > 0 && (
                <div className="appt-pendingBanner" onClick={() => setShowPendingModal(true)}>
                  <div className="appt-pendingBannerLeft">
                    <span className="appt-pendingBannerIcon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </span>
                    <span className="appt-pendingBannerText">
                      <strong>{filteredPendingRequests.length}</strong> pending appointment {filteredPendingRequests.length === 1 ? 'request' : 'requests'} awaiting your response
                    </span>
                  </div>
                  <button className="appt-pendingBannerBtn" type="button">
                    Review Requests
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              )}

              {/* Upcoming Appointments */}
              <section className="appt-section">
                <div className="appt-sectionHeader">
                  <h2 className="appt-sectionTitleGradient">Upcoming Appointments</h2>
                  <button className="appt-bookBtn" type="button" onClick={() => navigate('/clinician/patients')}>Book Appointment</button>
                </div>

                {filteredUpcomingAppointments.length > 0 ? (
                  filteredUpcomingAppointments.slice(0, 1).map((appointment) => (
                    <div key={appointment.id} className="appt-upcomingCard">
                      <div className="appt-upcomingHeader">
                        <CalendarIcon />
                        <span className="appt-upcomingDateTime">
                          {formatDate(appointment.startTime)} | {formatTime(appointment.startTime)}
                        </span>
                      </div>

                      <div className="appt-upcomingDetails">
                        <img src="/images/avatar.png" alt={`${appointment.patient?.first_name || ''} ${appointment.patient?.last_name || ''}`.trim() || 'Patient'} className="appt-upcomingAvatar" />
                        <div className="appt-upcomingInfo">
                          <h3 className="appt-upcomingName">{`${appointment.patient?.first_name || ''} ${appointment.patient?.last_name || ''}`.trim() || 'Unknown Patient'}</h3>
                          <p className="appt-upcomingType">{appointment.reasonForVisit || 'General Consultation'}</p>
                        </div>
                        <span className="appt-statusBadge appt-statusCompleted">
                          {appointment.status === 'Confirmed' ? 'Confirmed' : appointment.status}
                        </span>
                      </div>

                      <div className="appt-upcomingActions">
                        <button className="appt-btnPrimary" type="button" onClick={() => navigate(`/clinician/patients`)}>View Details</button>
                        <button className="appt-btnOutline" type="button" onClick={() => handleOpenReschedule(appointment.id)}>Reschedule</button>
                        <button className="appt-btnCancel" type="button" onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="appt-emptyCard">No upcoming appointments</div>
                )}
              </section>

              {/* Past Appointments */}
              <section className="appt-section">
                <div className="appt-sectionHeader">
                  <h2 className="appt-sectionTitleGradient">Past Appointments</h2>
                  {filteredPastAppointments.length > 4 && (
                    <button className="appt-viewMoreBtn" type="button" onClick={() => setShowAllPast(!showAllPast)}>
                      {showAllPast ? 'Show Less' : 'View More'}
                    </button>
                  )}
                </div>

                {filteredPastAppointments.length > 0 ? (
                  <div className="appt-pastGrid">
                    {filteredPastAppointments.slice(0, showAllPast ? undefined : 4).map((appointment) => (
                      <div key={appointment.id} className="appt-pastCard">
                        <div className="appt-pastHeader">
                          <img src="/images/avatar.png" alt={`${appointment.patient?.first_name || ''} ${appointment.patient?.last_name || ''}`.trim() || 'Patient'} className="appt-pastAvatar" />
                          <div className="appt-pastInfo">
                            <div className="appt-pastTopRow">
                              <span className="appt-pastDate">{formatDate(appointment.startTime)}</span>
                              <span className="appt-statusBadgeSmall appt-statusCompleted">Completed</span>
                            </div>
                            <div className="appt-pastTime">{formatTime(appointment.startTime)}</div>
                            <div className="appt-pastName">{`${appointment.patient?.first_name || ''} ${appointment.patient?.last_name || ''}`.trim() || 'Unknown Patient'}</div>
                            <div className="appt-pastBottomRow">
                              <span className="appt-pastType">{appointment.reasonForVisit || 'General Consultation'}</span>
                              <button className="appt-btnSummary" type="button" onClick={() => navigate('/clinician/patients')}>View Summary</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="appt-emptyCard">No past appointments</div>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal.open && (
        <div className="appt-modal-overlay" onClick={() => setRescheduleModal({ open: false, appointmentId: null })}>
          <div className="appt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="appt-modal-header">
              <h2>Reschedule Appointment</h2>
              <button className="appt-modal-close" onClick={() => setRescheduleModal({ open: false, appointmentId: null })}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="appt-modal-body">
              <div className="appt-form-group">
                <label>New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="appt-input"
                />
              </div>
              <div className="appt-form-group">
                <label>New Time</label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="appt-input"
                />
              </div>
            </div>
            <div className="appt-modal-footer">
              <button className="appt-btnOutline" onClick={() => setRescheduleModal({ open: false, appointmentId: null })}>
                Cancel
              </button>
              <button className="appt-btnPrimary" onClick={handleReschedule} disabled={rescheduleLoading}>
                {rescheduleLoading ? 'Rescheduling...' : 'Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Requests Modal */}
      {showPendingModal && (
        <div className="appt-modal-overlay" onClick={() => setShowPendingModal(false)}>
          <div className="appt-modal appt-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="appt-modal-header">
              <h2>Pending Appointment Requests</h2>
              <button className="appt-modal-close" onClick={() => setShowPendingModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="appt-modal-body appt-modal-scroll">
              {filteredPendingRequests.length > 0 ? (
                <div className="appt-pendingList">
                  {filteredPendingRequests.map((request) => (
                    <div key={request.id} className="appt-pendingItem">
                      <div className="appt-pendingItemLeft">
                        <img src="/images/avatar.png" alt={`${request.patient?.first_name || ''} ${request.patient?.last_name || ''}`.trim() || 'Patient'} className="appt-pendingItemAvatar" />
                        <div className="appt-pendingItemInfo">
                          <h4 className="appt-pendingItemName">{`${request.patient?.first_name || ''} ${request.patient?.last_name || ''}`.trim() || 'Unknown Patient'}</h4>
                          <p className="appt-pendingItemDate">
                            {formatDate(request.startTime)} at {formatTime(request.startTime)}
                          </p>
                          <p className="appt-pendingItemReason">{request.reasonForVisit || 'General Consultation'}</p>
                        </div>
                      </div>
                      <div className="appt-pendingItemActions">
                        <button
                          className="appt-btnPrimary appt-btnSm"
                          type="button"
                          onClick={() => {
                            handleAcceptAppointment(request.id);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="appt-btnOutline appt-btnSm"
                          type="button"
                          onClick={() => {
                            handleDeclineAppointment(request.id);
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="appt-emptyText">No pending requests</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
