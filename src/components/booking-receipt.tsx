"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { formatCurrency } from "@/i18n/helpers";
import type { BookingReceipt as BookingReceiptType } from "@/types/flight";

interface BookingReceiptProps {
  receipt: BookingReceiptType;
}

export function BookingReceipt({ receipt }: BookingReceiptProps) {
  const { locale, t } = useLanguage();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "default";
      case "PENDING":
        return "secondary";
      case "FAILED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="w-full overflow-hidden" data-testid="booking-receipt">
      <CardHeader className="border-b border-dashed border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">
              {t.receipt.title}
            </CardTitle>
          </div>
          <Badge
            variant={getStatusVariant(receipt.status)}
            className="rounded-full"
          >
            {receipt.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          ID: {receipt.bookingId}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.airline}
            </span>
            <span className="text-sm font-medium">
              {receipt.flight.airline}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.flightNumber}
            </span>
            <span className="text-sm font-medium">
              {receipt.flight.flightNumber}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.route}
            </span>
            <span className="text-sm font-medium">
              {receipt.flight.origin} → {receipt.flight.destination}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.time}
            </span>
            <span className="text-sm font-medium">
              {receipt.flight.departureTime} - {receipt.flight.arrivalTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.duration}
            </span>
            <span className="text-sm font-medium">
              {receipt.flight.duration}
            </span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.passenger}
            </span>
            <span className="text-sm font-medium">{receipt.passengerName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.seat}
            </span>
            <span className="text-sm font-medium">{receipt.seat.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.seatType}
            </span>
            <span className="text-sm font-medium">
              {t.receipt.seatTypes[receipt.seat.type]}
            </span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.paymentMethod}
            </span>
            <span className="text-sm font-medium">{receipt.paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t.receipt.bookingDate}
            </span>
            <span className="text-sm font-medium">{receipt.bookingDate}</span>
          </div>
        </div>
      </CardContent>
      <div className="px-(--card-spacing) pb-(--card-spacing) -mt-1">
        <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">{t.receipt.total}</span>
          <span className="text-lg font-bold text-primary tracking-tight">
            {formatCurrency(receipt.totalPrice, locale)}
          </span>
        </div>
      </div>
    </Card>
  );
}
