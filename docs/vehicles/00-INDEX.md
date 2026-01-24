# Vehicle Module Documentation

**AutoKeeper v1.0**  
**Module:** Vehicle (Core)  
**Last Updated:** December 2024  
**Status:** Planning Complete

---

## Overview

The Vehicle module is the **core business module** of AutoKeeper. Every feature in the app revolves around vehicles — reminders, notifications, maintenance history, and user value are all tied to specific vehicles.

This documentation package contains everything needed to understand, design, develop, and maintain the Vehicle module.

---

## Document Index

| # | Document | Description | Audience |
|---|----------|-------------|----------|
| 01 | [PRD](./01-PRD.md) | Product Requirements Document — vision, goals, user stories | Product, Dev, Design |
| 02 | [Business Rules](./02-BUSINESS-RULES.md) | All business rules, validations, edge cases | Dev, QA |
| 03 | [ERD](./03-ERD.md) | Entity Relationship Diagram — database design | Dev, DBA |
| 04 | [Data Dictionary](./04-DATA-DICTIONARY.md) | Complete field definitions and constraints | Dev, DBA |
| 05 | [API Specification](./05-API-SPEC.md) | REST API endpoints, requests, responses | Dev (Backend/Frontend) |
| 06 | [User Flows](./06-USER-FLOWS.md) | User journeys with wireframes | Design, Dev, QA |
| 07 | [Technical Spec](./07-TECHNICAL-SPEC.md) | Architecture, integrations, implementation | Dev, DevOps |

---

## Quick Reference

### What is a Vehicle in AutoKeeper?

A vehicle is a user-owned automotive asset (car or motorcycle) that the user wants to track for maintenance and document renewals. Each vehicle has:

- **Identity:** Placa (license plate), tipo (type), marca/modelo (make/model)
- **Ownership:** Belongs to exactly one user (no sharing in v1)
- **State:** Active, Sold, or Deleted
- **Reminders:** IPVA, Licenciamento, Seguro, maintenance items
- **History:** Complete record of all completed maintenance

### Key Decisions (v1)

| Decision | Choice |
|----------|--------|
| Vehicle types | Carro, Moto only |
| Placa uniqueness | Globally unique (one user per vehicle) |
| Vehicle limit | Unlimited per user |
| Photo upload | Yes |
| Maintenance history | Yes, tracked |
| Sharing | Not in v1 (future feature) |
| Soft delete | Yes, with 90-day retention |

### Data Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED (System-wide)                     │
│  VehicleBrand → VehicleModel → VehicleCatalog               │
│                                    ↓                        │
│                         MaintenanceTemplate                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      USER-SPECIFIC                          │
│  UserVehicle → UserMaintenanceOverride                      │
│       ↓                                                     │
│  Reminder → MaintenanceHistory                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Module Dependencies

### Depends On
- **Auth Module:** User authentication and authorization
- **Users Module:** User profile (for estado default)

### Depended By
- **Reminders Module:** All reminders are linked to vehicles
- **Notifications Module:** Vehicle context for notifications
- **Email Module:** Vehicle info in email templates

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0-draft | Dec 2024 | Initial planning complete |

---

## How to Use This Documentation

1. **Product/Design:** Start with PRD and User Flows
2. **Backend Dev:** Read all, focus on Business Rules, ERD, API Spec
3. **Frontend Dev:** Focus on API Spec, User Flows
4. **QA:** Focus on Business Rules, User Flows for test cases
5. **New team members:** Read PRD first, then explore as needed

---

**Next:** [01-PRD.md](./01-PRD.md) — Product Requirements Document
