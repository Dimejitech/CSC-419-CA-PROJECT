import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

interface ProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  staffId: string;
  email: string;
  phone: string;
  countryCode: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data
  const user = {
    name: 'Peter Parker',
    role: 'Lab Technician',
    avatar: '/images/avatar.png',
    email: 'johndoe@example.com',
    status: 'Active Patient',
  };

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '15/02/1985',
    gender: 'Male',
    staffId: '884201-XYZ-55',
    email: 'johndoe@example.com',
    phone: '801 234 5678',
    countryCode: '+234',
    address: '123 Wellness Blvd, Apt 4B',
    city: 'Lagos',
    state: 'Lagos',
    zipCode: '100001',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    // TODO: Implement API call to save profile data
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/technician/signin');
  };

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <div className="profile-header-left">
          <img src="/images/citycare-logo-icon.png" alt="CityCare" className="profile-logo-icon" />
          <span className="profile-logo-text">CityCare</span>
        </div>

        <div className="profile-header-center">
          <div className="profile-search-bar">
            <span className="profile-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="profile-header-right">
          <button className="profile-notification-btn">
            <span className="profile-bell-icon">🔔</span>
            <span className="profile-notification-badge">2</span>
          </button>
          <div className="profile-user-info">
            <img src={user.avatar} alt={user.name} className="profile-user-avatar" />
            <div className="profile-user-details">
              <span className="profile-user-name">{user.name}</span>
              <span className="profile-user-role">{user.role}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="profile-layout">
        {/* Sidebar */}
        <aside className={`profile-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button
            className="profile-sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            ☰
          </button>

          <div className="profile-sidebar-header">
            <h3 className="profile-nav-title">Navigation</h3>
          </div>

          <nav className="profile-nav">
            <div className="profile-nav-section">
              <h4 className="profile-nav-section-title">Main</h4>
              <button className="profile-nav-item" onClick={() => navigate('/technician/dashboard')}>
                <span className="profile-nav-icon">🏠</span>
                <span className="profile-nav-label">Dashboard</span>
              </button>
              <button className="profile-nav-item" onClick={() => navigate('/technician/lab-orders')}>
                <span className="profile-nav-icon">📋</span>
                <span className="profile-nav-label">Lab Orders</span>
              </button>
              <button className="profile-nav-item" onClick={() => navigate('/technician/results')}>
                <span className="profile-nav-icon">📊</span>
                <span className="profile-nav-label">Results</span>
              </button>
            </div>

            <div className="profile-nav-section">
              <h4 className="profile-nav-section-title">Secondary</h4>
              <button className="profile-nav-item active" onClick={() => navigate('/technician/profile')}>
                <span className="profile-nav-icon">👤</span>
                <span className="profile-nav-label">Profile</span>
              </button>
              <button className="profile-nav-item" >
                <span className="profile-nav-icon">❓</span>
                <span className="profile-nav-label">Help / Support</span>
              </button>
            </div>
          </nav>

          <button className="profile-logout-btn" onClick={handleLogout}>
            <span className="profile-logout-icon">🚪</span>
            <span className="profile-logout-label">Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="profile-main-content">
          {/* Page Header */}
          <div className="profile-page-header">
            <div>
              <h1 className="profile-page-title">My Profile</h1>
              <p className="profile-page-subtitle">Manage your account information and preferences.</p>
            </div>
            <div className="profile-breadcrumb">
              <span>Profile</span>
              <span className="profile-breadcrumb-separator">›</span>
              <span className="profile-breadcrumb-active">Personal Info</span>
            </div>
          </div>

          {/* Tabs */}
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
            <button className="profile-save-btn" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>

          {/* Content Grid */}
          <div className="profile-content-grid">
            {/* Left Column - Profile Card */}
            <div className="profile-card">
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  <img src={user.avatar} alt={user.name} className="profile-avatar-large" />
                  <button className="profile-avatar-edit">
                    <span>✏️</span>
                  </button>
                </div>
                <h3 className="profile-card-name">{profileData.firstName} {profileData.lastName}</h3>
                <p className="profile-card-email">{profileData.email}</p>
                <span className="profile-status-badge">{user.status}</span>
              </div>

              <div className="profile-quick-actions">
                <h4 className="profile-quick-actions-title">Quick Actions</h4>
                <button className="profile-action-btn">
                  <span className="profile-action-icon">📁</span>
                  <span className="profile-action-text">Request Records</span>
                  <span className="profile-action-arrow">›</span>
                </button>
                <button className="profile-action-btn">
                  <span className="profile-action-icon">📤</span>
                  <span className="profile-action-text">Share Profile</span>
                  <span className="profile-action-arrow">›</span>
                </button>
              </div>
            </div>

            {/* Right Column - Forms */}
            <div className="profile-forms">
              {activeTab === 'personal' ? (
                <>
                  {/* Personal Information */}
                  <div className="profile-form-section">
                    <div className="profile-form-header">
                      <h3 className="profile-form-title">Personal Information</h3>
                      <button 
                        className="profile-edit-btn"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? 'Cancel' : 'Edit Info'}
                      </button>
                    </div>

                    <div className="profile-form-grid">
                      <div className="profile-form-group">
                        <label className="profile-form-label">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          className="profile-form-input"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          className="profile-form-input"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">Date of Birth</label>
                        <div className="profile-input-with-icon">
                          <input
                            type="text"
                            name="dateOfBirth"
                            className="profile-form-input"
                            value={profileData.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <span className="profile-input-icon">📅</span>
                        </div>
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">Gender</label>
                        <select
                          name="gender"
                          className="profile-form-select"
                          value={profileData.gender}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="profile-form-group profile-form-group-full">
                        <label className="profile-form-label">Staff ID</label>
                        <input
                          type="text"
                          name="staffId"
                          className="profile-form-input"
                          value={profileData.staffId}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="profile-form-section">
                    <h3 className="profile-form-title">Contact Information</h3>

                    <div className="profile-form-grid">
                      <div className="profile-form-group">
                        <label className="profile-form-label">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className="profile-form-input"
                          value={profileData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">Phone Number</label>
                        <div className="profile-phone-input">
                          <select
                            name="countryCode"
                            className="profile-country-code"
                            value={profileData.countryCode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          >
                            <option>+234</option>
                            <option>+1</option>
                            <option>+44</option>
                          </select>
                          <input
                            type="tel"
                            name="phone"
                            className="profile-form-input profile-phone-number"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="profile-form-group profile-form-group-full">
                        <label className="profile-form-label">Address</label>
                        <input
                          type="text"
                          name="address"
                          className="profile-form-input"
                          value={profileData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">City</label>
                        <input
                          type="text"
                          name="city"
                          className="profile-form-input"
                          value={profileData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">State</label>
                        <input
                          type="text"
                          name="state"
                          className="profile-form-input"
                          value={profileData.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">Zip Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          className="profile-form-input"
                          value={profileData.zipCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Security Tab Content
                <div className="profile-form-section">
                  <h3 className="profile-form-title">Security Settings</h3>
                  <p className="profile-security-message">
                    Change your password and manage security settings here.
                  </p>
                  {/* TODO: Add security form */}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
