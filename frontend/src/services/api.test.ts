import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import {
  authAPI,
  schedulingAPI,
  clinicalAPI,
  labAPI,
  billingAPI,
  userAPI,
  notificationAPI,
} from './api'

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }
  return { default: mockAxios }
})

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem = vi.fn()
    localStorage.setItem = vi.fn()
    localStorage.removeItem = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('authAPI', () => {
    describe('login', () => {
      it('stores tokens on successful login', async () => {
        const mockResponse = {
          data: {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            user: { id: '123', email: 'test@example.com' },
          },
        }
        ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue(mockResponse)

        const result = await authAPI.login('test@example.com', 'password')

        expect(result).toEqual(mockResponse.data)
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-token')
        expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token')
      })
    })

    describe('logout', () => {
      it('clears tokens on logout', async () => {
        localStorage.getItem = vi.fn().mockReturnValue('refresh-token')
        ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue({ data: {} })

        await authAPI.logout()

        expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken')
        expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken')
      })

      it('clears tokens even when no refresh token exists', async () => {
        localStorage.getItem = vi.fn().mockReturnValue(null)

        await authAPI.logout()

        expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken')
        expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken')
      })
    })

    describe('register', () => {
      it('calls register endpoint with correct data', async () => {
        const mockResponse = { data: { id: '123', email: 'new@example.com' } }
        ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue(mockResponse)

        const userData = {
          email: 'new@example.com',
          password: 'password',
          firstName: 'New',
          lastName: 'User',
        }

        const result = await authAPI.register(userData)

        expect(result).toEqual(mockResponse.data)
      })
    })

    describe('getMe', () => {
      it('fetches current user data', async () => {
        const mockUser = { id: '123', email: 'test@example.com' }
        ;(axios.create as ReturnType<typeof vi.fn>)().get.mockResolvedValue({ data: mockUser })

        const result = await authAPI.getMe()

        expect(result).toEqual(mockUser)
      })
    })

    describe('refresh', () => {
      it('throws when no refresh token available', async () => {
        localStorage.getItem = vi.fn().mockReturnValue(null)

        await expect(authAPI.refresh()).rejects.toThrow('No refresh token available')
      })

      it('stores new tokens on successful refresh', async () => {
        localStorage.getItem = vi.fn().mockReturnValue('old-refresh-token')
        const mockResponse = {
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        }
        ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue(mockResponse)

        const result = await authAPI.refresh()

        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token')
        expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token')
        expect(result).toEqual(mockResponse.data)
      })
    })
  })

  describe('schedulingAPI', () => {
    it('fetches available slots', async () => {
      const mockSlots = [{ id: '1', startTime: '2024-01-01T09:00:00Z' }]
      ;(axios.create as ReturnType<typeof vi.fn>)().get.mockResolvedValue({ data: mockSlots })

      const result = await schedulingAPI.getAvailableSlots('clinician-123', '2024-01-01')

      expect(result).toEqual(mockSlots)
    })

    it('creates a booking', async () => {
      const mockBooking = { id: 'booking-123' }
      ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue({ data: mockBooking })

      const bookingData = {
        patientId: 'patient-123',
        slotId: 'slot-123',
        reasonForVisit: 'Checkup',
      }

      const result = await schedulingAPI.createBooking(bookingData)

      expect(result).toEqual(mockBooking)
    })

    it('fetches patient bookings', async () => {
      const mockBookings = [{ id: 'booking-1' }, { id: 'booking-2' }]
      ;(axios.create as ReturnType<typeof vi.fn>)().get.mockResolvedValue({ data: mockBookings })

      const result = await schedulingAPI.getPatientBookings('patient-123')

      expect(result).toEqual(mockBookings)
    })

    it('cancels a booking', async () => {
      const mockResponse = { success: true }
      ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue({ data: mockResponse })

      const result = await schedulingAPI.cancelBooking('booking-123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('billingAPI', () => {
    it('fetches invoices', async () => {
      const mockInvoices = [{ id: 'invoice-1', totalAmount: 100 }]
      ;(axios.create as ReturnType<typeof vi.fn>)().get.mockResolvedValue({ data: mockInvoices })

      const result = await billingAPI.getInvoices()

      expect(result).toEqual(mockInvoices)
    })

    it('fetches patient invoices', async () => {
      const mockInvoices = [{ id: 'invoice-1' }]
      ;(axios.create as ReturnType<typeof vi.fn>)().get.mockResolvedValue({ data: mockInvoices })

      const result = await billingAPI.getPatientInvoices('patient-123')

      expect(result).toEqual(mockInvoices)
    })

    it('creates an invoice', async () => {
      const mockInvoice = { id: 'invoice-new' }
      ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue({ data: mockInvoice })

      const result = await billingAPI.createInvoice({ patientId: 'patient-123' })

      expect(result).toEqual(mockInvoice)
    })
  })

  describe('labAPI', () => {
    it('fetches patient results', async () => {
      const mockResults = [{ id: 'result-1', testName: 'Blood Test' }]
      ;(axios.create as ReturnType<typeof vi.fn>)().get.mockResolvedValue({ data: mockResults })

      const result = await labAPI.getPatientResults('patient-123')

      expect(result).toEqual(mockResults)
    })

    it('fetches lab orders', async () => {
      const mockOrders = [{ id: 'order-1' }]
      ;(axios.create as ReturnType<typeof vi.fn>)().get.mockResolvedValue({ data: mockOrders })

      const result = await labAPI.getOrders()

      expect(result).toEqual(mockOrders)
    })

    it('creates lab order for patient', async () => {
      const mockOrder = { id: 'order-new' }
      ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue({ data: mockOrder })

      const result = await labAPI.createOrderForPatient({
        patientId: 'patient-123',
        testNames: ['Blood Test'],
      })

      expect(result).toEqual(mockOrder)
    })
  })

  describe('userAPI', () => {
    it('fetches user profile', async () => {
      const mockProfile = { id: '123', email: 'test@example.com' }
      ;(axios.create as ReturnType<typeof vi.fn>)().get.mockResolvedValue({ data: mockProfile })

      const result = await userAPI.getProfile()

      expect(result).toEqual(mockProfile)
    })

    it('updates user profile', async () => {
      const mockResponse = { success: true }
      ;(axios.create as ReturnType<typeof vi.fn>)().patch.mockResolvedValue({ data: mockResponse })

      const result = await userAPI.updateProfile({ firstName: 'Updated' })

      expect(result).toEqual(mockResponse)
    })

    it('changes password', async () => {
      const mockResponse = { message: 'Password changed' }
      ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue({ data: mockResponse })

      const result = await userAPI.changePassword('oldpass', 'newpass')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('notificationAPI', () => {
    it('fetches notifications', async () => {
      const mockNotifications = [{ id: 'notif-1', message: 'Test' }]
      ;(axios.create as ReturnType<typeof vi.fn>)().get.mockResolvedValue({ data: mockNotifications })

      const result = await notificationAPI.getNotifications()

      expect(result).toEqual(mockNotifications)
    })

    it('marks notification as read', async () => {
      const mockResponse = { success: true }
      ;(axios.create as ReturnType<typeof vi.fn>)().patch.mockResolvedValue({ data: mockResponse })

      const result = await notificationAPI.markAsRead('notif-123')

      expect(result).toEqual(mockResponse)
    })

    it('marks all as read', async () => {
      const mockResponse = { success: true }
      ;(axios.create as ReturnType<typeof vi.fn>)().post.mockResolvedValue({ data: mockResponse })

      const result = await notificationAPI.markAllAsRead()

      expect(result).toEqual(mockResponse)
    })
  })
})
