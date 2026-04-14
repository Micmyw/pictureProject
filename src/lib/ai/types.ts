export type ImageGenerationInput = {
  prompt: string;
  style: string;
  aspectRatio: string;
  outputCount: number;
};

export type BackgroundRemovalInput = {
  storagePath: string;
};

export type ProviderResult = {
  outputUrls: string[];
  metadata: Record<string, unknown>;
};

export interface AiProviderAdapter {
  key: string;
  runImageGeneration?(input: ImageGenerationInput): Promise<ProviderResult>;
  runBackgroundRemoval?(input: BackgroundRemovalInput): Promise<ProviderResult>;
}
