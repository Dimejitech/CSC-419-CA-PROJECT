import React from 'react';

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

interface ProfileSecurityProps {
  passwordData: PasswordData;
  errors: PasswordErrors;
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
  const hasMinLength = passwordData.newPassword.length >= 8;
  const hasLowercase = /[a-z]/.test(passwordData.newPassword);
  const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
  const hasNumber = /\d/.test(passwordData.newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);

  return (
    <div className="profile-main-card security-card">
      <div className="profile-card-header">
        <h2>Security</h2>
        <div className="security-header-buttons">
          <button
            className="edit-info-btn"
            onClick={onEditInfo}
          >
            {isEditing ? 'Cancel' : 'Edit Password'}
          </button>
          {isEditing && (
            <button className="save-changes-btn" onClick={onSaveChanges}>
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="security-content">
        <div className="password-section">
          <h3>Change Password</h3>
          <p className="password-description">
            Update your password to keep your account secure.
          </p>

          <div className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={onPasswordInputChange}
                  placeholder="Enter current password"
                  disabled={!isEditing}
                  className={errors.currentPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={onToggleCurrentPassword}
                  disabled={!isEditing}
                >
                  {showCurrentPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.currentPassword && (
                <span className="error-message">{errors.currentPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={onPasswordInputChange}
                  placeholder="Enter new password"
                  disabled={!isEditing}
                  className={errors.newPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={onToggleNewPassword}
                  disabled={!isEditing}
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.newPassword && (
                <span className="error-message">{errors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={onPasswordInputChange}
                  placeholder="Confirm new password"
                  disabled={!isEditing}
                  className={errors.confirmNewPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={onToggleConfirmPassword}
                  disabled={!isEditing}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <span className="error-message">{errors.confirmNewPassword}</span>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li className={hasMinLength ? 'valid' : ''}>
                {hasMinLength ? '✓' : '○'} Minimum 8 characters
              </li>
              <li className={hasLowercase ? 'valid' : ''}>
                {hasLowercase ? '✓' : '○'} At least one lowercase letter
              </li>
              <li className={hasUppercase ? 'valid' : ''}>
                {hasUppercase ? '✓' : '○'} At least one uppercase letter
              </li>
              <li className={hasNumber ? 'valid' : ''}>
                {hasNumber ? '✓' : '○'} At least one number
              </li>
              <li className={hasSpecialChar ? 'valid' : ''}>
                {hasSpecialChar ? '✓' : '○'} At least one special character
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSecurity;
