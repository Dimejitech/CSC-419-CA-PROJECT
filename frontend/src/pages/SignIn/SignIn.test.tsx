import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

// Create a mock for the useAuth hook
const mockLogin = vi.fn()
const mockUseAuth = vi.fn()

// Mock the context module
vi.mock('../../context', () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock the asset import
vi.mock('../../assets/signin-bg.png', () => ({
  default: 'mock-signin-bg.png',
}))

// Mock react-router-dom hooks
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Import after mocking
import { SignIn } from './SignIn'

describe('SignIn Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem = vi.fn().mockReturnValue(null)
    localStorage.setItem = vi.fn()

    mockUseAuth.mockReturnValue({
      login: mockLogin,
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  })

  const renderSignIn = () => {
    return render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    )
  }

  it('renders sign in form', () => {
    renderSignIn()

    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    renderSignIn()

    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })

    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('does not call login with invalid email format', async () => {
    renderSignIn()

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter your password/i)

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    // Wait for potential async operations
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  it('calls login with form data on valid submission', async () => {
    mockLogin.mockResolvedValue({ success: true })

    renderSignIn()

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter your password/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('shows loading state while submitting', async () => {
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100)))

    renderSignIn()

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter your password/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument()
    })
  })

  it('displays error message on login failure', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' })

    renderSignIn()

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter your password/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('navigates to home on successful patient login', async () => {
    mockLogin.mockResolvedValue({ success: true })

    renderSignIn()

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter your password/i)

    fireEvent.change(emailInput, { target: { value: 'patient@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('has link to forgot password page', () => {
    renderSignIn()

    const forgotPasswordLink = screen.getByText(/forgot your password/i)
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })

  it('has link to sign up page', () => {
    renderSignIn()

    const signUpLink = screen.getByRole('link', { name: /create one/i })
    expect(signUpLink).toHaveAttribute('href', '/signup')
  })

  it('has link to clinician sign in', () => {
    renderSignIn()

    const clinicianLink = screen.getByRole('link', { name: /sign in here/i })
    expect(clinicianLink).toHaveAttribute('href', '/clinician/signin')
  })

  it('clears field error when user starts typing', async () => {
    renderSignIn()

    // Submit to trigger validation errors
    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })

    // Start typing in email field
    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    fireEvent.change(emailInput, { target: { value: 't' } })

    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
    })
  })

  it('displays security note', () => {
    renderSignIn()

    expect(screen.getByText(/your health information is securely encrypted/i)).toBeInTheDocument()
  })
})
