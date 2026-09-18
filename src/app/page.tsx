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
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold sm:text-lg">
                  AI Flight & Travel Assistant
                </h1>
                <Badge variant="secondary" className="text-xs">
                  Phase 3 GenUI
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Model: Gemma 4 (<code>gemma-4-31b-it</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-lg border text-xs">
              <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Penumpang:</span>
              <span className="font-semibold text-foreground">
                {passengerName}
              </span>
            </div>

            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMessages([]);
                  setServerActionResult(null);
                }}
                className="text-xs gap-1.5"
                title="Reset percakapan"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Chat</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Area Chat */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col space-y-4">
        {/* Tampilan Chat Saat Kosong */}
        {messages.length === 0 && !serverActionResult && (
          <div className="flex flex-col items-center justify-center my-auto py-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Plane className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Selamat Datang di AI Travel Assistant
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mt-2">
              Asisten pintar pemesanan tiket pesawat interaktif berbasis{" "}
              <strong>Generative UI</strong>. Cari penerbangan, pilih kursi
              favorit, dan terbitkan e-tiket langsung di dalam obrolan.
            </p>

            {/* Konfigurasi Nama Penumpang */}
            <div className="mt-6 w-full max-w-md bg-card border rounded-xl p-4 shadow-sm text-left">
              <label
                htmlFor="passenger-name-input"
                className="text-xs font-semibold text-muted-foreground block mb-1.5"
              >
                Konfigurasi Nama Penumpang untuk Pemesanan:
              </label>
              <div className="flex gap-2">
                <Input
                  id="passenger-name-input"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="Masukkan nama penumpang..."
                  className="text-sm"
                  data-testid="passenger-name-input"
                />
              </div>
            </div>

            {/* Tombol Saran Prompt */}
            <div className="mt-6 w-full max-w-lg space-y-2">
              <p className="text-xs font-medium text-muted-foreground text-center">
                Coba tanyakan langsung:
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTED_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(promptText)}
                    className="text-left text-xs sm:text-sm p-3 rounded-lg border bg-card hover:bg-muted/80 transition-colors shadow-xs flex items-center justify-between group"
                    data-testid={`prompt-chip-${idx}`}
                  >
                    <span>{promptText}</span>
                    <Send className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Daftar Obrolan */}
        <div className="space-y-6 flex-1">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.role}`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 border flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`flex flex-col space-y-3 max-w-[85%] sm:max-w-2xl ${isUser ? "items-end" : "items-start"}`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      if (!part.text.trim()) return null;
                      return (
                        <div
                          key={index}
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isUser ? "bg-primary text-primary-foreground rounded-br-xs " : "bg-card border text-card-foreground shadow-xs rounded-bl-xs"}`}
                        >
                          <p className="whitespace-pre-wrap">{part.text}</p>
                        </div>
                      );
                    }

                    if (part.type === "tool-searchFlights") {
                      const callId = part.toolCallId || `search-${index}`;

                      if (
                        part.state === "input-streaming" ||
                        part.state === "input-available"
                      ) {
                        return (
                          <div key={callId} className="w-full space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                              <span>Mencari jadwal penerbangan terbaik...</span>
                            </div>
                            <FlightCardSkeleton />
                          </div>
                        );
                      }

                      if (part.state === "output-available") {
                        const flights =
                          (part.output as { flights?: Flight[] })?.flights ||
                          [];

                        return (
                          <div key={callId} className="w-full">
                            <FlightListCard
                              flights={flights}
                              onSelectFlight={handleSelectFlight}
                            />
                          </div>
                        );
                      }

                      if (part.state === "output-error") {
                        return (
                          <Card
                            key={callId}
                            className="w-full border-destructive/50 bg-destructive/5"
                          >
                            <CardContent className="p-4 text-xs text-destructive flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 shrink-0" />
                              <span>
                                Gagal memuat penerbangan:{" "}
                                {part.errorText || "Terjadi kesalahan"}
                              </span>
                            </CardContent>
                          </Card>
                        );
                      }
                    }

                    if (part.type === "tool-selectFlight") {
                      const callId = part.toolCallId || `select-${index}`;

                      if (
                        part.state === "input-streaming" ||
                        part.state === "input-available"
                      ) {
                        return (
                          <div key={callId} className="w-full space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                              <span>Menyiapkan denah kursi kabin...</span>
                            </div>
                            <SeatPickerSkeleton />
                          </div>
                        );
                      }

                      if (part.state === "output-available") {
                        const out = part.output as {
                          flight?: Flight;
                          seats?: Seat[];
                        };
                        const flightId =
                          out?.flight?.id ||
                          (part.input as { flightId?: string })?.flightId ||
                          "GA-401";

                        return (
                          <div key={callId} className="w-full">
                            <SeatPicker
                              flightId={flightId}
                              seats={out?.seats}
                              onSelectSeat={handleSelectSeat}
                            />
                          </div>
                        );
                      }

                      if (part.state === "output-error") {
                        return (
                          <Card
                            key={callId}
                            className="w-full border-destructive/50 bg-destructive/5"
                          >
                            <CardContent className="p-4 text-xs text-destructive flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 shrink-0" />
                              <span>
                                Gagal menampilkan denah kursi:{" "}
                                {part.errorText || "Terjadi Kesalahan"}
                              </span>
                            </CardContent>
                          </Card>
                        );
                      }
                    }

                    if (part.type === "tool-bookFlight") {
                      const callId = part.toolCallId || `book-${index}`;

                      if (
                        part.state === "input-streaming" ||
                        part.state === "input-available"
                      ) {
                        return (
                          <div key={callId} className="w-full space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                              <span>
                                Memproses reservasi tiket dan menerbitkan
                                e-tiket...
                              </span>
                            </div>
                            <BookingReceiptSkeleton />
                          </div>
                        );
                      }

                      if (part.state === "output-available") {
                        const booking = (
                          part.output as { booking?: BookingReceiptType }
                        )?.booking;
                        if (!booking) return null;

                        return (
                          <div key={callId} className="w-full">
                            <BookingReceipt receipt={booking} />
                          </div>
                        );
                      }

                      if (part.state === "output-error") {
                        return (
                          <Card
                            key={callId}
                            className="w-full border-destructive/50 bg-destructive/5"
                          >
                            <CardContent className="p-4 text-xs text-destructive flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 shrink-0" />
                              <span>
                                Gagal memproses tiket:{" "}
                                {part.errorText || "Terjadi kesalahan"}
                              </span>
                            </CardContent>
                          </Card>
                        );
                      }
                    }

                    return null;
                  })}
                </div>

                {isUser && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
