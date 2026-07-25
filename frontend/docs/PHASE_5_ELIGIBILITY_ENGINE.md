# Phase 5: Eligibility Engine Specifications

## Engine Core (`eligibilityEngine.js`)
The eligibility engine evaluates scheme-specific rule sets against citizen profile attributes and user questionnaire answers.

### Supported Operators
- `equals`: Strict equality match (`value === expectedValue`)
- `notEquals`: Non-equality match (`value !== expectedValue`)
- `oneOf`: Inclusion within array of options (`expectedValue.includes(value)`)
- `greaterThanOrEqual`: Numerical boundary check (`Number(value) >= Number(expectedValue)`)
- `lessThanOrEqual`: Numerical upper boundary check (`Number(value) <= Number(expectedValue)`)
- `between`: Numerical range match (`num >= min && num <= max`)
- `contains`: Case-insensitive string search (`value.includes(expectedValue)`)

### Evaluation Result Statuses
1. **`eligible`** (Score: 100%): All rules matched successfully.
2. **`likely-eligible`** (Score: 85%): Most rules matched with optional verification needed.
3. **`action-required`** (Score: 50% - 75%): Missing questionnaire answers or unverified profile fields.
4. **`not-eligible`** (Score: 0% - 50%): One or more mandatory rules failed.

### Result Payload Structure
```json
{
  "status": "eligible",
  "score": 100,
  "matchedRules": [...],
  "unmetRules": [...],
  "missingInformation": [...],
  "recommendations": [...],
  "disclaimer": "This is a preliminary assessment based on provided details. Final eligibility and approval are determined by the concerned government department."
}
```

### Resume & Persistence Strategy
- Draft questionnaire answers are automatically saved to `localStorage` per scheme (`bharat_sewa_eligibility_drafts_v1`).
- Evaluation results are cached by unique `resultId` (`bharat_sewa_eligibility_results_v1`) to ensure route refreshes retain the evaluation breakdown.
