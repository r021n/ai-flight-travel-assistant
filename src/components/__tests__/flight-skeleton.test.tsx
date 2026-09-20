import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  FlightCardSkeleton,
  SeatPickerSkeleton,
  BookingReceiptSkeleton,
} from "../flight-skeleton";

describe("Phase 3 - Skeleton Loaders Component", () => {
  it("harus merender FlightCardSkeleton dengan benar", () => {
    render(<FlightCardSkeleton />);
    expect(screen.getByTestId("flight-skeleton")).toBeInTheDocument();
  });

  it("harus merender SeatPickerSkeleton dengan benar", () => {
    render(<SeatPickerSkeleton />);
    expect(screen.getByTestId("seat-skeleton")).toBeInTheDocument();
  });

  it("harus merender BookingReceiptSkeleton dengan benar", () => {
    render(<BookingReceiptSkeleton />);
    expect(screen.getByTestId("receipt-skeleton")).toBeInTheDocument();
  });
});
