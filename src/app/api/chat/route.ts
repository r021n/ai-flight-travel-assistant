import { google } from "@ai-sdk/google";
import { streamText, isStepCount } from "ai";
import { travelTools } from "@/lib/tools";

export const maxDuration = 30;

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

    const result = streamText({
      model: google("gemma-4-31b-it"),
      instructions: `Anda adalah AI Flight & Travel Assistant profesional dan ramah berbahasa Indonesia.
Tugas Anda adalah membantu pengguna mencari tiket pesawat, memilih kursi penerbangan, dan menyelesaikan reservasi tiket perjalanan.
Gunakan tools yang tersedia saat pengguna meminta informasi atau melakukan aksi:
- Gunakan tool 'searchFlights' ketika pengguna mencari tiket atau rute penerbangan.
- Gunakan tool 'selectFlight' ketika pengguna memilih penerbangan tertentu untuk melihat denah kursi (seat map).
- Gunakan tool 'bookFlight' saat pengguna mengonfirmasi nomor kursi dan ingin memesan tiket.
Selalu berikan respon yang sopan, jelas, dan membantu dalam bahasa Indonesia.`,
      messages,
      tools: travelTools,
      stopWhen: isStepCount(5),
    });

    return result.toUIMessageStreamResponse();
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
