import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './Home'

// Mock the API services
vi.mock('../../services/api', () => ({
  schedulingAPI: {
    getPatientBookings: vi.fn().mockResolvedValue([]),
  },
  billingAPI: {
    getPatientInvoices: vi.fn().mockResolvedValue([]),
  },
  notificationAPI: {
    getNotifications: vi.fn().mockResolvedValue([]),
    markAsRead: vi.fn().mockResolvedValue({}),
    markAllAsRead: vi.fn().mockResolvedValue({}),
  },
  clinicalAPI: {
    getPatientEncounters: vi.fn().mockResolvedValue([]),
    getPatientPrescriptions: vi.fn().mockResolvedValue([]),
    getPatientChart: vi.fn().mockResolvedValue({ allergies: [] }),
  },
  labAPI: {
    getPatientResults: vi.fn().mockResolvedValue([]),
  },
}))

// Mock the context
vi.mock('../../context', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      firstName: 'Test',
      lastName: 'User',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: null }),
  }
})

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderHome = () => {
    return render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
  }

  it('renders home page title', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
  })

  it('renders welcome text', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    })
  })

  it('renders book appointment quick action', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Book Appointment')).toBeInTheDocument()
    })
  })

  it('renders medical records quick action', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Medical Records')).toBeInTheDocument()
    })
  })

  it('renders lab results quick action', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Lab Results')).toBeInTheDocument()
    })
  })

  it('renders pay your bill quick action', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Pay Your Bill')).toBeInTheDocument()
    })
  })

  it('renders book now button', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Book Now')).toBeInTheDocument()
    })
  })
})
