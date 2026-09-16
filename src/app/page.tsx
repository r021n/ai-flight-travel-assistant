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
  const [Input, setInput] = useState();
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
}
