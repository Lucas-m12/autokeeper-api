-- =============================================
-- VEHICLE MODULE - CUSTOM CONSTRAINTS
-- =============================================
-- Run this AFTER drizzle-kit generates the base migration.
-- These constraints are not natively supported by Drizzle ORM.
--
-- Usage:
-- 1. Run: bunx drizzle-kit generate
-- 2. Run: bunx drizzle-kit migrate
-- 3. Run this file manually: psql -d autokeeper -f migrations/custom/vehicle-constraints.sql
--
-- Or append this content to the generated migration file before running migrate.
-- =============================================

-- =============================================
-- 1. PARTIAL UNIQUE INDEX FOR LICENSE_PLATE
-- =============================================
-- Only ACTIVE vehicles have unique license_plate constraint
-- This allows SOLD/DELETED vehicles to release the plate

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_vehicles_license_plate_active
ON user_vehicles (license_plate)
WHERE status = 'ACTIVE';

-- =============================================
-- 2. USER_VEHICLES CHECK CONSTRAINTS
-- =============================================

ALTER TABLE user_vehicles
  ADD CONSTRAINT chk_user_vehicles_license_plate
    CHECK (license_plate ~ '^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$');

ALTER TABLE user_vehicles
  ADD CONSTRAINT chk_user_vehicles_year
    CHECK (year >= 1950 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);

ALTER TABLE user_vehicles
  ADD CONSTRAINT chk_user_vehicles_current_km
    CHECK (current_km IS NULL OR (current_km >= 0 AND current_km <= 9999999));

ALTER TABLE user_vehicles
  ADD CONSTRAINT chk_user_vehicles_renavam
    CHECK (renavam IS NULL OR renavam ~ '^[0-9]{9,11}$');

-- =============================================
-- 3. VEHICLE_CATALOGS CHECK CONSTRAINTS
-- =============================================

ALTER TABLE vehicle_catalogs
  ADD CONSTRAINT chk_vehicle_catalogs_year
    CHECK (year >= 1950 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);

-- =============================================
-- 4. MAINTENANCE_TEMPLATES CHECK CONSTRAINTS
-- =============================================

ALTER TABLE maintenance_templates
  ADD CONSTRAINT chk_maintenance_templates_interval
    CHECK (interval_km IS NOT NULL OR interval_months IS NOT NULL);

ALTER TABLE maintenance_templates
  ADD CONSTRAINT chk_maintenance_templates_interval_km
    CHECK (interval_km IS NULL OR interval_km > 0);

ALTER TABLE maintenance_templates
  ADD CONSTRAINT chk_maintenance_templates_interval_months
    CHECK (interval_months IS NULL OR (interval_months > 0 AND interval_months <= 120));

ALTER TABLE maintenance_templates
  ADD CONSTRAINT chk_maintenance_templates_custom
    CHECK (
      (type = 'CUSTOM' AND custom_type_name IS NOT NULL) OR
      (type != 'CUSTOM' AND custom_type_name IS NULL)
    );

-- =============================================
-- 5. USER_MAINTENANCE_OVERRIDES CHECK CONSTRAINTS
-- =============================================

ALTER TABLE user_maintenance_overrides
  ADD CONSTRAINT chk_user_maintenance_overrides_interval
    CHECK (custom_interval_km IS NOT NULL OR custom_interval_months IS NOT NULL);

ALTER TABLE user_maintenance_overrides
  ADD CONSTRAINT chk_user_maintenance_overrides_km
    CHECK (custom_interval_km IS NULL OR custom_interval_km > 0);

ALTER TABLE user_maintenance_overrides
  ADD CONSTRAINT chk_user_maintenance_overrides_months
    CHECK (custom_interval_months IS NULL OR (custom_interval_months > 0 AND custom_interval_months <= 120));

-- =============================================
-- 6. MAINTENANCE_HISTORY CHECK CONSTRAINTS
-- =============================================

ALTER TABLE maintenance_history
  ADD CONSTRAINT chk_maintenance_history_completed
    CHECK (completed_at <= CURRENT_DATE);

ALTER TABLE maintenance_history
  ADD CONSTRAINT chk_maintenance_history_km
    CHECK (km_at_completion IS NULL OR (km_at_completion >= 0 AND km_at_completion <= 9999999));

ALTER TABLE maintenance_history
  ADD CONSTRAINT chk_maintenance_history_cost
    CHECK (cost IS NULL OR cost >= 0);

-- =============================================
-- END OF CUSTOM CONSTRAINTS
-- =============================================
