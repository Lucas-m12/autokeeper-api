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

export const vehicleBrands = pgTable(
  "vehicle_brands",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    name: varchar("name", { length: 100 }).notNull(),
    type: text("type").notNull(),
    logoUrl: varchar("logo_url", { length: 500 }),
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
    uniqueIndex("uq_vehicle_brands_name_type").on(table.name, table.type),
    index("idx_vehicle_brands_type").on(table.type),
    index("idx_vehicle_brands_name").on(table.name),
    index("idx_vehicle_brands_verified").on(table.verified),
  ]
);

export type VehicleBrand = typeof vehicleBrands.$inferSelect;
export type NewVehicleBrand = typeof vehicleBrands.$inferInsert;
