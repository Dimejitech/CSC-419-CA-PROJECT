import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './SignIn.css';
import cityCareLogoWhite from '../../../assets/cityCarelogo.png';
import surgeryImage from '/images/clinician-surgery.png';
import { useAuth } from '../../../context';

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LocationState {
  message?: string;
  email?: string;
}

const TechnicianSignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { login } = useAuth();

  const [formData, setFormData] = useState<SignInFormData>({
    email: state?.email || '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Display success message from registration
  useEffect(() => {
    if (state?.message) {
      setSuccessMessage(state.message);
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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

    setIsLoading(true);
    setErrors({});

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userRole = payload.role;

          // Only allow LabTechnician role
          if (userRole !== 'LabTechnician') {
            setErrors({ general: 'This portal is for lab technicians only.' });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Could not decode token:', e);
        }
      }
      navigate('/technician/dashboard');
    } else {
      setErrors({ general: result.error || 'Login failed. Please check your credentials.' });
    }

    setIsLoading(false);
  };

  return (
    <div className="signin-container">
      <div className="signin-content">
        <div className="form-section">
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Sign in to access the Lab Technician portal.</p>

          <form onSubmit={handleSubmit}>
            {successMessage && (
              <div className="success-message-box">
                <span className="success-icon">✓</span>
                <span className="success-message">{successMessage}</span>
              </div>
            )}

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
              <label htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <div className={`password-input-wrapper ${errors.password ? 'error' : ''}`}>
                <span className="lock-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="remember-forgot-row">
              <div className="remember-me-group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Log in'}
            </button>

            <p className="signup-link">
              Don't have an account?{' '}
              <Link to="/technician/signup" className="link">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <div className="image-section">
          <img
            src={surgeryImage}
            alt="Medical professionals in surgery"
            className="hero-image"
          />
          <div className="logo-overlay">
            <img src={cityCareLogoWhite} alt="CityCare" className="logo-icon-img" />
            <span className="logo-text">CityCare</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianSignIn;
