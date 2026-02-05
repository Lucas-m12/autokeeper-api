import { uuidv7 } from "uuidv7";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const reminders = pgTable("reminders", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Reminder = typeof reminders.$inferSelect;
export type NewReminder = typeof reminders.$inferInsert;
