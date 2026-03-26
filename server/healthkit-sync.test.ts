import { describe, it, expect } from "vitest";
import { validateHealthKitData, detectAnomalies } from "./healthkit-sync";

describe("HealthKit Data Sync", () => {
  describe("validateHealthKitData", () => {
    it("should validate correct health data", () => {
      const data = {
        userId: 1,
        date: "2026-03-15",
        steps: 10000,
        sleepHours: 7,
        energyBurned: 500,
      };

      const result = validateHealthKitData(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject negative values", () => {
      const data = {
        userId: 1,
        date: "2026-03-15",
        steps: -100,
        sleepHours: 7,
      };

      const result = validateHealthKitData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid date format", () => {
      const data = {
        userId: 1,
        date: "invalid-date",
        steps: 10000,
      };

      const result = validateHealthKitData(data);
      expect(result.valid).toBe(false);
    });

    it("should reject excessive heart rate", () => {
      const data = {
        userId: 1,
        date: "2026-03-15",
        maxHeartRate: 300,
      };

      const result = validateHealthKitData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.toLowerCase().includes("heart"))).toBe(true);
    });
  });

  describe("detectAnomalies", () => {
    it("should detect high heart rate", () => {
      const data = {
        userId: 1,
        date: "2026-03-15",
        maxHeartRate: 185,
      };

      const anomalies = detectAnomalies(data);
      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies.some(a => a.toLowerCase().includes("heart"))).toBe(true);
    });

    it("should detect unusual sleep patterns", () => {
      const data = {
        userId: 1,
        date: "2026-03-15",
        sleepHours: 11,
      };

      const anomalies = detectAnomalies(data);
      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies.some(a => a.toLowerCase().includes("sleep"))).toBe(true);
    });

    it("should not report anomalies for normal data", () => {
      const data = {
        userId: 1,
        date: "2026-03-15",
        steps: 10000,
        sleepHours: 7,
        energyBurned: 500,
        maxHeartRate: 120,
      };

      const anomalies = detectAnomalies(data);
      expect(anomalies).toHaveLength(0);
    });

    it("should detect critically low sleep", () => {
      const data = {
        userId: 1,
        date: "2026-03-15",
        sleepHours: 3,
      };

      const anomalies = detectAnomalies(data);
      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies.some(a => a.toLowerCase().includes("critically"))).toBe(true);
    });

    it("should detect unusually high step count", () => {
      const data = {
        userId: 1,
        date: "2026-03-15",
        steps: 60000,
      };

      const anomalies = detectAnomalies(data);
      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies.some(a => a.toLowerCase().includes("step"))).toBe(true);
    });
  });
});
