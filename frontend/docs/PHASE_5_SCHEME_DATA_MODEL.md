# Phase 5: Scheme Data Model Specifications

## Scheme Entity Model

```typescript
interface Scheme {
  id: string; // e.g. "pm-kisan"
  slug: string;
  name: string; // e.g. "PM-KISAN"
  localizedNames?: {
    hi?: string;
    mr?: string;
  };
  shortDescription: string;
  fullDescription: string;
  category: 'Agriculture' | 'Education' | 'Women and Child' | 'Employment' | 'Health' | 'Housing' | 'Pension' | 'Financial Assistance';
  department: string;
  governmentLevel: 'Central Government' | 'State Government';
  state: string; // e.g. "Maharashtra", "All States"
  benefitSummary: string;
  benefits: string[];
  eligibilityRules: EligibilityRule[];
  requiredDocuments: DocumentRequirement[];
  applicationMode: 'Online' | 'Offline' | 'Hybrid';
  applicationStatus: 'Open' | 'Closed';
  applicationDeadline?: string;
  tags: string[];
  matchScore: number;
  recommendationReasons: string[];
  isSaved?: boolean;
  createdAt: string;
}

interface EligibilityRule {
  id: string;
  title: string;
  description: string;
  field: string;
  operator: 'equals' | 'notEquals' | 'oneOf' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'between' | 'contains';
  expectedValue: any;
  importance?: 'required' | 'optional';
  failureMessage?: string;
}

interface DocumentRequirement {
  id: string;
  name: string;
  status: 'Available in Locker' | 'Missing' | 'Pending Verification' | 'Optional';
}
```

## LocalStorage Persistence Keys
- `bharat_sewa_saved_schemes_v1`: Stringified JSON array of saved scheme IDs.
- `bharat_sewa_eligibility_drafts_v1`: Stringified JSON object map of scheme drafts keyed by `schemeId`.
- `bharat_sewa_eligibility_results_v1`: Stringified JSON object map of evaluation results keyed by `resultId`.
