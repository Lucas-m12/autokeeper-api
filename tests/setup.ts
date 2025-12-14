process.env.NODE_ENV = "test";

export function mockEnv(overrides: Record<string, string> = {}): void {
  const defaults = {
    NODE_ENV: "test",
    APP_PORT: "3000",
    DATABASE_URL: "postgres://test:test@localhost:5432/autokeeper_test",
    LOG_LEVEL: "silent",
    RESEND_API_KEY: "test-key",
  };

  Object.entries({ ...defaults, ...overrides }).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

export function resetEnv(): void {
  mockEnv();
}

export function clearEnv(): void {
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("APP_") || key === "DATABASE_URL" || key === "LOG_LEVEL" || key === "RESEND_API_KEY") {
      delete process.env[key];
    }
  });
}

mockEnv();
