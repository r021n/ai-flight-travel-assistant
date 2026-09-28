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
import {
  DEFAULT_LOCALE,
  getDictionary,
  isLocale,
  type Dictionary,
  type Locale,
} from "@/i18n/dictionaries";

function buildSearchFlightsTool(t: Dictionary) {
  return tool({
    description: t.tools.searchFlightsDesc,
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
}

function buildSelectFlightTool(t: Dictionary) {
  return tool({
    description: t.tools.selectFlightDesc,
    inputSchema: selectFlightSchema,
    execute: async ({ flightId }) => {
      const flight = getFlightById(flightId);
      if (!flightId) {
        return {
          success: false,
          error: t.tools.flightNotFound(flightId),
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
}

function buildBookFlightTool(t: Dictionary) {
  return tool({
    description: t.tools.bookFlightDesc,
    inputSchema: bookFlightSchema,
    execute: async ({ flightId, seatId, passengerName }) => {
      const booking = createBooking({ flightId, seatId, passengerName });
      if (!booking) {
        return {
          success: false,
          error: t.tools.bookingFailed(flightId),
        };
      }

      return {
        success: true,
        booking,
      };
    },
  });
}

export function createTravelTools(locale: Locale = DEFAULT_LOCALE) {
  const t = getDictionary(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return {
    searchFlights: buildSearchFlightsTool(t),
    selectFlight: buildSelectFlightTool(t),
    bookFlight: buildBookFlightTool(t),
  };
}

const defaultDict = getDictionary(DEFAULT_LOCALE);

export const searchFlightsTool = buildSelectFlightTool(defaultDict);
export const selectFlightTool = buildSelectFlightTool(defaultDict);
export const bookFlightTool = buildBookFlightTool(defaultDict);

export const travelTools = createTravelTools(DEFAULT_LOCALE);
