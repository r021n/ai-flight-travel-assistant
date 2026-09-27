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
import { Plane } from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { formatCurrency, formatDuration } from "@/i18n/helpers";
import type { Flight } from "@/types/flight";

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const { locale, t } = useLanguage();

  return (
    <Card
      className="w-full hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all"
      data-testid="flight-card"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {flight.airline}
          </CardTitle>
          <Badge
            variant={flight.class === "business" ? "default" : "secondary"}
            className="rounded-full"
          >
            {t.flight.classes[flight.class]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold tracking-tight">
              {flight.departureTime}
            </span>
            <span className="text-sm text-muted-foreground">
              {flight.origin}
            </span>
          </div>
          <div className="flex flex-col items-center flex-1 px-4">
            <span className="text-xs text-muted-foreground">
              {formatDuration(flight.duration, locale)}
            </span>
            <div className="relative w-full flex items-center justify-center my-1.5">
              <div className="w-full h-px bg-border" />
              <Plane className="absolute h-3.5 w-3.5 text-primary bg-card px-0.5" />
            </div>
            <span className="text-xs font-medium text-primary">
              {t.flight.direct}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold tracking-tight">
              {flight.arrivalTime}
            </span>
            <span className="text-sm text-muted-foreground">
              {flight.destination}
            </span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {t.flight.perPerson}
          </span>
          <span className="text-lg font-bold text-primary tracking-tight">
            {formatCurrency(flight.price, locale)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full rounded-xl"
          onClick={() => onSelect?.(flight)}
          data-testid="select-flight-btn"
        >
          {t.flight.select}
        </Button>
      </CardFooter>
    </Card>
  );
}
