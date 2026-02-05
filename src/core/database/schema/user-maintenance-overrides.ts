import { uuidv7 } from "uuidv7";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userVehicles } from "./user-vehicles";

export const userMaintenanceOverrides = pgTable(
  "user_maintenance_overrides",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    userVehicleId: uuid("user_vehicle_id")
      .notNull()
      .references(() => userVehicles.id, { onDelete: "cascade" }),
    maintenanceType: text("maintenance_type").notNull(),
    customTypeName: varchar("custom_type_name", { length: 100 }),
    customIntervalKm: integer("custom_interval_km"),
    customIntervalMonths: integer("custom_interval_months"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("uq_user_maintenance_overrides").on(
      table.userVehicleId,
      table.maintenanceType,
      table.customTypeName
    ),
    index("idx_user_maintenance_overrides_vehicle").on(table.userVehicleId),
  ]
);

export type UserMaintenanceOverride =
  typeof userMaintenanceOverrides.$inferSelect;
export type NewUserMaintenanceOverride =
  typeof userMaintenanceOverrides.$inferInsert;
