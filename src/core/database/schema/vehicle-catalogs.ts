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
import { users } from "./users";
import { vehicleModels } from "./vehicle-models";

export const vehicleCatalogs = pgTable(
  "vehicle_catalogs",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    modelId: uuid("model_id")
      .notNull()
      .references(() => vehicleModels.id, { onDelete: "restrict" }),
    year: integer("year").notNull(),
    version: varchar("version", { length: 100 }),
    engine: varchar("engine", { length: 50 }),
    fuel: text("fuel"),
    transmission: text("transmission"),
    source: text("source").notNull().default("MANUAL"),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("uq_vehicle_catalogs_model_year_version").on(
      table.modelId,
      table.year,
      table.version
    ),
    index("idx_vehicle_catalogs_model_id").on(table.modelId),
    index("idx_vehicle_catalogs_year").on(table.year),
    index("idx_vehicle_catalogs_model_year").on(table.modelId, table.year),
  ]
);

export type VehicleCatalog = typeof vehicleCatalogs.$inferSelect;
export type NewVehicleCatalog = typeof vehicleCatalogs.$inferInsert;
