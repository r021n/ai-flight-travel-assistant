"user server";

import { createBooking } from "@/data/flight";
import type { BookingReceipt } from "@/types/flight";

export interface BookingActionResult {
  success: boolean;
  booking?: BookingReceipt;
  error?: string;
}

export async function processBookingAction(params: {
  flightId: string;
  seatId: string;
  passengerName: string;
  paymentMethod?: string;
}): Promise<BookingActionResult> {
  try {
    if (!params.flightId || !params.seatId || !params.passengerName) {
      return {
        success: false,
        error:
          "Data reservasi tidak lengkap: flightId, seatId, dan passengerName wajib diisi.",
      };
    }

    const booking = createBooking({
      flightId: params.flightId,
      seatId: params.seatId,
      passengerName: params.passengerName,
      paymentMethod: params.paymentMethod || "QRIS / Instant Bank Transfer",
    });

    if (!booking) {
      return {
        success: false,
        error: `Penerbangan dengan kode ${params.flightId} tidak ditemukan atau gagal diproses`,
      };
    }

    return {
      success: true,
      booking,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan internal pada Server",
    };
  }
}
