import { describe, expect, it } from "bun:test";
import {
  isValidPlanType
} from "../../../../src/core/constants/plan-types";

describe("plan-types", () => {

  describe("isValidPlanType", () => {
    it("should return true for 'free'", () => {
      // Act
      const result = isValidPlanType("free");

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for 'pro'", () => {
      // Act
      const result = isValidPlanType("pro");

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for 'fleet'", () => {
      // Act
      const result = isValidPlanType("fleet");

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for invalid plan type 'premium'", () => {
      const result = isValidPlanType("premium");
      expect(result).toBe(false);
    });

    it("should return false for empty string", () => {
      const result = isValidPlanType("");
      expect(result).toBe(false);
    });

    it("should be case-sensitive (reject 'FREE')", () => {
      const result = isValidPlanType("FREE");
      expect(result).toBe(false);
    });

    it("should return false for whitespace string", () => {
      const result = isValidPlanType("   ");
      expect(result).toBe(false);
    });
  });

});
