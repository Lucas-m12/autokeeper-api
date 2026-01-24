# 05 — API Specification

**Module:** Vehicle  
**Version:** 1.0  
**Base URL:** `/api/v1`  
**Last Updated:** December 2024

---

## Overview

This document defines the REST API endpoints for the Vehicle module. All endpoints require authentication unless otherwise noted.

---

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Unauthenticated requests return `401 Unauthorized`.

---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VH-001",
    "message": "Placa inválida. Use o formato ABC1234 ou ABC1D23."
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

## 1. Vehicle Endpoints

### 1.1 List User Vehicles

**GET** `/vehicles`

Returns all vehicles for the authenticated user, sorted by urgency.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | `ACTIVE,SOLD` | Filter by status (comma-separated) |
| type | string | — | Filter by vehicle type (CARRO, MOTO) |
| page | integer | 1 | Page number |
| per_page | integer | 20 | Items per page (max 100) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "placa": "ABC1D23",
      "placa_formatted": "ABC-1D23",
      "type": "CARRO",
      "status": "ACTIVE",
      "estado": "SP",
      "apelido": "Meu Civic",
      "cor": "Prata",
      "ano": 2020,
      "km_atual": 45230,
      "photo_url": "https://s3.../photo.jpg",
      "brand": {
        "id": "uuid-brand",
        "name": "Honda"
      },
      "model": {
        "id": "uuid-model",
        "name": "Civic"
      },
      "urgency": {
        "status": "WARNING",
        "days_until_next": 15,
        "next_reminder": {
          "id": "uuid-reminder",
          "title": "IPVA 2025",
          "due_date": "2025-01-15"
        }
      },
      "created_at": "2024-06-15T10:30:00Z",
      "updated_at": "2024-12-01T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 3,
    "total_pages": 1
  }
}
```

**Urgency Status Values:**
- `OK` — All reminders are 30+ days away (🟢)
- `WARNING` — At least one reminder within 30 days (🟡)
- `OVERDUE` — At least one reminder is past due (🔴)

---

### 1.2 Get Vehicle Details

**GET** `/vehicles/:id`

Returns detailed information for a specific vehicle.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Vehicle ID |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "placa": "ABC1D23",
    "placa_formatted": "ABC-1D23",
    "type": "CARRO",
    "status": "ACTIVE",
    "estado": "SP",
    "apelido": "Meu Civic",
    "cor": "Prata",
    "renavam": "12345678901",
    "ano": 2020,
    "km_atual": 45230,
    "photo_url": "https://s3.../photo.jpg",
    "brand": {
      "id": "uuid-brand",
      "name": "Honda",
      "logo_url": "https://..."
    },
    "model": {
      "id": "uuid-model",
      "name": "Civic"
    },
    "catalog": {
      "id": "uuid-catalog",
      "version": "1.5 Turbo",
      "fuel": "FLEX",
      "transmission": "CVT"
    },
    "reminders_summary": {
      "active": 5,
      "overdue": 1,
      "upcoming": 2
    },
    "sold_at": null,
    "created_at": "2024-06-15T10:30:00Z",
    "updated_at": "2024-12-01T14:22:00Z"
  }
}
```

**Error Responses:**

| Code | Message |
|------|---------|
| 404 | Veículo não encontrado |
| 403 | Sem permissão para acessar este veículo |

---

### 1.3 Create Vehicle

**POST** `/vehicles`

Creates a new vehicle for the authenticated user.

**Request Body:**

```json
{
  "placa": "ABC1D23",
  "type": "CARRO",
  "estado": "SP",
  "brand_id": "uuid-brand",
  "model_id": "uuid-model",
  "ano": 2020,
  "apelido": "Meu Civic",
  "cor": "Prata",
  "renavam": "12345678901",
  "km_atual": 45000
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| placa | string | Yes | License plate |
| type | enum | Yes | CARRO or MOTO |
| estado | enum | Yes | Brazilian state (UF) |
| brand_id | UUID | Yes | FK to vehicle_brands |
| model_id | UUID | Yes | FK to vehicle_models |
| ano | integer | Yes | Vehicle year |
| apelido | string | No | Nickname (max 50 chars) |
| cor | string | No | Color (max 30 chars) |
| renavam | string | No | Renavam (9-11 digits) |
| km_atual | integer | No | Current odometer |

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid-new-vehicle",
    "placa": "ABC1D23",
    "catalog_id": "uuid-catalog",
    "catalog_source": "EXISTING",
    "default_reminders": {
      "ipva": {
        "suggested_date": "2025-03-01",
        "final_digit": "3"
      },
      "licenciamento": {
        "suggested_date": "2025-04-01"
      },
      "maintenance": [
        {
          "type": "OLEO",
          "interval_km": 10000,
          "interval_months": 12,
          "description": "Troca de óleo do motor"
        }
      ]
    },
    "created_at": "2024-12-15T10:30:00Z"
  }
}
```

**Catalog Source Values:**
- `EXISTING` — Matched existing catalog entry
- `AI_GENERATED` — New entry created by AI
- `MANUAL` — No catalog (user must add maintenance manually)

**Error Responses:**

| Code | Message |
|------|---------|
| VH-001 | Placa inválida |
| VH-002 | Esta placa já está cadastrada |
| VH-003 | Tipo de veículo inválido |
| VH-004 | Estado inválido |
| VH-005 | Ano inválido |
| VH-006 | Renavam inválido |

---

### 1.4 Update Vehicle

**PATCH** `/vehicles/:id`

Updates vehicle information. Only provided fields are updated.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Vehicle ID |

**Request Body:**

```json
{
  "apelido": "Civic do Trabalho",
  "cor": "Preto",
  "km_atual": 48000,
  "estado": "RJ"
}
```

| Field | Type | Editable | Notes |
|-------|------|----------|-------|
| apelido | string | Yes | |
| cor | string | Yes | |
| renavam | string | Yes | |
| km_atual | integer | Yes | Must be ≥ previous |
| estado | string | Yes | Triggers IPVA recalculation |
| ano | integer | Limited | Only if no catalog link |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "apelido": "Civic do Trabalho",
    "estado": "RJ",
    "estado_changed": true,
    "recalculated_dates": {
      "ipva": {
        "old_date": "2025-03-01",
        "new_date": "2025-04-01"
      },
      "licenciamento": {
        "old_date": "2025-04-01",
        "new_date": "2025-05-01"
      }
    },
    "updated_at": "2024-12-15T11:00:00Z"
  }
}
```

**Error Responses:**

| Code | Message |
|------|---------|
| VH-010 | Veículo não encontrado |
| VH-011 | Sem permissão |
| VH-012 | Não é possível editar placa |

---

### 1.5 Upload Vehicle Photo

**POST** `/vehicles/:id/photo`

Uploads a photo for the vehicle.

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| photo | file | Yes | Image file (JPEG, PNG) |

**Constraints:**
- Max file size: 5 MB
- Formats: JPEG, PNG
- Auto-resized to max 800x800

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "photo_url": "https://s3.../vehicles/uuid-123/photo.jpg",
    "updated_at": "2024-12-15T11:00:00Z"
  }
}
```

**Error Responses:**

| Code | Message |
|------|---------|
| VH-008 | Foto muito grande (máx 5MB) |
| VH-009 | Formato de foto inválido |

---

### 1.6 Delete Vehicle Photo

**DELETE** `/vehicles/:id/photo`

Removes the vehicle photo.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "photo_url": null,
    "updated_at": "2024-12-15T11:00:00Z"
  }
}
```

---

### 1.7 Mark Vehicle as Sold

**POST** `/vehicles/:id/sold`

Marks a vehicle as sold (stops reminders but keeps history).

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "status": "SOLD",
    "sold_at": "2024-12-15T11:00:00Z",
    "reminders_deactivated": 5
  }
}
```

---

### 1.8 Reactivate Vehicle

**POST** `/vehicles/:id/reactivate`

Reactivates a sold vehicle.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "status": "ACTIVE",
    "sold_at": null,
    "message": "Veículo reativado. Verifique as datas dos lembretes."
  }
}
```

---

### 1.9 Delete Vehicle

**DELETE** `/vehicles/:id`

Soft deletes a vehicle and its reminders.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "status": "DELETED",
    "deleted_at": "2024-12-15T11:00:00Z",
    "reminders_deleted": 5,
    "retention_days": 90
  }
}
```

---

### 1.10 Update Vehicle KM

**PATCH** `/vehicles/:id/km`

Quick endpoint to update odometer reading.

**Request Body:**

```json
{
  "km_atual": 48500
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "km_atual": 48500,
    "previous_km": 45230,
    "updated_at": "2024-12-15T11:00:00Z"
  }
}
```

---

## 2. Brand Endpoints

### 2.1 List Brands

**GET** `/brands`

Returns all verified brands (and user's unverified brands).

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| type | enum | — | Filter by CARRO or MOTO |
| search | string | — | Search by name |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-brand-1",
      "name": "Honda",
      "type": "CARRO",
      "logo_url": "https://...",
      "verified": true
    },
    {
      "id": "uuid-brand-2",
      "name": "Toyota",
      "type": "CARRO",
      "logo_url": "https://...",
      "verified": true
    }
  ]
}
```

---

### 2.2 Create Brand (Unverified)

**POST** `/brands`

Creates a new unverified brand.

**Request Body:**

```json
{
  "name": "BYD",
  "type": "CARRO"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid-new-brand",
    "name": "BYD",
    "type": "CARRO",
    "verified": false,
    "created_by": "uuid-user"
  }
}
```

---

## 3. Model Endpoints

### 3.1 List Models by Brand

**GET** `/brands/:brandId/models`

Returns all models for a specific brand.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| search | string | — | Search by name |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-model-1",
      "name": "Civic",
      "type": "CARRO",
      "verified": true
    },
    {
      "id": "uuid-model-2",
      "name": "City",
      "type": "CARRO",
      "verified": true
    }
  ]
}
```

---

### 3.2 Create Model (Unverified)

**POST** `/brands/:brandId/models`

Creates a new unverified model.

**Request Body:**

```json
{
  "name": "ZR-V",
  "type": "CARRO"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid-new-model",
    "brand_id": "uuid-brand",
    "name": "ZR-V",
    "type": "CARRO",
    "verified": false,
    "created_by": "uuid-user"
  }
}
```

---

## 4. Catalog Endpoints

### 4.1 Get Catalog by Model and Year

**GET** `/models/:modelId/catalog/:year`

Returns catalog entry for a specific model and year.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid-catalog",
    "model_id": "uuid-model",
    "year": 2020,
    "version": "1.5 Turbo",
    "fuel": "FLEX",
    "transmission": "CVT",
    "source": "VERIFIED",
    "maintenance_templates": [
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
}
```

**Response if not found:** `404 Not Found`

```json
{
  "success": false,
  "error": {
    "code": "CAT-001",
    "message": "Catálogo não encontrado para este modelo e ano"
  },
  "data": {
    "can_generate": true
  }
}
```

---

### 4.2 Generate Catalog with AI

**POST** `/models/:modelId/catalog/:year/generate`

Triggers AI generation of catalog entry.

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid-new-catalog",
    "model_id": "uuid-model",
    "year": 2020,
    "source": "AI",
    "maintenance_templates": [
      {
        "type": "OLEO",
        "interval_km": 10000,
        "interval_months": 12,
        "description": "Troca de óleo do motor"
      }
    ],
    "message": "Dados gerados automaticamente. Verifique se estão corretos."
  }
}
```

**Error Response:**

| Code | Message |
|------|---------|
| VH-013 | Falha ao gerar dados do veículo |

---

## 5. Maintenance Override Endpoints

### 5.1 Get Vehicle Maintenance Intervals

**GET** `/vehicles/:id/maintenance`

Returns maintenance intervals for a vehicle (with overrides applied).

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "type": "OLEO",
      "description": "Troca de óleo do motor",
      "interval_km": 8000,
      "interval_months": 12,
      "is_override": true,
      "catalog_interval_km": 10000,
      "catalog_interval_months": 12
    },
    {
      "type": "FILTRO_AR",
      "description": "Filtro de ar do motor",
      "interval_km": 20000,
      "interval_months": 24,
      "is_override": false
    }
  ]
}
```

---

### 5.2 Set Maintenance Override

**PUT** `/vehicles/:id/maintenance/:type`

Sets a custom maintenance interval for the vehicle.

**Request Body:**

```json
{
  "custom_interval_km": 8000,
  "custom_interval_months": 10
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "type": "OLEO",
    "custom_interval_km": 8000,
    "custom_interval_months": 10,
    "message": "Intervalo personalizado salvo"
  }
}
```

---

### 5.3 Remove Maintenance Override

**DELETE** `/vehicles/:id/maintenance/:type`

Removes custom interval, reverting to catalog default.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "type": "OLEO",
    "reverted_to_catalog": true,
    "catalog_interval_km": 10000,
    "catalog_interval_months": 12
  }
}
```

---

## 6. Maintenance History Endpoints

### 6.1 Get Vehicle Maintenance History

**GET** `/vehicles/:id/history`

Returns maintenance history for a vehicle.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| type | enum | — | Filter by maintenance type |
| page | integer | 1 | Page number |
| per_page | integer | 20 | Items per page |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-history-1",
      "maintenance_type": "OLEO",
      "completed_at": "2024-06-15",
      "km_at_completion": 40000,
      "cost": 350.00,
      "service_provider": "Oficina do João",
      "notes": "Usado óleo sintético",
      "created_at": "2024-06-15T14:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### 6.2 Add Maintenance History Entry

**POST** `/vehicles/:id/history`

Manually adds a maintenance history entry.

**Request Body:**

```json
{
  "maintenance_type": "OLEO",
  "completed_at": "2024-12-10",
  "km_at_completion": 48000,
  "cost": 380.00,
  "service_provider": "Concessionária Honda",
  "notes": "Troca de óleo e filtro"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid-new-history",
    "maintenance_type": "OLEO",
    "completed_at": "2024-12-10",
    "vehicle_km_updated": true,
    "next_maintenance": {
      "due_km": 58000,
      "due_date": "2025-12-10"
    }
  }
}
```

---

## 7. Helper Endpoints

### 7.1 Validate Placa

**GET** `/vehicles/validate-placa/:placa`

Checks if a placa is valid and available.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "placa": "ABC1D23",
    "valid": true,
    "available": true,
    "format": "MERCOSUL"
  }
}
```

**If taken:**

```json
{
  "success": true,
  "data": {
    "placa": "ABC1D23",
    "valid": true,
    "available": false,
    "message": "Esta placa já está cadastrada por outro usuário"
  }
}
```

---

### 7.2 Get IPVA/Licenciamento Dates

**GET** `/vehicles/calculate-dates`

Calculates document dates based on state and placa.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| estado | enum | Yes | Brazilian state |
| placa | string | Yes | License plate |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "estado": "SP",
    "final_digit": "3",
    "ipva": {
      "month": 3,
      "year": 2025,
      "date": "2025-03-01"
    },
    "licenciamento": {
      "month": 4,
      "year": 2025,
      "date": "2025-04-01"
    }
  }
}
```

---

### 7.3 Get Brazilian States

**GET** `/states`

Returns list of Brazilian states for dropdown.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    { "code": "AC", "name": "Acre" },
    { "code": "AL", "name": "Alagoas" },
    { "code": "SP", "name": "São Paulo" }
  ]
}
```

---

## 8. Error Codes Reference

| Code | HTTP Status | Message |
|------|-------------|---------|
| VH-001 | 400 | Placa inválida |
| VH-002 | 409 | Esta placa já está cadastrada |
| VH-003 | 400 | Tipo de veículo inválido |
| VH-004 | 400 | Estado inválido |
| VH-005 | 400 | Ano inválido |
| VH-006 | 400 | Renavam inválido |
| VH-007 | 400 | Quilometragem inválida |
| VH-008 | 400 | Foto muito grande |
| VH-009 | 400 | Formato de foto inválido |
| VH-010 | 404 | Veículo não encontrado |
| VH-011 | 403 | Sem permissão |
| VH-012 | 400 | Não é possível editar placa |
| VH-013 | 500 | Falha ao gerar dados do veículo |
| CAT-001 | 404 | Catálogo não encontrado |

---

**Next:** [06-USER-FLOWS.md](./06-USER-FLOWS.md) — User Flows
