import type { Flight, Seat, BookingReceipt } from "@/types/flight";

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: "GA-401",
    airline: "Garuda Indonesia",
    flightNumber: "GA-401",
    origin: "Jakarta (CGK)",
    destination: "Bali (DPS)",
    departureTime: "08:00",
    arrivalTime: "10:50",
    price: 1450000,
    duration: "1j 50m",
    class: "economy",
  },
  {
    id: "GA-405",
    airline: "Garuda Indonesia",
    flightNumber: "GA-405",
    origin: "Jakarta (CGK)",
    destination: "Bali (DPS)",
    departureTime: "14:00",
    arrivalTime: "16:50",
    price: 2850000,
    duration: "1j 50m",
    class: "business",
  },
  {
    id: "QG-680",
    airline: "Citilink",
    flightNumber: "QG-680",
    origin: "Jakarta (CGK)",
    destination: "Bali (DPS)",
    departureTime: "06:30",
    arrivalTime: "09:20",
    price: 1150000,
    duration: "1j 50m",
    class: "economy",
  },
  {
    id: "ID-6512",
    airline: "Batik Air",
    flightNumber: "ID-6512",
    origin: "Jakarta (CGK)",
    destination: "Bali (DPS)",
    departureTime: "10:15",
    arrivalTime: "13:05",
    price: 1300000,
    duration: "1j 50m",
    class: "economy",
  },
  {
    id: "QZ-751",
    airline: "AirAsia",
    flightNumber: "QZ-751",
    origin: "Jakarta (CGK)",
    destination: "Bali (DPS)",
    departureTime: "17:00",
    arrivalTime: "19:50",
    price: 980000,
    duration: "1j 50m",
    class: "economy",
  },
  {
    id: "GA-310",
    airline: "Garuda Indonesia",
    flightNumber: "GA-310",
    origin: "Jakarta (CGK)",
    destination: "Surabaya (SUB)",
    departureTime: "07:00",
    arrivalTime: "08:30",
    price: 1200000,
    duration: "1j 30m",
    class: "economy",
  },
  {
    id: "ID-6570",
    airline: "Batik Air",
    flightNumber: "ID-6570",
    origin: "Surabaya (SUB)",
    destination: "Bali (DPS)",
    departureTime: "11:00",
    arrivalTime: "12:00",
    price: 850000,
    duration: "1j 00m",
    class: "economy",
  },
];

export interface SearchFlightsParams {
  origin: string;
  destination: string;
  maxPrice?: number;
}

export function searchFlightsData({
  origin,
  destination,
  maxPrice,
}: SearchFlightsParams): Flight[] {
  const normOrigin = origin.toLowerCase().trim();
  const normDest = destination.toLowerCase().trim();

  return MOCK_FLIGHTS.filter((flight) => {
    const matchOrigin = flight.origin.toLowerCase().includes(normOrigin);
    const matchDest = flight.destination.toLowerCase().includes(normDest);
    const matchPrice = maxPrice !== undefined ? flight.price <= maxPrice : true;

    return matchOrigin && matchDest && matchPrice;
  });
}

export function getFlightById(flightId: string): Flight | undefined {
  const normId = flightId.toLowerCase().trim();
  return MOCK_FLIGHTS.find(
    (f) =>
      f.id.toLowerCase() === normId || f.flightNumber.toLowerCase() === normId,
  );
}

export function generateSeatsForFlight(flightId: string): Seat[] {
  const seats: Seat[] = [];
  const columns = ["A", "B", "C", "D", "E", "F"];
  const unavailableRows = [3, 7, 12, 18];

  for (let row = 1; row <= 10; row++) {
    for (const col of columns) {
      const isUnavailable =
        unavailableRows.includes(row) && (col === "A" || col === "C");
      seats.push({
        id: `${row}${col}`,
        row,
        column: col,
        available: !isUnavailable,
        type:
          col === "A" || col === "F"
            ? "window"
            : col === "C" || col === "D"
              ? "aisle"
              : "middle",
      });
    }
  }

  return seats;
}

export interface CreateBookingParams {
  flightId: string;
  seatId: string;
  passengerName: string;
  paymentMethod?: string;
}
