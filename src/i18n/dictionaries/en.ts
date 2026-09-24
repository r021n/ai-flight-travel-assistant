export const en = {
  meta: {
    title: "AI Flight & Travel Assistant",
    description: "AI-powered flight ticket booking assistant",
  },
  nav: {
    subtitle: "Find flights, pick seats, print e-tickets",
    resetTooltip: "Reset conversation",
    reset: "Reset",
    changeLanguage: "Change language",
  },
  empty: {
    title: "Where do you want to fly?",
    subtitle:
      "Find flights, pick your favorite seat, and issue e-tickets right in the chat.",
    passengerName: "Passenger Name",
    passengerPlaceholder: "Enter passenger name...",
    tryAsking: "Try asking",
  },
  prompts: [
    "Find flights from Jakarta to Bali tomorrow morning, budget 1.5 million",
    "Cheapest tickets from Jakarta to Surabaya",
    "What time does Citilink fly from Jakarta to Bali?",
  ],
  chat: {
    selectFlightHandshake: (
      airline: string,
      flightNumber: string,
      origin: string,
      destination: string,
    ) => `
    I choose flight ${airline} (${flightNumber}) from ${origin} to ${destination}. Please show the seat map for this flight.`,
    selectSeatHandshake: (seatId: string, passengerName: string) =>
      `I choose seat number ${seatId} for passenger ${passengerName}. Please process the reservation and issue the payment receipt.`,
    searchingFlights: "Searching for the best flight schedules...",
    preparingSeatMap: "Preparing seat map...",
    processingBooking: "Processing booking...",
    loadFlightsError: "Failed to load flights:",
    seatMapError: "Failed to display seat map:",
    bookingError: "Failed to process ticket:",
    somethingWentWrong: "Something went wrong",
    aiResponseError: "Failed to load AI response",
    aiResponseFallback:
      "Make sure the GOOGLE_GENERATIVE_AI_API_KEY is filled in .env.local",
    aiTyping: "AI is responding",
    inputPlaceholder: "Search for Jakarta to Bali tickets tomorrow...",
    send: "Send",
    helperText:
      'Click "Select Flight" or a seat number to trigger an AI response',
    simulatePayment: "Simulate payment GA-401 (12A)",
    serverActionConfirmed: "Transaction confirmed via Next.js Server Action",
    serverActionFailed: "Failed to process transaction via Server Action.",
    serverActionError: (message: string) =>
      `An error occurred while calling Server Action: ${message}`,
  },
  flight: {
    perPerson: "Price per person",
    select: "Select Flight",
    direct: "Direct",
    availableCount: (count: number) => `${count} flights available`,
    sortByCheapest: "Sort: Cheapest",
    emptyTitle: "No flight schedules match your criteria.",
    emptyDesc:
      "Try adjusting your origin, destination, or increasing your budget.",
    classes: {
      economy: "Economy",
      business: "Business",
      first: "First",
    },
  },
  seat: {
    titlePrefix: "Select Seat - ",
    legendSelected: "Selected",
    legendAvailable: "Available",
    legendTaken: "Taken",
    seatLabel: "Seat",
    types: {
      window: "Window",
      aisle: "Aisle",
      middle: "Middle",
    },
    continue: "Continue to Payment",
  },
  receipt: {
    title: "Booking Confirmation",
    airline: "Airline",
    flightNumber: "Flight Number",
    route: "Route",
    time: "Time",
    duration: "Duration",
    passenger: "Passenger",
    seat: "Seat",
    seatType: "Seat Type",
    paymentMethod: "Payment Method",
    bookingDate: "Booking Date",
    total: "Total",
    seatTypes: {
      window: "Window",
      aisle: "Aisle",
      middle: "Middle",
    },
  },
  server: {
    incompleteData:
      "Incomplete reservation data: flightId, seatId, and passengerName are required.",
    flightNotFound: (flightId: string) =>
      `Flight with code ${flightId} was not found or could not be processed`,
    internalError: "An internal server error occurred",
  },
  api: {
    invalidPayload:
      "Invalid payload: messages is required and must be an array.",
    missingApiKey:
      "GOOGLE_GENERATIVE_AI_API_KEY is not configured. Please set your API Key in the .env.local file from Google AI Studio.",
    internalError: "An internal server error occurred while processing chat.",
  },
  tools: {
    searchFlightsDesc:
      "Search flight schedules and ticket prices based on origin city, destination city, and price budget (optional).",
    selectFlightDesc:
      "Select a specific flight by flightId to view flight details and available seat map.",
    bookFlightDesc:
      "Confirm a flight ticket reservation with flight ID, selected seat number, and passenger full name",
    flightNotFound: (flightId: string) =>
      `Flight with ID '${flightId}' was not found.`,
    bookingFailed: (flightId: string) =>
      `Failed to process booking for flight '${flightId}'.`,
  },
  ai: {
    systemPrompt: `You are a professional and friendly AI Flight & Travel Assistant.
Your task is to help users search for flight tickets, choose flight seats, and complete travel ticket reservations.
Use the available tools when the user requests information or performs an action:
- Use the 'searchFlights' tool when the user searches for tickets or flight routes.
- Use the 'selectFlight' tool when the user chooses a specific flight to view the seat map.
- Use the 'bookFlight' tool when the user confirms a seat number and wants to book a ticket.
Always provide polite, clear, and helpful responses in English.`,
  },
};

export type Dictionary = typeof en;
