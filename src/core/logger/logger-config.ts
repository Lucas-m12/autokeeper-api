import type { Logger } from "./logger.interface";
import { ConsoleLogger } from "./console-logger";
import { PinoLogger } from "./pino-logger";

export type LoggerType = "console" | "pino";

export interface LoggerConfig {
  type: LoggerType;
}

/**
 * Creates a logger instance based on the provided configuration
 *
 * @param config - Logger configuration options
 * @returns Logger instance
 */
export function createLogger(config: LoggerConfig): Logger {
  const { type } = config;

  switch (type) {
    case "console":
      return new ConsoleLogger();

    case "pino":
      return new PinoLogger();

    default:
      throw new Error(`Invalid logger type: ${type}. Must be 'console' or 'pino'`);
  }
}

/**
 * Creates a logger from environment variables
 * Uses ConsoleLogger in development, PinoLogger in production
 *
 * Environment variables:
 * - NODE_ENV: 'development' | 'production' | 'test'
 * - LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error' (only for pino)
 *
 * @returns Logger instance
 */
export function createLoggerFromEnv(): Logger {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const type: LoggerType = nodeEnv === 'production' ? 'pino' : 'console';

  return createLogger({ type });
}
