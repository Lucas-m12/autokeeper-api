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
import { vehicleCatalogs } from "./vehicle-catalogs";

export const maintenanceTemplates = pgTable(
  "maintenance_templates",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    catalogId: uuid("catalog_id")
      .notNull()
      .references(() => vehicleCatalogs.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    customTypeName: varchar("custom_type_name", { length: 100 }),
    intervalKm: integer("interval_km"),
    intervalMonths: integer("interval_months"),
    description: varchar("description", { length: 200 }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("uq_maintenance_templates_catalog_type").on(
      table.catalogId,
      table.type,
      table.customTypeName
    ),
    index("idx_maintenance_templates_catalog_id").on(table.catalogId),
    index("idx_maintenance_templates_type").on(table.type),
  ]
);

export type MaintenanceTemplate = typeof maintenanceTemplates.$inferSelect;
export type NewMaintenanceTemplate = typeof maintenanceTemplates.$inferInsert;
