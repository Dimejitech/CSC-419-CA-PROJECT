import React, { useState } from 'react';
import styles from './Profile.module.css';
import avatar from '../../assets/avatar.png';

// Edit/pencil icon for avatar
const EditAvatarIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.333 2.00004C11.5081 1.82494 11.7169 1.68605 11.9473 1.59129C12.1777 1.49653 12.4251 1.44775 12.675 1.44775C12.9248 1.44775 13.1722 1.49653 13.4026 1.59129C13.633 1.68605 13.8418 1.82494 14.0169 2.00004C14.192 2.17513 14.3309 2.38394 14.4257 2.61435C14.5204 2.84476 14.5692 3.09213 14.5692 3.34204C14.5692 3.59195 14.5204 3.83932 14.4257 4.06973C14.3309 4.30014 14.192 4.50895 14.0169 4.68404L5.00021 13.7007L1.33354 14.6674L2.30021 11.0007L11.333 2.00004Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Lock icon for password field
const LockIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="9" width="14" height="10" rx="2" stroke="#9EA2AD" strokeWidth="1.5"/>
    <path d="M6 9V6C6 3.79086 7.79086 2 10 2C12.2091 2 14 3.79086 14 6V9" stroke="#9EA2AD" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Eye icon for show/hide password
const EyeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66663 10C1.66663 10 4.16663 4.16669 10 4.16669C15.8333 4.16669 18.3333 10 18.3333 10C18.3333 10 15.8333 15.8334 10 15.8334C4.16663 15.8334 1.66663 10 1.66663 10Z" stroke="#9EA2AD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#9EA2AD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface ProfileData {
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const profileData: ProfileData = {
  name: 'John Doe',
  dateOfBirth: 'February 15, 1985',
  bloodGroup: 'O+',
  email: 'johndoe@gmail.com',
  phoneNumber: '+234 801 234 5678',
  address: '1234 Elm Street, Apartment 45, Springfield, 62701',
};

export const Profile: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.description}>
          Manage your account information and preferences.
        </p>
      </div>

      {/* Profile Information Card */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Profile Information</h3>
        <div className={styles.profileSection}>
          <div className={styles.avatarWrapper}>
            <img src={avatar} alt="Profile" className={styles.avatar} />
            <button className={styles.editAvatarBtn}>
              <EditAvatarIcon />
            </button>
          </div>
          <div className={styles.profileDetails}>
            <h2 className={styles.profileName}>{profileData.name}</h2>
            <div className={styles.profileMeta}>
              <span className={styles.metaLabel}>Date of Birth:</span>
              <span className={styles.metaValue}>{profileData.dateOfBirth}</span>
            </div>
            <div className={styles.profileMeta}>
              <span className={styles.metaLabel}>Blood Group:</span>
              <span className={styles.metaValue}>{profileData.bloodGroup}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Address Card */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Contact & Address</h3>
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Email:</span>
            <span className={styles.contactValue}>{profileData.email}</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Phone Number:</span>
            <span className={styles.contactValue}>{profileData.phoneNumber}</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Address:</span>
            <span className={styles.contactValue}>{profileData.address}</span>
          </div>
        </div>
      </div>

      {/* Security Settings Card */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Security Settings</h3>
        <div className={styles.securitySection}>
          <div className={styles.passwordGroup}>
            <span className={styles.passwordLabel}>Password</span>
            <div className={styles.passwordField}>
              <LockIcon />
              <input
                type={showPassword ? 'text' : 'password'}
                value="password123"
                readOnly
                className={styles.passwordInput}
              />
              <button
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeIcon />
              </button>
            </div>
          </div>
          <p className={styles.twoFactorText}>Two-factor authentication</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
