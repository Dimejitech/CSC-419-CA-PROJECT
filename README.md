# CityCare Healthcare Management System

A full-stack healthcare management system built with NestJS (backend) and React + Vite (frontend). The system implements Domain-Driven Design (DDD) principles with a modular monolithic architecture.

## Key Features

- **4 User Portals:** Patient, Clinician, Lab Technician, and Admin dashboards
- **Role-Based Permissions:** 31 granular permissions across 6 categories
- **Automatic Audit Logging:** PostgreSQL triggers capture all data changes
- **Secure Authentication:** JWT tokens with password reset functionality
- **Complete Healthcare Workflow:** Appointments → Encounters → Lab Orders → Results → Billing

## Project Structure

```
CSC-419-CA-PROJECT/
├── src/                    # Backend source code (NestJS)
│   ├── iam/               # Identity & Access Management (auth, password reset)
│   ├── scheduling/        # Appointment scheduling
│   ├── clinical/          # Clinical/patient management
│   ├── billing/           # Billing & invoices
│   ├── lab/               # Laboratory orders & results
│   ├── admin/             # Admin & permissions management
│   └── notification/      # Notifications system
├── frontend/              # Frontend source code (React + Vite)
│   └── src/
│       ├── pages/         # Page components (Patient, Clinician, Admin, Technician)
│       ├── components/    # Reusable components (Modals, Search, Notifications)
│       ├── services/      # API services
│       └── context/       # React context
├── prisma/                # Database schema & seeds
│   ├── schema.prisma      # Database models
│   ├── seed.ts            # Demo data & permissions seeding
│   └── setup-audit-triggers.sql  # Automatic audit logging triggers
└── CityCareFinalDatabase  # PostgreSQL database dump
```

## Prerequisites

- **Node.js** v18+ (check with `node --version`)
- **npm** v9+ (check with `npm --version`)
- **PostgreSQL** v15+ (check with `psql --version`)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CSC-419-CA-PROJECT
```

### 2. Database Setup

#### Create the database and restore from dump:

```bash
# Create the database
createdb citycare_db

# Restore the database from the dump file
pg_restore -d citycare_db CityCareFinalDatabase
```

**Alternative: If pg_restore doesn't work, create manually:**

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql, run:
CREATE DATABASE citycare_db;
\c citycare_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
\q
```

Then run Prisma migrations:
```bash
npx prisma db push
```

### 3. Backend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed (default values work for local development)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/citycare_db"

# Generate Prisma client
npx prisma generate

# Start the backend server
npm run start:dev
```

The backend will run on **http://localhost:3000**

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on **http://localhost:5173**

## Running the Application

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd CSC-419-CA-PROJECT
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd CSC-419-CA-PROJECT/frontend
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

## Demo Accounts

Use these accounts to test the application:

### Patient Account
| Field | Value |
|-------|-------|
| **Email** | `patient@citycare.com` |
| **Password** | `password123` |
| **Role** | Patient |
| **Portal** | http://localhost:5173/signin |

### Clinician Account
| Field | Value |
|-------|-------|
| **Email** | `clinician@citycare.com` |
| **Password** | `password123` |
| **Role** | Clinician |
| **Portal** | http://localhost:5173/clinician/signin |

### Admin Account
| Field | Value |
|-------|-------|
| **Email** | `admin@citycare.com` |
| **Password** | `password123` |
| **Role** | Admin |
| **Portal** | http://localhost:5173/admin/signin |

### Lab Technician Account
| Field | Value |
|-------|-------|
| **Email** | `technician@citycare.com` |
| **Password** | `password123` |
| **Role** | LabTechnician |
| **Portal** | http://localhost:5173/technician/signin |

---

## Creating New Demo Accounts

If the demo accounts don't exist in your database, you can create them:

### Option 1: Register via the App
1. Go to http://localhost:5173/signup (Patient) or http://localhost:5173/clinician/signup (Clinician)
2. Fill in the registration form
3. Log in with your new credentials

### Option 2: Run the Database Seed (Recommended)
```bash
# This creates ALL demo accounts at once
npm run seed
```

### Option 3: Create via API
```bash
# Create a Patient account
curl -X POST http://localhost:3000/iam/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@citycare.com",
    "password": "password123",
    "firstName": "Demo",
    "lastName": "Patient",
    "role": "Patient"
  }'

# Create a Clinician account
curl -X POST http://localhost:3000/iam/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "clinician@citycare.com",
    "password": "password123",
    "firstName": "Dr. Demo",
    "lastName": "Clinician",
    "role": "Clinician"
  }'

# Create an Admin account
curl -X POST http://localhost:3000/iam/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@citycare.com",
    "password": "password123",
    "firstName": "System",
    "lastName": "Admin",
    "role": "Admin"
  }'

# Create a Lab Technician account
curl -X POST http://localhost:3000/iam/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "technician@citycare.com",
    "password": "password123",
    "firstName": "Peter",
    "lastName": "Parker",
    "role": "LabTechnician"
  }'
```

---

## Features

### Patient Portal
- Book and manage appointments with calendar view
- View medical records and prescriptions
- View verified lab results with abnormality flags
- View invoices and billing history
- Profile management with password reset
- In-app notifications

### Clinician Portal
- Dashboard with today's appointments and pending tasks
- Patient search and chart management
- Create encounters with SOAP notes and vitals
- Order lab tests and verify results
- Write prescriptions with dosage instructions
- Manage appointment schedule and slots

### Admin Portal
- Dashboard with system statistics
- User management (create, edit, activate/deactivate)
- Roles and permissions management (31 permissions across 6 categories)
- Comprehensive audit logs with filtering
- Global search functionality

### Lab Technician Portal
- Dashboard with pending orders and statistics
- Process lab orders and update status
- Upload and manage test results
- View patient information for orders
- Profile and notification management

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/change-password` - Change password (authenticated)
- `GET /auth/me` - Get current user profile
- `PATCH /auth/profile` - Update profile

### Scheduling
- `GET /scheduling/clinicians` - Get all clinicians
- `GET /scheduling/slots/available` - Get available slots
- `POST /scheduling/bookings` - Create booking
- `GET /scheduling/bookings/patient/:id` - Get patient bookings
- `GET /scheduling/clinicians/:id/schedule` - Get clinician schedule

### Clinical
- `GET /clinical/patients/search` - Search patients
- `GET /clinical/charts/:patientId` - Get patient chart
- `POST /clinical/encounters` - Create encounter

### Labs
- `GET /lab/orders` - Get lab orders
- `POST /lab/orders` - Create lab order
- `GET /lab/results` - Get all lab results (technician)
- `PUT /lab/results/:id/verify` - Verify lab result

### Billing
- `GET /billing/invoices/patient/:id` - Get patient invoices

### Admin
- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/users` - Get all users
- `PATCH /admin/users/:id/status` - Activate/deactivate user
- `PATCH /admin/users/:id/role` - Assign role to user
- `GET /admin/permissions` - Get all permissions
- `GET /admin/roles/:roleId/permissions` - Get role permissions
- `PUT /admin/roles/:roleId/permissions` - Update role permissions
- `GET /admin/audit-logs` - Get audit logs

---

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep citycare_db
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

---

## Seeding the Database

To create all demo accounts and permissions in the database, run:

```bash
# From project root
npx ts-node prisma/seed.ts
```

This will create:
- 4 Roles (Patient, Clinician, Admin, LabTechnician)
- 31 Permissions across 6 categories (dashboard, users, appointments, patients, lab, billing, system)
- Default permission assignments for each role
- Demo user accounts for testing
- Sample patient charts, appointments, lab orders, and more

### Setting Up Audit Logging

To enable automatic audit logging via PostgreSQL triggers:

```bash
# Connect to your database and run the triggers script
psql -d citycare_db -f prisma/setup-audit-triggers.sql
```

This creates triggers on all key tables to automatically log INSERT, UPDATE, and DELETE operations.

**To reset and reseed the database:**
```bash
npx prisma db push --force-reset && npx ts-node prisma/seed.ts
```

---

## CI/CD Pipeline (GitHub Actions)

This project uses GitHub Actions for Continuous Integration. The pipeline automatically runs on every push and pull request.

### How to Use GitHub Actions

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **View the CI pipeline:**
   - Go to your GitHub repository
   - Click on the **"Actions"** tab
   - View the running/completed workflows

### What the CI Pipeline Does

| Job | Description |
|-----|-------------|
| **Frontend Build** | Installs dependencies, runs TypeScript check, builds the React app |
| **Backend Build** | Installs dependencies, generates Prisma client, builds NestJS app, runs tests |
| **Code Quality** | Runs linting on both frontend and backend |
| **E2E Tests** | (Main branch only) Sets up test database, runs migrations, seeds data, runs E2E tests |

### CI Status Badge

Add this to your README to show CI status:
```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)
```

---

## Tech Stack

### Backend
- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **TypeScript** - Type safety

---

## Team

CSC-419 Course Project

## License

MIT
