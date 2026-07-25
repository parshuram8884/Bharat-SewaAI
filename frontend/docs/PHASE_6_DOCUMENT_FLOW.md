# Phase 6: Document Flow Specifications

## Overview
Phase 6 uses metadata-only document attachment. Real file contents are never saved to `localStorage`.

## Digital Locker Integration Mock
Citizens can attach pre-verified documents directly from their Digital Locker (`LockerDocumentPicker.jsx`):
- Aadhaar Card (`XXXX-XXXX-4821`)
- Bank Passbook Copy (`XXXXXX9021`)
- Income Certificate (`INC-2025-9921`)
- Ration Card (`RAT-8841-MH`)
- 7/12 Land Record Extract (`LAND-142A-JAL`)

## Document Attachment Metadata Schema
```typescript
interface AttachedDocument {
  id: string;
  requirementId: string;
  name: string;
  source: 'Digital Locker' | 'User Upload';
  fileName: string;
  status: 'verified' | 'attached';
  uploadedAt: string;
  maskedReference?: string;
}
```
