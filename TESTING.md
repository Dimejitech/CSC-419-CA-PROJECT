# CityCare Test Suite Documentation

This document explains how to run and use the test suite for the CityCare Healthcare Management System.

## Test Overview

The test suite includes:
- **Unit Tests**: Test individual services in isolation
- **E2E Tests**: Test full API flows and integrations

## Quick Start

### Run All Unit Tests
```bash
npm run test
```

### Run Tests in Watch Mode (for development)
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:cov
```

### Run E2E Tests
```bash
npm run test:e2e
```

---

## Test Structure

```
src/
├── iam/
│   └── iam.service.spec.ts          # Authentication tests
├── scheduling/
│   └── services/
│       ├── booking.service.spec.ts   # Booking tests
│       └── slot.service.spec.ts      # Slot management tests
├── billing/
│   └── billing.service.spec.ts       # Billing/Invoice tests
├── lab/
│   └── lab.service.spec.ts           # Lab order/result tests
└── clinical/
    └── clinical.service.spec.ts      # Clinical/Patient tests

test/
└── app.e2e-spec.ts                   # End-to-end API tests
```

---

## Unit Tests by Module

### 1. IAM (Authentication) Tests
**File**: `src/iam/iam.service.spec.ts`

Tests:
- ✅ Patient registration
- ✅ Clinician registration
- ✅ Password hashing
- ✅ Login with valid credentials
- ✅ Login rejection for wrong password
- ✅ Login rejection for inactive user
- ✅ JWT token generation
- ✅ User validation

**Run**:
```bash
npm run test -- --testPathPattern=iam
```

### 2. Scheduling Tests
**Files**:
- `src/scheduling/services/booking.service.spec.ts`
- `src/scheduling/services/slot.service.spec.ts`

Tests:
- ✅ Create booking for available slot
- ✅ Reject booking for non-existent slot
- ✅ Reject booking for already booked slot
- ✅ Get patient bookings
- ✅ Cancel booking
- ✅ Create time slots
- ✅ Get available slots
- ✅ Get clinician schedule

**Run**:
```bash
npm run test -- --testPathPattern=scheduling
```

### 3. Billing Tests
**File**: `src/billing/billing.service.spec.ts`

Tests:
- ✅ Create invoice with line items
- ✅ Calculate total amount
- ✅ Get patient invoices
- ✅ Get invoice by ID
- ✅ Update invoice status
- ✅ Calculate outstanding balance

**Run**:
```bash
npm run test -- --testPathPattern=billing
```

### 4. Lab Tests
**File**: `src/lab/lab.service.spec.ts`

Tests:
- ✅ Create lab order with test items
- ✅ Create STAT priority orders
- ✅ Get lab orders
- ✅ Filter orders by status
- ✅ Update order status
- ✅ Upload lab results
- ✅ Verify lab results
- ✅ Get unverified results
- ✅ Get lab statistics

**Run**:
```bash
npm run test -- --testPathPattern=lab
```

---

## E2E (End-to-End) Tests

**File**: `test/app.e2e-spec.ts`

These tests run against the actual API and test full user flows.

### Test Scenarios:

#### Authentication
- Register new patient
- Register new clinician
- Reject duplicate email
- Login with valid credentials
- Reject invalid credentials

#### Scheduling
- Get list of clinicians
- Create appointment slot
- Get available slots
- Get patient bookings
- Get clinician schedule

#### Clinical
- Search patients
- Get patient chart

#### Billing
- Get patient invoices
- Get outstanding balance

#### Labs
- Get lab orders
- Filter by status
- Get unverified results
- Get lab statistics

#### Authorization
- Reject requests without token
- Reject requests with invalid token

**Run**:
```bash
npm run test:e2e
```

---

## Running Tests with Specific Options

### Run a single test file:
```bash
npm run test -- src/iam/iam.service.spec.ts
```

### Run tests matching a pattern:
```bash
npm run test -- --testNamePattern="login"
```

### Run tests with verbose output:
```bash
npm run test -- --verbose
```

### Run tests and generate coverage report:
```bash
npm run test:cov
```
Coverage report will be in `coverage/` directory.

---

## Test Data / Demo Accounts

For E2E tests, the system uses dynamically generated test accounts. For manual testing, use:

| Role | Email | Password |
|------|-------|----------|
| Patient | `patient@citycare.com` | `password123` |
| Clinician | `clinician@citycare.com` | `password123` |
| Admin | `admin@citycare.com` | `password123` |

---

## Writing New Tests

### Unit Test Template:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';
import { PrismaService } from '../prisma/prisma.service';

describe('YourService', () => {
  let service: YourService;

  const mockPrismaService = {
    // Mock your database methods
    yourModel: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YourService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<YourService>(YourService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('yourMethod', () => {
    it('should do something', async () => {
      mockPrismaService.yourModel.create.mockResolvedValue({ id: '123' });

      const result = await service.yourMethod();

      expect(result).toHaveProperty('id');
    });
  });
});
```

---

## Troubleshooting

### Tests fail with database errors:
- Make sure your database is running
- Run `npx prisma generate` to ensure Prisma client is up to date

### E2E tests timeout:
- Increase Jest timeout in `test/jest-e2e.json`:
```json
{
  "testTimeout": 30000
}
```

### Module not found errors:
- Run `npm install` to ensure all dependencies are installed

---

## CI/CD Integration

Add to your CI pipeline:
```yaml
# GitHub Actions example
- name: Run Tests
  run: |
    npm ci
    npm run test -- --coverage
    npm run test:e2e
```

---

## Test Coverage Goals

| Module | Target Coverage |
|--------|-----------------|
| IAM | 80%+ |
| Scheduling | 80%+ |
| Billing | 75%+ |
| Lab | 75%+ |
| Clinical | 70%+ |

Run `npm run test:cov` to check current coverage.
