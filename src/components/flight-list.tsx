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
        className="rounded-2xl border border-dashed border-border p-6 text-center"
        data-testid="flight-list-empty"
      >
        <div className="mx-auto h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-3">
          <Plane className="h-5 w-5 text-muted-foreground" />
        </div>
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
    <div className="space-y-3 w-full" data-testid="flight-list-card">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
            <Plane className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold">
            {title || `Tersedia ${flights.length} pilihan penerbangan`}
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Urutkan: Termurah
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
