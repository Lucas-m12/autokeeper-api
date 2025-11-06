import { createLoggerFromEnv } from "./logger-config";

/**
 * Logger singleton instance
 * Configured based on NODE_ENV environment variable
 * - Development: ConsoleLogger (formatted console output)
 * - Production: PinoLogger (structured JSON logging)
 */
export const logger = createLoggerFromEnv();

/**
 * Re-export types and interfaces for external use
 */
export type { Logger } from "./logger.interface";
export type { LoggerType, LoggerConfig } from "./logger-config";
export { createLogger, createLoggerFromEnv } from "./logger-config";
