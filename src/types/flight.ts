export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  duration: string;
  class: "economy" | "business" | "first";
}

export interface Seat {
  id: string;
  row: number;
  column: string;
  available: boolean;
  type: "window" | "middle" | "aisle";
}

export interface BookingReceipt {
  bookingId: string;
  flight: Flight;
  seat: Seat;
  passangerName: string;
  totalPrice: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  paymentMethod: string;
  bookingDate: string;
}
