# Clinician Dashboard Fix Plan

## Overview
Comprehensive analysis of the CityCare Clinician Dashboard comparing current implementation with design mockups and patient dashboard features.

**Last Updated:** 2026-01-14

---

## Design Reference Screenshots
Located in `/clinician/` folder:
- `clinicianhome1.png` - Dashboard top section (Upcoming Appointment, Quick Actions, Notifications)
- `clinicianhome2.png` - Dashboard bottom section (Payment History, Lab Results)
- `clinicianappointments.png` - Appointments page
- `clinicianpatients.png` - Patients page
- `clinicianlabs.png` - Labs page with stats cards
- `clinicianprofile.png` - Profile Personal Info tab
- `clinicianprofile2.png` - Profile Security tab

---

## Phase 1: Critical Issues - COMPLETED

### 1.1 Logout Buttons Don't Call logout() - FIXED
- Added `logout()` call to all clinician pages

### 1.2 Profile Save Doesn't Call API - FIXED
- Connected to `userAPI.updateProfile()` and `userAPI.changePassword()`

### 1.3 Duplicate ProfileSecurity.tsx - FIXED
- Deleted duplicate file, consolidated into Profile.tsx

---

## Phase 2: Sidebar Navigation Icons - IN PROGRESS

### Issue: Icons Change Between Pages
**Severity:** HIGH
**Status:** FIX APPLIED - NEEDS FRONTEND RESTART

**Problem:** Dashboard.tsx uses inline SVG icons while other pages (Patients, Labs, Profile) use PNG images from `/images/` folder.

**Fix Applied:**
- Updated `Dashboard.tsx` to use image icons: `home.png`, `appointments.png`, `patients.png`, `labs.png`, `profile.png`, `help-circle.png`
- Added `.dashboard-navImg` CSS class

**Action Required:** Restart frontend dev server (`npm run dev` in frontend folder)

---

## Phase 3: Dashboard Home Page Issues

### 3.1 Payment History - Hardcoded Data
**Severity:** MEDIUM
**Status:** PENDING

**Current State:** Payment history shows hardcoded data:
```typescript
const payments = [
  { id: '1', patientName: 'Anna Lee', status: 'Stable', lastVisit: 'Jan 12, 2024' },
  { id: '2', patientName: 'Anna Lee', status: 'Stable', lastVisit: 'Jan 12, 2024' },
];
```

**Design Shows:**
- Table with columns: Patient Name, Status (badge), Last Visit, Action (Review Report)
- "View All Payments >>" link at bottom

**Required Fix:**
- Create API endpoint to get clinician's recent patient visits
- Replace hardcoded data with API call
- Add "View All Payments" navigation

### 3.2 Recent Lab Results - Partial Implementation
**Severity:** LOW
**Status:** PARTIALLY COMPLETE

**Current State:** Shows real API data with hardcoded fallback for empty state

**Design Shows:**
- Lab cards with: Test Name, Patient Name, ID, Progress bar (color-coded), "Review Report" link

**Required Fix:**
- Remove hardcoded fallback data
- Add proper empty state message

### 3.3 Notifications Panel - COMPLETED
**Status:** COMPLETED

- Real-time notifications via API
- Mark as read functionality
- Unread count badge

### 3.4 Quick Actions - Working
**Status:** COMPLETE

- Schedule Appointment → navigates to Appointments
- View Patients → navigates to Patients
- Order Lab → navigates to Labs

---

## Phase 4: Appointments Page Issues

### 4.1 Book Appointment Button
**Severity:** MEDIUM
**Status:** NEEDS IMPLEMENTATION

**Design Shows:** "Book Appointment" button in header

**Current State:** Button exists but functionality needs enhancement

**Required Fix:**
- Add modal to select patient and create appointment slot
- Connect to `schedulingAPI.createSlot()` and booking workflow

### 4.2 Appointment Cards Display
**Severity:** LOW
**Status:** WORKING

- Shows date, time, patient name, reason for visit
- Reschedule modal works
- Cancel functionality works

### 4.3 Real-time Updates When Patient Books/Reschedules
**Severity:** HIGH
**Status:** NEEDS IMPLEMENTATION

**Patient-Clinician Sync Issue:**
When a patient books or reschedules an appointment:
1. Patient dashboard updates correctly
2. Clinician should receive notification (NOW FIXED)
3. Clinician schedule should update on refresh

**Required Fix:**
- Notification now sends to clinician (COMPLETED)
- Consider WebSocket for real-time updates (future enhancement)

---

## Phase 5: Patients Page Issues

### 5.1 CSS Class Naming
**Severity:** LOW
**Status:** PENDING

**Problem:** Uses `labs-*` CSS classes throughout (copy-paste from Labs.tsx)

**Fix:** Rename to `patients-*` for consistency (low priority, works as-is)

### 5.2 Hardcoded Vitals
**Severity:** MEDIUM
**Status:** PENDING

**Current State:** Default vitals shown when no encounter data:
```typescript
bp: '120/80', heartRate: '72', weight: '70', temperature: '36.6'
```

**Required Fix:**
- Show "No vitals recorded" instead of fake data
- Add vitals entry form for clinicians

### 5.3 Prescription Creation - COMPLETED
**Status:** COMPLETED

- Modal form with medication, dosage, frequency, duration
- Creates encounter if needed
- Calls `clinicalAPI.createPrescription()`

### 5.4 Missing Features from Design

| Feature | Design | Current | Status |
|---------|--------|---------|--------|
| Patient Search | Yes | Yes | WORKING |
| Patient Details Panel | Yes | Yes | WORKING |
| Allergy Tags | Yes | Yes | WORKING |
| Vitals Display | Yes | Hardcoded | NEEDS FIX |
| Prescriptions Table | Yes | Yes | WORKING |
| Schedule Appointment Button | Yes | Yes | WORKING |
| Edit Patient | No | Navigates to profile | OK |

---

## Phase 6: Labs Page Issues

### 6.1 Stats Cards
**Severity:** LOW
**Status:** WORKING

**Design Shows:**
- Pending Results (orange) - count
- Urgent / STAT (red) - count
- Completed Today (green) - count

**Current State:** Working with `labAPI.getLabStats()`

### 6.2 Request New Lab
**Severity:** MEDIUM
**Status:** PARTIAL

**Current State:** Opens modal explaining to go to Patients page

**Design Shows:** "Request New Lab" button

**Ideal Fix:**
- Add patient selector to modal
- Allow direct lab order creation
- Connect to `labAPI.createOrder()`

### 6.3 Lab Result Verification
**Severity:** HIGH
**Status:** NEEDS IMPLEMENTATION

**Problem:** `labAPI.verifyResult()` exists but is not used

**Required Fix:**
- Add "Verify" button in lab review modal
- Call API to mark result as verified
- Update status in UI

### 6.4 Pending vs Finished Labs Tables
**Status:** WORKING

- View All toggle works
- Status badges display correctly

---

## Phase 7: Profile Page Issues

### 7.1 Personal Information - WORKING
- First Name, Last Name editable
- Save calls API correctly

### 7.2 Address Fields
**Status:** COMPLETED

- Address, City, State, Zip Code now send to API
- Responsive layout fixed for mobile

### 7.3 Missing Backend Fields
**Severity:** LOW
**Status:** PENDING

Fields in frontend not stored in database:
- `date_of_birth`
- `gender`
- `staff_id` (uses user ID as fallback)

**Fix Options:**
1. Add fields to Prisma schema (database migration)
2. Remove fields from frontend form

### 7.4 Quick Actions (Request Records, Share Profile)
**Severity:** LOW
**Status:** NON-FUNCTIONAL

Buttons exist but don't do anything meaningful.

### 7.5 Avatar Upload
**Severity:** LOW
**Status:** NON-FUNCTIONAL

Edit button visible but no upload functionality.

### 7.6 Password Change - WORKING
- Current, New, Confirm password fields
- Validation with requirements display
- Calls `userAPI.changePassword()`

---

## Phase 8: Cross-Portal Feature Sync

### 8.1 Appointment Notifications - COMPLETED
**Patient Action → Clinician Notification:**

| Patient Action | Clinician Notification | Status |
|----------------|----------------------|--------|
| Books appointment | "New appointment with [Patient] on [Date]" | COMPLETED |
| Cancels appointment | "Appointment cancelled" (patient only) | NEEDS CLINICIAN NOTIF |
| Reschedules | "Appointment rescheduled" (patient only) | NEEDS CLINICIAN NOTIF |

**Fix Applied:**
- Added `notifyClinicianNewAppointment()` method
- Fixed "Dr. Dr." duplicate prefix issue

**Still Needed:**
- Add clinician notification for cancellations
- Add clinician notification for reschedules

### 8.2 Lab Results Flow
**Clinician orders lab → Patient views results:**

| Step | Implementation | Status |
|------|---------------|--------|
| Clinician orders lab | Via Patients page | WORKING |
| Lab technician processes | Backend | WORKING |
| Patient notified | `notifyLabResultReady()` | WORKING |
| Patient views result | Lab Results page | WORKING |

### 8.3 Prescription Flow
**Clinician creates prescription → Patient views:**

| Step | Implementation | Status |
|------|---------------|--------|
| Clinician creates | Patients page modal | WORKING |
| Patient notified | `notifyPrescriptionAdded()` | WORKING |
| Patient views | Prescriptions page | WORKING |

---

## Phase 9: UI/UX Improvements Needed

### 9.1 Hardcoded Avatar Paths
**Problem:** All pages use fixed avatar: `/images/justin.jpg` or `/images/avatar.png`

**Fix:** Use user's actual profile picture or initials fallback

### 9.2 Search Bar Non-Functional
**Problem:** Search input in topbar doesn't filter anything

**Fix:** Implement global search or remove placeholder

### 9.3 Empty States
**Current:** Some pages show "No data" messages
**Design:** Shows friendly empty state illustrations

---

## Implementation Priority

### HIGH Priority (Core Functionality)
1. [ ] Add clinician notifications for appointment cancellations
2. [ ] Add clinician notifications for appointment reschedules
3. [ ] Implement lab result verification workflow
4. [ ] Replace hardcoded Payment History with real data

### MEDIUM Priority (Feature Completeness)
5. [ ] Add vitals entry form in Patients page
6. [ ] Enhance "Request New Lab" with patient selector
7. [ ] Add "Book Appointment" modal for clinicians
8. [ ] Fix hardcoded vitals display

### LOW Priority (Polish)
9. [ ] Rename CSS classes in Patients.tsx
10. [ ] Add profile fields to database
11. [ ] Implement avatar upload
12. [ ] Implement Quick Actions (Request Records, Share)
13. [ ] Add global search functionality

---

## Files to Modify

### Backend
| File | Changes |
|------|---------|
| `notification.service.ts` | Add `notifyClinicianAppointmentCancelled()`, `notifyClinicianAppointmentRescheduled()` |
| `booking.service.ts` | Call clinician notifications on cancel/reschedule |
| `prisma/schema.prisma` | (Optional) Add date_of_birth, gender fields to users |

### Frontend
| File | Changes |
|------|---------|
| `Dashboard.tsx` | Replace hardcoded payments, remove lab fallback data |
| `Patients.tsx` | Add vitals entry form, fix CSS class names |
| `Labs.tsx` | Add verify button, enhance Request Lab modal |
| `Appointments.tsx` | Add Book Appointment modal for clinicians |
| `Profile.tsx` | Avatar upload, Quick Actions implementation |

---

## Testing Checklist

### Patient-Clinician Flow Tests
- [ ] Patient books appointment → Clinician sees notification
- [ ] Patient cancels appointment → Clinician sees notification
- [ ] Patient reschedules → Clinician sees notification & updated schedule
- [ ] Clinician creates prescription → Patient sees in Prescriptions
- [ ] Clinician orders lab → Patient notified when results ready
- [ ] Clinician verifies lab result → Status updates in both portals

### Navigation Tests
- [ ] All sidebar icons consistent across all pages
- [ ] Logout works from all pages
- [ ] Navigation maintains active state correctly

---

## Completed This Session

1. Fixed "Dr. Dr." duplicate prefix in notifications
2. Added `notifyClinicianNewAppointment()` for new bookings
3. Fixed sidebar icons in Dashboard.tsx to use PNG images
4. Added `.dashboard-navImg` CSS class
5. Fixed responsive layout for zipcode field in Profile

---

## Notes

- Frontend changes require dev server restart to take effect
- Backend notification changes are live immediately
- Database schema changes require migration (`npx prisma migrate dev`)
