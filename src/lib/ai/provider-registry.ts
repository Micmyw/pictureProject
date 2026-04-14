import type { AiProviderAdapter } from "@/lib/ai/types";
import { mockProvider } from "@/lib/ai/providers/mock-provider";
import { openAiImageProvider } from "@/lib/ai/providers/openai-image-provider";
import { removeBgProvider } from "@/lib/ai/providers/remove-bg-provider";

const registry = new Map<string, AiProviderAdapter>([
  [openAiImageProvider.key, openAiImageProvider],
  [removeBgProvider.key, removeBgProvider],
  [mockProvider.key, mockProvider]
]);

export function getProvider(key: string) {
  const provider = registry.get(key);

  if (!provider) {
    throw new Error(`Unknown provider: ${key}`);
  }

  return provider;
}
