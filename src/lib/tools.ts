import { tool } from "ai";
import {
  searchFlightsSchema,
  selectFlightSchema,
  bookFlightSchema,
} from "./schemas";
import {
  searchFlightsData,
  getFlightById,
  generateSeatsForFlight,
  createBooking,
} from "@/data/flight";

export const searchFlightsTool = tool({
  description:
    "Mencari jadwal dan harga tiket penrbangan berdasarkan kota asal, kota tujuan, dan batas anggaran harga (opsional).",
  inputSchema: searchFlightsSchema,
  execute: async ({ origin, destination, maxPrice }) => {
    const flights = searchFlightsData({ origin, destination, maxPrice });
    return {
      success: true,
      query: { origin, destination, maxPrice },
      count: flights.length,
      flights,
    };
  },
});

export const selectFlightTool = tool({
  description:
    "Memilih penerbangan tertentu berdasarkan flightId untuk melihat detail penerbangan dan denah kursi yang tersedia.",
  inputSchema: selectFlightSchema,
  execute: async ({ flightId }) => {
    const flight = getFlightById(flightId);
    if (!flight) {
      return {
        success: false,
        error: `Penerbangan dengan ID '${flightId}' tidak ditemukan.`,
      };
    }
    const seats = generateSeatsForFlight(flightId);
    return {
      success: true,
      flight,
      seats,
    };
  },
});

export const bookFlightTool = tool({
  description:
    "Mengonfirmasi reservasi tiket penerbangan dengan ID penerbangan, nomor kursi terpilih, dan nama lengkap penumpang",
  inputSchema: bookFlightSchema,
  execute: async ({ flightId, seatId, passengerName }) => {
    const booking = createBooking({ flightId, seatId, passengerName });
    if (!booking) {
      return {
        success: false,
        error: `Gagal memproses pemesanan untuk penerbangan '${flightId}'.`,
      };
    }
    return {
      success: true,
      booking,
    };
  },
});

export const travelTools = {
  searchFlights: searchFlightsTool,
  selectFlight: selectFlightTool,
  bookFlight: bookFlightTool,
};
