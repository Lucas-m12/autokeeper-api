# Observability Events (MVP)

Emit lightweight events to understand user behavior and job health. Keep fields minimal; avoid sensitive data.

## Events

### reminder_created
```
{ reminderId, vehicleId, userId, type, dueAt, createdAt }
```

### reminder_snoozed
```
{ reminderId, userId, durationDays, nextNudgeAt, snoozedAt }
```

### reminder_completed
```
{ reminderId, userId, completedAt }
```

### status_job_run
```
{ userId, processed, updated, failed, startedAt, finishedAt }
```

## Storage & Retention
- Store in an `events` table or forward to your log system.
- MVP retention target: **~90 days**.
- Add simple dashboards later (counts over time, errors).

## Correlation
- Use `userId` and `reminderId` to join with application logs when needed.