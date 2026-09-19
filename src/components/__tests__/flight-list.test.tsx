import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FlightListCard } from "../flight-list";
import { MOCK_FLIGHTS } from "@/data/flight";

describe("Phase 3 - FlightListCard Component", () => {
  it("harus merender daftar penerbangan yang diberikan", () => {
    const flights = MOCK_FLIGHTS.slice(0, 2);
    render(<FlightListCard flights={flights} />);

    expect(screen.getByTestId("flight-list-card")).toBeInTheDocument();
    expect(screen.getAllByText("Garuda Indonesia").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("flight-card")).toHaveLength(2);
  });

  it("harus memanggil callback onSelectFlight saat tombol 'Pilih Penerbangan' diklik", () => {
    const handleSelect = vi.fn();
    const flights = [MOCK_FLIGHTS[0]];

    render(<FlightListCard flights={flights} onSelectFlight={handleSelect} />);

    const selectButton = screen.getByTestId("select-flight-btn");
    fireEvent.click(selectButton);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(MOCK_FLIGHTS[0]);
  });

  it("harus merender pesan kosong jika daftar penerbangan kosong", () => {
    render(<FlightListCard flights={[]} />);

    expect(screen.getByTestId("flight-list-empty")).toBeInTheDocument();
    expect(
      screen.getByText(/Tidak ada jadwal penerbangan yang sesuai kriteria/i),
    ).toBeInTheDocument();
  });
});
