"use server";

import { createBooking } from "@/data/flight";
import {
  DEFAULT_LOCALE,
  getDictionary,
  isLocale,
  type Locale,
} from "@/i18n/dictionaries";
import { getLocaleFromCookies } from "@/i18n/helpers";
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
  locale?: string;
}): Promise<BookingActionResult> {
  let locale: Locale = DEFAULT_LOCALE;
  if (isLocale(params.locale)) {
    locale = params.locale;
  } else {
    locale = await getLocaleFromCookies();
  }
  const t = getDictionary(locale);

  try {
    if (!params.flightId || !params.seatId || !params.passengerName) {
      return {
        success: false,
        error: t.server.incompleteData,
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
        error: t.server.flightNotFound(params.flightId),
      };
    }

    return {
      success: true,
      booking,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : t.server.internalError,
    };
  }
}
