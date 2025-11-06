/**
 * Logger interface for application-wide logging
 */
export interface Logger {
  /**
   * Log informational messages
   */
  info(message: string, ...args: any[]): void;

  /**
   * Log warning messages
   */
  warn(message: string, ...args: any[]): void;

  /**
   * Log error messages
   */
  error(message: string, ...args: any[]): void;

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, ...args: any[]): void;

  /**
   * Log raw pre-formatted messages
   * @param message Pre-formatted message string (e.g., `[${level}] ${message}`)
   * @param args Additional arguments to include
   */
  raw(message: string, ...args: any[]): void;
}
