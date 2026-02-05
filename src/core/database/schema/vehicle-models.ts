import { uuidv7 } from "uuidv7";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { vehicleBrands } from "./vehicle-brands";

export const vehicleModels = pgTable(
  "vehicle_models",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => vehicleBrands.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 100 }).notNull(),
    type: text("type").notNull(),
    verified: boolean("verified").notNull().default(false),
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
    uniqueIndex("uq_vehicle_models_brand_name").on(table.brandId, table.name),
    index("idx_vehicle_models_brand_id").on(table.brandId),
    index("idx_vehicle_models_name").on(table.name),
    index("idx_vehicle_models_type").on(table.type),
  ]
);

export type VehicleModel = typeof vehicleModels.$inferSelect;
export type NewVehicleModel = typeof vehicleModels.$inferInsert;
