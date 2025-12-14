# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AutoKeeper** is a vehicle maintenance reminder system built as a feature-oriented modular monolith using **Bun + Elysia**. The MVP focuses on in-app reminders for Brazilian vehicle compliance (IPVA, licenciamento) and maintenance tracking. WhatsApp/Email channels are stubbed for future premium features.

**Brand tagline (PT):** "Mantenha seus veículos em dia."

## Development Commands

```bash
# Install dependencies
bun install

# Run development server (with watch mode)
bun run dev

# Run all tests
bun test

# Run tests in watch mode (recommended during development)
bun test:watch

# Run tests with coverage report
bun test:coverage
```

The server runs on port 3000 by default (configured in `src/app/server.ts`).

## Architecture & Code Organization

### Layered Module Structure

The codebase follows a **domain/application/infra** layering pattern within feature modules:

```
src/
├── modules/          # Feature modules (each with domain/application/infra)
│   ├── accounts/     # User & profile (timezone)
│   ├── vehicles/     # Vehicle CRUD (type, year/model, plate, km)
│   ├── reminders/    # Reminder lifecycle, state machine, snooze, undo
│   ├── plans/        # Feature gating (MVP: 1 vehicle free, in-app only)
│   ├── admin/        # Read-only ops/support views
│   ├── channels/     # (Stubbed) WhatsApp/Email adapters for post-MVP
│   └── exports/      # (Stubbed) CSV/PDF dossier for post-MVP
├── app/              # Elysia bootstrap (routes + plugins)
├── jobs/             # Scheduled jobs
│   └── daily-status-eval/  # 09:00 status evaluation job
└── core/             # Shared utilities and types
```

**Layer responsibilities:**
- **domain**: Pure TypeScript business rules (side-effect-free, functional preferred)
- **application**: Use-cases, DTOs, validation logic
- **infra**: HTTP controllers (Elysia), database adapters, external providers

### Reminder State Machine

Core product behavior revolves around reminder statuses:

- **Lead time:** Reminder enters **"Vencendo"** (expiring soon) at **−30 days** from due date
- **Overdue:** Becomes **"Em atraso"** the day **after** due date
- **Completed:** User marks as done (with **Undo** support)
- **Snooze:** Shifts **next-nudge** date by 7d/14d; **does not** change the actual due date
- **Daily evaluation:** All statuses recomputed at **09:00 in user's timezone**

The state machine and attention list queries live in `src/modules/reminders/`.

### MVP Scope & Premium Features

**MVP includes:**
- In-app reminders only
- 1 vehicle limit (free plan)
- Reminder types: IPVA, licenciamento, manutenção, seguro, personalizado
- Snooze (7d/14d) and Undo functionality

**Post-MVP (premium):**
- WhatsApp/Email channels (adapters already stubbed in `src/modules/channels/`)
- Multiple vehicles
- Notes/attachments
- Dossier PDF export
- CSV export

## Key Technical Decisions

### Bun + Elysia Stack
- **Bun** is the runtime (no Node.js)
- **Elysia** is the HTTP framework
- TypeScript strict mode enabled
- ES2022 modules

### Environment Variables
Store user timezone in profile table; use it for scheduling the daily 09:00 status evaluation job. Minimal environment variables:

```
APP_PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/autokeeper
LOG_LEVEL=info
```

### Observability
Emit lightweight events for key actions (retain ~90 days):
- `reminder_created`
- `reminder_snoozed`
- `reminder_completed`
- `status_job_run`

## Testing Strategy

### Test Framework

The project uses **Bun's built-in test runner** with Jest-compatible API (`describe`, `it`, `expect`). No additional test dependencies are required.

### Test Organization

Tests are organized under the `/tests` directory with the following structure:

```
tests/
├── setup.ts                 # Global test setup and utilities
├── helpers/                 # Shared test utilities
│   ├── logger-spy.ts       # Logger spy for assertions
│   └── email-spy.ts        # Email service spy
├── unit/                    # Unit tests (isolated, fast)
│   ├── core/               # Core infrastructure tests
│   └── modules/            # Module-specific tests
└── integration/            # Integration tests (with database)
```

### Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/unit/core/logger/logger-config.test.ts

# Run tests matching a pattern
bun test --test-name-pattern "Logger"

# Run in watch mode (TDD workflow)
bun test:watch

# Run with coverage report
bun test:coverage

# Run only unit tests
bun test tests/unit/

# Run only integration tests
bun test tests/integration/
```

### Writing Tests

Follow these principles:

1. **AAA Pattern**: Structure tests with Arrange, Act, Assert
2. **Descriptive Names**: Test names should explain expected behavior
3. **Independence**: Each test should run in isolation
4. **Fast Feedback**: Prefer unit tests over integration tests where possible

Example test:

```typescript
describe('isValidPlanType', () => {
  it('should return true for valid "free" plan type', () => {
    // Arrange
    const planType = 'free';

    // Act
    const result = isValidPlanType(planType);

    // Assert
    expect(result).toBe(true);
  });
});
```

### Testing Priorities

1. **Domain layer** tests (pure business rules) - Highest priority
2. **Application layer** tests (use-cases and validation)
3. **Infrastructure layer** tests (with mocking for external dependencies)

### Test Coverage Goals

- **Domain layer**: 95%+
- **Application layer**: 85%+
- **Infrastructure layer**: 70%+
- **Overall**: 80%+

### Current Test Coverage

The test suite includes comprehensive coverage for:
- Core infrastructure (logger, constants)
- Email service (configuration, providers, templates)
- Authentication middleware
- Plan type validation

Run `bun test:coverage` to see detailed coverage reports.

### Test Utilities

- **LoggerSpy** (`tests/helpers/logger-spy.ts`): Spy for logger assertions
- **EmailServiceSpy** (`tests/helpers/email-spy.ts`): Spy for email service testing
- **mockEnv()** (`tests/setup.ts`): Mock environment variables
- **resetEnv()** (`tests/setup.ts`): Reset environment to test defaults

### CI/CD Integration

Tests run automatically on:
- Push to main branch
- Pull requests

See `.github/workflows/test.yml` for CI configuration.

## Important Constraints

- **Never** modify core due dates when snoozing (only shift next-nudge)
- Respect plan limits (MVP: 1 vehicle max for free users)
- All status evaluations must use **user's timezone** from profile
- Keep domain logic side-effect-free for testability

## Commit Message Convention

### Commit Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, white-space, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or correcting tests
- **chore**: Build process, tooling, dependencies

### Commit Scopes
Use the module name as scope:
- accounts
- vehicles
- reminders
- plans
- admin
- channels
- exports
- jobs
- core
- app

### Commit Examples
```
feat(reminders): add snooze functionality with 7d/14d options
fix(vehicles): correct validation for optional plate field
docs: update CLAUDE.md with testing strategy
refactor(reminders): extract state machine logic to domain layer
chore: update dependencies
```

### Commit Rules
- Use lowercase for type and scope
- Subject in imperative mood ("add" not "added")
- No period at end of subject
- Keep subject concise (≤50 chars)
- Body explains "why" not "what"


## Personal Rules
1. Never try to run scripts to run server, tests or lits like `bun dev`, `bun test`.