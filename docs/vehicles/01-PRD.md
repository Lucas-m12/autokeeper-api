# 01 — Product Requirements Document (PRD)

**Module:** Vehicle  
**Version:** 1.0  
**Status:** Planning Complete  
**Author:** Lucas  
**Last Updated:** December 2024

---

## 1. Executive Summary

### 1.1 Problem Statement

Brazilian vehicle owners struggle to keep track of important vehicle-related deadlines and maintenance schedules. Missing IPVA payments results in fines, forgetting insurance renewals leaves vehicles unprotected, and neglecting maintenance leads to costly repairs. Current solutions are either too complex (spreadsheets), unreliable (memory), or not tailored to Brazilian requirements (foreign apps).

### 1.2 Solution

AutoKeeper's Vehicle module provides a centralized, intelligent system for Brazilian vehicle owners to register and manage their vehicles. The module automatically generates relevant reminders based on vehicle data and Brazilian regulations, while tracking maintenance history for informed decision-making.

### 1.3 Value Proposition

> "Cadastre seu veículo uma vez, nunca mais esqueça um vencimento."

- **For users:** Peace of mind knowing all vehicle obligations are tracked
- **For AutoKeeper:** Core module that drives all other features and user retention

---

## 2. Goals & Objectives

### 2.1 Primary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Easy vehicle registration | Time to register first vehicle | < 2 minutes |
| Smart defaults | % users accepting auto-generated reminders | > 70% |
| Complete tracking | Vehicles with 3+ active reminders | > 80% |
| Data accuracy | AI-generated catalog accuracy | > 90% |

### 2.2 Secondary Goals

| Goal | Metric | Target |
|------|--------|--------|
| User retention | Users returning after 30 days | > 60% |
| Multiple vehicles | Users with 2+ vehicles | > 30% |
| Maintenance history | Users logging completed maintenance | > 50% |

### 2.3 Non-Goals (Out of Scope for v1)

- Vehicle sharing between users (family accounts)
- Fleet management features (bulk operations)
- OBD device integration (automatic km sync)
- Vehicle marketplace (buy/sell)
- Insurance quotes or IPVA payment integration

---

## 3. User Stories

### 3.1 Core Stories

#### US-01: Register First Vehicle
> **As a** new user  
> **I want to** register my vehicle quickly  
> **So that** I can start receiving maintenance reminders

**Acceptance Criteria:**
- User can register with just placa, tipo, estado, marca, modelo, ano
- Apelido, cor, renavam, km, photo are optional
- System validates placa format (old and Mercosul)
- System blocks duplicate placa (already registered by another user)
- Registration completes in under 2 minutes

#### US-02: Auto-Generated Reminders
> **As a** user who just registered a vehicle  
> **I want** the app to suggest relevant reminders  
> **So that** I don't have to figure out what to track

**Acceptance Criteria:**
- System auto-calculates IPVA vencimento based on estado + placa final digit
- System auto-calculates Licenciamento based on estado + placa final digit
- System prompts for Seguro vencimento date
- System suggests maintenance items based on vehicle catalog (if available)
- User can accept, modify, or skip each suggestion

#### US-03: Vehicle Catalog Intelligence
> **As a** user registering a common vehicle model  
> **I want** the app to know my car's maintenance schedule  
> **So that** I receive accurate maintenance reminders

**Acceptance Criteria:**
- If Marca + Modelo + Ano exists in catalog, link automatically
- If not in catalog, trigger AI generation of maintenance intervals
- AI-generated data is saved for future users with same vehicle
- User can override any catalog value with personal preference

#### US-04: View My Vehicles
> **As a** user with multiple vehicles  
> **I want to** see all my vehicles at a glance  
> **So that** I can quickly check their status

**Acceptance Criteria:**
- Vehicle list shows: photo/icon, apelido, placa, modelo, km, status badge
- Status badge shows most urgent reminder status (🔴 atrasado, 🟡 vencendo, 🟢 ok)
- List sorted by urgency (most urgent first)
- Sold vehicles shown at bottom with muted styling
- Empty state guides user to add first vehicle

#### US-05: Edit Vehicle Information
> **As a** user  
> **I want to** update my vehicle's information  
> **So that** the data stays accurate

**Acceptance Criteria:**
- User can edit: apelido, cor, renavam, ano, km_atual, estado, photo
- User cannot edit: placa (must delete and re-add)
- Changing estado triggers recalculation of IPVA/Licenciamento dates
- User confirms new dates before applying

#### US-06: Update Quilometragem
> **As a** user completing a maintenance reminder  
> **I want** a quick way to update my current km  
> **So that** future km-based reminders are accurate

**Acceptance Criteria:**
- When marking maintenance complete, prompt for current km
- Quick km update available from vehicle detail screen
- km change triggers recalculation of km-based reminders

#### US-07: Mark Vehicle as Sold
> **As a** user who sold their vehicle  
> **I want to** keep the history but stop reminders  
> **So that** I have records without noise

**Acceptance Criteria:**
- "Marcar como vendido" action available
- Sold vehicles stop generating notifications
- Sold vehicles retain all history (reminders, maintenance log)
- Sold vehicles appear in list with distinct styling
- User can reactivate a sold vehicle if needed

#### US-08: Delete Vehicle
> **As a** user  
> **I want to** remove a vehicle I no longer want to track  
> **So that** my list stays clean

**Acceptance Criteria:**
- Delete requires confirmation
- Confirmation shows count of reminders that will be deleted
- Soft delete (retained for 90 days, then hard deleted)
- Associated reminders are soft deleted
- User cannot recover after soft delete (no restore in v1)

#### US-09: Add Vehicle Photo
> **As a** user  
> **I want to** add a photo of my vehicle  
> **So that** I can easily identify it in the list

**Acceptance Criteria:**
- User can upload photo from gallery or take new photo
- Photo is cropped/resized to standard dimensions
- Photo appears on vehicle card and detail screen
- Default icon shown if no photo (based on vehicle type)

### 3.2 Edge Case Stories

#### US-10: Placa Already Registered
> **As a** user trying to register a vehicle  
> **When** another user already registered this placa  
> **I want** a clear error message  
> **So that** I understand why registration failed

**Acceptance Criteria:**
- Error message: "Esta placa já está cadastrada por outro usuário."
- Suggest future sharing feature
- Do not reveal who owns the registration (privacy)

#### US-11: Model Not in Catalog
> **As a** user with an uncommon vehicle  
> **I want to** add it even if the model doesn't exist  
> **So that** I can still track my vehicle

**Acceptance Criteria:**
- User can add new brand (marked as unverified)
- User can add new model (marked as unverified)
- System triggers AI to generate maintenance intervals
- User can manually enter intervals if AI fails

#### US-12: AI Generation Fails
> **As a** user adding a new model  
> **When** AI fails to generate maintenance data  
> **I want** to proceed anyway  
> **So that** I'm not blocked from using the app

**Acceptance Criteria:**
- Show friendly error: "Não conseguimos buscar informações automáticas"
- Allow manual entry of maintenance intervals
- Save vehicle without catalog link
- Allow user to add maintenance reminders manually later

---

## 4. Functional Requirements

### 4.1 Vehicle Registration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | System shall validate placa format (ABC1234 or ABC1D23) | Must |
| FR-02 | System shall reject globally duplicate placas | Must |
| FR-03 | System shall require: placa, tipo, estado, marca, modelo, ano | Must |
| FR-04 | System shall support optional: apelido, cor, renavam, km_atual, photo | Must |
| FR-05 | System shall support vehicle types: CARRO, MOTO | Must |
| FR-06 | System shall provide brand selection from database | Must |
| FR-07 | System shall filter models by selected brand | Must |
| FR-08 | System shall allow adding new brands (unverified) | Should |
| FR-09 | System shall allow adding new models (unverified) | Should |

### 4.2 Vehicle Catalog

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-10 | System shall link vehicle to catalog when marca+modelo+ano exists | Must |
| FR-11 | System shall trigger AI generation when catalog entry doesn't exist | Must |
| FR-12 | System shall save AI-generated catalogs for reuse | Must |
| FR-13 | System shall allow user override of catalog maintenance intervals | Must |
| FR-14 | System shall track catalog source (AI, MANUAL, VERIFIED) | Should |

### 4.3 Default Reminders

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-15 | System shall calculate IPVA date from estado + placa final digit | Must |
| FR-16 | System shall calculate Licenciamento date from estado + placa final digit | Must |
| FR-17 | System shall prompt for Seguro vencimento date | Must |
| FR-18 | System shall suggest maintenance reminders from catalog | Should |
| FR-19 | System shall allow user to accept, modify, or skip suggestions | Must |

### 4.4 Vehicle Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-20 | System shall list all user's vehicles sorted by urgency | Must |
| FR-21 | System shall display vehicle status badge (atrasado, vencendo, ok) | Must |
| FR-22 | System shall allow editing all fields except placa | Must |
| FR-23 | System shall recalculate document dates when estado changes | Must |
| FR-24 | System shall support marking vehicle as SOLD | Must |
| FR-25 | System shall soft delete vehicles and associated reminders | Must |
| FR-26 | System shall support vehicle photo upload | Should |
| FR-27 | System shall prompt for km when completing maintenance | Should |

### 4.5 Data Integrity

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-28 | System shall retain soft-deleted data for 90 days | Must |
| FR-29 | System shall hard delete after 90-day retention period | Must |
| FR-30 | System shall cascade soft delete to reminders | Must |
| FR-31 | System shall track deleted_at timestamp | Must |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Vehicle list load time | < 500ms |
| NFR-02 | Vehicle creation response time | < 2s (excluding AI) |
| NFR-03 | AI catalog generation time | < 10s |
| NFR-04 | Photo upload time | < 5s |

### 5.2 Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-05 | Vehicles per user | Unlimited (practical: 100) |
| NFR-06 | Concurrent users | 1,000 (v1 target) |
| NFR-07 | Total vehicles in system | 100,000 (v1 target) |

### 5.3 Security

| ID | Requirement |
|----|-------------|
| NFR-08 | Users can only access their own vehicles |
| NFR-09 | Placa and Renavam are PII, handle per LGPD |
| NFR-10 | Vehicle photos stored securely (S3 with access control) |
| NFR-11 | Soft delete must be irreversible by user |

### 5.4 Availability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-12 | Service uptime | 99.5% |
| NFR-13 | Scheduled maintenance window | Sundays 3-5 AM BRT |

---

## 6. Assumptions & Constraints

### 6.1 Assumptions

1. Users have valid Brazilian vehicle plates
2. Users know their vehicle's marca, modelo, and ano
3. Users have access to camera/gallery for photos
4. AI service (Claude/OpenAI) is available for catalog generation
5. IPVA/Licenciamento rules per state are static (change annually)

### 6.2 Constraints

1. **Budget:** Must use free tiers where possible
2. **Timeline:** MVP in 8 weeks
3. **Platform:** React Native (Expo) for mobile
4. **Backend:** Node.js with PostgreSQL
5. **Storage:** S3-compatible (or similar) for photos
6. **AI Cost:** Minimize AI calls (cache aggressively)

---

## 7. Success Metrics

### 7.1 Launch Metrics (Week 1-4)

| Metric | Target |
|--------|--------|
| Vehicles registered | 500 |
| Users with 1+ vehicle | 400 |
| Avg vehicles per user | 1.3 |
| Registration completion rate | > 80% |

### 7.2 Growth Metrics (Month 2-3)

| Metric | Target |
|--------|--------|
| Users with 2+ vehicles | 30% |
| Catalog coverage (AI-generated) | 200 unique models |
| User-submitted brands/models | < 50 (catalog should cover most) |
| Sold vehicles (indicates lifecycle usage) | > 5% |

### 7.3 Quality Metrics (Ongoing)

| Metric | Target |
|--------|--------|
| AI catalog accuracy (user doesn't override) | > 90% |
| Support tickets about vehicles | < 5/week |
| App crashes in vehicle module | 0 |

---

## 8. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI generates inaccurate data | Medium | Medium | Allow user override, manual review popular models |
| Placa validation rejects valid plates | High | Low | Test with real plates, flexible regex |
| Photo storage costs exceed budget | Low | Medium | Compress images, set size limits |
| Users frustrated by duplicate placa block | Medium | Medium | Clear messaging, promise future sharing |
| IPVA/Licenciamento rules change | Medium | Low | Externalize rules, update annually |

---

## 9. Future Considerations (v2+)

These features are explicitly out of scope for v1 but should influence architectural decisions:

1. **Vehicle Sharing:** Allow family members to access same vehicle
2. **Fleet Management:** Bulk operations for users with many vehicles
3. **OBD Integration:** Automatic km sync via Bluetooth
4. **Plate Lookup API:** Auto-fill vehicle data from placa
5. **Export Data:** PDF/CSV export of vehicle history
6. **Vehicle Transfer:** Transfer vehicle to another user (sale within app)

---

## 10. Appendices

### Appendix A: IPVA Calendar Reference

See [Technical Spec](./07-TECHNICAL-SPEC.md) for state-by-state IPVA vencimento rules.

### Appendix B: Supported Vehicle Types (v1)

| Type | Icon | Portuguese |
|------|------|------------|
| CARRO | 🚗 | Carro |
| MOTO | 🏍️ | Moto |

### Appendix C: Related Documents

- [Business Rules](./02-BUSINESS-RULES.md)
- [ERD](./03-ERD.md)
- [API Specification](./05-API-SPEC.md)
- [User Flows](./06-USER-FLOWS.md)

---

**Next:** [02-BUSINESS-RULES.md](./02-BUSINESS-RULES.md) — Business Rules Document
