import { z } from "zod";

export const searchFlightsSchema = z.object({
  origin: z
    .string()
    .min(2, "Kota asal minimal 2 karakter")
    .describe(
      "Kota atau kode bandara keberangkatan, contoh: Jakarta, Bali, Surabaya, CGK, DPS",
    ),
  destination: z
    .string()
    .min(2, "Kota tujuan minimal 2 karakter")
    .describe(
      "Kota atau kode bandara tujuan, contoh: Bali, Jakarta, Surabaya, DPS, CGK",
    ),
  maxPrice: z
    .number()
    .positive("Batas harga harus angka positif")
    .optional()
    .describe("Batas harga maksimal tiket dalam Rupiah (IDR), contoh: 1500000"),
});

export const selectFlightSchema = z.object({
  flightId: z
    .string()
    .min(1, "Flight ID tidak boleh kosong")
    .describe(
      "Nomor penerbangan atau ID penerbangan yang dipilih, contoh: GA-401, QG-680, ID-6512",
    ),
});

export const bookFlightSchema = z.object({
  flightId: z
    .string()
    .min(1, "Flight ID tidak boleh kosong")
    .describe("ID penerbangan yang dipesan, contoh: GA-401"),
  seatId: z
    .string()
    .min(2, "Nomor kursi tidak valid")
    .describe("Nomor kursi yang dipilih penumpang, contoh: 1A, 12B, 5C"),
  passengerName: z
    .string()
    .min(2, "Nama penumpang minimal 2 karakter")
    .describe("Nama lengkap penumpan yang akan bepergian"),
});

export type SearchFlightsInput = z.infer<typeof searchFlightsSchema>;
export type SelectFlightInput = z.infer<typeof selectFlightSchema>;
export type BookFlightInput = z.infer<typeof bookFlightSchema>;
