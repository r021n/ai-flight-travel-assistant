import { describe, it, expect } from "vitest";
import { processBookingAction } from "./actions";

describe("Phase 3 - Server Actions (processBookingAction)", () => {
  it("harus berhasil memproses reservasi dengan data valid", async () => {
    const result = await processBookingAction({
      flightId: "GA-401",
      seatId: "12A",
      passengerName: "Budi Santoso",
      paymentMethod: "QRIS",
    });

    expect(result.success).toBe(true);
    expect(result.booking).toBeDefined();
    expect(result.booking?.flight.flightNumber).toBe("GA-401");
    expect(result.booking?.seat.id).toBe("12A");
    expect(result.booking?.passengerName).toBe("Budi Santoso");
    expect(result.booking?.status).toBe("SUCCESS");
    expect(result.booking?.paymentMethod).toBe("QRIS");
  });

  it("harus mengembalikan error jika flightId tidak valid atau tidak ditemukan", async () => {
    const result = await processBookingAction({
      flightId: "INVALID-999",
      seatId: "1A",
      passengerName: "Budi Santoso",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("tidak ditemukan");
  });

  it("harus mengembalikan error jika parameter wajib tidak diisi", async () => {
    const result = await processBookingAction({
      flightId: "",
      seatId: "12A",
      passengerName: "Budi Santoso",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Data reservasi tidak lengkap");
  });
});
