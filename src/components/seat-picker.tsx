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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">
            Pilih Kursi - {flightId}
          </CardTitle>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded bg-primary" />
              <span>Dipilih</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded bg-emerald-500" />
              <span>Tersedia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded bg-muted border border-border" />
              <span>Habis</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1 text-xs font-medium text-muted-foreground">
            {columns.map((col) => (
              <div key={col} className="w-8 text-center">
                {col}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((row) => (
              <div key={row} className="flex items-center gap-1">
                <span className="w-6 text-center text-xs font-medium text-muted-foreground">
                  {row}
                </span>
                {columns.map((col) => {
                  const seat = seats.find(
                    (s) => s.row === row && s.column === col,
                  );

                  if (!seat) return null;
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={!seat.available}
                      data-testid={`seat-${seat.id}`}
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                        !seat.available &&
                          "bg-muted text-muted-foreground/60 cursor-not-allowed",
                        seat.available &&
                          selectedSeat?.id !== seat.id &&
                          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white",
                        selectedSeat?.id === seat.id &&
                          "bg-primary text-primary-foreground ring-2 ring-primary/30 scale-105",
                      )}
                    >
                      {seat.id}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {selectedSeat && (
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                Kursi {selectedSeat.id}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedSeat.type === "window"
                  ? "Jendela"
                  : selectedSeat.type === "aisle"
                    ? "Lorong"
                    : "Tengah"}
              </p>
            </div>
            <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {selectedSeat.id}
            </span>
          </div>
        )}
        <Button
          className="w-full mt-4 rounded-xl h-10"
          disabled={!selectedSeat}
          onClick={handleConfirm}
          data-testid="confirm-seat-btn"
        >
          Lanjut Bayar
        </Button>
      </CardContent>
    </Card>
  );
}
