"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FlightListCard } from "@/components/flight-list";
import { SeatPicker } from "@/components/seat-picker";
import { BookingReceipt } from "@/components/booking-receipt";
import {
  FlightCardSkeleton,
  SeatPickerSkeleton,
  BookingReceiptSkeleton,
} from "@/components/flight-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { processBookingAction } from "./actions";
import type {
  Flight,
  Seat,
  BookingReceipt as BookingReceiptType,
} from "@/types/flight";
import {
  Plane,
  Send,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  RotateCcw,
  UserCheck,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Cari penerbangan dari Jakarta ke Bali besok pagi, budget di bawah 1.5 juta",
  "Tampilkan tiket pesawat Jakarta ke Surabaya yang paling murah",
  "Penerbangan Citilink Jakarta ke Bali ada jam berapa saja?",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [passengerName, setPassengerName] = useState("Budi Santoso");
  const [serverActionResult, setServerActionResult] =
    useState<BookingReceiptType | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, serverActionResult]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handlePromptClick = (promptText: string) => {
    if (isLoading) return;
    sendMessage({ text: promptText });
  };

  const handleSelectFlight = (flight: Flight) => {
    sendMessage({
      text: `Saya memilih penerbangan ${flight.airline} (${flight.flightNumber}) dari ${flight.origin} ke ${flight.destination}. Mohon tampilkan denah kursi pesawat untuk penerbangan ini.`,
    });
  };

  const handleSelectSeat = async (seat: Seat) => {
    sendMessage({
      text: `Saya memilih kursi nomor ${seat.id} untuk penumpang ${passengerName}. Tolong proses reservasi dan terbitkan bukti pembayarannya.`,
    });
  };

  const handleDirectServerActionBooking = async (
    flightId = "GA-401",
    seatId = "12A",
  ) => {
    try {
      setIsProcessingAction(true);
      const res = await processBookingAction({
        flightId,
        seatId,
        passengerName,
        paymentMethod: "QRIS / Instant Bank Transfer",
      });

      if (res.success && res.booking) {
        setServerActionResult(res.booking);
      } else {
        alert(res.error || "Gagal memproses transaksi via Server Action.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat memanggil Server Action: " + String(error));
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Header App */}
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur px-4 py-3 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Plane className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
