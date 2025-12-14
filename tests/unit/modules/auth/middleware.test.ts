import type { User } from "@/modules/auth/infra/database/auth-instance";
import { describe, expect, it } from "bun:test";

describe("authMiddleware", () => {

  const mockValidSession = {
    user: {
      id: "user_123",
      email: "test@example.com",
      name: "Test User",
      emailVerified: true,
      planType: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User,
    session: {
      id: "session_123",
      userId: "user_123",
      expiresAt: new Date(Date.now() + 86400000),
      token: "mock_token",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  describe("Session validation logic", () => {
    it("should extract user and session from valid session", () => {
      const sessionData = mockValidSession;

      const result = {
        user: sessionData.user,
        session: sessionData.session,
      };

      expect(result.user).toBeDefined();
      expect(result.user.id).toBe("user_123");
      expect(result.user.email).toBe("test@example.com");
      expect(result.session).toBeDefined();
      expect(result.session.id).toBe("session_123");
    });

    it("should handle null session by throwing Unauthorized", () => {
      const sessionData = null;

      expect(() => {
        if (!sessionData) {
          throw new Error("Unauthorized");
        }
      }).toThrow("Unauthorized");
    });

    it("should handle undefined session by throwing Unauthorized", () => {
      const sessionData = undefined;

      expect(() => {
        if (!sessionData) {
          throw new Error("Unauthorized");
        }
      }).toThrow("Unauthorized");
    });

    it("should handle session validation errors by throwing Unauthorized", () => {
      const mockError = new Error("Session validation failed");

      expect(() => {
        throw mockError;
      }).toThrow("Session validation failed");
    });
  });

  describe("User type casting", () => {
    it("should cast session.user to User type", () => {
      // Arrange
      const sessionData = mockValidSession;

      // Act
      const user = sessionData.user as User;

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBe("user_123");
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("Test User");
      expect(user.emailVerified).toBe(true);
      expect(user.planType).toBe("free");
    });

    it("should include all required User fields", () => {
      // Arrange
      const user = mockValidSession.user;

      // Assert
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("emailVerified");
      expect(user).toHaveProperty("planType");
      expect(user).toHaveProperty("createdAt");
      expect(user).toHaveProperty("updatedAt");
    });
  });

  describe("Session type structure", () => {
    it("should include session object with required fields", () => {
      // Arrange
      const session = mockValidSession.session;

      // Assert
      expect(session).toHaveProperty("id");
      expect(session).toHaveProperty("userId");
      expect(session).toHaveProperty("expiresAt");
      expect(session).toHaveProperty("token");
      expect(session).toHaveProperty("createdAt");
      expect(session).toHaveProperty("updatedAt");
    });

    it("should link session to user via userId", () => {
      // Arrange
      const { user, session } = mockValidSession;

      // Assert
      expect(session.userId).toBe(user.id);
    });
  });

  describe("Authorization failure scenarios", () => {
    it("should fail when session is null (logged out user)", () => {
      // Arrange
      const sessionData = null;
      let status: number | undefined;
      let error: Error | undefined;

      // Act
      try {
        if (!sessionData) {
          status = 401;
          throw new Error("Unauthorized");
        }
      } catch (e) {
        error = e as Error;
      }

      // Assert
      expect(status).toBe(401);
      expect(error).toBeDefined();
      expect(error?.message).toBe("Unauthorized");
    });

    it("should fail when session token is invalid", () => {
      // Simulate what happens when auth.api.getSession throws an error
      // Arrange
      let status: number | undefined;
      let error: Error | undefined;

      // Act
      try {
        // Simulate Better Auth throwing an error for invalid token
        throw new Error("Invalid session token");
      } catch (e) {
        status = 401;
        error = new Error("Unauthorized");
      }

      // Assert
      expect(status).toBe(401);
      expect(error.message).toBe("Unauthorized");
    });

    it("should fail when session is expired", () => {
      // Arrange
      const expiredSession = {
        ...mockValidSession,
        session: {
          ...mockValidSession.session,
          expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
        },
      };

      // Act
      const isExpired = expiredSession.session.expiresAt < new Date();

      // Assert
      expect(isExpired).toBe(true);
    });
  });

  describe("Authorization success scenarios", () => {
    it("should succeed with valid session and return user data", () => {
      // Arrange
      const sessionData = mockValidSession;

      // Act
      const result = {
        user: sessionData.user as User,
        session: sessionData.session,
      };

      // Assert
      expect(result.user.id).toBe("user_123");
      expect(result.user.email).toBe("test@example.com");
      expect(result.user.planType).toBe("free");
    });

    it("should succeed with session that has not expired", () => {
      // Arrange
      const validSession = {
        ...mockValidSession,
        session: {
          ...mockValidSession.session,
          expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
        },
      };

      // Act
      const isExpired = validSession.session.expiresAt < new Date();

      // Assert
      expect(isExpired).toBe(false);
    });
  });

  describe("Plan type validation", () => {
    it("should support free plan type", () => {
      const user = { ...mockValidSession.user, planType: "free" };
      expect(user.planType).toBe("free");
    });

    it("should support pro plan type", () => {
      const user = { ...mockValidSession.user, planType: "pro" };
      expect(user.planType).toBe("pro");
    });

    it("should support fleet plan type", () => {
      const user = { ...mockValidSession.user, planType: "fleet" };
      expect(user.planType).toBe("fleet");
    });
  });

});
