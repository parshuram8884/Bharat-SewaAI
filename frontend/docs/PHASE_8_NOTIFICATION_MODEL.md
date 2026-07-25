# Phase 8: Notification & Communication Model

## Deduplication Strategy
To prevent spam, notifications rely on stable `dedupeKey` values. When actions are retried or cached queries re-fire, `notificationService.js` blocks duplicate insertions sharing the same key.

Example keys:
- `application:APP-2026-100001:documents-requested:req-mock-1`
- `application:APP-2026-100001:withdrawn`

## Unread Counting
The system calculates unread notifications globally and presents them dynamically on the Dashboard. Marking a single or all notifications as read drops the unread counter appropriately.
