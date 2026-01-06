import React, { useState } from 'react';
import styles from './MedicalRecords.module.css';
import { ChevronRightIcon, WarningIcon } from '../../components';
import avatar from '../../assets/avatar.png';

type TabType = 'overview' | 'visit-history';

interface Diagnosis {
  id: string;
  name: string;
  description: string;
}

interface VisitRecord {
  id: string;
  date: string;
  doctor: string;
  department: string;
  reason: string;
}

const diagnoses: Diagnosis[] = [
  {
    id: '1',
    name: 'Hypertension',
    description: 'High Blood Pressure',
  },
];

const visitRecords: VisitRecord[] = [
  {
    id: '1',
    date: 'November 29, 2025',
    doctor: 'Dr James Blake',
    department: 'General Medicine',
    reason: 'Follow-up consultation',
  },
  {
    id: '2',
    date: 'November 29, 2025',
    doctor: 'Dr James Blake',
    department: 'General Medicine',
    reason: 'Follow-up consultation',
  },
  {
    id: '3',
    date: 'November 29, 2025',
    doctor: 'Dr James Blake',
    department: 'General Medicine',
    reason: 'Follow-up consultation',
  },
];

const patientInfo = {
  name: 'John Doe',
  dateOfBirth: 'Feb 15, 1985',
  bloodGroup: 'O+',
  allergies: ['Penicillin'],
};

// Red circle icon for diagnosis
const DiagnosisIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" stroke="#EF4444" strokeWidth="2"/>
    <circle cx="10" cy="10" r="3" fill="#EF4444"/>
  </svg>
);

export const MedicalRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Medical Records</h1>
          <p className={styles.description}>
            A summary of your health information from your clinic visits.
          </p>
        </div>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbItem}>Medical Records</span>
          <ChevronRightIcon size={14} color="#A4A4A4" />
          <span className={styles.breadcrumbItemActive}>
            {activeTab === 'overview' ? 'Overview' : 'Visit History'}
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className={styles.contentCard}>
        {/* Patient Info Section */}
        <div className={styles.patientSection}>
          <div className={styles.patientInfo}>
            <img src={avatar} alt={patientInfo.name} className={styles.patientAvatar} />
            <div className={styles.patientDetails}>
              <h2 className={styles.patientName}>{patientInfo.name}</h2>
              <div className={styles.patientMeta}>
                <span>Date of Birth : <strong>{patientInfo.dateOfBirth}</strong></span>
                <span className={styles.separator}>|</span>
                <span>Blood Group: <strong>{patientInfo.bloodGroup}</strong></span>
              </div>
            </div>
          </div>

          {patientInfo.allergies.length > 0 && (
            <div className={styles.allergyBanner}>
              <div className={styles.allergyContent}>
                <WarningIcon size={20} />
                <span>Allergies - {patientInfo.allergies.join(', ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabRow}>
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'visit-history' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('visit-history')}
            >
              Visit History
            </button>
          </div>

          {activeTab === 'visit-history' && (
            <div className={styles.filterDropdown}>
              <select className={styles.filterSelect}>
                <option>Last 30 days</option>
                <option>Last 60 days</option>
                <option>Last 90 days</option>
                <option>All time</option>
              </select>
            </div>
          )}
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className={styles.overviewContent}>
            <div className={styles.overviewGrid}>
              {/* Diagnoses Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Diagnoses</h3>
                <div className={styles.cardContent}>
                  {diagnoses.map((diagnosis) => (
                    <div key={diagnosis.id} className={styles.diagnosisItem}>
                      <DiagnosisIcon />
                      <div className={styles.diagnosisInfo}>
                        <span className={styles.diagnosisName}>{diagnosis.name}</span>
                        <span className={styles.diagnosisDesc}>{diagnosis.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Medications Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Current Medications</h3>
                <div className={styles.cardContent}>
                  {/* Empty state - no medications */}
                </div>
              </div>
            </div>

            {/* Recent Lab Results Card */}
            <div className={styles.labResultsCard}>
              <h3 className={styles.cardTitle}>Recent Lab Results</h3>
              <div className={styles.cardContent}>
                {/* Empty state - no lab results */}
              </div>
            </div>
          </div>
        )}

        {/* Visit History Tab Content */}
        {activeTab === 'visit-history' && (
          <div className={styles.visitHistory}>
            {visitRecords.map((visit) => (
              <div key={visit.id} className={styles.visitCard}>
                <div className={styles.visitInfo}>
                  <img src={avatar} alt={visit.doctor} className={styles.visitAvatar} />
                  <div className={styles.visitDetails}>
                    <span className={styles.visitDoctor}>{visit.doctor}</span>
                    <span className={styles.visitDepartment}>{visit.department}</span>
                    <span className={styles.visitReason}>Reason: {visit.reason}</span>
                  </div>
                </div>
                <div className={styles.visitActions}>
                  <button className={styles.viewDetailsBtn}>View Details</button>
                  <span className={styles.visitDate}>{visit.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
