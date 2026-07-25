# Phase 8: Status Workflow

## Valid State Transitions
1. `draft` -> `submitted` -> `received` -> `under-review`
2. `under-review` -> `documents-requested` -> (Response) -> `under-review`
3. `under-review` -> `clarification-requested` -> (Response) -> `under-review`
4. `under-review` -> `field-verification`
5. `field-verification` -> `approved` | `rejected`
6. `*` (non-terminal) -> `withdrawn`
7. `*` (non-terminal, inactivity) -> `cancelled`

## Service Enforcement
`applicationTrackingService.js` strictly validates transition boundaries inside `transitionApplicationStatus()`. It blocks any attempt to escape terminal states (`approved`, `rejected`, `closed`, `withdrawn`, `cancelled`), ensuring data integrity.
