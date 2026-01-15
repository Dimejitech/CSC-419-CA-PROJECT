# CityCare Healthcare System - Architecture Justification

## Executive Summary

This document justifies the selection of a **Modular Architecture** for the CityCare Healthcare System. After careful evaluation of various architectural patterns, the modular approach was chosen as the optimal solution for our healthcare management platform.

---

## 1. Architecture Overview

### Selected Architecture: Modular Architecture

The CityCare system employs a modular architecture that organizes the application into distinct, self-contained modules based on user roles and functionality:

```
CityCare Healthcare System
├── Frontend (React + TypeScript)
│   ├── Patient Module
│   ├── Clinician Module
│   ├── Admin Module
│   ├── Technician Module
│   └── Shared Components
│
├── Backend (NestJS + TypeScript)
│   ├── IAM Module (Identity & Access Management)
│   ├── Patient Module
│   ├── Clinician Module
│   ├── Admin Module
│   ├── Lab Module
│   ├── Billing Module
│   └── Shared Services
│
└── Database (PostgreSQL + Prisma ORM)
```

---

## 2. Why Modular Architecture?

### 2.1 Comparison with Other Architectures

| Criteria | Monolithic | Microservices | Modular (Selected) |
|----------|------------|---------------|-------------------|
| Development Complexity | Low | Very High | Medium |
| Team Collaboration | Difficult | Complex | Excellent |
| Deployment | Single unit | Complex orchestration | Flexible |
| Scalability | Limited | Excellent | Good |
| Learning Curve | Low | Steep | Moderate |
| Infrastructure Cost | Low | High | Low-Medium |
| Code Reusability | Poor | Good | Excellent |
| Testing | Difficult at scale | Complex | Straightforward |

### 2.2 Key Reasons for Selection

#### A. Team Structure Alignment

Our development team is organized into specialized groups:
- **Patient Portal Team**: Handles patient-facing features
- **Clinician Portal Team**: Develops clinical workflow tools
- **Admin Portal Team**: Builds administrative functions
- **Lab Technician Team**: Creates laboratory management features

The modular architecture naturally aligns with this team structure, allowing:
- Parallel development without code conflicts
- Clear ownership boundaries
- Independent testing and validation

#### B. Healthcare Domain Requirements

Healthcare systems require:
1. **Role-Based Access Control (RBAC)**: Each module enforces strict access controls
2. **Audit Compliance**: Modular boundaries enable comprehensive audit logging
3. **Data Isolation**: Patient data remains segregated from administrative functions
4. **Regulatory Compliance**: HIPAA-ready architecture with clear data flows

#### C. Academic Project Constraints

As a university project (CSC-419), we considered:
- Limited development timeline
- Team members with varying skill levels
- Educational value of clear architectural patterns
- Need for demonstrable, testable deliverables

---

## 3. Module Breakdown

### 3.1 Frontend Modules

| Module | Purpose | Key Features |
|--------|---------|--------------|
| **Patient** | Patient self-service portal | Appointments, prescriptions, lab results, billing |
| **Clinician** | Clinical workflow management | Patient charts, SOAP notes, lab orders, scheduling |
| **Admin** | System administration | User management, roles, permissions, audit logs |
| **Technician** | Laboratory operations | Lab orders queue, results entry, verification |

### 3.2 Backend Modules

| Module | Responsibility | API Endpoints |
|--------|---------------|---------------|
| **IAM** | Authentication & Authorization | `/api/iam/*` |
| **Patient** | Patient data & records | `/api/patients/*` |
| **Clinician** | Clinical operations | `/api/clinician/*` |
| **Admin** | Administrative functions | `/api/admin/*` |
| **Lab** | Laboratory workflows | `/api/lab/*` |
| **Billing** | Financial operations | `/api/billing/*` |

---

## 4. Technical Implementation

### 4.1 Frontend Architecture

```typescript
// Module structure example
frontend/src/pages/
├── Admin/
│   ├── Dashboard/
│   ├── UserManagement/
│   ├── RolesPermissions/
│   ├── AuditLogs/
│   └── Profile/
├── Clinician/
│   ├── Dashboard/
│   ├── Patients/
│   ├── Labs/
│   └── Appointments/
├── Patient/
│   ├── Home/
│   ├── Appointments/
│   ├── Prescriptions/
│   └── LabResults/
└── Technician/
    ├── Dashboard/
    ├── LabOrders/
    ├── Results/
    └── Profile/
```

### 4.2 Backend Architecture

```typescript
// NestJS modular structure
src/
├── iam/
│   ├── iam.module.ts
│   ├── iam.controller.ts
│   ├── iam.service.ts
│   └── guards/
├── admin/
│   ├── admin.module.ts
│   ├── admin.controller.ts
│   └── admin.service.ts
├── clinician/
│   ├── clinician.module.ts
│   ├── clinician.controller.ts
│   └── clinician.service.ts
├── lab/
│   ├── lab.module.ts
│   ├── lab.controller.ts
│   └── lab.service.ts
└── shared/
    ├── prisma/
    └── guards/
```

### 4.3 Protected Routes by Role

```typescript
// Route protection example
<Route path="/admin/*" element={
  <ProtectedRoute requiredRole="Admin">
    <AdminModule />
  </ProtectedRoute>
} />

<Route path="/technician/*" element={
  <ProtectedRoute requiredRole="LabTechnician">
    <TechnicianModule />
  </ProtectedRoute>
} />
```

---

## 5. Benefits Realized

### 5.1 Development Benefits

1. **Parallel Development**: Teams work independently on their modules
2. **Reduced Merge Conflicts**: Clear file ownership minimizes conflicts
3. **Faster Onboarding**: New developers focus on one module
4. **Consistent Patterns**: Shared architectural patterns across modules

### 5.2 Maintenance Benefits

1. **Isolated Changes**: Module changes don't affect others
2. **Easier Debugging**: Issues are contained within modules
3. **Independent Testing**: Unit tests per module
4. **Clear Dependencies**: Explicit inter-module communication

### 5.3 Scalability Benefits

1. **Horizontal Scaling**: Backend modules can scale independently
2. **Feature Toggles**: Modules can be enabled/disabled
3. **Easy Extensions**: New modules integrate seamlessly
4. **Performance Optimization**: Per-module optimization possible

---

## 6. Security Considerations

### 6.1 Role-Based Access Control

```typescript
// Backend role guard
@UseGuards(AuthGuard, RolesGuard)
@Roles('Admin')
@Controller('admin')
export class AdminController {
  // Only accessible by Admin role
}
```

### 6.2 Data Isolation

- Patient data accessible only through authorized modules
- Administrative functions isolated from clinical operations
- Audit logs capture all cross-module interactions

### 6.3 Authentication Flow

```
User Login → JWT Token → Role Extraction → Route Guard → Module Access
```

---

## 7. CI/CD Integration

The modular architecture integrates seamlessly with our CI/CD pipeline:

```yaml
# GitHub Actions workflow structure
jobs:
  build-frontend:
    # Builds all frontend modules
  build-backend:
    # Builds all backend modules
  test:
    # Runs module-specific tests
  deploy:
    # Deploys as single application
```

---

## 8. Comparison Summary

### Why NOT Microservices?

| Factor | Microservices | Our Decision |
|--------|--------------|--------------|
| Infrastructure | Requires Kubernetes/Docker orchestration | Too complex for academic project |
| Team Size | Needs dedicated DevOps | Limited team resources |
| Development Time | Longer initial setup | Tight academic deadline |
| Cost | Higher hosting costs | Budget constraints |

### Why NOT Monolithic?

| Factor | Monolithic | Our Decision |
|--------|-----------|--------------|
| Team Collaboration | Merge conflicts | Multiple teams |
| Code Organization | Becomes messy at scale | Need clear boundaries |
| Testing | Difficult to isolate | Module-specific tests needed |
| Scalability | All-or-nothing | Role-based scaling preferred |

---

## 9. Conclusion

The **Modular Architecture** provides the optimal balance of:

- **Simplicity**: Easier than microservices, more organized than monolithic
- **Team Alignment**: Natural fit for role-based team structure
- **Healthcare Compliance**: Clear data boundaries for regulatory compliance
- **Educational Value**: Demonstrates professional architectural patterns
- **Practical Delivery**: Achievable within academic constraints

This architecture positions CityCare for:
- Successful academic demonstration
- Potential real-world deployment
- Future scalability to microservices if needed

---

## 10. References

1. NestJS Documentation - Modular Architecture
2. React Best Practices - Feature-Based Structure
3. HIPAA Security Rule - Technical Safeguards
4. Martin Fowler - Patterns of Enterprise Application Architecture

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Authors**: CityCare Development Team
**Course**: CSC-419 Advanced Software Engineering
