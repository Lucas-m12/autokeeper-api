import { uuidv7 } from "uuidv7";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { vehicleCatalogs } from "./vehicle-catalogs";

export const userVehicles = pgTable(
  "user_vehicles",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    catalogId: uuid("catalog_id").references(() => vehicleCatalogs.id, {
      onDelete: "set null",
    }),
    licensePlate: varchar("license_plate", { length: 7 }).notNull(),
    type: text("type").notNull(),
    status: text("status").notNull().default("ACTIVE"),
    state: text("state").notNull(),
    nickname: varchar("nickname", { length: 50 }),
    color: varchar("color", { length: 30 }),
    renavam: varchar("renavam", { length: 11 }),
    year: integer("year").notNull(),
    currentKm: integer("current_km"),
    photoUrl: varchar("photo_url", { length: 500 }),
    soldAt: timestamp("sold_at", { mode: "date", withTimezone: true }),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  (table) => [
    index("idx_user_vehicles_user_id").on(table.userId),
    index("idx_user_vehicles_status").on(table.status),
    index("idx_user_vehicles_license_plate").on(table.licensePlate),
    index("idx_user_vehicles_deleted_at")
      .on(table.deletedAt)
      .where(sql`${table.deletedAt} IS NOT NULL`),
    index("idx_user_vehicles_user_active")
      .on(table.userId)
      .where(sql`${table.deletedAt} IS NULL AND ${table.status} = 'ACTIVE'`),
  ]
);

export type UserVehicle = typeof userVehicles.$inferSelect;
export type NewUserVehicle = typeof userVehicles.$inferInsert;
