import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard/Dashboard.css';
import './Results.css';

interface Result {
  id: string;
  patientName: string;
  test: string;
  resultStatus: 'Abnormal' | 'Normal';
  reviewedByClinician: boolean;
  dateSubmitted: string;
  action: string;
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsStatusFilter, setResultsStatusFilter] = useState('All');
  const [clinicianReviewFilter, setClinicianReviewFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Oct 24 - Oct 25, 2025');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock user data
  const user = {
    name: 'Peter Parker',
    role: 'Lab Technician',
    avatar: '/images/avatar.png',
  };

  // Mock results data
  const results: Result[] = [
    {
      id: '1',
      patientName: 'John Doe',
      test: 'Complete Blood Count',
      resultStatus: 'Abnormal',
      reviewedByClinician: true,
      dateSubmitted: 'Oct 25, 09:15AM',
      action: 'View Result',
    },
    {
      id: '2',
      patientName: 'John Doe',
      test: 'Complete Blood Count',
      resultStatus: 'Normal',
      reviewedByClinician: false,
      dateSubmitted: 'Oct 25, 09:15AM',
      action: 'View Result',
    },
    {
      id: '3',
      patientName: 'John Doe',
      test: 'Complete Blood Count',
      resultStatus: 'Normal',
      reviewedByClinician: true,
      dateSubmitted: 'Oct 25, 09:15AM',
      action: 'View Result',
    },
    {
      id: '4',
      patientName: 'John Doe',
      test: 'Complete Blood Count',
      resultStatus: 'Normal',
      reviewedByClinician: true,
      dateSubmitted: 'Oct 25, 09:15AM',
      action: 'View Result',
    },
    {
      id: '5',
      patientName: 'John Doe',
      test: 'Complete Blood Count',
      resultStatus: 'Abnormal',
      reviewedByClinician: false,
      dateSubmitted: 'Oct 25, 09:15AM',
      action: 'View Result',
    },
    {
      id: '6',
      patientName: 'John Doe',
      test: 'Complete Blood Count',
      resultStatus: 'Abnormal',
      reviewedByClinician: false,
      dateSubmitted: 'Oct 25, 09:15AM',
      action: 'View Result',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/technician/signin');
  };

  const resetFilters = () => {
    setResultsStatusFilter('All');
    setClinicianReviewFilter('All');
    setDateRange('Oct 24 - Oct 25, 2025');
  };

  const exportCSV = () => {
    // Mock CSV export function
    alert('Exporting results to CSV...');
  };

  return (
    <div className="tech-dashboard-container">
      {/* Header */}
      <header className="tech-header">
        <div className="tech-header-left">
          <img src="/images/citycare-logo-icon.png" alt="CityCare" className="tech-logo-icon" />
          <span className="tech-logo-text">CityCare</span>
        </div>

        <div className="tech-header-center">
          <div className="tech-search-bar">
            <span className="tech-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="tech-header-right">
          <button className="tech-notification-btn">
            <span className="tech-bell-icon">🔔</span>
            <span className="tech-notification-badge">2</span>
          </button>
          <div className="tech-user-profile">
            <img src={user.avatar} alt={user.name} className="tech-user-avatar" />
            <div className="tech-user-info">
              <span className="tech-user-name">{user.name}</span>
              <span className="tech-user-role">{user.role}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="tech-layout">
        {/* Sidebar */}
        <aside className="tech-sidebar">
          <div className="tech-sidebar-header">
            <h3 className="tech-nav-title">Navigation</h3>
          </div>

          <nav className="tech-nav">
            <div className="tech-nav-section">
              <h4 className="tech-nav-section-title">Main</h4>
              <button className="tech-nav-item" onClick={() => navigate('/technician/dashboard')}>
                <span className="tech-nav-icon">🏠</span>
                <span className="tech-nav-label">Home</span>
              </button>
              <button className="tech-nav-item" onClick={() => navigate('/technician/lab-orders')}>
                <span className="tech-nav-icon">📋</span>
                <span className="tech-nav-label">Lab Orders</span>
              </button>
              <button className="tech-nav-item active" onClick={() => navigate('/technician/results')}>
                <span className="tech-nav-icon">📊</span>
                <span className="tech-nav-label">Results</span>
              </button>
            </div>

            <div className="tech-nav-section">
              <h4 className="tech-nav-section-title">Secondary</h4>
              <button className="tech-nav-item" onClick={() => navigate('/technician/profile')}>
                <span className="tech-nav-icon">👤</span>
                <span className="tech-nav-label">Profile</span>
              </button>
              <button className="tech-nav-item" >
                <span className="tech-nav-icon">❓</span>
                <span className="tech-nav-label">Help / Support</span>
              </button>
            </div>
          </nav>

          <button className="tech-logout-btn" onClick={handleLogout}>
            <span className="tech-logout-icon">🚪</span>
            <span className="tech-logout-label">Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="tech-main-content">
          <div className="results-header">
            <div>
              <h1 className="tech-page-title">Results</h1>
              <p className="tech-page-subtitle">
                Review laboratory results across all departments.
              </p>
            </div>
            <button className="results-export-btn" onClick={exportCSV}>
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="lab-filters-section">
            <div className="lab-filter-group">
              <label className="lab-filter-label">Results Status</label>
              <select
                className="lab-filter-select"
                value={resultsStatusFilter}
                onChange={(e) => setResultsStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Normal</option>
                <option>Abnormal</option>
                <option>Critical</option>
              </select>
            </div>

            <div className="lab-filter-group">
              <label className="lab-filter-label">Clinician Review</label>
              <select
                className="lab-filter-select"
                value={clinicianReviewFilter}
                onChange={(e) => setClinicianReviewFilter(e.target.value)}
              >
                <option>All</option>
                <option>Yes</option>
                <option>No</option>
                <option>Pending</option>
              </select>
            </div>

            <div className="lab-filter-group">
              <label className="lab-filter-label">Date Range</label>
              <div className="lab-date-picker">
                <span className="lab-calendar-icon">📅</span>
                <input
                  type="text"
                  className="lab-date-input"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <button className="lab-reset-btn" onClick={resetFilters}>
              🔄 Reset Filters
            </button>
          </div>

          {/* Results Table */}
          <div className="tech-orders-section">
            <div className="tech-table-container">
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Test</th>
                    <th>Result Status</th>
                    <th>Reviewed By Clinician</th>
                    <th>Date Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td>{result.patientName}</td>
                      <td>{result.test}</td>
                      <td>
                        <span
                          className={`results-status-badge ${
                            result.resultStatus === 'Abnormal' ? 'abnormal' : 'normal'
                          }`}
                        >
                          {result.resultStatus}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`results-review-badge ${
                            result.reviewedByClinician ? 'yes' : 'no'
                          }`}
                        >
                          {result.reviewedByClinician ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>{result.dateSubmitted}</td>
                      <td>
                        <button className="tech-action-btn">{result.action}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="lab-pagination">
              <button
                className="lab-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <button
                className="lab-pagination-btn primary"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Results;
