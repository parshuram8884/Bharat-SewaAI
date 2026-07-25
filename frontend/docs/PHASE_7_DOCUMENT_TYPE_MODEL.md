# Phase 7: Document Type Model Specifications

## Supported Document Types (14 Categories)
1. Aadhaar Card
2. PAN Card
3. Income Certificate
4. Bank Passbook
5. Land Record / 7/12 Extract
6. Residence Certificate
7. Ration Card
8. Caste Certificate
9. Disability Certificate
10. Birth Certificate
11. School or College Certificate
12. Marksheet
13. Passport-size Photograph
14. Other Supporting Document

## Masking & Sensitivity Rules
- **Aadhaar**: Masked representation (`XXXX-XXXX-4821`). Full number is never persisted.
- **Bank Account**: Masked representation (`XXXXXX9021`).
- **PAN**: Masked representation (`ABCXX1234X`).
- **Certificates**: Masked reference (`INC-2025-XXXX`).
