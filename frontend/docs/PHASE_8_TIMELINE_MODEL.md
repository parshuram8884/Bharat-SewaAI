# Phase 8: Timeline Model

## Distinction
- **Timeline**: A public, citizen-friendly chronological list of major milestones, status shifts, and direct communications.
- **History**: An internal, detailed, granular system log capturing every minor action (draft saves, metadata updates, auto-verifications) for auditing purposes, preventing citizens from being overwhelmed by noise.

## Model Schema
```typescript
interface TimelineItem {
  id: string;
  applicationId: string;
  eventType: string; // e.g., 'Document Requested'
  status: string; // snapshot of app status
  title: string;
  description: string;
  timestamp: ISOString;
  actorType: 'citizen' | 'department' | 'system' | 'field-officer';
  actorName: string;
  source: string;
  relatedRequestId: string | null;
  visibility: 'public' | 'internal';
}
```
