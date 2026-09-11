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

    it("harus mengembalikan semua opsi penerbangan jika maxPrice tidak diberikan", async () => {
      if (!searchFlightsTool.execute) {
        throw new Error("searchFlightTool.execute tidak terdefinisi");
      }

      const result = (await searchFlightsTool.execute(
        {
          origin: "Jakarta",
          destination: "Bali",
        },
        defaultToolsOptions,
      )) as { success: boolean; flights: Flight[] };

      expect(result.success).toBe(true);
      expect(result.flights.length).toBeGreaterThanOrEqual(4);
    });

    it("harus mengembalikan array kosong dengan success=true jika rute tidak ditemukan", async () => {
      if (!searchFlightsTool.execute) {
        throw new Error("searchFlightsTool.execute tidak terdefinisi");
      }

      const result = (await searchFlightsTool.execute(
        {
          origin: "Medan",
          destination: "Papua",
        },
        defaultToolsOptions,
      )) as { success: boolean; flights: Flight[] };

      expect(result.success).toBe(true);
      expect(result.flights.length).toBe(0);
    });
  });

  describe("selectFlightTool", () => {
    it("harus mengembalikan detail flight dan daftar kursi saat flightId valid", async () => {
      if (!selectFlightTool.execute) {
        throw new Error("selectFlightTool.execute tidak terlalu terdefinisi");
      }

      const result = (await selectFlightTool.execute(
        {
          flightId: "GA-401",
        },
        defaultToolsOptions,
      )) as { success: boolean; flight: Flight; seats: unknown[] };

      expect(result.success).toBe(true);
      expect(result.flight.id).toBe("GA-401");
      expect(result.flight.airline).toBe("Garuda Indonesia");
      expect(result.seats.length).toBeGreaterThan(0);
      expect(result.seats[0]).toHaveProperty("id");
      expect(result.seats[0]).toHaveProperty("available");
      expect(result.seats[0]).toHaveProperty("type");
    });

    it("harus mengembalikan error jika flightId tidak terdaftar", async () => {
      if (!selectFlightTool.execute) {
        throw new Error("selectFlightTool.execute tidak terdefinisi");
      }

      const result = (await selectFlightTool.execute(
        {
          flightId: "INVALID-999",
        },
        defaultToolsOptions,
      )) as { success: boolean; error: string };

      expect(result.success).toBe(false);
      expect(result.error).toContain("tidak ditemukan");
    });
  });

  describe("bookFlightTool", () => {
    it("harus berhasil memuat tiket booking receipt saat parameter valid", async () => {
      if (!bookFlightTool.execute) {
        throw new Error("bookFlightTool.execute tidak terdefinisi");
      }

      const result = (await bookFlightTool.execute(
        {
          flightId: "GA-401",
          seatId: "12A",
          passengerName: "Budi Pratama",
        },
        defaultToolsOptions,
      )) as {
        success: boolean;
        booking: {
          bookingId: string;
          flight: Flight;
          seat: { id: string };
          passangerName: string;
          totalPrice: number;
          status: string;
        };
      };

      expect(result.success).toBe(true);
      expect(result.booking.flight.id).toBe("GA-401");
      expect(result.booking.seat.id).toBe("12A");
      expect(result.booking.passangerName).toBe("Budi Pratama");
      expect(result.booking.status).toBe("SUCCESS");
      expect(result.booking.bookingId).toBeDefined();
      expect(result.booking.totalPrice).toBe(result.booking.flight.price);
    });

    it("harus mengembalikan error jika flightId tidak valid saat pemesanan", async () => {
      if (!bookFlightTool.execute) {
        throw new Error("bookFlightTool.execute tidak terdefinisi");
      }

      const result = bookFlightTool.execute(
        {
          flightId: "UNKNOWN-FLIGHT",
          seatId: "12A",
          passengerName: "Budi Pratama",
        },
        defaultToolsOptions,
      ) as { success: boolean; error: string };

      expect(result.success).toBe(false);
    });
  });
});
