import pino from "pino";
import type { Logger } from "./logger.interface";

/**
 * Pino logger implementation for production
 * Provides structured JSON logging with high performance
 */
export class PinoLogger implements Logger {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }

  info(message: string, ...args: any[]): void {
    if (args.length > 0) {
      this.logger.info({ data: args }, message);
    } else {
      this.logger.info(message);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (args.length > 0) {
      this.logger.warn({ data: args }, message);
    } else {
      this.logger.warn(message);
    }
  }

  error(message: string, ...args: any[]): void {
    if (args.length > 0) {
      this.logger.error({ data: args }, message);
    } else {
      this.logger.error(message);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (args.length > 0) {
      this.logger.debug({ data: args }, message);
    } else {
      this.logger.debug(message);
    }
  }

  raw(message: string, ...args: any[]): void {
    // Extract level from format: [LEVEL] message
    const match = message.match(/^\[(\w+)\]\s*(.*)$/);
    if (!match) {
      // Fallback to info if format doesn't match
      if (args.length > 0) {
        this.logger.info({ data: args }, message);
      } else {
        this.logger.info(message);
      }
      return;
    }

    const level = match[1].toLowerCase();
    const actualMessage = match[2];

    // Route to appropriate logging method based on level
    switch (level) {
      case 'error':
        if (args.length > 0) {
          this.logger.error({ data: args }, actualMessage);
        } else {
          this.logger.error(actualMessage);
        }
        break;
      case 'warn':
        if (args.length > 0) {
          this.logger.warn({ data: args }, actualMessage);
        } else {
          this.logger.warn(actualMessage);
        }
        break;
      case 'debug':
        if (args.length > 0) {
          this.logger.debug({ data: args }, actualMessage);
        } else {
          this.logger.debug(actualMessage);
        }
        break;
      case 'info':
      default:
        if (args.length > 0) {
          this.logger.info({ data: args }, actualMessage);
        } else {
          this.logger.info(actualMessage);
        }
        break;
    }
  }
}
