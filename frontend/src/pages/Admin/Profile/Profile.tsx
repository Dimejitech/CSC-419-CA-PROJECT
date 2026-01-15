import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSecurity from './ProfileSecurity';
import './Profile.css';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [isEditing, setIsEditing] = useState(true);

  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '15/02/1985',
    gender: 'Male',
    staffId: '884201-XYZ-55',
    email: 'johndoe@example.com',
    phone: '801 234 5678',
    phoneCode: '+234',
    address: '123 Wellness Blvd, Apt 4B',
    city: 'Lagos',
    state: 'Lagos',
    zipCode: '10001'
  });

  // Password state
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState<PasswordErrors>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof PasswordErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validatePassword = (): boolean => {
    const newErrors: PasswordErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const hasMinLength = passwordData.newPassword.length >= 8;
      const hasLowercase = /[a-z]/.test(passwordData.newPassword);
      const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
      const hasNumber = /\d/.test(passwordData.newPassword);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);

      if (!hasMinLength || !hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar) {
        newErrors.newPassword = 'Password does not meet all requirements';
      }
    }

    if (!passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (activeTab === 'security') {
      if (validatePassword()) {
        console.log('Updating password');
        // TODO: Add your API call here
        alert('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
      console.log('Saved:', formData);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="logo">
          <img
            src="/images/citycare-logo-icon.png"
            alt="CityCare"
            className="logo-image"
          />
          <span className="logo-text logo-gradient">CityCare</span>
        </div>

        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="2" />
            <path
              d="M13.5 13.5L17 17"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input placeholder="Search..." />
        </div>

        <div className="header-right">
          <button className="notification-btn">
            <img
              src="/images/notification-bell.png"
              alt="Notifications"
              className="notification-icon"
            />
            <span className="notification-dot"></span>
          </button>

          <div className="header-profile">
            <img src="/images/justin.jpg" alt="Peter Parker" />
            <div className="profile-info">
              <strong>Peter Parker</strong>
              <span>Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-box">
            <div className="sidebar-header">
              <div className="sidebar-header-panel">
                <img
                  src="/images/sidebar-collapse.png"
                  alt=""
                  className="sidebar-collapse"
                />
                <h3 className="sidebar-title">Navigation</h3>
              </div>
            </div>

            <div className="nav-section">
              <span className="section-label">Main</span>
              <button className="nav-item" onClick={() => navigate('/admin/dashboard')}>
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Dashboard</span>
              </button>

              <button className="nav-item" onClick={() => navigate('/admin/user-management')}>
                <img src="/images/group.png" alt="" className="nav-icon" />
                <span>User Management</span>
              </button>
              <button className="nav-item" onClick={() => navigate('/admin/roles-permissions')}>
                <img src="/images/user-badge-check.png" alt="" className="nav-icon" />
                <span>Roles and Permissions</span>
              </button>
              <button className="nav-item" onClick={() => navigate('/admin/audit-logs')}>
                <img src="/images/clock-rotate-right.png" alt="" className="nav-icon" />
                <span>Audit Logs</span>
              </button>
            </div>

            <div className="nav-section">
              <span className="section-label">Secondary</span>
              <button className="nav-item active">
                <img src="/images/profile.png" alt="" className="nav-icon" />
                <span>Profile</span>
              </button>
              <button className="nav-item">
                <img src="/images/help-circle.png" alt="" className="nav-icon" />
                <span>Help / Support</span>
              </button>
            </div>

            <button className="logout" onClick={() => navigate('/admin/signin')}>
              <img src="/images/log-out.png" alt="" className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <div className="profile-inner">
            {/* PAGE HEADER */}
            <div className="profile-page-header">
              <div className="profile-header-left">
                <h1>My Profile</h1>
                <p>Manage your account information and preferences.</p>
              </div>
              <div className="breadcrumb">
                <span className="breadcrumb-link">Profile</span>
                <span className="breadcrumb-separator">&gt;</span>
                <span className="breadcrumb-current">
                  {activeTab === 'personal' ? 'Personal Info' : 'Security'}
                </span>
              </div>
            </div>

            {/* TABS AND SAVE BUTTON */}
            <div className="profile-tabs-row">
              <div className="profile-tabs">
                <button
                  className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Info
                </button>
                <button
                  className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </button>
              </div>
              {activeTab === 'personal' && (
                <button className="save-changes-btn" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              )}
            </div>

            {/* CONTENT AREA */}
            <div className="profile-content">
              {/* LEFT SIDEBAR */}
              <div className="profile-left-column">
                {/* JOHN DOE CARD */}
                <div className="profile-sidebar-card">
                  <div className="profile-avatar-section">
                    <div className="profile-avatar-wrapper">
                      <img
                        src="/images/justin.jpg"
                        alt="John Doe"
                        className="profile-avatar"
                      />

                      <button className="avatar-edit-btn">
                        <img
                          src="/images/edit-pencil.png"
                          alt="Edit"
                          width={14}
                          height={14}
                        />
                      </button>
                    </div>

                    <div className="profile-name">John Doe</div>
                    <div className="profile-email">johndoe@example.com</div>

                    <span className="profile-badge">Active Patient</span>
                  </div>
                </div>

                {/* QUICK ACTIONS CARD */}
                <div className="profile-sidebar-card quick-actions-card">
                  <h4 className="quick-actions-title">Quick Actions</h4>

                  <button className="quick-action-btn">
                    <div className="quick-action-icon request-icon">
                      <img src="/images/clock-rotate-right.png" width={20} />
                    </div>
                    Request Records
                    <span className="arrow-right">›</span>
                  </button>

                  <button className="quick-action-btn">
                    <div className="quick-action-icon share-icon">
                      <img src="/images/share-ios.png" width={20} />
                    </div>
                    Share Profile
                    <span className="arrow-right">›</span>
                  </button>
                </div>
              </div>

              {/* RIGHT CONTENT - CONDITIONAL BASED ON ACTIVE TAB */}
              <div className="profile-right-column">
                {activeTab === 'personal' ? (
                  <>
                    {/* PERSONAL INFORMATION BOX */}
                    <div className="profile-main-card">
                      <div className="profile-card-header">
                        <h2>Personal Information</h2>
                        <button
                          className="edit-info-btn"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? 'Cancel' : 'Edit Info'}
                        </button>
                      </div>

                      <div className="profile-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="John"
                            />
                          </div>
                          <div className="form-group">
                            <label>Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Doe"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Date of Birth</label>
                            <div className="input-with-icon">
                              <input
                                type="text"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="15/02/1985"
                              />
                              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="3" y="4" width="14" height="14" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
                                <path d="M3 8h14M7 2v3M13 2v3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Gender</label>
                            <div className="select-wrapper">
                              <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                              <svg className="select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group full-width">
                            <label>Staff ID</label>
                            <input
                              type="text"
                              name="staffId"
                              value={formData.staffId}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="884201-XYZ-55"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONTACT INFORMATION BOX */}
                    <div className="profile-main-card">
                      <div className="profile-card-header contact-card-header">
                        <h2>Contact Information</h2>
                      </div>

                      <div className="profile-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Email Address</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="johndoe@example.com"
                            />
                          </div>

                          <div className="form-group">
                            <label>Phone Number</label>
                            <div className="phone-input-group">
                              <div className="phone-code-wrapper">
                                <select
                                  name="phoneCode"
                                  value={formData.phoneCode}
                                  onChange={handleInputChange}
                                  disabled={!isEditing}
                                  className="phone-code-select"
                                >
                                  <option value="+234">+234</option>
                                  <option value="+1">+1</option>
                                  <option value="+44">+44</option>
                                </select>
                                <svg className="select-arrow-small" width="10" height="10" viewBox="0 0 12 12" fill="none">
                                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>

                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="801 234 5678"
                                className="phone-number-input"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group full-width">
                            <label>Address</label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="123 Wellness Blvd, Apt 4B"
                            />
                          </div>
                        </div>

                        <div className="form-row form-row-three">
                          <div className="form-group">
                            <label>City</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Lagos"
                            />
                          </div>
                          <div className="form-group">
                            <label>State</label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Lagos"
                            />
                          </div>
                          <div className="form-group">
                            <label>Zip Code</label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="10001"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // SECURITY TAB - Using ProfileSecurity Component
                  <ProfileSecurity
                    passwordData={passwordData}
                    errors={errors}
                    showCurrentPassword={showCurrentPassword}
                    showNewPassword={showNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    isEditing={isEditing}
                    onPasswordInputChange={handlePasswordInputChange}
                    onToggleCurrentPassword={() => setShowCurrentPassword(!showCurrentPassword)}
                    onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
                    onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    onSaveChanges={handleSaveChanges}
                    onEditInfo={() => setIsEditing(!isEditing)}
                  />
                )}
              </div>
              {/* END RIGHT COLUMN */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;