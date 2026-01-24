# Vehicles Catalog API

Base URL: `http://localhost:3000/vehicles`

Authentication: Bearer token required for POST requests

---

## Brands

### List Brands

```bash
curl -X GET "http://localhost:3000/vehicles/brands" \
  -H "Content-Type: application/json"
```

With filters:
```bash
curl -X GET "http://localhost:3000/vehicles/brands?type=CARRO&search=Honda&limit=10" \
  -H "Content-Type: application/json"
```

Next page (cursor pagination):
```bash
curl -X GET "http://localhost:3000/vehicles/brands?cursor=0194fc2a-..." \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "data": [
    {
      "id": "0194fc2a-...",
      "name": "Honda",
      "type": "CARRO",
      "logoUrl": null,
      "verified": false,
      "createdBy": "user-123",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "nextCursor": "0194fc2b-..."
}
```

### Create Brand

```bash
curl -X POST "http://localhost:3000/vehicles/brands" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Honda",
    "type": "CARRO",
    "logoUrl": "https://example.com/honda.png"
  }'
```

### Get Brand by ID

```bash
curl -X GET "http://localhost:3000/vehicles/brands/{id}" \
  -H "Content-Type: application/json"
```

---

## Models

### List Models by Brand

```bash
curl -X GET "http://localhost:3000/vehicles/brands/{brandId}/models" \
  -H "Content-Type: application/json"
```

With filters:
```bash
curl -X GET "http://localhost:3000/vehicles/brands/{brandId}/models?type=CARRO" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "data": [
    {
      "id": "0194fc2c-...",
      "brandId": "0194fc2a-...",
      "name": "Civic",
      "type": "CARRO",
      "verified": false,
      "createdBy": "user-123",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "nextCursor": null
}
```

### Create Model

```bash
curl -X POST "http://localhost:3000/vehicles/brands/{brandId}/models" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Civic",
    "type": "CARRO"
  }'
```

---

## Catalogs

### List Catalogs by Model

```bash
curl -X GET "http://localhost:3000/vehicles/models/{modelId}/catalogs" \
  -H "Content-Type: application/json"
```

With year range filter:
```bash
curl -X GET "http://localhost:3000/vehicles/models/{modelId}/catalogs?yearFrom=2020&yearTo=2024" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "data": [
    {
      "id": "0194fc2d-...",
      "modelId": "0194fc2c-...",
      "year": 2024,
      "version": "Touring",
      "engine": "2.0L Turbo",
      "fuel": "GASOLINA",
      "transmission": "AUTOMATICO",
      "source": "MANUAL",
      "createdBy": "user-123",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "nextCursor": null
}
```

### Create Catalog Entry

```bash
curl -X POST "http://localhost:3000/vehicles/models/{modelId}/catalogs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "year": 2024,
    "version": "Touring",
    "engine": "2.0L Turbo",
    "fuel": "GASOLINA",
    "transmission": "AUTOMATICO"
  }'
```

### Search Catalogs

```bash
curl -X GET "http://localhost:3000/vehicles/catalogs/search?brand=Honda&year=2024" \
  -H "Content-Type: application/json"
```

Response:
```json
[
  {
    "id": "0194fc2d-...",
    "year": 2024,
    "version": "Touring",
    "engine": "2.0L Turbo",
    "fuel": "GASOLINA",
    "transmission": "AUTOMATICO",
    "modelName": "Civic",
    "brandName": "Honda"
  }
]
```

---

## Error Responses

### 400 Validation Error
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid vehicle type. Must be CARRO or MOTO."
}
```

### 404 Not Found
```json
{
  "code": "BRAND_NOT_FOUND",
  "message": "Brand not found"
}
```

### 409 Conflict
```json
{
  "code": "BRAND_EXISTS",
  "message": "Brand already exists with this name and type"
}
```
