# Data Model / ERD — AutoKeeper (MVP)

> Relational model; vendor TBD. Minimal fields to support MVP behaviors without over‑designing.  
> Status is persisted for fast reads and updated by the daily job (and optionally on‑view if adopted later).

## Entities

### users
| field          | type           | notes                                  |
|----------------|----------------|----------------------------------------|
| id             | uuid           | PK                                     |
| email          | text           | unique                                 |
| timezone       | text           | IANA tz (e.g., America/Maceio)         |
| plan_type      | text enum      | `free` (default) • `pro` • `fleet`     |
| created_at     | timestamptz    |                                        |
| updated_at     | timestamptz    |                                        |

### vehicles
| field          | type           | notes                                  |
|----------------|----------------|----------------------------------------|
| id             | uuid           | PK                                     |
| user_id        | uuid           | FK → users.id                          |
| type           | text enum      | carro/moto/van/caminhão/ônibus/utilitário/outro |
| year           | int            |                                        |
| model          | text           |                                        |
| plate          | text nullable  | optional                               |
| km             | int nullable   | optional                               |
| created_at     | timestamptz    |                                        |
| updated_at     | timestamptz    |                                        |

### reminders
| field           | type           | notes                                              |
|-----------------|----------------|----------------------------------------------------|
| id              | uuid           | PK                                                 |
| vehicle_id      | uuid           | FK → vehicles.id                                   |
| type            | text enum      | ipva/licenciamento/seguro/manutencao/personalizado|
| due_at          | date           | source of truth for deadlines                      |
| status          | text enum      | rascunho/agendado/vencendo/em_atraso/concluido/adiado |
| next_nudge_at   | timestamptz?   | for snooze and attention list hiding               |
| note            | text nullable  | optional                                           |
| completed_at    | timestamptz?   | set on conclude                                    |
| created_at      | timestamptz    |                                                    |
| updated_at      | timestamptz    |                                                    |

### events (observability log, lightweight)
| field        | type         | notes                                        |
|--------------|--------------|----------------------------------------------|
| id           | bigint/uuid  | PK                                           |
| user_id      | uuid         | optional (system jobs may omit)              |
| kind         | text         | reminder_created/snoozed/completed/status_job_run |
| payload      | jsonb        | minimal fields (no sensitive data)           |
| created_at   | timestamptz  |                                              |

## Relationships
- users 1—n vehicles
- vehicles 1—n reminders

## Indexes (suggested)
- reminders: (vehicle_id), (due_at), (status), (next_nudge_at)
- vehicles: (user_id)
- users: (email unique)

## Status Rules (reference)
- Vencendo at **due_at − 30 days**.
- Em atraso at **(due_at + 1 day)** onward until Concluído.
- Snooze only sets **next_nudge_at**; status driven by dates above.