import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

interface FormData {
  emailOrPhone: string;
  password: string;
}

interface FormErrors {
  emailOrPhone?: string;
  password?: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    emailOrPhone: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/dashboard');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-content">
        <div className="form-section">
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Sign in to access the admin portal</p>

          <form onSubmit={handleSubmit}>
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
              />
              {errors.emailOrPhone && (
                <span className="error-message">{errors.emailOrPhone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your ········"
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  👁️
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <a href="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </a>

            <button type="submit" className="submit-button">
              Log in
            </button>

            <p className="signup-link">
              New to the portal?{' '}
              <a href="/signup" className="link">
                Sign up
              </a>
            </p>
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

export default SignIn;