# AutoKeeper — Project Structure (Modular Monolith, Bun + Elysia) v1

This document defines the **folder layout** to kick off the MVP using **Bun** and **Elysia**.  
It aims to be simple to navigate (not MVC) and future‑proof for **premium channels** (WhatsApp/Email) post‑MVP.

## Principles
- **Feature‑oriented modules** under `src/modules/*` keep domain logic cohesive.
- **Domain / Application / Infra** layering inside each module keeps logic testable and framework‑agnostic.
- **Thin web layer** in `src/app` wires Elysia without leaking framework details into modules.
- **Jobs** are isolated (e.g., the daily 09:00 status evaluation).
- **Adapters ready** for channels (stubbed during MVP).

## Directory Tree

```
autokeeper/
├─ bunfig.toml
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ README.md
├─ docs/
│  └─ product/               # product decisions, copy kit, limits (reference)
├─ scripts/                  # one-off scripts (seed, backfill, maintenance)
├─ migrations/               # SQL migrations
├─ tests/                    # unit/integration tests (co-locate per module when useful)
├─ public/                   # static assets (favicons, etc.) if needed
└─ src/
   ├─ index.ts               # main boot (calls app/server.ts)
   ├─ app/                   # Elysia bootstrap (small, framework-specific)
   │  ├─ server.ts           # create app, register plugins/routes
   │  ├─ routes.ts           # central route registrar (imports module routes)
   │  └─ plugins/            # Elysia plugins (cors, swagger, error mapping)
   │     ├─ cors.ts
   │     ├─ swagger.ts
   │     └─ errors.ts
   │
   ├─ core/                  # cross-cutting (framework-agnostic)
   │  ├─ config/             # env schema & typed loader
   │  ├─ logger/             # logger facade
   │  ├─ http/               # http helpers (responses, pagination, validation)
   │  ├─ time/               # time utils, TZ handling, now()
   │  ├─ auth/               # minimal session/jwt guard (placeholders)
   │  ├─ i18n/               # PT-BR keys, EN-ready later
   │  ├─ observability/      # event bus/logs: created/snoozed/done/job
   │  └─ persistence/        # db client factory, transactions
   │
   ├─ jobs/                  # background/scheduled work
   │  └─ daily-status-eval/
   │     ├─ index.ts         # 09:00 (user TZ) evaluation entry
   │     └─ worker.ts        # pure logic to compute statuses & persist
   │
   └─ modules/               # feature modules (heart of the monolith)
      ├─ accounts/           # user account + profile (stores timezone)
      │  ├─ domain/          # entities, value-objects, policies
      │  ├─ application/     # use-cases, DTOs, validators
      │  ├─ infra/
      │  │  ├─ http/         # Elysia routes/controllers
      │  │  └─ persistence/  # repositories/mappers (SQL)
      │  └─ index.ts
      │
      ├─ vehicles/           # vehicle CRUD (type, year/model, plate?, km?)
      │  ├─ domain/
      │  ├─ application/
      │  ├─ infra/
      │  │  ├─ http/
      │  │  └─ persistence/
      │  └─ index.ts
      │
      ├─ reminders/          # templates, status engine & actions
      │  ├─ domain/          # statuses: Rascunho, Agendado, Vencendo, Em atraso, Concluído, Adiado
      │  ├─ application/     # create, list, snooze (7d/14d), conclude (+Undo)
      │  ├─ infra/
      │  │  ├─ http/         # endpoints: create, list, snooze, conclude
      │  │  └─ persistence/  # attention list queries & ordering
      │  └─ index.ts
      │
      ├─ plans/              # plan gating (Free now; Pro later)
      │  ├─ domain/          # policies (e.g., max vehicles = 1 on Free)
      │  ├─ application/     # guards/hooks to enforce limits
      │  ├─ infra/
      │  │  └─ http/         # minimal endpoints if needed
      │  └─ index.ts
      │
      ├─ admin/              # read-only support/ops
      │  ├─ application/     # list users/vehicles/reminders
      │  ├─ infra/
      │  │  └─ http/
      │  └─ index.ts
      │
      ├─ channels/           # (post-MVP) WhatsApp/Email adapters (stubs now)
      │  ├─ domain/          # channel contract & message models
      │  ├─ application/     # send pipeline (disabled in MVP)
      │  └─ infra/           # provider adapters
      │
      └─ exports/            # (post-MVP) data export & dossier PDF
         ├─ application/
         └─ infra/
```

## Module Responsibilities (short)
- **domain**: business rules, entities, value objects (pure TS).
- **application**: use-cases/services orchestrating domain + ports.
- **infra**: adapters (HTTP, persistence, providers).

## Notes
- The **daily status job** runs at **09:00** in the **user’s timezone** and updates statuses based on due dates and snooze (next‑nudge only).
- **Premium channels** live under `modules/channels/*` but remain **disabled** during MVP.