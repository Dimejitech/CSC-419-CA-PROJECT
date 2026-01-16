import { vi } from 'vitest'

// Mock user data
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  firstName: 'Test',
  lastName: 'User',
  role: 'Patient',
  phone_number: '+1234567890',
  roles: {
    id: 1,
    name: 'Patient',
  },
}

export const mockClinician = {
  id: 'clinician-123',
  email: 'clinician@example.com',
  first_name: 'Dr. Test',
  last_name: 'Clinician',
  firstName: 'Dr. Test',
  lastName: 'Clinician',
  role: 'Clinician',
  roles: {
    id: 2,
    name: 'Clinician',
  },
}

// Mock API responses
export const mockLoginResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: mockUser,
}

export const mockAppointment = {
  id: 'appointment-123',
  patientId: 'user-123',
  clinicianId: 'clinician-123',
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 3600000).toISOString(),
  status: 'SCHEDULED',
  reasonForVisit: 'Regular checkup',
}

export const mockInvoice = {
  id: 'invoice-123',
  patientId: 'user-123',
  totalAmount: 150.0,
  status: 'PENDING',
  createdAt: new Date().toISOString(),
  lineItems: [
    {
      id: 'item-1',
      description: 'Consultation',
      cost: 100.0,
    },
    {
      id: 'item-2',
      description: 'Lab work',
      cost: 50.0,
    },
  ],
}

export const mockLabResult = {
  id: 'result-123',
  testName: 'Blood Test',
  resultValue: 'Normal',
  isVerified: true,
  createdAt: new Date().toISOString(),
}

// Mock authAPI
export const createMockAuthAPI = () => ({
  login: vi.fn().mockResolvedValue(mockLoginResponse),
  register: vi.fn().mockResolvedValue({ success: true }),
  getMe: vi.fn().mockResolvedValue(mockUser),
  refresh: vi.fn().mockResolvedValue(mockLoginResponse),
  logout: vi.fn().mockResolvedValue({ message: 'Logged out' }),
  forgotPassword: vi.fn().mockResolvedValue({ message: 'Email sent' }),
  resetPassword: vi.fn().mockResolvedValue({ message: 'Password reset' }),
})

// Mock schedulingAPI
export const createMockSchedulingAPI = () => ({
  getAvailableSlots: vi.fn().mockResolvedValue([]),
  createBooking: vi.fn().mockResolvedValue(mockAppointment),
  getPatientBookings: vi.fn().mockResolvedValue([mockAppointment]),
  getBooking: vi.fn().mockResolvedValue(mockAppointment),
  updateBooking: vi.fn().mockResolvedValue(mockAppointment),
  cancelBooking: vi.fn().mockResolvedValue({ success: true }),
  getClinicians: vi.fn().mockResolvedValue([mockClinician]),
})

// Mock billingAPI
export const createMockBillingAPI = () => ({
  getInvoices: vi.fn().mockResolvedValue([mockInvoice]),
  getInvoice: vi.fn().mockResolvedValue(mockInvoice),
  getPatientInvoices: vi.fn().mockResolvedValue([mockInvoice]),
  createInvoice: vi.fn().mockResolvedValue(mockInvoice),
  updateInvoice: vi.fn().mockResolvedValue(mockInvoice),
})

// Mock labAPI
export const createMockLabAPI = () => ({
  getPatientResults: vi.fn().mockResolvedValue([mockLabResult]),
  getOrders: vi.fn().mockResolvedValue([]),
  createOrder: vi.fn().mockResolvedValue({ id: 'order-123' }),
})
