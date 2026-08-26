"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import type { BookingReceipt as BookingReceiptType } from "@/types/flight";

interface BookingReceiptProps {
  receipt: BookingReceiptType;
}

export function BookingReceipt({ receipt }: BookingReceiptProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
    <Card className="w-full" data-testid="booking-receipt">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Bukti Pemesanan</CardTitle>
          <Badge variant={getStatusVariant(receipt.status)}>
            {receipt.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">ID: {receipt.bookingId}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Maskapai</span>
            <span className="font-medium">{receipt.flight.airline}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Nomor Penerbangan
            </span>
            <span className="font-medium">{receipt.flight.flightNumber}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rute</span>
            <span className="font-medium">
              {receipt.flight.origin} → {receipt.flight.destination}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
