# CityCare Healthcare System - Test Suite Documentation

**Project:** CSC-419-CA-PROJECT
**Total Tests:** 173 (90 Frontend + 83 Backend)
**Test Frameworks:** Vitest (Frontend), Jest (Backend)
**Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Test Configuration](#test-configuration)
3. [Frontend Tests (90 Tests)](#frontend-tests-90-tests)
4. [Backend Tests (83 Tests)](#backend-tests-83-tests)
5. [Running the Tests](#running-the-tests)
6. [CI/CD Integration](#cicd-integration)

---

## Overview

This document provides a comprehensive listing of all automated tests in the CityCare Healthcare System. The test suite covers:

- **Unit Tests:** Individual component and function testing
- **Integration Tests:** Testing interactions between modules
- **Service Tests:** API service method verification
- **Controller Tests:** HTTP endpoint testing

### Test Summary

| Category | Test Files | Total Tests | Status |
|----------|-----------|-------------|--------|
| Frontend Components | 3 | 39 | ✅ Passing |
| Frontend Context | 1 | 9 | ✅ Passing |
| Frontend Services | 1 | 23 | ✅ Passing |
| Frontend Pages | 2 | 19 | ✅ Passing |
| Backend Controllers | 6 | 46 | ✅ Passing |
| Backend Services | 2 | 37 | ✅ Passing |
| **Total** | **15** | **173** | ✅ **All Passing** |

---

## Test Configuration

### Frontend (Vitest)

**Configuration File:** `frontend/vitest.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

**Dependencies:**
- `vitest` ^1.1.0
- `@testing-library/react` ^14.1.2
- `@testing-library/jest-dom` ^6.1.5
- `@testing-library/user-event` ^14.5.1
- `jsdom` ^23.0.1

### Backend (Jest)

**Configuration:** Embedded in `package.json`

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "testEnvironment": "node"
  }
}
```

**Dependencies:**
- `jest` ^30.0.0
- `@nestjs/testing` ^11.0.1
- `ts-jest` ^29.2.5

---

## Frontend Tests (90 Tests)

### 1. Button Component Tests
**File:** `frontend/src/components/Button/Button.test.tsx`
**Tests:** 14

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | renders children correctly | Verifies button text content renders |
| 2 | applies primary variant by default | Checks default variant styling |
| 3 | applies secondary variant when specified | Verifies secondary variant class |
| 4 | applies ghost variant when specified | Verifies ghost variant class |
| 5 | applies outline variant when specified | Verifies outline variant class |
| 6 | applies large size by default | Checks default size styling |
| 7 | applies small size when specified | Verifies small size class |
| 8 | applies medium size when specified | Verifies medium size class |
| 9 | applies fullWidth class when fullWidth is true | Tests full width styling |
| 10 | does not apply fullWidth class when fullWidth is false | Verifies fullWidth is not applied |
| 11 | handles click events | Tests onClick handler execution |
| 12 | can be disabled | Verifies disabled state prevents clicks |
| 13 | passes additional props to button element | Tests prop forwarding (type, etc.) |
| 14 | merges custom className with default classes | Verifies className merging |

---

### 2. Input Component Tests
**File:** `frontend/src/components/Input/Input.test.tsx`
**Tests:** 18

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | renders input element | Verifies input renders with placeholder |
| 2 | renders label when provided | Tests label rendering |
| 3 | shows required indicator when required is true | Verifies asterisk appears |
| 4 | does not show required indicator when required is false | Verifies no asterisk |
| 5 | renders hint text when provided | Tests hint text display |
| 6 | renders error text and applies error styles | Verifies error state |
| 7 | shows error text instead of hint when both are provided | Tests error priority |
| 8 | renders left icon when provided | Tests left icon slot |
| 9 | renders right icon when provided | Tests right icon slot |
| 10 | handles onChange events | Verifies change handler |
| 11 | handles onFocus events | Tests focus handler |
| 12 | handles onBlur events | Tests blur handler |
| 13 | can be disabled | Verifies disabled state |
| 14 | respects type prop | Tests input type attribute |
| 15 | shows password toggle button when showPasswordToggle is true | Tests password toggle visibility |
| 16 | toggles password visibility when toggle button is clicked | Verifies password show/hide |
| 17 | does not show toggle button when type is not password | Tests toggle conditional render |
| 18 | does not show right icon when password toggle is shown | Verifies toggle takes precedence |

---

### 3. ProtectedRoute Component Tests
**File:** `frontend/src/components/ProtectedRoute/ProtectedRoute.test.tsx`
**Tests:** 7

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | shows loading state when authentication is loading | Verifies loading spinner |
| 2 | redirects to login when not authenticated | Tests unauthenticated redirect |
| 3 | renders children when authenticated | Verifies authenticated access |
| 4 | renders children when user has required role (from user.role) | Tests role-based access |
| 5 | renders children when user has required role (from user.roles.name) | Tests nested role object |
| 6 | redirects to home when user lacks required role | Tests unauthorized redirect |
| 7 | allows access without requiredRole when authenticated | Tests general auth access |

---

### 4. AuthContext Tests
**File:** `frontend/src/context/AuthContext.test.tsx`
**Tests:** 9

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | provides initial loading state | Verifies initial state |
| 2 | user is null when not authenticated | Tests unauthenticated state |
| 3 | throws error when useAuth is used outside AuthProvider | Tests context requirement |
| 4 | checks for existing token on mount | Verifies token restoration |
| 5 | clears token when getMe fails on mount | Tests invalid token handling |
| 6 | successfully logs in user | Tests login flow |
| 7 | handles login failure | Tests login error handling |
| 8 | successfully logs out user | Tests logout flow |
| 9 | clears user even if logout API fails | Tests graceful logout failure |

---

### 5. API Service Tests
**File:** `frontend/src/services/api.test.ts`
**Tests:** 23

#### authAPI (7 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 1 | stores tokens on successful login | Verifies token storage |
| 2 | clears tokens on logout | Tests token removal |
| 3 | clears tokens even when no refresh token exists | Tests edge case |
| 4 | calls register endpoint with correct data | Verifies registration |
| 5 | fetches current user data | Tests getMe endpoint |
| 6 | throws when no refresh token available | Tests refresh validation |
| 7 | stores new tokens on successful refresh | Tests token refresh |

#### schedulingAPI (4 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 8 | fetches available slots | Tests slot retrieval |
| 9 | creates a booking | Tests booking creation |
| 10 | fetches patient bookings | Tests booking list |
| 11 | cancels a booking | Tests booking cancellation |

#### billingAPI (3 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 12 | fetches invoices | Tests invoice list |
| 13 | fetches patient invoices | Tests patient-specific invoices |
| 14 | creates an invoice | Tests invoice creation |

#### labAPI (3 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 15 | fetches patient results | Tests lab results retrieval |
| 16 | fetches lab orders | Tests order list |
| 17 | creates lab order for patient | Tests order creation |

#### userAPI (3 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 18 | fetches user profile | Tests profile retrieval |
| 19 | updates user profile | Tests profile update |
| 20 | changes password | Tests password change |

#### notificationAPI (3 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 21 | fetches notifications | Tests notification list |
| 22 | marks notification as read | Tests single mark read |
| 23 | marks all as read | Tests bulk mark read |

---

### 6. SignIn Page Tests
**File:** `frontend/src/pages/SignIn/SignIn.test.tsx`
**Tests:** 12

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | renders sign in form | Verifies form elements render |
| 2 | shows validation errors for empty fields | Tests required validation |
| 3 | does not call login with invalid email format | Tests email validation |
| 4 | calls login with form data on valid submission | Tests successful submission |
| 5 | shows loading state while submitting | Verifies loading indicator |
| 6 | displays error message on login failure | Tests error display |
| 7 | navigates to home on successful patient login | Tests navigation |
| 8 | has link to forgot password page | Verifies forgot password link |
| 9 | has link to sign up page | Verifies sign up link |
| 10 | has link to clinician sign in | Verifies clinician link |
| 11 | clears field error when user starts typing | Tests error clearing |
| 12 | displays security note | Verifies security message |

---

### 7. Home Page Tests
**File:** `frontend/src/pages/Home/Home.test.tsx`
**Tests:** 7

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | renders home page title | Verifies page title |
| 2 | renders welcome text | Tests welcome message |
| 3 | renders book appointment quick action | Verifies appointment action |
| 4 | renders medical records quick action | Verifies records action |
| 5 | renders lab results quick action | Verifies lab action |
| 6 | renders pay your bill quick action | Verifies billing action |
| 7 | renders book now button | Verifies CTA button |

---

## Backend Tests (83 Tests)

### 1. App Controller Tests
**File:** `src/app.controller.spec.ts`
**Tests:** 1

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should return "Hello World!" | Verifies root endpoint |

---

### 2. IAM Service Tests
**File:** `src/iam/iam.service.spec.ts`
**Tests:** 19

#### Register (4 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should successfully register a new patient | Tests patient registration |
| 2 | should successfully register a new clinician | Tests clinician registration |
| 3 | should hash password before storing | Verifies password hashing |
| 4 | should default to Patient role if not specified | Tests default role |

#### Login (5 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 5 | should successfully login with valid credentials | Tests successful login |
| 6 | should throw UnauthorizedException for non-existent user | Tests invalid user |
| 7 | should throw UnauthorizedException for wrong password | Tests invalid password |
| 8 | should throw UnauthorizedException for inactive user | Tests inactive account |
| 9 | should return JWT token on successful login | Verifies token generation |

#### GetMe (2 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 10 | should return user profile for valid user ID | Tests profile retrieval |
| 11 | should return null for non-existent user | Tests missing user |

#### ChangePassword (3 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 12 | should change password with valid current password | Tests password change |
| 13 | should throw UnauthorizedException for wrong current password | Tests invalid current |
| 14 | should throw UnauthorizedException for non-existent user | Tests missing user |

#### ForgotPassword (2 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 15 | should return success message for existing user | Tests forgot password |
| 16 | should return success message for non-existent user | Tests enumeration protection |

#### ResetPassword (2 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 17 | should reset password with valid token | Tests password reset |
| 18 | should throw BadRequestException for invalid token | Tests invalid token |

#### UpdateProfile (1 test)
| # | Test Name | Description |
|---|-----------|-------------|
| 19 | should update user profile | Tests profile update |

---

### 3. IAM Controller Tests
**File:** `src/iam/iam.controller.spec.ts`
**Tests:** 5

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should be defined | Verifies controller instantiation |
| 2 | should register a new user | Tests register endpoint |
| 3 | should login a user | Tests login endpoint |
| 4 | should handle forgot password request | Tests forgot password endpoint |
| 5 | should reset password | Tests reset password endpoint |

---

### 4. Clinical Service Tests
**File:** `src/clinical/clinical.service.spec.ts`
**Tests:** 17

#### Patient Chart (2 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should return patient chart when found | Tests chart retrieval |
| 2 | should throw NotFoundException when chart not found | Tests missing chart |

#### Search Patients (2 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 3 | should return all patients when no query provided | Tests list all |
| 4 | should search patients by query | Tests search |

#### Create Encounter (3 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 5 | should create encounter successfully | Tests encounter creation |
| 6 | should throw NotFoundException when chart not found | Tests missing chart |
| 7 | should throw ForbiddenException when user is not a clinician | Tests role check |

#### Get/Update Encounter (4 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 8 | should return encounter when found | Tests encounter retrieval |
| 9 | should throw NotFoundException when encounter not found | Tests missing encounter |
| 10 | should update encounter status | Tests status update |
| 11 | should emit event when encounter is completed | Tests event emission |

#### SOAP Notes (3 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 12 | should create new SOAP note | Tests note creation |
| 13 | should update existing SOAP note | Tests note update |
| 14 | should throw BadRequestException for cancelled encounter | Tests validation |

#### Prescriptions (3 tests)
| # | Test Name | Description |
|---|-----------|-------------|
| 15 | should create prescription successfully | Tests prescription creation |
| 16 | should throw BadRequestException when patient is allergic | Tests allergy check |
| 17 | should throw BadRequestException for cancelled encounter | Tests validation |

---

### 5. Clinical Controller Tests
**File:** `src/clinical/clinical.controller.spec.ts`
**Tests:** 10

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should be defined | Verifies controller instantiation |
| 2 | should return a patient chart | Tests getPatientChart |
| 3 | should search patients with valid query | Tests searchPatients |
| 4 | should create a patient chart | Tests createChart |
| 5 | should update a patient chart | Tests updateChart |
| 6 | should add an allergy to a chart | Tests addAllergy |
| 7 | should create an encounter | Tests createEncounter |
| 8 | should return an encounter | Tests getEncounter |
| 9 | should create a SOAP note | Tests createSoapNote |
| 10 | should create a prescription | Tests createPrescription |

---

### 6. Lab Controller Tests
**File:** `src/lab/lab.controller.spec.ts`
**Tests:** 8

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should be defined | Verifies controller instantiation |
| 2 | should create a new lab order | Tests createOrder |
| 3 | should return all orders | Tests getOrders |
| 4 | should filter orders by status | Tests order filtering |
| 5 | should return a specific order | Tests getOrderById |
| 6 | should return all results | Tests getAllResults |
| 7 | should verify a result | Tests verifyResult |
| 8 | should return verification statistics | Tests getStats |

---

### 7. Billing Controller Tests
**File:** `src/billing/billing.controller.spec.ts`
**Tests:** 8

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should be defined | Verifies controller instantiation |
| 2 | should create an invoice | Tests createInvoice |
| 3 | should return all invoices | Tests findAll |
| 4 | should return patient invoices | Tests findPatientInvoices |
| 5 | should return a single invoice | Tests findOne |
| 6 | should update invoice status | Tests updateStatus |
| 7 | should add a line item to invoice | Tests addLineItem |
| 8 | should delete a line item | Tests deleteLineItem |

---

### 8. Scheduling Controller Tests
**File:** `src/scheduling/scheduling.controller.spec.ts`
**Tests:** 12

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | should be defined | Verifies controller instantiation |
| 2 | should create a booking | Tests createBooking |
| 3 | should return patient appointments | Tests getPatientAppointments |
| 4 | should return a booking by id | Tests getBookingById |
| 5 | should cancel a booking | Tests cancelBooking |
| 6 | should reschedule a booking | Tests rescheduleBooking |
| 7 | should return list of clinicians | Tests getClinicians |
| 8 | should create a slot | Tests createSlot |
| 9 | should return available slots | Tests getAvailableSlots |
| 10 | should delete a slot | Tests deleteSlot |
| 11 | should register a walk-in patient | Tests registerWalkIn |
| 12 | should get encounter prescriptions | Tests getEncounterPrescriptions |

---

## Running the Tests

### Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Run all tests
npm run test

# Run tests once (no watch mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Backend Tests

```bash
# From project root
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Run All Tests

```bash
# Backend tests
npm run test

# Frontend tests
cd frontend && npm run test:run
```

---

## CI/CD Integration

The test suite is integrated with GitHub Actions. On every push to `main`, `develop`, or `feature/*` branches:

1. **Frontend Job:**
   - Installs dependencies
   - Runs TypeScript type check
   - Builds the application

2. **Backend Job:**
   - Installs dependencies
   - Generates Prisma client
   - Runs TypeScript type check
   - Builds the application
   - Runs unit tests

3. **E2E Tests (main branch only):**
   - Spins up PostgreSQL service
   - Runs database migrations
   - Seeds test data
   - Executes E2E test suite

**Workflow File:** `.github/workflows/ci.yml`

---

## Test Coverage Goals

| Module | Target Coverage | Current Status |
|--------|-----------------|----------------|
| Components | 80% | ✅ Achieved |
| Services | 75% | ✅ Achieved |
| Controllers | 70% | ✅ Achieved |
| Context/State | 85% | ✅ Achieved |

---

## Contributing

When adding new features:

1. Write tests alongside your code
2. Ensure all existing tests pass
3. Maintain minimum 70% coverage
4. Follow existing test patterns and naming conventions

---

*Document generated for CSC-419 Course Assessment Project*
