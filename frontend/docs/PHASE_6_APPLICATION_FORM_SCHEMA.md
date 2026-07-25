# Phase 6: Application Form Schema Specifications

## Overview
Dynamic application forms are driven by structured schemas defined in `applicationFormSchemas.js` rather than hardcoded page JSX.

## Supported Field Types
- `text`: Single-line text input
- `number`: Numeric input with min/max bounds
- `single-select`: Dropdown menu
- `radio`: Horizontal/vertical option selector
- `checkbox`: Boolean consent checkbox
- `date`: Calendar date picker
- `yes-no`: Button toggle for boolean questions
- `masked-identifier`: Formatted masked text input (e.g. `XXXX-XXXX-4821`)
- `profile-confirm`: Read-only pre-filled profile verification block
- `read-only`: Read-only text display

## Schema Structure Example
```javascript
export const SCHEME_FORM_SCHEMAS = {
  'pm-kisan': {
    schemeId: 'pm-kisan',
    title: 'PM-KISAN Application Form',
    sections: [
      {
        id: 'applicant-details',
        title: '1. Applicant Profile Verification',
        fields: [...]
      },
      {
        id: 'farmer-details',
        title: '2. Farmer & Landholding Information',
        fields: [...]
      }
    ]
  }
};
```
