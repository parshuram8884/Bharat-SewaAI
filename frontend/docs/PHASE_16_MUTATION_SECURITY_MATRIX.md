# Phase 16 Mutation Security Matrix

This matrix describes the simulated validation and enforcement applied to high-impact actions in the demonstration environment.

| Operation | Module | Required Role | Ownership Rule | Scope Rule | Idempotency Supported | Maker-Checker Rule |
|-----------|--------|---------------|----------------|------------|-----------------------|--------------------|
| **Application Submission** | Applications | `citizen` | Must own account | None | Yes | N/A |
| **Officer Recommendation** | Applications | `officer` | None | Must match Dept | Yes | Is Maker |
| **Application Approval** | Applications | `department-admin` | None | Must match Dept | Yes | Must NOT be Maker |
| **Grievance Submission** | Grievances | `citizen` | Must own account | None | Yes | N/A |
| **Grievance Resolution** | Grievances | `officer` | None | Must match Dept | Yes | Is Maker |
| **Sanction Approval** | Payments | `department-admin` | None | Must match Dept | Yes | Must NOT be Maker |
| **Payment Release** | Payments | `finance-manager` | None | Must match Dept | Yes | Must NOT be Maker |
| **CSC Token Generation** | CSC | `citizen` | Must own account | None | Yes | N/A |
| **Open-Data Approval** | Open Data | `super-admin` | None | Global | Yes | Must NOT be Maker |
| **Demo-Data Reset** | Admin | `super-admin` / `platform-operator` | None | Global | No | Requires Privileged Typed Phrase |

## Technical Controls
All mutations are routed through `idempotencyService.js` (creating an action reservation that expires) and `rateLimitService.js` (capping operations per window). Offline mutations are explicitly blocked unless specifically implemented as "Draft Saves".
