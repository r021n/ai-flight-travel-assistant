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
