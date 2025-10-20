# Architecture Overview — AutoKeeper (MVP)

**Style:** Modular monolith on **Bun + Elysia**, feature‑first modules with **domain / application / infra** layering.  
**Source of truth:** Product Definitions v0.3 + System Design Kickoff v1. No extra scope beyond MVP.

## 1) Goals and Constraints
- **MVP features:** in‑app reminders only (IPVA, licenciamento, manutenção genérica, seguro, personalizado).
- **Statuses:** Rascunho, Agendado, Vencendo (−30d), Em atraso (after due), Concluído, Adiado.
- **Actions:** Concluir (+Undo), Adiar 7d/14d (affects next‑nudge only).
- **Daily evaluation:** recompute statuses at **09:00** in the **user’s timezone**.
- **Plan gating (Free):** 1 vehicle; no WhatsApp/Email in MVP (reserved for Pro later).
- **Non‑functional:** avail >99%/mo, mobile‑fast (<1–2s), small scale (few thousand reminders), minimal PII, basic observability.

## 2) High‑Level Components
- **App layer (`src/app`)**: Elysia bootstrap, route registrar, error mapping, API docs.
- **Core (`src/core`)**: config/env, logger, http helpers, time/TZ utilities, observability, persistence factory.
- **Jobs (`src/jobs`)**: daily status evaluation (pure logic + runner entrypoint).
- **Modules (`src/modules`)**: cohesive features:
  - `accounts`: user + profile (stores **timezone**).
  - `vehicles`: vehicle CRUD.
  - `reminders`: templates, state transitions, actions, attention list.
  - `plans`: gating policies (Free now; Pro later).
  - `admin`: read‑only lists for support/ops.
  - `channels` (post‑MVP): WhatsApp/Email adapters (stubbed).
  - `exports` (post‑MVP): data export & dossier PDF (stubbed).

## 3) Layering per Module
- **domain** — entities, value objects, business rules (no framework, no IO).
- **application** — use‑cases/services orchestrating domain + ports (validation/DTOs).
- **infra** — adapters for HTTP (Elysia handlers) and persistence (SQL queries/repo impl).

## 4) Data & State
- **Database:** relational (vendor TBD). Tables: `users`, `vehicles`, `reminders`, and a light `events` log.
- **Reminder status:** persisted for fast reads; recomputed by job; client may show “recently updated” badge.
- **Snooze model:** `next_nudge_at` hides the reminder from the attention list until that moment; **due_at** remains the truth.

## 5) Request Flow (example: Snooze)
HTTP → Elysia route (infra) → use‑case (application) → domain rule checks → repo write (infra) → event emit (core/observability) → HTTP response.

## 6) Scheduling
- A single **daily job** recomputes statuses at **09:00 user local time** (see `TIMEZONE_SCHEDULING.md`).
- Safety: idempotent updates, backfill on failure, logs/metrics per run.

## 7) Observability
- Events: `reminder_created`, `reminder_snoozed`, `reminder_completed`, `status_job_run` (90‑day retention target).
- Minimal fields, no sensitive content; correlate by userId/reminderId and timestamps.

## 8) Security & Privacy (MVP)
- TLS, input validation, least‑privilege DB creds.
- LGPD notes: dates are **user‑provided**; no official debt lookup. Support export/delete later.

## 9) Evolution (post‑MVP)
- Enable `modules/channels/*` to deliver WhatsApp/Email with provider adapters.
- Add notes/attachments and PDF dossier under `modules/exports/*` without changing core domain.