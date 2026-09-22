import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../page";
import {
  MOCK_FLIGHTS,
  createBooking,
  generateSeatsForFlight,
} from "@/data/flight";
import type { UIMessage } from "ai";

const mockSendMessage = vi.fn();
const mockSetMessages = vi.fn();
let mockMessages: UIMessage[] = [];
let mockStatus = "ready";
let mockError: Error | undefined = undefined;

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockMessages,
    sendMessage: mockSendMessage,
    setMessages: mockSetMessages,
    status: mockStatus,
    error: mockError,
  }),
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("Phase 3 - Home Page (Generative UI Chat Interface)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMessages = [];
    mockStatus = "ready";
    mockError = undefined;
  });

  it("harus merender header, nama penumpang, dan saran prompt saat pertama kali dimuat", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /AI Flight & Travel Assistant/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("passenger-name-input")).toHaveValue(
      "Budi Santoso",
    );
    expect(screen.getByTestId("prompt-chip-0")).toBeInTheDocument();
    expect(screen.getByTestId("chat-input")).toBeInTheDocument();
  });

  it("harus memanggil sendMessage saat prompt chip diklik", () => {
    render(<Home />);

    const chip = screen.getByTestId("prompt-chip-0");
    fireEvent.click(chip);

    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith({
      text: expect.stringContaining("Jakarta ke Bali"),
    });
  });

  it("harus merender teks pesan percakapan user dan assistant", () => {
    mockMessages = [
      {
        id: "msg-1",
        role: "user",
        parts: [{ type: "text", text: "Halo AI!" }],
      },
      {
        id: "msg-2",
        role: "assistant",
        parts: [{ type: "text", text: "Halo! Ada yang bisa saya bantu?" }],
      },
    ];

    render(<Home />);

    expect(screen.getByText("Halo AI!")).toBeInTheDocument();
    expect(
      screen.getByText("Halo! Ada yang bisa saya bantu?"),
    ).toBeInTheDocument();
  });

  it("harus merender FlightCardSkeleton saat tombol searchFlights berstatus input-streaming", () => {
    mockMessages = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          {
            type: "tool-searchFlights",
            toolCallId: "call-1",
            state: "input-streaming",
            input: { origin: "Jakarta", destination: "Bali" },
          },
        ],
      },
    ];

    render(<Home />);

    expect(screen.getByTestId("flight-skeleton")).toBeInTheDocument();
    expect(
      screen.getByText(/Mencari jadwal penerbangan terbaik/i),
    ).toBeInTheDocument();
  });

  it("harus merender FlightListCard dan memicu handshake interaktif saat 'Pilih Penerbangan' diklik", () => {
    mockMessages = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          {
            type: "tool-searchFlights",
            toolCallId: "call-1",
            state: "output-available",
            input: { origin: "Jakarta", destination: "Bali" },
            output: {
              success: true,
              flights: [MOCK_FLIGHTS[0]],
            },
          },
        ],
      },
    ];

    render(<Home />);

    expect(screen.getByTestId("flight-list-card")).toBeInTheDocument();
    expect(screen.getByText("Garuda Indonesia")).toBeInTheDocument();

    const selectBtn = screen.getByTestId("select-flight-btn");
    fireEvent.click(selectBtn);

    expect(mockSendMessage).toHaveBeenCalledWith({
      text: expect.stringContaining("GA-401"),
    });
  });

  it("harus merender SeatPicker saat tool selectFlight berstatus output-available", () => {
    mockMessages = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          {
            type: "tool-selectFlight",
            toolCallId: "call-2",
            state: "output-available",
            input: { flightId: "GA-401" },
            output: {
              success: true,
              flight: MOCK_FLIGHTS[0],
              seats: generateSeatsForFlight("GA-401"),
            },
          },
        ],
      },
    ];

    render(<Home />);

    expect(screen.getByTestId("seat-picker")).toBeInTheDocument();
    expect(screen.getByText(/Pilih Kursi - GA-401/i)).toBeInTheDocument();
  });

  it("harus merender BookingReceipt saat tool bookFlight berstatus output-available", () => {
    const mockBooking = createBooking({
      flightId: "GA-401",
      seatId: "12A",
      passengerName: "Budi Santoso",
    });

    mockMessages = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          {
            type: "tool-bookFlight",
            toolCallId: "call-3",
            state: "output-available",
            input: {
              flightId: "GA-401",
              seatId: "12A",
              passengerName: "Budi Santoso",
            },
            output: {
              success: true,
              booking: mockBooking,
            },
          },
        ],
      },
    ];

    render(<Home />);

    expect(screen.getByTestId("booking-receipt")).toBeInTheDocument();
    expect(screen.getByText("Bukti Pemesanan")).toBeInTheDocument();
    expect(screen.getAllByText(/GA-401/i).length).toBeGreaterThan(0);
  });

  it("harus mengeksekusi Server Action saat tombol simulasi diklik", async () => {
    render(<Home />);

    const serverActionBtn = screen.getByTestId("test-server-action-btn");
    fireEvent.click(serverActionBtn);

    await waitFor(() => {
      expect(
        screen.getByTestId("server-action-receipt-container"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Transaksi Dikonfirmasi melalui Next.js Server Action/i),
    ).toBeInTheDocument();
  });
});
