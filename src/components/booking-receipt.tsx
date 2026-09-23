"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CheckCircle2 } from "lucide-react";
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
    <Card
      className="w-full overflow-hidden"
      data-testid="booking-receipt"
    >
      <CardHeader className="border-b border-dashed border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">
              Bukti Pemesanan
            </CardTitle>
          </div>
          <Badge variant={getStatusVariant(receipt.status)} className="rounded-full">
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
            <span className="text-sm text-muted-foreground">Maskapai</span>
            <span className="text-sm font-medium">{receipt.flight.airline}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Nomor Penerbangan
            </span>
            <span className="text-sm font-medium">
              {receipt.flight.flightNumber}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rute</span>
            <span className="text-sm font-medium">
              {receipt.flight.origin} → {receipt.flight.destination}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Waktu</span>
            <span className="text-sm font-medium">
              {receipt.flight.departureTime} - {receipt.flight.arrivalTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Durasi</span>
            <span className="text-sm font-medium">
              {receipt.flight.duration}
            </span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Penumpang</span>
            <span className="text-sm font-medium">
              {receipt.passengerName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Kursi</span>
            <span className="text-sm font-medium">{receipt.seat.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tipe Kursi</span>
            <span className="text-sm font-medium">
              {receipt.seat.type === "window"
                ? "Jendela"
                : receipt.seat.type === "aisle"
                  ? "Lorong"
                  : "Tengah"}
            </span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Metode Pembayaran
            </span>
            <span className="text-sm font-medium">
              {receipt.paymentMethod}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Tanggal Pemesanan
            </span>
            <span className="text-sm font-medium">{receipt.bookingDate}</span>
          </div>
        </div>
      </CardContent>
      <div className="px-(--card-spacing) pb-(--card-spacing) -mt-1">
        <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-lg font-bold text-primary tracking-tight">
            {formatPrice(receipt.totalPrice)}
          </span>
        </div>
      </div>
    </Card>
  );
}
