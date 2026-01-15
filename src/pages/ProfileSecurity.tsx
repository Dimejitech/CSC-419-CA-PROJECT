import React from 'react';
import './ProfileSecurity.css';

interface ProfileSecurityProps {
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  errors: {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  };
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  isEditing: boolean;
  onPasswordInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleCurrentPassword: () => void;
  onToggleNewPassword: () => void;
  onToggleConfirmPassword: () => void;
  onSaveChanges: () => void;
  onEditInfo: () => void;
}

const ProfileSecurity: React.FC<ProfileSecurityProps> = ({
  passwordData,
  errors,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  isEditing,
  onPasswordInputChange,
  onToggleCurrentPassword,
  onToggleNewPassword,
  onToggleConfirmPassword,
  onSaveChanges,
  onEditInfo,
}) => {
  // Password strength indicators
  const hasMinLength = passwordData.newPassword.length >= 8;
  const hasLowercase = /[a-z]/.test(passwordData.newPassword);
  const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
  const hasNumber = /\d/.test(passwordData.newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);

  return (
    <div className="profile-form-content">
      <div className="profile-form-section">
            <div className="profile-section-header">
            <h3 className="profile-section-title">Change Password</h3>

            <button className="profile-editBtn" onClick={onEditInfo}>
                Edit Info
            </button>
            </div>


        <div className="security-password-form">
          {/* Current Password */}
          <div className="profile-form-group full-width">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="security-password-input-wrapper">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={onPasswordInputChange}
                disabled={!isEditing}
                placeholder="········"
              />
              <button
                type="button"
                className="security-toggle-password"
                onClick={onToggleCurrentPassword}
                disabled={!isEditing}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showCurrentPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.currentPassword && (
              <span className="security-error-message">{errors.currentPassword}</span>
            )}
          </div>

          {/* New Password Fields */}
          <div className="security-password-grid">
            <div className="profile-form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="security-password-input-wrapper">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={onPasswordInputChange}
                  disabled={!isEditing}
                  placeholder="········"
                />
                <button
                  type="button"
                  className="security-toggle-password"
                  onClick={onToggleNewPassword}
                  disabled={!isEditing}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showNewPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.newPassword && (
                <span className="security-error-message">{errors.newPassword}</span>
              )}
            </div>

            <div className="profile-form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <div className="security-password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={onPasswordInputChange}
                  disabled={!isEditing}
                  placeholder="········"
                />
                <button
                  type="button"
                  className="security-toggle-password"
                  onClick={onToggleConfirmPassword}
                  disabled={!isEditing}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showConfirmPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.confirmNewPassword && (
                <span className="security-error-message">{errors.confirmNewPassword}</span>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="security-password-requirements">
            <h4 className="security-requirements-title">Password requirements:</h4>
            <ul className="security-requirements-list">
              <li className={hasMinLength ? 'met' : ''}>
                Minimum of 8 characters - the more, the better
              </li>
              <li className={hasLowercase && hasUppercase ? 'met' : ''}>
                At least one lowercase & one uppercase character
              </li>
              <li className={hasNumber || hasSpecialChar ? 'met' : ''}>
                At least one number, symbol, or whitespace character
              </li>
            </ul>
          </div>

          {/* Update Button */}
          <button
            className="security-btn-update-password"
            onClick={onSaveChanges}
            disabled={!isEditing}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSecurity;