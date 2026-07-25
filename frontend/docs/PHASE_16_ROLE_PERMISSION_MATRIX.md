# Phase 16 Role Permission Matrix

This document defines the strict role-based access control implemented within the Bharat Sewa AI frontend.

> [!IMPORTANT]
> The permissions described here are enforced only via frontend React logic and mock service layers. This does not provide secure backend authorization.

## Base Roles

| Role | Accessible Modules | Read Permissions | Mutation Permissions | Department Scope | Centre Scope | Ownership Rules |
|------|--------------------|------------------|----------------------|------------------|--------------|-----------------|
| `citizen` | Home, Dashboard, Applications, Grievances, Benefits, Documents, CSC Booking | Own Data Only | Submit Application, Book CSC, Upload Docs | None | None | Strict (Must own record) |
| `officer` | Officer Queue, Application Review | Assigned Dept Queue | Recommend Approval, Request Info | Dept Only | None | Can only act on assigned queue |
| `department-admin` | Officer Queue, Dept Analytics | Dept Queue, Analytics | Approve Application (Checker) | Dept Only | None | Maker-Checker Enforcement |
| `super-admin` | All Modules | Global | Demo Reset, Release Approval | All | All | Requires Privileged Confirmation |

## Phase-Specific Roles

### Phase 11: Payments
| Role | Read Permissions | Mutation Permissions | Maker-Checker Restrictions |
|------|------------------|----------------------|----------------------------|
| `payment-officer` | View Sanctions, Batches | Create Batches, Add Notes | Cannot release payment |
| `finance-manager` | View Batches | Release Payments, Approve Retry | Cannot create batches |

### Phase 12: Document Vault
| Role | Read Permissions | Mutation Permissions | Maker-Checker Restrictions |
|------|------------------|----------------------|----------------------------|
| `document-officer` | Queue, Document Vault | Recommend Verification | Cannot finalize verification |
| `verification-manager`| Verification Queue | Approve Verification | Cannot initiate verification |

### Phase 13: CSC
| Role | Read Permissions | Mutation Permissions | Scope |
|------|------------------|----------------------|-------|
| `csc-operator` | Centre Appointments | Check-in, Assisted Application | Specific Centre Only |
| `csc-manager` | Centre Operations | Pause Queue, Review Workload | Multiple Centres |

### Phase 14: Analytics
| Role | Read Permissions | Mutation Permissions | Notes |
|------|------------------|----------------------|-------|
| `mis-analyst` | Global Dashboards, Reports| Export Demo CSV, Create Open-Data Draft | |
| `department-analyst`| Dept Dashboards | Export Demo CSV | Dept Only |
| `data-governance-manager`| Open-Data Drafts | Perform Privacy Review | Verifies suppression |

### Phase 15/16: Security & Platform
| Role | Read Permissions | Mutation Permissions | Notes |
|------|------------------|----------------------|-------|
| `security-auditor` | Security Logs, Events | Export Audit Report | Read-only |
| `platform-operator`| Health Diagnostics, Storage | Run Safe Repairs | Diagnostics only |

## Offline Limitations
No mutations (submissions, approvals, verification) are permitted while the client is disconnected. Only "Draft Saves" mapped strictly to the active Citizen user are allowed.
