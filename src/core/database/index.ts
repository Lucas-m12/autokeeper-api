/**
 * Core database module
 *
 * Provides shared database connection, schemas, and utilities
 *
 * @example
 * import { db, schema } from "@core/database";
 *
 * const profiles = await db.select().from(schema.userProfile);
 */

export { db, pool } from "./connection";
export * as schema from "./schema";
