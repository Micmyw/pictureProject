import type { AiProviderAdapter } from "@/lib/ai/types";

const mockUrl = "https://placehold.co/1024x1024/png";

export const mockProvider: AiProviderAdapter = {
  key: "mock",
  async runImageGeneration() {
    return {
      outputUrls: [mockUrl],
      metadata: { provider: "mock" }
    };
  },
  async runBackgroundRemoval() {
    return {
      outputUrls: [mockUrl],
      metadata: { provider: "mock" }
    };
  }
};
