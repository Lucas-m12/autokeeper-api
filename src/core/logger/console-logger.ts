import type { Logger } from "./logger.interface";

/**
 * Console logger implementation for development
 * Outputs colored logs to the console
 */
export class ConsoleLogger implements Logger {
  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const argsStr = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] ${level}: ${message}${argsStr}`;
  }

  info(message: string, ...args: any[]): void {
    console.log(this.formatMessage('INFO', message, ...args));
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('WARN', message, ...args));
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('ERROR', message, ...args));
  }

  debug(message: string, ...args: any[]): void {
    console.debug(this.formatMessage('DEBUG', message, ...args));
  }

  raw(message: string, ...args: any[]): void {
    // Extract level from format: [LEVEL] message
    const match = message.match(/^\[(\w+)\]\s*(.*)$/);
    if (!match) {
      // Fallback to info if format doesn't match
      const argsStr = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
      console.log(`${message}${argsStr}`);
      return;
    }

    const level = match[1].toLowerCase();
    const actualMessage = match[2];

    // Route to appropriate logging method based on level
    switch (level) {
      case 'error':
        console.error(this.formatMessage('ERROR', actualMessage, ...args));
        break;
      case 'warn':
        console.warn(this.formatMessage('WARN', actualMessage, ...args));
        break;
      case 'debug':
        console.debug(this.formatMessage('DEBUG', actualMessage, ...args));
        break;
      case 'info':
      default:
        console.log(this.formatMessage('INFO', actualMessage, ...args));
        break;
    }
  }
}
