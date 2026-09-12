import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../route";

vi.mock("@ai-sdk/google", () => ({
  google: vi.fn((modelId: string) => ({
    modelId,
    provider: "google",
  })),
}));

vi.mock("ai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("ai")>();
  return {
    ...actual,
    isStepCount: vi.fn((count: number) => `isStepCount(${count})`),
    streamText: vi.fn(() => ({
      toUIMessageStreamResponse: vi.fn(
        () =>
          new Response('0:"Halo! Ada yang bisa saya bantu?"\n', {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "x-vercel-ai-ui-message-stream": "v1",
            },
          }),
      ),
    })),
  };
});

describe("Phase 2 - API Route /api/chat Integration Test", () => {
  const originalEnv = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalEnv;
  });

  it("harus mengembalikan status 400 jika payload messages tidak valid", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain("Payload tidak valid");
  });

  it("harus mengembalikan status 401 jika GOOGLE_GENERATIVE_AI_API_KEY belum diset", async () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "halo" }],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.error).toContain(
      "GOOGLE_GENERATIVE_AI_API_KEY belum dikonfigurasi",
    );
  });
});
