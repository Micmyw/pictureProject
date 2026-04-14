import "server-only";

import type { AiProviderAdapter } from "@/lib/ai/types";
import { getServerEnv } from "@/lib/config";

type OpenAiImageResponse = {
  data?: Array<{ url?: string | null }>;
};

export const openAiImageProvider: AiProviderAdapter = {
  key: "openai-image",
  async runImageGeneration(input) {
    const env = getServerEnv();
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: `${input.prompt}. Style: ${input.style}. Aspect ratio: ${input.aspectRatio}.`,
          n: input.outputCount,
          size: input.aspectRatio === "1:1" ? "1024x1024" : "1536x1024"
        })
      }
    );

    if (!response.ok) {
      throw new Error("OpenAI image generation failed");
    }

    const payload = (await response.json()) as OpenAiImageResponse;
    const outputUrls = (payload.data ?? [])
      .map((item) => item.url)
      .filter((url): url is string => Boolean(url));

    if (!outputUrls.length) {
      throw new Error("OpenAI image generation returned no image URLs");
    }

    return {
      outputUrls,
      metadata: {
        provider: "openai-image",
        outputCount: outputUrls.length
      }
    };
  }
};
