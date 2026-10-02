import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../route";

const { createOpenRouterMock, openrouterModelMock } = vi.hoisted(() => {
  const openrouterModelMock = vi.fn((modelId: string) => ({
    modelId,
    provider: "openrouter",
  }));
  const createOpenRouterMock = vi.fn(() => openrouterModelMock);
  return { createOpenRouterMock, openrouterModelMock };
});

vi.mock("@openrouter/ai-sdk-provider", () => ({
  createOpenRouter: createOpenRouterMock,
}));

vi.mock("ai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("ai")>();
  return {
    ...actual,
    isStepCount: vi.fn((count: number) => `isStepCount(${count})`),
    streamText: vi.fn(() => ({
      stream: { pipeThrough: vi.fn() },
    })),
    toUIMessageStream: vi.fn(() => ({ pipeThrough: vi.fn() })),
    createUIMessageStreamResponse: vi.fn(
      () =>
        new Response('0:"Halo! Ada yang bisa saya bantu?"\n', {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "x-vercel-ai-ui-message-stream": "v1",
          },
        }),
    ),
  };
});

describe("Phase 2 - API Route /api/chat Integration Test", () => {
  const originalApiKey = process.env.OPENROUTER_API_KEY;
  const originalModel = process.env.OPENROUTER_MODEL;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.OPENROUTER_MODEL;
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.OPENROUTER_API_KEY;
    } else {
      process.env.OPENROUTER_API_KEY = originalApiKey;
    }
    if (originalModel === undefined) {
      delete process.env.OPENROUTER_MODEL;
    } else {
      process.env.OPENROUTER_MODEL = originalModel;
    }
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
    expect(data.error).toContain("Invalid payload");
  });

  it("harus mengembalikan status 401 jika OPENROUTER_API_KEY belum diset", async () => {
    delete process.env.OPENROUTER_API_KEY;

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
    expect(data.error).toContain("OPENROUTER_API_KEY is not configured");
  });

  it("harus mengembalikan status 401 jika OPENROUTER_API_KEY masih placeholder", async () => {
    process.env.OPENROUTER_API_KEY = "your-openrouter-api-key-here";

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
    expect(data.error).toContain("OPENROUTER_API_KEY is not configured");
    expect(createOpenRouterMock).not.toHaveBeenCalled();
  });

  it("harus memanggil streamText dengan model OpenRouter dan tools yang sesuai", async () => {
    process.env.OPENROUTER_API_KEY = "dummy-openrouter-api-key";

    const { streamText } = await import("ai");

    const messages = [
      {
        role: "user",
        content:
          "Cari penerbangan dari Jakarta ke Bali besok pagi, budget di bawah 1.5 juta",
      },
    ];

    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    expect(createOpenRouterMock).toHaveBeenCalledWith({
      apiKey: "dummy-openrouter-api-key",
    });
    expect(openrouterModelMock).toHaveBeenCalledWith(
      "google/gemma-4-31b-it",
    );

    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: { modelId: "google/gemma-4-31b-it", provider: "openrouter" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Cari penerbangan dari Jakarta ke Bali besok pagi, budget di bawah 1.5 juta",
              },
            ],
          },
        ],
        stopWhen: "isStepCount(5)",
        tools: expect.objectContaining({
          searchFlights: expect.any(Object),
          selectFlight: expect.any(Object),
          bookFlight: expect.any(Object),
        }),
      }),
    );
  });

  it("harus memakai model dari env OPENROUTER_MODEL jika diset", async () => {
    process.env.OPENROUTER_API_KEY = "dummy-openrouter-api-key";
    process.env.OPENROUTER_MODEL = "openai/gpt-4o";

    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "halo" }],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    expect(openrouterModelMock).toHaveBeenCalledWith("openai/gpt-4o");
  });
});
