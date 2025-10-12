# AutoKeeper (MVP) — Modular Monolith (Bun + Elysia)

> Brand tagline (PT): **“Mantenha seus veículos em dia.”**  
> Scope: MVP with **in‑app reminders** only; **WhatsApp/Email** are **premium** and **not in MVP** (adapters stubbed).

## What is this?
A small, **feature‑oriented monolith** that tracks vehicle reminders (IPVA, licenciamento, manutenção, seguro, personalizado), shows statuses (**Vencendo, Em atraso, Concluído**), and supports **Snooze (7d/14d)** and **Undo**.

### Key behaviors (product‑driven)
- **Lead time:** reminder becomes **Vencendo** at **−30 days** from due.
- **Overdue:** becomes **Em atraso** the day **after** due.
- **Snooze:** only shifts **next‑nudge**; **does not** change due date.
- **Daily evaluation:** statuses recomputed **at 09:00 in the user’s timezone**.

## Project layout
See **Project Structure (Bun + Elysia) v1** for the full tree and rationale. In short:
- `src/modules/*` hold feature modules (**accounts, vehicles, reminders, plans, admin, channels (stubs), exports (stubs)**).
- Each module uses **domain / application / infra** layering.
- `src/app/*` is a thin Elysia bootstrap (routes + plugins).
- `src/jobs/daily-status-eval/*` hosts the 09:00 evaluation job.

> The detailed tree with descriptions lives in: `docs/AutoKeeper_Project_Structure_v1.md` (or the file you imported).

## Getting started
> No code is included here; these commands assume you’ll add your own Elysia/Bun setup.

1) **Prerequisites**
- **Bun** installed (https://bun.sh)

2) **Install deps**
```bash
bun install
```

3) **Environment**
- Copy `.env.example` to `.env` and fill values (see **Environment** section).

4) **Run**
```bash
# dev
bun run dev

# production (example)
bun run build && bun run start
```

## Environment
Minimal suggested variables (expand as you implement):
```
APP_PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/autokeeper
LOG_LEVEL=info
```
- Store **user timezone** in profile; use it when scheduling the **daily 09:00** job logic.

## Modules (quick map)
- **accounts**: user & profile (timezone).
- **vehicles**: vehicle CRUD (type, year/model; optional plate, km).
- **reminders**: create via templates, list, **snooze (7d/14d)**, **conclude** (+Undo), state machine & attention list queries.
- **plans**: gating rules (MVP Free: **1 vehicle**; in-app reminders only).
- **admin**: read-only lists for support/ops.
- **channels** (post‑MVP): WhatsApp/Email adapters (disabled in MVP).
- **exports** (post‑MVP): data export & dossier PDF.

## Conventions
- **domain**: business rules (pure TS).
- **application**: use-cases + DTOs + validation.
- **infra**: HTTP controllers (Elysia), persistence adapters, external providers.
- Prefer **functional, side‑effect‑free** domain code for easy testing.

## Observability (MVP baseline)
Emit lightweight events: `reminder_created`, `reminder_snoozed`, `reminder_completed`, `status_job_run` (retain ~90d).

## Testing
- Place unit tests near the code or under `/tests`. Favor **use-case** and **domain** tests for fast feedback.

## Roadmap callouts
- **Premium channels** (WhatsApp/Email) ship later without reshaping the core (adapters already reserved).
- **Notes/attachments**, **dossier PDF**, **CSV** are explicitly post‑MVP.

---

**License:** TBA