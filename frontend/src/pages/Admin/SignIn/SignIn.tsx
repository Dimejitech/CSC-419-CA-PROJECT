import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css';
import { useAuth } from '../../../context';

interface FormData {
  emailOrPhone: string;
  password: string;
}

interface FormErrors {
  emailOrPhone?: string;
  password?: string;
  general?: string;
}

const AdminSignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    emailOrPhone: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
        general: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email address or phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    const result = await login(formData.emailOrPhone, formData.password);

    if (result.success) {
      // Get the current user from localStorage to check role
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Decode JWT to get role (basic decode without verification)
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userRole = payload.role;

          // Only allow Admin role
          if (userRole !== 'Admin') {
            setErrors({ general: 'This portal is for administrators only.' });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsSubmitting(false);
            return;
          }
        } catch (e) {
          console.warn('Could not decode token:', e);
        }
      }
      navigate('/admin/dashboard');
    } else {
      setErrors({ general: result.error || 'Login failed. Please check your credentials.' });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="signin-container">
      <div className="signin-content">
        <div className="form-section">
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Sign in to access the admin portal</p>

          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fee2e2',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#dc2626',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="emailOrPhone">Email Address or Phone Number</label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                placeholder="Enter your email address or phone number"
                className={errors.emailOrPhone ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.emailOrPhone && (
                <span className="error-message">{errors.emailOrPhone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className={`password-input-wrapper ${errors.password ? 'error' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <Link to="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </Link>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>

        <div className="image-section">
          <img
            src="/images/microscope-lab.png"
            alt="Laboratory microscope"
            className="hero-image"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
