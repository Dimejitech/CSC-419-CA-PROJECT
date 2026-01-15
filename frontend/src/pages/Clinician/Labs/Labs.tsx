import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Labs.css";
import { labAPI, clinicalAPI } from "../../../services/api";
import { useAuth } from "../../../context";

// Available lab test types
const LAB_TEST_TYPES = [
  'Complete Blood Count',
  'Basic Metabolic Panel',
  'Comprehensive Metabolic Panel',
  'Lipid Panel',
  'Thyroid Panel',
  'Liver Function Tests',
  'Hemoglobin A1C',
  'Urinalysis',
  'Coagulation Panel',
  'Cardiac Enzymes',
];

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type LabResult = {
  id: string;
  testName: string;
  resultValue: string | null;
  abnormalityFlag: string | null;
  isVerified: boolean;
};

type LabRow = {
  labId: string;
  orderId: string; // Real UUID for API calls
  testName: string;
  patient: string;
  patientId: string; // Patient UUID for navigation
  status: "Stable" | "Urgent" | "Pending";
  lastVisit: string;
  isVerified?: boolean;
  results?: LabResult[]; // Lab results for this order
};

interface LabStats {
  pending: number;
  urgent: number;
  completedToday: number;
}

function StatusPill({ status }: { status: LabRow["status"] }) {
  return (
    <span className={`labs-pill labs-pill--${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

function LabsTable({ title, rows, onReview, onViewAll, isExpanded }: { title: string; rows: LabRow[]; onReview?: (labId: string) => void; onViewAll?: () => void; isExpanded?: boolean }) {
  return (
    <div className="labs-tableCard">
      <div className="labs-tableCardHeader">
        <h3>{title}</h3>
      </div>

      <div className="labs-tableWrap">
        <table className="labs-table">
          <thead>
            <tr>
              <th>Lab ID</th>
              <th>Test Name</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Last Visit</th>
              <th className="labs-thRight">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={`${title}-${r.labId}-${r.testName}`}>
                <td className="labs-tdMuted">{r.labId}</td>

                <td className="labs-tdMuted">
                  {r.testName === "Complete Blood Count" ? (
                    <span className="labs-wrap2">
                      Complete Blood <br />
                      Count
                    </span>
                  ) : (
                    r.testName
                  )}
                </td>

                <td className="labs-tdMuted">{r.patient}</td>

                <td>
                  <StatusPill status={r.status} />
                </td>

                <td className="labs-tdMuted">{r.lastVisit}</td>

                <td className="labs-tdRight">
                  <button className="labs-linkBtn" type="button" onClick={() => onReview?.(r.labId)}>
                    Review Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="labs-viewAllRow">
        <button className="labs-viewAll" type="button" onClick={onViewAll}>
          {isExpanded ? 'Show Less' : 'View All'}
        </button>
      </div>
    </div>
  );
}




function StatCard({
  variant,
  title,
  value,
}: {
  variant: "orange" | "red" | "green";
  title: string;
  value: number;
}) {
  return (
    <div className={`labs-stat labs-stat--${variant}`}>
      <div className="labs-statIcon" aria-hidden="true">
        {variant === "orange" && (
          <img
            src="/images/timer.png"
            alt=""
            className="labs-statImage"
          />
        )}

        {variant === "red" && (
          <img
            src="/images/alarm.png"
            alt=""
            className="labs-statImage"
          />
        )}

        {variant === "green" && (
          <img
            src="/images/check-circle.png"
            alt=""
            className="labs-statImage"
          />
        )}
      </div>

      <div className="labs-statText">
        <div className="labs-statTitle">{title}</div>
        <div className="labs-statValue">{value}</div>
      </div>
    </div>
  );
}


export default function Labs() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pendingLabs, setPendingLabs] = useState<LabRow[]>([]);
  const [finishedLabs, setFinishedLabs] = useState<LabRow[]>([]);
  const [stats, setStats] = useState<LabStats>({ pending: 0, urgent: 0, completedToday: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState<LabRow | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllFinished, setShowAllFinished] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Lab Request Form State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState<string>('Routine');
  const [labNotes, setLabNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter labs based on search query
  const filteredPendingLabs = pendingLabs.filter(lab =>
    !searchQuery ||
    lab.labId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFinishedLabs = finishedLabs.filter(lab =>
    !searchQuery ||
    lab.labId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchLabData = useCallback(async () => {
    try {
      // Fetch lab orders with different statuses
      const [pendingOrders, completedOrders, labStats] = await Promise.all([
        labAPI.getOrders({ status: 'Pending' }).catch(() => []),
        labAPI.getOrders({ status: 'Completed' }).catch(() => []),
        labAPI.getLabStats().catch(() => ({ pending: 0, urgent: 0, completedToday: 0 })),
      ]);

      // Transform pending orders to LabRow format
      const pendingRows: LabRow[] = (pendingOrders || []).map((order: any) => ({
        labId: `LP-${order.id?.slice(0, 4) || '0000'}`,
        orderId: order.id,
        testName: order.testItems?.[0]?.testName || 'Lab Test',
        patient: order.chart?.patient
          ? `${order.chart.patient.first_name || ''} ${order.chart.patient.last_name || ''}`.trim() || 'Unknown Patient'
          : 'Unknown Patient',
        patientId: order.chart?.patient?.id || '',
        status: order.priority === 'STAT' ? 'Urgent' : 'Pending',
        lastVisit: order.createdAt && !isNaN(new Date(order.createdAt).getTime())
          ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'N/A',
        isVerified: false,
        results: (order.results || []).map((r: any) => ({
          id: r.id,
          testName: r.testName,
          resultValue: r.resultValue,
          abnormalityFlag: r.abnormalityFlag,
          isVerified: r.isVerified || false,
        })),
      }));

      // Transform completed orders to LabRow format
      const completedRows: LabRow[] = (completedOrders || []).map((order: any) => ({
        labId: `LP-${order.id?.slice(0, 4) || '0000'}`,
        orderId: order.id,
        testName: order.testItems?.[0]?.testName || 'Lab Test',
        patient: order.chart?.patient
          ? `${order.chart.patient.first_name || ''} ${order.chart.patient.last_name || ''}`.trim() || 'Unknown Patient'
          : 'Unknown Patient',
        patientId: order.chart?.patient?.id || '',
        status: 'Stable',
        lastVisit: order.completedAt && !isNaN(new Date(order.completedAt).getTime())
          ? new Date(order.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'N/A',
        isVerified: order.isVerified || false,
        results: (order.results || []).map((r: any) => ({
          id: r.id,
          testName: r.testName,
          resultValue: r.resultValue,
          abnormalityFlag: r.abnormalityFlag,
          isVerified: r.isVerified || false,
        })),
      }));

      setPendingLabs(pendingRows);
      setFinishedLabs(completedRows);
      setStats(labStats || { pending: 0, urgent: 0, completedToday: 0 });
    } catch (error) {
      console.error('Error fetching lab data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabData();
  }, [fetchLabData]);

  // Fetch patients when modal opens
  useEffect(() => {
    if (showRequestModal) {
      clinicalAPI.searchPatients('').then(setPatients).catch(() => setPatients([]));
    }
  }, [showRequestModal]);

  // Filter patients based on search
  const filteredPatients = patients.filter(p =>
    patientSearch === '' ||
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleTestToggle = (testName: string) => {
    setSelectedTests(prev =>
      prev.includes(testName)
        ? prev.filter(t => t !== testName)
        : [...prev, testName]
    );
  };

  const handleSubmitLabRequest = async () => {
    if (!selectedPatient) {
      setSubmitMessage({ type: 'error', text: 'Please select a patient' });
      return;
    }
    if (selectedTests.length === 0) {
      setSubmitMessage({ type: 'error', text: 'Please select at least one test' });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      await labAPI.createOrderForPatient({
        patientId: selectedPatient.id,
        testNames: selectedTests,
        priority,
        notes: labNotes,
      });

      setSubmitMessage({ type: 'success', text: 'Lab order created successfully!' });

      // Reset form and close after delay
      setTimeout(() => {
        setShowRequestModal(false);
        setSelectedPatient(null);
        setSelectedTests([]);
        setPriority('Routine');
        setLabNotes('');
        setPatientSearch('');
        setSubmitMessage(null);
        // Refresh lab data
        fetchLabData();
      }, 1500);
    } catch (error) {
      console.error('Error creating lab order:', error);
      setSubmitMessage({ type: 'error', text: 'Failed to create lab order. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleVerifyResult = async () => {
    if (!selectedLab?.orderId) return;

    // Find unverified results to verify
    const unverifiedResults = selectedLab.results?.filter(r => !r.isVerified) || [];

    if (unverifiedResults.length === 0) {
      setVerifyMessage({ type: 'error', text: 'No results to verify or all results already verified.' });
      return;
    }

    setVerifying(true);
    setVerifyMessage(null);

    try {
      // Verify all unverified results
      for (const result of unverifiedResults) {
        await labAPI.verifyResult(result.id);
      }

      setVerifyMessage({ type: 'success', text: 'Lab result verified successfully!' });

      // Update the lab in the list to show as verified
      if (selectedLab.status === 'Pending' || selectedLab.status === 'Urgent') {
        setPendingLabs(prev => prev.filter(lab => lab.orderId !== selectedLab.orderId));
        setFinishedLabs(prev => [...prev, { ...selectedLab, status: 'Stable', isVerified: true }]);
      } else {
        setFinishedLabs(prev => prev.map(lab =>
          lab.orderId === selectedLab.orderId ? { ...lab, isVerified: true } : lab
        ));
      }

      // Close modal after short delay
      setTimeout(() => {
        setSelectedLab(null);
        setVerifyMessage(null);
      }, 1500);
    } catch (error) {
      console.error('Error verifying lab result:', error);
      setVerifyMessage({ type: 'error', text: 'Failed to verify lab result. Please try again.' });
    } finally {
      setVerifying(false);
    }
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
            placeholder="Search labs, patients, tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="labs-topRight">
          {/* UPDATED: notification bell image (no import) */}
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

      <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/patients')}>
        <span className="labs-navItemIcon">
          <img className="labs-navImg" src="/images/patients.png" alt="" />
        </span>
        Patients
      </button>

      <button className="labs-navItem labs-navItem--active" type="button">
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
          <div className="labs-contentTop">
            <h1 className="labs-title">Labs</h1>

            <button className="labs-primaryBtn" type="button" onClick={() => setShowRequestModal(true)}>
              Request New Lab
            </button>
          </div>

          <div className="labs-statsRow">
            <StatCard variant="orange" title="Pending Results" value={stats.pending || pendingLabs.length} />
            <StatCard variant="red" title="Urgent / STAT" value={stats.urgent || pendingLabs.filter(l => l.status === 'Urgent').length} />
            <StatCard variant="green" title="Completed Today" value={stats.completedToday || finishedLabs.length} />
          </div>

          <div className="labs-tables">
            <LabsTable
              title="Pending Labs"
              rows={showAllPending ? filteredPendingLabs : filteredPendingLabs.slice(0, 5)}
              onReview={(labId) => {
                const lab = pendingLabs.find(l => l.labId === labId);
                if (lab) {
                  setVerifyMessage(null); // Clear any previous message
                  setSelectedLab(lab);
                }
              }}
              onViewAll={() => setShowAllPending(!showAllPending)}
              isExpanded={showAllPending}
            />
            <LabsTable
              title="Finished Labs"
              rows={showAllFinished ? filteredFinishedLabs : filteredFinishedLabs.slice(0, 5)}
              onReview={(labId) => {
                const lab = finishedLabs.find(l => l.labId === labId);
                if (lab) {
                  setVerifyMessage(null); // Clear any previous message
                  setSelectedLab(lab);
                }
              }}
              onViewAll={() => setShowAllFinished(!showAllFinished)}
              isExpanded={showAllFinished}
            />
          </div>
        </main>
      </div>

      {/* Lab Review Modal */}
      {selectedLab && (
        <div className="labs-modal-overlay" onClick={() => setSelectedLab(null)}>
          <div className="labs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="labs-modal-header">
              <h2>Lab Report Details</h2>
              <button className="labs-modal-close" onClick={() => setSelectedLab(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="labs-modal-body">
              <div className="labs-modal-row">
                <span className="labs-modal-label">Lab ID:</span>
                <span className="labs-modal-value">{selectedLab.labId}</span>
              </div>
              <div className="labs-modal-row">
                <span className="labs-modal-label">Test Name:</span>
                <span className="labs-modal-value">{selectedLab.testName}</span>
              </div>
              <div className="labs-modal-row">
                <span className="labs-modal-label">Patient:</span>
                <span className="labs-modal-value">{selectedLab.patient}</span>
              </div>
              <div className="labs-modal-row">
                <span className="labs-modal-label">Status:</span>
                <StatusPill status={selectedLab.status} />
              </div>
              <div className="labs-modal-row">
                <span className="labs-modal-label">Date:</span>
                <span className="labs-modal-value">{selectedLab.lastVisit}</span>
              </div>

              {/* Lab Results Section */}
              {selectedLab.results && selectedLab.results.length > 0 ? (
                <div className="labs-results-section">
                  <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>Test Results</h3>
                  {selectedLab.results.map((result, index) => (
                    <div key={result.id || index} className="labs-modal-row" style={{ background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>{result.testName}</div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                          <span><strong>Result:</strong> {result.resultValue || 'Pending'}</span>
                          {result.abnormalityFlag && (
                            <span style={{ color: result.abnormalityFlag === 'Normal' ? '#10b981' : '#ef4444' }}>
                              <strong>Flag:</strong> {result.abnormalityFlag}
                            </span>
                          )}
                          <span style={{ color: result.isVerified ? '#10b981' : '#f59e0b' }}>
                            {result.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '6px', textAlign: 'center', color: '#6b7280' }}>
                  No results available yet
                </div>
              )}
            </div>
            {verifyMessage && (
              <div className={`labs-verify-message labs-verify-message--${verifyMessage.type}`}>
                {verifyMessage.text}
              </div>
            )}
            <div className="labs-modal-footer">
              <button className="labs-btn-outline" onClick={() => setSelectedLab(null)}>Close</button>
              {/* Only show verify button if there are unverified results with values */}
              {selectedLab.results && selectedLab.results.some(r => !r.isVerified && r.resultValue) && (
                <button
                  className="labs-btn-verify"
                  onClick={handleVerifyResult}
                  disabled={verifying}
                >
                  {verifying ? 'Verifying...' : 'Verify Result'}
                </button>
              )}
              <button className="labs-btn-primary" onClick={() => { setSelectedLab(null); navigate(`/clinician/patients?id=${selectedLab?.patientId}`); }}>
                View Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request New Lab Modal */}
      {showRequestModal && (
        <div className="labs-modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="labs-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="labs-modal-header">
              <h2>Request New Lab Test</h2>
              <button className="labs-modal-close" onClick={() => setShowRequestModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="labs-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {/* Patient Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
                  Select Patient *
                </label>
                {selectedPatient ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                    <span style={{ fontWeight: 500, color: '#166534' }}>
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </span>
                    <button
                      onClick={() => setSelectedPatient(null)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    />
                    <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                      {filteredPatients.length > 0 ? (
                        filteredPatients.slice(0, 10).map(patient => (
                          <div
                            key={patient.id}
                            onClick={() => { setSelectedPatient(patient); setPatientSearch(''); }}
                            style={{
                              padding: '10px 12px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f3f4f6',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <div style={{ fontWeight: 500 }}>{patient.first_name} {patient.last_name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{patient.email}</div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                          No patients found
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Test Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
                  Select Tests * <span style={{ fontWeight: 400, color: '#6b7280' }}>({selectedTests.length} selected)</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {LAB_TEST_TYPES.map(test => (
                    <label
                      key={test}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        border: `1px solid ${selectedTests.includes(test) ? '#03A5FF' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: selectedTests.includes(test) ? '#f0f9ff' : '#fff',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test)}
                        onChange={() => handleTestToggle(test)}
                        style={{ accentColor: '#03A5FF' }}
                      />
                      <span style={{ fontSize: '13px', color: '#374151' }}>{test}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
                  Priority
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['Routine', 'Urgent', 'STAT'].map(p => (
                    <label
                      key={p}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        border: `1px solid ${priority === p ? (p === 'STAT' ? '#ef4444' : p === 'Urgent' ? '#f59e0b' : '#03A5FF') : '#e5e7eb'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: priority === p ? (p === 'STAT' ? '#fef2f2' : p === 'Urgent' ? '#fffbeb' : '#f0f9ff') : '#fff',
                      }}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={priority === p}
                        onChange={() => setPriority(p)}
                        style={{ accentColor: p === 'STAT' ? '#ef4444' : p === 'Urgent' ? '#f59e0b' : '#03A5FF' }}
                      />
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: p === 'STAT' ? '#dc2626' : p === 'Urgent' ? '#d97706' : '#374151'
                      }}>
                        {p}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
                  Additional Notes
                </label>
                <textarea
                  placeholder="Add any special instructions or notes..."
                  value={labNotes}
                  onChange={(e) => setLabNotes(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            {submitMessage && (
              <div style={{
                padding: '12px 24px',
                background: submitMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                color: submitMessage.type === 'success' ? '#166534' : '#dc2626',
                fontSize: '14px',
              }}>
                {submitMessage.text}
              </div>
            )}

            <div className="labs-modal-footer">
              <button className="labs-btn-outline" onClick={() => setShowRequestModal(false)}>
                Cancel
              </button>
              <button
                className="labs-btn-primary"
                onClick={handleSubmitLabRequest}
                disabled={submitting || !selectedPatient || selectedTests.length === 0}
                style={{ opacity: (submitting || !selectedPatient || selectedTests.length === 0) ? 0.6 : 1 }}
              >
                {submitting ? 'Submitting...' : 'Submit Lab Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
