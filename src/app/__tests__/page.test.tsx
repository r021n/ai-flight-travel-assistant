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
});
