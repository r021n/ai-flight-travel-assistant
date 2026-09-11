import { describe, it, expect } from "vitest";
import {
  searchFlightsSchema,
  selectFlightSchema,
  bookFlightSchema,
} from "../schemas";

describe("Phase 2 - Zod Schemas Validation", () => {
  describe("searchFlightsSchema", () => {
    it("harus memvalidasi input pencarian penerbangan yang valid", () => {
      const input = {
        origin: "Jakarta",
        destination: "Bali",
        maxPrice: 1500000,
      };
      const result = searchFlightsSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.origin).toBe("Jakarta");
        expect(result.data.destination).toBe("Bali");
        expect(result.data.maxPrice).toBe(1500000);
      }
    });

    it("harus berhasil memvalidasi tanpa maxPrice (opsional)", () => {
      const input = {
        origin: "Surabaya",
        destination: "Bali",
      };
      const result = searchFlightsSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.maxPrice).toBeUndefined();
      }
    });

    it("harus gagal jika origin kurang dari 2 karakter", () => {
      const input = {
        origin: "J",
        destination: "Bali",
      };
      const result = searchFlightsSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("harus gagal jika maxPrice berniali negatif atau 0", () => {
      const input = {
        origin: "Jakarta",
        destination: "Bali",
        maxPrice: -50000,
      };
      const result = searchFlightsSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("selectFlightSchema", () => {
    it("harus memvalidasi flightId yang valid", () => {
      const input = { flightId: "GA-401" };
      const result = selectFlightSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.flightId).toBe("GA-401");
      }
    });

    it("harus gagal jika flightId kosong", () => {
      const input = { flightId: "" };
      const result = selectFlightSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});
