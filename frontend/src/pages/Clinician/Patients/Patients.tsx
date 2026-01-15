import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Patients.css';
import { clinicalAPI, schedulingAPI } from '../../../services/api';
import { useAuth } from '../../../context';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  patient_charts?: { id: string }[];
}

interface PatientDetails {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  patientId: string;
  tags: string[];
  vitals: {
    bp: string;
    heartRate: string;
    weight: string;
    temperature: string;
  };
  prescriptions: Array<{
    medication: string;
    status: string;
    dosage: string;
    frequency: string;
  }>;
  labRequests: Array<{
    name: string;
    date: string;
    status: string;
  }>;
  upcomingAppointment?: {
    date: string;
    time: string;
    type: string;
  } | null;
}

const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({ medication: '', dosage: '', frequency: '', duration: '' });
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState<string | null>(null);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);

  // Appointment booking state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<Array<{ id: string; startTime: string; endTime: string }>>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Vitals recording state
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({ bp: '', heartRate: '', weight: '', temperature: '' });
  const [vitalsLoading, setVitalsLoading] = useState(false);
  const [vitalsError, setVitalsError] = useState<string | null>(null);
  const [vitalsSuccess, setVitalsSuccess] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Search for patients (empty query returns all)
        const patientsData = await clinicalAPI.searchPatients('').catch(() => []);
        setAllPatients(patientsData || []);
        setPatients(patientsData || []);

        // Check if there's a patient ID in URL params
        const patientIdFromUrl = searchParams.get('id');

        if (patientIdFromUrl && patientsData) {
          // Try to load the specific patient from URL
          await loadPatientDetails(patientIdFromUrl);
        } else if (patientsData && patientsData.length > 0) {
          // Select first patient by default
          await loadPatientDetails(patientsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPatients(allPatients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allPatients.filter(patient =>
      patient.first_name?.toLowerCase().includes(query) ||
      patient.last_name?.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query) ||
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(query)
    );
    setPatients(filtered);
  }, [searchQuery, allPatients]);

  const loadPatientDetails = async (patientId: string) => {
    try {
      // Fetch chart and bookings in parallel
      const [chart, bookings] = await Promise.all([
        clinicalAPI.getPatientChart(patientId).catch(() => null),
        schedulingAPI.getPatientBookings(patientId).catch(() => []),
      ]);

      // Find upcoming appointment (future date, not cancelled)
      let upcomingAppointment = null;
      const now = new Date();
      const futureBookings = (bookings || [])
        .filter((b: any) => {
          const startTime = b.slot?.startTime || b.startTime || b.start_time;
          return startTime && new Date(startTime) > now && b.status !== 'Cancelled';
        })
        .sort((a: any, b: any) => {
          const aTime = a.slot?.startTime || a.startTime || a.start_time;
          const bTime = b.slot?.startTime || b.startTime || b.start_time;
          return new Date(aTime).getTime() - new Date(bTime).getTime();
        });

      if (futureBookings.length > 0) {
        const nextBooking = futureBookings[0];
        const startTime = nextBooking.slot?.startTime || nextBooking.startTime || nextBooking.start_time;
        const bookingDate = new Date(startTime);
        upcomingAppointment = {
          date: bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: bookingDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          type: nextBooking.reasonForVisit || nextBooking.reason_for_visit || 'General Consultation',
        };
      }

      if (chart) {
        // Get prescriptions from all encounters
        const allPrescriptions: any[] = [];
        chart.patient_encounters?.forEach((enc: any) => {
          enc.patient_prescriptions?.forEach((p: any) => {
            allPrescriptions.push({
              medication: p.medication_name || 'Unknown',
              status: 'Active',
              dosage: p.dosage || 'N/A',
              frequency: p.frequency || 'N/A',
            });
          });
        });

        // Get lab orders from encounters
        const labRequests: any[] = [];
        chart.patient_encounters?.forEach((enc: any) => {
          enc.lab_orders?.forEach((l: any) => {
            labRequests.push({
              name: l.lab_test_items?.[0]?.test_name || 'Lab Test',
              date: enc.date ? new Date(enc.date).toLocaleDateString() : 'N/A',
              status: l.status || 'Pending',
            });
          });
        });

        // Get vitals from latest encounter's SOAP notes
        const latestEncounter = chart.patient_encounters?.[0];
        const soapNote = latestEncounter?.patient_notes_soap?.[0];
        const vitals = soapNote?.vitals || {};

        setSelectedPatient({
          id: patientId,
          name: `${chart.users?.first_name || ''} ${chart.users?.last_name || ''}`.trim() || 'Unknown Patient',
          age: chart.dob ? Math.floor((Date.now() - new Date(chart.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined,
          gender: chart.users?.gender,
          patientId: patientId.slice(0, 5),
          tags: chart.patient_allergies?.map((a: any) => a.allergen_name) || [],
          vitals: {
            bp: vitals.bloodPressure || vitals.bp || 'N/A',
            heartRate: vitals.heartRate || vitals.heart_rate || 'N/A',
            weight: vitals.weight || 'N/A',
            temperature: vitals.temperature || 'N/A',
          },
          prescriptions: allPrescriptions,
          labRequests,
          upcomingAppointment,
        });
      } else {
        // Patient exists but has no chart yet - still show basic info with appointments
        const patient = allPatients.find(p => p.id === patientId);
        setSelectedPatient({
          id: patientId,
          name: patient ? `${patient.first_name || ''} ${patient.last_name || ''}`.trim() : 'Unknown Patient',
          patientId: patientId.slice(0, 5),
          tags: [],
          vitals: { bp: 'N/A', heartRate: 'N/A', weight: 'N/A', temperature: 'N/A' },
          prescriptions: [],
          labRequests: [],
          upcomingAppointment,
        });
      }
    } catch (error) {
      console.error('Error loading patient details:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await clinicalAPI.searchPatients(searchQuery);
      setPatients(results || []);
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  const handleCreatePrescription = async () => {
    if (!selectedPatient?.id) return;
    if (!prescriptionForm.medication || !prescriptionForm.dosage || !prescriptionForm.frequency) {
      setPrescriptionError('Please fill in all required fields');
      return;
    }

    setPrescriptionLoading(true);
    setPrescriptionError(null);
    setPrescriptionSuccess(false);

    try {
      // Get patient chart
      const chart = await clinicalAPI.getPatientChart(selectedPatient.id);
      if (!chart?.id) {
        throw new Error('Patient chart not found');
      }

      // Get existing encounters or create a new one
      let encounterId: string;
      const encounters = await clinicalAPI.getChartEncounters(chart.id).catch(() => []);

      // Use the most recent open encounter or create a new one
      const openEncounter = encounters.find((e: any) => e.status === 'Open');
      if (openEncounter) {
        encounterId = openEncounter.id;
      } else {
        // Create a new encounter for this prescription
        const newEncounter = await clinicalAPI.createEncounter({
          chartId: chart.id,
          clinicianId: user?.id,
        });
        encounterId = newEncounter.id;
      }

      // Create the prescription
      await clinicalAPI.createPrescription(encounterId, {
        medicationName: prescriptionForm.medication,
        dosage: prescriptionForm.dosage,
        frequency: prescriptionForm.frequency,
        duration: prescriptionForm.duration || undefined,
      });

      setPrescriptionSuccess(true);
      setPrescriptionForm({ medication: '', dosage: '', frequency: '', duration: '' });

      // Reload patient details to show the new prescription
      await loadPatientDetails(selectedPatient.id);

      // Close modal after a short delay
      setTimeout(() => {
        setShowPrescriptionModal(false);
        setPrescriptionSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating prescription:', error);
      setPrescriptionError(error.response?.data?.message || 'Failed to create prescription. Please try again.');
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // Fetch available slots when date changes
  const fetchAvailableSlots = async (date: string) => {
    if (!user?.id || !date) return;

    setSlotsLoading(true);
    try {
      const slots = await schedulingAPI.getAvailableSlots(user.id, date);
      setAvailableSlots(slots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookingDateChange = (date: string) => {
    setBookingDate(date);
    setSelectedSlot('');
    if (date) {
      fetchAvailableSlots(date);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedPatient?.id || !user?.id || !selectedSlot) {
      setBookingError('Please select a date and time slot');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      await schedulingAPI.createBooking({
        patientId: selectedPatient.id,
        clinicianId: user.id,
        slotId: selectedSlot,
        reasonForVisit: bookingReason || 'General Consultation',
      });

      setBookingSuccess(true);
      setBookingDate('');
      setSelectedSlot('');
      setBookingReason('');
      setAvailableSlots([]);

      // Reload patient details to show the new appointment
      await loadPatientDetails(selectedPatient.id);

      // Close modal after a short delay
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setBookingError(error.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatSlotTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  };

  const handleRecordVitals = async () => {
    if (!selectedPatient?.id || !user?.id) return;
    if (!vitalsForm.bp && !vitalsForm.heartRate && !vitalsForm.weight && !vitalsForm.temperature) {
      setVitalsError('Please enter at least one vital sign');
      return;
    }

    // Validate blood pressure format (e.g., 120/80)
    if (vitalsForm.bp && !/^\d{2,3}\/\d{2,3}$/.test(vitalsForm.bp)) {
      setVitalsError('Blood pressure must be in format like 120/80');
      return;
    }

    // Validate heart rate is a number between 30-220
    if (vitalsForm.heartRate) {
      const hr = parseInt(vitalsForm.heartRate, 10);
      if (isNaN(hr) || hr < 30 || hr > 220) {
        setVitalsError('Heart rate must be a number between 30 and 220');
        return;
      }
    }

    // Validate weight is a positive number
    if (vitalsForm.weight) {
      const weight = parseFloat(vitalsForm.weight);
      if (isNaN(weight) || weight <= 0 || weight > 500) {
        setVitalsError('Weight must be a valid number (1-500 kg)');
        return;
      }
    }

    // Validate temperature is reasonable (35-42°C)
    if (vitalsForm.temperature) {
      const temp = parseFloat(vitalsForm.temperature);
      if (isNaN(temp) || temp < 35 || temp > 42) {
        setVitalsError('Temperature must be between 35 and 42°C');
        return;
      }
    }

    setVitalsLoading(true);
    setVitalsError(null);
    setVitalsSuccess(false);

    try {
      // Get patient chart (or create one)
      let chart = await clinicalAPI.getPatientChart(selectedPatient.id).catch(() => null);
      if (!chart?.id) {
        // Create chart if it doesn't exist
        chart = await clinicalAPI.createPatientChart(selectedPatient.id, { dob: new Date().toISOString() });
      }

      // Get existing encounters or create a new one
      let encounterId: string;
      const encounters = await clinicalAPI.getChartEncounters(chart.id).catch(() => []);

      // Use the most recent open encounter or create a new one
      const openEncounter = encounters.find((e: any) => e.status === 'Open');
      if (openEncounter) {
        encounterId = openEncounter.id;
      } else {
        // Create a new encounter for recording vitals
        const newEncounter = await clinicalAPI.createEncounter({
          chartId: chart.id,
          clinicianId: user.id,
        });
        encounterId = newEncounter.id;
      }

      // Add SOAP notes with vitals
      await clinicalAPI.addSoapNotes(encounterId, {
        subjective: 'Vital signs recorded',
        objective: `BP: ${vitalsForm.bp || 'N/A'}, HR: ${vitalsForm.heartRate || 'N/A'}, Weight: ${vitalsForm.weight || 'N/A'}, Temp: ${vitalsForm.temperature || 'N/A'}`,
        assessment: 'Vitals recorded',
        plan: 'Continue monitoring',
        vitals: {
          bloodPressure: vitalsForm.bp || undefined,
          heartRate: vitalsForm.heartRate || undefined,
          weight: vitalsForm.weight || undefined,
          temperature: vitalsForm.temperature || undefined,
        },
      });

      setVitalsSuccess(true);
      setVitalsForm({ bp: '', heartRate: '', weight: '', temperature: '' });

      // Reload patient details to show the new vitals
      await loadPatientDetails(selectedPatient.id);

      // Close modal after a short delay
      setTimeout(() => {
        setShowVitalsModal(false);
        setVitalsSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error('Error recording vitals:', error);
      setVitalsError(error.response?.data?.message || 'Failed to record vitals. Please try again.');
    } finally {
      setVitalsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
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
          <input
            className="labs-searchInput"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                alt={`${user?.first_name} ${user?.last_name}`}
              />
            </div>

            <div className="labs-userMeta">
              <div className="labs-userName">{user?.first_name} {user?.last_name}</div>
              <div className="labs-userRole">{user?.roles?.name || 'Clinician'}</div>
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
                  <img className="labs-navImg" src="/images/labs.png" alt="" />
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
            </nav>

            <button className="labs-logout" type="button" onClick={() => { logout(); navigate('/clinician/signin'); }}>
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
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div className="appointments-list">
                  {loading ? (
                    <p style={{ padding: '20px', textAlign: 'center' }}>Loading patients...</p>
                  ) : patients.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No patients found</p>
                  ) : (
                    patients.map((patient, index) => (
                      <div
                        key={patient.id}
                        className={`appointment-card ${selectedPatient?.id === patient.id ? 'first' : ''}`}
                        onClick={() => loadPatientDetails(patient.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src="/images/avatar.png" alt={`${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Patient'} className="patient-avatar" />

                        <div className="appointment-info">
                          <h3>{`${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown Patient'}</h3>
                          <p className="patient-id">ID: {patient.id?.slice(0, 5) || 'N/A'}</p>
                          <p className="next-appt">{patient.email || 'No email'}</p>
                        </div>

                        <div className="appointment-status">
                          <p className="status-label">Status:</p>
                          <span className="status-text-complete">Active</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Patient Details */}
            <div className="patient-details-wrapper">
              <div className="patient-details-topbar">
                <button className="schedule-appointment-btn" type="button" onClick={() => setShowBookingModal(true)}>
                  Schedule Appointment
                </button>
              </div>
              
              <div className="patient-details-section">
                {selectedPatient ? (
                  <>
                    <div className="patient-header">
                      <img src="/images/avatar.png" alt={selectedPatient.name} className="patient-avatar-large" />
                      <div className="patient-header-info">
                        <h2>{selectedPatient.name}</h2>
                        <p className="patient-meta">
                          {selectedPatient.age ? `${selectedPatient.age} years` : ''}
                          {selectedPatient.gender ? ` · ${selectedPatient.gender}` : ''}
                          {` · ID: ${selectedPatient.patientId}`}
                        </p>
                        <div className="patient-tags">
                          {selectedPatient.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className={`tag ${i === 0 ? 'tag-purple' : 'tag-green'}`}>{tag}</span>
                          ))}
                          {selectedPatient.tags.length === 0 && (
                            <span className="tag tag-purple">No allergies</span>
                          )}
                        </div>
                      </div>
                      <div className="patient-actions" style={{ position: 'relative' }}>
                        <button className="icon-btn" onClick={() => navigate('/clinician/profile')} title="View patient profile">
                          <img src="/images/edit-icon.png" alt="Edit" className="action-icon" />
                        </button>
                        <button className="icon-btn" onClick={() => setShowMoreOptions(!showMoreOptions)} title="More options">
                          <img src="/images/more-icon.png" alt="More" className="action-icon" />
                        </button>
                        {showMoreOptions && (
                          <div className="more-options-dropdown">
                            <button onClick={() => { setShowMoreOptions(false); navigate('/clinician/labs'); }}>View Lab Results</button>
                            <button onClick={() => { setShowMoreOptions(false); navigate('/clinician/appointments'); }}>View Appointments</button>
                            <button onClick={() => { setShowMoreOptions(false); setShowPrescriptionModal(true); }}>Add Prescription</button>
                          </div>
                        )}
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
                          <button className="history-link" onClick={() => navigate('/clinician/appointments')}>History</button>
                        </div>

                        <div className="appointment-detail-card">
                          {selectedPatient.upcomingAppointment ? (
                            <>
                              <h4>{selectedPatient.upcomingAppointment.type}</h4>
                              <div className="appointment-datetime">
                                <span className="date-badge">{selectedPatient.upcomingAppointment.date}</span>
                                <span className="time-text">{selectedPatient.upcomingAppointment.time}</span>
                              </div>
                              <div className="appointment-actions">
                                <button className="btn-primary" onClick={() => navigate('/clinician/appointments')}>View Details</button>
                              </div>
                            </>
                          ) : (
                            <>
                              <h4>No Upcoming Appointment</h4>
                              <div className="appointment-datetime">
                                <span className="date-badge">Not Scheduled</span>
                                <span className="time-text">Schedule a new appointment</span>
                              </div>
                              <div className="appointment-actions">
                                <button className="btn-primary" onClick={() => navigate('/clinician/appointments')}>Schedule</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Last Vitals */}
                      <div className="info-card vitals-card">
                        <div className="card-header">
                          <span className="card-title-text">Last Vitals</span>
                          <button className="add-new-link" onClick={() => setShowVitalsModal(true)}>+ Record New</button>
                        </div>

                        <div className="vitals-grid">
                          <div className="vital-item">
                            <div className="vital-label">BP</div>
                            <div className="vital-value">{selectedPatient.vitals.bp}</div>
                            <div className="vital-unit">mmHg</div>
                          </div>
                          <div className="vital-item">
                            <div className="vital-label">Heart Rate</div>
                            <div className="vital-value">{selectedPatient.vitals.heartRate}</div>
                            <div className="vital-unit">bpm</div>
                          </div>
                          <div className="vital-item">
                            <div className="vital-label">Weight</div>
                            <div className="vital-value">{selectedPatient.vitals.weight}</div>
                            <div className="vital-unit">kg</div>
                          </div>
                          <div className="vital-item">
                            <div className="vital-label">Temperature</div>
                            <div className="vital-value">{selectedPatient.vitals.temperature}</div>
                            <div className="vital-unit">°C</div>
                          </div>
                        </div>
                      </div>

                      {/* Active Prescriptions */}
                      <div className="info-card prescriptions-card">
                        <div className="card-header">
                          <span className="card-title-text">Active Prescriptions</span>
                          <button className="add-new-link" onClick={() => setShowPrescriptionModal(true)}>+ Add New</button>
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
                            {selectedPatient.prescriptions.length > 0 ? (
                              selectedPatient.prescriptions.map((p, i) => (
                                <tr key={i}>
                                  <td>{p.medication}</td>
                                  <td><span className="status-badge-small active">{p.status}</span></td>
                                  <td>{p.dosage}</td>
                                  <td>{p.frequency}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: '#666' }}>No prescriptions</td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        <button className="view-all-link" onClick={() => setShowAllPrescriptions(!showAllPrescriptions)}>
                          {showAllPrescriptions ? 'Show Less' : 'View All'}
                        </button>
                      </div>

                      {/* Recent Lab Requests */}
                      <div className="info-card lab-requests-card">
                        <h3 className="card-title-cyan">Recent Lab Requests</h3>

                        {selectedPatient.labRequests.length > 0 ? (
                          selectedPatient.labRequests.map((lab, i) => (
                            <div key={i} className="lab-request-item">
                              <div className="lab-request-info">
                                <h4>{lab.name}</h4>
                                <p className="lab-request-date">Requested: {lab.date}</p>
                              </div>
                              <span className={`status-badge-small ${lab.status.toLowerCase()}`}>{lab.status}</span>
                            </div>
                          ))
                        ) : (
                          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No lab requests</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    <p>Select a patient to view details</p>
                  </div>
                )}
            </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Prescription Modal */}
      {showPrescriptionModal && (
        <div className="patients-modal-overlay" onClick={() => !prescriptionLoading && setShowPrescriptionModal(false)}>
          <div className="patients-modal" onClick={(e) => e.stopPropagation()}>
            <div className="patients-modal-header">
              <h2>Add New Prescription</h2>
              <button className="patients-modal-close" onClick={() => !prescriptionLoading && setShowPrescriptionModal(false)} disabled={prescriptionLoading}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="patients-modal-body">
              {prescriptionSuccess && (
                <div style={{ padding: '12px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
                  Prescription added successfully!
                </div>
              )}
              {prescriptionError && (
                <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px' }}>
                  {prescriptionError}
                </div>
              )}
              <div className="patients-form-group">
                <label>Medication Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Ibuprofen"
                  value={prescriptionForm.medication}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medication: e.target.value })}
                  className="patients-input"
                  disabled={prescriptionLoading}
                />
              </div>
              <div className="patients-form-group">
                <label>Dosage *</label>
                <input
                  type="text"
                  placeholder="e.g., 400mg"
                  value={prescriptionForm.dosage}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                  className="patients-input"
                  disabled={prescriptionLoading}
                />
              </div>
              <div className="patients-form-group">
                <label>Frequency *</label>
                <input
                  type="text"
                  placeholder="e.g., Every 6 hours"
                  value={prescriptionForm.frequency}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })}
                  className="patients-input"
                  disabled={prescriptionLoading}
                />
              </div>
              <div className="patients-form-group">
                <label>Duration (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., 7 days"
                  value={prescriptionForm.duration}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })}
                  className="patients-input"
                  disabled={prescriptionLoading}
                />
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px' }}>
                Patient: <strong>{selectedPatient?.name}</strong>
              </p>
            </div>
            <div className="patients-modal-footer">
              <button className="patients-btn-outline" onClick={() => setShowPrescriptionModal(false)} disabled={prescriptionLoading}>
                Cancel
              </button>
              <button
                className="patients-btn-primary"
                onClick={handleCreatePrescription}
                disabled={prescriptionLoading}
              >
                {prescriptionLoading ? 'Adding...' : 'Add Prescription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Vitals Modal */}
      {showVitalsModal && (
        <div className="patients-modal-overlay" onClick={() => !vitalsLoading && setShowVitalsModal(false)}>
          <div className="patients-modal" onClick={(e) => e.stopPropagation()}>
            <div className="patients-modal-header">
              <h2>Record Vitals</h2>
              <button className="patients-modal-close" onClick={() => !vitalsLoading && setShowVitalsModal(false)} disabled={vitalsLoading}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="patients-modal-body">
              {vitalsSuccess && (
                <div style={{ padding: '12px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
                  Vitals recorded successfully!
                </div>
              )}
              {vitalsError && (
                <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px' }}>
                  {vitalsError}
                </div>
              )}
              <div className="patients-form-group">
                <label>Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  placeholder="e.g., 120/80"
                  value={vitalsForm.bp}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, bp: e.target.value })}
                  className="patients-input"
                  disabled={vitalsLoading}
                />
              </div>
              <div className="patients-form-group">
                <label>Heart Rate (bpm)</label>
                <input
                  type="text"
                  placeholder="e.g., 72"
                  value={vitalsForm.heartRate}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })}
                  className="patients-input"
                  disabled={vitalsLoading}
                />
              </div>
              <div className="patients-form-group">
                <label>Weight (kg)</label>
                <input
                  type="text"
                  placeholder="e.g., 70"
                  value={vitalsForm.weight}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })}
                  className="patients-input"
                  disabled={vitalsLoading}
                />
              </div>
              <div className="patients-form-group">
                <label>Temperature (°C)</label>
                <input
                  type="text"
                  placeholder="e.g., 36.5"
                  value={vitalsForm.temperature}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
                  className="patients-input"
                  disabled={vitalsLoading}
                />
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px' }}>
                Patient: <strong>{selectedPatient?.name}</strong>
              </p>
            </div>
            <div className="patients-modal-footer">
              <button className="patients-btn-outline" onClick={() => setShowVitalsModal(false)} disabled={vitalsLoading}>
                Cancel
              </button>
              <button
                className="patients-btn-primary"
                onClick={handleRecordVitals}
                disabled={vitalsLoading}
              >
                {vitalsLoading ? 'Saving...' : 'Save Vitals'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookingModal && (
        <div className="patients-modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="patients-modal" onClick={(e) => e.stopPropagation()}>
            <div className="patients-modal-header">
              <h2>Schedule Appointment</h2>
              <button className="patients-modal-close" onClick={() => setShowBookingModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="patients-modal-body">
              {bookingError && (
                <div className="patients-error-message" style={{ marginBottom: '16px', padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px' }}>
                  {bookingError}
                </div>
              )}
              {bookingSuccess && (
                <div className="patients-success-message" style={{ marginBottom: '16px', padding: '10px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '6px' }}>
                  Appointment scheduled successfully!
                </div>
              )}
              <div className="patients-form-group">
                <label>Select Date *</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => handleBookingDateChange(e.target.value)}
                  className="patients-input"
                  min={new Date().toISOString().split('T')[0]}
                  disabled={bookingLoading}
                />
              </div>
              <div className="patients-form-group">
                <label>Available Time Slots *</label>
                {slotsLoading ? (
                  <p style={{ color: '#6b7280' }}>Loading available slots...</p>
                ) : availableSlots.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {availableSlots.map((slot) => (
                      <label
                        key={slot.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px',
                          border: selectedSlot === slot.id ? '2px solid #03A5FF' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: selectedSlot === slot.id ? '#f0f9ff' : '#fff',
                        }}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.id}
                          checked={selectedSlot === slot.id}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                          disabled={bookingLoading}
                        />
                        <span>{formatSlotTime(slot.startTime, slot.endTime)}</span>
                      </label>
                    ))}
                  </div>
                ) : bookingDate ? (
                  <p style={{ color: '#6b7280' }}>No available slots for this date. Please select another date.</p>
                ) : (
                  <p style={{ color: '#6b7280' }}>Please select a date to see available slots.</p>
                )}
              </div>
              <div className="patients-form-group">
                <label>Reason for Visit</label>
                <input
                  type="text"
                  placeholder="e.g., General Checkup, Follow-up"
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  className="patients-input"
                  disabled={bookingLoading}
                />
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px' }}>
                Patient: <strong>{selectedPatient?.name}</strong>
              </p>
            </div>
            <div className="patients-modal-footer">
              <button className="patients-btn-outline" onClick={() => setShowBookingModal(false)} disabled={bookingLoading}>
                Cancel
              </button>
              <button
                className="patients-btn-primary"
                onClick={handleCreateBooking}
                disabled={bookingLoading || !selectedSlot}
              >
                {bookingLoading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;