# 02 — Business Rules Document

**Module:** Vehicle  
**Version:** 1.0  
**Last Updated:** December 2024

---

## Overview

This document defines all business rules for the Vehicle module. Each rule has a unique identifier (BR-XX) for reference in code, tests, and discussions.

---

## 1. Vehicle Identity Rules

### BR-01: Placa Format Validation

**Rule:** Placa must match Brazilian license plate format.

**Valid Formats:**
- Old format: `ABC1234` (3 letters + 4 numbers)
- Mercosul format: `ABC1D23` (3 letters + 1 number + 1 letter + 2 numbers)

**Validation Regex:**
```regex
^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$
```

**Processing:**
- Accept input with or without hyphen
- Convert to uppercase
- Remove hyphens before storing
- Store normalized: `ABC1D23` (no hyphen, uppercase)

**Display:**
- Show with hyphen: `ABC-1D23`

**Error Message:**
> "Placa inválida. Use o formato ABC1234 ou ABC1D23."

---

### BR-02: Placa Global Uniqueness

**Rule:** A placa can only be registered by ONE user in the entire system.

**Rationale:** Prevents duplicate tracking of same vehicle; enables future features like vehicle history transfer.

**Behavior:**
- Check uniqueness before creating vehicle
- Include soft-deleted vehicles in uniqueness check (prevents immediate re-registration)
- Case-insensitive comparison (abc1234 = ABC1234)

**Error Message:**
> "Esta placa já está cadastrada por outro usuário. Em breve você poderá solicitar acesso compartilhado."

**Note:** Do NOT reveal which user owns the plate (privacy).

---

### BR-03: Vehicle Type Enumeration

**Rule:** Vehicle type must be one of the supported types.

**Supported Types (v1):**

| Enum Value | Display Name | Icon |
|------------|--------------|------|
| `CARRO` | Carro | 🚗 |
| `MOTO` | Moto | 🏍️ |

**Future Types (not in v1):**
- `CAMINHAO` — Caminhão
- `ONIBUS` — Ônibus
- `VAN` — Van/Utilitário

---

### BR-04: Estado Requirement

**Rule:** Estado (Brazilian state) is required for all vehicles.

**Rationale:** Needed to calculate IPVA and Licenciamento dates correctly.

**Valid Values:** All 27 Brazilian states (UF codes):
```
AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO
```

**Default:** None (must be selected)

**Impact:** Changing estado triggers BR-18 (recalculate document dates).

---

## 2. Vehicle Catalog Rules

### BR-05: Catalog Linking

**Rule:** When a user registers a vehicle, attempt to link to existing VehicleCatalog.

**Matching Criteria:**
- Brand ID matches
- Model ID matches
- Year matches exactly

**Behavior:**
```
IF catalog entry exists for (brand_id, model_id, year):
    Link UserVehicle.catalog_id → VehicleCatalog.id
ELSE:
    Trigger BR-06 (AI generation)
```

---

### BR-06: AI Catalog Generation

**Rule:** When no catalog exists for a vehicle, generate maintenance intervals using AI.

**Trigger:** User completes registration with brand+model+ano not in catalog.

**AI Input:**
```json
{
  "brand": "Honda",
  "model": "Civic",
  "year": 2020,
  "type": "CARRO",
  "market": "Brazil"
}
```

**AI Output (expected):**
```json
{
  "maintenance_items": [
    {
      "type": "OLEO",
      "interval_km": 10000,
      "interval_months": 12,
      "description": "Troca de óleo do motor"
    },
    {
      "type": "FILTRO_AR",
      "interval_km": 20000,
      "interval_months": 24,
      "description": "Filtro de ar do motor"
    }
  ]
}
```

**Post-Processing:**
1. Create new VehicleCatalog entry with `source = 'AI'`
2. Create MaintenanceTemplate entries for each item
3. Link UserVehicle to new catalog
4. Log AI generation for review

**Failure Handling:** See BR-07.

---

### BR-07: AI Generation Failure Fallback

**Rule:** If AI fails to generate catalog, allow vehicle registration without catalog.

**Failure Scenarios:**
- AI service unavailable
- AI returns invalid/empty response
- AI timeout (> 10 seconds)

**Behavior:**
1. Show user message: "Não conseguimos buscar informações de manutenção automaticamente."
2. Allow vehicle creation with `catalog_id = NULL`
3. Skip maintenance suggestion screen
4. User can manually add reminders later

**Retry:** Do NOT auto-retry. User can manually trigger re-generation later (future feature).

---

### BR-08: User Maintenance Override

**Rule:** Users can customize maintenance intervals for their specific vehicle.

**Behavior:**
- Override applies only to user's vehicle, not to catalog
- Store in `UserMaintenanceOverride` table
- When calculating next maintenance: check override first, fallback to catalog

**Example:**
```
Catalog says: Óleo every 10,000 km
User sets: Óleo every 8,000 km (mechanic recommended)
Result: User's vehicle uses 8,000 km
Other users with same catalog: Still see 10,000 km
```

---

### BR-09: Unverified Brand/Model Creation

**Rule:** Users can add brands and models not in the system.

**Behavior:**
1. User selects "Outro" or "Não encontrei" option
2. User enters brand/model name manually
3. System creates entry with:
   - `verified = false`
   - `created_by = user_id`
4. Admin can later verify and merge duplicates

**Constraints:**
- Brand name: 2-50 characters
- Model name: 2-100 characters
- No special characters except hyphen and space

---

## 3. Vehicle Lifecycle Rules

### BR-10: Vehicle States

**Rule:** Vehicles have a lifecycle state that controls behavior.

| State | Description | Reminders Active | Visible in List | Can Edit |
|-------|-------------|------------------|-----------------|----------|
| `ACTIVE` | Normal state | Yes | Yes | Yes |
| `SOLD` | User sold the vehicle | No | Yes (muted) | Limited |
| `DELETED` | Soft deleted | No | No | No |

**Transitions:**
```
ACTIVE → SOLD (user action: "Marcar como vendido")
ACTIVE → DELETED (user action: "Excluir veículo")
SOLD → ACTIVE (user action: "Reativar veículo")
SOLD → DELETED (user action: "Excluir veículo")
DELETED → (no return) — hard deleted after 90 days
```

---

### BR-11: Mark as Sold

**Rule:** User can mark vehicle as sold to stop reminders but keep history.

**Behavior:**
1. Change status to `SOLD`
2. Set `sold_at = NOW()`
3. Disable all active reminders (no notifications)
4. Keep all data intact (reminders, history)
5. Show in vehicle list with muted styling

**Reactivation:**
- User can change back to `ACTIVE`
- `sold_at` is cleared
- Reminders need manual reactivation (dates may be outdated)

---

### BR-12: Soft Delete

**Rule:** Deleting a vehicle performs soft delete, not hard delete.

**Behavior:**
1. Set `deleted_at = NOW()`
2. Cascade soft delete to all reminders (set their `deleted_at`)
3. Vehicle no longer appears in user's list
4. Placa remains reserved (see BR-02)

**Retention:** 90 days (see BR-13)

**Confirmation Required:**
- Show count of reminders that will be deleted
- Require explicit confirmation
- No "undo" in UI (irreversible for user)

---

### BR-13: Hard Delete After Retention

**Rule:** Soft-deleted vehicles are permanently removed after 90 days.

**Implementation:**
- Scheduled job runs daily
- Finds vehicles where `deleted_at < NOW() - 90 days`
- Hard deletes vehicle and associated data:
  - UserMaintenanceOverride
  - Reminders
  - MaintenanceHistory
  - Vehicle photo (S3)
  - UserVehicle record

**Audit:** Log hard deletions for compliance.

---

### BR-14: Editable Fields

**Rule:** Users can edit most vehicle fields, with exceptions.

| Field | Editable | Notes |
|-------|----------|-------|
| placa | ❌ No | Must delete and re-create |
| tipo | ❌ No | Fundamental to vehicle identity |
| estado | ✅ Yes | Triggers BR-18 |
| marca | ❌ No | Linked to model, complex to change |
| modelo | ❌ No | Linked to catalog, complex to change |
| ano | ⚠️ Limited | Only if no catalog link |
| apelido | ✅ Yes | |
| cor | ✅ Yes | |
| renavam | ✅ Yes | |
| km_atual | ✅ Yes | |
| photo | ✅ Yes | |

---

## 4. Default Reminder Rules

### BR-15: IPVA Auto-Calculation

**Rule:** When vehicle is registered, calculate IPVA vencimento date.

**Calculation:**
1. Get placa final digit (last character)
2. Look up vencimento month for user's estado
3. Set date to day 1 of that month, next applicable year

**Example (São Paulo):**
```
Placa: ABC1D23 → final digit = 3
SP calendar: digit 3 = March
Today: December 2024
Result: IPVA vencimento = March 1, 2025
```

**Edge Cases:**
- If current month is past vencimento month, use next year
- Mercosul plates: use last NUMBER (not letter)

**State Calendars:** See Technical Spec for full calendar.

---

### BR-16: Licenciamento Auto-Calculation

**Rule:** When vehicle is registered, calculate Licenciamento vencimento date.

**Calculation:**
- Typically 1-2 months after IPVA (varies by state)
- Some states: same schedule as IPVA
- Some states: fixed month regardless of plate

**State Rules:** See Technical Spec for full rules per state.

---

### BR-17: Default Reminder Creation

**Rule:** After vehicle registration, prompt user to create default reminders.

**Always Suggest:**
- IPVA (auto-calculated, user can adjust)
- Licenciamento (auto-calculated, user can adjust)
- Seguro (ask user for date, optional)

**Conditionally Suggest (if catalog exists):**
- Maintenance items from catalog (Óleo, Filtro, etc.)
- Ask for "última manutenção" date/km to calculate next

**User Control:**
- Checkboxes to enable/disable each suggestion
- Can skip entire screen ("Pular por agora")
- Can always add reminders later

---

### BR-18: Estado Change Impact

**Rule:** Changing vehicle's estado triggers recalculation of document dates.

**Affected Reminders:**
- IPVA (different calendar per state)
- Licenciamento (different calendar per state)

**Behavior:**
1. User changes estado
2. System identifies active IPVA/Licenciamento reminders
3. Calculate new dates based on new estado
4. Show user the changes:
   > "Ao mudar para [novo estado], suas datas serão atualizadas:
   > - IPVA: [old date] → [new date]
   > - Licenciamento: [old date] → [new date]"
5. User confirms or cancels

---

## 5. Quilometragem Rules

### BR-19: Manual KM Entry

**Rule:** Users can manually set vehicle's current km.

**Validation:**
- Must be positive integer
- Must be ≥ previous km (can't go backwards)
- Max: 9,999,999 km

**Warning (not blocking):**
If new km is significantly lower than previous, show warning:
> "A quilometragem informada é menor que a anterior. Deseja continuar?"

---

### BR-20: KM Prompt on Maintenance Completion

**Rule:** When user marks maintenance as complete, prompt for current km.

**Behavior:**
1. User marks reminder as "Concluído"
2. Show modal: "Qual a quilometragem atual do veículo?"
3. Pre-fill with last known km (if any)
4. Optional: user can skip
5. If provided, update vehicle's `km_atual`

**Impact:**
- Updates vehicle km
- Used to calculate next km-based maintenance
- Saved in maintenance history

---

### BR-21: KM-Based Reminder Calculation

**Rule:** Calculate next maintenance based on km interval and current km.

**Formula:**
```
next_km = current_km + interval_km

IF current_km > last_maintenance_km + interval_km:
    Status = OVERDUE
ELSE IF current_km > last_maintenance_km + interval_km - 1000:
    Status = DUE_SOON
ELSE:
    Status = OK
```

**Note:** KM-based reminders work alongside time-based. Whichever comes first triggers the reminder.

---

## 6. Photo Rules

### BR-22: Photo Upload

**Rule:** Users can upload one photo per vehicle.

**Constraints:**
- Max file size: 5 MB
- Formats: JPEG, PNG
- Storage: S3 (or compatible)
- Processing: Resize to max 800x800, maintain aspect ratio, compress

**Behavior:**
1. User selects photo (camera or gallery)
2. Client-side preview and optional crop
3. Upload to server
4. Server processes (resize, compress)
5. Store in S3, save URL to vehicle record
6. Delete old photo if replacing

---

### BR-23: Photo Deletion

**Rule:** When vehicle is hard-deleted (after 90-day retention), delete photo from S3.

**Also delete if:**
- User uploads new photo (replace old)
- User explicitly removes photo (future feature)

---

## 7. Data Validation Summary

### Vehicle Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| placa | string | Yes | BR-01 regex, BR-02 unique |
| tipo | enum | Yes | BR-03 values |
| estado | enum | Yes | BR-04 values |
| brand_id | uuid | Yes | FK to VehicleBrand |
| model_id | uuid | Yes | FK to VehicleModel |
| ano | integer | Yes | 1950 ≤ ano ≤ current_year + 1 |
| apelido | string | No | Max 50 chars, allow emoji |
| cor | string | No | Max 30 chars |
| renavam | string | No | 9-11 digits |
| km_atual | integer | No | 0 ≤ km ≤ 9,999,999 |
| photo_url | string | No | Valid URL |

### Renavam Validation

**Format:** 9 to 11 digits (older vehicles have 9-10, newer have 11)

**Regex:**
```regex
^[0-9]{9,11}$
```

---

## 8. Error Codes

| Code | Message (PT-BR) | Trigger |
|------|-----------------|---------|
| VH-001 | Placa inválida | BR-01 validation failed |
| VH-002 | Esta placa já está cadastrada | BR-02 uniqueness failed |
| VH-003 | Tipo de veículo inválido | BR-03 invalid type |
| VH-004 | Estado inválido | BR-04 invalid state |
| VH-005 | Ano inválido | Year out of range |
| VH-006 | Renavam inválido | Invalid renavam format |
| VH-007 | Quilometragem inválida | KM negative or too high |
| VH-008 | Foto muito grande | Photo > 5MB |
| VH-009 | Formato de foto inválido | Not JPEG/PNG |
| VH-010 | Veículo não encontrado | Vehicle ID doesn't exist |
| VH-011 | Sem permissão | User doesn't own vehicle |
| VH-012 | Não é possível editar placa | Tried to edit placa |
| VH-013 | Falha ao gerar dados do veículo | AI generation failed |

---

## 9. Business Rules Index

| ID | Name | Section |
|----|------|---------|
| BR-01 | Placa Format Validation | 1 |
| BR-02 | Placa Global Uniqueness | 1 |
| BR-03 | Vehicle Type Enumeration | 1 |
| BR-04 | Estado Requirement | 1 |
| BR-05 | Catalog Linking | 2 |
| BR-06 | AI Catalog Generation | 2 |
| BR-07 | AI Generation Failure Fallback | 2 |
| BR-08 | User Maintenance Override | 2 |
| BR-09 | Unverified Brand/Model Creation | 2 |
| BR-10 | Vehicle States | 3 |
| BR-11 | Mark as Sold | 3 |
| BR-12 | Soft Delete | 3 |
| BR-13 | Hard Delete After Retention | 3 |
| BR-14 | Editable Fields | 3 |
| BR-15 | IPVA Auto-Calculation | 4 |
| BR-16 | Licenciamento Auto-Calculation | 4 |
| BR-17 | Default Reminder Creation | 4 |
| BR-18 | Estado Change Impact | 4 |
| BR-19 | Manual KM Entry | 5 |
| BR-20 | KM Prompt on Maintenance Completion | 5 |
| BR-21 | KM-Based Reminder Calculation | 5 |
| BR-22 | Photo Upload | 6 |
| BR-23 | Photo Deletion | 6 |

---

**Next:** [03-ERD.md](./03-ERD.md) — Entity Relationship Diagram
