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
  "Cari penerbangan Jakarta ke Bali besok pagi, budget 1.5 juta",
  "Tiket Jakarta ke Surabaya paling murah",
  "Jam penerbangan Citilink Jakarta ke Bali?",
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
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* Header App */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/20">
              <Plane className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight sm:text-base">
                AI Flight & Travel Assistant
              </h1>
              <p className="hidden sm:block text-[11px] text-muted-foreground leading-none mt-0.5">
                Cari tiket, pilih kursi, cetak e-tiket
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-muted/70 px-2.5 py-1 rounded-full border border-border/60 text-xs">
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-foreground">
                {passengerName}
              </span>
            </div>

            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMessages([]);
                  setServerActionResult(null);
                }}
                className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                title="Reset percakapan"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Area Chat */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 flex flex-col space-y-4">
        {/* Tampilan Chat Saat Kosong */}
        {messages.length === 0 && !serverActionResult && (
          <div className="flex flex-col items-center justify-center my-auto py-10 text-center">
            {/* <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground mb-5 shadow-lg shadow-primary/25">
              <Plane className="h-8 w-8" />
            </div> */}
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Mau terbang ke mana?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mt-2 leading-relaxed">
              Cari penerbangan, pilih kursi favorit, dan terbitkan e-tiket
              langsung di dalam obrolan.
            </p>

            {/* Konfigurasi Nama Penumpang */}
            <div className="mt-8 w-full max-w-sm bg-card border border-border/70 rounded-2xl p-4 shadow-xs text-left">
              <label
                htmlFor="passenger-name-input"
                className="text-xs font-medium text-muted-foreground block mb-2"
              >
                Nama Penumpang
              </label>
              <Input
                id="passenger-name-input"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="Masukkan nama penumpang..."
                className="text-sm h-9"
                data-testid="passenger-name-input"
              />
            </div>

            {/* Tombol Saran Prompt */}
            <div className="mt-6 w-full max-w-md space-y-2">
              <p className="text-xs font-medium text-muted-foreground text-center">
                Coba tanyakan langsung
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTED_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(promptText)}
                    className="text-left text-xs sm:text-sm px-4 py-3 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:bg-accent/50 transition-all shadow-xs flex items-center justify-between group gap-3"
                    data-testid={`prompt-chip-${idx}`}
                  >
                    <span className="text-foreground/90">{promptText}</span>
                    <Send className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Daftar Obrolan */}
        <div className="space-y-5 flex-1">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.role}`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`flex flex-col space-y-3 max-w-[85%] sm:max-w-xl ${isUser ? "items-end" : "items-start"}`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      if (!part.text.trim()) return null;
                      return (
                        <div
                          key={index}
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isUser ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border/70 text-card-foreground shadow-xs rounded-bl-md"}`}
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
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
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
                          <div
                            key={callId}
                            className="w-full rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive flex items-center gap-2"
                          >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>
                              Gagal memuat penerbangan:{" "}
                              {part.errorText || "Terjadi kesalahan"}
                            </span>
                          </div>
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
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                              <span>Menyiapkan denah kursi...</span>
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
                          <div
                            key={callId}
                            className="w-full rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive flex items-center gap-2"
                          >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>
                              Gagal menampilkan denah kursi:{" "}
                              {part.errorText || "Terjadi Kesalahan"}
                            </span>
                          </div>
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
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                              <span>Memproses pemesanan...</span>
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
                          <div
                            key={callId}
                            className="w-full rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive flex items-center gap-2"
                          >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>
                              Gagal memproses tiket:{" "}
                              {part.errorText || "Terjadi kesalahan"}
                            </span>
                          </div>
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

          {/* Tampilan Direct Server Action */}
          {serverActionResult && (
            <div
              className="space-y-2 pt-4 border-t border-dashed border-border"
              data-testid="server-action-receipt-container"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  Transaksi Dikonfirmasi melalui Next.js Server Action
                </span>
              </div>
              <BookingReceipt receipt={serverActionResult} />
            </div>
          )}

          {/* Indikator AI Berpikir */}
          {isLoading && (
            <div className="flex gap-2.5 items-center text-muted-foreground text-xs pl-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="animate-pulse">AI sedang merespon</span>
                <span className="flex gap-0.5">
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          {/* Banner Error */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-start gap-3 text-destructive text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-xs">Gagal memuat respon AI</p>
                <p className="text-xs opacity-90">
                  {error.message ||
                    "Pastikan API Key GOOGLE_GENERATIVE_AI_API_KEY telah diisi di .env.local"}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <footer className="sticky bottom-0 z-20 border-t border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto p-4 sm:px-6 space-y-2">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2"
            data-testid="chat-form"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Cari tiket Jakarta ke Bali besok..."
              disabled={isLoading}
              className="flex-1 text-sm h-11 rounded-xl bg-muted/50 border-border/70 focus:bg-background"
              data-testid="chat-input"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-11 w-11 sm:w-auto sm:px-5 rounded-xl gap-2"
              data-testid="send-btn"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Kirim</span>
            </Button>
          </form>

          {/* Helper Pengujian Server Action */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span className="hidden sm:inline">
              Klik &quot;Pilih Penerbangan&quot; atau nomor kursi untuk memicu
              respon AI
            </span>
            <button
              type="button"
              onClick={() => handleDirectServerActionBooking("GA-401", "12A")}
              disabled={isProcessingAction}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 shrink-0 ml-auto"
              data-testid="test-server-action-btn"
            >
              <CreditCard className="h-3 w-3" />
              <span>Simulasi Bayar GA-401 (12A)</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
