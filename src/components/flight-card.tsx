"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Flight } from "@/types/flight";

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="w-full" data-testid="flight-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{flight.airline}</CardTitle>
          <Badge
            variant={flight.class === "business" ? "default" : "secondary"}
          >
            {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{flight.departureTime}</span>
            <span className="text-sm text-muted-foreground">
              {flight.origin}
            </span>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-xs text-muted-foreground">
              {flight.duration}
            </span>
            <Separator className="w-24 my-1" />
            <span className="text-xs text-muted-foreground">Direct</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{flight.arrivalTime}</span>
            <span className="text-sm text-muted-foreground">
              {flight.destination}
            </span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Harga per orang</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(flight.price)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onSelect?.(flight)}
          data-testid="select-flight-btn"
        >
          Pilih Penerbangan
        </Button>
      </CardFooter>
    </Card>
  );
}
