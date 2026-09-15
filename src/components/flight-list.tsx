"use client";

import { FlightCard } from "./flight-card";
import type { Flight } from "@/types/flight";
import { Plane } from "lucide-react";

interface FlightListCardProps {
  flights: Flight[];
  onSelectFlight?: (flight: Flight) => void;
  title?: string;
}

export function FlightListCard({
  flights,
  onSelectFlight,
  title,
}: FlightListCardProps) {
  if (!flights || flights.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed p-6 text-center text-muted-foreground"
        data-testid="flight-list-empty"
      >
        <Plane className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm font-medium">
          Tidak ada jadwal penerbangan yang sesuai kriteria.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Coba sesuaikan rute asal, tujuan, atau tingkatkan batas anggaran harga
          anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full" data-testid="flight-list-card">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">
            {title || `Tersedia ${flights.length} Pilihan Penerbangan`}
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Urutkan: Harga Termurah
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-1">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={onSelectFlight}
          />
        ))}
      </div>
    </div>
  );
}
