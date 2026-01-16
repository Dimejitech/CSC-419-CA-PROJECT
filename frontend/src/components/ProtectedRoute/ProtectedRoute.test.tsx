import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import React from 'react'

// Create a mock for the useAuth hook
const mockUseAuth = vi.fn()

// Mock the context module
vi.mock('../../context', () => ({
  useAuth: () => mockUseAuth(),
}))

// Import after mocking
import { ProtectedRoute } from './ProtectedRoute'

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithRouter = (ui: React.ReactElement, initialRoute = '/protected') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/protected" element={ui} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('shows loading state when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null,
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '123', email: 'test@example.com' },
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('renders children when user has required role (from user.role)', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '123', email: 'test@example.com', role: 'Clinician' },
    })

    renderWithRouter(
      <ProtectedRoute requiredRole="Clinician">
        <div>Clinician Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Clinician Content')).toBeInTheDocument()
  })

  it('renders children when user has required role (from user.roles.name)', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: {
        id: '123',
        email: 'test@example.com',
        roles: { name: 'Clinician' },
      },
    })

    renderWithRouter(
      <ProtectedRoute requiredRole="Clinician">
        <div>Clinician Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Clinician Content')).toBeInTheDocument()
  })

  it('redirects to home when user lacks required role', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '123', email: 'test@example.com', role: 'Patient' },
    })

    renderWithRouter(
      <ProtectedRoute requiredRole="Clinician">
        <div>Clinician Only Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('allows access without requiredRole when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '123', email: 'test@example.com' },
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Any Authenticated User Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Any Authenticated User Content')).toBeInTheDocument()
  })
})
