import { google } from "@ai-sdk/google";
import {
  streamText,
  isStepCount,
  createUIMessageStreamResponse,
  toUIMessageStream,
  convertToModelMessages,
} from "ai";
import { travelTools } from "@/lib/tools";

export const maxDuration = 30;

function toUIMessages(messages: unknown[]) {
  return messages.map((raw) => {
    const message = raw as {
      role?: string;
      content?: unknown;
      parts?: unknown[];
      id?: string;
    };

    if (Array.isArray(message.parts)) {
      return message;
    }

    const role = message.role;
    const content = message.content;

    if (typeof content === "string") {
      return {
        ...(message.id ? { id: message.id } : {}),
        role,
        parts: [{ type: "text", text: content }],
      };
    }

    if (Array.isArray(content)) {
      const parts = content.map((block) => {
        if (typeof block === "string") {
          return { type: "text", text: block };
        }
        if (
          block &&
          typeof block === "object" &&
          "type" in block &&
          (block as { type: string }).type === "text"
        ) {
          return {
            type: "text",
            text: String((block as { text?: unknown }).text ?? ""),
          };
        }
        return null;
      });

      return {
        ...(message.id ? { id: message.id } : {}),
        role,
        parts: parts.filter(Boolean),
      };
    }

    return message;
  });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error:
            "Payload tidak valid: messages diperlukan dan harus berupa array.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey === "your-google-ai-studio-api-key-here") {
      return new Response(
        JSON.stringify({
          error:
            "GOOGLE_GENERATIVE_AI_API_KEY belum dikonfigurasi. Silakan isi API Key Anda di file .env.local dari Google AI Studio.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const modelMessages = await convertToModelMessages(
      toUIMessages(messages) as Parameters<typeof convertToModelMessages>[0],
    );

    const result = streamText({
      model: google("gemma-4-31b-it"),
      instructions: `Anda adalah AI Flight & Travel Assistant profesional dan ramah berbahasa Indonesia.
Tugas Anda adalah membantu pengguna mencari tiket pesawat, memilih kursi penerbangan, dan menyelesaikan reservasi tiket perjalanan.
Gunakan tools yang tersedia saat pengguna meminta informasi atau melakukan aksi:
- Gunakan tool 'searchFlights' ketika pengguna mencari tiket atau rute penerbangan.
- Gunakan tool 'selectFlight' ketika pengguna memilih penerbangan tertentu untuk melihat denah kursi (seat map).
- Gunakan tool 'bookFlight' saat pengguna mengonfirmasi nomor kursi dan ingin memesan tiket.
Selalu berikan respon yang sopan, jelas, dan membantu dalam bahasa Indonesia.`,
      messages: modelMessages,
      tools: travelTools,
      stopWhen: isStepCount(5),
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("Error pada /api/chat:", error);
    return new Response(
      JSON.stringify({
        error: "Terjadi kesalahan internal pada server saat memproses chat.",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
