import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import * as api from '../services/api'

// Mock the API module
vi.mock('../services/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    getMe: vi.fn(),
    logout: vi.fn(),
  },
}))

// Test component to access auth context
const TestComponent = () => {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="loading">{isLoading.toString()}</span>
      <span data-testid="authenticated">{isAuthenticated.toString()}</span>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem = vi.fn().mockReturnValue(null)
    localStorage.setItem = vi.fn()
    localStorage.removeItem = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('provides initial loading state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
  })

  it('user is null when not authenticated', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(screen.getByTestId('user').textContent).toBe('null')
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
  })

  it('throws error when useAuth is used outside AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleError.mockRestore()
  })

  it('checks for existing token on mount', async () => {
    localStorage.getItem = vi.fn().mockReturnValue('existing-token')
    const mockUser = {
      id: 'user-123',
      email: 'existing@example.com',
      first_name: 'Existing',
      last_name: 'User',
      roles: { name: 'Patient' },
    }
    ;(api.authAPI.getMe as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(api.authAPI.getMe).toHaveBeenCalled()
    expect(screen.getByTestId('authenticated').textContent).toBe('true')
    expect(screen.getByTestId('user').textContent).toBe('existing@example.com')
  })

  it('clears token when getMe fails on mount', async () => {
    localStorage.getItem = vi.fn().mockReturnValue('invalid-token')
    ;(api.authAPI.getMe as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Unauthorized'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken')
    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken')
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  describe('login', () => {
    it('successfully logs in user', async () => {
      const mockResponse = {
        accessToken: 'new-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          roles: { name: 'Patient' },
        },
      }
      ;(api.authAPI.login as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false')
      })

      const loginButton = screen.getByText('Login')
      await act(async () => {
        loginButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('true')
      })

      expect(api.authAPI.login).toHaveBeenCalledWith('test@example.com', 'password')
    })

    it('handles login failure', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      }
      ;(api.authAPI.login as ReturnType<typeof vi.fn>).mockRejectedValue(errorResponse)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false')
      })

      const loginButton = screen.getByText('Login')
      await act(async () => {
        loginButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('false')
      })

      expect(screen.getByTestId('user').textContent).toBe('null')
    })
  })

  describe('logout', () => {
    it('successfully logs out user', async () => {
      localStorage.getItem = vi.fn().mockReturnValue('existing-token')
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        roles: { name: 'Patient' },
      }
      ;(api.authAPI.getMe as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
      ;(api.authAPI.logout as ReturnType<typeof vi.fn>).mockResolvedValue({ message: 'Logged out' })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('true')
      })

      const logoutButton = screen.getByText('Logout')
      await act(async () => {
        logoutButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('false')
      })

      expect(screen.getByTestId('user').textContent).toBe('null')
    })

    it('clears user even if logout API fails', async () => {
      localStorage.getItem = vi.fn().mockReturnValue('existing-token')
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        roles: { name: 'Patient' },
      }
      ;(api.authAPI.getMe as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
      ;(api.authAPI.logout as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API Error'))

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('true')
      })

      const logoutButton = screen.getByText('Logout')
      await act(async () => {
        logoutButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('false')
      })

      consoleError.mockRestore()
    })
  })
})
