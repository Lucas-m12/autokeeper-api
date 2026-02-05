import { uuidv7 } from "uuidv7";
import { sql } from "drizzle-orm";
import {
  date,
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userVehicles } from "./user-vehicles";
import { reminders } from "./reminders";

export const maintenanceHistory = pgTable(
  "maintenance_history",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    userVehicleId: uuid("user_vehicle_id")
      .notNull()
      .references(() => userVehicles.id, { onDelete: "cascade" }),
    reminderId: uuid("reminder_id").references(() => reminders.id, {
      onDelete: "set null",
    }),
    maintenanceType: text("maintenance_type").notNull(),
    customTypeName: varchar("custom_type_name", { length: 100 }),
    completedAt: date("completed_at", { mode: "date" }).notNull(),
    kmAtCompletion: integer("km_at_completion"),
    cost: decimal("cost", { precision: 10, scale: 2 }),
    notes: text("notes"),
    serviceProvider: varchar("service_provider", { length: 200 }),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("idx_maintenance_history_vehicle").on(table.userVehicleId),
    index("idx_maintenance_history_completed").on(table.completedAt),
    index("idx_maintenance_history_type").on(table.maintenanceType),
    index("idx_maintenance_history_reminder")
      .on(table.reminderId)
      .where(sql`${table.reminderId} IS NOT NULL`),
  ]
);

export type MaintenanceHistory = typeof maintenanceHistory.$inferSelect;
export type NewMaintenanceHistory = typeof maintenanceHistory.$inferInsert;
