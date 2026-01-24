# Vehicle Module - Development Stories

## Overview

User story-based development plan for the AutoKeeper vehicle module. Follows ports & adapters architecture pattern. Priority: catalog foundation → user vehicles → maintenance features.

## Module Structure

```
src/modules/vehicles/
├── index.ts
├── domain/                          # Already exists
├── application/
│   ├── errors.ts
│   ├── brand.repository.ts
│   ├── brand.service.ts
│   ├── model.repository.ts
│   ├── model.service.ts
│   ├── catalog.repository.ts
│   ├── catalog.service.ts
│   ├── vehicle.repository.ts
│   ├── vehicle.service.ts
│   ├── maintenance-template.repository.ts
│   ├── maintenance-template.service.ts
│   ├── maintenance-override.repository.ts
│   ├── maintenance-override.service.ts
│   ├── maintenance-history.repository.ts
│   └── maintenance-history.service.ts
└── infra/
    ├── database/
    │   ├── index.ts
    │   └── drizzle-*.repository.ts
    └── http/
        └── routes.ts
```

---

## Epic 1: Catalog Foundation

### Story 1.1: List Vehicle Brands
**As a** user, **I want to** view available vehicle brands **so that** I can select when registering my vehicle

**Acceptance Criteria:**
- Paginated list of verified brands
- Filter by vehicle type (CARRO, MOTO)
- Search by brand name
- Returns id, name, type, logo URL

**Tasks:**
- Repository: `BrandRepository` interface with `findAll(filters)`
- Repository: `DrizzleBrandRepository` with pagination/filtering
- Service: `BrandService.listBrands(filters)`
- Routes: `GET /brands`

---

### Story 1.2: Create Vehicle Brand
**As an** authenticated user, **I want to** add a new brand **so that** missing brands can be used

**Acceptance Criteria:**
- Creates with name, type, optional logo
- Validates name+type uniqueness
- User-created = unverified
- Sets createdBy

**Tasks:**
- Repository: `create(data)`, `existsByNameAndType()`
- Service: `createBrand(userId, input)`
- Routes: `POST /brands`

**Depends on:** 1.1

---

### Story 1.3: List Vehicle Models by Brand
**As a** user, **I want to** view models for a brand **so that** I can select my model

**Acceptance Criteria:**
- Filter by brand ID
- Filter by vehicle type
- Search by model name
- Only verified models for regular users

**Tasks:**
- Repository: `ModelRepository.findByBrand(brandId, filters)`
- Service: `ModelService.listModelsByBrand()`
- Routes: `GET /brands/:brandId/models`

**Depends on:** 1.1

---

### Story 1.4: Create Vehicle Model
**As an** authenticated user, **I want to** add a new model **so that** missing models can be used

**Acceptance Criteria:**
- Linked to existing brand
- Validates brand exists
- Validates name+brand uniqueness
- User-created = unverified

**Tasks:**
- Repository: `create(data)`, `existsByBrandAndName()`
- Service: `createModel(userId, brandId, input)`
- Routes: `POST /brands/:brandId/models`

**Depends on:** 1.3

---

### Story 1.5: List Catalog Entries by Model
**As a** user, **I want to** view year/version combinations **so that** I can select my exact vehicle

**Acceptance Criteria:**
- Filter by model ID
- Filter by year range
- Returns year, version, engine, fuel, transmission
- Sorted by year descending

**Tasks:**
- Repository: `CatalogRepository.findByModel(modelId, filters)`
- Service: `CatalogService.listCatalogsByModel()`
- Routes: `GET /models/:modelId/catalogs`

**Depends on:** 1.3

---

### Story 1.6: Create Catalog Entry
**As an** authenticated user, **I want to** add a year/version entry **so that** specific configurations can be tracked

**Acceptance Criteria:**
- Linked to model
- Validates model+year+version uniqueness
- Optional: engine, fuel, transmission
- Source = "MANUAL"

**Tasks:**
- Repository: `create(data)`, uniqueness check
- Service: `createCatalog(userId, modelId, input)`
- Routes: `POST /models/:modelId/catalogs`

**Depends on:** 1.5

---

### Story 1.7: Search Catalog (Unified)
**As a** user, **I want to** search across brands/models/years **so that** I can quickly find my vehicle

**Acceptance Criteria:**
- Single search endpoint
- Accepts brand, model, year params
- Returns catalog entries with full hierarchy
- Partial matching, top 20 results

**Tasks:**
- Repository: `searchCatalogs(query)` with JOINs
- Service: `searchCatalogs(query)`
- Routes: `GET /catalogs/search`

**Depends on:** 1.1, 1.3, 1.5

---

## Epic 2: User Vehicle Registration

### Story 2.1: Register User Vehicle
**As a** user, **I want to** register my vehicle **so that** I can track maintenance

**Acceptance Criteria:**
- Required: license plate, type, state (UF), year
- Optional: catalog ID, nickname, color, renavam, current KM, photo
- Validate plate format (ABC1D23 or ABC1234)
- Validate state is valid Brazilian UF
- Validate year (1950 to current+1)
- Enforce plan limit (MVP: 1 vehicle free)

**Tasks:**
- Repository: `VehicleRepository.create()`, `countByUser()`
- Service: `VehicleService.createVehicle()` with plan limit
- Routes: `POST /vehicles`

**Depends on:** Epic 1

---

### Story 2.2: List User Vehicles
**As a** user, **I want to** see all my vehicles **so that** I can manage them

**Acceptance Criteria:**
- Only authenticated user's vehicles
- Excludes soft-deleted
- Includes catalog info (brand, model, year)
- Filter by status (ACTIVE, SOLD)
- Sorted by creation date desc

**Tasks:**
- Repository: `findByUser(userId, filters)` with JOINs
- Service: `listUserVehicles()`
- Routes: `GET /vehicles`

**Depends on:** 2.1

---

### Story 2.3: Get Vehicle Details
**As a** user, **I want to** view vehicle details **so that** I can see specifications

**Acceptance Criteria:**
- Full details by ID
- Validates ownership
- Includes catalog info
- 404 if not found/not owned

**Tasks:**
- Repository: `findById()`, `findByIdWithCatalog()`
- Service: `getVehicleDetails()` with ownership check
- Routes: `GET /vehicles/:id`

**Depends on:** 2.1

---

### Story 2.4: Update Vehicle Information
**As a** user, **I want to** update vehicle info **so that** data stays accurate

**Acceptance Criteria:**
- Partial update
- Updatable: nickname, color, renavam, current KM, photo URL, catalog ID
- Validates ownership
- Validates field formats

**Tasks:**
- Repository: `update(id, data)`
- Service: `updateVehicle()` with validation
- Routes: `PATCH /vehicles/:id`

**Depends on:** 2.3

---

### Story 2.5: Delete Vehicle (Soft)
**As a** user, **I want to** remove a vehicle **so that** I don't see it but history is preserved

**Acceptance Criteria:**
- Soft delete (sets deletedAt)
- Validates ownership
- Hidden from list queries

**Tasks:**
- Repository: `softDelete(id)`
- Service: `deleteVehicle()` with ownership check
- Routes: `DELETE /vehicles/:id`

**Depends on:** 2.3

---

## Epic 3: Vehicle Lifecycle

### Story 3.1: Mark Vehicle as Sold
**As a** user, **I want to** mark vehicle as sold **so that** it's distinguished from active vehicles

**Acceptance Criteria:**
- Sets status=SOLD, soldAt timestamp
- Only ACTIVE vehicles
- Stops new reminders
- Remains visible with "sold" status

**Tasks:**
- Repository: `markAsSold(id)`
- Service: `markVehicleAsSold()` with status validation
- Routes: `POST /vehicles/:id/sell`

**Depends on:** 2.3

---

### Story 3.2: Reactivate Sold Vehicle
**As a** user, **I want to** reactivate a sold vehicle **so that** I can track it again

**Acceptance Criteria:**
- Sets status=ACTIVE, clears soldAt
- Only SOLD vehicles
- Validates ownership

**Tasks:**
- Repository: `reactivate(id)`
- Service: `reactivateVehicle()` with status validation
- Routes: `POST /vehicles/:id/reactivate`

**Depends on:** 3.1

---

### Story 3.3: Update Vehicle Odometer (KM)
**As a** user, **I want to** update KM reading **so that** km-based reminders are accurate

**Acceptance Criteria:**
- Updates currentKm
- New KM >= previous (can't go backwards)
- Range: 0 to 9,999,999
- Only ACTIVE vehicles

**Tasks:**
- Repository: `updateKm(id, km)`
- Service: `updateVehicleKm()` with validation
- Routes: `PATCH /vehicles/:id/km`

**Depends on:** 2.4

---

### Story 3.4: Upload Vehicle Photo
**As a** user, **I want to** add/update vehicle photo **so that** I can identify it

**Acceptance Criteria:**
- Accepts JPEG, PNG
- Max 5MB
- Validates ownership
- Returns updated vehicle

**Tasks:**
- Repository: `updatePhoto(id, photoUrl)`
- Service: `updateVehiclePhoto()`
- Routes: `POST /vehicles/:id/photo`

**Depends on:** 2.4

---

## Epic 4: Maintenance Templates

### Story 4.1: List Maintenance Templates
**As a** user, **I want to** see recommended maintenance schedule **so that** I know what's expected

**Acceptance Criteria:**
- Returns templates by catalog ID
- Includes type, description, intervals
- Sorted by type
- Empty array if none

**Tasks:**
- Repository: `MaintenanceTemplateRepository.findByCatalog()`
- Service: `MaintenanceTemplateService.listTemplates()`
- Routes: `GET /catalogs/:catalogId/maintenance-templates`

**Depends on:** 1.5

---

### Story 4.2: Create Maintenance Template
**As an** admin, **I want to** add templates to catalog **so that** users get schedules

**Acceptance Criteria:**
- Linked to catalog
- Required: type, description
- Optional: interval KM/months, notes, custom name
- At least one interval required
- Validates catalog exists

**Tasks:**
- Repository: `create(data)`
- Service: `createTemplate()` with validation
- Routes: `POST /catalogs/:catalogId/maintenance-templates`

**Depends on:** 4.1

---

### Story 4.3: Update Maintenance Template
**As an** admin, **I want to** update a template **so that** I can improve recommendations

**Acceptance Criteria:**
- Partial update
- Cannot change catalog or type
- Can update: description, intervals, notes

**Tasks:**
- Repository: `update(id, data)`
- Service: `updateTemplate()`
- Routes: `PATCH /maintenance-templates/:id`

**Depends on:** 4.2

---

### Story 4.4: Delete Maintenance Template
**As an** admin, **I want to** remove a template **so that** outdated ones are gone

**Acceptance Criteria:**
- Hard delete
- Returns confirmation

**Tasks:**
- Repository: `delete(id)`
- Service: `deleteTemplate()`
- Routes: `DELETE /maintenance-templates/:id`

**Depends on:** 4.2

---

## Epic 5: User Maintenance Overrides

### Story 5.1: Create Custom Interval
**As a** user, **I want to** customize intervals for my vehicle **so that** reminders match my usage

**Acceptance Criteria:**
- Linked to user's vehicle
- Specifies type and custom intervals
- Validates ownership
- At least one interval required

**Tasks:**
- Repository: `MaintenanceOverrideRepository.create()`
- Service: `MaintenanceOverrideService.createOverride()`
- Routes: `POST /vehicles/:vehicleId/maintenance-overrides`

**Depends on:** 2.3, 4.1

---

### Story 5.2: List Vehicle Overrides
**As a** user, **I want to** see my custom intervals **so that** I can manage them

**Acceptance Criteria:**
- Returns all overrides for vehicle
- Validates ownership
- Includes type and intervals

**Tasks:**
- Repository: `findByVehicle(vehicleId)`
- Service: `listOverrides()` with ownership check
- Routes: `GET /vehicles/:vehicleId/maintenance-overrides`

**Depends on:** 5.1

---

### Story 5.3: Update Override
**As a** user, **I want to** update custom intervals **so that** I can adjust as needed

**Acceptance Criteria:**
- Updates intervals
- Validates ownership

**Tasks:**
- Repository: `update(id, data)`
- Service: `updateOverride()` with ownership validation
- Routes: `PATCH /maintenance-overrides/:id`

**Depends on:** 5.2

---

### Story 5.4: Delete Override
**As a** user, **I want to** remove custom interval **so that** I revert to default

**Acceptance Criteria:**
- Hard delete
- Validates ownership

**Tasks:**
- Repository: `delete(id)`
- Service: `deleteOverride()` with ownership validation
- Routes: `DELETE /maintenance-overrides/:id`

**Depends on:** 5.2

---

## Epic 6: Maintenance History

### Story 6.1: Record Completed Maintenance
**As a** user, **I want to** record completed service **so that** I have history

**Acceptance Criteria:**
- Linked to vehicle
- Required: type, completed date
- Optional: KM, cost, notes, provider, reminder ID
- Validates ownership
- Updates vehicle KM if provided KM is higher

**Tasks:**
- Repository: `MaintenanceHistoryRepository.create()`
- Service: `MaintenanceHistoryService.recordMaintenance()`
- Routes: `POST /vehicles/:vehicleId/maintenance-history`

**Depends on:** 2.3

---

### Story 6.2: List Maintenance History
**As a** user, **I want to** view maintenance history **so that** I can track services

**Acceptance Criteria:**
- Paginated history by vehicle
- Validates ownership
- Filter by type and date range
- Sorted by date desc

**Tasks:**
- Repository: `findByVehicle(vehicleId, filters)`
- Service: `listMaintenanceHistory()`
- Routes: `GET /vehicles/:vehicleId/maintenance-history`

**Depends on:** 6.1

---

### Story 6.3: Get History Entry
**As a** user, **I want to** view specific record **so that** I see details

**Acceptance Criteria:**
- Full details by ID
- Validates ownership via vehicle
- 404 if not found/not owned

**Tasks:**
- Repository: `findById(id)`
- Service: `getMaintenanceEntry()`
- Routes: `GET /maintenance-history/:id`

**Depends on:** 6.2

---

### Story 6.4: Update History Entry
**As a** user, **I want to** update record **so that** I can correct details

**Acceptance Criteria:**
- Partial update
- Cannot change vehicle or type
- Can update: date, KM, cost, notes, provider

**Tasks:**
- Repository: `update(id, data)`
- Service: `updateMaintenanceEntry()`
- Routes: `PATCH /maintenance-history/:id`

**Depends on:** 6.3

---

### Story 6.5: Delete History Entry
**As a** user, **I want to** delete record **so that** I remove errors

**Acceptance Criteria:**
- Hard delete
- Validates ownership

**Tasks:**
- Repository: `delete(id)`
- Service: `deleteMaintenanceEntry()`
- Routes: `DELETE /maintenance-history/:id`

**Depends on:** 6.3

---

## Implementation Order

```
Phase 1: Catalog Foundation
├── 1.1 List Brands
├── 1.2 Create Brand
├── 1.3 List Models
├── 1.4 Create Model
├── 1.5 List Catalogs
├── 1.6 Create Catalog
└── 1.7 Search Catalogs

Phase 2: User Vehicles
├── 2.1 Register Vehicle
├── 2.2 List Vehicles
├── 2.3 Get Vehicle Details
├── 2.4 Update Vehicle
└── 2.5 Delete Vehicle

Phase 3: Vehicle Lifecycle
├── 3.1 Mark as Sold
├── 3.2 Reactivate
├── 3.3 Update KM
└── 3.4 Upload Photo

Phase 4: Maintenance Templates
├── 4.1 List Templates
├── 4.2 Create Template
├── 4.3 Update Template
└── 4.4 Delete Template

Phase 5: User Overrides
├── 5.1 Create Override
├── 5.2 List Overrides
├── 5.3 Update Override
└── 5.4 Delete Override

Phase 6: Maintenance History
├── 6.1 Record Maintenance
├── 6.2 List History
├── 6.3 Get Entry
├── 6.4 Update Entry
└── 6.5 Delete Entry
```

---

## Critical Reference Files

| Purpose | File |
|---------|------|
| Repository pattern | `src/modules/accounts/application/profile.repository.ts` |
| Drizzle adapter | `src/modules/accounts/infra/database/drizzle-profile.repository.ts` |
| Route handlers | `src/modules/accounts/infra/http/routes.ts` |
| User vehicles schema | `src/core/database/schema/user-vehicles.ts` |
| Existing validators | `src/modules/vehicles/domain/validators.ts` |
