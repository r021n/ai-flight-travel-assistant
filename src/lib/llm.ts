import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const DEFAULT_OPENROUTER_MODEL = "google/gemma-4-31b-it";

export const OPENROUTER_API_KEY_PLACEHOLDER = "your-openrouter-api-key-here";

export function getOpenRouterApiKey(): string | null {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey || apiKey === OPENROUTER_API_KEY_PLACEHOLDER) {
    return null;
  }
  return apiKey;
}

export function getOpenRouterModel(): string {
  const model = process.env.OPENROUTER_MODEL?.trim();
  return model || DEFAULT_OPENROUTER_MODEL;
}

export function createChatModel(apiKey: string) {
  const openrouter = createOpenRouter({ apiKey });
  return openrouter(getOpenRouterModel());
}
