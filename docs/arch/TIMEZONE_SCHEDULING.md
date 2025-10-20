# Timezone & Scheduling — Daily Status Evaluation

**Rule:** Recompute reminder statuses **daily at 09:00** in the **user’s timezone**.

## Why 09:00 (user TZ)?
- Keeps UX predictable and aligned to the owner’s day.
- Reduces surprises caused by server TZ or UTC‑only jobs.

## Scheduler Model (simple & safe for MVP)
- A **sweep job** runs periodically (e.g., every 15 minutes).
- For each run, select users for whom **local time crossed 09:00** since the last sweep and whose `last_status_job_at` (per user) is **before today at 09:00 (local)**.
- For each selected user, recompute statuses of their reminders and write updates atomically.

### Pseudocode (logic only)
```
nowUtc = now()
for user in users:
  localNow = convertToTZ(nowUtc, user.timezone)
  if shouldRunForUser(localNow, user.last_status_job_at):
     evalAllReminders(user.id)
     user.last_status_job_at = nowUtc
```

## Status Computation
- **Vencendo:** today >= (due_at − 30d) AND today <= due_at
- **Em atraso:** today > due_at
- **Concluído:** set on user action; remains until “Reabrir” (undo)
- **Adiado:** presentation‑only flag (hide until `next_nudge_at`); status remains based on due date.

## Failure & Backfill
- Log failures with counts and last processed user id.
- Retry with bounded backoff; on repeated failure, mark users for **backfill** on next sweep.
- Keep an operational metric: processed/updated/failed.

## DST Notes
- Use IANA tz database; derive “today at 09:00” via proper TZ library to avoid DST drift.
- Never store derived local times; recompute from UTC + TZ each run.