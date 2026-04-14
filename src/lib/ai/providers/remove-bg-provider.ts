import "server-only";

import type { AiProviderAdapter } from "@/lib/ai/types";
import { getServerEnv } from "@/lib/config";

export const removeBgProvider: AiProviderAdapter = {
  key: "remove-bg",
  async runBackgroundRemoval(input) {
    const env = getServerEnv();
    const formData = new FormData();
    formData.append("image_url", input.storagePath);

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": env.REMOVE_BG_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error("Background removal failed");
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      outputUrls: [`data:image/png;base64,${base64}`],
      metadata: {
        provider: "remove-bg"
      }
    };
  }
};
