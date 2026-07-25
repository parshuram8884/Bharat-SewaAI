# Phase 7: Extraction Flow, Application Mapping & Privacy Security

## 1. Extraction Flow Sequence
```
Upload / Camera Capture
  └─> Preview & Rotate
       └─> Quality Assessment (Good / Warning / Poor)
            └─> 5-Step Simulated Processing
                 └─> Extracted Field Review & Correction
                      └─> Citizen Review Confirmation
                           └─> Field Mapping & Conflict Resolution
                                └─> Application Autofill & Locker Sync
```

## 2. Field Transformations & Conflict Resolution
- Supported transformations: `string`, `number`, `date`, `boolean`, `maskedString`, `selectOption`, `address`, `currencyNumber`, `uppercase`, `trim`.
- Conflict detection flags values where extracted amounts or details differ from existing application inputs (`different-value`). Citizens explicitly choose whether to **Use Extracted Value** or **Keep Existing Value**.

## 3. Privacy & Security Principles
- All OCR processing is simulated locally in mock mode.
- Raw file bytes and unmasked sensitive numbers are never stored in `localStorage` or transmitted over network APIs.
- Digital Locker metadata is stored with the explicit label: `"User-reviewed extraction"`.
