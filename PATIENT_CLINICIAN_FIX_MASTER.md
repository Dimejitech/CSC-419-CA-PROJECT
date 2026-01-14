# CityCare Patient & Clinician Fix Master Plan

## Executive Summary
Complete element-by-element analysis of all Patient Dashboard pages. Every button, link, text field, and interactive element has been documented.

---

# PART 1: COMPLETE ELEMENT ANALYSIS

## PAGE 1: HOME (/home)

### HEADER (Global - appears on all pages)
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 1 | CityCare logo | Displays | Click → Navigate to Home | VERIFY |
| 2 | Search bar | Displays placeholder "Search..." | Should search patients/records | NOT IMPLEMENTED |
| 3 | Notification bell icon | Displays | Click → Show notifications dropdown | VERIFY |
| 4 | User avatar | Displays stock photo | Should show user's photo or initials | VERIFY |
| 5 | User name display | Shows "undefined undefined" | Should show "Demo Patient" | **BUG - CRITICAL** |
| 6 | Role badge "Patient" | Displays correctly | Shows user role | WORKING |

### SIDEBAR NAVIGATION (Global)
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 7 | Hamburger menu icon | Displays | Toggle sidebar collapse | VERIFY |
| 8 | Home link | Active state (blue highlight) | Navigate to / | WORKING |
| 9 | Appointments link | Displays | Navigate to /appointments | VERIFY |
| 10 | Medical Records link | Displays | Navigate to /medical-records | VERIFY |
| 11 | Prescriptions link | Displays | Navigate to /prescriptions | VERIFY |
| 12 | Lab Results link | Displays | Navigate to /lab-results | VERIFY |
| 13 | Billing link | Has red notification dot | Navigate to /billing | VERIFY (what triggers dot?) |
| 14 | Profile link | Displays | Navigate to /profile | VERIFY |
| 15 | Help / Support link | Displays | Navigate to /help | VERIFY |
| 16 | Logout button | Displays (red text) | Logout → redirect to /login | VERIFY |

### UPCOMING APPOINTMENT CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 17 | Gradient calendar icon | Displays | Decorative | WORKING |
| 18 | "Upcoming Appointment" title | Displays | Section header | WORKING |
| 19 | Appointment content | "No upcoming appointments" | Should show next appointment with date/time/doctor | **BUG - DATA** |
| 20 | "Book Appointment" button | Displays (blue, full-width) | Navigate to /appointments/book | VERIFY |

**When appointment exists, should show:**
- Date and time
- Doctor name
- Appointment type/reason
- "View Details" button
- "Reschedule" button

### NOTIFICATIONS CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 21 | "Notifications" header | Displays | Section header | WORKING |
| 22 | Empty bell icon | Displays | Empty state indicator | WORKING |
| 23 | "You have no notifications" | Displays | Empty state message | EXPECTED (no notification system) |

### QUICK ACTIONS SECTION
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 24 | "Quick Actions" title | Displays | Section header | WORKING |

**Book Appointment Card:**
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 25 | Calendar icon (blue) | Displays | Decorative | WORKING |
| 26 | "Book Appointment" title | Displays | Card title | WORKING |
| 27 | Description | "Schedule a visit with your doctor." | Description text | WORKING |
| 28 | "Book Now" button | Displays (blue filled) | Navigate to /appointments/book | VERIFY |

**Medical Records Card:**
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 29 | Archive icon (green) | Displays | Decorative | WORKING |
| 30 | "Medical Records" title | Displays | Card title | WORKING |
| 31 | Description | "View your history and reports." | Description text | WORKING |
| 32 | "View Records" button | Displays (outline) | Navigate to /medical-records | VERIFY |

**Lab Results Card:**
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 33 | Lab icon (purple) | Displays | Decorative | WORKING |
| 34 | "Lab Results" title | Displays | Card title | WORKING |
| 35 | Description | "Check your latest test outcomes." | Description text | WORKING |
| 36 | "View Results" button | Displays (outline) | Navigate to /lab-results | VERIFY |

**Pay Your Bill Card:**
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 37 | Credit card icon (orange) | Displays | Decorative | WORKING |
| 38 | "Pay Your Bill" title | Displays | Card title | WORKING |
| 39 | Description | "Check your latest test outcomes." | Should say "View and pay your bills" | **BUG - COPY ERROR** |
| 40 | "Pay Bill" button | Displays (outline) | Navigate to /billing | VERIFY |

### HEALTH SUMMARY CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 41 | Healthcare icon (gradient) | Displays | Decorative | WORKING |
| 42 | "Health Summary" title | Displays | Section header | WORKING |
| 43 | Heart icon | Displays (red) | Decorative | WORKING |
| 44 | "Latest Diagnosis:" label | Displays | Label | WORKING |
| 45 | Diagnosis value | "No recent diagnosis" | Should show from SOAP notes assessment | **BUG - DATA** |
| 46 | Document icon | Displays (blue) | Decorative | WORKING |
| 47 | "Current Medications:" label | Displays | Label | WORKING |
| 48 | Medications value | "View in Medical Records" | Should be clickable link OR show actual meds | **BUG - NOT CLICKABLE** |
| 49 | Lab icon | Displays (green) | Decorative | WORKING |
| 50 | "Recent Lab Results:" label | Displays | Label | WORKING |
| 51 | Lab results value | "View in Lab Results" | Should be clickable link OR show actual results | **BUG - NOT CLICKABLE** |

### BILLING OVERVIEW CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 52 | "Billing Overview" header | Displays (coral/red) | Section header | WORKING |
| 53 | "Outstanding Balance:" label | Displays | Label | WORKING |
| 54 | Balance amount | "₦0" | Should show actual outstanding balance | **BUG - DATA** |
| 55 | "View Bills" button | Displays (teal, full-width) | Navigate to /billing | VERIFY |

---

## PAGE 2: APPOINTMENTS (/appointments)

### PAGE CONTENT
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 56 | "Appointments" page title | Displays | Page header | WORKING |
| 57 | "Book Appointment" button (top-right) | Displays (blue) | Navigate to /appointments/book | VERIFY |

### UPCOMING APPOINTMENTS SECTION
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 58 | "Upcoming Appointments" header | Displays (teal) | Section header | WORKING |
| 59 | Appointments list | "No upcoming appointments" | Should show upcoming appointment cards | **BUG - DATA** |
| 60 | "Book an Appointment" button | Displays (blue, full-width) | Navigate to /appointments/book | VERIFY |

### PAST APPOINTMENTS SECTION
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 61 | "Past Appointments" header | Displays (teal) | Section header | WORKING |
| 62 | Past appointments list | "No past appointments" | Should show past appointment cards | **BUG - DATA** |

**When appointments exist, each card should have:**
- Date and time
- Doctor name and specialty
- Appointment reason
- Status badge (Confirmed/Pending/Completed/Cancelled)
- "View Details" button
- "Cancel" button (for upcoming)
- "Reschedule" button (for upcoming)
- "View Summary" button (for past)

---

## PAGE 3: MEDICAL RECORDS (/medical-records)

### BREADCRUMB
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 63 | "Medical Records > Overview" | Displays | Breadcrumb navigation | Should be clickable? VERIFY |

### PAGE HEADER
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 64 | "Medical Records" title | Displays | Page header | WORKING |
| 65 | Subtitle | "A summary of your health information..." | Description | WORKING |

### PATIENT INFO CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 66 | Patient avatar | Displays | User photo | WORKING |
| 67 | Patient name | "Patient" | Should show "Demo Patient" | **BUG - DATA** |
| 68 | "Date of Birth:" label | Displays | Label | WORKING |
| 69 | DOB value | "Not specified" | Should show actual DOB from patient_charts | **BUG - DATA** |
| 70 | "Blood Group:" label | Displays | Label | WORKING |
| 71 | Blood group value | "O+" | Correct from seed data | WORKING |

### TAB NAVIGATION
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 72 | "Overview" tab | Active (blue) | Show overview content | WORKING |
| 73 | "Visit History" tab | Inactive | Click → Show visit history | VERIFY FUNCTIONALITY |

### DIAGNOSES CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 74 | "Diagnoses" header | Displays | Card title | WORKING |
| 75 | Diagnoses content | "No diagnoses on record" | Should show from SOAP assessments | **BUG - DATA** |

### CURRENT MEDICATIONS CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 76 | "Current Medications" header | Displays | Card title | WORKING |
| 77 | Medications content | "View prescriptions for current medications" | Should show actual prescriptions OR be a link | **BUG - DATA/LINK** |

### RECENT LAB RESULTS CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 78 | "Recent Lab Results" header | Displays | Card title | WORKING |
| 79 | Lab results content | "View lab results for recent tests" | Should show actual results OR be a link | **BUG - DATA/LINK** |

---

## PAGE 4: PRESCRIPTIONS (/prescriptions)

### BREADCRUMB
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 80 | "Medical Records > Prescriptions" | Displays | Breadcrumb navigation | Should be clickable? VERIFY |

### PAGE HEADER
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 81 | "Prescriptions" title | Displays | Page header | WORKING |
| 82 | Subtitle | "A summary of your health information..." | Description | WORKING |

### PATIENT INFO
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 83 | Patient avatar | Displays | User photo | WORKING |
| 84 | Patient name | "Patient" | Should show "Demo Patient" | **BUG - DATA** |
| 85 | DOB value | "Not specified" | Should show actual DOB | **BUG - DATA** |
| 86 | Blood group value | "O+" | Correct | WORKING |

### PRESCRIPTION CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 87 | Medication name | "Ibuprofen 400mg" | Correct from seed | WORKING |
| 88 | Doctor name | "Dr." | Should show "Dr. Sarah Johnson" | **BUG - DATA** |
| 89 | Instructions | "Every 6 hours as needed - Follow prescribed instructions" | Correct | WORKING |
| 90 | Status badge | "Active" (green) | Prescription status | WORKING |
| 91 | Date | "Invalid Date" | Should show prescription date | **BUG - CRITICAL** |

**Missing elements for prescriptions:**
- Refill Request button
- View Details/Expand button
- Prescription start/end dates
- Pharmacy info
- Prescribing encounter reference

---

## PAGE 5: LAB RESULTS (/lab-results)

### PAGE HEADER
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 92 | "Lab Results" title | Displays | Page header | WORKING |
| 93 | Subtitle | "Results from your clinic visits, reviewed by your care team." | Description | WORKING |

### STATS CARDS
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 94 | "Total Tests" card (teal bg) | Shows "0" | Should show count of all tests | **BUG - DATA** |
| 95 | "Normal" card (green bg) | Shows "0" | Should show count of normal results | **BUG - DATA** |
| 96 | "Abnormal" card (pink bg) | Shows "0" | Should show count of abnormal results | **BUG - DATA** |

### FILTER CONTROLS
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 97 | "All Tests" dropdown | Displays | Filter by test type | VERIFY FUNCTIONALITY |
| 98 | "Last 30 days" dropdown | Displays | Filter by date range | VERIFY FUNCTIONALITY |
| 99 | "Sort: Severity" dropdown | Displays | Sort results | VERIFY FUNCTIONALITY |

### RESULTS LIST
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 100 | Results content | "No lab results found" | Should show lab result cards | **BUG - DATA** |

**When results exist, each card should have:**
- Test name
- Date performed
- Result value
- Normal/Abnormal badge
- Reference range
- "View Details" button
- "Download" button

---

## PAGE 6: BILLING (/billing)

### BALANCE SECTION
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 101 | "Outstanding Balance" label | Displays | Label | WORKING |
| 102 | Balance amount | "₦0" | Should show actual outstanding amount | **BUG - DATA** |
| 103 | "Pay Now" button | Displays (coral/red) | Open payment flow | VERIFY FUNCTIONALITY |

### RECENT INVOICES CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 104 | "Recent Invoices" header | Displays | Card title | WORKING |
| 105 | Invoices list | "No invoices found" | Should show invoice list | **BUG - DATA** |

### PAYMENT HISTORY CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 106 | "Payment History" header | Displays | Card title | WORKING |
| 107 | Payment list | "No payment history" | Should show payment records | **BUG - DATA** (no payments table in DB) |

**When invoices exist, each card should have:**
- Invoice number
- Date
- Amount
- Status badge (Draft/Pending/Paid/Overdue)
- "View" button
- "Pay" button (if unpaid)
- "Download" button

---

## PAGE 7: PROFILE - PERSONAL INFO (/profile)

### BREADCRUMB
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 108 | "Profile > Personal Info" | Displays | Breadcrumb navigation | Should be clickable? VERIFY |

### PAGE HEADER
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 109 | "My Profile" title | Displays | Page header | WORKING |
| 110 | Subtitle | "Manage your account information and preferences." | Description | WORKING |
| 111 | "Save Changes" button (top-right) | Displays (blue) | Save all form changes | VERIFY FUNCTIONALITY |

### TAB NAVIGATION
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 112 | "Personal Info" tab | Active (blue) | Show personal info form | WORKING |
| 113 | "Security" tab | Inactive | Click → Show security settings | VERIFY |

### PROFILE SIDEBAR CARD
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 114 | User avatar | Displays | User photo with edit option? | VERIFY edit functionality |
| 115 | Online indicator (teal dot) | Displays | Shows online status | WORKING |
| 116 | Email address | "patient@citycare.com" | User email | WORKING |
| 117 | "Active Patient" badge | Displays (green) | Account status | WORKING |

### QUICK ACTIONS (Profile Sidebar)
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 118 | "Request Records" button | Displays with refresh icon | Click → ??? | **BUG - FUNCTIONALITY UNKNOWN** |
| 119 | Chevron icon (>) | Displays | Indicates action | - |
| 120 | "Share Profile" button | Displays with share icon | Click → ??? | **BUG - FUNCTIONALITY UNKNOWN** |
| 121 | Chevron icon (>) | Displays | Indicates action | - |

### PERSONAL INFORMATION FORM
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 122 | "Personal Information" header | Displays | Section header | WORKING |
| 123 | "Edit Info" button | Displays (outline) | Enable form editing | VERIFY FUNCTIONALITY |
| 124 | "First Name" label | Displays | Field label | WORKING |
| 125 | First Name input | EMPTY | Should show "Demo" | **BUG - DATA** |
| 126 | "Last Name" label | Displays | Field label | WORKING |
| 127 | Last Name input | EMPTY | Should show "Patient" | **BUG - DATA** |
| 128 | "Date of Birth" label | Displays | Field label | WORKING |
| 129 | DOB input | "DD/MM/YYYY" placeholder | Should show actual DOB | **BUG - DATA** |
| 130 | Calendar icon | Displays | Open date picker | VERIFY FUNCTIONALITY |
| 131 | "Gender" label | Displays | Field label | WORKING |
| 132 | Gender dropdown | Shows "Male" | User's gender | VERIFY if correct |
| 133 | "MRN" label | Displays | Field label | WORKING |
| 134 | MRN value | "7cb3378a-488" | Medical Record Number (partial UUID) | WORKING |

### CONTACT INFORMATION FORM
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 135 | "Contact Information" header | Displays | Section header | WORKING |
| 136 | "Email Address" label | Displays | Field label | WORKING |
| 137 | Email input | "patient@citycare.com" | User email | WORKING |
| 138 | "Phone Number" label | Displays | Field label | WORKING |
| 139 | Country code dropdown | "+234" | Country code selector | WORKING |
| 140 | Phone input | EMPTY (only +234 shown) | Should show full phone number | **BUG - DATA** |
| 141 | "Address" label | Displays | Field label | WORKING |
| 142 | Address input | EMPTY | Should show address if exists | NO DATA in DB |
| 143 | "City" label | Displays | Field label | WORKING |
| 144 | City input | EMPTY | Should show city if exists | NO DATA in DB |
| 145 | "State" label | Displays | Field label | WORKING |
| 146 | State input | EMPTY | Should show state if exists | NO DATA in DB |
| 147 | "Zip Code" label | Displays | Field label | WORKING |
| 148 | Zip Code input | EMPTY | Should show zip if exists | NO DATA in DB |

---

## PAGE 8: PROFILE - SECURITY (/profile - Security tab)

### TAB STATE
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 149 | "Security" tab | Active (blue) | Show security settings | WORKING |

### PROFILE SIDEBAR
Same as Personal Info page (elements 114-121)

### CHANGE PASSWORD FORM
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 150 | "Change Password" header | Displays | Section header | WORKING |
| 151 | "Edit Info" button | Displays (outline) | Misplaced? Not relevant to password | **BUG - UI** |
| 152 | "Current Password" label | Displays | Field label | WORKING |
| 153 | Current Password input | Shows masked text | Enter current password | WORKING |
| 154 | "New Password" label | Displays | Field label | WORKING |
| 155 | New Password input | Shows masked text | Enter new password | WORKING |
| 156 | Eye icon (visibility toggle) | Displays | Toggle password visibility | VERIFY FUNCTIONALITY |
| 157 | "Confirm New Password" label | Displays | Field label | WORKING |
| 158 | Confirm Password input | Shows masked text | Confirm new password | WORKING |
| 159 | Eye icon (visibility toggle) | Displays | Toggle password visibility | VERIFY FUNCTIONALITY |

### PASSWORD REQUIREMENTS
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 160 | "Password requirements:" header | Displays | Section header | WORKING |
| 161 | Min 8 characters rule | Displays | Requirement | WORKING |
| 162 | Uppercase/lowercase rule | Displays | Requirement | WORKING |
| 163 | Number/symbol rule | Displays | Requirement | WORKING |

### ACTION BUTTONS
| # | Element | Current State | Expected Behavior | Status |
|---|---------|---------------|-------------------|--------|
| 164 | "Update Password" button | Displays (blue) | Submit password change | VERIFY FUNCTIONALITY |
| 165 | "Save Changes" button (top-right) | Displays (blue) | Duplicate? Same as Update Password? | **BUG - REDUNDANT UI** |

---

# PART 2: CONSOLIDATED BUG LIST

## CRITICAL BUGS (System Breaking)
| ID | Description | Page(s) | Root Cause |
|----|-------------|---------|------------|
| C1 | "undefined undefined" instead of user name | ALL | AuthContext field mapping wrong (firstName vs first_name) |
| C2 | Role not assigned during registration | Backend | iam.service.ts doesn't set role_id |
| C3 | Clinician login redirects to patient dashboard | Login flow | Role not returned/checked properly |
| C4 | "Invalid Date" on prescriptions | Prescriptions | Date field null or wrong format |

## DATA BUGS (Data Not Showing)
| ID | Description | Page(s) | Root Cause |
|----|-------------|---------|------------|
| D1 | No upcoming appointments | Home, Appointments | Role auth failing OR API mismatch |
| D2 | No past appointments | Appointments | Same as D1 |
| D3 | Outstanding balance shows ₦0 | Home, Billing | Status filter mismatch (Unpaid vs Pending) |
| D4 | No invoices found | Billing | Same as D3 OR role auth |
| D5 | Lab results all show 0 | Lab Results | Missing /lab/patients/:id/results endpoint |
| D6 | No lab results found | Lab Results | Same as D5 |
| D7 | Diagnoses empty | Medical Records | Not fetching from SOAP assessments |
| D8 | Current medications not shown | Medical Records | Not linked to prescriptions |
| D9 | Recent lab results not shown | Medical Records | Not fetching lab data |
| D10 | Patient name shows "Patient" only | Medical Records, Prescriptions | Not joining user data properly |
| D11 | DOB "Not specified" | Medical Records, Prescriptions, Profile | DOB in patient_charts, not fetched |
| D12 | Doctor name missing ("Dr." only) | Prescriptions | Clinician not joined through encounter |
| D13 | Profile fields empty | Profile | User data not pre-populated in form |
| D14 | Phone number incomplete | Profile | Only shows country code |
| D15 | No payment history | Billing | No payments table in database |

## FUNCTIONALITY BUGS (Buttons/Actions Not Working)
| ID | Description | Page(s) | Expected Behavior |
|----|-------------|---------|-------------------|
| F1 | "Request Records" button | Profile | Unknown - needs implementation |
| F2 | "Share Profile" button | Profile | Unknown - needs implementation |
| F3 | "Pay Now" button | Billing | Should open payment flow |
| F4 | Health summary links not clickable | Home | Should link to respective pages |
| F5 | Breadcrumb links may not be clickable | Multiple | Should navigate to parent pages |
| F6 | "Edit Info" button on Security tab | Profile | Misplaced, should not be there |

## UI/COPY BUGS
| ID | Description | Page(s) | Fix |
|----|-------------|---------|-----|
| U1 | "Pay Your Bill" wrong description | Home | Change from "Check your latest test outcomes" to billing text |
| U2 | Duplicate "Save Changes" button | Profile Security | Remove redundant button or clarify purpose |

## MISSING FEATURES (Not Implemented)
| ID | Description | Page(s) | Priority |
|----|-------------|---------|----------|
| M1 | Search functionality | ALL (header) | LOW |
| M2 | Notification system | ALL | LOW |
| M3 | Visit History tab content | Medical Records | MEDIUM |
| M4 | Filter dropdowns functionality | Lab Results | MEDIUM |
| M5 | Payment processing | Billing | HIGH |
| M6 | Profile photo upload | Profile | LOW |

---

# PART 3: IMPLEMENTATION PLAN

## Phase 1: Critical Auth Fixes (MUST DO FIRST)

### Fix C1: User Name Display
**File:** `frontend/src/context/AuthContext.tsx`
**Lines:** 77-85
**Change:**
```typescript
// FROM:
first_name: response.user.firstName,
last_name: response.user.lastName,

// TO:
first_name: response.user.first_name,
last_name: response.user.last_name,
```

### Fix C2: Role Assignment
**File:** `src/iam/iam.service.ts`
**Add role lookup and assignment in register():**
```typescript
async register(data: any) {
  // Look up role
  const role = await this.prisma.roles.findFirst({
    where: { name: data.role || 'Patient' }
  });

  const user = await this.prisma.users.create({
    data: {
      email: data.email,
      password_hash: hashedPassword,
      first_name: data.firstName,
      last_name: data.lastName,
      role_id: role?.id, // ADD THIS
    },
  });
}
```

### Fix C3: Role in Login/GetMe Response
**File:** `src/iam/iam.service.ts`
**Update login() to include role:**
```typescript
return {
  accessToken,
  refreshToken,
  user: {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.roles?.name, // ADD role
  },
};
```

**Update getMe() to include role:**
```typescript
return this.prisma.users.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    first_name: true,
    last_name: true,
    phone_number: true,
    roles: { select: { name: true } }, // ADD role
  },
});
```

### Fix C4: Invalid Date
**File:** `src/clinical/clinical.service.ts`
**Ensure created_at is included in prescription response**

---

## Phase 2: Data Display Fixes

### Fix D1-D2: Appointments
1. Verify API endpoint returns data
2. Check role authorization
3. Fix frontend data mapping

### Fix D3-D4: Billing
**File:** `frontend/src/pages/Home/Home.tsx`
**Change status filter:**
```typescript
// FROM:
.filter(inv => inv.status === 'Unpaid' || inv.status === 'Overdue')

// TO:
.filter(inv => inv.status === 'Pending' || inv.status === 'Draft' || inv.status === 'Overdue')
```

### Fix D5-D6: Lab Results
**File:** `src/lab/lab.controller.ts`
**Add new endpoint:**
```typescript
@Get('patients/:patientId/results')
@Roles('Patient', 'Clinician', 'Staff', 'Admin')
async getPatientResults(@Param('patientId') patientId: string) {
  return this.labService.getPatientResults(patientId);
}
```

### Fix D7-D9: Medical Records Data
- Fetch diagnoses from SOAP notes (assessment field)
- Link to prescriptions
- Link to lab results

### Fix D10-D12: Prescription Display
- Join user data for patient name
- Join patient_charts for DOB
- Join encounter → clinician for doctor name

### Fix D13-D14: Profile Pre-population
**File:** `frontend/src/pages/Profile/Profile.tsx`
- Pre-fill form with user data from context
- Parse full phone number

---

## Phase 3: Functionality Fixes

### Fix F1-F2: Quick Actions (Profile)
**Options:**
1. Remove buttons if not needed
2. Implement "Request Records" → Generate PDF of medical records
3. Implement "Share Profile" → Generate shareable link or QR code

### Fix F3: Pay Now
Implement payment integration or placeholder flow

### Fix F4: Health Summary Links
Make text clickable:
```tsx
<Link to="/medical-records">View in Medical Records</Link>
<Link to="/lab-results">View in Lab Results</Link>
```

### Fix F6: Misplaced Edit Info Button
Remove from Security tab or repurpose

---

## Phase 4: UI/Copy Fixes

### Fix U1: Wrong Description
**File:** `frontend/src/pages/Home/Home.tsx`
**Change Pay Your Bill description:**
```typescript
description: 'View and pay your outstanding bills.',
```

### Fix U2: Redundant Button
Remove duplicate "Save Changes" or clarify purpose

---

# PART 4: DATABASE CHANGES

### Add Missing Columns (if needed)
```sql
-- Ensure users have role_id
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id);

-- Add address fields if missing
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT;
```

### Update Seed Data
```sql
-- Assign roles to existing users
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'Patient')
WHERE email IN ('patient@citycare.com', 'john.doe@citycare.com', 'jane.smith@citycare.com');

UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'Clinician')
WHERE email IN ('clinician@citycare.com', 'dr.williams@citycare.com');

UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'Admin')
WHERE email = 'admin@citycare.com';
```

---

# PART 5: TESTING CHECKLIST

## After All Fixes, Verify:

### Authentication
- [ ] Login as patient@citycare.com shows "Demo Patient" in header
- [ ] Login as clinician@citycare.com redirects to /clinician/dashboard
- [ ] Logout works and redirects to login
- [ ] Registration assigns correct role

### Home Page
- [ ] User name displays correctly
- [ ] Upcoming appointment shows (if exists)
- [ ] Outstanding balance shows correct amount
- [ ] All quick action buttons navigate correctly
- [ ] Health summary links are clickable
- [ ] View Bills button works

### Appointments Page
- [ ] Upcoming appointments list shows data
- [ ] Past appointments list shows data
- [ ] Book Appointment buttons work
- [ ] (If implemented) Cancel/Reschedule buttons work

### Medical Records Page
- [ ] Patient name shows correctly
- [ ] DOB shows correctly
- [ ] Blood type shows correctly
- [ ] Diagnoses show from SOAP notes
- [ ] Current medications link/show
- [ ] Lab results link/show
- [ ] Visit History tab works

### Prescriptions Page
- [ ] Patient info correct (name, DOB, blood type)
- [ ] Prescription shows doctor name
- [ ] Date shows correctly (not "Invalid Date")
- [ ] Status badge shows

### Lab Results Page
- [ ] Stats cards show correct counts
- [ ] Lab results list shows data
- [ ] Filters work (if implemented)

### Billing Page
- [ ] Outstanding balance shows correctly
- [ ] Invoice list shows data
- [ ] Pay Now button works (or shows placeholder)
- [ ] Payment history shows (or explains no history)

### Profile Page
- [ ] Personal info tab shows
- [ ] All fields pre-populated
- [ ] Save Changes saves data
- [ ] Security tab shows
- [ ] Password change works
- [ ] Request Records button works (or removed)
- [ ] Share Profile button works (or removed)

---

# TOTAL ISSUES COUNT

| Category | Count |
|----------|-------|
| Critical Bugs | 4 |
| Data Bugs | 15 |
| Functionality Bugs | 6 |
| UI/Copy Bugs | 2 |
| Missing Features | 6 |
| **TOTAL** | **33** |

---

*Document created: Patient Dashboard Complete Analysis*
*Next step: Clinician Dashboard Analysis (after clinician login is fixed)*
