import React from 'react';
import styles from './LabResults.module.css';
import { WarningIcon } from '../../components';

interface ExpandedTest {
  id: string;
  testName: string;
  needsFollowUp: boolean;
  lastTested: string;
  result: string;
  normalRange: string;
  status: 'Above normal' | 'Below normal' | 'Normal';
  doctorNotes: string;
}

interface CollapsedTest {
  id: string;
  testName: string;
  status: 'Normal' | 'Abnormal';
  trend: string;
  lastTested: string;
}

const summaryData = {
  totalTests: 14,
  normal: 10,
  abnormal: 4,
};

const expandedTest: ExpandedTest = {
  id: '1',
  testName: 'Cholesterol Test',
  needsFollowUp: true,
  lastTested: 'May 10, 2025',
  result: '240mg /dL',
  normalRange: 'Below 200mg /dL',
  status: 'Above normal',
  doctorNotes: 'This value is slightly higher than normal. We recommend diet changes and a repeat.',
};

const collapsedTests: CollapsedTest[] = [
  {
    id: '2',
    testName: 'Blood Sugar Test',
    status: 'Normal',
    trend: 'Stable since last result',
    lastTested: 'March 25, 2025',
  },
  {
    id: '3',
    testName: 'Blood Sugar Test',
    status: 'Normal',
    trend: 'Stable since last result',
    lastTested: 'March 25, 2025',
  },
];

// Document icon for doctor's notes
const NotesIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="2" width="14" height="16" rx="2" stroke="#03A5FF" strokeWidth="1.5"/>
    <path d="M6 6H14" stroke="#03A5FF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 10H14" stroke="#03A5FF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 14H10" stroke="#03A5FF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Three dots menu icon
const MoreIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="4" r="1.5" fill="#9EA2AD"/>
    <circle cx="10" cy="10" r="1.5" fill="#9EA2AD"/>
    <circle cx="10" cy="16" r="1.5" fill="#9EA2AD"/>
  </svg>
);

// Arrow right icon for trend
const TrendArrowIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LabResults: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Lab Results</h1>
        <p className={styles.description}>
          Results from your clinic visits, reviewed by your care team.
        </p>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryCards}>
        <div className={`${styles.summaryCard} ${styles.summaryTotal}`}>
          <span className={styles.summaryLabel}>Total Tests</span>
          <span className={styles.summaryValue}>{summaryData.totalTests}</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryNormal}`}>
          <span className={styles.summaryLabel}>Normal</span>
          <span className={styles.summaryValue}>{summaryData.normal}</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryAbnormal}`}>
          <span className={styles.summaryLabel}>Abnormal</span>
          <span className={styles.summaryValue}>{summaryData.abnormal}</span>
        </div>
      </div>

      {/* Filters Row */}
      <div className={styles.filtersRow}>
        <select className={styles.filterSelect}>
          <option>All Tests</option>
          <option>Cholesterol</option>
          <option>Blood Sugar</option>
          <option>Blood Count</option>
        </select>
        <select className={styles.filterSelect}>
          <option>Last 30 days</option>
          <option>Last 60 days</option>
          <option>Last 90 days</option>
          <option>All time</option>
        </select>
        <select className={styles.filterSelect}>
          <option>Sort: Severity</option>
          <option>Sort: Date</option>
          <option>Sort: Name</option>
        </select>
      </div>

      {/* Expanded Test Card */}
      <div className={styles.expandedCard}>
        <div className={styles.expandedHeader}>
          <div className={styles.expandedTitleRow}>
            <WarningIcon size={20} />
            <span className={styles.expandedTitle}>{expandedTest.testName}</span>
            {expandedTest.needsFollowUp && (
              <span className={styles.followUpBadge}>Needs follow-up</span>
            )}
          </div>
          <div className={styles.expandedMeta}>
            <span className={styles.lastTested}>Last Tested: {expandedTest.lastTested}</span>
            <button className={styles.moreBtn}>
              <MoreIcon />
            </button>
          </div>
        </div>

        <div className={styles.expandedBody}>
          <div className={styles.resultDetails}>
            <div className={styles.resultColumn}>
              <span className={styles.resultLabel}>Result:</span>
              <span className={styles.resultValue}>{expandedTest.result}</span>
            </div>
            <div className={styles.resultColumn}>
              <span className={styles.resultLabel}>Normal Range:</span>
              <div className={styles.normalRangeValue}>
                <span className={styles.greenDot}></span>
                <span>{expandedTest.normalRange}</span>
              </div>
            </div>
            <div className={styles.resultColumn}>
              <span className={styles.resultLabel}>Status:</span>
              <div className={styles.statusValue}>
                <span className={styles.redTriangle}>▲</span>
                <span>{expandedTest.status}</span>
              </div>
            </div>
            <div className={styles.chartPlaceholder}></div>
          </div>

          <div className={styles.doctorNotes}>
            <div className={styles.notesContent}>
              <NotesIcon />
              <span><strong>Doctor's Notes:</strong> {expandedTest.doctorNotes}</span>
            </div>
            <div className={styles.notesActions}>
              <button className={styles.downloadBtn}>Download PDF</button>
              <button className={styles.askBtn}>Ask a question</button>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed Test Cards */}
      {collapsedTests.map((test) => (
        <div key={test.id} className={styles.collapsedCard}>
          <div className={styles.collapsedInfo}>
            <span className={styles.collapsedTitle}>{test.testName}</span>
            <div className={styles.collapsedStatus}>
              <span className={styles.greenDot}></span>
              <span>{test.status}</span>
              <span className={styles.statusDivider}>|</span>
              <TrendArrowIcon />
              <span className={styles.trendText}>{test.trend}</span>
            </div>
          </div>
          <div className={styles.collapsedActions}>
            <span className={styles.lastTested}>Last Tested: {test.lastTested}</span>
            <button className={styles.viewDetailsBtn}>View Details</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LabResults;
