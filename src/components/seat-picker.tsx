"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import type { Seat } from "@/types/flight";

interface SeatPickerProps {
  flightId: string;
  seats?: Seat[];
  onSelectSeat?: (seat: Seat) => void;
}

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const columns = ["A", "B", "C", "D", "E", "F"];
  const unavailableSeats = [5, 10, 15, 20];

  for (let row = 1; row <= 30; row++) {
    for (const col of columns) {
      seats.push({
        id: `${row}${col}`,
        row,
        column: col,
        available: !unavailableSeats.includes(row) || col !== "A",
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
};

export function SeatPicker({
  flightId,
  seats: initialSeats,
  onSelectSeat,
}: SeatPickerProps) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seats] = useState<Seat[]>(initialSeats || generateSeats());

  const handleSeatClick = (seat: Seat) => {
    if (!seat.available) return;
    setSelectedSeat(seat);
  };

  const handleConfirm = () => {
    if (selectedSeat) {
      onSelectSeat?.(selectedSeat);
    }
  };

  const columns = ["A", "B", "C", "D", "E", "F"];

  return (
    <Card className="w-full" data-testid="seat-picker">
      <CardHeader>
        <CardTitle className="text-lg">Pilih Kursi - {flightId}</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="h-4 w-4 rounded bg-primary" />
          <span>Dipilih</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-muted" />
          <span>Tidak Tersedia</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 text-xs font-medium text-muted-foreground">
            {columns.map((col) => (
              <div key={col} className="w-8 text-center">
                {col}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1"></div>
        </div>
      </CardContent>
    </Card>
  );
}
