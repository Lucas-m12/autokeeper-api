# AutoKeeper — Product Roadmap (MVP-first)

> Source of truth: Product Definitions v0.3 + System Design Kickoff v1. No features beyond these docs.

## Now (MVP build)
- Add vehicle (type, year/model; optional plate/km)
- Create reminder (IPVA, licenciamento, manutenção, seguro, personalizado)
- Status model: Vencendo (−30d), Em atraso (after due), Concluído, Adiado
- Actions: Concluir (+Undo), Adiar 7d/14d (snooze = next‑nudge only)
- Dashboard (attention list): show Vencendo & Em atraso; ordering by severity → due date
- Plan gating (Free): 1 vehicle; **in‑app reminders only**
- Admin read‑only lists: users, vehicles, reminders
- Daily status evaluation at **09:00 (user timezone)**
- Observability: reminder_created/snoozed/completed, status_job_run

## Next (post‑MVP, small)
- Pro plan scaffolding (UI copy + gating visibility)
- “On‑view” freshness check to recompute stale statuses
- Simple metrics dashboard (activation, 7‑day return, Pro interest clicks)

## Later (major)
- **Premium channels**: WhatsApp + Email reminder delivery (adapter approach)
- Notes & attachments on reminders
- Dossier (PDF) per vehicle
- Fleet Lite: up to 15 vehicles, bulk presets, CSV utilities
- Data export & self‑service delete UI