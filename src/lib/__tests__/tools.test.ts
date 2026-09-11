import { describe, it, expect } from "vitest";
import { searchFlightsTool, selectFlightTool, bookFlightTool } from "../tools";
import type { Flight } from "@/types/flight";

const defaultToolsOptions = {
  messages: [],
  toolCallId: "test-tool-call-id",
  context: {},
};

describe("Phase 2 - AI Tools Execution", () => {
  describe("searchFlightsTool", () => {
    it("harus mencari penerbangan Jakarta ke Bali dengan filter budget di bawah 1.5 juta", async () => {
      if (!searchFlightsTool.execute) {
        throw new Error("searchFlightsTool.execute tidak terdefinisi");
      }

      const result = (await searchFlightsTool.execute(
        {
          origin: "Jakarta",
          destination: "bali",
          maxPrice: 1500000,
        },
        defaultToolsOptions,
      )) as { success: boolean; flights: Flight[] };

      expect(result.success).toBe(true);
      expect(result.flights.length).toBeGreaterThan(0);
      result.flights.forEach((flight: Flight) => {
        expect(flight.price).toBeLessThanOrEqual(1500000);
        expect(flight.origin.toLowerCase()).toContain("jakarta");
        expect(flight.destination.toLowerCase()).toContain("bali");
      });
    });
  });
});
